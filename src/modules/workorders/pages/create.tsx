// Work Order Create Page

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { WorkOrderForm } from "../components/WorkOrderForm";
import { WorkOrderFormData } from "@/types/workorder";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function WorkOrderCreatePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: WorkOrderFormData) => {
    setIsSubmitting(true);
    try {
      // In a real app, this would call an API to create the work order
      console.log("Creating work order:", data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Navigate back to list
      router.push("/maintenance/workorders");
    } catch (error) {
      console.error("Failed to create work order:", error);
      // Show error notification
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-6 py-4">
          <Button
            variant="ghost"
            onClick={handleCancel}
            className="mb-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回列表
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">
                创建维修工单
              </h1>
              <p className="text-sm text-muted-foreground">
                填写工单信息并分配给维修人员
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        <WorkOrderForm
          mode="create"
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}
