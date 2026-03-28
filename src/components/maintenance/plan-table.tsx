/**
 * Plan Table Component
 * Table displaying maintenance plans with actions
 */

'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { MaintenancePlan, getPlanStatusVariant, getPlanTypeBadgeClass, PLAN_TYPE_DICT, PLAN_CYCLE_DICT } from '@/types/maintenance-plan';
import { useRouter } from 'next/navigation';

interface PlanTableProps {
  plans: MaintenancePlan[];
}

export function PlanTable({ plans }: PlanTableProps) {
  const router = useRouter();

  const handleRowClick = (planNo: string) => {
    router.push(`/maintenance/plans/${planNo}`);
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-base font-medium">
          维护计划列表
          <span className="ml-2 text-sm font-normal text-muted-foreground">共 {plans.length} 条</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>计划编号</TableHead>
              <TableHead>设备名称</TableHead>
              <TableHead>计划类型</TableHead>
              <TableHead>计划周期</TableHead>
              <TableHead>执行时间</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>负责人</TableHead>
              <TableHead className="w-[50px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {plans.map((plan) => (
              <TableRow
                key={plan.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleRowClick(plan.planNo)}
              >
                <TableCell className="font-mono text-sm font-medium">{plan.planNo}</TableCell>
                <TableCell>{plan.equipmentName}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={getPlanTypeBadgeClass(plan.planType)}>
                    {PLAN_TYPE_DICT[plan.planType].label}
                  </Badge>
                </TableCell>
                <TableCell>{PLAN_CYCLE_DICT[plan.cycle].label}</TableCell>
                <TableCell>{plan.executeTime}</TableCell>
                <TableCell>
                  <Badge variant={getPlanStatusVariant(plan.status)}>
                    {plan.status}
                  </Badge>
                </TableCell>
                <TableCell>{plan.assigneeName}</TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => router.push(`/maintenance/plans/${plan.planNo}`)}>
                        查看
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push(`/maintenance/plans/${plan.planNo}/edit`)}>
                        编辑
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
