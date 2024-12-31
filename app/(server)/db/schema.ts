import {
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  user_id: text("user_id").unique(),
  firstName: varchar("first_name", { length: 255 }),
  lastName: varchar("last_name", { length: 255 }),
  email: varchar("email", { length: 255 }).unique(),
  phone: varchar("phone").unique(),
  address: text("address"),
  unitNumber: text("unit_number"),
  unitType: text("unit_type"),
  createdAt: timestamp("created_at").defaultNow(),
  profile_image_url: text("profile_image_url"),
  country: text("country"),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  user_id: text("user_id"),
  role: text({ enum: ["user", "assistant"] }).notNull(),
  content: text("content"),
  toolInvocations: jsonb("tool_invocations"),
  createdAt: timestamp("created_at").defaultNow(),
});
