CREATE TABLE qualifications (
  id VARCHAR PRIMARY KEY,
  title VARCHAR NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  qualification_id VARCHAR NOT NULL REFERENCES qualifications(id),
  year VARCHAR NOT NULL,
  category VARCHAR NOT NULL,
  question_number INT NOT NULL,
  question_text TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_index INT NOT NULL,
  explanation TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT questions_options_is_array CHECK (jsonb_typeof(options) = 'array'),
  CONSTRAINT questions_correct_index_range CHECK (correct_index BETWEEN 0 AND 3),
  CONSTRAINT questions_unique_no UNIQUE (qualification_id, year, question_number)
);

CREATE TABLE user_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id),
  selected_index INT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  answered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT user_answers_selected_index_range CHECK (selected_index BETWEEN 0 AND 3)
);

CREATE TABLE user_subscriptions (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  is_pro BOOLEAN NOT NULL DEFAULT FALSE,
  purchased_at TIMESTAMPTZ
);

CREATE INDEX idx_questions_qual_year ON questions (qualification_id, year);
CREATE INDEX idx_questions_qual_category ON questions (qualification_id, category);
CREATE INDEX idx_user_answers_user_time ON user_answers (user_id, answered_at DESC);
CREATE INDEX idx_user_answers_user_question ON user_answers (user_id, question_id, answered_at DESC);

ALTER TABLE qualifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY qualifications_select ON qualifications
  FOR SELECT TO authenticated USING (true);

CREATE POLICY questions_select ON questions
  FOR SELECT TO authenticated USING (true);

CREATE POLICY user_answers_select ON user_answers
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY user_answers_insert ON user_answers
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY user_subscriptions_select ON user_subscriptions
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
