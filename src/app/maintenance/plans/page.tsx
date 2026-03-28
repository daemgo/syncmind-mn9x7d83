/**
 * Maintenance Plans List Page
 * Main page for managing maintenance plans
 */

'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { maintenancePlanMockData } from '@/mock/maintenance-plan';
import { PlanFilter } from '@/components/maintenance/plan-filter';
import { PlanTable } from '@/components/maintenance/plan-table';
import { MaintenancePlan } from '@/types/maintenance-plan';

export default function MaintenancePlansPage() {
  const router = useRouter();
  const [filters, setFilters] = useState({
    equipmentNo: '',
    status: 'all',
    planType: 'all',
  });

  // Filter plans
  const filteredPlans = useMemo(() => {
    return maintenancePlanMockData.filter((plan) => {
      // Equipment number filter
      if (filters.equipmentNo && !plan.equipmentName.toLowerCase().includes(filters.equipmentNo.toLowerCase())) {
        return false;
      }
      // Status filter
      if (filters.status !== 'all' && plan.status !== filters.status) {
        return false;
      }
      // Plan type filter
      if (filters.planType !== 'all' && plan.planType !== filters.planType) {
        return false;
      }
      return true;
    });
  }, [filters]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setFilters({
      equipmentNo: '',
      status: 'all',
      planType: 'all',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">维护计划</h1>
            <p className="text-sm text-muted-foreground">管理设备维护计划和执行进度</p>
          </div>
          <Button onClick={() => router.push('/maintenance/plans/create')}>
            <Plus className="mr-1.5 h-4 w-4" />
            新建计划
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6 space-y-6">
        {/* Filter */}
        <PlanFilter
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleReset}
        />

        {/* Table */}
        <PlanTable plans={filteredPlans} />
      </div>
    </div>
  );
}
