import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { getAuthUser } from "@/lib/auth";
import {
  isAdminOrSuperAdmin,
  isStaffExcludedUser,
  isSuperAdminRole,
  isTopSuperAdmin,
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

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return NextResponse.json({ status: "fail", message: "Unauthorized" }, { status: 401 });
    }
    if (!canManageStaff(authUser)) {
      return NextResponse.json(
        { status: "fail", message: "Forbidden - Insufficient permissions to edit staff" },
        { status: 403 }
      );
    }

    const { id } = await params;
    if (!/^\d+$/.test(id)) {
      return NextResponse.json({ status: "fail", message: "Invalid staff ID" }, { status: 400 });
    }
    const staffId = BigInt(id);

    const targetUser = await prisma.users.findUnique({ where: { id: staffId } });
    if (!targetUser) {
      return NextResponse.json({ status: "fail", message: "Staff member not found" }, { status: 404 });
    }

    // Top-level Super Admin is strictly invisible and untouchable via Staff & Payroll
    if (isTopSuperAdmin(targetUser) || isSuperAdminRole(targetUser.role)) {
      if (!isTopSuperAdmin(authUser)) {
        return NextResponse.json({ status: "fail", message: "Staff member not found" }, { status: 404 });
      }
      return NextResponse.json(
        { status: "fail", message: "Top-level Super Admin account cannot be modified from Staff & Payroll." },
        { status: 403 }
      );
    }

    if (isStaffExcludedUser(targetUser)) {
      return NextResponse.json(
        { status: "fail", message: "This system account is not managed under Staff & Payroll." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { name, mobile, email, role, status, password } = body;

    if (email !== undefined && email && isTopSuperAdminEmail(email)) {
      return NextResponse.json(
        { status: "fail", message: "This email address is reserved and cannot be assigned." },
        { status: 403 }
      );
    }

    if (role !== undefined && isSuperAdminRole(role)) {
      return NextResponse.json(
        { status: "fail", message: "Cannot assign Super Admin role from Staff & Payroll." },
        { status: 403 }
      );
    }

    const dataToUpdate: any = {
      name: name !== undefined ? String(name).trim() : undefined,
      mobile: mobile !== undefined ? String(mobile).trim() : undefined,
      email: email !== undefined ? (email ? String(email).trim() : null) : undefined,
      role:
        role !== undefined
          ? String(role).trim().toLowerCase() === "admin" && !isAdminOrSuperAdmin(authUser.role)
            ? targetUser.role
            : role
          : undefined,
      status: status !== undefined ? status : undefined,
    };

    if (password && String(password).trim()) {
      dataToUpdate.password = await bcrypt.hash(String(password).trim(), 10);
    }

    const updated = await prisma.users.update({
      where: { id: staffId },
      data: dataToUpdate,
    });

    return NextResponse.json({
      status: "success",
      message: "Staff details updated successfully",
      data: {
        id: Number(updated.id),
        name: updated.name,
        mobile: updated.mobile,
        email: updated.email,
        role: updated.role,
        status: updated.status,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ status: "fail", message: error?.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return NextResponse.json({ status: "fail", message: "Unauthorized" }, { status: 401 });
    }
    if (!canManageStaff(authUser)) {
      return NextResponse.json(
        { status: "fail", message: "Forbidden - Insufficient permissions to delete staff" },
        { status: 403 }
      );
    }

    const { id } = await params;
    if (!/^\d+$/.test(id)) {
      return NextResponse.json({ status: "fail", message: "Invalid staff ID" }, { status: 400 });
    }
    const staffId = BigInt(id);

    const targetUser = await prisma.users.findUnique({ where: { id: staffId } });
    if (!targetUser) {
      return NextResponse.json({ status: "fail", message: "Staff member not found" }, { status: 404 });
    }

    // Top-level Super Admin is strictly invisible and undeletable
    if (isTopSuperAdmin(targetUser) || isSuperAdminRole(targetUser.role)) {
      if (!isTopSuperAdmin(authUser)) {
        return NextResponse.json({ status: "fail", message: "Staff member not found" }, { status: 404 });
      }
      return NextResponse.json(
        { status: "fail", message: "Top-level Super Admin account cannot be deleted!" },
        { status: 403 }
      );
    }

    if (isStaffExcludedUser(targetUser)) {
      return NextResponse.json(
        { status: "fail", message: "This system account cannot be deleted from Staff & Payroll." },
        { status: 403 }
      );
    }

    // Prevent deleting primary shop admin or currently logged-in user
    if (staffId === BigInt(1) || staffId === BigInt(authUser.id)) {
      return NextResponse.json(
        { status: "fail", message: "Primary admin or currently logged-in account cannot be deleted!" },
        { status: 400 }
      );
    }

    const [expenseCount, orderCount] = await Promise.all([
      prisma.expenses.count({
        where: { OR: [{ user_id: staffId }, { staff_id: staffId }] },
      }),
      prisma.orders.count({ where: { user_id: staffId } }),
    ]);

    if (expenseCount > 0 || orderCount > 0) {
      return NextResponse.json(
        {
          status: "fail",
          message: `Cannot delete staff member because they have associated records (${expenseCount} expenses, ${orderCount} orders).`,
        },
        { status: 400 }
      );
    }

    await prisma.users.delete({
      where: { id: staffId },
    });

    return NextResponse.json({
      status: "success",
      message: "Staff member deleted successfully",
    });
  } catch (error: any) {
    return NextResponse.json({ status: "fail", message: error?.message }, { status: 500 });
  }
}
