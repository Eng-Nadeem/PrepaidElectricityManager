import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertMeterSchema, 
  insertTransactionSchema, 
  meters, 
  transactions 
} from "@shared/schema";
import { generateToken } from "../client/src/lib/utils";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // API Routes - all prefixed with /api
  
  // Get recent meters
  app.get('/api/meters/recent', async (req, res) => {
    try {
      const recentMeters = await storage.getRecentMeters();
      res.json(recentMeters);
    } catch (error) {
      console.error('Error fetching recent meters:', error);
      res.status(500).json({ error: 'Failed to fetch recent meters' });
    }
  });

  // Get meter by ID
  app.get('/api/meters/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const meter = await storage.getMeterById(parseInt(id));
      
      if (!meter) {
        return res.status(404).json({ error: 'Meter not found' });
      }
      
      res.json(meter);
    } catch (error) {
      console.error('Error fetching meter:', error);
      res.status(500).json({ error: 'Failed to fetch meter' });
    }
  });

  // Create a new meter
  app.post('/api/meters', async (req, res) => {
    try {
      const validatedData = insertMeterSchema.parse(req.body);
      
      // Check if meter already exists
      const existingMeter = await storage.getMeterByNumber(validatedData.meterNumber);
      
      if (existingMeter) {
        // If it exists and has no nickname but we're providing one, update it
        if (!existingMeter.nickname && validatedData.nickname) {
          const updatedMeter = await storage.updateMeterNickname(
            existingMeter.id,
            validatedData.nickname
          );
          return res.json(updatedMeter);
        }
        // Otherwise just return the existing meter
        return res.json(existingMeter);
      }
      
      // Create new meter
      const newMeter = await storage.createMeter(validatedData);
      res.status(201).json(newMeter);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      console.error('Error creating meter:', error);
      res.status(500).json({ error: 'Failed to create meter' });
    }
  });

  // Get all transactions with optional filtering
  app.get('/api/transactions', async (req, res) => {
    try {
      const status = req.query.status as string | undefined;
      const transactions = await storage.getTransactions(status);
      res.json(transactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      res.status(500).json({ error: 'Failed to fetch transactions' });
    }
  });

  // Get recent transactions
  app.get('/api/transactions/recent', async (req, res) => {
    try {
      const recentTransactions = await storage.getRecentTransactions();
      res.json(recentTransactions);
    } catch (error) {
      console.error('Error fetching recent transactions:', error);
      res.status(500).json({ error: 'Failed to fetch recent transactions' });
    }
  });

  // Get transaction by ID
  app.get('/api/transactions/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const transaction = await storage.getTransactionById(parseInt(id));
      
      if (!transaction) {
        return res.status(404).json({ error: 'Transaction not found' });
      }
      
      res.json(transaction);
    } catch (error) {
      console.error('Error fetching transaction:', error);
      res.status(500).json({ error: 'Failed to fetch transaction' });
    }
  });

  // Create a new transaction
  app.post('/api/transactions', async (req, res) => {
    try {
      const transactionData = {
        ...req.body,
        status: Math.random() < 0.9 ? "success" : "failed", // 90% success rate for demo
        token: generateToken(),
      };
      
      const validatedData = insertTransactionSchema.parse(transactionData);
      
      // Process the payment (in a real app, we would integrate with a payment provider here)
      const newTransaction = await storage.createTransaction(validatedData);
      
      res.status(201).json(newTransaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      console.error('Error creating transaction:', error);
      res.status(500).json({ error: 'Failed to create transaction' });
    }
  });

  // Get transaction statistics
  app.get('/api/transactions/stats', async (req, res) => {
    try {
      const stats = await storage.getTransactionStats();
      res.json(stats);
    } catch (error) {
      console.error('Error fetching transaction stats:', error);
      res.status(500).json({ error: 'Failed to fetch transaction stats' });
    }
  });

  // Mock user profile endpoint
  app.get('/api/user/profile', async (req, res) => {
    try {
      const user = await storage.getUserProfile();
      res.json(user);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      res.status(500).json({ error: 'Failed to fetch user profile' });
    }
  });

  return httpServer;
}
