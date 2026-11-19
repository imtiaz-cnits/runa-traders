import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { getAuthUser } from "@/lib/auth";
import {
  isAdminOrSuperAdmin,
  isStaffExcludedUser,
  isSuperAdminRole,
  isTopSuperAdminEmail,
} from "@/lib/permissions";

export const dynamic = "force-dynamic";

function canManageStaff(authUser: { role: string; permissions?: Record<string, boolean> | null }) {
  return (
    isAdminOrSuperAdmin(authUser.role) ||
    authUser.role.toLowerCase() === "manager" ||
    authUser.permissions?.staff_payroll === true
  );
}

// GET: All Staff & Employees (excludes top-level super admin & non-staff system accounts)
export async function GET(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return NextResponse.json(
        { status: "fail", message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim().toLowerCase();

    const staffMembers = await prisma.users.findMany({
      orderBy: { id: "desc" },
      include: {
        expenses_expenses_staff_idTousers: {
          select: {
            id: true,
            expense_amount: true,
            date: true,
          },
        },
      },
    });

    let formatted = staffMembers
      .filter((s) => !isStaffExcludedUser(s))
      .map((s) => {
        const totalPaid = s.expenses_expenses_staff_idTousers.reduce(
          (sum, e) => sum + parseFloat(String(e.expense_amount || 0)),
          0
        );

        return {
          id: Number(s.id),
          name: s.name,
          email: s.email,
          mobile: s.mobile,
          role: s.role || "staff",
          status: s.status,
          total_salary_paid: totalPaid,
          total_payout_count: s.expenses_expenses_staff_idTousers.length,
          created_at: s.created_at,
        };
      });

    if (search) {
      formatted = formatted.filter(
        (s) =>
          s.name.toLowerCase().includes(search) ||
          (s.mobile && s.mobile.includes(search)) ||
          s.role.toLowerCase().includes(search)
      );
    }

    return NextResponse.json({
      status: "success",
      data: formatted,
    });
  } catch (error: any) {
    console.error("Staff GET Error:", error);
    return NextResponse.json(
      { status: "fail", message: error?.message || "Failed to load staff" },
      { status: 500 }
    );
  }
}

// POST: Add New Staff Member
export async function POST(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return NextResponse.json(
        { status: "fail", message: "Unauthorized" },
        { status: 401 }
      );
    }
    if (!canManageStaff(authUser)) {
      return NextResponse.json(
        { status: "fail", message: "Forbidden - Insufficient permissions to add staff" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { name, mobile, email, role, password, status } = body;

    if (!name || !mobile) {
      return NextResponse.json(
        { status: "fail", message: "Staff name and mobile number are required!" },
        { status: 400 }
      );
    }

    const trimmedEmail = email ? String(email).trim() : null;
    const trimmedMobile = String(mobile).trim();
    const requestedRole = String(role || "staff").trim().toLowerCase();

    if (trimmedEmail && isTopSuperAdminEmail(trimmedEmail)) {
      return NextResponse.json(
        { status: "fail", message: "This email address is reserved and cannot be used." },
        { status: 403 }
      );
    }

    if (isSuperAdminRole(requestedRole)) {
      return NextResponse.json(
        { status: "fail", message: "Super Admin accounts cannot be created from Staff & Payroll." },
        { status: 403 }
      );
    }

    const safeRole =
      requestedRole === "admin" && !isAdminOrSuperAdmin(authUser.role)
        ? "staff"
        : requestedRole;

    const existingMobile = await prisma.users.findFirst({
      where: { mobile: trimmedMobile },
      select: { id: true },
    });
    if (existingMobile) {
      return NextResponse.json(
        { status: "fail", message: "Mobile number is already registered!" },
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
          { status: "fail", message: "Email address is already in use!" },
          { status: 400 }
        );
      }
    }

    const defaultPass = password || "123456";
    const hashedPassword = await bcrypt.hash(defaultPass, 10);

    const newStaff = await prisma.users.create({
      data: {
        name: String(name).trim(),
        mobile: trimmedMobile,
        email: trimmedEmail,
        role: safeRole,
        password: hashedPassword,
        status: status || "approved",
        otp: "0",
      },
    });

    return NextResponse.json({
      status: "success",
      message: "Staff member created successfully",
      data: {
        id: Number(newStaff.id),
        name: newStaff.name,
        mobile: newStaff.mobile,
        email: newStaff.email,
        role: newStaff.role,
        status: newStaff.status,
      },
    });
  } catch (error: any) {
    console.error("Staff Create Error:", error);
    return NextResponse.json(
      { status: "fail", message: error?.message || "Failed to create staff" },
      { status: 500 }
    );
  }
}
