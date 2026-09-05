import { GoogleGenAI } from "@google/genai";

const apiKey =
  process.env.GEMINI_API_KEY ||
  process.env.AI_INTEGRATIONS_GEMINI_API_KEY;

delete process.env.AI_INTEGRATIONS_GEMINI_BASE_URL;
delete process.env.GOOGLE_API_KEY;

if (!apiKey) {
  console.error(
    "Gemini API Error:",
    new Error("GEMINI_API_KEY or AI_INTEGRATIONS_GEMINI_API_KEY must be set"),
  );
  throw new Error(
    "GEMINI_API_KEY or AI_INTEGRATIONS_GEMINI_API_KEY must be set. Did you forget to configure Gemini?",
  );
}

export const ai = new GoogleGenAI({ apiKey });
