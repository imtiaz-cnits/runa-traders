import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

function shiftDateStr(dateStr: string, deltaDays: number): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + deltaDays));
  return dt.toISOString().split("T")[0];
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const period = searchParams.get("period") || "today";
    const paramStart = searchParams.get("start_date")?.trim() || "";
    const paramEnd = searchParams.get("end_date")?.trim() || "";

    // Current date in Bangladesh Standard Time (Asia/Dhaka - UTC+6)
    const bdDateStr = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Dhaka",
    }).format(new Date());

    let startDateStr = bdDateStr;
    let endDateStr = bdDateStr;

    if (period === "last_week") {
      startDateStr = shiftDateStr(bdDateStr, -6);
      endDateStr = bdDateStr;
    } else if (period === "last_month") {
      startDateStr = shiftDateStr(bdDateStr, -29);
      endDateStr = bdDateStr;
    } else if (period === "date_wise") {
      startDateStr = paramStart || paramEnd || bdDateStr;
      endDateStr = paramEnd || paramStart || bdDateStr;
      if (startDateStr > endDateStr) {
        const tmp = startDateStr;
        startDateStr = endDateStr;
        endDateStr = tmp;
      }
    }

    const rangeStart = new Date(`${startDateStr}T00:00:00.000+06:00`);
    const rangeEnd = new Date(`${endDateStr}T23:59:59.999+06:00`);
    const rangeStartUtcDate = new Date(`${startDateStr}T00:00:00.000Z`);
    const rangeEndUtcDate = new Date(`${endDateStr}T23:59:59.999Z`);

    const [
      totalProducts,
      totalCustomers,
      totalSuppliers,
      totalOrders,
      recentOrders,
      ordersInPeriod,
      dueCollectionsInPeriod,
      expensesInPeriod,
      returnsInPeriod,
      customersWithDue,
      suppliersWithDue,
    ] = await Promise.all([
      prisma.products.count(),
      prisma.customers.count(),
      prisma.suppliers.count(),
      prisma.orders.count(),
      prisma.orders.findMany({
        take: 10,
        orderBy: { id: "desc" },
        include: {
          customers: true,
        },
      }),
      prisma.orders.findMany({
        where: {
          OR: [
            { created_at: { gte: rangeStart, lte: rangeEnd } },
            {
              invoice_date: {
                gte: rangeStartUtcDate,
                lte: rangeEndUtcDate,
              },
            },
          ],
        },
        select: {
          sub_total: true,
          paid_amount: true,
          due_amount: true,
          delivery_charge: true,
          discount_amount: true,
          return_adjustment_amount: true,
          order_details: {
            select: {
              quantity: true,
              price: true,
              selling_price: true,
              products: {
                select: {
                  cost_price: true,
                },
              },
            },
          },
          product_returns: {
            select: {
              amount: true,
            },
          },
        },
      }),
      prisma.customer_payment_details.findMany({
        where: {
          OR: [
            { created_at: { gte: rangeStart, lte: rangeEnd } },
            {
              due_collection_date: {
                gte: rangeStartUtcDate,
                lte: rangeEndUtcDate,
              },
            },
          ],
        },
        select: {
          paid_amount: true,
        },
      }),
      prisma.expenses.findMany({
        where: {
          OR: [
            { created_at: { gte: rangeStart, lte: rangeEnd } },
            { date: { gte: startDateStr, lte: endDateStr } },
          ],
        },
        select: {
          expense_amount: true,
        },
      }),
      prisma.product_returns.findMany({
        where: {
          OR: [
            { created_at: { gte: rangeStart, lte: rangeEnd } },
            { date: { gte: startDateStr, lte: endDateStr } },
          ],
        },
        select: {
          amount: true,
        },
      }),
      prisma.customers.findMany({
        select: { previous_due_amount: true },
      }),
      prisma.suppliers.findMany({
        select: { purchase_payable_amount: true },
      }),
    ]);

    // Financial calculations (preserving exact existing logic)
    const todaySales = ordersInPeriod.reduce(
      (acc, curr) => acc + Number(curr.sub_total || 0),
      0
    );

    const todayPaidFromOrders = ordersInPeriod.reduce(
      (acc, curr) => acc + Number(curr.paid_amount || 0),
      0
    );

    const todayDueCollected = dueCollectionsInPeriod.reduce(
      (acc, curr) => acc + parseFloat(String(curr.paid_amount || "0")),
      0
    );

    const todayCollected = todayPaidFromOrders + todayDueCollected;

    const todayExpense = expensesInPeriod.reduce(
      (acc, curr) => acc + Number(curr.expense_amount || 0),
      0
    );

    const totalDiscount = ordersInPeriod.reduce(
      (acc, curr) => acc + Number(curr.discount_amount || 0),
      0
    );

    // Gross profit & POS exchange adjustments across orders in period
    let totalGrossProfit = 0;
    let posExchangeAdjustments = 0;

    for (const o of ordersInPeriod) {
      const orderReturnsSum = o.product_returns.reduce(
        (s, r) => s + parseFloat(String(r.amount || "0")),
        0
      );
      const orderAdj = Number(o.return_adjustment_amount || 0);
      if (orderAdj > orderReturnsSum) {
        posExchangeAdjustments += orderAdj - orderReturnsSum;
      }

      let costSum = 0;
      let salesDetailsSum = 0;
      for (const d of o.order_details) {
        const qty = parseFloat(String(d.quantity || 0));
        const buyingPrice =
          parseFloat(String(d.products?.cost_price || 0)) ||
          parseFloat(String(d.price || 0));
        const sellingPrice = parseFloat(String(d.selling_price || 0));

        costSum += buyingPrice * qty;
        salesDetailsSum += sellingPrice * qty;
      }

      const subTotal = parseFloat(String(o.sub_total || salesDetailsSum));
      const discount = parseFloat(String(o.discount_amount || 0));
      const delivery = parseFloat(String(o.delivery_charge || 0));
      const netInvoiceAmount = subTotal - discount + delivery;
      totalGrossProfit += netInvoiceAmount - costSum - orderReturnsSum;
    }

    const salesReturnsTotal = returnsInPeriod.reduce(
      (acc, curr) => acc + parseFloat(String(curr.amount || "0")),
      0
    );

    const totalReturn = salesReturnsTotal + posExchangeAdjustments;
    const netProfit = totalGrossProfit - todayExpense;

    const totalCustomerDue = customersWithDue.reduce(
      (acc, curr) => acc + parseFloat(String(curr.previous_due_amount || "0")),
      0
    );

    const totalSupplierDue = suppliersWithDue.reduce(
      (acc, curr) => acc + parseFloat(String(curr.purchase_payable_amount || "0")),
      0
    );

    const formattedRecentOrders = recentOrders.map((order) => ({
      id: Number(order.id),
      order_no: order.order_no,
      customer_name: order.customers?.customer_name || "Walking Customer",
      sub_total: Number(order.sub_total || 0),
      paid_amount: Number(order.paid_amount || 0),
      due_amount: Number(order.due_amount || 0),
      invoice_date: order.invoice_date,
      created_at: order.created_at,
    }));

    return NextResponse.json({
      status: "success",
      data: {
        period,
        startDate: startDateStr,
        endDate: endDateStr,
        todaySales,
        todayInvoicesCount: ordersInPeriod.length,
        todayPaid: todayCollected,
        todayExpense,
        profit: netProfit,
        returnAmount: totalReturn,
        discountAmount: totalDiscount,
        totalCustomerDue,
        totalSupplierDue,
        totalProducts,
        totalCustomers,
        totalSuppliers,
        totalOrders,
        recentOrders: formattedRecentOrders,
      },
    });
  } catch (error: any) {
    console.error("Dashboard Stats API Error:", error);
    return NextResponse.json(
      { status: "fail", message: error?.message || "Failed to load dashboard stats" },
      { status: 500 }
    );
  }
}
