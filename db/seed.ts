import { db } from "./index";
import { meters, transactions, users } from "@shared/schema";
import { generateToken } from "../client/src/lib/utils";

async function seed() {
  try {
    console.log("Starting database seeding...");

    // Seed a demo user
    const existingUsers = await db.query.users.findMany();
    if (existingUsers.length === 0) {
      console.log("Creating demo user...");
      await db.insert(users).values({
        username: "demo_user",
        password: "password123", // In a real app, this would be hashed
        createdAt: new Date()
      });
    }

    // Seed sample meters
    const existingMeters = await db.query.meters.findMany();
    if (existingMeters.length === 0) {
      console.log("Creating sample meters...");
      await db.insert(meters).values([
        {
          meterNumber: "12345678901",
          nickname: "Home",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          meterNumber: "09876543210",
          nickname: "Office",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          meterNumber: "55555555555",
          nickname: "Shop",
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]);
    }

    // Seed sample transactions
    const existingTransactions = await db.query.transactions.findMany();
    if (existingTransactions.length === 0) {
      console.log("Creating sample transactions...");
      
      // Create dates for transactions
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const lastWeek = new Date(today);
      lastWeek.setDate(lastWeek.getDate() - 7);
      
      await db.insert(transactions).values([
        {
          meterNumber: "12345678901",
          amount: "20.00",
          total: "20.50",
          status: "success",
          paymentMethod: "card",
          token: generateToken(),
          createdAt: today
        },
        {
          meterNumber: "09876543210",
          amount: "35.00",
          total: "35.50",
          status: "success",
          paymentMethod: "mobile",
          token: generateToken(),
          createdAt: yesterday
        },
        {
          meterNumber: "12345678901",
          amount: "15.00",
          total: "15.50",
          status: "failed",
          paymentMethod: "card",
          token: null,
          createdAt: lastWeek
        },
        {
          meterNumber: "55555555555",
          amount: "50.00",
          total: "50.50",
          status: "success",
          paymentMethod: "mobile",
          token: generateToken(),
          createdAt: lastWeek
        }
      ]);
    }

    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

seed();
