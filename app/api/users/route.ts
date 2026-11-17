import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser, hashPassword } from "@/lib/auth";
import {
  ALL_SYSTEM_ROLES,
  getRolePresetPermissions,
  isAdminOrSuperAdmin,
  isSuperAdminRole,
} from "@/lib/permissions";

// GET: All Users (Ordered descending by ID as per PROJECT_RULES)
export async function GET(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser || !isAdminOrSuperAdmin(authUser.role)) {
      return NextResponse.json({ status: "fail", message: "Unauthorized" }, { status: 403 });
    }

    const users = await prisma.users.findMany({
      orderBy: { id: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        mobile: true,
        role: true,
        status: true,
        img_url: true,
        permissions: true,
        created_at: true,
      },
    });

    const serializedUsers = users.map((u) => ({
      ...u,
      id: Number(u.id),
      permissions: u.permissions ? JSON.parse(u.permissions) : null,
    }));

    return NextResponse.json({
      status: "success",
      data: serializedUsers,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load users";
    return NextResponse.json(
      { status: "fail", message },
      { status: 500 }
    );
  }
}

// POST: Create User by Admin / Super Admin
export async function POST(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser || !isAdminOrSuperAdmin(authUser.role)) {
      return NextResponse.json({ status: "fail", message: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { name, email, mobile, password, role, status, permissions, img_url } = body;

    if (!name || !mobile || !password || !role) {
      return NextResponse.json(
        { status: "fail", message: "Name, mobile, password, and role are required" },
        { status: 400 }
      );
    }

    const normalizedRole = String(role).trim().toLowerCase();
    if (!(ALL_SYSTEM_ROLES as readonly string[]).includes(normalizedRole)) {
      return NextResponse.json(
        { status: "fail", message: "Invalid role specified" },
        { status: 400 }
      );
    }

    // Strict hierarchy guard: only Super Admin can assign the super_admin role
    if (normalizedRole === "super_admin" && !isSuperAdminRole(authUser.role)) {
      return NextResponse.json(
        { status: "fail", message: "Only Super Admin can assign the Super Admin role." },
        { status: 403 }
      );
    }

    const trimmedMobile = String(mobile).trim();
    const trimmedEmail = typeof email === "string" && email.trim() ? email.trim().toLowerCase() : null;

    // Check duplicates
    const existingMobile = await prisma.users.findFirst({
      where: { mobile: trimmedMobile },
      select: { id: true },
    });
    if (existingMobile) {
      return NextResponse.json(
        { status: "fail", message: "Mobile number already in use" },
        { status: 400 }
      );
    }

    if (trimmedEmail) {
      const existingEmail = await prisma.users.findFirst({
        where: { email: trimmedEmail },
        select: { id: true },
      });
      if (existingEmail) {
        return NextResponse.json(
          { status: "fail", message: "Email already in use" },
          { status: 400 }
        );
      }
    }

    const hashedPassword = await hashPassword(password);
    const resolvedPermissions = permissions || getRolePresetPermissions(normalizedRole);

    const newUser = await prisma.users.create({
      data: {
        name: String(name).trim(),
        email: trimmedEmail,
        mobile: trimmedMobile,
        password: hashedPassword,
        role: normalizedRole,
        status: status === "pending" ? "pending" : "approved",
        img_url: img_url || null,
        otp: "000000",
        permissions: JSON.stringify(resolvedPermissions),
      },
    });

    return NextResponse.json({
      status: "success",
      message: "User created successfully",
      data: {
        id: Number(newUser.id),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create user";
    return NextResponse.json(
      { status: "fail", message },
      { status: 500 }
    );
  }
}
