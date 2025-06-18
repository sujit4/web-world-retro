import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";

// Simple log function to avoid importing vite module
function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}

const app = express();

// Add security headers
app.use(helmet({
  contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
}));

// Add CORS support
const getCorsOrigin = () => {
  // Prioritize explicitly set CORS_ORIGIN
  if (process.env.CORS_ORIGIN) {
    return process.env.CORS_ORIGIN;
  }
  
  // Fall back to VERCEL_URL with https:// prefix
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  
  // Default for local development
  return 'http://localhost:3000';
};

app.use(cors({
  origin: getCorsOrigin(),
  credentials: true, // Important for cookies/auth
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse && process.env.NODE_ENV !== 'production') {
        // Only log response bodies in non-production environments
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  // Global error handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    
    // Log the error
    console.error(`Server error: ${err.message}`, err.stack);

    // Don't expose error details in production
    if (process.env.NODE_ENV === 'production') {
      return res.status(status).json({ message });
    }
    
    res.status(status).json({ 
      message,
      error: err.message,
      stack: err.stack
    });
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    const { setupVite } = await import("./vite");
    await setupVite(app, server);
  } else {
    // Serve static files in production without importing Vite
    const path = await import("path");
    const fs = await import("fs");
    
    const distPath = path.resolve(process.cwd(), "dist");
    if (!fs.existsSync(distPath)) {
      log(`Warning: Could not find build directory: ${distPath}`);
      log("Static files will not be served. Make sure to build the client first.");
    } else {
      app.use(express.static(distPath));
      app.use("*", (_req: Request, res: Response) => {
        res.sendFile(path.resolve(distPath, "index.html"));
      });
      log("Serving static files from dist directory");
    }
  }

  // Use port from environment variable or default to 3000
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  server.listen({
    port,
    host: "0.0.0.0"
  }, () => {
    log(`serving on port ${port}`);
  });
})();
