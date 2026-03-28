// Mock Data for Maintenance Work Orders

import { WorkOrder, WorkOrderListItem } from "@/types/workorder";

/**
 * Generate work order number in format WO26030001
 */
function generateWorkOrderNo(index: number): string {
  const year = 26; // 2026
  const month = 3; // March
  const sequence = String(index + 1).padStart(4, "0");
  return `WO${year}${String(month).padStart(2, "0")}${sequence}`;
}

/**
 * Get random item from array
 */
function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Get random date within range
 */
function randomDate(start: Date, end: Date): string {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString();
}

/**
 * Work order statuses with probabilities
 */
const statuses: Array<{ value: WorkOrder["status"]; weight: number }> = [
  { value: "pending", weight: 15 },
  { value: "assigned", weight: 20 },
  { value: "processing", weight: 25 },
  { value: "verifying", weight: 15 },
  { value: "completed", weight: 20 },
  { value: "cancelled", weight: 5 },
];

/**
 * Priority levels with probabilities
 */
const priorities: Array<{ value: WorkOrder["priority"]; weight: number }> = [
  { value: "high", weight: 20 },
  { value: "medium", weight: 50 },
  { value: "low", weight: 30 },
];

/**
 * Get weighted random item
 */
function weightedRandom<T>(arr: Array<{ value: T; weight: number }>): T {
  const totalWeight = arr.reduce((sum, item) => sum + item.weight, 0);
  let random = Math.random() * totalWeight;
  for (const item of arr) {
    random -= item.weight;
    if (random <= 0) return item.value;
  }
  return arr[arr.length - 1].value;
}

/**
 * Sample equipment data
 */
const equipmentList = [
  { name: "数控机床 CNC-001", code: "EQ-CNC-001", location: "生产车间 A区" },
  { name: "注塑机 INJ-203", code: "EQ-INJ-203", location: "生产车间 B区" },
  { name: "空压机 AC-05", code: "EQ-AC-05", location: "动力机房" },
  { name: "输送带 CV-12", code: "EQ-CV-12", location: "装配线" },
  { name: "焊接机器人 RB-08", code: "EQ-RB-08", location: "焊接车间" },
  { name: "激光切割机 LC-03", code: "EQ-LC-03", location: "切割车间" },
  { name: "冲压机 PR-15", code: "EQ-PR-15", location: "冲压车间" },
  { name: "热处理炉 HT-02", code: "EQ-HT-02", location: "热处理车间" },
  { name: "冷却塔 CT-04", code: "EQ-CT-04", location: "屋顶" },
  { name: "配电柜 DB-11", code: "EQ-DB-11", location: "配电室" },
  { name: "叉车 FL-07", code: "EQ-FL-07", location: "仓储区" },
  { name: "起重机 CR-03", code: "EQ-CR-03", location: "原料车间" },
];

/**
 * Sample assignees
 */
const assignees = [
  { id: "u001", name: "张伟", department: "维修一组" },
  { id: "u002", name: "李明", department: "维修二组" },
  { id: "u003", name: "王强", department: "维修三组" },
  { id: "u004", name: "刘洋", department: "电气维修组" },
  { id: "u005", name: "陈静", department: "设备保养组" },
];

/**
 * Sample work order titles and descriptions
 */
const workOrderTemplates = [
  {
    title: "设备异响排查",
    description: "设备运行时出现异常噪音，需要检查机械部件和润滑情况",
  },
  {
    title: "定期保养维护",
    description: "按照保养计划进行设备的定期检查、清洁和润滑",
  },
  {
    title: "电气故障维修",
    description: "设备无法正常启动，怀疑电气控制系统存在问题",
  },
  {
    title: "液压系统检修",
    description: "液压系统压力不稳定，需要检查液压泵和管路",
  },
  {
    title: "零部件更换",
    description: "设备零部件磨损严重，需要更换易损件",
  },
  {
    title: "安全装置校验",
    description: "设备安全保护装置需要定期校验和测试",
  },
  {
    title: "精度调整校准",
    description: "设备加工精度偏差，需要进行重新校准",
  },
  {
    title: "紧急故障抢修",
    description: "设备突发故障停机，影响生产进度，需要紧急处理",
  },
];

