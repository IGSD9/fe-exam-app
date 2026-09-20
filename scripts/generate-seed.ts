import { writeFileSync } from "fs";
import { SEED_QUESTIONS } from "../lib/questions-seed.ts";

const values = SEED_QUESTIONS.map((item) => {
  const options = JSON.stringify(item.options).replace(/'/g, "''");
  const explanation = (item.explanation ?? "").replace(/'/g, "''");
  const image = item.imageUrl ? `'${item.imageUrl.replace(/'/g, "''")}'` : "NULL";
  return `  ('${item.id}', '${item.qualificationId}', '${item.year}', '${item.category}', ${item.questionNumber}, '${item.questionText.replace(/'/g, "''")}', '${options}'::jsonb, ${item.correctIndex}, '${explanation}', ${image})`;
});

const sql = `INSERT INTO qualifications (id, title)
VALUES ('fe', '基本情報技術者試験')
ON CONFLICT (id) DO NOTHING;

INSERT INTO questions (
  id, qualification_id, year, category, question_number, question_text, options, correct_index, explanation, image_url
) VALUES
${values.join(",\n")}
ON CONFLICT (id) DO UPDATE SET
  qualification_id = EXCLUDED.qualification_id,
  year = EXCLUDED.year,
  category = EXCLUDED.category,
  question_number = EXCLUDED.question_number,
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_index = EXCLUDED.correct_index,
  explanation = EXCLUDED.explanation,
  image_url = EXCLUDED.image_url;
`;

writeFileSync(new URL("../supabase/seed.sql", import.meta.url), sql);
console.log(`wrote ${SEED_QUESTIONS.length} questions`);
