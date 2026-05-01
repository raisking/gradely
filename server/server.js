const http = require('http');
const crypto = require('crypto');
const { Pool } = require('pg');

const PORT = Number(process.env.PORT || 4000);
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const send = (res, status, payload) => {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': process.env.CLIENT_ORIGIN || 'http://localhost:3001',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  });
  res.end(JSON.stringify(payload));
};

const readBody = (req) => new Promise((resolve, reject) => {
  let data = '';
  req.on('data', chunk => {
    data += chunk;
    if (data.length > 1_000_000) {
      reject(new Error('Request body is too large.'));
      req.destroy();
    }
  });
  req.on('end', () => {
    try {
      resolve(data ? JSON.parse(data) : {});
    } catch {
      reject(new Error('Invalid JSON body.'));
    }
  });
});

const hashPassword = (password, salt = crypto.randomBytes(16).toString('hex')) => {
  const hash = crypto.pbkdf2Sync(String(password), salt, 120000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
};

const verifyPassword = (password, stored) => {
  const [salt, original] = String(stored || '').split(':');
  if (!salt || !original) return false;
  const candidate = hashPassword(password, salt).split(':')[1];
  return crypto.timingSafeEqual(Buffer.from(candidate, 'hex'), Buffer.from(original, 'hex'));
};

const publicUser = (row) => ({
  id: row.id,
  username: row.email,
  name: row.display_name,
  role: row.role,
});

const getLearningState = async (client, userId) => {
  const state = await client.query(
    'SELECT progress_data, stats_data FROM user_learning_state WHERE user_id = $1',
    [userId]
  );
  return {
    progress: state.rows[0]?.progress_data || {},
    stats: state.rows[0]?.stats_data || {},
  };
};

const ensureLearningStateTable = async (client) => {
  await client.query(`
    CREATE TABLE IF NOT EXISTS user_learning_state (
      user_id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      progress_data jsonb NOT NULL DEFAULT '{}'::jsonb,
      stats_data jsonb NOT NULL DEFAULT '{}'::jsonb,
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `);
};

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') return send(res, 204, {});

  try {
    if (!process.env.DATABASE_URL) {
      return send(res, 503, { error: 'DATABASE_URL is required for database persistence.' });
    }

    const url = new URL(req.url, `http://${req.headers.host}`);
    const body = ['POST', 'PUT'].includes(req.method) ? await readBody(req) : {};

    if (req.method === 'POST' && url.pathname === '/api/auth/register') {
      const username = String(body.username || '').trim().toLowerCase();
      const password = String(body.password || '');
      const name = String(body.name || username).trim();
      const role = body.role || 'student';
      if (!username || password.length < 6) return send(res, 400, { error: 'Username and 6-character password are required.' });

      const client = await pool.connect();
      try {
        await ensureLearningStateTable(client);
        await client.query('BEGIN');
        const userResult = await client.query(
          `INSERT INTO users (email, password_hash, display_name, role)
           VALUES ($1, $2, $3, $4)
           RETURNING id, email, display_name, role`,
          [username, hashPassword(password), name, role]
        );
        const user = userResult.rows[0];
        if (role === 'student') {
          await client.query(
            `INSERT INTO student_profiles (user_id, first_name)
             VALUES ($1, $2)
             ON CONFLICT (user_id) DO NOTHING`,
            [user.id, name]
          );
        }
        if (role === 'parent') {
          await client.query(
            `INSERT INTO parent_profiles (user_id, billing_email)
             VALUES ($1, $2)
             ON CONFLICT (user_id) DO NOTHING`,
            [user.id, username]
          );
        }
        await client.query(
          `INSERT INTO user_learning_state (user_id, progress_data, stats_data)
           VALUES ($1, '{}'::jsonb, '{}'::jsonb)
           ON CONFLICT (user_id) DO NOTHING`,
          [user.id]
        );
        await client.query('COMMIT');
        return send(res, 201, { user: publicUser(user), progress: {}, stats: {}, token: user.id });
      } catch (err) {
        await client.query('ROLLBACK');
        if (err.code === '23505') return send(res, 409, { error: 'That username is already taken.' });
        throw err;
      } finally {
        client.release();
      }
    }

    if (req.method === 'POST' && url.pathname === '/api/auth/login') {
      const username = String(body.username || '').trim().toLowerCase();
      const client = await pool.connect();
      try {
        await ensureLearningStateTable(client);
        const result = await client.query(
          'SELECT id, email, password_hash, display_name, role FROM users WHERE email = $1 AND is_active = true',
          [username]
        );
        const user = result.rows[0];
        if (!user || !verifyPassword(body.password, user.password_hash)) {
          return send(res, 401, { error: 'Username or password is incorrect.' });
        }
        await client.query('UPDATE users SET last_login_at = now() WHERE id = $1', [user.id]);
        const state = await getLearningState(client, user.id);
        return send(res, 200, { user: publicUser(user), ...state, token: user.id });
      } finally {
        client.release();
      }
    }

    if (req.method === 'PUT' && url.pathname === '/api/learning-state') {
      const username = String(body.username || '').trim().toLowerCase();
      const client = await pool.connect();
      try {
        await ensureLearningStateTable(client);
        const user = await client.query('SELECT id FROM users WHERE email = $1', [username]);
        if (!user.rows[0]) return send(res, 404, { error: 'User not found.' });
        await client.query(
          `INSERT INTO user_learning_state (user_id, progress_data, stats_data, updated_at)
           VALUES ($1, $2::jsonb, $3::jsonb, now())
           ON CONFLICT (user_id)
           DO UPDATE SET progress_data = EXCLUDED.progress_data, stats_data = EXCLUDED.stats_data, updated_at = now()`,
          [user.rows[0].id, JSON.stringify(body.progress || {}), JSON.stringify(body.stats || {})]
        );
        return send(res, 200, { ok: true });
      } finally {
        client.release();
      }
    }

    return send(res, 404, { error: 'Not found.' });
  } catch (err) {
    return send(res, 500, { error: err.message || 'Server error.' });
  }
});

server.listen(PORT, () => {
  console.log(`Gradely API listening on http://localhost:${PORT}`);
});
