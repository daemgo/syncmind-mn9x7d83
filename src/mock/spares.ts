// Mock data for spares management
import type { Spare, SpareAlert } from "@/types/spare";

const categories = [
  { id: "electrical", name: "电气元件" },
  { id: "mechanical", name: "机械零件" },
  { id: "hydraulic", name: "液压元件" },
  { id: "cutting", name: "刀具" },
  { id: "other", name: "其他" }
];

const units = ["piece", "set", "kg", "meter"];

const specifications = [
  "SKD11/50×50×20",
  "45#钢/Φ20×100",
  "Cr12MoV/30×30×15",
  "铜/CuZr15/Φ10",
  "铝/6061-T6/40×40",
  "不锈钢/304/Φ25",
  "轴承/NSK6205",
  "轴承/FAG6208",
  "密封件/TC/Φ50",
  "油封/TYPE-C/30×52×10"
];

const locations = ["A-01-01", "A-01-02", "B-01-01", "B-02-01", "C-01-01", "C-02-02"];

const suppliers = [
  "上海机电设备有限公司",
  "北京工业器材有限公司",
  "广州五金工具厂",
  "深圳精密机械配件公司",
  "苏州液压元件厂"
];

// Generate 30 spare parts
export const spares: Spare[] = Array.from({ length: 30 }, (_, i) => {
  const id = `SP${26030001 + i}`;
  const category = categories[i % categories.length];
  const safetyStock = Math.floor(Math.random() * 50) + 10;
  const currentStock = Math.floor(Math.random() * 100);

  let stockStatus: "normal" | "warning" | "outofstock";
  if (currentStock === 0) {
    stockStatus = "outofstock";
  } else if (currentStock <= safetyStock) {
    stockStatus = "warning";
  } else {
    stockStatus = "normal";
  }

  return {
    id,
    spareNo: id,
    spareName: `${category.name}-${String(i + 1).padStart(2, "0")}`,
    categoryId: category.id,
    categoryName: category.name,
    specification: specifications[i % specifications.length],
    currentStock,
    safetyStock,
    stockStatus,
    unitPrice: Math.floor(Math.random() * 9000) + 100,
    unit: units[i % units.length],
    location: locations[i % locations.length],
    lastInDate: `2024-03-${String(Math.floor(Math.random() * 28) + 1).padStart(2, "0")}`,
    supplier: suppliers[i % suppliers.length],
    createdAt: `2024-01-${String(Math.floor(Math.random() * 28) + 1).padStart(2, "0")}`,
    updatedAt: `2024-03-${String(Math.floor(Math.random() * 28) + 1).padStart(2, "0")}`
  };
});

// Generate alerts for spares with stock <= safetyStock
export const spareAlerts: SpareAlert[] = spares
  .filter(spare => spare.currentStock <= spare.safetyStock)
  .map(spare => {
    const gap = spare.safetyStock - spare.currentStock;
    const alertLevel = spare.currentStock === 0 ? ("critical" as const) : ("warning" as const);
    return {
      id: `ALT-${spare.spareNo}`,
      spareId: spare.id,
      spareNo: spare.spareNo,
      spareName: spare.spareName,
      categoryName: spare.categoryName,
      currentStock: spare.currentStock,
      safetyStock: spare.safetyStock,
      gap,
      alertLevel,
      suggestedPurchaseQty: gap * 2
    };
  })
  .sort((a, b) => b.gap - a.gap);
