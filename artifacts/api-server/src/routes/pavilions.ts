import { Router } from "express";
import { db } from "@workspace/db";
import { pavilionsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  ListPavilionsQueryParams,
  GetPavilionParams,
  GetRecommendedPavilionsBody,
} from "@workspace/api-zod";

const router = Router();

router.get("/pavilions", async (req, res) => {
  const query = ListPavilionsQueryParams.safeParse(req.query);
  const category = query.success ? query.data.category : undefined;

  const all = await db.select().from(pavilionsTable);

  const filtered = category
    ? all.filter((p) => (p.categories as string[]).includes(category))
    : all;

  res.json(
    filtered.map((p) => ({
      ...p,
      categories: p.categories as string[],
      highlights: p.highlights as string[],
      imageUrl: p.imageUrl ?? null,
    }))
  );
});

router.get("/pavilions/stats", async (_req, res) => {
  const all = await db.select().from(pavilionsTable);

  const categoryCounts: Record<string, number> = {};
  for (const p of all) {
    for (const cat of (p.categories as string[]) ?? []) {
      categoryCounts[cat] = (categoryCounts[cat] ?? 0) + 1;
    }
  }

  // Simulate wait time distribution
  const waitTimes = all.map((_, i) => (i % 3 === 0 ? 5 : i % 3 === 1 ? 20 : 40));
  const avgWaitMinutes =
    waitTimes.reduce((a, b) => a + b, 0) / Math.max(waitTimes.length, 1);
  const lowCrowdCount = waitTimes.filter((w) => w <= 10).length;
  const highCrowdCount = waitTimes.filter((w) => w >= 30).length;

  res.json({
    totalPavilions: all.length,
    categoryCounts,
    avgWaitMinutes: Math.round(avgWaitMinutes),
    lowCrowdCount,
    highCrowdCount,
  });
});

router.post("/pavilions/recommended", async (req, res) => {
  const body = GetRecommendedPavilionsBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const { interests } = body.data;
  const all = await db.select().from(pavilionsTable);

  const scored = all.map((p) => {
    const cats = (p.categories as string[]) ?? [];
    const matched = interests.filter((i) => cats.includes(i));
    return {
      ...p,
      categories: cats,
      highlights: (p.highlights as string[]) ?? [],
      imageUrl: p.imageUrl ?? null,
      relevanceScore: matched.length / Math.max(interests.length, 1),
      matchedInterests: matched,
    };
  });

  scored.sort((a, b) => b.relevanceScore - a.relevanceScore);
  res.json(scored);
});

router.get("/pavilions/:id", async (req, res) => {
  const params = GetPavilionParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }

  const [pavilion] = await db
    .select()
    .from(pavilionsTable)
    .where(eq(pavilionsTable.id, params.data.id))
    .limit(1);

  if (!pavilion) {
    res.status(404).json({ error: "Pavilion not found" });
    return;
  }

  res.json({
    ...pavilion,
    categories: pavilion.categories as string[],
    highlights: pavilion.highlights as string[],
    imageUrl: pavilion.imageUrl ?? null,
  });
});

export default router;
