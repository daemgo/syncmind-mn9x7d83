"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { equipmentCategories, workshops, equipmentStatusOptions } from "@/mock/equipment";
import { EquipmentStatus } from "@/types/equipment";

interface EquipmentFilterProps {
  filters: {
    equipmentNo?: string;
    equipmentName?: string;
    categoryId?: string;
    workshopId?: string;
    status?: EquipmentStatus;
  };
  onFilterChange: (filters: EquipmentFilterProps["filters"]) => void;
}

export function EquipmentFilter({ filters, onFilterChange }: EquipmentFilterProps) {
  const updateFilter = (key: string, value: string) => {
    onFilterChange({
      ...filters,
      [key]: value || undefined,
    });
  };

  const resetFilters = () => {
    onFilterChange({});
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex flex-wrap items-end gap-4">
          {/* Equipment No */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="equipmentNo" className="text-sm text-muted-foreground">
              设备编号
            </Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="equipmentNo"
                placeholder="请输入设备编号"
                value={filters.equipmentNo || ""}
                onChange={(e) => updateFilter("equipmentNo", e.target.value)}
                className="pl-8 w-[160px]"
              />
            </div>
          </div>

          {/* Equipment Name */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="equipmentName" className="text-sm text-muted-foreground">
              设备名称
            </Label>
            <Input
              id="equipmentName"
              placeholder="请输入设备名称"
              value={filters.equipmentName || ""}
              onChange={(e) => updateFilter("equipmentName", e.target.value)}
              className="w-[160px]"
            />
          </div>

          {/* Category */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="categoryId" className="text-sm text-muted-foreground">
              设备分类
            </Label>
            <Select
              value={filters.categoryId || "all"}
              onValueChange={(value) => updateFilter("categoryId", value === "all" ? "" : value)}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="全部分类" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部分类</SelectItem>
                {equipmentCategories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Workshop */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="workshopId" className="text-sm text-muted-foreground">
              车间
            </Label>
            <Select
              value={filters.workshopId || "all"}
              onValueChange={(value) => updateFilter("workshopId", value === "all" ? "" : value)}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="全部车间" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部车间</SelectItem>
                {workshops.map((ws) => (
                  <SelectItem key={ws.value} value={ws.value}>
                    {ws.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="status" className="text-sm text-muted-foreground">
              运行状态
            </Label>
            <Select
              value={filters.status || "all"}
              onValueChange={(value) => updateFilter("status", value === "all" ? "" : value as EquipmentStatus)}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="全部状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                {equipmentStatusOptions.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Reset Button */}
          <Button variant="ghost" size="sm" onClick={resetFilters} className="text-muted-foreground">
            重置
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
