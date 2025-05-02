import { pgTable, text, serial, integer, timestamp, decimal, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Meters table
export const meters = pgTable("meters", {
  id: serial("id").primaryKey(),
  meterNumber: text("meter_number").notNull().unique(),
  nickname: text("nickname"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export const insertMeterSchema = createInsertSchema(meters).pick({
  meterNumber: true,
  nickname: true,
});

export type InsertMeter = z.infer<typeof insertMeterSchema>;
export type Meter = typeof meters.$inferSelect;

// Transactions table
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  meterNumber: text("meter_number").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"),
  paymentMethod: text("payment_method").notNull().default("card"),
  token: text("token"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const insertTransactionSchema = createInsertSchema(transactions).pick({
  meterNumber: true,
  amount: true,
  total: true,
  status: true,
  paymentMethod: true,
  token: true,
});

export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;

// Define relations
export const metersRelations = relations(meters, ({ many }) => ({
  transactions: many(transactions)
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  meter: one(meters, {
    fields: [transactions.meterNumber],
    references: [meters.meterNumber],
  })
}));
