import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import {
  ALLOWED_SIGNUP_ROLES,
  getRolePresetPermissions,
  isTopSuperAdminEmail,
} from "@/lib/permissions";

export const dynamic = "force-dynamic";

/**
 * POST /api/auth/signup
 * Public self-registration endpoint. Newly registered accounts always start as
 * `pending` and require Administrator approval before logging in.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { status: "fail", message: "Invalid request payload" },
        { status: 400 }
      );
    }

    const name = typeof body.name === "string" ? body.name.trim() : "";
    const mobile = typeof body.mobile === "string" ? body.mobile.trim() : "";
    const rawEmail = typeof body.email === "string" ? body.email.trim() : "";
    const email = rawEmail.length > 0 ? rawEmail.toLowerCase() : null;
    const password = typeof body.password === "string" ? body.password : "";
    const confirmPassword =
      typeof body.confirmPassword === "string" ? body.confirmPassword : undefined;
    const normalizedRole =
      typeof body.role === "string" && body.role.trim()
        ? body.role.trim().toLowerCase()
        : "staff";

    if (!name || name.length < 2) {
      return NextResponse.json(
        { status: "fail", message: "Full name must be at least 2 characters" },
        { status: 400 }
      );
    }
    if (name.length > 50) {
      return NextResponse.json(
        { status: "fail", message: "Full name must not exceed 50 characters" },
        { status: 400 }
      );
    }

    if (!mobile || !/^[+\d\s-]{6,20}$/.test(mobile)) {
      return NextResponse.json(
        { status: "fail", message: "Please provide a valid mobile number (6-20 digits)" },
        { status: 400 }
      );
    }

    if (email !== null) {
      if (isTopSuperAdminEmail(email)) {
        return NextResponse.json(
          { status: "fail", message: "This email address is reserved and cannot be registered" },
          { status: 403 }
        );
      }
      if (email.length > 50 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return NextResponse.json(
          { status: "fail", message: "Please provide a valid email address (max 50 characters)" },
          { status: 400 }
        );
      }
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        { status: "fail", message: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    if (password.length > 128) {
      return NextResponse.json(
        { status: "fail", message: "Password is too long" },
        { status: 400 }
      );
    }

    if (confirmPassword !== undefined && password !== confirmPassword) {
      return NextResponse.json(
        { status: "fail", message: "Passwords do not match" },
        { status: 400 }
      );
    }

    if (!(ALLOWED_SIGNUP_ROLES as readonly string[]).includes(normalizedRole)) {
      return NextResponse.json(
        { status: "fail", message: "Selected role must be Staff, Manager, or Admin" },
        { status: 400 }
      );
    }

    // Prevent duplicate mobile or email since login queries both fields
    const existingMobile = await prisma.users.findFirst({
      where: { mobile },
      select: { id: true },
    });
    if (existingMobile) {
      return NextResponse.json(
        { status: "fail", message: "Mobile number is already registered" },
        { status: 409 }
      );
    }

    if (email !== null) {
      const existingEmail = await prisma.users.findFirst({
        where: { email },
        select: { id: true },
      });
      if (existingEmail) {
        return NextResponse.json(
          { status: "fail", message: "Email address is already in use" },
          { status: 409 }
        );
      }
    }

    const hashedPassword = await hashPassword(password);
    const defaultPermissions = getRolePresetPermissions(normalizedRole);

    const newUser = await prisma.users.create({
      data: {
        name,
        email,
        mobile,
        password: hashedPassword,
        role: normalizedRole,
        // Strictly enforce pending approval regardless of client input
        status: "pending",
        otp: "000000",
        permissions: JSON.stringify(defaultPermissions),
      },
      select: {
        id: true,
        name: true,
        email: true,
        mobile: true,
        role: true,
        status: true,
        created_at: true,
      },
    });

    return NextResponse.json(
      {
        status: "success",
        message: "Account registered successfully. Pending Administrator approval.",
        data: {
          ...newUser,
          id: Number(newUser.id),
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const prismaError = error as { code?: string; message?: string };
    if (prismaError?.code === "P2002") {
      return NextResponse.json(
        { status: "fail", message: "Email or mobile number already exists" },
        { status: 409 }
      );
    }
    console.error("Signup Error:", error);
    return NextResponse.json(
      { status: "fail", message: prismaError?.message || "Failed to register account" },
      { status: 500 }
    );
  }
}
