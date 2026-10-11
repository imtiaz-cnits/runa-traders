import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const custId = BigInt(id);
    const body = await req.json();

    const { customer_name, mobile, address_details, email, nid, previous_due_amount } = body;

    const updated = await prisma.customers.update({
      where: { id: custId },
      data: {
        customer_name: customer_name !== undefined ? customer_name.trim() : undefined,
        mobile: mobile !== undefined ? mobile.trim() : undefined,
        address_details: address_details !== undefined ? address_details.trim() : undefined,
        email: email !== undefined ? (email ? email.trim() : null) : undefined,
        nid: nid !== undefined ? (nid ? nid.trim() : null) : undefined,
        previous_due_amount:
          previous_due_amount !== undefined ? String(previous_due_amount) : undefined,
      },
    });

    return NextResponse.json({
      status: "success",
      message: "Customer updated successfully",
      data: {
        ...updated,
        id: Number(updated.id),
        user_id: Number(updated.user_id),
        previous_due_amount: parseFloat(updated.previous_due_amount || "0"),
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
    const { id } = await params;
    const custId = BigInt(id);

    // Check if customer has orders
    const orderCount = await prisma.orders.count({
      where: { customer_id: custId },
    });

    if (orderCount > 0) {
      return NextResponse.json(
        {
          status: "fail",
          message: `Cannot delete customer with ${orderCount} associated sales orders.`,
        },
        { status: 400 }
      );
    }

    await prisma.customers.delete({
      where: { id: custId },
    });

    return NextResponse.json({
      status: "success",
      message: "Customer deleted successfully",
    });
  } catch (error: any) {
    return NextResponse.json({ status: "fail", message: error?.message }, { status: 500 });
  }
}
