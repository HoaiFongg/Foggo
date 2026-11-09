import * as XLSX from "xlsx";
import type { QuestionType } from "@/types/database";

export interface ParsedExcelQuestion {
  id: string;
  position: number;
  type: QuestionType;
  content: any;
  answer_key: any;
  time_limit_sec: number;
  points: number;
  explanation?: string;
  rawRowNumber: number;
  previewPrompt: string;
  previewType: string;
}

export interface ParseExcelResult {
  success: boolean;
  questions: ParsedExcelQuestion[];
  errors: string[];
  warnings: string[];
  totalRows: number;
}

function normalizeHeader(val: any): string {
  if (!val) return "";
  return String(val)
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Xóa dấu tiếng Việt
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d");
}

export function parseQuestionsFromExcel(fileBuffer: ArrayBuffer | Uint8Array): ParseExcelResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const parsedQuestions: ParsedExcelQuestion[] = [];

  try {
    const wb = XLSX.read(fileBuffer, { type: "array" });
    if (!wb.SheetNames || wb.SheetNames.length === 0) {
      return {
        success: false,
        questions: [],
        errors: ["Tệp Excel không chứa bất kỳ bảng tính (Sheet) nào."],
        warnings: [],
        totalRows: 0,
      };
    }

    // Ưu tiên tìm sheet có tên "Danh sách câu hỏi" hoặc "Questions", nếu không lấy sheet đầu tiên
    let sheetName = wb.SheetNames[0];
    for (const name of wb.SheetNames) {
      const normName = normalizeHeader(name);
      if (normName.includes("cau hoi") || normName.includes("question") || normName.includes("de thi")) {
        sheetName = name;
        break;
      }
    }

    const ws = wb.Sheets[sheetName];
    const data: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1, blankrows: false });

    if (data.length < 2) {
      return {
        success: false,
        questions: [],
        errors: ["Bảng tính không có dữ liệu câu hỏi (cần ít nhất 1 dòng tiêu đề và 1 dòng câu hỏi)."],
        warnings: [],
        totalRows: 0,
      };
    }

    // 1. Phân tích dòng tiêu đề (Header row)
    const headers = data[0].map(normalizeHeader);

    let colType = -1;
    let colPrompt = -1;
    let colOptA = -1;
    let colOptB = -1;
    let colOptC = -1;
    let colOptD = -1;
    let colCorrect = -1;
    let colTime = -1;
    let colPoints = -1;
    let colExplanation = -1;

    headers.forEach((h, idx) => {
      if (colType === -1 && (h.includes("loai") || h.includes("type") || h.includes("dang"))) {
        colType = idx;
      } else if (colPrompt === -1 && (h.includes("cau hoi") || h.includes("noi dung") || h.includes("de bai") || h.includes("prompt") || h.includes("question"))) {
        colPrompt = idx;
      } else if (colOptA === -1 && (h.includes("dap an a") || h === "a" || h.includes("lua chon a"))) {
        colOptA = idx;
      } else if (colOptB === -1 && (h.includes("dap an b") || h === "b" || h.includes("lua chon b"))) {
        colOptB = idx;
      } else if (colOptC === -1 && (h.includes("dap an c") || h === "c" || h.includes("lua chon c"))) {
        colOptC = idx;
      } else if (colOptD === -1 && (h.includes("dap an d") || h === "d" || h.includes("lua chon d"))) {
        colOptD = idx;
      } else if (colCorrect === -1 && (h.includes("dap an dung") || h.includes("dung") || h.includes("correct") || h.includes("key") || h.includes("ket qua"))) {
        colCorrect = idx;
      } else if (colTime === -1 && (h.includes("thoi gian") || h.includes("time") || h.includes("giay"))) {
        colTime = idx;
      } else if (colPoints === -1 && (h.includes("diem") || h.includes("point") || h.includes("score"))) {
        colPoints = idx;
      } else if (colExplanation === -1 && (h.includes("giai thich") || h.includes("loi giai") || h.includes("explanation"))) {
        colExplanation = idx;
      }
    });

    // Nếu không tìm thấy cột theo tên, fallback theo vị trí mặc định của mẫu
    if (colPrompt === -1 && data[0].length >= 3) {
      colPrompt = 2; // Cột C
    }
    if (colOptA === -1 && data[0].length >= 4) colOptA = 3;
    if (colOptB === -1 && data[0].length >= 5) colOptB = 4;
    if (colOptC === -1 && data[0].length >= 6) colOptC = 5;
    if (colOptD === -1 && data[0].length >= 7) colOptD = 6;
    if (colCorrect === -1 && data[0].length >= 8) colCorrect = 7;

    if (colPrompt === -1) {
      return {
        success: false,
        questions: [],
        errors: ["Không thể xác định cột 'Câu hỏi / Đề bài' trong file Excel. Vui lòng tải file mẫu để xem định dạng chuẩn."],
        warnings: [],
        totalRows: data.length - 1,
      };
    }

    // 2. Phân tích từng dòng dữ liệu
    for (let r = 1; r < data.length; r++) {
      const row = data[r];
      if (!row || row.length === 0) continue;

      const rawPrompt = row[colPrompt];
      const prompt = rawPrompt ? String(rawPrompt).trim() : "";
      if (!prompt) {
        warnings.push(`Dòng ${r + 1}: Bỏ qua vì nội dung câu hỏi bị trống.`);
        continue;
      }

      const rawType = colType !== -1 ? String(row[colType] || "").trim() : "";
      const normType = normalizeHeader(rawType);

      const rawOptA = colOptA !== -1 ? String(row[colOptA] ?? "").trim() : "";
      const rawOptB = colOptB !== -1 ? String(row[colOptB] ?? "").trim() : "";
      const rawOptC = colOptC !== -1 ? String(row[colOptC] ?? "").trim() : "";
      const rawOptD = colOptD !== -1 ? String(row[colOptD] ?? "").trim() : "";

      const rawCorrect = colCorrect !== -1 ? String(row[colCorrect] ?? "").trim() : "";
      const normCorrect = normalizeHeader(rawCorrect);

      const rawTime = colTime !== -1 ? parseInt(row[colTime], 10) : 20;
      const timeLimit = !isNaN(rawTime) && rawTime >= 5 && rawTime <= 300 ? rawTime : 20;

      const rawPoints = colPoints !== -1 ? parseInt(row[colPoints], 10) : 1000;
      const points = !isNaN(rawPoints) && rawPoints > 0 ? rawPoints : 1000;

      const rawExplanation = colExplanation !== -1 ? String(row[colExplanation] ?? "").trim() : "";

      // Xác định loại câu hỏi
      let qType: QuestionType = "single_choice";
      let displayTypeName = "Trắc nghiệm 1 đáp án";

      if (
        normType.includes("dung sai") ||
        normType.includes("true") ||
        normType.includes("false") ||
        normCorrect === "dung" ||
        normCorrect === "sai" ||
        normCorrect === "true" ||
        normCorrect === "false"
      ) {
        qType = "true_false";
        displayTypeName = "Đúng / Sai";
      } else if (
        normType.includes("nhieu") ||
        normType.includes("multi") ||
        rawCorrect.includes(",") ||
        rawCorrect.includes(";")
      ) {
        qType = "multi_select";
        displayTypeName = "Nhiều đáp án đúng";
      }

      // Xây dựng content và answer_key theo loại câu hỏi
      let content: any = null;
      let answerKey: any = null;

      if (qType === "true_false") {
        const isTrue =
          normCorrect === "dung" ||
          normCorrect === "true" ||
          normCorrect === "d" ||
          normCorrect === "t" ||
          normCorrect === "1" ||
          normCorrect === "a";

        content = {
          prompt,
          image_url: null,
        };
        answerKey = {
          correct: isTrue,
        };
      } else if (qType === "multi_select") {
        const rawOptions = [
          { key: "A", text: rawOptA },
          { key: "B", text: rawOptB },
          { key: "C", text: rawOptC },
          { key: "D", text: rawOptD },
        ].filter((o) => o.text !== "");

        if (rawOptions.length < 2) {
          warnings.push(`Dòng ${r + 1}: Câu hỏi nhiều đáp án cần tối thiểu 2 lựa chọn (A và B). Đã tự động tạo phương án mặc định.`);
          if (rawOptions.length === 0) {
            rawOptions.push({ key: "A", text: "Lựa chọn 1" });
            rawOptions.push({ key: "B", text: "Lựa chọn 2" });
          } else if (rawOptions.length === 1) {
            rawOptions.push({ key: "B", text: "Lựa chọn 2" });
          }
        }

        const options = rawOptions.map((o, idx) => ({
          id: `opt_${idx + 1}`,
          text: o.text,
        }));

        // Tìm các đáp án đúng từ chuỗi (ví dụ: "A, B" hoặc "A;C")
        const correctLetters = rawCorrect
          .toUpperCase()
          .split(/[,;\s]+/)
          .map((s) => s.trim())
          .filter(Boolean);

        const correctIds: string[] = [];
        correctLetters.forEach((letter) => {
          const matchIndex = rawOptions.findIndex((o) => o.key === letter);
          if (matchIndex !== -1) {
            correctIds.push(options[matchIndex].id);
          }
        });

        // Nếu không khớp theo chữ cái, thử so sánh trực tiếp với nội dung đáp án
        if (correctIds.length === 0) {
          options.forEach((opt) => {
            if (rawCorrect.toLowerCase().includes(opt.text.toLowerCase())) {
              correctIds.push(opt.id);
            }
          });
        }

        // Mặc định chọn ít nhất option đầu tiên nếu không tìm thấy
        if (correctIds.length === 0) {
          correctIds.push(options[0].id);
          warnings.push(`Dòng ${r + 1}: Không tìm thấy đáp án đúng cho câu nhiều lựa chọn. Hệ thống tạm gán phương án A là đúng.`);
        }

        content = {
          prompt,
          image_url: null,
          options,
          min_select: 1,
        };
        answerKey = {
          correct: correctIds,
          scoring: "partial",
        };
      } else {
        // qType === 'single_choice'
        const rawOptions = [
          { key: "A", text: rawOptA },
          { key: "B", text: rawOptB },
          { key: "C", text: rawOptC },
          { key: "D", text: rawOptD },
        ].filter((o) => o.text !== "");

        if (rawOptions.length < 2) {
          warnings.push(`Dòng ${r + 1}: Câu hỏi trắc nghiệm cần tối thiểu 2 đáp án A và B.`);
          if (rawOptions.length === 0) {
            rawOptions.push({ key: "A", text: "Đáp án A" });
            rawOptions.push({ key: "B", text: "Đáp án B" });
          } else if (rawOptions.length === 1) {
            rawOptions.push({ key: "B", text: "Đáp án B" });
          }
        }

        const options = rawOptions.map((o, idx) => ({
          id: `opt_${idx + 1}`,
          text: o.text,
        }));

        let correctId = options[0].id;
        const letter = rawCorrect.toUpperCase().trim().slice(0, 1);
        const matchIndex = rawOptions.findIndex((o) => o.key === letter);

        if (matchIndex !== -1) {
          correctId = options[matchIndex].id;
        } else {
          // Thử so trùng khớp với nội dung
          const matchByText = options.find((opt) =>
            normCorrect.includes(normalizeHeader(opt.text)) || normalizeHeader(opt.text).includes(normCorrect)
          );
          if (matchByText) {
            correctId = matchByText.id;
          } else {
            warnings.push(`Dòng ${r + 1}: Không tìm thấy đáp án khớp '${rawCorrect}'. Đã chọn phương án A làm đáp án đúng.`);
          }
        }

        content = {
          prompt,
          image_url: null,
          options,
        };
        answerKey = {
          correct: correctId,
        };
      }

      parsedQuestions.push({
        id: `q_excel_${Date.now()}_${r}`,
        position: parsedQuestions.length,
        type: qType,
        content,
        answer_key: answerKey,
        time_limit_sec: timeLimit,
        points,
        explanation: rawExplanation || undefined,
        rawRowNumber: r + 1,
        previewPrompt: prompt,
        previewType: displayTypeName,
      });
    }

    if (parsedQuestions.length === 0) {
      return {
        success: false,
        questions: [],
        errors: ["Không đọc được câu hỏi hợp lệ nào từ file Excel. Vui lòng kiểm tra lại nội dung bảng tính."],
        warnings,
        totalRows: data.length - 1,
      };
    }

    return {
      success: true,
      questions: parsedQuestions,
      errors: [],
      warnings,
      totalRows: data.length - 1,
    };
  } catch (err: any) {
    return {
      success: false,
      questions: [],
      errors: [`Lỗi khi phân tích tệp Excel: ${err?.message || "Định dạng tệp không hợp lệ"}`],
      warnings: [],
      totalRows: 0,
    };
  }
}
