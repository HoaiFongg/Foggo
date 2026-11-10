import test from "node:test";
import assert from "node:assert/strict";
import { localizeQuestion, localizeQuestionSet } from "./questions-translation";

test("localizeQuestion preserves original Vietnamese question when lang is vi", () => {
  const sampleQ = {
    id: "8fb79b5b-0906-4c24-b995-c6998099233e",
    type: "multi_select",
    content: {
      prompt: "Bạn có thể thay đổi điều gì với văn bản trên màn hình?",
      options: [{ id: "opt_1", text: "Kiểu chữ (Font)" }],
    },
  };

  const localized = localizeQuestion(sampleQ, "vi");
  assert.equal(localized.content.prompt, "Bạn có thể thay đổi điều gì với văn bản trên màn hình?");
  assert.equal(localized.content.options[0].text, "Kiểu chữ (Font)");
});

test("localizeQuestion translates question to English when lang is en", () => {
  const sampleQ = {
    id: "8fb79b5b-0906-4c24-b995-c6998099233e",
    type: "multi_select",
    content: {
      prompt: "Bạn có thể thay đổi điều gì với văn bản trên màn hình để làm cho văn bản dễ đọc hơn đối với những độc giả khiếm thị? (CHỌN 2)",
      options: [
        { id: "opt_1", text: "Kiểu chữ (Font)" },
        { id: "opt_2", text: "Kích cỡ chữ (Size)" },
      ],
    },
  };

  const localized = localizeQuestion(sampleQ, "en");
  assert.match(localized.content.prompt, /What changes can you make/);
  assert.equal(localized.content.options[0].text, "Font style (Font)");
  assert.equal(localized.content.options[1].text, "Font size (Size)");
  assert.equal(localized.content.options[0].id, "opt_1"); // IDs must remain identical
});

test("localizeQuestionSet translates set title when lang is en", () => {
  const set = {
    id: "1",
    title: "Ôn tập 1 khối 7",
    description: "Mô tả tiếng Việt",
  };
  const localized = localizeQuestionSet(set, "en");
  assert.equal(localized.title, "Grade 7 CS & Digital Literacy Review");
});
