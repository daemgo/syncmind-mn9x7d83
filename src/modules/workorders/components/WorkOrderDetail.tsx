// Work Order Detail Component

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Clock,
  User,
  MapPin,
  Calendar,
  FileText,
  AlertCircle,
  CheckCircle2,
  Wrench,
} from "lucide-react";
import { WorkOrder, WorkOrderStatus, Priority } from "@/types/workorder";
import Link from "next/link";

interface WorkOrderDetailProps {
  workOrder: WorkOrder;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
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
 * Get priority badge with custom colors
 */
function getPriorityBadge(priority: Priority) {
  switch (priority) {
    case "high":
      return <Badge className="border-red-200 bg-red-50 text-red-700">高</Badge>;
    case "medium":
      return <Badge className="border-orange-200 bg-orange-50 text-orange-700">中</Badge>;
    case "low":
      return <Badge className="border-green-200 bg-green-50 text-green-700">低</Badge>;
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
 * Get status icon
 */
function getStatusIcon(status: WorkOrderStatus) {
  switch (status) {
    case "pending":
      return <Clock className="h-4 w-4" />;
    case "assigned":
      return <User className="h-4 w-4" />;
    case "processing":
      return <Wrench className="h-4 w-4" />;
    case "verifying":
      return <AlertCircle className="h-4 w-4" />;
    case "completed":
      return <CheckCircle2 className="h-4 w-4" />;
    case "cancelled":
      return <AlertCircle className="h-4 w-4" />;
  }
}

/**
 * Format date time
 */
function formatDateTime(isoString?: string): string {
  if (!isoString) return "-";
  const date = new Date(isoString);
  return date.toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Format date
 */
function formatDate(isoString?: string): string {
  if (!isoString) return "-";
  const date = new Date(isoString);
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export function WorkOrderDetail({ workOrder, onEdit, onDelete }: WorkOrderDetailProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-3">
                <CardTitle className="text-2xl">{workOrder.title}</CardTitle>
                <Badge variant={getStatusVariant(workOrder.status)} className="flex items-center gap-1">
                  {getStatusIcon(workOrder.status)}
                  {getStatusLabel(workOrder.status)}
                </Badge>
                {getPriorityBadge(workOrder.priority)}
              </div>
              <p className="text-muted-foreground font-mono text-sm">
                {workOrder.workOrderNo}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => onEdit(workOrder.id)}>
                编辑
              </Button>
              <Button
                variant="outline"
                className="text-destructive"
                onClick={() => onDelete(workOrder.id)}
              >
                删除
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Basic Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">设备名称</p>
              <p className="font-medium">{workOrder.equipmentName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">设备编号</p>
              <p className="font-mono text-sm">{workOrder.equipmentCode || "-"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">负责人</p>
              <p className="font-medium">{workOrder.assigneeName || "未分配"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">负责部门</p>
              <p className="font-medium">{workOrder.department || "-"}</p>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">位置：</span>
            <span className="font-medium">{workOrder.location || "未指定"}</span>
          </div>
        </CardContent>
      </Card>

      {/* Fault Description */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4" />
            故障描述
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">详细描述</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {workOrder.description}
            </p>
          </div>
          {workOrder.symptoms && (
            <>
              <Separator />
              <div>
                <p className="text-sm font-medium mb-2">故障现象</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {workOrder.symptoms}
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Timeline Information */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="h-4 w-4" />
            时间信息
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                创建时间
              </p>
              <p className="text-sm font-medium">{formatDateTime(workOrder.createTime)}</p>
            </div>
            {workOrder.assignTime && (
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <User className="h-3 w-3" />
                  指派时间
                </p>
                <p className="text-sm font-medium">{formatDateTime(workOrder.assignTime)}</p>
              </div>
            )}
            {workOrder.startTime && (
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Wrench className="h-3 w-3" />
                  开始时间
                </p>
                <p className="text-sm font-medium">{formatDateTime(workOrder.startTime)}</p>
              </div>
            )}
            {workOrder.completeTime && (
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  完成时间
                </p>
                <p className="text-sm font-medium">{formatDateTime(workOrder.completeTime)}</p>
              </div>
            )}
            {workOrder.expectCompleteTime && (
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  期望完成时间
                </p>
                <p className="text-sm font-medium">{formatDateTime(workOrder.expectCompleteTime)}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Resolution (if completed) */}
      {(workOrder.cause || workOrder.solution) && (
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              处理结果
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {workOrder.cause && (
              <div>
                <p className="text-sm font-medium mb-2">故障原因</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {workOrder.cause}
                </p>
              </div>
            )}
            {workOrder.solution && (
              <>
                <Separator />
                <div>
                  <p className="text-sm font-medium mb-2">解决方案</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {workOrder.solution}
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Metadata */}
      {workOrder.notes && (
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-base">备注信息</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {workOrder.notes}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Tags */}
      {workOrder.tags && workOrder.tags.length > 0 && (
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-2">
              {workOrder.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Button variant="outline" asChild>
          <Link href="/maintenance/workorders">返回列表</Link>
        </Button>
        <div className="flex items-center gap-2">
          {workOrder.status !== "completed" && workOrder.status !== "cancelled" && (
            <>
              <Button variant="outline">开始执行</Button>
              <Button variant="outline">标记完成</Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
