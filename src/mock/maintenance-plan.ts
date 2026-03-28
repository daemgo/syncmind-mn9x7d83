/**
 * Maintenance Plan Mock Data
 * 15 maintenance plan records
 */

import { MaintenancePlan, PlanStatus, PlanType, PlanCycle } from '@/types/maintenance-plan';

// Helper to generate sequential plan numbers
const generatePlanNo = (index: number): string => {
  const num = String(index + 1).padStart(4, '0');
  return `MP2603${num}`;
};

// Mock equipment names
const equipmentNames = [
  'CNC车床-01',
  '数控铣床-02',
  '加工中心-03',
  '磨床-04',
  '冲压机-05',
  '注塑机-06',
  '激光切割机-07',
  '焊接机器人-08',
  '液压机-09',
  '空压机-10',
  '热处理炉-11',
  '电火花机-12',
  '龙门铣床-13',
  '剪板机-14',
  '折弯机-15',
];

// Mock assignees
const assignees = [
  '张伟',
  '李强',
  '王明',
  '刘洋',
  '陈华',
  '赵敏',
  '孙杰',
  '周涛',
];

// Generate dates around current time (March 2026)
const generateDate = (offset: number): string => {
  const date = new Date('2026-03-28');
  date.setDate(date.getDate() + offset);
  return date.toISOString().slice(0, 16).replace('T', ' ');
};

export const maintenancePlanMockData: MaintenancePlan[] = [
  {
    id: '1',
    planNo: generatePlanNo(0),
    equipmentName: equipmentNames[0],
    planType: 'maintenance' as PlanType,
    cycle: 'week' as PlanCycle,
    executeTime: generateDate(-2),
    status: 'completed' as PlanStatus,
    assigneeName: assignees[0],
  },
  {
    id: '2',
    planNo: generatePlanNo(1),
    equipmentName: equipmentNames[1],
    planType: 'overhaul' as PlanType,
    cycle: 'month' as PlanCycle,
    executeTime: generateDate(0),
    status: 'running' as PlanStatus,
    assigneeName: assignees[1],
  },
  {
    id: '3',
    planNo: generatePlanNo(2),
    equipmentName: equipmentNames[2],
    planType: 'calibration' as PlanType,
    cycle: 'day' as PlanCycle,
    executeTime: generateDate(1),
    status: 'pending' as PlanStatus,
    assigneeName: assignees[2],
  },
  {
    id: '4',
    planNo: generatePlanNo(3),
    equipmentName: equipmentNames[3],
    planType: 'maintenance' as PlanType,
    cycle: 'week' as PlanCycle,
    executeTime: generateDate(2),
    status: 'pending' as PlanStatus,
    assigneeName: assignees[3],
  },
  {
    id: '5',
    planNo: generatePlanNo(4),
    equipmentName: equipmentNames[4],
    planType: 'maintenance' as PlanType,
    cycle: 'hour' as PlanCycle,
    executeTime: generateDate(-5),
    status: 'completed' as PlanStatus,
    assigneeName: assignees[4],
  },
  {
    id: '6',
    planNo: generatePlanNo(5),
    equipmentName: equipmentNames[5],
    planType: 'overhaul' as PlanType,
    cycle: 'month' as PlanCycle,
    executeTime: generateDate(-1),
    status: 'running' as PlanStatus,
    assigneeName: assignees[5],
  },
  {
    id: '7',
    planNo: generatePlanNo(6),
    equipmentName: equipmentNames[6],
    planType: 'calibration' as PlanType,
    cycle: 'week' as PlanCycle,
    executeTime: generateDate(3),
    status: 'pending' as PlanStatus,
    assigneeName: assignees[6],
  },
  {
    id: '8',
    planNo: generatePlanNo(7),
    equipmentName: equipmentNames[7],
    planType: 'maintenance' as PlanType,
    cycle: 'day' as PlanCycle,
    executeTime: generateDate(4),
    status: 'pending' as PlanStatus,
    assigneeName: assignees[7],
  },
  {
    id: '9',
    planNo: generatePlanNo(8),
    equipmentName: equipmentNames[8],
    planType: 'maintenance' as PlanType,
    cycle: 'week' as PlanCycle,
    executeTime: generateDate(-7),
    status: 'completed' as PlanStatus,
    assigneeName: assignees[0],
  },
  {
    id: '10',
    planNo: generatePlanNo(9),
    equipmentName: equipmentNames[9],
    planType: 'overhaul' as PlanType,
    cycle: 'month' as PlanCycle,
    executeTime: generateDate(5),
    status: 'pending' as PlanStatus,
    assigneeName: assignees[1],
  },
  {
    id: '11',
    planNo: generatePlanNo(10),
    equipmentName: equipmentNames[10],
    planType: 'calibration' as PlanType,
    cycle: 'week' as PlanCycle,
    executeTime: generateDate(-3),
    status: 'skipped' as PlanStatus,
    assigneeName: assignees[2],
  },
  {
    id: '12',
    planNo: generatePlanNo(11),
    equipmentName: equipmentNames[11],
    planType: 'maintenance' as PlanType,
    cycle: 'day' as PlanCycle,
    executeTime: generateDate(6),
    status: 'pending' as PlanStatus,
    assigneeName: assignees[3],
  },
  {
    id: '13',
    planNo: generatePlanNo(12),
    equipmentName: equipmentNames[12],
    planType: 'overhaul' as PlanType,
    cycle: 'hour' as PlanCycle,
    executeTime: generateDate(7),
    status: 'pending' as PlanStatus,
    assigneeName: assignees[4],
  },
  {
    id: '14',
    planNo: generatePlanNo(13),
    equipmentName: equipmentNames[13],
    planType: 'maintenance' as PlanType,
    cycle: 'week' as PlanCycle,
    executeTime: generateDate(-10),
    status: 'completed' as PlanStatus,
    assigneeName: assignees[5],
  },
  {
    id: '15',
    planNo: generatePlanNo(14),
    equipmentName: equipmentNames[14],
    planType: 'calibration' as PlanType,
    cycle: 'month' as PlanCycle,
    executeTime: generateDate(8),
    status: 'pending' as PlanStatus,
    assigneeName: assignees[6],
  },
];
