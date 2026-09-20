import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { canAccessYear, formatYear, getLatestYear } from "./access.ts";

describe("access", () => {
  it("picks the latest year", () => {
    assert.equal(getLatestYear(["2024-H2", "2025-H2", "2023-H2"]), "2025-H2");
    assert.equal(getLatestYear([]), null);
  });

  it("allows only the latest year for free users", () => {
    assert.equal(canAccessYear(false, "2025-H2", "2025-H2"), true);
    assert.equal(canAccessYear(false, "2024-H2", "2025-H2"), false);
    assert.equal(canAccessYear(true, "2024-H2", "2025-H2"), true);
    assert.equal(canAccessYear(false, "2025-H2", null), false);
  });

  it("formats exam years", () => {
    assert.equal(formatYear("2025-H2"), "2025年秋");
    assert.equal(formatYear("2025-H1"), "2025年春");
  });
});
