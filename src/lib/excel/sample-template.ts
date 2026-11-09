import * as XLSX from "xlsx";

export function createSampleWorkbook(): XLSX.WorkBook {
  const wb = XLSX.utils.book_new();

  // Sheet 1: Danh sách câu hỏi mẫu
  const sampleHeaders = [
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

  const sampleRows = [
    [
      1,
      "Trắc nghiệm",
      "Thủ đô của nước Cộng hòa Xã hội Chủ nghĩa Việt Nam là thành phố nào?",
      "Hà Nội",
      "Huế",
      "Đà Nẵng",
      "TP. Hồ Chí Minh",
      "A",
      20,
      1000,
      "Hà Nội là thủ đô của Việt Nam từ năm 1976 sau khi đất nước thống nhất.",
    ],
    [
      2,
      "Trắc nghiệm",
      "Hành tinh nào trong Hệ Mặt Trời có khoảng cách gần Mặt Trời nhất?",
      "Sao Kim",
      "Sao Thủy",
      "Sao Hỏa",
      "Trái Đất",
      "B",
      20,
      1000,
      "Sao Thủy (Mercury) là hành tinh gần Mặt Trời nhất với chu kỳ quỹ đạo 88 ngày.",
    ],
    [
      3,
      "Đúng sai",
      "Mặt trời mọc ở hướng Đông và lặn ở hướng Tây do Trái Đất tự quay quanh trục từ Tây sang Đông.",
      "",
      "",
      "",
      "",
      "Đúng",
      15,
      1000,
      "Chuyển động biểu kiến của Mặt Trời từ Đông sang Tây là hệ quả của chiều tự quay của Trái Đất.",
    ],
    [
      4,
      "Đúng sai",
      "Nước nguyên chất sôi ở nhiệt độ 50°C dưới áp suất khí quyển tiêu chuẩn 1 atm.",
      "",
      "",
      "",
      "",
      "Sai",
      15,
      1000,
      "Nước nguyên chất sôi ở 100°C ở áp suất khí quyển tiêu chuẩn (1 atm = 101.3 kPa).",
    ],
    [
      5,
      "Nhiều đáp án",
      "Những loài động vật nào sau đây thuộc lớp động vật có vú (Mammalia)?",
      "Cá heo",
      "Cá voi xanh",
      "Cá mập trắng",
      "Chim cánh cụt",
      "A, B",
      25,
      1000,
      "Cá heo và cá voi là thú biển đẻ con và nuôi con bằng sữa mẹ; cá mập là cá sụn, chim cánh cụt thuộc lớp chim.",
    ],
    [
      6,
      "Trắc nghiệm",
      "Trong hệ đơn vị quốc tế (SI), đơn vị nào dùng để đo cường độ dòng điện?",
      "Vôn (V)",
      "Oát (W)",
      "Ampe (A)",
      "Ôm (Ω)",
      "C",
      20,
      1000,
      "Ampe (A) là đơn vị đo cường độ dòng điện, đặt theo tên nhà vật lý Pháp André-Marie Ampère.",
    ],
  ];

  const wsQuestions = XLSX.utils.aoa_to_sheet([sampleHeaders, ...sampleRows]);

  // Cài đặt độ rộng cột cho đẹp mắt
  wsQuestions["!cols"] = [
    { wch: 6 },  // STT
    { wch: 16 }, // Loại câu hỏi
    { wch: 45 }, // Câu hỏi
    { wch: 22 }, // Đáp án A
    { wch: 22 }, // Đáp án B
    { wch: 22 }, // Đáp án C
    { wch: 22 }, // Đáp án D
    { wch: 14 }, // Đáp án đúng
    { wch: 18 }, // Thời gian
    { wch: 12 }, // Điểm số
    { wch: 45 }, // Giải thích
  ];

  XLSX.utils.book_append_sheet(wb, wsQuestions, "Danh sách câu hỏi");

  // Sheet 2: Hướng dẫn chi tiết
  const guideRows = [
    ["HƯỚNG DẪN ĐIỀN FILE EXCEL CÂU HỎI CHO NỀN TẢNG FOGGO"],
    [""],
    ["1. QUY ĐỊNH CÁC CỘT DỮ LIỆU:"],
    ["- STT: Số thứ tự câu hỏi (1, 2, 3...)"],
    ["- Loại câu hỏi: Chọn 1 trong 3 loại: 'Trắc nghiệm', 'Đúng sai', hoặc 'Nhiều đáp án'."],
    ["- Câu hỏi / Đề bài: Nội dung câu hỏi (bắt buộc phải có)."],
    ["- Đáp án A, B, C, D: Dùng cho câu 'Trắc nghiệm' và 'Nhiều đáp án'. Bắt buộc tối thiểu 2 đáp án A và B."],
    ["- Đáp án đúng:"],
    ["    + Câu Trắc nghiệm 1 đáp án: Điền chữ cái 'A', 'B', 'C', hoặc 'D'."],
    ["    + Câu Đúng sai: Điền chữ 'Đúng' hoặc 'Sai' (hoặc 'True'/'False', hoặc 'A'/'B')."],
    ["    + Câu Nhiều đáp án: Điền các chữ cái cách nhau bằng dấu phẩy, ví dụ: 'A, B' hoặc 'A, C, D'."],
    ["- Thời gian (giây): Thời gian học sinh trả lời (mặc định 20 giây nếu để trống)."],
    ["- Điểm số: Điểm cơ bản khi trả lời đúng (mặc định 1000 điểm nếu để trống)."],
    ["- Giải thích: Lời giải thích kiến thức hiển thị sau khi học sinh trả lời (không bắt buộc)."],
    [""],
    ["2. LƯU Ý KHI SOẠN:"],
    ["- Giữ nguyên dòng tiêu đề ở hàng 1 của Sheet 'Danh sách câu hỏi'."],
    ["- Không chèn thêm hình ảnh trực tiếp vào file Excel (hình ảnh có thể thêm sau trong trình biên tập Foggo)."],
    ["- Hệ thống tự động bỏ qua các dòng trống."],
  ];

  const wsGuide = XLSX.utils.aoa_to_sheet(guideRows);
  wsGuide["!cols"] = [{ wch: 85 }];
  XLSX.utils.book_append_sheet(wb, wsGuide, "Hướng dẫn soạn đề");

  return wb;
}

/**
 * Tải file mẫu Excel trực tiếp từ trình duyệt
 */
export function downloadSampleTemplateExcel(filename = "Mau_Cau_Hoi_Foggo.xlsx") {
  const wb = createSampleWorkbook();
  XLSX.writeFile(wb, filename);
}
