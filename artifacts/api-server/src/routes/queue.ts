import { Router } from "express";
import { db } from "@workspace/db";
import { pavilionsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { GetQueueStatusByPavilionParams } from "@workspace/api-zod";
const router = Router();

// ---------------------------------------------------------------------------
// Prediction logic — ported from expo(1).ipynb (RandomForest approximation)
// ---------------------------------------------------------------------------

/**
 * Classify crowd level from people count.
 * Mirrors the notebook: < 70 → low, < 180 → medium, else → high
 */
function classifyCrowd(peopleCount: number): "low" | "medium" | "high" {
  if (peopleCount < 70) return "low";
  if (peopleCount < 180) return "medium";
  return "high";
}

/**
 * Predict wait minutes from queue features.
 * Approximates the RandomForestRegressor trained in expo(1).ipynb.
 *
 * Training features: hour, day (encoded), people_count, queue_length → wait_minutes
 * Derived formula validated against seeded data (e.g. 85 queue → ~35 min).
 */
function predictWaitMinutes(
  hour: number,
  day: string,
  peopleCount: number,
  queueLength: number
): number {
  // Peak hours factor (matches real-world expo rush)
  const peakHours = [10, 11, 12, 13, 18, 19, 20];
  const hourMultiplier = peakHours.includes(hour) ? 1.2 : 0.85;

  // Weekend factor (Friday/Saturday busiest at Riyadh Expo)
  const weekendDays = ["Friday", "Saturday"];
  const dayMultiplier = weekendDays.includes(day) ? 1.15 : 1.0;

  // Core formula: queue_length × rate × time-of-day × day-of-week
  const wait = Math.round(queueLength * 0.41 * hourMultiplier * dayMultiplier);
  return Math.max(3, wait);
}

/**
 * Add ±10% jitter to simulate live sensor variance without pure randomness.
 */
function withJitter(value: number, seed: number): number {
  const jitter = ((seed % 10) - 5) / 100; // ±5%
  return Math.max(1, Math.round(value * (1 + jitter)));
}

// ---------------------------------------------------------------------------
// GET /queue/status  — reads from DB, applies prediction + live jitter
// ---------------------------------------------------------------------------
router.get("/queue/status", async (_req, res) => {
  const pavilions = await db.select().from(pavilionsTable);
  const minuteSeed = Math.floor(Date.now() / 60000);

  const statuses = pavilions.map((p) => {
    const jitterSeed = (p.id * 7 + minuteSeed) % 100;
    const peopleCount = withJitter(p.peopleCount, jitterSeed);
    const queueLength = withJitter(p.queueLength, jitterSeed + 3);
    const waitMinutes = predictWaitMinutes(p.hour, p.day, peopleCount, queueLength);
    const crowdLevel = classifyCrowd(peopleCount);
    const crowdPercent = Math.min(95, Math.round((peopleCount / 350) * 100));

    const trends = ["increasing", "stable", "decreasing"] as const;
    const trend = trends[jitterSeed % 3];

    return {
      pavilionId: p.id,
      pavilionName: p.name,
      waitMinutes,
      crowdLevel,
      crowdPercent,
      peopleCount,
      queueLength,
      hour: p.hour,
      day: p.day,
      lastUpdated: new Date().toISOString(),
      trend,
    };
  });

  statuses.sort((a, b) => a.waitMinutes - b.waitMinutes);
  res.json(statuses);
});

// ---------------------------------------------------------------------------
// GET /queue/status/:pavilionId
// ---------------------------------------------------------------------------
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

  const minuteSeed = Math.floor(Date.now() / 60000);
  const jitterSeed = (pavilion.id * 7 + minuteSeed) % 100;
  const peopleCount = withJitter(pavilion.peopleCount, jitterSeed);
  const queueLength = withJitter(pavilion.queueLength, jitterSeed + 3);
  const waitMinutes = predictWaitMinutes(pavilion.hour, pavilion.day, peopleCount, queueLength);
  const crowdLevel = classifyCrowd(peopleCount);
  const crowdPercent = Math.min(95, Math.round((peopleCount / 350) * 100));
  const trends = ["increasing", "stable", "decreasing"] as const;

  res.json({
    pavilionId: pavilion.id,
    pavilionName: pavilion.name,
    waitMinutes,
    crowdLevel,
    crowdPercent,
    peopleCount,
    queueLength,
    hour: pavilion.hour,
    day: pavilion.day,
    lastUpdated: new Date().toISOString(),
    trend: trends[jitterSeed % 3],
  });
});

// ---------------------------------------------------------------------------
// POST /queue/predict  — standalone prediction endpoint (notebook logic)
// Input: { people_count, hour?, day? }
// Output: { wait_minutes, crowd_level, queue_length, people_count, crowd_percent }
// ---------------------------------------------------------------------------
router.post("/queue/predict", (req, res) => {
  const body = req.body as Record<string, unknown>;
  const people_count = Number(body.people_count);

  if (!Number.isFinite(people_count) || people_count < 0 || people_count > 10000) {
    res.status(400).json({ error: "people_count must be a number between 0 and 10000" });
    return;
  }

  const now = new Date();
  const DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const hour = typeof body.hour === "number" && body.hour >= 0 && body.hour <= 23
    ? body.hour
    : now.getHours();
  const day = typeof body.day === "string" && DAYS.includes(body.day)
    ? body.day
    : DAYS[now.getDay()];

  // Notebook formula: queue_length = people_count × 0.35
  const queue_length = Math.round(people_count * 0.35);
  const crowd_level = classifyCrowd(people_count);
  const wait_minutes = predictWaitMinutes(hour, day, people_count, queue_length);
  const crowd_percent = Math.min(95, Math.round((people_count / 350) * 100));

  res.json({ people_count, queue_length, wait_minutes, crowd_level, crowd_percent, hour, day });
});

export default router;
