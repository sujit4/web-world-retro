import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema } from "@shared/schema";
import { ZodError } from "zod";
import { generateToken, verifyToken } from "./auth";

// Extend the Request type to include our custom properties
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        username: string;
      };
    }
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Add a health check endpoint
  app.get('/api/health', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // JWT Authentication middleware
  const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    console.log('JWT Auth Middleware - Path:', req.path);
    console.log('JWT Auth Middleware - Cookies:', req.cookies);
    
    const token = req.cookies?.['auth-token'];
    console.log('JWT Auth Middleware - Token exists:', !!token);
    
    if (!token) {
      console.log('JWT Auth Middleware - No token found, continuing without auth');
      return next(); // Continue without authentication for public routes
    }

    console.log('JWT Auth Middleware - Attempting to verify token');
    const decoded = verifyToken(token);
    console.log('JWT Auth Middleware - Token verification result:', decoded);
    
    if (decoded) {
      req.user = decoded;
      console.log('JWT Auth Middleware - User set:', req.user);
    } else {
      console.log('JWT Auth Middleware - Token verification failed');
    }
    
    next();
  };

  // Apply JWT middleware to all routes
  app.use(authenticateToken);

  // Rate limiting for auth endpoints
  const authRateLimit = (windowMs: number, max: number) => {
    const ips = new Map<string, { count: number, resetTime: number }>();
    
    return (req: Request, res: Response, next: NextFunction) => {
      const ip = req.ip || 'unknown';
      const now = Date.now();
      
      if (!ips.has(ip)) {
        ips.set(ip, { count: 1, resetTime: now + windowMs });
        return next();
      }
      
      const ipData = ips.get(ip)!;
      
      // Reset counter if time window has passed
      if (now > ipData.resetTime) {
        ipData.count = 1;
        ipData.resetTime = now + windowMs;
        return next();
      }
      
      // Increment counter and check limit
      ipData.count++;
      if (ipData.count > max) {
        return res.status(429).json({ 
          message: 'Too many requests, please try again later',
          retryAfter: Math.ceil((ipData.resetTime - now) / 1000)
        });
      }
      
      next();
    };
  };

  // Apply rate limiting to auth endpoints (15 minutes window, 5 max requests)
  const loginRateLimiter = authRateLimit(15 * 60 * 1000, 5);

  // Authentication routes
  app.post('/api/auth/register', async (req: Request, res: Response) => {
    try {
      // Validate the request body against our schema
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(409).json({ message: 'Username already exists' });
      }
      
      // Create the user with hashed password (handled in storage.ts)
      const newUser = await storage.createUser(userData);
      
      // Return the user without the password
      const { password, ...userWithoutPassword } = newUser;
      return res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: 'Invalid input data', 
          errors: error.errors 
        });
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.post('/api/auth/login', loginRateLimiter, async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
      }
      
      // Validate credentials
      const user = await storage.validateUserCredentials(username, password);
      
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      // Generate JWT token
      const token = generateToken(user.id, user.username);
      
      // Set HTTP-only cookie with JWT token
      res.cookie('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      });
      
      // Return the user without the password
      const { password: _, ...userWithoutPassword } = user;
      return res.status(200).json(userWithoutPassword);
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Check if user is authenticated
  app.get('/api/auth/check', (req: Request, res: Response) => {
    if (req.user) {
      return res.status(200).json({
        authenticated: true,
        username: req.user.username
      });
    }
    return res.status(401).json({ authenticated: false });
  });

  // Logout endpoint
  app.post('/api/auth/logout', (req: Request, res: Response) => {
    // Clear the JWT cookie
    res.clearCookie('auth-token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    });
    
    return res.status(200).json({ message: 'Logged out successfully' });
  });

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  const httpServer = createServer(app);

  return httpServer;
}
