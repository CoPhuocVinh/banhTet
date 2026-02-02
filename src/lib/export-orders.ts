import * as XLSX from "xlsx";
import { Solar } from "lunar-typescript";

type OrderForExport = {
  order_code: string;
  customer_name: string;
  customer_phone: string;
  delivery_date: string;
  delivery_address: string;
  total_amount: number;
  note: string | null;
  order_statuses: { name: string } | null;
  order_items: {
    quantity: number;
    unit_price: number;
    products: { name: string } | null;
  }[];
};

function getLunarDateString(date: Date): string {
  const solar = Solar.fromDate(date);
  const lunar = solar.getLunar();
  const day = lunar.getDay();
  const month = lunar.getMonth();
  const year = lunar.getYear();

  // Format as "DD AL (dd/mm/yyyy)"
  return `${day} AL (${date.toLocaleDateString("vi-VN")})`;
}

function formatProductItems(
  items: { quantity: number; products: { name: string } | null }[]
): string {
  // Group by product name and sum quantities
  const grouped: Record<string, number> = {};

  items.forEach((item) => {
    const name = item.products?.name || "Không rõ";
    // Simplify product name (e.g., "Nhân đậu + thịt + trứng muối - Loại lớn" -> "đậu + thịt")
    grouped[name] = (grouped[name] || 0) + item.quantity;
  });

  // Format as "2 mặn" or "1 đậu + 1 chuối"
  return Object.entries(grouped)
    .map(([name, qty]) => {
      // Try to extract short name
      let shortName = name;
      if (name.includes("mặn") || name.toLowerCase().includes("thịt")) {
        shortName = "mặn";
      } else if (name.includes("chay") || name.toLowerCase().includes("đậu")) {
        shortName = "đậu";
      } else if (name.includes("chuối")) {
        shortName = "chuối";
      }
      return `${qty} ${shortName}`;
    })
    .join(" + ");
}

export function exportOrdersToExcel(
  orders: OrderForExport[],
  filename: string = "don-hang"
) {
  // Prepare data for export
  const data = orders.map((order, index) => {
    const totalQuantity = order.order_items.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    const deliveryDate = new Date(order.delivery_date);
    const lunarDate = getLunarDateString(deliveryDate);
    const productDescription = formatProductItems(order.order_items);

    return {
      "SL (đơn)": totalQuantity,
      "": "", // Empty column B
      "Người đặt": order.customer_name,
      "Bánh tét": productDescription,
      "Ngày muốn giao": lunarDate,
      "Giá bán": order.total_amount,
      "Giá gốc": 0, // We don't track original price
      " ": "", // Empty column H
      Note: order.note || "",
    };
  });

  // Add summary row
  const totalQuantity = orders.reduce(
    (sum, order) =>
      sum + order.order_items.reduce((s, item) => s + item.quantity, 0),
    0
  );
  const totalAmount = orders.reduce(
    (sum, order) => sum + order.total_amount,
    0
  );

  data.push({
    "SL (đơn)": totalQuantity,
    "": "",
    "Người đặt": "",
    "Bánh tét": "",
    "Ngày muốn giao": "",
    "Giá bán": totalAmount,
    "Giá gốc": 0,
    " ": "",
    Note: "",
  });

  // Create workbook and worksheet
  const ws = XLSX.utils.json_to_sheet(data);

  // Set column widths
  ws["!cols"] = [
    { wch: 10 }, // SL (đơn)
    { wch: 5 }, // Empty
    { wch: 20 }, // Người đặt
    { wch: 25 }, // Bánh tét
    { wch: 25 }, // Ngày muốn giao
    { wch: 15 }, // Giá bán
    { wch: 15 }, // Giá gốc
    { wch: 5 }, // Empty
    { wch: 30 }, // Note
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Đơn hàng");

  // Generate filename with date
  const now = new Date();
  const dateStr = now.toISOString().split("T")[0];
  const fullFilename = `${filename}-${dateStr}.xlsx`;

  // Download file
  XLSX.writeFile(wb, fullFilename);
}

export function exportOrdersByDateRange(
  orders: OrderForExport[],
  startDate: string,
  endDate: string
) {
  const filename = `don-hang-${startDate}-to-${endDate}`;
  exportOrdersToExcel(orders, filename);
}
