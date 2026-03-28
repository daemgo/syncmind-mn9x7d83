// Work Orders List Page

"use client";

import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WorkOrderFilter } from "../components/WorkOrderFilter";
import { WorkOrderTable } from "../components/WorkOrderTable";
import { mockWorkOrderListItems } from "../mock";
import { WorkOrderListItem, WorkOrderStatus, Priority } from "@/types/workorder";
import { useRouter } from "next/navigation";

export default function WorkOrdersListPage() {
  const router = useRouter();
  const [filters, setFilters] = useState<{
    workOrderNo?: string;
    status?: WorkOrderStatus;
    priority?: Priority;
  }>({});

  // Filter work orders based on current filters
  const filteredWorkOrders = useMemo(() => {
    let filtered = mockWorkOrderListItems;

    // Filter by work order number
    if (filters.workOrderNo) {
      filtered = filtered.filter((wo) =>
        wo.workOrderNo.toLowerCase().includes(filters.workOrderNo!.toLowerCase())
      );
    }

    // Filter by status
    if (filters.status) {
      filtered = filtered.filter((wo) => wo.status === filters.status);
    }

    // Filter by priority
    if (filters.priority) {
      filtered = filtered.filter((wo) => wo.priority === filters.priority);
    }

    return filtered;
  }, [filters]);

  // Calculate status counts for tabs
  const statusCounts = useMemo(() => {
    const counts = {
      all: mockWorkOrderListItems.length,
      pending: 0,
      assigned: 0,
      processing: 0,
      verifying: 0,
      completed: 0,
      cancelled: 0,
    };

    mockWorkOrderListItems.forEach((wo) => {
      counts[wo.status]++;
    });

    return counts;
  }, []);

  const handleFiltersChange = (newFilters: {
    workOrderNo?: string;
    status?: WorkOrderStatus;
    priority?: Priority;
  }) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({});
  };

  const handleViewWorkOrder = (id: string) => {
    router.push(`/maintenance/workorders/${id}`);
  };

  const handleCreateWorkOrder = () => {
    router.push("/maintenance/workorders/create");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">维修工单</h1>
            <p className="text-sm text-muted-foreground">
              管理设备维修工单和维修任务
            </p>
          </div>
          <Button onClick={handleCreateWorkOrder}>
            <Plus className="mr-1.5 h-4 w-4" />
            新建工单
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6 space-y-6">
        {/* Status Tabs */}
        <div className="flex items-center gap-2 border-b pb-0">
          <button
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              !filters.status
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => handleFiltersChange({ ...filters, status: undefined })}
          >
            全部
            <Badge variant="outline" className="ml-2">
              {statusCounts.all}
            </Badge>
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              filters.status === "pending"
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => handleFiltersChange({ ...filters, status: "pending" })}
          >
            待派工
            <Badge variant="outline" className="ml-2">
              {statusCounts.pending}
            </Badge>
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              filters.status === "assigned"
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => handleFiltersChange({ ...filters, status: "assigned" })}
          >
            待执行
            <Badge variant="outline" className="ml-2">
              {statusCounts.assigned}
            </Badge>
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              filters.status === "processing"
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => handleFiltersChange({ ...filters, status: "processing" })}
          >
            执行中
            <Badge variant="outline" className="ml-2">
              {statusCounts.processing}
            </Badge>
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              filters.status === "verifying"
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => handleFiltersChange({ ...filters, status: "verifying" })}
          >
            待验收
            <Badge variant="outline" className="ml-2">
              {statusCounts.verifying}
            </Badge>
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              filters.status === "completed"
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => handleFiltersChange({ ...filters, status: "completed" })}
          >
            已完成
            <Badge variant="outline" className="ml-2">
              {statusCounts.completed}
            </Badge>
          </button>
        </div>

        {/* Filter Bar */}
        <WorkOrderFilter
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onReset={handleResetFilters}
        />

        {/* Work Orders Table */}
        <WorkOrderTable
          workOrders={filteredWorkOrders}
          onView={handleViewWorkOrder}
        />
      </div>
    </div>
  );
}
