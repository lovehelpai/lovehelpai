import OpenAI from "openai";

export const MODEL = "gpt-4o-mini";

export function getOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is missing in environment variables");
  }

  return new OpenAI({ apiKey });
}