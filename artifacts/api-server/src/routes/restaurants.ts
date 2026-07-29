import { Router } from "express";
import { db } from "@workspace/db";
import { restaurantsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { ListRestaurantsQueryParams, GetRestaurantParams } from "@workspace/api-zod";

const router = Router();

router.get("/restaurants", async (req, res) => {
  const query = ListRestaurantsQueryParams.safeParse(req.query);
  const cuisine = query.success ? query.data.cuisine : undefined;
  const zone = query.success ? query.data.zone : undefined;

  let all = await db.select().from(restaurantsTable);

  if (cuisine) all = all.filter((r) => r.cuisine.toLowerCase() === cuisine.toLowerCase());
  if (zone) all = all.filter((r) => r.zone.toLowerCase() === zone.toLowerCase());

  res.json(
    all.map((r) => ({
      ...r,
      rating: Number(r.rating),
      tags: r.tags as string[],
      imageUrl: r.imageUrl ?? null,
    }))
  );
});

router.get("/restaurants/:id", async (req, res) => {
  const params = GetRestaurantParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }

  const [restaurant] = await db
    .select()
    .from(restaurantsTable)
    .where(eq(restaurantsTable.id, params.data.id))
    .limit(1);

  if (!restaurant) {
    res.status(404).json({ error: "Restaurant not found" });
    return;
  }

  res.json({
    ...restaurant,
    rating: Number(restaurant.rating),
    tags: restaurant.tags as string[],
    imageUrl: restaurant.imageUrl ?? null,
  });
});

export default router;
