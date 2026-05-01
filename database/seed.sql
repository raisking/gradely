-- Starter catalog data for Gradely.

INSERT INTO grades (code, name, display_order) VALUES
  ('prek', 'Pre-K', 0),
  ('k', 'Kindergarten', 1),
  ('1', 'First grade', 2),
  ('2', 'Second grade', 3),
  ('3', 'Third grade', 4),
  ('4', 'Fourth grade', 5),
  ('5', 'Fifth grade', 6),
  ('6', 'Sixth grade', 7),
  ('7', 'Seventh grade', 8),
  ('8', 'Eighth grade', 9),
  ('9', 'Ninth grade', 10),
  ('10', 'Tenth grade', 11),
  ('11', 'Eleventh grade', 12),
  ('12', 'Twelfth grade', 13)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  display_order = EXCLUDED.display_order;

INSERT INTO subjects (slug, name, description, display_order) VALUES
  ('math', 'Math', 'Number sense, algebra, geometry, data, and problem solving.', 1),
  ('language-arts', 'Language arts', 'Reading, writing, vocabulary, grammar, and communication.', 2),
  ('science', 'Science', 'Scientific practices, life science, earth science, and physical science.', 3),
  ('social-studies', 'Social studies', 'History, geography, civics, culture, and economics.', 4),
  ('spanish', 'Spanish', 'Spanish vocabulary, grammar, reading, and listening practice.', 5)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  display_order = EXCLUDED.display_order;

INSERT INTO badges (slug, name, description, icon, criteria, points_awarded) VALUES
  ('first-steps', 'First Steps', 'Complete your first quiz attempt.', 'star', '{"attempts":1}', 25),
  ('streak-starter', 'Streak Starter', 'Practice for three sessions in a row.', 'flame', '{"streak":3}', 50),
  ('accuracy-ace', 'Accuracy Ace', 'Reach at least 90 percent accuracy on a topic.', 'target', '{"mastery_percent":90}', 100),
  ('subject-explorer', 'Subject Explorer', 'Practice in three different subjects.', 'compass', '{"subjects_practiced":3}', 100),
  ('mastery-maker', 'Mastery Maker', 'Master five topics.', 'trophy', '{"topics_mastered":5}', 250)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  criteria = EXCLUDED.criteria,
  points_awarded = EXCLUDED.points_awarded;
