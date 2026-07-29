import { Router } from "express";
import { db } from "@workspace/db";
import { pavilionsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { GetQueueStatusByPavilionParams } from "@workspace/api-zod";

const router = Router();

// Simulate live queue data with realistic variation
function generateQueueData(
  pavilionId: number,
  pavilionName: string
): {
  pavilionId: number;
  pavilionName: string;
  waitMinutes: number;
  crowdLevel: string;
  crowdPercent: number;
  lastUpdated: string;
  trend: string;
} {
  const seed = (pavilionId * 17 + Math.floor(Date.now() / 60000)) % 100;
  const waitMinutes = 5 + (seed % 55); // 5–60 min
  const crowdPercent = 20 + (seed % 75); // 20–95%
  const crowdLevel =
    crowdPercent < 40 ? "low" : crowdPercent < 70 ? "medium" : "high";
  const trends = ["increasing", "stable", "decreasing"];
  const trend = trends[seed % 3];

  return {
    pavilionId,
    pavilionName,
    waitMinutes,
    crowdLevel,
    crowdPercent,
    lastUpdated: new Date().toISOString(),
    trend,
  };
}

router.get("/queue/status", async (_req, res) => {
  const pavilions = await db.select().from(pavilionsTable);
  const statuses = pavilions.map((p) => generateQueueData(p.id, p.name));
  statuses.sort((a, b) => a.waitMinutes - b.waitMinutes);
  res.json(statuses);
});

router.get("/queue/status/:pavilionId", async (req, res) => {
  const params = GetQueueStatusByPavilionParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Invalid pavilion ID" });
    return;
  }

  const [pavilion] = await db
    .select()
    .from(pavilionsTable)
    .where(eq(pavilionsTable.id, params.data.pavilionId))
    .limit(1);

  if (!pavilion) {
    res.status(404).json({ error: "Pavilion not found" });
    return;
  }

  res.json(generateQueueData(pavilion.id, pavilion.name));
});

export default router;
