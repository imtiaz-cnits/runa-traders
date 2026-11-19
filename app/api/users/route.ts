import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser, hashPassword } from "@/lib/auth";
import { logUserActivity } from "@/lib/logger";
import {
  getAllPermissionsObject,
  isSuperAdminRole,
  isTopSuperAdmin,
  isTopSuperAdminEmail,
} from "@/lib/permissions";

// GET: All Users (Ordered descending by ID as per PROJECT_RULES - Strictly Super Admin Only)
export async function GET(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser || (!isSuperAdminRole(authUser.role) && !isTopSuperAdmin(authUser))) {
      return NextResponse.json({ status: "fail", message: "Unauthorized - Super Admin only" }, { status: 403 });
    }

    const callerIsTopAdmin = isTopSuperAdmin(authUser);

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

    const visibleUsers = callerIsTopAdmin
      ? users
      : users.filter((u) => !isTopSuperAdmin(u) && !isSuperAdminRole(u.role));

    const serializedUsers = visibleUsers.map((u) => {
      const targetIsTopAdmin = isTopSuperAdmin(u);
      return {
        ...u,
        id: Number(u.id),
        role: targetIsTopAdmin ? "super_admin" : u.role,
        status: targetIsTopAdmin ? "approved" : u.status,
        permissions: targetIsTopAdmin
          ? getAllPermissionsObject(true)
          : u.permissions
            ? JSON.parse(u.permissions)
            : null,
      };
    });

    return NextResponse.json({
      status: "success",
      data: serializedUsers,
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: "fail", message: error?.message || "Failed to load users" },
      { status: 500 }
    );
  }
}

// POST: Create User (Strictly Super Admin Only)
export async function POST(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser || (!isSuperAdminRole(authUser.role) && !isTopSuperAdmin(authUser))) {
      return NextResponse.json({ status: "fail", message: "Unauthorized - Super Admin only" }, { status: 403 });
    }

    const body = await req.json();
    const { name, email, mobile, password, role, status, permissions, img_url } = body;

    if (!name || !mobile || !password || !role) {
      return NextResponse.json(
        { status: "fail", message: "Name, mobile, password, and role are required" },
        { status: 400 }
      );
    }

    const trimmedEmail = email ? String(email).trim() : null;
    const trimmedMobile = String(mobile).trim();

    if (trimmedEmail && isTopSuperAdminEmail(trimmedEmail)) {
      return NextResponse.json(
        { status: "fail", message: "This email address is reserved for the top-level Super Admin." },
        { status: 403 }
      );
    }

    // Check duplicate mobile / email
    const existingMobile = await prisma.users.findFirst({ where: { mobile: trimmedMobile } });
    if (existingMobile) {
      return NextResponse.json(
        { status: "fail", message: "Mobile number already in use" },
        { status: 400 }
      );
    }

    if (trimmedEmail) {
      const existing = await prisma.users.findFirst({ where: { email: trimmedEmail } });
      if (existing) {
        return NextResponse.json(
          { status: "fail", message: "Email already in use" },
          { status: 400 }
        );
      }
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await prisma.users.create({
      data: {
        name: String(name).trim(),
        email: trimmedEmail,
        mobile: trimmedMobile,
        password: hashedPassword,
        role: isSuperAdminRole(role) ? "admin" : role,
        status: status || "approved",
        img_url: img_url || null,
        otp: "000000",
        permissions: permissions ? JSON.stringify(permissions) : null,
      },
    });

    await logUserActivity({
      req,
      userId: authUser.id,
      userName: authUser.name,
      userEmail: authUser.email,
      userRole: authUser.role,
      action: "CREATE",
      module: "Users",
      description: `Created new system user "${newUser.name}" (Role: ${newUser.role}, Mobile: ${newUser.mobile}).`,
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
  } catch (error: any) {
    return NextResponse.json(
      { status: "fail", message: error?.message || "Failed to create user" },
      { status: 500 }
    );
  }
}
