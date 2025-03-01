import { users, type User, type InsertUser } from "@shared/schema";
import { hashPassword, verifyPassword } from "./auth";

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

export const storage = new MemStorage();
