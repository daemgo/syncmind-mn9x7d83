"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EquipmentFilter } from "@/components/equipment/equipment-filter";
import { EquipmentTable } from "@/components/equipment/equipment-table";
import mockEquipment from "@/mock/equipment";
import { Equipment } from "@/types/equipment";

export default function EquipmentListPage() {
  const [filters, setFilters] = useState<{
    equipmentNo?: string;
    equipmentName?: string;
    categoryId?: string;
    workshopId?: string;
    status?: Equipment["status"];
  }>({});

  const updateFilters = (newFilters: typeof filters) => {
    setFilters({ ...filters, ...newFilters });
  };

  const filteredData = mockEquipment.filter((item) => {
    if (filters.equipmentNo && !item.equipmentNo.toLowerCase().includes(filters.equipmentNo.toLowerCase())) {
      return false;
    }
    if (filters.equipmentName && !item.equipmentName.toLowerCase().includes(filters.equipmentName.toLowerCase())) {
      return false;
    }
    if (filters.categoryId) {
      const categoryMap: Record<string, string> = {
        cnc: "数控机床",
        milling: "铣床",
        lathe: "车床",
        grinding: "磨床",
        other: "其他",
      };
      if (item.categoryName !== categoryMap[filters.categoryId]) {
        return false;
      }
    }
    if (filters.workshopId) {
      const workshopMap: Record<string, string> = {
        ws1: "一车间",
        ws2: "二车间",
        ws3: "三车间",
      };
      if (item.workshopName !== workshopMap[filters.workshopId]) {
        return false;
      }
    }
    if (filters.status && item.status !== filters.status) {
      return false;
    }
    return true;
  });

  const handleView = (id: string) => {
    window.location.href = `/equipment/${id}`;
  };

  const handleEdit = (id: string) => {
    window.location.href = `/equipment/${id}/edit`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">设备管理</h1>
            <p className="text-sm text-muted-foreground">管理和监控生产设备状态</p>
          </div>
          <Link href="/equipment/create">
            <Button>
              <Plus className="mr-1.5 h-4 w-4" />
              新增设备
            </Button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6 space-y-6">
        {/* Filter */}
        <EquipmentFilter filters={filters} onFilterChange={updateFilters} />

        {/* Table */}
        <EquipmentTable data={filteredData} onView={handleView} onEdit={handleEdit} />
      </div>
    </div>
  );
}
