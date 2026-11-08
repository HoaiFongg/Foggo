import type { ComponentType } from "react";
import type { z } from "zod";
import type { QuestionType } from "@/types/database";

export interface EditorProps<TContent = any, TAnswerKey = any> {
  content: TContent;
  answerKey: TAnswerKey;
  onChange: (content: TContent, answerKey: TAnswerKey) => void;
}

export interface PlayerProps<TContent = any, TUserAnswer = any> {
  content: TContent;
  value?: TUserAnswer;
  onChange: (value: TUserAnswer) => void;
  disabled?: boolean;
}

export interface QuestionTypeDefinition<
  TContent = any,
  TAnswerKey = any,
  TUserAnswer = any
> {
  type: QuestionType;
  name: string;
  description: string;
  isPlus: boolean;
  contentSchema: z.ZodType<TContent>;
  answerKeySchema: z.ZodType<TAnswerKey>;
  userAnswerSchema: z.ZodType<TUserAnswer>;
  defaultContent: () => TContent;
  defaultAnswerKey: () => TAnswerKey;
  grade: (answer: TUserAnswer, key: TAnswerKey) => number; // 0.0 .. 1.0
  Editor: ComponentType<EditorProps<TContent, TAnswerKey>>;
  Player: ComponentType<PlayerProps<TContent, TUserAnswer>>;
}

