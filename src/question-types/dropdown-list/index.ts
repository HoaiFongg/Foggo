import type { QuestionTypeDefinition } from "../types";
import {
  dropdownListContentSchema,
  dropdownListAnswerKeySchema,
  dropdownListUserAnswerSchema,
  type DropdownListContent,
  type DropdownListAnswerKey,
  type DropdownListUserAnswer,
} from "./schema";
import { gradeDropdownList } from "./grade";
import { DropdownListEditor } from "./Editor";
import { DropdownListPlayer } from "./Player";

export const dropdownListDefinition: QuestionTypeDefinition<
  DropdownListContent,
  DropdownListAnswerKey,
  DropdownListUserAnswer
> = {
  type: "dropdown_list",
  name: "Lựa chọn từ danh sách",
  description: "Chọn phương án đúng từ danh sách thả xuống chèn trực tiếp trong văn bản.",
  isPlus: false,
  contentSchema: dropdownListContentSchema,
  answerKeySchema: dropdownListAnswerKeySchema,
  userAnswerSchema: dropdownListUserAnswerSchema,
  defaultContent: () => ({
    prompt:
      "{D} Bạn nên tắt tính năng tự động chạy (Autorun) và tự động phát (Autoplay) cho tất cả các phương tiện truyền thông đa phương tiện di động.<br>{D} Bạn nên lưu trữ các công việc và tập tin cá nhân của mình trên các thiết bị riêng biệt và không được cắm thiết bị cá nhân vào máy tính làm việc hoặc ngược lại.<br>{D} Nếu bạn tìm thấy một thiết bị lưu trữ phương tiện truyền thông và không biết nó thuộc về ai, hãy cắm thiết bị đó vào máy tính của bạn để tìm thông tin về chủ nhân.",
    dropdowns: [
      { id: "d1", label: "Vị trí #1", options: ["Có", "Không"] },
      { id: "d2", label: "Vị trí #2", options: ["Có", "Không"] },
      { id: "d3", label: "Vị trí #3", options: ["Có", "Không"] },
    ],
  }),
  defaultAnswerKey: () => ({
    answers: {
      d1: "Có",
      d2: "Có",
      d3: "Không",
    },
  }),
  grade: gradeDropdownList,
  Editor: DropdownListEditor,
  Player: DropdownListPlayer,
};
