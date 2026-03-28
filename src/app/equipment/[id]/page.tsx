"use client";

import { EquipmentDetail } from "@/components/equipment/equipment-detail";
import mockEquipment from "@/mock/equipment";

export default async function EquipmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const equipment = mockEquipment.find((eq) => eq.id === id);

  if (!equipment) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-6 py-12">
          <div className="text-center">
            <h1 className="text-xl font-semibold">设备不存在</h1>
            <p className="text-muted-foreground mt-2">未找到设备ID为 {id} 的设备</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-semibold tracking-tight">设备详情</h1>
          <p className="text-sm text-muted-foreground">查看设备详细信息和运行状态</p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        <EquipmentDetail data={equipment} />
      </div>
    </div>
  );
}
