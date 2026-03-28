/**
 * Plan Form Component
 * Form for creating/editing maintenance plans
 */

'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PLAN_TYPE_DICT, PLAN_CYCLE_DICT, PlanType, PlanCycle } from '@/types/maintenance-plan';

interface PlanFormProps {
  mode?: 'create' | 'edit';
  initialData?: {
    equipmentName?: string;
    planType?: PlanType;
    cycle?: PlanCycle;
    executeTime?: string;
    assigneeName?: string;
  };
  onSubmit?: (data: PlanFormData) => void;
  onCancel?: () => void;
}

export interface PlanFormData {
  equipmentName: string;
  planType: PlanType;
  cycle: PlanCycle;
  executeTime: string;
  assigneeName: string;
}

export function PlanForm({ mode = 'create', initialData, onSubmit, onCancel }: PlanFormProps) {
  const defaultData: PlanFormData = {
    equipmentName: '',
    planType: 'maintenance',
    cycle: 'week',
    executeTime: '',
    assigneeName: '',
  };
  const [formData, setFormData] = useState<PlanFormData>(
    initialData ? { ...defaultData, ...initialData } : defaultData
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(formData);
  };

  const handleChange = (field: keyof PlanFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="hover:shadow-md transition-shadow max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          {mode === 'create' ? '新建维护计划' : '编辑维护计划'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Equipment name */}
          <div className="space-y-2">
            <Label htmlFor="equipmentName">设备名称</Label>
            <Input
              id="equipmentName"
              value={formData.equipmentName}
              onChange={(e) => handleChange('equipmentName', e.target.value)}
              placeholder="请输入设备名称"
              required
            />
          </div>

          {/* Plan type */}
          <div className="space-y-2">
            <Label htmlFor="planType">计划类型</Label>
            <Select
              value={formData.planType}
              onValueChange={(value) => handleChange('planType', value as PlanType)}
            >
              <SelectTrigger id="planType">
                <SelectValue placeholder="选择计划类型" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(PLAN_TYPE_DICT).map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Plan cycle */}
          <div className="space-y-2">
            <Label htmlFor="cycle">计划周期</Label>
            <Select
              value={formData.cycle}
              onValueChange={(value) => handleChange('cycle', value as PlanCycle)}
            >
              <SelectTrigger id="cycle">
                <SelectValue placeholder="选择计划周期" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(PLAN_CYCLE_DICT).map((cycle) => (
                  <SelectItem key={cycle.value} value={cycle.value}>
                    {cycle.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Execute time */}
          <div className="space-y-2">
            <Label htmlFor="executeTime">执行时间</Label>
            <Input
              id="executeTime"
              type="datetime-local"
              value={formData.executeTime}
              onChange={(e) => handleChange('executeTime', e.target.value)}
              required
            />
          </div>

          {/* Assignee */}
          <div className="space-y-2">
            <Label htmlFor="assigneeName">负责人</Label>
            <Input
              id="assigneeName"
              value={formData.assigneeName}
              onChange={(e) => handleChange('assigneeName', e.target.value)}
              placeholder="请输入负责人姓名"
              required
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4">
            <Button type="submit">
              {mode === 'create' ? '创建' : '保存'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              取消
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
