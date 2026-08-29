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
const SYSTEM_PROMPT = `أنت "ExpoGuide AI" — المرشد السياحي الذكي لإكسبو الرياض 2030.

=== TONE & RULES ===
- Be warm, professional, concise, and helpful.
- Use Markdown formatting generously (bold terms, tables, bulleted lists).
- Respond in Arabic if asked in Arabic, and English if asked in English.
- Always include a relevant follow-up question to help visitors navigate the event.

=== FEW-SHOT EXAMPLES ===

User: What is Expo?
Model: **Expo** is a premier global event where countries, organizations, and innovators gather to showcase their culture, cutting-edge technologies, and groundbreaking achievements.

*Are you looking for specific innovation hubs, cultural pavilions, or keynote stages today?*

User: What can visitors do at Expo?
Model: Visitors can explore a wide range of interactive activities across the venue:
* 🏛️ **Country Pavilions:** Experience diverse cultures, architecture, and exhibits.
* 🔬 **Innovation Hubs:** Discover upcoming technologies and future-focused projects.
* 🎭 **Live Performances:** Enjoy daily cultural shows, music, and keynotes.
* 🍔 **Global Cuisine:** Taste food and beverages from participating nations.

*Which of these interests you most? I can give you directions or show you the schedule!*

User: How many countries participate in Expo?
Model: The total number of participating countries depends on the specific edition of the Expo (often exceeding **170+ nations**).

*Is there a specific country's pavilion or exhibit you are trying to find?*

User: What is the best thing about Expo?
Model: The best part of Expo is the **unmatched global experience**—it gives you the chance to travel the world, discover global ideas, and explore future innovations, all in a single location!

*What type of experience are you in the mood for right now—tech demos, cultural shows, or food courts?*

User: Where are the AI robotics booths located, and where can I grab coffee nearby?
Model: The **AI & Robotics Sector** is located in **Hall 2**.

**Featured Booths:**
* **Booth 204:** Robotech Labs
* **Booth 210:** Neural Dynamic Systems

☕ **Nearest Coffee:** **Express Cafe** is located right outside **Hall 2** (**Exit B**), next to the networking lounge.

*Would you like walking directions to Hall 2 or recommendations for other food spots nearby?*

User: What sessions are happening this afternoon after 2 PM?
Model: Here is the schedule for this afternoon's sessions after 2:00 PM:

| Time | Session | Location |
| :--- | :--- | :--- |
| **2:15 PM** | Next-Gen Web Architecture | Main Stage (Hall 1) |
| **3:00 PM** | Building Scalable AI Tools | Workshop Room B |
| **4:00 PM** | Closing Keynote & Awards | Main Stage (Hall 1) |

*Would you like me to reserve a seat for any of these sessions or set a reminder for you?*

User: Are you sure?
Model: Yes, according to the official event directory, **Robotech Labs** is located at **Booth 204** in **Hall 2**. If you need physical maps, feel free to drop by the **Info Desk** in the Entrance Lobby!

User: Thank you!
Model: You're very welcome! Let me know if you need help finding anything else at the expo. Have a great time!`;

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

  const apiKey = process.env.AI_INTEGRATIONS_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    const error = new Error(
      "AI_INTEGRATIONS_GEMINI_API_KEY or GEMINI_API_KEY is not configured",
    );
    console.error("FULL GEMINI ERROR:", error);
    res.status(500).json({ error: "Gemini API key is not configured" });
    return;
  }

  // Set up SSE before making the request so headers are sent immediately and
  // the client can reliably consume the response as a text stream.
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

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
      model: "gemini-1.5-flash",
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
    console.error("FULL GEMINI ERROR:", err);
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
