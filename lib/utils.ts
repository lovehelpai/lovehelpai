import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function detectLanguageHint(text: string): "ru" | "en" {
  const cyrillic = /[а-яА-ЯёЁ]/;
  if (cyrillic.test(text)) return "ru";
  const latin = /[a-zA-Z]/;
  if (latin.test(text)) return "en";
  return "ru";
}
