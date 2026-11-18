import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { logUserActivity } from "@/lib/logger";

export const dynamic = "force-dynamic";

// GET: Paginated & Filtered User Activity Logs
export async function GET(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser || (authUser.role !== "admin" && authUser.role !== "super_admin")) {
      return NextResponse.json(
        { status: "fail", message: "Unauthorized - Admin or Super Admin only" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const pageSize = Math.max(1, Math.min(200, parseInt(searchParams.get("pageSize") || "20", 10)));
    const search = searchParams.get("search")?.trim() || "";
    const action = searchParams.get("action")?.trim() || "";
    const moduleName = searchParams.get("module")?.trim() || "";
    const userId = searchParams.get("userId")?.trim() || "";
    const startDate = searchParams.get("startDate")?.trim() || "";
    const endDate = searchParams.get("endDate")?.trim() || "";

    const where: any = {};

    if (search) {
      where.OR = [
        { user_name: { contains: search } },
        { user_email: { contains: search } },
        { description: { contains: search } },
        { action: { contains: search } },
        { module: { contains: search } },
        { ip_address: { contains: search } },
      ];
    }

    if (action && action !== "all") {
      where.action = action;
    }

    if (moduleName && moduleName !== "all") {
      where.module = moduleName;
    }

    if (userId && userId !== "all") {
      where.user_id = BigInt(userId);
    }

    if (startDate || endDate) {
      where.created_at = {};
      if (startDate) {
        where.created_at.gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        where.created_at.lte = end;
      }
    }

    const [total, rawLogs, userList] = await Promise.all([
      prisma.user_logs.count({ where }),
      prisma.user_logs.findMany({
        where,
        orderBy: { id: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          users: {
            select: {
              id: true,
              name: true,
              email: true,
              img_url: true,
              role: true,
            },
          },
        },
      }),
      prisma.users.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
        orderBy: { name: "asc" },
      }),
    ]);

    const logs = rawLogs.map((l) => ({
      id: Number(l.id),
      user_id: l.user_id ? Number(l.user_id) : null,
      user_name: l.user_name,
      user_email: l.user_email,
      user_role: l.user_role,
      action: l.action,
      module: l.module,
      description: l.description,
      ip_address: l.ip_address,
      user_agent: l.user_agent,
      created_at: l.created_at.toISOString(),
      img_url: l.users?.img_url || null,
    }));

    const serializedUsers = userList.map((u) => ({
      id: Number(u.id),
      name: u.name,
      email: u.email,
      role: u.role,
    }));

    return NextResponse.json({
      status: "success",
      data: {
        logs,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
        users: serializedUsers,
      },
    });
  } catch (error: any) {
    console.error("GET user_logs error:", error);
    return NextResponse.json(
      { status: "fail", message: error?.message || "Failed to fetch user logs" },
      { status: 500 }
    );
  }
}

// DELETE: Clear All Logs (Super Admin Only)
export async function DELETE(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser || authUser.role !== "super_admin") {
      return NextResponse.json(
        { status: "fail", message: "Unauthorized - Only Super Admin can clear user activity history" },
        { status: 403 }
      );
    }

    await prisma.user_logs.deleteMany({});

    // Record the clear action itself
    await logUserActivity({
      req,
      userId: authUser.id,
      userName: authUser.name,
      userEmail: authUser.email,
      userRole: authUser.role,
      action: "DELETE",
      module: "Settings",
      description: `Super Admin "${authUser.name}" cleared all user history activity logs.`,
    });

    return NextResponse.json({
      status: "success",
      message: "All user activity logs cleared successfully",
    });
  } catch (error: any) {
    console.error("DELETE user_logs error:", error);
    return NextResponse.json(
      { status: "fail", message: error?.message || "Failed to clear logs" },
      { status: 500 }
    );
  }
}
