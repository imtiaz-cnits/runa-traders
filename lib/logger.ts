import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export interface LogActivityParams {
  req?: NextRequest;
  userId?: number | bigint | null;
  userName?: string;
  userEmail?: string | null;
  userRole?: string;
  action:
    | "LOGIN"
    | "LOGOUT"
    | "CREATE"
    | "UPDATE"
    | "DELETE"
    | "STOCK_ADJUST"
    | "PASSWORD_CHANGE"
    | "SETTINGS_CHANGE"
    | string;
  module:
    | "Auth"
    | "Users"
    | "Profile"
    | "POS"
    | "Sales"
    | "Inventory"
    | "Purchases"
    | "Customers"
    | "Expenses"
    | "Reports"
    | "Settings"
    | string;
  description: string;
  ipAddress?: string | null;
  userAgent?: string | null;
}

/**
 * Log user activity safely into user_logs table.
 * Never throws an unhandled error so it won't disrupt caller operations.
 */
export async function logUserActivity(params: LogActivityParams): Promise<void> {
  try {
    let ip = params.ipAddress || null;
    let ua = params.userAgent || null;

    if (params.req) {
      if (!ip) {
        ip =
          params.req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
          params.req.headers.get("x-real-ip") ||
          "127.0.0.1";
      }
      if (!ua) {
        ua = params.req.headers.get("user-agent") || null;
      }
    }

    await prisma.user_logs.create({
      data: {
        user_id: params.userId ? BigInt(params.userId) : null,
        user_name: params.userName || "System",
        user_email: params.userEmail || null,
        user_role: params.userRole || "staff",
        action: params.action,
        module: params.module,
        description: params.description,
        ip_address: ip,
        user_agent: ua ? ua.slice(0, 500) : null,
      },
    });
  } catch (err) {
    console.error("Failed to write user activity log:", err);
  }
}
