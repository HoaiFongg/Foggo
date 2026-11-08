import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { gradeSingleChoice } from "../single-choice/grade";
import { gradeTrueFalse } from "../true-false/grade";
import { gradeQuestion } from "../registry";

describe("Question Types Grading Unit Tests", () => {
  describe("single_choice", () => {
    const key = { correct: "opt_a" };

    test("chấm đúng khi trùng khớp đáp án", () => {
      assert.equal(gradeSingleChoice("opt_a", key), 1.0);
    });

    test("chấm 0 khi chọn sai đáp án", () => {
      assert.equal(gradeSingleChoice("opt_b", key), 0.0);
    });

    test("chấm 0 khi đáp án người chơi rỗng hoặc không hợp lệ", () => {
      assert.equal(gradeSingleChoice("", key), 0.0);
      assert.equal(gradeSingleChoice(null as any, key), 0.0);
      assert.equal(gradeSingleChoice(undefined as any, key), 0.0);
    });
  });

  describe("true_false", () => {
    test("chấm đúng khi mệnh đề Đúng được chọn là true", () => {
      assert.equal(gradeTrueFalse(true, { correct: true }), 1.0);
    });

    test("chấm đúng khi mệnh đề Sai được chọn là false", () => {
      assert.equal(gradeTrueFalse(false, { correct: false }), 1.0);
    });

    test("chấm 0 khi chọn ngược lại", () => {
      assert.equal(gradeTrueFalse(false, { correct: true }), 0.0);
      assert.equal(gradeTrueFalse(true, { correct: false }), 0.0);
    });

    test("chấm 0 khi giá trị không phải boolean", () => {
      assert.equal(gradeTrueFalse(null as any, { correct: true }), 0.0);
      assert.equal(gradeTrueFalse("true" as any, { correct: true }), 0.0);
    });
  });

  describe("registry gradeQuestion", () => {
    test("điều phối đúng theo type", () => {
      assert.equal(gradeQuestion("single_choice", "a", { correct: "a" }), 1.0);
      assert.equal(gradeQuestion("true_false", true, { correct: true }), 1.0);
      assert.equal(gradeQuestion("unknown_type", "a", { correct: "a" }), 0.0);
    });
  });
});

