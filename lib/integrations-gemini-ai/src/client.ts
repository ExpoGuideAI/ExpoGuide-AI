import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.AI_INTEGRATIONS_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
const directApiKey = process.env.GEMINI_API_KEY;

if (!directApiKey && !process.env.AI_INTEGRATIONS_GEMINI_BASE_URL) {
  throw new Error(
    "AI_INTEGRATIONS_GEMINI_BASE_URL must be set when using the Gemini integration.",
  );
}

if (!apiKey) {
  console.error(
    "Gemini API Error:",
    new Error("AI_INTEGRATIONS_GEMINI_API_KEY or GEMINI_API_KEY must be set"),
  );
  throw new Error(
    "AI_INTEGRATIONS_GEMINI_API_KEY or GEMINI_API_KEY must be set. Did you forget to configure Gemini?",
  );
}

export const ai = new GoogleGenAI(
  directApiKey
    ? { apiKey: directApiKey }
    : {
        apiKey,
        httpOptions: {
          apiVersion: "",
          baseUrl: process.env.AI_INTEGRATIONS_GEMINI_BASE_URL,
        },
      },
);
