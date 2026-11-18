import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { logUserActivity } from "@/lib/logger";

export async function POST(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    if (authUser) {
      await logUserActivity({
        req,
        userId: authUser.id,
        userName: authUser.name,
        userEmail: authUser.email,
        userRole: authUser.role,
        action: "LOGOUT",
        module: "Auth",
        description: `User "${authUser.name}" (${authUser.role}) logged out of the system.`,
      });
    }
  } catch {}

  const response = NextResponse.json({
    status: "success",
    message: "Logged out successfully",
  });

  response.cookies.set({
    name: "token",
    value: "",
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });

  return response;
}

export async function GET(req: NextRequest) {
  return POST(req);
}
