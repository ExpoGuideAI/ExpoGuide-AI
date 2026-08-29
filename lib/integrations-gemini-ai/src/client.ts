import { GoogleGenAI } from "@google/genai";

if (!process.env.AI_INTEGRATIONS_GEMINI_BASE_URL) {
  throw new Error(
    "AI_INTEGRATIONS_GEMINI_BASE_URL must be set. Did you forget to provision the Gemini AI integration?",
  );
}

const apiKey = process.env.AI_INTEGRATIONS_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error(
    "Gemini API Error:",
    new Error("AI_INTEGRATIONS_GEMINI_API_KEY or GEMINI_API_KEY must be set"),
  );
  throw new Error(
    "AI_INTEGRATIONS_GEMINI_API_KEY or GEMINI_API_KEY must be set. Did you forget to configure Gemini?",
  );
}

export const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    apiVersion: "",
    baseUrl: process.env.AI_INTEGRATIONS_GEMINI_BASE_URL,
  },
});
