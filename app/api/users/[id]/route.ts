import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser, hashPassword } from "@/lib/auth";
import { logUserActivity } from "@/lib/logger";
import {
  TOP_SUPER_ADMIN_EMAIL,
  getAllPermissionsObject,
  isSuperAdminRole,
  isTopSuperAdmin,
  isTopSuperAdminEmail,
} from "@/lib/permissions";

export const dynamic = "force-dynamic";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser || (!isSuperAdminRole(authUser.role) && !isTopSuperAdmin(authUser))) {
      return NextResponse.json({ status: "fail", message: "Unauthorized - Super Admin only" }, { status: 403 });
    }

    const { id } = await params;
    if (!/^\d+$/.test(id)) {
      return NextResponse.json({ status: "fail", message: "Invalid user ID" }, { status: 400 });
    }
    const targetUserId = BigInt(id);

    const targetUser = await prisma.users.findUnique({ where: { id: targetUserId } });
    if (!targetUser) {
      return NextResponse.json({ status: "fail", message: "User not found" }, { status: 404 });
    }

    const targetIsTopAdmin = isTopSuperAdmin(targetUser);

    // Nobody except the top-level Super Admin themselves can ever view/edit this account
    if (targetIsTopAdmin && !isTopSuperAdmin(authUser)) {
      return NextResponse.json({ status: "fail", message: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const { name, email, mobile, password, role, status, permissions, img_url } = body;

    if (!targetIsTopAdmin && email !== undefined && email && isTopSuperAdminEmail(email)) {
      return NextResponse.json(
        { status: "fail", message: "This email address is reserved for the top-level Super Admin." },
        { status: 403 }
      );
    }

    const data: any = {};
    if (name) data.name = String(name).trim();
    if (mobile) data.mobile = String(mobile).trim();
    if (password && String(password).trim() !== "") {
      data.password = await hashPassword(password);
    }
    if (img_url !== undefined) data.img_url = img_url || null;

    if (targetIsTopAdmin) {
      // Top-level Super Admin always keeps reserved email, super_admin role, approved status, and full permissions
      data.email = TOP_SUPER_ADMIN_EMAIL;
      data.role = "super_admin";
      data.status = "approved";
      data.permissions = JSON.stringify(getAllPermissionsObject(true));
    } else {
      if (email !== undefined) data.email = email ? String(email).trim() : null;
      if (role) {
        data.role = isSuperAdminRole(role) ? "admin" : role;
      }
      if (status) data.status = status;
      if (permissions !== undefined) {
        data.permissions = typeof permissions === "object" ? JSON.stringify(permissions) : permissions;
      }
    }

    const updated = await prisma.users.update({
      where: { id: targetUserId },
      data,
    });

    await logUserActivity({
      req,
      userId: authUser.id,
      userName: authUser.name,
      userEmail: authUser.email,
      userRole: authUser.role,
      action: "UPDATE",
      module: "Users",
      description: `Updated system user "${updated.name}" (ID: ${updated.id}, Role: ${updated.role}).`,
    });

    return NextResponse.json({
      status: "success",
      message: "User updated successfully",
      data: {
        ...updated,
        id: Number(updated.id),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ status: "fail", message: error?.message || "Failed to update user" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser || (!isSuperAdminRole(authUser.role) && !isTopSuperAdmin(authUser))) {
      return NextResponse.json({ status: "fail", message: "Unauthorized - Super Admin only" }, { status: 403 });
    }

    const { id } = await params;
    if (!/^\d+$/.test(id)) {
      return NextResponse.json({ status: "fail", message: "Invalid user ID" }, { status: 400 });
    }
    const targetUserId = BigInt(id);

    const targetUser = await prisma.users.findUnique({ where: { id: targetUserId } });
    if (!targetUser) {
      return NextResponse.json({ status: "fail", message: "User not found" }, { status: 404 });
    }

    // Safeguard: Top-level Super Admin is strictly invisible to others and can NEVER be deleted by anyone
    if (isTopSuperAdmin(targetUser)) {
      if (!isTopSuperAdmin(authUser)) {
        return NextResponse.json({ status: "fail", message: "User not found" }, { status: 404 });
      }
      return NextResponse.json(
        { status: "fail", message: "Top-level Super Admin account cannot be deleted." },
        { status: 403 }
      );
    }

    if (targetUserId === BigInt(authUser.id)) {
      return NextResponse.json(
        { status: "fail", message: "Currently logged-in account cannot be deleted." },
        { status: 400 }
      );
    }

    // Prefer reassigning historical records to a regular shop admin so top-level Super Admin remains invisible
    const shopAdminFallback = await prisma.users.findFirst({
      where: {
        id: { not: targetUserId },
        role: "admin",
        OR: [{ email: null }, { NOT: { email: TOP_SUPER_ADMIN_EMAIL } }],
      },
      orderBy: { id: "asc" },
      select: { id: true },
    });
    const fallbackUserId = shopAdminFallback?.id ?? BigInt(authUser.id);

    // Reassign foreign key references to active admin so historical records remain safe
    await prisma.$transaction([
      prisma.orders.updateMany({ where: { user_id: targetUserId }, data: { user_id: fallbackUserId } }),
      prisma.order_details.updateMany({ where: { user_id: targetUserId }, data: { user_id: fallbackUserId } }),
      prisma.order_payment_details.updateMany({ where: { user_id: targetUserId }, data: { user_id: fallbackUserId } }),
      prisma.purchases.updateMany({ where: { user_id: targetUserId }, data: { user_id: fallbackUserId } }),
      prisma.purchase_order_details.updateMany({ where: { user_id: targetUserId }, data: { user_id: fallbackUserId } }),
      prisma.purchase_payment_details.updateMany({ where: { user_id: targetUserId }, data: { user_id: fallbackUserId } }),
      prisma.purchase_returns.updateMany({ where: { user_id: targetUserId }, data: { user_id: fallbackUserId } }),
      prisma.challans.updateMany({ where: { user_id: targetUserId }, data: { user_id: fallbackUserId } }),
      prisma.customers.updateMany({ where: { user_id: targetUserId }, data: { user_id: fallbackUserId } }),
      prisma.customer_payment_details.updateMany({ where: { user_id: targetUserId }, data: { user_id: fallbackUserId } }),
      prisma.suppliers.updateMany({ where: { user_id: targetUserId }, data: { user_id: fallbackUserId } }),
      prisma.supplier_due_collections.updateMany({ where: { user_id: targetUserId }, data: { user_id: fallbackUserId } }),
      prisma.products.updateMany({ where: { user_id: targetUserId }, data: { user_id: fallbackUserId } }),
      prisma.product_returns.updateMany({ where: { user_id: targetUserId }, data: { user_id: fallbackUserId } }),
      prisma.categories.updateMany({ where: { user_id: targetUserId }, data: { user_id: fallbackUserId } }),
      prisma.sub_categories.updateMany({ where: { user_id: targetUserId }, data: { user_id: fallbackUserId } }),
      prisma.brands.updateMany({ where: { user_id: targetUserId }, data: { user_id: fallbackUserId } }),
      prisma.units.updateMany({ where: { user_id: targetUserId }, data: { user_id: fallbackUserId } }),
      prisma.expenses.updateMany({ where: { user_id: targetUserId }, data: { user_id: fallbackUserId } }),
      prisma.expenses.updateMany({ where: { staff_id: targetUserId }, data: { staff_id: null } }),
      prisma.expense_types.updateMany({ where: { user_id: targetUserId }, data: { user_id: fallbackUserId } }),
      prisma.locations.updateMany({ where: { user_id: targetUserId }, data: { user_id: fallbackUserId } }),
      prisma.districts.updateMany({ where: { user_id: targetUserId }, data: { user_id: fallbackUserId } }),
      prisma.thanas.updateMany({ where: { user_id: targetUserId }, data: { user_id: fallbackUserId } }),
      prisma.upazilas.updateMany({ where: { user_id: targetUserId }, data: { user_id: fallbackUserId } }),
      prisma.opening_balances.updateMany({ where: { user_id: targetUserId }, data: { user_id: fallbackUserId } }),
      prisma.users.delete({ where: { id: targetUserId } }),
    ]);

    await logUserActivity({
      req,
      userId: authUser.id,
      userName: authUser.name,
      userEmail: authUser.email,
      userRole: authUser.role,
      action: "DELETE",
      module: "Users",
      description: `Deleted system user "${targetUser.name}" (Email: ${targetUser.email || "N/A"}, ID: ${targetUserId}).`,
    });

    return NextResponse.json({
      status: "success",
      message: "User deleted successfully",
    });
  } catch (error: any) {
    return NextResponse.json({ status: "fail", message: error?.message || "Failed to delete user" }, { status: 500 });
  }
}
