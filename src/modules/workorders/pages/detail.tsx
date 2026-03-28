// Work Order Detail Page

"use client";

import { useParams, useRouter } from "next/navigation";
import { WorkOrderDetail } from "../components/WorkOrderDetail";
import { getWorkOrderById } from "../mock";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function WorkOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const workOrderId = params.id as string;

  const workOrder = getWorkOrderById(workOrderId);

  const handleEdit = (id: string) => {
    router.push(`/maintenance/workorders/${id}/edit`);
  };

  const handleDelete = (id: string) => {
    if (confirm("确定要删除此工单吗？")) {
      // In a real app, this would call an API to delete the work order
      router.push("/maintenance/workorders");
    }
  };

  if (!workOrder) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-6 py-6">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回
          </Button>
          <div className="text-center py-12">
            <p className="text-muted-foreground">未找到工单信息</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-6 py-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回列表
          </Button>
        </div>
      </div>
      <div className="container mx-auto px-6 py-6">
        <WorkOrderDetail
          workOrder={workOrder}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
