import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyPassword, signToken, TOKEN_MAX_AGE_SECONDS } from "@/lib/auth";
import { logUserActivity } from "@/lib/logger";
import { getAllPermissionsObject, isTopSuperAdminEmail } from "@/lib/permissions";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { status: "fail", message: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await prisma.users.findFirst({
      where: {
        OR: [{ email: email.trim() }, { mobile: email.trim() }],
      },
    });

    if (!user) {
      return NextResponse.json(
        { status: "fail", message: "Invalid user credentials" },
        { status: 401 }
      );
    }

    const isTopAdmin = isTopSuperAdminEmail(user.email);

    if (!isTopAdmin && user.status !== "approved") {
      return NextResponse.json(
        { status: "fail", message: "Your account is pending or disabled" },
        { status: 403 }
      );
    }

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { status: "fail", message: "Incorrect password" },
        { status: 401 }
      );
    }

    const effectiveRole = isTopAdmin ? "super_admin" : user.role;

    const token = signToken({
      userId: Number(user.id),
      email: user.email,
      name: user.name,
      role: effectiveRole,
    });

    const permissions = isTopAdmin
      ? getAllPermissionsObject(true)
      : user.permissions
        ? JSON.parse(user.permissions)
        : null;

    // Log User Login Activity
    await logUserActivity({
      req,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userRole: effectiveRole,
      action: "LOGIN",
      module: "Auth",
      description: `User "${user.name}" (${effectiveRole}) logged into the system.`,
    });

    const response = NextResponse.json({
      status: "success",
      message: "Login Successful",
      token,
      role: effectiveRole,
      user: {
        id: Number(user.id),
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: effectiveRole,
        img_url: user.img_url,
      },
      permissions,
    });

    // Set HTTP-only Cookie for 24 hours
    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: TOKEN_MAX_AGE_SECONDS, // 24 hours
    });

    return response;
  } catch (error: any) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { status: "fail", message: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
