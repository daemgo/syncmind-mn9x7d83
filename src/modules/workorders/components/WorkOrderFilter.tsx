// Work Order Filter Component

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, SlidersHorizontal } from "lucide-react";
import { WorkOrderStatus, Priority } from "@/types/workorder";

interface WorkOrderFilterProps {
  filters: {
    workOrderNo?: string;
    status?: WorkOrderStatus;
    priority?: Priority;
  };
  onFiltersChange: (filters: {
    workOrderNo?: string;
    status?: WorkOrderStatus;
    priority?: Priority;
  }) => void;
  onReset: () => void;
}

const statusOptions: Array<{ value: WorkOrderStatus; label: string }> = [
  { value: "pending", label: "待派工" },
  { value: "assigned", label: "待执行" },
  { value: "processing", label: "执行中" },
  { value: "verifying", label: "待验收" },
  { value: "completed", label: "已完成" },
  { value: "cancelled", label: "已取消" },
];

const priorityOptions: Array<{ value: Priority; label: string }> = [
  { value: "high", label: "高" },
  { value: "medium", label: "中" },
  { value: "low", label: "低" },
];

export function WorkOrderFilter({ filters, onFiltersChange, onReset }: WorkOrderFilterProps) {
  const handleWorkOrderNoChange = (value: string) => {
    onFiltersChange({ ...filters, workOrderNo: value || undefined });
  };

  const handleStatusChange = (value: string) => {
    onFiltersChange({
      ...filters,
      status: value === "all" ? undefined : (value as WorkOrderStatus),
    });
  };

  const handlePriorityChange = (value: string) => {
    onFiltersChange({
      ...filters,
      priority: value === "all" ? undefined : (value as Priority),
    });
  };

  const handleReset = () => {
    onReset();
  };

  const hasActiveFilters = filters.workOrderNo || filters.status || filters.priority;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Work Order Number Search */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索工单编号..."
              value={filters.workOrderNo || ""}
              onChange={(e) => handleWorkOrderNoChange(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Status Filter */}
          <Select
            value={filters.status || "all"}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="工单状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部状态</SelectItem>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Priority Filter */}
          <Select
            value={filters.priority || "all"}
            onValueChange={handlePriorityChange}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="紧急程度" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部程度</SelectItem>
              {priorityOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Reset Button */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground"
              onClick={handleReset}
            >
              重置
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
