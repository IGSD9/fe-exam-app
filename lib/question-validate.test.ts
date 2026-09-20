import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { validateQuestion, validateQuestionBank } from "./question-validate.ts";
import { SEED_QUESTIONS } from "./questions-seed.ts";

describe("question-validate", () => {
  it("accepts the seed bank", () => {
    assert.deepEqual(validateQuestionBank(SEED_QUESTIONS), []);
  });

  it("rejects a broken question", () => {
    const errors = validateQuestion({ id: "x", options: ["a"] });
    assert.ok(errors.length > 0);
  });
});
