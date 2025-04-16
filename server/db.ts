import { drizzle } from 'drizzle-orm/neon-serverless';
import { neon } from '@neondatabase/serverless';
import { users, type User, type InsertUser } from "@shared/schema";
import { hashPassword, verifyPassword } from "./auth";
import { eq } from 'drizzle-orm';

// Initialize the database connection
const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { logger: process.env.NODE_ENV !== 'production' });

export class DbStorage {
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const hashedPassword = await hashPassword(insertUser.password);
    const result = await db.insert(users).values({
      username: insertUser.username,
      password: hashedPassword
    }).returning();
    return result[0];
  }

  async validateUserCredentials(username: string, password: string): Promise<User | undefined> {
    const user = await this.getUserByUsername(username);
    if (!user) return undefined;
    
    const isValid = await verifyPassword(password, user.password);
    return isValid ? user : undefined;
  }
}

// Export a single instance to be used throughout the application
export const storage = new DbStorage(); 