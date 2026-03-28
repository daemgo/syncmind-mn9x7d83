"use client";

import { useRouter } from "next/navigation";
import { EquipmentForm } from "@/components/equipment/equipment-form";
import { EquipmentFormData } from "@/types/equipment";

export default function EquipmentCreatePage() {
  const router = useRouter();

  const handleSubmit = (data: EquipmentFormData) => {
    console.log("Create equipment:", data);
    // In real app, this would call an API
    alert("设备创建成功");
    router.push("/equipment");
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-semibold tracking-tight">新增设备</h1>
          <p className="text-sm text-muted-foreground">添加新的生产设备</p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        <EquipmentForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          submitLabel="创建设备"
        />
      </div>
    </div>
  );
}
