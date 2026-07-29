import { pgTable, serial, text, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const pavilionsTable = pgTable("pavilions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  nameAr: text("name_ar").notNull(),
  country: text("country").notNull(),
  description: text("description").notNull(),
  descriptionAr: text("description_ar").notNull(),
  categories: jsonb("categories").$type<string[]>().notNull().default([]),
  zone: text("zone").notNull(),
  location: text("location").notNull(),
  imageUrl: text("image_url"),
  highlights: jsonb("highlights").$type<string[]>().notNull().default([]),
  openingHours: text("opening_hours").notNull().default("9:00 AM - 10:00 PM"),
});

export const insertPavilionSchema = createInsertSchema(pavilionsTable).omit({ id: true });
export type InsertPavilion = z.infer<typeof insertPavilionSchema>;
export type Pavilion = typeof pavilionsTable.$inferSelect;
