import OpenAI from "openai";

export const MODEL = "openai/gpt-4o-mini";

export const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY!,
  baseURL: "https://openrouter.ai/api/v1",
});

type ChatParams = {
  messages: {
    role: "system" | "user" | "assistant";
    content: string | {
      type: string;
      text?: string;
      image_url?: { url: string; detail?: string };
    }[];
  }[];
  temperature?: number;
  max_tokens?: number;
};

export const openaiClient = {
  chat: {
    completions: {
      create: async (params: ChatParams) => {
        return openai.chat.completions.create({
          model: MODEL,
          messages: params.messages as any,
          temperature: params.temperature ?? 0.7,
          max_tokens: params.max_tokens ?? 2000,
        });
      },
    },
  },
};