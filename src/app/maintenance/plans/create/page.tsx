/**
 * Create Maintenance Plan Page
 * Page for creating a new maintenance plan
 */

'use client';

import { useRouter } from 'next/navigation';
import { PlanForm, PlanFormData } from '@/components/maintenance/plan-form';

export default function CreateMaintenancePlanPage() {
  const router = useRouter();

  const handleSubmit = (data: PlanFormData) => {
    // TODO: Implement API call to create plan
    console.log('Creating plan:', data);
    router.push('/maintenance/plans');
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-semibold tracking-tight">新建维护计划</h1>
          <p className="text-sm text-muted-foreground">创建新的设备维护计划</p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        <PlanForm
          mode="create"
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}
