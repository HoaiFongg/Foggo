/**
 * Chuyển đổi answer_key và content của câu hỏi thành văn bản hiển thị đáp án đúng
 * để học sinh có thể xem lại, học tập và ghi nhớ sau khi trả lời.
 */
export function formatCorrectAnswerForReview(
  type: string,
  content: any,
  answerKey: any
): string {
  if (!answerKey) return "Không có thông tin đáp án";

  switch (type) {
    case "single_choice": {
      const correctId = answerKey.correct;
      const option = content?.options?.find((opt: any) => opt.id === correctId);
      if (option) {
        return `${correctId.toUpperCase()}. ${option.text}`;
      }
      return `${correctId?.toUpperCase() || correctId}`;
    }

    case "true_false": {
      const isCorrectTrue = answerKey.correct === true;
      return isCorrectTrue ? "Đúng (True)" : "Sai (False)";
    }

    case "true_false_multi": {
      const answers = answerKey.answers || {};
      const statements = content?.statements || [];
      const parts: string[] = [];
      statements.forEach((st: any, idx: number) => {
        const val = answers[st.id];
        const valText = val === true ? "Đúng" : val === false ? "Sai" : "Chưa xác định";
        parts.push(`Mệnh đề ${idx + 1} (${st.text}): ${valText}`);
      });
      return parts.length > 0 ? parts.join(" • ") : JSON.stringify(answers);
    }

    case "multi_select": {
      const correctIds: string[] = Array.isArray(answerKey.correct) ? answerKey.correct : [];
      const options = content?.options || [];
      const textList = correctIds.map((id) => {
        const opt = options.find((o: any) => o.id === id);
        return opt ? `${id.toUpperCase()}. ${opt.text}` : id.toUpperCase();
      });
      return textList.join(" | ");
    }

    case "drag_order": {
      const correctOrder: string[] = Array.isArray(answerKey.correct_order)
        ? answerKey.correct_order
        : [];
      const items = content?.items || [];
      const orderedText = correctOrder.map((id, idx) => {
        const item = items.find((it: any) => it.id === id);
        return `${idx + 1}. ${item?.text || id}`;
      });
      return orderedText.join(" ➔ ");
    }

    case "drag_match": {
      const matches = answerKey.matches || {};
      const pairs = content?.pairs || [];
      const results: string[] = [];
      pairs.forEach((p: any) => {
        const rightId = matches[p.id] || p.id;
        const matchingPair = pairs.find((other: any) => other.id === rightId);
        results.push(`[${p.left}] ⇋ [${matchingPair?.right || p.right}]`);
      });
      return results.join(" • ");
    }

    case "drag_fill": {
      const blanks = answerKey.blanks || {};
      const tokens = content?.tokens || [];
      const results: string[] = [];
      Object.keys(blanks).forEach((blankId) => {
        const wordId = blanks[blankId];
        const token = tokens.find((t: any) => t.id === wordId);
        results.push(`Ô trống #${blankId}: "${token?.text || wordId}"`);
      });
      return results.join(" • ");
    }

    case "dropdown_list": {
      const answers = answerKey.answers || {};
      const dropdowns = content?.dropdowns || [];
      const results: string[] = [];
      dropdowns.forEach((d: any, idx: number) => {
        const ans = answers[d.id];
        results.push(`Vị trí ${idx + 1}: "${ans || "Không có"}"`);
      });
      return results.length > 0 ? results.join(" • ") : JSON.stringify(answers);
    }

    case "hotspot": {
      return content?.prompt || "Điểm nóng chính xác trên hình ảnh minh họa";
    }

    default:
      return JSON.stringify(answerKey);
  }
}

