import OpenAI from "openai";

export const MODEL = "meta-llama/llama-3.1-8b-instruct:free";

export const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY!,
  baseURL: "https://openrouter.ai/api/v1",
});

type Role = "system" | "user" | "assistant";

type Message =
  | {
      role: Role;
      content: string;
    }
  | {
      role: Role;
      content: {
        type: "text";
        text: string;
      }[];
    };

type ChatParams = {
  messages: Message[];
  temperature?: number;
  max_tokens?: number;
};

export const openaiClient = {
  chat: {
    completions: {
      create: async (params: ChatParams) => {
        return openai.chat.completions.create({
          model: MODEL,
          messages: params.messages,
          temperature: params.temperature ?? 0.7,
          max_tokens: params.max_tokens ?? 2000,
        });
      },
    },
  },
};