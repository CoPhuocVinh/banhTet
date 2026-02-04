import ExcelJS from "exceljs";
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
    grouped[name] = (grouped[name] || 0) + item.quantity;
  });

  return Object.entries(grouped)
    .map(([name, qty]) => `${qty} ${name}`)
    .join(" + ");
}

export function exportOrdersToExcel(
  orders: OrderForExport[],
  filename: string = "don-hang"
) {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet("Đơn hàng");

  // Define columns
  ws.columns = [
    { header: "SL (đơn)", key: "sl", width: 10 },
    { header: "", key: "empty1", width: 5 },
    { header: "Người đặt", key: "nguoi_dat", width: 22 },
    { header: "Bánh tét", key: "banh_tet", width: 35 },
    { header: "Ngày muốn giao", key: "ngay_giao", width: 25 },
    { header: "Giá bán", key: "gia_ban", width: 15 },
    { header: "Giá gốc", key: "gia_goc", width: 15 },
    { header: "", key: "empty2", width: 5 },
    { header: "Note", key: "note", width: 30 },
  ];

  // Style header row
  const headerRow = ws.getRow(1);
  headerRow.eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF4472C4" },
    };
    cell.font = {
      bold: true,
      color: { argb: "FFFFFFFF" },
      size: 12,
    };
    cell.alignment = { horizontal: "center", vertical: "middle" };
    cell.border = {
      top: { style: "thin" },
      bottom: { style: "thin" },
      left: { style: "thin" },
      right: { style: "thin" },
    };
  });
  headerRow.height = 28;

  // Add data rows
  orders.forEach((order) => {
    const totalQuantity = order.order_items.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    const deliveryDate = new Date(order.delivery_date);
    const lunarDate = getLunarDateString(deliveryDate);
    const productDescription = formatProductItems(order.order_items);

    const row = ws.addRow({
      sl: totalQuantity,
      empty1: "",
      nguoi_dat: order.customer_name,
      banh_tet: productDescription,
      ngay_giao: lunarDate,
      gia_ban: order.total_amount,
      gia_goc: 0,
      empty2: "",
      note: order.note || "",
    });

    // Style data rows
    row.eachCell((cell) => {
      cell.border = {
        top: { style: "thin", color: { argb: "FFD9D9D9" } },
        bottom: { style: "thin", color: { argb: "FFD9D9D9" } },
        left: { style: "thin", color: { argb: "FFD9D9D9" } },
        right: { style: "thin", color: { argb: "FFD9D9D9" } },
      };
      cell.alignment = { vertical: "middle" };
    });

    // Format price columns
    row.getCell("gia_ban").numFmt = "#,##0";
    row.getCell("gia_goc").numFmt = "#,##0";
    row.getCell("sl").alignment = { horizontal: "center", vertical: "middle" };
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

  const summaryRow = ws.addRow({
    sl: totalQuantity,
    empty1: "",
    nguoi_dat: "",
    banh_tet: "",
    ngay_giao: "",
    gia_ban: totalAmount,
    gia_goc: 0,
    empty2: "",
    note: "",
  });

  // Style summary row
  summaryRow.eachCell((cell) => {
    cell.font = { bold: true, size: 12 };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFF2F2F2" },
    };
    cell.border = {
      top: { style: "medium" },
      bottom: { style: "medium" },
      left: { style: "thin" },
      right: { style: "thin" },
    };
    cell.alignment = { vertical: "middle" };
  });
  summaryRow.getCell("gia_ban").numFmt = "#,##0";
  summaryRow.getCell("gia_goc").numFmt = "#,##0";
  summaryRow.getCell("sl").alignment = {
    horizontal: "center",
    vertical: "middle",
  };

  // Generate filename with date
  const now = new Date();
  const dateStr = now.toISOString().split("T")[0];
  const fullFilename = `${filename}-${dateStr}.xlsx`;

  // Download file (browser)
  wb.xlsx.writeBuffer().then((buffer) => {
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fullFilename;
    a.click();
    URL.revokeObjectURL(url);
  });
}

export function exportOrdersByDateRange(
  orders: OrderForExport[],
  startDate: string,
  endDate: string
) {
  const filename = `don-hang-${startDate}-to-${endDate}`;
  exportOrdersToExcel(orders, filename);
}
