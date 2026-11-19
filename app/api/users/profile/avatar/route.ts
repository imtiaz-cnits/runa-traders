import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { isSuperAdminRole, isTopSuperAdmin } from "@/lib/permissions";
import fs from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return NextResponse.json({ status: "fail", message: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("avatar") as File | null;

    if (!file) {
      return NextResponse.json({ status: "fail", message: "No avatar image file provided" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ status: "fail", message: "Only image files (JPG, PNG, WebP) are allowed" }, { status: 400 });
    }

    // 5MB max
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ status: "fail", message: "Image size must not exceed 5MB" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), "public", "uploads", "avatars");
    await fs.mkdir(uploadDir, { recursive: true });

    let ext = path.extname(file.name).toLowerCase();
    if (!ext || ext === ".") ext = ".jpg";
    const userIdParam = formData.get("userId") as string | null;
    let targetUserId = BigInt(authUser.id);
    if (
      (isTopSuperAdmin(authUser) || isSuperAdminRole(authUser.role)) &&
      userIdParam &&
      userIdParam !== "null" &&
      userIdParam !== "undefined" &&
      /^\d+$/.test(userIdParam)
    ) {
      const requestedTargetId = BigInt(userIdParam);
      if (requestedTargetId !== BigInt(authUser.id)) {
        const targetUser = await prisma.users.findUnique({
          where: { id: requestedTargetId },
          select: { id: true, email: true, role: true },
        });
        if (targetUser && isTopSuperAdmin(targetUser) && !isTopSuperAdmin(authUser)) {
          return NextResponse.json({ status: "fail", message: "User not found" }, { status: 404 });
        }
      }
      targetUserId = requestedTargetId;
    }

    const filename = `avatar-${targetUserId}-${Date.now()}${ext}`;
    const filePath = path.join(uploadDir, filename);

    await fs.writeFile(filePath, buffer);

    const imgUrl = `/uploads/avatars/${filename}`;

    // Update user record in DB if target exists
    if (targetUserId) {
      try {
        await prisma.users.update({
          where: { id: targetUserId },
          data: { img_url: imgUrl },
        });
      } catch {
        // May not exist yet if creating a brand new user
      }
    }

    return NextResponse.json({
      status: "success",
      message: "Profile image uploaded successfully",
      img_url: imgUrl,
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: "fail", message: error?.message || "Failed to upload avatar" },
      { status: 500 }
    );
  }
}
