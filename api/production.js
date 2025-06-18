// server/production.ts
import express from "express";

// server/routes.ts
import { createServer } from "http";

// shared/schema.ts
import { pgTable, text, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  // Passwords are hashed using bcrypt before storage
  password: text("password").notNull()
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true
});

// server/auth.ts
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
var SALT_ROUNDS = 10;
var JWT_SECRET = process.env.JWT_SECRET || "super-secret-jwt-key-for-development-only";
var JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h";
async function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}
async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}
function generateToken(userId, username) {
  return jwt.sign(
    { userId, username },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}
function verifyToken(token) {
  try {
    console.log("JWT Verify - Token length:", token.length);
    console.log("JWT Verify - JWT_SECRET exists:", !!JWT_SECRET);
    console.log("JWT Verify - JWT_SECRET length:", JWT_SECRET.length);
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("JWT Verify - Success:", decoded);
    return decoded;
  } catch (error) {
    console.error("JWT Verify - Error:", error);
    return null;
  }
}

// server/storage.ts
import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool } from "@neondatabase/serverless";
import { eq } from "drizzle-orm";
var PostgresStorage = class {
  db;
  constructor() {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is required");
    }
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    this.db = drizzle(pool);
  }
  async getUser(id) {
    try {
      const result = await this.db.select().from(users).where(eq(users.id, id)).limit(1);
      return result[0];
    } catch (error) {
      console.error("Error getting user by id:", error);
      return void 0;
    }
  }
  async getUserByUsername(username) {
    try {
      const result = await this.db.select().from(users).where(eq(users.username, username)).limit(1);
      return result[0];
    } catch (error) {
      console.error("Error getting user by username:", error);
      return void 0;
    }
  }
  async createUser(insertUser) {
    try {
      const hashedPassword = await hashPassword(insertUser.password);
      const result = await this.db.insert(users).values({
        username: insertUser.username,
        password: hashedPassword
      }).returning();
      return result[0];
    } catch (error) {
      console.error("Error creating user:", error);
      throw new Error("Failed to create user");
    }
  }
  async validateUserCredentials(username, password) {
    try {
      const user = await this.getUserByUsername(username);
      if (!user) return void 0;
      const isValid = await verifyPassword(password, user.password);
      return isValid ? user : void 0;
    } catch (error) {
      console.error("Error validating user credentials:", error);
      return void 0;
    }
  }
};
var storage = new PostgresStorage();

// server/routes.ts
import { ZodError } from "zod";
async function registerRoutes(app2) {
  app2.get("/api/health", (_req, res) => {
    res.status(200).json({ status: "ok", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
  });
  const authenticateToken = (req, res, next) => {
    console.log("JWT Auth Middleware - Path:", req.path);
    console.log("JWT Auth Middleware - Cookies:", req.cookies);
    const token = req.cookies?.["auth-token"];
    console.log("JWT Auth Middleware - Token exists:", !!token);
    if (!token) {
      console.log("JWT Auth Middleware - No token found, continuing without auth");
      return next();
    }
    console.log("JWT Auth Middleware - Attempting to verify token");
    const decoded = verifyToken(token);
    console.log("JWT Auth Middleware - Token verification result:", decoded);
    if (decoded) {
      req.user = decoded;
      console.log("JWT Auth Middleware - User set:", req.user);
    } else {
      console.log("JWT Auth Middleware - Token verification failed");
    }
    next();
  };
  app2.use(authenticateToken);
  const authRateLimit = (windowMs, max) => {
    const ips = /* @__PURE__ */ new Map();
    return (req, res, next) => {
      const ip = req.ip || "unknown";
      const now = Date.now();
      if (!ips.has(ip)) {
        ips.set(ip, { count: 1, resetTime: now + windowMs });
        return next();
      }
      const ipData = ips.get(ip);
      if (now > ipData.resetTime) {
        ipData.count = 1;
        ipData.resetTime = now + windowMs;
        return next();
      }
      ipData.count++;
      if (ipData.count > max) {
        return res.status(429).json({
          message: "Too many requests, please try again later",
          retryAfter: Math.ceil((ipData.resetTime - now) / 1e3)
        });
      }
      next();
    };
  };
  const loginRateLimiter = authRateLimit(15 * 60 * 1e3, 5);
  app2.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(409).json({ message: "Username already exists" });
      }
      const newUser = await storage.createUser(userData);
      const { password, ...userWithoutPassword } = newUser;
      return res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: "Invalid input data",
          errors: error.errors
        });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.post("/api/auth/login", loginRateLimiter, async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      const user = await storage.validateUserCredentials(username, password);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const token = generateToken(user.id, user.username);
      res.cookie("auth-token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 24 * 60 * 60 * 1e3
        // 24 hours
      });
      const { password: _, ...userWithoutPassword } = user;
      return res.status(200).json(userWithoutPassword);
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.get("/api/auth/check", (req, res) => {
    if (req.user) {
      return res.status(200).json({
        authenticated: true,
        username: req.user.username
      });
    }
    return res.status(401).json({ authenticated: false });
  });
  app2.post("/api/auth/logout", (req, res) => {
    res.clearCookie("auth-token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
    });
    return res.status(200).json({ message: "Logged out successfully" });
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/production.ts
import helmet from "helmet";
import cors from "cors";
import path from "path";
import fs from "fs";
import cookieParser from "cookie-parser";
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
var app = express();
app.use(helmet({
  contentSecurityPolicy: process.env.NODE_ENV === "production" ? void 0 : false
}));
var getCorsOrigin = () => {
  if (process.env.CORS_ORIGIN) {
    return process.env.CORS_ORIGIN;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
};
app.use(cors({
  origin: getCorsOrigin(),
  credentials: true,
  // Important for cookies/auth
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use((req, res, next) => {
  const start = Date.now();
  const reqPath = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (reqPath.startsWith("/api")) {
      let logLine = `${req.method} ${reqPath} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse && process.env.NODE_ENV !== "production") {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    console.error(`Server error: ${err.message}`, err.stack);
    if (process.env.NODE_ENV === "production") {
      return res.status(status).json({ message });
    }
    res.status(status).json({
      message,
      error: err.message,
      stack: err.stack
    });
  });
  const distPath = path.resolve(process.cwd(), "dist");
  if (!fs.existsSync(distPath)) {
    log(`Warning: Could not find build directory: ${distPath}`);
    log("Static files will not be served. Make sure to build the client first.");
  } else {
    app.use(express.static(distPath));
    app.use("*", (_req, res) => {
      res.sendFile(path.resolve(distPath, "index.html"));
    });
    log("Serving static files from dist directory");
  }
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3e3;
  server.listen({
    port,
    host: "0.0.0.0"
  }, () => {
    log(`serving on port ${port}`);
  });
})();
