import { db } from "@db";
import { eq, desc, sql, and } from "drizzle-orm";
import { 
  users, 
  meters, 
  transactions, 
  InsertMeter, 
  InsertTransaction 
} from "@shared/schema";

export const storage = {
  // Meter operations
  async getRecentMeters(limit = 5) {
    return db.query.meters.findMany({
      orderBy: desc(meters.updatedAt),
      limit
    });
  },
  
  async getMeterById(id: number) {
    return db.query.meters.findFirst({
      where: eq(meters.id, id)
    });
  },
  
  async getMeterByNumber(meterNumber: string) {
    return db.query.meters.findFirst({
      where: eq(meters.meterNumber, meterNumber)
    });
  },
  
  async createMeter(data: InsertMeter) {
    const result = await db.insert(meters).values({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();
    
    return result[0];
  },
  
  async updateMeterNickname(id: number, nickname: string) {
    const result = await db.update(meters)
      .set({ 
        nickname, 
        updatedAt: new Date() 
      })
      .where(eq(meters.id, id))
      .returning();
      
    return result[0];
  },
  
  // Transaction operations
  async getTransactions(status?: string) {
    if (status && status !== 'all') {
      return db.query.transactions.findMany({
        where: eq(transactions.status, status),
        orderBy: desc(transactions.createdAt)
      });
    }
    
    return db.query.transactions.findMany({
      orderBy: desc(transactions.createdAt)
    });
  },
  
  async getRecentTransactions(limit = 5) {
    return db.query.transactions.findMany({
      orderBy: desc(transactions.createdAt),
      limit
    });
  },
  
  async getTransactionById(id: number) {
    return db.query.transactions.findFirst({
      where: eq(transactions.id, id)
    });
  },
  
  async createTransaction(data: InsertTransaction) {
    // Create the transaction
    const result = await db.insert(transactions).values({
      ...data,
      createdAt: new Date()
    }).returning();
    
    // Update the meter's lastUsed time
    await db.update(meters)
      .set({ updatedAt: new Date() })
      .where(eq(meters.meterNumber, data.meterNumber));
    
    return result[0];
  },
  
  async getTransactionStats() {
    // Get successful transactions total amount and count
    const successfulTransactionsResult = await db.select({
      totalSpent: sql<number>`sum(${transactions.amount})`,
      transactionCount: sql<number>`count(*)`
    })
    .from(transactions)
    .where(eq(transactions.status, 'success'));
    
    const stats = successfulTransactionsResult[0];
    
    return {
      totalSpent: stats.totalSpent || 0,
      transactionCount: stats.transactionCount || 0
    };
  },
  
  // User operations
  async getUserProfile() {
    // In a real app, we'd get this from the session
    // For now, return a mock user profile
    return {
      id: 1,
      username: "demo_user",
    };
  }
};
