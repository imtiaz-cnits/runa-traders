import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser, hashPassword } from "@/lib/auth";
import {
  ALL_SYSTEM_ROLES,
  isAdminOrSuperAdmin,
  isSuperAdminRole,
} from "@/lib/permissions";

export const dynamic = "force-dynamic";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser || !isAdminOrSuperAdmin(authUser.role)) {
      return NextResponse.json({ status: "fail", message: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    const targetUserId = BigInt(id);

    const existingUser = await prisma.users.findUnique({
      where: { id: targetUserId },
      select: { id: true, role: true, status: true },
    });

    if (!existingUser) {
      return NextResponse.json({ status: "fail", message: "User not found" }, { status: 404 });
    }

    const callerIsSuperAdmin = isSuperAdminRole(authUser.role);
    const targetIsProtectedAdmin = isAdminOrSuperAdmin(existingUser.role);

    // Hierarchy check: regular Admin cannot edit Admin or Super Admin accounts
    if (!callerIsSuperAdmin && targetIsProtectedAdmin) {
      return NextResponse.json(
        { status: "fail", message: "Only Super Admin can edit Admin or Super Admin accounts." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { name, email, mobile, password, role, status, permissions, img_url } = body;

    let normalizedNewRole: string | undefined;
    if (role !== undefined && role !== null && String(role).trim() !== "") {
      normalizedNewRole = String(role).trim().toLowerCase();
      if (!(ALL_SYSTEM_ROLES as readonly string[]).includes(normalizedNewRole)) {
        return NextResponse.json(
          { status: "fail", message: "Invalid role specified" },
          { status: 400 }
        );
      }
      if (!callerIsSuperAdmin && normalizedNewRole === "super_admin") {
        return NextResponse.json(
          { status: "fail", message: "Only Super Admin can assign the Super Admin role." },
          { status: 403 }
        );
      }
    }

    // Prevent downgrading or disabling the last active Super Admin
    if (isSuperAdminRole(existingUser.role)) {
      const willDemote = normalizedNewRole !== undefined && normalizedNewRole !== "super_admin";
      const willDeactivate = status !== undefined && status !== "approved";
      if (willDemote || willDeactivate) {
        const otherActiveSuperAdmins = await prisma.users.count({
          where: {
            id: { not: targetUserId },
            role: "super_admin",
            status: "approved",
          },
        });
        if (otherActiveSuperAdmins === 0) {
          return NextResponse.json(
            { status: "fail", message: "Cannot downgrade or deactivate the only active Super Admin account." },
            { status: 400 }
          );
        }
      }
    }

    const data: Record<string, unknown> = {};
    if (name) data.name = String(name).trim();
    if (email !== undefined) {
      const trimmedEmail = email ? String(email).trim().toLowerCase() : null;
      if (trimmedEmail) {
        const dupEmail = await prisma.users.findFirst({
          where: { email: trimmedEmail, id: { not: targetUserId } },
          select: { id: true },
        });
        if (dupEmail) {
          return NextResponse.json(
            { status: "fail", message: "Email address is already used by another user." },
            { status: 400 }
          );
        }
      }
      data.email = trimmedEmail;
    }
    if (mobile) {
      const trimmedMobile = String(mobile).trim();
      const dupMobile = await prisma.users.findFirst({
        where: { mobile: trimmedMobile, id: { not: targetUserId } },
        select: { id: true },
      });
      if (dupMobile) {
        return NextResponse.json(
          { status: "fail", message: "Mobile number is already used by another user." },
          { status: 400 }
        );
      }
      data.mobile = trimmedMobile;
    }
    if (password && String(password).trim() !== "") {
      data.password = await hashPassword(String(password));
    }
    if (normalizedNewRole) data.role = normalizedNewRole;
    if (status === "approved" || status === "pending") data.status = status;
    if (img_url !== undefined) data.img_url = img_url || null;
    if (permissions !== undefined) {
      data.permissions = typeof permissions === "object" ? JSON.stringify(permissions) : permissions;
    }

    const updated = await prisma.users.update({
      where: { id: targetUserId },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        mobile: true,
        role: true,
        status: true,
        img_url: true,
        created_at: true,
      },
    });

    return NextResponse.json({
      status: "success",
      message: "User updated successfully",
      data: {
        ...updated,
        id: Number(updated.id),
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update user";
    return NextResponse.json({ status: "fail", message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser || !isAdminOrSuperAdmin(authUser.role)) {
      return NextResponse.json({ status: "fail", message: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    const targetUserId = BigInt(id);

    // Safeguard: Prevent deleting primary system account (ID 1) or currently logged-in user
    if (targetUserId === BigInt(1) || targetUserId === BigInt(authUser.id)) {
      return NextResponse.json(
        { status: "fail", message: "Primary account or currently logged-in account cannot be deleted." },
        { status: 400 }
      );
    }

    const existingUser = await prisma.users.findUnique({
      where: { id: targetUserId },
      select: { id: true, role: true, status: true },
    });

    if (!existingUser) {
      return NextResponse.json({ status: "fail", message: "User not found" }, { status: 404 });
    }

    const callerIsSuperAdmin = isSuperAdminRole(authUser.role);
    const targetIsProtectedAdmin = isAdminOrSuperAdmin(existingUser.role);

    // Hierarchy check: regular Admin cannot delete Admin or Super Admin accounts
    if (!callerIsSuperAdmin && targetIsProtectedAdmin) {
      return NextResponse.json(
        { status: "fail", message: "Only Super Admin can delete Admin or Super Admin accounts." },
        { status: 403 }
      );
    }

    // Prevent deleting the last active Super Admin
    if (isSuperAdminRole(existingUser.role) && existingUser.status === "approved") {
      const otherActiveSuperAdmins = await prisma.users.count({
        where: {
          id: { not: targetUserId },
          role: "super_admin",
          status: "approved",
        },
      });
      if (otherActiveSuperAdmins === 0) {
        return NextResponse.json(
          { status: "fail", message: "Cannot delete the last active Super Admin account." },
          { status: 400 }
        );
      }
    }

    // Safeguard: Check if user has associated transactions
    const [orderCount, purchaseCount] = await Promise.all([
      prisma.orders.count({ where: { user_id: targetUserId } }),
      prisma.purchases.count({ where: { user_id: targetUserId } }),
    ]);

    if (orderCount > 0 || purchaseCount > 0) {
      return NextResponse.json(
        {
          status: "fail",
          message: `Cannot delete user because they have recorded transactions (${orderCount} orders, ${purchaseCount} purchases). Consider setting status to Pending instead.`,
        },
        { status: 400 }
      );
    }

    await prisma.users.delete({
      where: { id: targetUserId },
    });

    return NextResponse.json({
      status: "success",
      message: "User deleted successfully",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete user";
    return NextResponse.json({ status: "fail", message }, { status: 500 });
  }
}
