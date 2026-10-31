import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export const JWT_SECRET =
  process.env.JWT_SECRET || "runa_traders_super_secret_jwt_key_2026_codenext_it";

export const TOKEN_MAX_AGE_SECONDS = 24 * 60 * 60; // 24 hours

export interface TokenPayload {
  userId: number;
  email: string | null;
  name: string;
  role: string;
  iat?: number;
  exp?: number;
}

/**
 * Hash password with bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Compare password with hash (supports both standard $2a$ and Laravel $2y$ hashes)
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  if (!password || !hash) return false;
  const normalizedHash = hash.startsWith("$2y$") ? "$2a$" + hash.slice(4) : hash;
  return bcrypt.compare(password, normalizedHash);
}

/**
 * Sign JWT token (24h expiration)
 */
export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });
}

/**
 * Verify JWT token and enforce strict 24h max lifetime
 */
export function verifyToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    if (!decoded || !decoded.userId) return null;

    // Enforce 24h max age even for legacy tokens issued with longer expiry
    if (decoded.iat) {
      const nowSec = Math.floor(Date.now() / 1000);
      if (nowSec - decoded.iat > TOKEN_MAX_AGE_SECONDS) {
        return null;
      }
    }

    return decoded;
  } catch {
    return null;
  }
}

/**
 * Get authenticated user from request (checks Authorization header and Cookies)
 */
export async function getAuthUser(req?: NextRequest) {
  try {
    let token: string | undefined;

    if (req) {
      const authHeader = req.headers.get("authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7);
      } else {
        token = req.cookies.get("token")?.value;
      }
    } else {
      const cookieStore = await cookies();
      token = cookieStore.get("token")?.value;
    }

    if (!token) return null;

    const payload = verifyToken(token);
    if (!payload || !payload.userId) return null;

    const user = await prisma.users.findUnique({
      where: { id: BigInt(payload.userId) },
      select: {
        id: true,
        name: true,
        email: true,
        mobile: true,
        role: true,
        status: true,
        permissions: true,
        img_url: true,
      },
    });

    if (!user || user.status !== "approved") return null;

    return {
      ...user,
      id: Number(user.id),
      permissions: user.permissions ? JSON.parse(user.permissions) : null,
    };
  } catch (error) {
    console.error("Auth check failed:", error);
    return null;
  }
}
