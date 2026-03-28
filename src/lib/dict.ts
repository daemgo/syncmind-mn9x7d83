// Dictionary items from spec globalRules

export const dictionaries = {
  "equipment-status": [
    { label: "运行中", value: "running", color: "green" },
    { label: "停机", value: "stopped", color: "gray" },
    { label: "故障", value: "fault", color: "red" },
    { label: "停用", value: "disabled", color: "default" }
  ],
  "equipment-category": [
    { label: "数控机床", value: "cnc" },
    { label: "铣床", value: "milling" },
    { label: "车床", value: "lathe" },
    { label: "磨床", value: "grinding" },
    { label: "其他", value: "other" }
  ],
  "workshop": [
    { label: "一车间", value: "ws1" },
    { label: "二车间", value: "ws2" },
    { label: "三车间", value: "ws3" }
  ],
  "plan-status": [
    { label: "待执行", value: "pending", color: "default" },
    { label: "执行中", value: "running", color: "blue" },
    { label: "已完成", value: "completed", color: "green" },
    { label: "已跳过", value: "skipped", color: "gray" }
  ],
  "plan-type": [
    { label: "保养", value: "maintenance" },
    { label: "检修", value: "overhaul" },
    { label: "校准", value: "calibration" }
  ],
  "plan-cycle": [
    { label: "按日", value: "day" },
    { label: "按周", value: "week" },
    { label: "按月", value: "month" },
    { label: "按运行小时", value: "hour" }
  ],
  "workorder-status": [
    { label: "待派工", value: "pending", color: "default" },
    { label: "待执行", value: "assigned", color: "orange" },
    { label: "执行中", value: "processing", color: "blue" },
    { label: "待验收", value: "verifying", color: "purple" },
    { label: "已完成", value: "completed", color: "green" },
    { label: "已取消", value: "cancelled", color: "gray" }
  ],
  "order-type": [
    { label: "计划维护", value: "planned" },
    { label: "故障维修", value: "breakdown" }
  ],
  "priority": [
    { label: "高", value: "high", color: "red" },
    { label: "中", value: "medium", color: "orange" },
    { label: "低", value: "low", color: "green" }
  ],
  "spare-category": [
    { label: "电气元件", value: "electrical" },
    { label: "机械零件", value: "mechanical" },
    { label: "液压元件", value: "hydraulic" },
    { label: "刀具", value: "cutting" },
    { label: "其他", value: "other" }
  ],
  "stock-status": [
    { label: "正常", value: "normal", color: "green" },
    { label: "预警", value: "warning", color: "orange" },
    { label: "缺货", value: "outofstock", color: "red" }
  ],
  "unit": [
    { label: "件", value: "piece" },
    { label: "套", value: "set" },
    { label: "千克", value: "kg" },
    { label: "米", value: "meter" }
  ],
  "protocol": [
    { label: "OPC UA", value: "opcua" },
    { label: "Modbus TCP", value: "modbus" }
  ],
  "datatype": [
    { label: "布尔", value: "bool" },
    { label: "整数", value: "int" },
    { label: "浮点数", value: "float" },
    { label: "字符串", value: "string" }
  ]
} as const;

// Helper: get options for a dictionary
export function getDictOptions(dictId: string) {
  return dictionaries[dictId as keyof typeof dictionaries] || [];
}

// Helper: get label for a value
export function getDictLabel(dictId: string, value: string): string {
  const options = getDictOptions(dictId);
  return options.find(o => o.value === value)?.label || value;
}

// Helper: get color for a value
export function getDictColor(dictId: string, value: string): string | undefined {
  const options = getDictOptions(dictId);
  const item = options.find(o => o.value === value);
  return item && 'color' in item ? item.color : undefined;
}
