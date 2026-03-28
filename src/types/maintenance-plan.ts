/**
 * Maintenance Plan Types
 * Maintenance plan module type definitions
 */

// Plan status enum
export type PlanStatus = 'pending' | 'running' | 'completed' | 'skipped';

// Plan type enum
export type PlanType = 'maintenance' | 'overhaul' | 'calibration';

// Plan cycle enum
export type PlanCycle = 'day' | 'week' | 'month' | 'hour';

/**
 * Maintenance plan entity interface
 */
export interface MaintenancePlan {
  id: string;
  planNo: string;
  equipmentName: string;
  planType: PlanType;
  cycle: PlanCycle;
  executeTime: string;
  status: PlanStatus;
  assigneeName: string;
}

/**
 * Plan status dictionary
 */
export const PLAN_STATUS_DICT = {
  pending: { label: '待执行', value: 'pending', color: 'default' as const },
  running: { label: '执行中', value: 'running', color: 'blue' as const },
  completed: { label: '已完成', value: 'completed', color: 'green' as const },
  skipped: { label: '已跳过', value: 'skipped', color: 'gray' as const },
} as const;

/**
 * Plan type dictionary
 */
export const PLAN_TYPE_DICT = {
  maintenance: { label: '保养', value: 'maintenance' },
  overhaul: { label: '检修', value: 'overhaul' },
  calibration: { label: '校准', value: 'calibration' },
} as const;

/**
 * Plan cycle dictionary
 */
export const PLAN_CYCLE_DICT = {
  day: { label: '按日', value: 'day' },
  week: { label: '按周', value: 'week' },
  month: { label: '按月', value: 'month' },
  hour: { label: '按运行小时', value: 'hour' },
} as const;

/**
 * Get plan status badge variant
 */
export function getPlanStatusVariant(status: PlanStatus): 'default' | 'secondary' | 'outline' | 'destructive' {
  const variantMap: Record<PlanStatus, 'default' | 'secondary' | 'outline' | 'destructive'> = {
    pending: 'outline',
    running: 'secondary',
    completed: 'default',
    skipped: 'outline',
  };
  return variantMap[status];
}

/**
 * Get plan type badge color class
 */
export function getPlanTypeBadgeClass(planType: PlanType): string {
  const colorMap: Record<PlanType, string> = {
    maintenance: 'border-blue-200 bg-blue-50 text-blue-700',
    overhaul: 'border-purple-200 bg-purple-50 text-purple-700',
    calibration: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  };
  return colorMap[planType];
}
