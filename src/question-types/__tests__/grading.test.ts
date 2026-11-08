import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { gradeSingleChoice } from "../single-choice/grade";
import { gradeTrueFalse } from "../true-false/grade";
import { gradeMultiSelect } from "../multi-select/grade";
import { gradeDragOrder } from "../drag-order/grade";
import { gradeHotspot } from "../hotspot/grade";
import { gradeDragMatch } from "../drag-match/grade";
import { gradeDragFill } from "../drag-fill/grade";
import { gradeTrueFalseMulti } from "../true-false-multi/grade";
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

  describe("multi_select", () => {
    const key = { correct: ["a", "c", "d"], scoring: "partial" as const };

    test("chấm 1.0 khi chọn đúng chính xác và đầy đủ", () => {
      assert.equal(gradeMultiSelect(["a", "c", "d"], key), 1.0);
    });

    test("tính điểm từng phần khi chọn thiếu nhưng không chọn sai", () => {
      // 2/3 đúng = 0.667
      assert.equal(gradeMultiSelect(["a", "c"], key), 0.667);
    });

    test("trừ điểm khi chọn phương án sai", () => {
      // Chọn 1 đúng ('a') và 1 sai ('b') -> 1/3 - 1/3 = 0.0
      assert.equal(gradeMultiSelect(["a", "b"], key), 0.0);
    });
  });

  describe("drag_order", () => {
    const key = { correct_order: ["step1", "step2", "step3"], scoring: "partial" as const };

    test("chấm 1.0 khi sắp xếp đúng toàn bộ", () => {
      assert.equal(gradeDragOrder(["step1", "step2", "step3"], key), 1.0);
    });

    test("tính điểm tỷ lệ theo số vị trí đúng", () => {
      // Đúng step1 ở vị trí 0, 2 step còn lại đảo lộn -> 1/3 = 0.333
      assert.equal(gradeDragOrder(["step1", "step3", "step2"], key), 0.333);
    });

    test("chấm 0.0 khi sai toàn bộ hoặc mảng rỗng", () => {
      assert.equal(gradeDragOrder([], key), 0.0);
    });
  });

  describe("hotspot", () => {
    const key = {
      regions: [
        { shape: "rect" as const, x: 0.1, y: 0.1, w: 0.2, h: 0.2, label: "Hộp" },
        { shape: "circle" as const, cx: 0.7, cy: 0.7, r: 0.1, label: "Tâm" },
      ],
      mode: "any_region" as const,
    };

    test("chấm 1.0 khi click trúng vùng hình chữ nhật", () => {
      assert.equal(gradeHotspot({ x: 0.15, y: 0.15 }, key), 1.0);
    });

    test("chấm 1.0 khi click trúng vùng hình tròn", () => {
      assert.equal(gradeHotspot({ x: 0.72, y: 0.71 }, key), 1.0);
    });

    test("chấm 0.0 khi click ra ngoài tất cả các vùng", () => {
      assert.equal(gradeHotspot({ x: 0.5, y: 0.5 }, key), 0.0);
    });
  });

  describe("drag_match", () => {
    const key = {
      matches: { p1: "p1", p2: "p2", p3: "p3", p4: "p4" },
    };

    test("chấm 1.0 khi ghép đúng 100% các cặp", () => {
      assert.equal(
        gradeDragMatch({ p1: "p1", p2: "p2", p3: "p3", p4: "p4" }, key),
        1.0
      );
    });

    test("tính điểm từng phần khi ghép đúng một nửa số cặp", () => {
      assert.equal(
        gradeDragMatch({ p1: "p1", p2: "p2", p3: "wrong", p4: "wrong" }, key),
        0.5
      );
    });
  });

  describe("drag_fill", () => {
    const key = {
      blanks: { "1": "opt_a", "2": "opt_b" },
    };

    test("chấm 1.0 khi điền đúng mọi chỗ trống", () => {
      assert.equal(gradeDragFill({ "1": "opt_a", "2": "opt_b" }, key), 1.0);
    });

    test("chấm 0.5 khi chỉ điền đúng 1/2 ô", () => {
      assert.equal(gradeDragFill({ "1": "opt_a", "2": "opt_wrong" }, key), 0.5);
    });
  });

  describe("true_false_multi", () => {
    const key = {
      answers: { s1: true, s2: false, s3: true, s4: false },
    };

    test("chấm 1.0 khi toàn bộ mệnh đề chính xác", () => {
      assert.equal(
        gradeTrueFalseMulti({ s1: true, s2: false, s3: true, s4: false }, key),
        1.0
      );
    });

    test("chấm 0.75 khi đúng 3/4 mệnh đề", () => {
      assert.equal(
        gradeTrueFalseMulti({ s1: true, s2: false, s3: true, s4: true }, key),
        0.75
      );
    });
  });

  describe("registry gradeQuestion", () => {
    test("điều phối đúng theo mọi type", () => {
      assert.equal(gradeQuestion("single_choice", "a", { correct: "a" }), 1.0);
      assert.equal(gradeQuestion("true_false", true, { correct: true }), 1.0);
      assert.equal(
        gradeQuestion("multi_select", ["a"], { correct: ["a"], scoring: "partial" }),
        1.0
      );
      assert.equal(
        gradeQuestion("drag_order", ["a", "b"], { correct_order: ["a", "b"], scoring: "exact" }),
        1.0
      );
      assert.equal(
        gradeQuestion("drag_match", { a: "1" }, { matches: { a: "1" } }),
        1.0
      );
      assert.equal(
        gradeQuestion("drag_fill", { "1": "x" }, { blanks: { "1": "x" } }),
        1.0
      );
      assert.equal(
        gradeQuestion("true_false_multi", { a: true }, { answers: { a: true } }),
        1.0
      );
      assert.equal(gradeQuestion("unknown_type", "a", { correct: "a" }), 0.0);
    });
  });
});
