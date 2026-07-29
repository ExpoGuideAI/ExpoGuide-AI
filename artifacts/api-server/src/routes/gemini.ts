import { Router } from "express";
import { db } from "@workspace/db";
import { conversations, messages } from "@workspace/db";
import { eq } from "drizzle-orm";
import { ai } from "@workspace/integrations-gemini-ai";
import {
  CreateGeminiConversationBody,
  GetGeminiConversationParams,
  DeleteGeminiConversationParams,
  ListGeminiMessagesParams,
  SendGeminiMessageParams,
  SendGeminiMessageBody,
  GenerateGeminiImageBody,
} from "@workspace/api-zod";
import { generateImage } from "@workspace/integrations-gemini-ai/image";

const router = Router();

const SYSTEM_PROMPT = `أنت "ExpoGuide AI" — المرشد السياحي الذكي لإكسبو الرياض 2030. أنت تساعد الزوار على:
- اكتشاف الأجنحة الأنسب لاهتماماتهم
- معرفة أوقات الانتظار والكثافة في الأجنحة
- العثور على أفضل المطاعم والمقاهي داخل الإكسبو
- الإجابة على أسئلتهم عن الفعاليات والمعارض

تحدث بالعربية إذا سألك الزائر بالعربية، وبالإنجليزية إذا سألك بالإنجليزية. كن ودوداً، مفيداً، ومختصراً.

إكسبو الرياض 2030 هو الحدث العالمي الكبير الذي يستضيفه المملكة العربية السعودية بشعار "العقول نبتكر، المستقبل نصنعه". يضم أجنحة من دول العالم تعرض التكنولوجيا، الاستدامة، الثقافة، والابتكار.

You are "ExpoGuide AI" — the intelligent tourist guide for Riyadh Expo 2030. Help visitors discover pavilions, check wait times, find restaurants, and explore the expo. Be friendly, concise, and helpful. Respond in the same language the visitor uses.`;

router.get("/gemini/conversations", async (_req, res) => {
  const all = await db
    .select()
    .from(conversations)
    .orderBy(conversations.createdAt);
  res.json(all);
});

router.post("/gemini/conversations", async (req, res) => {
  const body = CreateGeminiConversationBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const [conv] = await db
    .insert(conversations)
    .values({ title: body.data.title })
    .returning();

  res.status(201).json(conv);
});

router.get("/gemini/conversations/:id", async (req, res) => {
  const params = GetGeminiConversationParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }

  const [conv] = await db
    .select()
    .from(conversations)
    .where(eq(conversations.id, params.data.id))
    .limit(1);

  if (!conv) {
    res.status(404).json({ error: "Conversation not found" });
    return;
  }

  const msgs = await db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, conv.id))
    .orderBy(messages.createdAt);

  res.json({ ...conv, messages: msgs });
});

router.delete("/gemini/conversations/:id", async (req, res) => {
  const params = DeleteGeminiConversationParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }

  const [existing] = await db
    .select()
    .from(conversations)
    .where(eq(conversations.id, params.data.id))
    .limit(1);

  if (!existing) {
    res.status(404).json({ error: "Conversation not found" });
    return;
  }

  await db.delete(conversations).where(eq(conversations.id, params.data.id));
  res.status(204).end();
});

router.get("/gemini/conversations/:id/messages", async (req, res) => {
  const params = ListGeminiMessagesParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }

  const msgs = await db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, params.data.id))
    .orderBy(messages.createdAt);

  res.json(msgs);
});

router.post("/gemini/conversations/:id/messages", async (req, res) => {
  const params = SendGeminiMessageParams.safeParse(req.params);
  const body = SendGeminiMessageBody.safeParse(req.body);

  if (!params.success || !body.success) {
    res.status(400).json({ error: "Invalid request" });
    return;
  }

  const [conv] = await db
    .select()
    .from(conversations)
    .where(eq(conversations.id, params.data.id))
    .limit(1);

  if (!conv) {
    res.status(404).json({ error: "Conversation not found" });
    return;
  }

  // Save user message
  await db.insert(messages).values({
    conversationId: conv.id,
    role: "user",
    content: body.data.content,
  });

  // Load conversation history
  const history = await db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, conv.id))
    .orderBy(messages.createdAt);

  // Set up SSE
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const chatMessages = [
    { role: "user" as const, parts: [{ text: SYSTEM_PROMPT }] },
    ...history.map((m) => ({
      role: (m.role === "assistant" ? "model" : "user") as "user" | "model",
      parts: [{ text: m.content }],
    })),
  ];

  let fullResponse = "";

  try {
    const stream = await ai.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents: chatMessages,
      config: { maxOutputTokens: 8192 },
    });

    for await (const chunk of stream) {
      const text = chunk.text;
      if (text) {
        fullResponse += text;
        res.write(`data: ${JSON.stringify({ content: text })}\n\n`);
      }
    }

    // Save assistant response
    await db.insert(messages).values({
      conversationId: conv.id,
      role: "assistant",
      content: fullResponse,
    });

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (err) {
    res.write(`data: ${JSON.stringify({ error: "AI error", done: true })}\n\n`);
    res.end();
  }
});

router.post("/gemini/generate-image", async (req, res) => {
  const body = GenerateGeminiImageBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const result = await generateImage(body.data.prompt);
  res.json(result);
});

export default router;
