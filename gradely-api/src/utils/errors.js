class AppError extends Error {
  constructor(message, statusCode = 500, code = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
  }
}

const notFound  = (msg = 'Resource not found')  => new AppError(msg, 404, 'NOT_FOUND');
const forbidden = (msg = 'Access denied')        => new AppError(msg, 403, 'FORBIDDEN');
const unauth    = (msg = 'Unauthorized')         => new AppError(msg, 401, 'UNAUTHORIZED');
const badReq    = (msg = 'Bad request')          => new AppError(msg, 400, 'BAD_REQUEST');
const conflict  = (msg = 'Resource conflict')    => new AppError(msg, 409, 'CONFLICT');

function errorHandler(err, req, res, _next) {
  const statusCode = err.statusCode || 500;
  const isProd = process.env.NODE_ENV === 'production';

  // Prisma unique constraint
  if (err.code === 'P2002') {
    return res.status(409).json({ error: 'CONFLICT', message: 'A record with that value already exists.' });
  }
  // Prisma record not found
  if (err.code === 'P2025') {
    return res.status(404).json({ error: 'NOT_FOUND', message: 'Record not found.' });
  }

  if (!err.isOperational && isProd) {
    console.error('[Unhandled Error]', err);
    return res.status(500).json({ error: 'INTERNAL_ERROR', message: 'Something went wrong.' });
  }

  res.status(statusCode).json({
    error:   err.code || 'ERROR',
    message: err.message,
    ...((!isProd && !err.isOperational) && { stack: err.stack }),
  });
}

module.exports = { AppError, notFound, forbidden, unauth, badReq, conflict, errorHandler };
