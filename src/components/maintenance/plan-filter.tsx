/**
 * Plan Filter Component
 * Filter bar for maintenance plan list
 */

'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { PLAN_STATUS_DICT, PLAN_TYPE_DICT } from '@/types/maintenance-plan';

interface PlanFilterProps {
  filters: {
    equipmentNo: string;
    status: string;
    planType: string;
  };
  onFilterChange: (key: string, value: string) => void;
  onReset: () => void;
}

export function PlanFilter({ filters, onFilterChange, onReset }: PlanFilterProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Equipment number search */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索设备编号"
              value={filters.equipmentNo}
              onChange={(e) => onFilterChange('equipmentNo', e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Status filter */}
          <Select value={filters.status} onValueChange={(value) => onFilterChange('status', value)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="计划状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部状态</SelectItem>
              {Object.values(PLAN_STATUS_DICT).map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Plan type filter */}
          <Select value={filters.planType} onValueChange={(value) => onFilterChange('planType', value)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="计划类型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部类型</SelectItem>
              {Object.values(PLAN_TYPE_DICT).map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Reset button */}
          <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={onReset}>
            重置
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