/**
 * Generate mock work order
 */
function generateMockWorkOrder(index: number): WorkOrder {
  const equipment = randomItem(equipmentList);
  const status = weightedRandom(statuses);
  const priority = weightedRandom(priorities);
  const template = randomItem(workOrderTemplates);
  const assignee = randomItem(assignees);

  const createTime = randomDate(
    new Date(2026, 2, 1),  // March 1, 2026
    new Date(2026, 2, 28)  // March 28, 2026
  );

  // Set assign time if status is beyond pending
  let assignTime: string | undefined;
  if (status !== "pending") {
    assignTime = new Date(new Date(createTime).getTime() + Math.random() * 86400000).toISOString();
  }

  // Set start time if status is beyond assigned
  let startTime: string | undefined;
  if (status === "processing" || status === "verifying" || status === "completed") {
    startTime = new Date(new Date(assignTime || createTime).getTime() + Math.random() * 86400000).toISOString();
  }

  // Set complete time if status is completed
  let completeTime: string | undefined;
  if (status === "completed") {
    completeTime = new Date(new Date(startTime || assignTime || createTime).getTime() + Math.random() * 172800000).toISOString();
  }

  // Calculate expected completion time (1-7 days from creation)
  const expectCompleteTime = new Date(new Date(createTime).getTime() + (Math.random() * 6 + 1) * 86400000).toISOString();

  return {
    id: `wo_${index + 1}`,
    workOrderNo: generateWorkOrderNo(index),
    equipmentId: equipment.code,
    equipmentName: equipment.name,
    equipmentCode: equipment.code,
    priority,
    status,
    category: randomItem(["预防性维护", " corrective", "预测性维护", "紧急维修"]),
    assigneeId: assignee.id,
    assigneeName: assignee.name,
    department: assignee.department,
    createTime,
    updateTime: randomDate(new Date(createTime), new Date()),
    assignTime,
    startTime,
    completeTime,
    expectCompleteTime,
    title: template.title,
    description: template.description,
    symptoms: status !== "pending" ? "已记录故障现象" : undefined,
    cause: status === "completed" || status === "verifying" ? "已分析故障原因" : undefined,
    solution: status === "completed" ? "已完成维修处理" : undefined,
    location: equipment.location,
    building: equipment.location.split(" ")[0],
    tags: [priority === "high" ? "紧急" : "常规", randomItem(["机械", "电气", "液压", "润滑"])],
    createdBy: randomItem(["系统生成", "操作员提交", "巡检发现"]),
  };
}

/**
 * Generate all mock work orders
 */
export function generateMockWorkOrders(count: number = 25): WorkOrder[] {
  return Array.from({ length: count }, (_, i) => generateMockWorkOrder(i));
}

/**
 * Get work order list items (for table display)
 */
export function getWorkOrderListItems(): WorkOrderListItem[] {
  const workOrders = generateMockWorkOrders(25);
  return workOrders.map((wo) => ({
    id: wo.id,
    workOrderNo: wo.workOrderNo,
    equipmentName: wo.equipmentName,
    priority: wo.priority,
    status: wo.status,
    assigneeName: wo.assigneeName,
    createTime: wo.createTime,
    expectCompleteTime: wo.expectCompleteTime,
  }));
}

/**
 * Get work order by ID
 */
export function getWorkOrderById(id: string): WorkOrder | undefined {
  const workOrders = generateMockWorkOrders(25);
  return workOrders.find((wo) => wo.id === id);
}

/**
 * Export mock data
 */
export const mockWorkOrders = generateMockWorkOrders(25);
export const mockWorkOrderListItems = getWorkOrderListItems();
