// 备件管理类型定义

export type StockStatus = "normal" | "warning" | "outofstock";

export interface Spare {
  id: string;
  spareNo: string;
  spareName: string;
  categoryId: string;
  categoryName: string;
  specification: string;
  currentStock: number;
  safetyStock: number;
  stockStatus: StockStatus;
  unitPrice: number;
  unit: string;
  location?: string;
  lastInDate?: string;
  supplier?: string;
  createdAt: string;
  updatedAt: string;
}

// 备件预警项
export interface SpareAlert {
  id: string;
  spareId: string;
  spareNo: string;
  spareName: string;
  categoryName: string;
  currentStock: number;
  safetyStock: number;
  gap: number;
  alertLevel: "warning" | "critical";
  suggestedPurchaseQty: number;
}
