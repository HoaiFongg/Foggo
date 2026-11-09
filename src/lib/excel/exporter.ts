import * as XLSX from "xlsx";

interface QuestionExportItem {
  id?: string;
  position?: number;
  type: string;
  content: any;
  answer_key: any;
  time_limit_sec?: number;
  points?: number;
  explanation?: string | null;
}

export function exportQuestionSetToExcel(
  setTitle: string,
  questions: QuestionExportItem[],
  filename?: string
) {
  const wb = XLSX.utils.book_new();

  const headers = [
    "STT",
    "Loại câu hỏi",
    "Câu hỏi / Đề bài",
    "Đáp án A",
    "Đáp án B",
    "Đáp án C",
    "Đáp án D",
    "Đáp án đúng",
    "Thời gian (giây)",
    "Điểm số",
    "Giải thích",
  ];

  const rows = questions.map((q, idx) => {
    let typeName = "Trắc nghiệm";
    let optA = "";
    let optB = "";
    let optC = "";
    let optD = "";
    let correctStr = "";

    const content = q.content || {};
    const answerKey = q.answer_key || {};
    const prompt = content.prompt || "";

    if (q.type === "true_false" || q.type === "true_false_multi") {
      typeName = "Đúng sai";
      if (Array.isArray(content.statements) && content.statements.length > 0) {
        optA = content.statements[0]?.text || "";
        optB = content.statements[1]?.text || "";
        optC = content.statements[2]?.text || "";
        optD = content.statements[3]?.text || "";
        const answersMap = answerKey.answers || {};
        correctStr = content.statements
          .map((s: any, sIdx: number) => {
            const letter = ["A", "B", "C", "D"][sIdx] || `#${sIdx + 1}`;
            const val = answersMap[s.id] === true ? "Đúng" : "Sai";
            return `${letter}: ${val}`;
          })
          .join(", ");
      } else {
        correctStr =
          answerKey.correct === true || answerKey.answers?.s1 === true ? "Đúng" : "Sai";
      }
    } else if (q.type === "dropdown_list") {
      typeName = "Danh sách lựa chọn";
      const dropdowns = content.dropdowns || [];
      optA = dropdowns[0]?.options ? dropdowns[0].options.join(" / ") : "";
      optB = dropdowns[1]?.options ? dropdowns[1].options.join(" / ") : "";
      optC = dropdowns[2]?.options ? dropdowns[2].options.join(" / ") : "";
      optD = dropdowns[3]?.options ? dropdowns[3].options.join(" / ") : "";

      const answersMap = answerKey.answers || {};
      correctStr = Object.entries(answersMap)
        .map(([k, v], idx) => `#${idx + 1}: ${v}`)
        .join(", ");
    } else if (q.type === "multi_select") {
      typeName = "Nhiều đáp án";
      const options = content.options || [];
      optA = options[0]?.text || "";
      optB = options[1]?.text || "";
      optC = options[2]?.text || "";
      optD = options[3]?.text || "";

      const correctIds: string[] = Array.isArray(answerKey.correct) ? answerKey.correct : [];
      const letters: string[] = [];
      options.forEach((opt: any, oIdx: number) => {
        if (correctIds.includes(opt.id)) {
          letters.push(String.fromCharCode(65 + oIdx)); // 65 = 'A'
        }
      });
      correctStr = letters.join(", ");
    } else {
      // single_choice hoặc các dạng khác
      typeName = "Trắc nghiệm";
      const options = content.options || [];
      optA = options[0]?.text || "";
      optB = options[1]?.text || "";
      optC = options[2]?.text || "";
      optD = options[3]?.text || "";

      const correctId = answerKey.correct;
      const matchIndex = options.findIndex((o: any) => o.id === correctId);
      if (matchIndex !== -1) {
        correctStr = String.fromCharCode(65 + matchIndex); // 'A', 'B', 'C', 'D'
      } else {
        correctStr = "A";
      }
    }

    return [
      idx + 1,
      typeName,
      prompt,
      optA,
      optB,
      optC,
      optD,
      correctStr,
      q.time_limit_sec ?? 20,
      q.points ?? 1000,
      q.explanation || "",
    ];
  });

  const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  ws["!cols"] = [
    { wch: 6 },
    { wch: 16 },
    { wch: 45 },
    { wch: 22 },
    { wch: 22 },
    { wch: 22 },
    { wch: 22 },
    { wch: 14 },
    { wch: 18 },
    { wch: 12 },
    { wch: 45 },
  ];

  XLSX.utils.book_append_sheet(wb, ws, "Danh sách câu hỏi");

  const safeTitle = (setTitle || "Bo_Cau_Hoi").replace(/[/\\?%*:|"<>]/g, "_");
  const finalFilename = filename || `Foggo_SaoLuu_${safeTitle}.xlsx`;
  XLSX.writeFile(wb, finalFilename);
}

export function exportQuestionSetToJson(
  setMetadata: any,
  questions: QuestionExportItem[],
  filename?: string
) {
  const backupData = {
    app: "Foggo",
    schema_version: "1.0",
    exported_at: new Date().toISOString(),
    set: {
      id: setMetadata.id,
      title: setMetadata.title,
      description: setMetadata.description,
      subject: setMetadata.subject,
      grade_level: setMetadata.grade_level,
      language: setMetadata.language || "vi",
      visibility: setMetadata.visibility || "private",
    },
    questions_count: questions.length,
    questions,
  };

  const jsonStr = JSON.stringify(backupData, null, 2);
  const blob = new Blob([jsonStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const safeTitle = (setMetadata.title || "Bo_Cau_Hoi").replace(/[/\\?%*:|"<>]/g, "_");
  const finalFilename = filename || `Foggo_Backup_${safeTitle}.json`;

  const link = document.createElement("a");
  link.href = url;
  link.download = finalFilename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

