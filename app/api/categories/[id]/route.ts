import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { category_name, img_url, status } = body;

    const updated = await prisma.categories.update({
      where: { id: BigInt(id) },
      data: {
        category_name: category_name ? category_name.trim() : undefined,
        img_url: img_url !== undefined ? img_url : undefined,
        status: status || undefined,
      },
    });

    return NextResponse.json({
      status: "success",
      message: "Category updated successfully",
      data: {
        ...updated,
        id: Number(updated.id),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: "fail", message: error?.message || "Failed to update category" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.categories.delete({
      where: { id: BigInt(id) },
    });

    return NextResponse.json({
      status: "success",
      message: "Category deleted successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: "fail", message: error?.message || "Failed to delete category" },
      { status: 500 }
    );
  }
}
