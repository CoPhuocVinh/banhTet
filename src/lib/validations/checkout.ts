import { z } from "zod";

export const checkoutSchema = z.object({
  customerName: z
    .string()
    .min(2, "Họ tên ít nhất 2 ký tự")
    .max(100, "Họ tên quá dài"),
  customerPhone: z
    .string()
    .min(1, "Vui lòng nhập số điện thoại"),
  customerEmail: z
    .string()
    .email("Email không hợp lệ")
    .optional()
    .or(z.literal("")),
  deliveryAddress: z
    .string()
    .min(10, "Địa chỉ quá ngắn (ít nhất 10 ký tự)")
    .max(500, "Địa chỉ quá dài"),
  deliveryDate: z.string().min(1, "Vui lòng chọn ngày nhận hàng"),
  notes: z.string().max(500, "Ghi chú quá dài").optional(),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;

export const checkoutSchemaEn = z.object({
  customerName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
  customerPhone: z
    .string()
    .min(1, "Please enter phone number"),
  customerEmail: z
    .string()
    .email("Invalid email address")
    .optional()
    .or(z.literal("")),
  deliveryAddress: z
    .string()
    .min(10, "Address is too short (at least 10 characters)")
    .max(500, "Address is too long"),
  deliveryDate: z.string().min(1, "Please select a delivery date"),
  notes: z.string().max(500, "Notes are too long").optional(),
});

// API validation schema (without locale-specific messages)
export const orderApiSchema = z.object({
  customerName: z.string().min(2).max(100),
  customerPhone: z.string().min(1),
  customerEmail: z.string().email().optional().or(z.literal("")),
  deliveryAddress: z.string().min(10).max(500),
  deliveryDate: z.string(),
  notes: z.string().max(500).optional(),
  items: z.array(
    z.object({
      productId: z.string().uuid(),
      quantity: z.number().int().min(1).max(99),
      unitPrice: z.number().positive(),
    })
  ),
  totalAmount: z.number().positive(),
});

export type OrderApiData = z.infer<typeof orderApiSchema>;
