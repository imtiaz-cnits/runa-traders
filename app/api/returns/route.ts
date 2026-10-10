import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

// GET: All Sales Returns (Rule 4.1: id desc)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim().toLowerCase();

    const returns = await prisma.product_returns.findMany({
      orderBy: { id: "desc" },
      include: {
        customers: {
          select: {
            id: true,
            customer_name: true,
            mobile: true,
          },
        },
        orders: {
          select: {
            id: true,
            order_no: true,
          },
        },
      },
    });

    let formatted = returns.map((r) => ({
      id: Number(r.id),
      order_id: Number(r.order_id),
      order_no: r.orders?.order_no || `#ORD-${r.order_id}`,
      customer_id: Number(r.customer_id),
      customer_name: r.customers?.customer_name || "Customer",
      customer_mobile: r.customers?.mobile || "",
      product_id: r.product_id ? Number(r.product_id) : null,
      quantity: r.quantity || 1,
      amount: parseFloat(String(r.amount || 0)),
      discount_amount: parseFloat(String(r.discount_amount || 0)),
      due_amount: parseFloat(String(r.due_amount || 0)),
      date: r.date,
      created_at: r.created_at,
    }));

    if (search) {
      formatted = formatted.filter(
        (r) =>
          r.order_no.toLowerCase().includes(search) ||
          r.customer_name.toLowerCase().includes(search) ||
          r.customer_mobile.includes(search)
      );
    }

    const totalReturnAmount = formatted.reduce((sum, r) => sum + r.amount, 0);
    const totalQtyReturned = formatted.reduce((sum, r) => sum + r.quantity, 0);

    return NextResponse.json({
      status: "success",
      summary: {
        total_records: formatted.length,
        total_amount: totalReturnAmount,
        total_quantity: totalQtyReturned,
      },
      data: formatted,
    });
  } catch (error: any) {
    console.error("Sales Returns GET Error:", error);
    return NextResponse.json(
      { status: "fail", message: error?.message || "Failed to load returns" },
      { status: 500 }
    );
  }
}

// POST: Record New Sales Return
export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    const fallbackUser = await prisma.users.findFirst({ select: { id: true } });
    const userId = user?.id || (fallbackUser ? Number(fallbackUser.id) : 1);

    const body = await req.json();
    const { order_id, product_id, quantity, amount, note, date } = body;

    if (!order_id || !amount) {
      return NextResponse.json(
        { status: "fail", message: "Order ID and return amount are required!" },
        { status: 400 }
      );
    }

    const order = await prisma.orders.findUnique({
      where: { id: BigInt(order_id) },
    });

    if (!order) {
      return NextResponse.json(
        { status: "fail", message: "Order not found!" },
        { status: 404 }
      );
    }

    const returnQty = parseInt(String(quantity || 1), 10);
    const returnAmount = parseFloat(String(amount || 0));
    const returnDate = date || new Date().toISOString().split("T")[0];

    // Atomic transaction: Record return, increment product stock, update order return adjustment
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create product return record
      const createdReturn = await tx.product_returns.create({
        data: {
          order_id: BigInt(order_id),
          customer_id: order.customer_id || BigInt(1),
          product_id: product_id ? BigInt(product_id) : null,
          quantity: returnQty,
          amount: String(returnAmount),
          discount_amount: "0.00",
          due_amount: "0.00",
          date: returnDate,
          user_id: BigInt(userId),
        },
      });

      // 2. Restore stock back to products if product_id is provided
      if (product_id) {
        const prod = await tx.products.findUnique({
          where: { id: BigInt(product_id) },
        });

        if (prod) {
          const currentStock = parseFloat(String(prod.quantity || 0));
          await tx.products.update({
            where: { id: BigInt(product_id) },
            data: {
              quantity: String(currentStock + returnQty),
            },
          });
        }
      }

      // 3. Update order return adjustment
      const currentAdjustment = parseFloat(String(order.return_adjustment_amount || 0));
      await tx.orders.update({
        where: { id: BigInt(order_id) },
        data: {
          return_adjustment_amount: currentAdjustment + returnAmount,
        },
      });

      return createdReturn;
    });

    return NextResponse.json({
      status: "success",
      message: "Sales return processed and stock restored successfully",
      data: {
        id: Number(result.id),
      },
    });
  } catch (error: any) {
    console.error("Sales Return Create Error:", error);
    return NextResponse.json(
      { status: "fail", message: error?.message || "Failed to process return" },
      { status: 500 }
    );
  }
}
