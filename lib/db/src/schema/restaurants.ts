import { pgTable, serial, text, numeric, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const restaurantsTable = pgTable("restaurants", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  nameAr: text("name_ar").notNull(),
  cuisine: text("cuisine").notNull(),
  cuisineAr: text("cuisine_ar").notNull(),
  description: text("description").notNull(),
  zone: text("zone").notNull(),
  location: text("location").notNull(),
  priceRange: text("price_range").notNull().default("$$"),
  rating: numeric("rating", { precision: 2, scale: 1 }).notNull().default("4.0"),
  crowdLevel: text("crowd_level").notNull().default("medium"),
  waitMinutes: integer("wait_minutes").notNull().default(10),
  imageUrl: text("image_url"),
  tags: jsonb("tags").$type<string[]>().notNull().default([]),
  openingHours: text("opening_hours").notNull().default("10:00 AM - 11:00 PM"),
});

export const insertRestaurantSchema = createInsertSchema(restaurantsTable).omit({ id: true });
export type InsertRestaurant = z.infer<typeof insertRestaurantSchema>;
export type Restaurant = typeof restaurantsTable.$inferSelect;
