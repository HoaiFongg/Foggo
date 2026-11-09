import test from "node:test";
import assert from "node:assert/strict";
import * as XLSX from "xlsx";
import { createSampleWorkbook } from "./sample-template";
import { parseQuestionsFromExcel } from "./parser";

test("Excel Module: Sample Template & Parser Integration", async (t) => {
  await t.test("tạo workbook mẫu với đúng 2 sheets", () => {
    const wb = createSampleWorkbook();
    assert.deepEqual(wb.SheetNames, ["Danh sách câu hỏi", "Hướng dẫn soạn đề"]);

    const ws = wb.Sheets["Danh sách câu hỏi"];
    assert.ok(ws);
    const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
    assert.ok(data.length >= 7, "Cần có ít nhất 1 dòng header và 6 dòng mẫu");
  });

  await t.test("phân tích cú pháp tệp Excel mẫu với 100% độ chính xác", () => {
    const wb = createSampleWorkbook();
    const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

    const result = parseQuestionsFromExcel(buf);

    assert.equal(result.success, true);
    assert.equal(result.errors.length, 0);
    assert.equal(result.questions.length, 6);

    // Kiểm tra câu 1: Trắc nghiệm Hà Nội
    const q1 = result.questions[0];
    assert.equal(q1.type, "single_choice");
    assert.ok(q1.content.prompt.includes("Thủ đô"));
    assert.equal(q1.content.options.length, 4);
    assert.equal(q1.answer_key.correct, "opt_1");

    // Kiểm tra câu 3: Đúng sai
    const q3 = result.questions[2];
    assert.equal(q3.type, "true_false");
    assert.equal(q3.answer_key.correct, true);

    // Kiểm tra câu 4: Đúng sai (Sai)
    const q4 = result.questions[3];
    assert.equal(q4.type, "true_false");
    assert.equal(q4.answer_key.correct, false);

    // Kiểm tra câu 5: Nhiều đáp án (A, B)
    const q5 = result.questions[4];
    assert.equal(q5.type, "multi_select");
    assert.deepEqual(q5.answer_key.correct, ["opt_1", "opt_2"]);
  });

  await t.test("từ chối tệp rỗng hoặc không có câu hỏi hợp lệ", () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([["STT", "Nội dung"]]);
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

    const result = parseQuestionsFromExcel(buf);
    assert.equal(result.success, false);
    assert.ok(result.errors.length > 0);
  });
});

