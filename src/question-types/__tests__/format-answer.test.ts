import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { formatCorrectAnswerForReview } from "../format-answer";

describe("formatCorrectAnswerForReview Unit Tests", () => {
  test("single_choice: trả về mã và text của phương án đúng", () => {
    const type = "single_choice";
    const content = {
      options: [
        { id: "a", text: "Hà Nội" },
        { id: "b", text: "TP. Hồ Chí Minh" },
      ],
    };
    const answerKey = { correct: "a" };
    const ans = formatCorrectAnswerForReview(type, content, answerKey);
    assert.equal(ans, "A. Hà Nội");
  });

  test("true_false: trả về Đúng hoặc Sai", () => {
    assert.equal(formatCorrectAnswerForReview("true_false", {}, { correct: true }), "Đúng (True)");
    assert.equal(formatCorrectAnswerForReview("true_false", {}, { correct: false }), "Sai (False)");
  });

  test("drag_order: trả về chuỗi thứ tự nối bằng mũi tên", () => {
    const type = "drag_order";
    const content = {
      items: [
        { id: "step1", text: "Bước 1" },
        { id: "step2", text: "Bước 2" },
      ],
    };
    const answerKey = { correct_order: ["step1", "step2"] };
    const ans = formatCorrectAnswerForReview(type, content, answerKey);
    assert.equal(ans, "1. Bước 1 ➔ 2. Bước 2");
  });

  test("drag_match: trả về các cặp tương ứng", () => {
    const type = "drag_match";
    const content = {
      pairs: [
        { id: "p1", left: "Chó", right: "Sủa" },
        { id: "p2", left: "Mèo", right: "Meo" },
      ],
    };
    const answerKey = { matches: { p1: "p1", p2: "p2" } };
    const ans = formatCorrectAnswerForReview(type, content, answerKey);
    assert.equal(ans, "[Chó] ⇋ [Sủa] • [Mèo] ⇋ [Meo]");
  });

  test("dropdown_list: trả về các từ đúng theo vị trí", () => {
    const type = "dropdown_list";
    const content = {
      dropdowns: [
        { id: "d1", options: ["mặt trời", "mặt trăng"] },
        { id: "d2", options: ["Đông", "Tây"] },
      ],
    };
    const answerKey = { answers: { d1: "mặt trời", d2: "Đông" } };
    const ans = formatCorrectAnswerForReview(type, content, answerKey);
    assert.equal(ans, 'Vị trí 1: "mặt trời" • Vị trí 2: "Đông"');
  });
});
