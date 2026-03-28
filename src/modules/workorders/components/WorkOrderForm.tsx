// Work Order Form Component (Create/Edit)

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { WorkOrderFormData, Priority, WorkOrder } from "@/types/workorder";
import { generateMockWorkOrders } from "../mock";

interface WorkOrderFormProps {
  mode?: "create" | "edit";
  initialData?: Partial<WorkOrder>;
  onSubmit: (data: WorkOrderFormData) => void;
  onCancel: () => void;
}

const priorityOptions: Array<{ value: Priority; label: string }> = [
  { value: "high", label: "高 - 需要立即处理" },
  { value: "medium", label: "中 - 正常优先级" },
  { value: "low", label: "低 - 可稍后处理" },
];

const categoryOptions = [
  { value: "preventive", label: "预防性维护" },
  { value: "corrective", label: "故障维修" },
  { value: "predictive", label: "预测性维护" },
  { value: "emergency", label: "紧急维修" },
];

// Mock assignees
const assigneeOptions = [
  { value: "u001", label: "张伟 - 维修一组" },
  { value: "u002", label: "李明 - 维修二组" },
  { value: "u003", label: "王强 - 维修三组" },
  { value: "u004", label: "刘洋 - 电气维修组" },
  { value: "u005", label: "陈静 - 设备保养组" },
];

export function WorkOrderForm({
  mode = "create",
  initialData,
  onSubmit,
  onCancel,
}: WorkOrderFormProps) {
  const [formData, setFormData] = useState<WorkOrderFormData>({
    priority: initialData?.priority || "medium",
    category: initialData?.category || "corrective",
    assigneeId: initialData?.assigneeId || "",
    assigneeName: initialData?.assigneeName || "",
    department: initialData?.department || "",
    title: initialData?.title || "",
    description: initialData?.description || "",
    symptoms: initialData?.symptoms || "",
    location: initialData?.location || "",
    notes: initialData?.notes || "",
  });

  const handleInputChange = (
    field: keyof WorkOrderFormData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Basic Information */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>基本信息</CardTitle>
              <CardDescription>填写工单的基本信息</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Equipment */}
                <div className="space-y-2">
                  <Label htmlFor="equipment">设备名称 *</Label>
                  <Input
                    id="equipment"
                    placeholder="选择或输入设备"
                    value={formData.equipmentName || ""}
                    onChange={(e) =>
                      handleInputChange("equipmentName", e.target.value)
                    }
                    required
                  />
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label htmlFor="category">工单类型</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleInputChange("category", value)}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="选择工单类型" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Priority */}
                <div className="space-y-2">
                  <Label htmlFor="priority">紧急程度 *</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) =>
                      handleInputChange("priority", value as Priority)
                    }
                  >
                    <SelectTrigger id="priority">
                      <SelectValue placeholder="选择紧急程度" />
                    </SelectTrigger>
                    <SelectContent>
                      {priorityOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <Label htmlFor="location">设备位置</Label>
                  <Input
                    id="location"
                    placeholder="例如：生产车间 A区"
                    value={formData.location || ""}
                    onChange={(e) =>
                      handleInputChange("location", e.target.value)
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Fault Description */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>故障描述</CardTitle>
              <CardDescription>详细描述设备故障情况</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">故障标题 *</Label>
                <Input
                  id="title"
                  placeholder="简要描述故障问题"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">详细描述 *</Label>
                <Textarea
                  id="description"
                  placeholder="详细描述故障现象、发生时间、影响范围等"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  rows={4}
                  required
                />
              </div>

              {/* Symptoms */}
              <div className="space-y-2">
                <Label htmlFor="symptoms">故障现象</Label>
                <Textarea
                  id="symptoms"
                  placeholder="描述具体的故障现象和异常情况"
                  value={formData.symptoms || ""}
                  onChange={(e) =>
                    handleInputChange("symptoms", e.target.value)
                  }
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Assignment */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>指派信息</CardTitle>
              <CardDescription>分配工单给相应的维修人员</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Assignee */}
                <div className="space-y-2">
                  <Label htmlFor="assignee">指派给</Label>
                  <Select
                    value={formData.assigneeId || ""}
                    onValueChange={(value) => {
                      const assignee = assigneeOptions.find(
                        (a) => a.value === value
                      );
                      handleInputChange("assigneeId", value);
                      handleInputChange(
                        "assigneeName",
                        assignee?.label.split(" - ")[0] || ""
                      );
                      handleInputChange(
                        "department",
                        assignee?.label.split(" - ")[1] || ""
                      );
                    }}
                  >
                    <SelectTrigger id="assignee">
                      <SelectValue placeholder="选择负责人" />
                    </SelectTrigger>
                    <SelectContent>
                      {assigneeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Expected Completion Time */}
                <div className="space-y-2">
                  <Label htmlFor="expectTime">期望完成时间</Label>
                  <Input
                    id="expectTime"
                    type="datetime-local"
                    value={formData.expectCompleteTime || ""}
                    onChange={(e) =>
                      handleInputChange("expectCompleteTime", e.target.value)
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Notes */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>备注信息</CardTitle>
              <CardDescription>其他需要说明的信息</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="其他备注信息..."
                value={formData.notes || ""}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                rows={3}
              />
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3">
            <Button type="button" variant="outline" onClick={onCancel}>
              取消
            </Button>
            <Button type="submit">
              {mode === "create" ? "创建工单" : "保存更改"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
