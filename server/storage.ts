import { users, type User, type InsertUser } from "@shared/schema";
import { hashPassword, verifyPassword } from "./auth";
import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool } from "@neondatabase/serverless";
import { eq } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  validateUserCredentials(username: string, password: string): Promise<User | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.currentId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    // Hash the password before storing
    const hashedPassword = await hashPassword(insertUser.password);
    const user: User = {
      ...insertUser,
      id,
      password: hashedPassword // Store the hashed password
    };
    this.users.set(id, user);
    return user;
  }

  async validateUserCredentials(username: string, password: string): Promise<User | undefined> {
    const user = await this.getUserByUsername(username);
    if (!user) return undefined;
    
    // Verify the password against the stored hash
    const isValid = await verifyPassword(password, user.password);
    return isValid ? user : undefined;
  }
}

export class PostgresStorage implements IStorage {
  private db: ReturnType<typeof drizzle>;

  constructor() {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is required");
    }
    
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    this.db = drizzle(pool);
  }

  async getUser(id: number): Promise<User | undefined> {
    try {
      const result = await this.db
        .select()
        .from(users)
        .where(eq(users.id, id))
        .limit(1);
      
      return result[0];
    } catch (error) {
      console.error("Error getting user by id:", error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const result = await this.db
        .select()
        .from(users)
        .where(eq(users.username, username))
        .limit(1);
      
      return result[0];
    } catch (error) {
      console.error("Error getting user by username:", error);
      return undefined;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      // Hash the password before storing
      const hashedPassword = await hashPassword(insertUser.password);
      
      const result = await this.db
        .insert(users)
        .values({
          username: insertUser.username,
          password: hashedPassword,
        })
        .returning();
      
      return result[0];
    } catch (error) {
      console.error("Error creating user:", error);
      throw new Error("Failed to create user");
    }
  }

  async validateUserCredentials(username: string, password: string): Promise<User | undefined> {
    try {
      const user = await this.getUserByUsername(username);
      if (!user) return undefined;
      
      // Verify the password against the stored hash
      const isValid = await verifyPassword(password, user.password);
      return isValid ? user : undefined;
    } catch (error) {
      console.error("Error validating user credentials:", error);
      return undefined;
    }
  }
}

// Use PostgreSQL storage instead of memory storage
export const storage = new PostgresStorage();
