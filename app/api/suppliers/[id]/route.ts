import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET: Single Supplier with Purchases
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supplierId = BigInt(id);

    const supplier = await prisma.suppliers.findUnique({
      where: { id: supplierId },
      include: {
        purchases: {
          orderBy: { id: "desc" },
          take: 20,
        },
        supplier_due_collections: {
          orderBy: { id: "desc" },
          take: 20,
        },
      },
    });

    if (!supplier) {
      return NextResponse.json({ status: "fail", message: "Supplier not found" }, { status: 404 });
    }

    return NextResponse.json({
      status: "success",
      data: {
        ...supplier,
        id: Number(supplier.id),
        purchase_payable_amount: parseFloat(supplier.purchase_payable_amount || "0"),
        purchases: supplier.purchases.map((p) => ({
          ...p,
          id: Number(p.id),
          grand_subtotal: parseFloat(p.grand_subtotal || "0"),
          paid_amount: parseFloat(p.paid_amount || "0"),
          due_amount: parseFloat(p.due_amount || "0"),
        })),
        supplier_due_collections: supplier.supplier_due_collections.map((dc) => ({
          ...dc,
          id: Number(dc.id),
          paid_amount: parseFloat(dc.paid_amount || "0"),
          due_amount: parseFloat(dc.due_amount || "0"),
        })),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ status: "fail", message: error?.message }, { status: 500 });
  }
}

// PUT: Update Supplier
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supplierId = BigInt(id);
    const body = await req.json();

    const { name, company, mobile, address, email, purchase_payable_amount, status } = body;

    const updated = await prisma.suppliers.update({
      where: { id: supplierId },
      data: {
        name: name !== undefined ? name.trim() : undefined,
        company: company !== undefined ? company.trim() : undefined,
        mobile: mobile !== undefined ? mobile.trim() : undefined,
        address: address !== undefined ? address.trim() : undefined,
        email: email !== undefined ? (email ? email.trim() : null) : undefined,
        purchase_payable_amount:
          purchase_payable_amount !== undefined ? String(purchase_payable_amount) : undefined,
        status: status !== undefined ? status : undefined,
      },
    });

    return NextResponse.json({
      status: "success",
      message: "Supplier updated successfully",
      data: {
        ...updated,
        id: Number(updated.id),
        purchase_payable_amount: parseFloat(updated.purchase_payable_amount || "0"),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ status: "fail", message: error?.message }, { status: 500 });
  }
}

// DELETE: Delete Supplier
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supplierId = BigInt(id);

    // Check if supplier has purchases
    const purchaseCount = await prisma.purchases.count({
      where: { supplier_id: supplierId },
    });

    if (purchaseCount > 0) {
      return NextResponse.json(
        {
          status: "fail",
          message: `Cannot delete supplier with ${purchaseCount} associated purchase records.`,
        },
        { status: 400 }
      );
    }

    await prisma.suppliers.delete({
      where: { id: supplierId },
    });

    return NextResponse.json({
      status: "success",
      message: "Supplier deleted successfully",
    });
  } catch (error: any) {
    return NextResponse.json({ status: "fail", message: error?.message }, { status: 500 });
  }
}
