"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { equipmentCategories, workshops, equipmentStatusOptions } from "@/mock/equipment";
import { Equipment, EquipmentFormData, EquipmentStatus } from "@/types/equipment";

interface EquipmentFormProps {
  initialData?: Partial<Equipment>;
  onSubmit: (data: EquipmentFormData) => void;
  onCancel?: () => void;
  submitLabel?: string;
}

export function EquipmentForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = "提交",
}: EquipmentFormProps) {
  const [formData, setFormData] = useState<EquipmentFormData>({
    equipmentNo: initialData?.equipmentNo || "",
    equipmentName: initialData?.equipmentName || "",
    categoryName: initialData?.categoryName || "",
    workshopName: initialData?.workshopName || "",
    location: initialData?.location || "",
    model: initialData?.model || "",
    manufacturer: initialData?.manufacturer || "",
    commissionDate: initialData?.commissionDate || "",
    purchasePrice: initialData?.purchasePrice || 0,
    status: initialData?.status || EquipmentStatus.stopped,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const updateField = (field: keyof EquipmentFormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle>{initialData?.id ? "编辑设备" : "新增设备"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Equipment No */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="equipmentNo">设备编号</Label>
              <Input
                id="equipmentNo"
                value={formData.equipmentNo}
                onChange={(e) => updateField("equipmentNo", e.target.value)}
                placeholder="请输入设备编号"
                required
              />
            </div>

            {/* Equipment Name */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="equipmentName">设备名称</Label>
              <Input
                id="equipmentName"
                value={formData.equipmentName}
                onChange={(e) => updateField("equipmentName", e.target.value)}
                placeholder="请输入设备名称"
                required
              />
            </div>
          </div>

          {/* Category & Workshop */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="categoryName">设备分类</Label>
              <Select
                value={formData.categoryName}
                onValueChange={(value) => updateField("categoryName", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="请选择设备分类" />
                </SelectTrigger>
                <SelectContent>
                  {equipmentCategories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.label}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="workshopName">车间</Label>
              <Select
                value={formData.workshopName}
                onValueChange={(value) => updateField("workshopName", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="请选择车间" />
                </SelectTrigger>
                <SelectContent>
                  {workshops.map((ws) => (
                    <SelectItem key={ws.value} value={ws.label}>
                      {ws.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Location & Model */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="location">位置</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => updateField("location", e.target.value)}
                placeholder="请输入设备位置"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="model">型号</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => updateField("model", e.target.value)}
                placeholder="请输入设备型号"
                required
              />
            </div>
          </div>

          {/* Manufacturer & Commission Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="manufacturer">制造商</Label>
              <Input
                id="manufacturer"
                value={formData.manufacturer}
                onChange={(e) => updateField("manufacturer", e.target.value)}
                placeholder="请输入制造商"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="commissionDate">投产日期</Label>
              <Input
                id="commissionDate"
                type="date"
                value={formData.commissionDate}
                onChange={(e) => updateField("commissionDate", e.target.value)}
                required
              />
            </div>
          </div>

          {/* Purchase Price & Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="purchasePrice">采购价格（元）</Label>
              <Input
                id="purchasePrice"
                type="number"
                value={formData.purchasePrice}
                onChange={(e) => updateField("purchasePrice", Number(e.target.value))}
                placeholder="请输入采购价格"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="status">运行状态</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => updateField("status", value as EquipmentStatus)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="请选择运行状态" />
                </SelectTrigger>
                <SelectContent>
                  {equipmentStatusOptions.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-4">
            <Button type="submit">{submitLabel}</Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                取消
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
