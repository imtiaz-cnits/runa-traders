import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { name, logo, status } = body;

    const updated = await prisma.brands.update({
      where: { id: BigInt(id) },
      data: {
        name: name ? name.trim() : undefined,
        logo: logo !== undefined ? logo : undefined,
        status: status || undefined,
      },
    });

    return NextResponse.json({
      status: "success",
      message: "Brand updated successfully",
      data: {
        ...updated,
        id: Number(updated.id),
        user_id: Number(updated.user_id),
      },
    });

  } catch (error: any) {
    return NextResponse.json(
      { status: "fail", message: error?.message || "Failed to update brand" },
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
    await prisma.brands.delete({
      where: { id: BigInt(id) },
    });

    return NextResponse.json({
      status: "success",
      message: "Brand deleted successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: "fail", message: error?.message || "Failed to delete brand" },
      { status: 500 }
    );
  }
}
