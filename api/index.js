var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
var __filename, __dirname, vite_config_default;
var init_vite_config = __esm({
  "vite.config.ts"() {
    "use strict";
    __filename = fileURLToPath(import.meta.url);
    __dirname = path.dirname(__filename);
    vite_config_default = defineConfig({
      plugins: [react()],
      resolve: {
        alias: {
          "@": path.resolve(__dirname, "./client/src")
        }
      },
      root: path.resolve(__dirname, "./client"),
      server: {
        port: 3e3
      },
      build: {
        outDir: path.resolve(__dirname, "dist"),
        emptyOutDir: true
      }
    });
  }
});

// server/vite.ts
var vite_exports = {};
__export(vite_exports, {
  log: () => log,
  serveStatic: () => serveStatic,
  setupVite: () => setupVite
});
import express from "express";
import fs from "fs";
import path2, { dirname } from "path";
import { fileURLToPath as fileURLToPath2 } from "url";
import { createServer as createViteServer, createLogger } from "vite";
import { nanoid } from "nanoid";
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        __dirname2,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(__dirname2, "..", "dist", "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}
var __filename2, __dirname2, viteLogger;
var init_vite = __esm({
  "server/vite.ts"() {
    "use strict";
    init_vite_config();
    __filename2 = fileURLToPath2(import.meta.url);
    __dirname2 = dirname(__filename2);
    viteLogger = createLogger();
  }
});

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/auth.ts
import bcrypt from "bcrypt";
var SALT_ROUNDS = 10;
async function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}
async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

// server/storage.ts
var MemStorage = class {
  users;
  currentId;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.currentId = 1;
  }
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  async createUser(insertUser) {
    const id = this.currentId++;
    const hashedPassword = await hashPassword(insertUser.password);
    const user = {
      ...insertUser,
      id,
      password: hashedPassword
      // Store the hashed password
    };
    this.users.set(id, user);
    return user;
  }
  async validateUserCredentials(username, password) {
    const user = await this.getUserByUsername(username);
    if (!user) return void 0;
    const isValid = await verifyPassword(password, user.password);
    return isValid ? user : void 0;
  }
};
var storage = new MemStorage();

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

// server/routes.ts
import { ZodError } from "zod";
import session from "express-session";
import MemoryStore from "memorystore";
var SessionStore = MemoryStore(session);
async function registerRoutes(app2) {
  app2.get("/api/health", (_req, res) => {
    res.status(200).json({ status: "ok", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
  });
  app2.use(
    session({
      secret: process.env.SESSION_SECRET || "super-secret-key-for-development-only",
      resave: false,
      saveUninitialized: false,
      store: new SessionStore({
        checkPeriod: 864e5
        // prune expired entries every 24h
      }),
      cookie: {
        secure: process.env.NODE_ENV === "production",
        // Use secure cookies in production
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        // Required for cross-site cookies in production
        httpOnly: true,
        // Prevent client-side JavaScript from accessing cookies
        maxAge: 24 * 60 * 60 * 1e3
        // 24 hours
      }
    })
  );
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
      if (req.session) {
        req.session.userId = user.id;
        req.session.username = user.username;
      }
      const { password: _, ...userWithoutPassword } = user;
      return res.status(200).json(userWithoutPassword);
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.get("/api/auth/check", (req, res) => {
    if (req.session && req.session.userId) {
      return res.status(200).json({
        authenticated: true,
        username: req.session.username
      });
    }
    return res.status(401).json({ authenticated: false });
  });
  app2.post("/api/auth/logout", (req, res) => {
    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          console.error("Logout error:", err);
          return res.status(500).json({ message: "Failed to logout" });
        }
        res.clearCookie("connect.sid");
        return res.status(200).json({ message: "Logged out successfully" });
      });
    } else {
      return res.status(200).json({ message: "Already logged out" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/index.ts
import helmet from "helmet";
import cors from "cors";
function log2(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
var app = express2();
app.use(helmet({
  contentSecurityPolicy: process.env.NODE_ENV === "production" ? void 0 : false
}));
app.use(cors({
  origin: process.env.VERCEL_URL || process.env.CORS_ORIGIN || "http://localhost:3000",
  credentials: true,
  // Important for cookies/auth
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse && process.env.NODE_ENV !== "production") {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log2(logLine);
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
  if (app.get("env") === "development") {
    const { setupVite: setupVite2 } = await Promise.resolve().then(() => (init_vite(), vite_exports));
    await setupVite2(app, server);
  } else {
    const { serveStatic: serveStatic2 } = await Promise.resolve().then(() => (init_vite(), vite_exports));
    serveStatic2(app);
  }
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3e3;
  server.listen({
    port,
    host: "0.0.0.0"
  }, () => {
    log2(`serving on port ${port}`);
  });
})();
