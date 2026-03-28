// Work Order Table Component

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { WorkOrderListItem, WorkOrderStatus, Priority } from "@/types/workorder";

interface WorkOrderTableProps {
  workOrders: WorkOrderListItem[];
  onView: (id: string) => void;
}

/**
 * Get status badge variant
 */
function getStatusVariant(status: WorkOrderStatus): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "completed":
      return "default";
    case "processing":
      return "secondary";
    case "pending":
      return "outline";
    case "cancelled":
      return "destructive";
    case "assigned":
      return "outline";
    case "verifying":
      return "secondary";
    default:
      return "outline";
  }
}

/**
 * Get priority badge variant with custom colors
 */
function getPriorityBadgeVariant(priority: Priority): { variant: "default" | "secondary" | "destructive" | "outline"; className?: string } {
  switch (priority) {
    case "high":
      return { variant: "outline", className: "border-red-200 bg-red-50 text-red-700" };
    case "medium":
      return { variant: "outline", className: "border-orange-200 bg-orange-50 text-orange-700" };
    case "low":
      return { variant: "outline", className: "border-green-200 bg-green-50 text-green-700" };
    default:
      return { variant: "outline" };
  }
}

/**
 * Get status label
 */
function getStatusLabel(status: WorkOrderStatus): string {
  const labels: Record<WorkOrderStatus, string> = {
    pending: "待派工",
    assigned: "待执行",
    processing: "执行中",
    verifying: "待验收",
    completed: "已完成",
    cancelled: "已取消",
  };
  return labels[status];
}

/**
 * Get priority label
 */
function getPriorityLabel(priority: Priority): string {
  const labels: Record<Priority, string> = {
    high: "高",
    medium: "中",
    low: "低",
  };
  return labels[priority];
}

/**
 * Format date time
 */
function formatDateTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function WorkOrderTable({ workOrders, onView }: WorkOrderTableProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-base font-medium">
          工单列表
          <span className="ml-2 text-sm font-normal text-muted-foreground">
            共 {workOrders.length} 条
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>工单编号</TableHead>
              <TableHead>设备名称</TableHead>
              <TableHead>紧急程度</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>负责人</TableHead>
              <TableHead>创建时间</TableHead>
              <TableHead className="w-[50px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {workOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  暂无工单数据
                </TableCell>
              </TableRow>
            ) : (
              workOrders.map((workOrder) => {
                const priorityBadge = getPriorityBadgeVariant(workOrder.priority);
                return (
                  <TableRow
                    key={workOrder.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => onView(workOrder.id)}
                  >
                    <TableCell className="font-mono text-sm font-medium">
                      <Link
                        href={`/maintenance/workorders/${workOrder.id}`}
                        className="hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {workOrder.workOrderNo}
                      </Link>
                    </TableCell>
                    <TableCell>{workOrder.equipmentName}</TableCell>
                    <TableCell>
                      <Badge
                        variant={priorityBadge.variant}
                        className={priorityBadge.className}
                      >
                        {getPriorityLabel(workOrder.priority)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(workOrder.status)}>
                        {getStatusLabel(workOrder.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>{workOrder.assigneeName || "-"}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDateTime(workOrder.createTime)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onView(workOrder.id)}>
                            查看详情
                          </DropdownMenuItem>
                          <DropdownMenuItem>编辑</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            删除
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
