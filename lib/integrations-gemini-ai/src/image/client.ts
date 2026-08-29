import { GoogleGenAI, Modality } from "@google/genai";

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

export async function generateImage(
  prompt: string
): Promise<{ b64_json: string; mimeType: string }> {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-image",
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    config: {
      responseModalities: [Modality.TEXT, Modality.IMAGE],
    },
  });

  const candidate = response.candidates?.[0];
  const imagePart = candidate?.content?.parts?.find(
    (part: { inlineData?: { data?: string; mimeType?: string } }) => part.inlineData
  );

  if (!imagePart?.inlineData?.data) {
    throw new Error("No image data in response");
  }

  return {
    b64_json: imagePart.inlineData.data,
    mimeType: imagePart.inlineData.mimeType || "image/png",
  };
}
