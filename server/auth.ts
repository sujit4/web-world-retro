import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Number of salt rounds for bcrypt
const SALT_ROUNDS = 10;

// JWT configuration
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt-key-for-development-only';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

/**
 * Hash a password using bcrypt
 * @param password Plain text password
 * @returns Hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Verify a password against a hash
 * @param password Plain text password to verify
 * @param hash Hashed password to compare against
 * @returns Boolean indicating if the password matches
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Generate a JWT token for a user
 * @param userId User ID
 * @param username Username
 * @returns JWT token
 */
export function generateToken(userId: number, username: string): string {
  return jwt.sign(
    { userId, username },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
  );
}

/**
 * Verify and decode a JWT token
 * @param token JWT token to verify
 * @returns Decoded token payload or null if invalid
 */
export function verifyToken(token: string): { userId: number; username: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; username: string };
    return decoded;
  } catch (error) {
    return null;
  }
}