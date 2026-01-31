import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { orderApiSchema } from "@/lib/validations/checkout";
import { generateOrderCode } from "@/lib/utils";
import type { InsertTables } from "@/lib/supabase/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validationResult = orderApiSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid request data",
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;
    const supabase = await createServiceClient();

    // Generate order code
    const orderCode = generateOrderCode();

    // Get the default "pending" status
    const { data: statusData } = await supabase
      .from("order_statuses")
      .select("id")
      .eq("name", "pending")
      .single();

    let statusId = (statusData as { id: string } | null)?.id;

    if (!statusId) {
      // If no pending status, get the first one
      const { data: firstStatus } = await supabase
        .from("order_statuses")
        .select("id")
        .order("display_order", { ascending: true })
        .limit(1)
        .single();

      statusId = (firstStatus as { id: string } | null)?.id;

      if (!statusId) {
        return NextResponse.json(
          { error: "No order status configured" },
          { status: 500 }
        );
      }
    }

    // Create order
    const orderInsert: InsertTables<"orders"> = {
      order_code: orderCode,
      customer_name: data.customerName,
      customer_phone: data.customerPhone,
      customer_email: data.customerEmail || null,
      delivery_address: data.deliveryAddress,
      delivery_date: data.deliveryDate,
      note: data.notes || null,
      status_id: statusId,
      total_amount: data.totalAmount,
    };

    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .insert(orderInsert as never)
      .select()
      .single();

    if (orderError || !orderData) {
      console.error("Error creating order:", orderError);
      return NextResponse.json(
        { error: "Failed to create order" },
        { status: 500 }
      );
    }

    const order = orderData as { id: string };

    // Create order items
    const orderItems: InsertTables<"order_items">[] = data.items.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      quantity: item.quantity,
      unit_price: item.unitPrice,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems as never);

    if (itemsError) {
      console.error("Error creating order items:", itemsError);
      // Rollback order if items fail
      await supabase.from("orders").delete().eq("id", order.id);
      return NextResponse.json(
        { error: "Failed to create order items" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      orderCode: orderCode,
      orderId: order.id,
    });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
