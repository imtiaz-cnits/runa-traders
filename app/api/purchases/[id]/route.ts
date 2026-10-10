import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const purchaseId = BigInt(id);

    const purchase = await prisma.purchases.findUnique({
      where: { id: purchaseId },
      include: {
        suppliers: true,
        purchase_order_details: {
          include: {
            products: {
              include: {
                units: true,
              },
            },
          },
        },
        purchase_payment_details: true,
        users: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!purchase) {
      return NextResponse.json({ status: "fail", message: "Purchase not found" }, { status: 404 });
    }

    return NextResponse.json({
      status: "success",
      data: {
        id: Number(purchase.id),
        purchase_id: purchase.purchase_id,
        referance_no: purchase.referance_no,
        date: purchase.date ? purchase.date.toISOString().split("T")[0] : null,
        grand_subtotal: parseFloat(purchase.grand_subtotal || "0"),
        delivery_charge: parseFloat(String(purchase.delivery_charge || 0)),
        paid_amount: parseFloat(purchase.paid_amount || "0"),
        due_amount: parseFloat(purchase.due_amount || "0"),
        purchase_payable_amount: parseFloat(purchase.purchase_payable_amount || "0"),
        creator: purchase.users?.name || "Admin",
        supplier: purchase.suppliers
          ? {
              id: Number(purchase.suppliers.id),
              supplier_id: purchase.suppliers.supplier_id,
              name: purchase.suppliers.name,
              company: purchase.suppliers.company,
              mobile: purchase.suppliers.mobile,
              address: purchase.suppliers.address,
              payable_amount: parseFloat(purchase.suppliers.purchase_payable_amount || "0"),
            }
          : null,
        details: purchase.purchase_order_details.map((d) => ({
          id: Number(d.id),
          product_id: Number(d.product_id),
          product_name: d.products?.product_name || "N/A",
          quantity: parseFloat(d.quantity || "0"),
          cost_price: parseFloat(d.cost_price || "0"),
          subtotal: parseFloat(d.subtotal || "0"),
          unit: d.products?.units?.unit_name || "Pcs",
        })),
        payments: purchase.purchase_payment_details.map((pm) => ({
          id: Number(pm.id),
          paid_amount: Number(pm.paid_amount || 0),
          payment_method: pm.payment_method || "Cash",
          payment_status: pm.payment_status || "Paid",
          transaction_id: pm.transaction_id,
          date: pm.purchase_due_collection_date
            ? pm.purchase_due_collection_date.toISOString().split("T")[0]
            : null,
        })),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ status: "fail", message: error?.message }, { status: 500 });
  }
}
