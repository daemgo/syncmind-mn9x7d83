"use client";

import { useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Maximize2,
  RefreshCw,
  Settings,
  TrendingUp,
  Wrench,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Line,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import mockEquipment from "@/mock/equipment";
import { maintenancePlanMockData } from "@/mock/maintenance-plan";
import { mockWorkOrders } from "@/modules/workorders/mock";

// Chart config
const chartConfig: ChartConfig = {
  oee: { label: "OEE", color: "var(--color-chart-1)" },
  target: { label: "目标", color: "var(--color-chart-2)" },
  rate: { label: "故障率", color: "var(--color-chart-1)" },
};

// OEE Trend Data (Last 24 hours) - inline mock
const oeeTrendData = Array.from({ length: 24 }, (_, i) => {
  const hour = (i + 1) % 24;
  return {
    time: `${hour}:00`,
    oee: 65 + Math.random() * 25,
    target: 85,
  };
});

// Fault Rate Trend Data (Last 7 days) - inline mock
const faultRateData = [
  { day: "03-22", rate: 2.1 },
  { day: "03-23", rate: 1.8 },
  { day: "03-24", rate: 2.5 },
  { day: "03-25", rate: 1.5 },
  { day: "03-26", rate: 2.2 },
  { day: "03-27", rate: 1.9 },
  { day: "03-28", rate: 1.6 },
];

// Calculate stats from mock equipment data
const equipmentStats = {
  total: mockEquipment.length,
  running: mockEquipment.filter(e => e.status === "running").length,
  stopped: mockEquipment.filter(e => e.status === "stopped").length,
  fault: mockEquipment.filter(e => e.status === "fault").length,
  overallOEE: Math.round(
    mockEquipment
      .filter(e => e.status === "running")
      .reduce((sum, e) => sum + e.oee, 0) /
    mockEquipment.filter(e => e.status === "running").length || 0
  ),
};

// TOP5 Fault Equipment (simulated from mock data)
const top5FaultEquipment = mockEquipment
  .filter(e => e.status === "fault")
  .slice(0, 5)
  .map((e, i) => ({
    name: e.equipmentName,
    count: Math.floor(Math.random() * 10) + 1,
    trend: Math.random() > 0.5 ? "up" : "down" as "up" | "down",
  }));

// Fill if less than 5
if (top5FaultEquipment.length < 5) {
  const remaining = 5 - top5FaultEquipment.length;
  for (let i = 0; i < remaining; i++) {
    top5FaultEquipment.push({
      name: `设备-F${i + 1}`,
      count: Math.floor(Math.random() * 5) + 1,
      trend: Math.random() > 0.5 ? "up" : "down",
    });
  }
}

// TOP5 Inefficient Equipment (by OEE, ascending)
const top5InefficientEquipment = [...mockEquipment]
  .filter(e => e.status === "running")
  .sort((a, b) => a.oee - b.oee)
  .slice(0, 5)
  .map(e => ({
    name: e.equipmentName,
    oee: e.oee,
  }));

// Fill if less than 5
if (top5InefficientEquipment.length < 5) {
  const remaining = 5 - top5InefficientEquipment.length;
  for (let i = 0; i < remaining; i++) {
    top5InefficientEquipment.push({
      name: `设备-L${i + 1}`,
      oee: Math.floor(Math.random() * 30) + 50,
    });
  }
}

// Maintenance plan execution rate
const completedPlans = maintenancePlanMockData.filter(p => p.status === "completed").length;
const totalPlans = maintenancePlanMockData.length;
const planExecutionRate = Math.round((completedPlans / totalPlans) * 100);

// Real-time alerts (inline mock, combining work orders and simulated alerts)
const alertsData = [
  {
    id: 1,
    type: "fault",
    text: `${mockEquipment.find(e => e.status === "fault")?.equipmentName || "设备"} 故障待处理`,
    time: "2分钟前",
    severity: "high" as const,
  },
  {
    id: 2,
    type: "warning",
    text: `${mockEquipment.find(e => e.oee < 70)?.equipmentName || "设备"} OEE低于阈值`,
    time: "15分钟前",
    severity: "medium" as const,
  },
  {
    id: 3,
    type: "order",
    text: `工单 ${mockWorkOrders.find(w => w.status === "pending")?.workOrderNo || "WO26030001"} 待派工`,
    time: "32分钟前",
    severity: "medium" as const,
  },
  {
    id: 4,
    type: "fault",
    text: `${mockEquipment.find(e => e.status === "fault")?.equipmentName || "设备"} 异常震动`,
    time: "45分钟前",
    severity: "high" as const,
  },
  {
    id: 5,
    type: "warning",
    text: `${mockEquipment[0]?.equipmentName || "设备"} 润滑油位低`,
    time: "1小时前",
    severity: "medium" as const,
  },
  {
    id: 6,
    type: "order",
    text: `工单 ${mockWorkOrders.find(w => w.priority === "high")?.workOrderNo || "WO26030002"} 紧急处理中`,
    time: "2小时前",
    severity: "high" as const,
  },
  {
    id: 7,
    type: "warning",
    text: `${mockEquipment[1]?.equipmentName || "设备"} 维保计划即将到期`,
    time: "3小时前",
    severity: "medium" as const,
  },
  {
    id: 8,
    type: "fault",
    text: `${mockEquipment[2]?.equipmentName || "设备"} 电压异常`,
    time: "4小时前",
    severity: "high" as const,
  },
  {
    id: 9,
    type: "order",
    text: `工单 ${mockWorkOrders.find(w => w.status === "verifying")?.workOrderNo || "WO26030003"} 待验收`,
    time: "5小时前",
    severity: "low" as const,
  },
  {
    id: 10,
    type: "warning",
    text: `${mockEquipment[3]?.equipmentName || "设备"} 清洗计划执行中`,
    time: "6小时前",
    severity: "low" as const,
  },
];

export default function DashboardPage() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const handleRefresh = () => {
    setLastRefresh(new Date());
  };

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (!isFullscreen) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" });
  };

  const getDotColor = (type: string, severity: string) => {
    if (severity === "high") return "bg-red-500";
    if (type === "fault") return "bg-amber-500";
    return "bg-blue-500";
  };

  return (
    <div className={`min-h-screen bg-background ${isFullscreen ? "fixed inset-0 z-50" : ""}`}>
      {/* Sticky Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">EAM 监控大屏</h1>
            <p className="text-sm text-muted-foreground">实时监控设备运行状态与关键指标</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground mr-2">
              最后更新: {formatTime(lastRefresh)}
            </span>
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleFullscreen}>
              <Maximize2 className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6 space-y-6">
        {/* Global Statistics */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">设备总数</p>
                <div className="bg-blue-50 text-blue-600 rounded-lg p-2">
                  <Activity className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-2 text-2xl font-bold">{equipmentStats.total}</p>
              <div className="mt-1 flex items-center gap-1 text-xs">
                <span className="text-muted-foreground">在用设备</span>
                <span className="font-medium">{equipmentStats.total - equipmentStats.fault}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">运行中</p>
                <div className="bg-emerald-50 text-emerald-600 rounded-lg p-2">
                  <TrendingUp className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-2 text-2xl font-bold text-emerald-600">{equipmentStats.running}</p>
              <div className="mt-1 flex items-center gap-1 text-xs">
                <ArrowUp className="h-3 w-3 text-emerald-600" />
                <span className="text-emerald-600">+2</span>
                <span className="text-muted-foreground">较昨日</span>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">停机</p>
                <div className="bg-gray-50 text-gray-600 rounded-lg p-2">
                  <ArrowDown className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-2 text-2xl font-bold">{equipmentStats.stopped}</p>
              <div className="mt-1 flex items-center gap-1 text-xs">
                <span className="text-muted-foreground">计划停机</span>
                <span className="font-medium">{Math.max(0, equipmentStats.stopped - 1)}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">故障</p>
                <div className="bg-red-50 text-red-600 rounded-lg p-2">
                  <AlertTriangle className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-2 text-2xl font-bold text-red-600">{equipmentStats.fault}</p>
              <div className="mt-1 flex items-center gap-1 text-xs">
                <ArrowDown className="h-3 w-3 text-emerald-600" />
                <span className="text-emerald-600">-1</span>
                <span className="text-muted-foreground">较昨日</span>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">综合 OEE</p>
                <div className="bg-violet-50 text-violet-600 rounded-lg p-2">
                  <Activity className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-2 text-2xl font-bold">{equipmentStats.overallOEE}%</p>
              <div className="mt-1 flex items-center gap-1 text-xs">
                <ArrowUp className="h-3 w-3 text-emerald-600" />
                <span className="text-emerald-600">+3.2%</span>
                <span className="text-muted-foreground">较上月</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* OEE Trend */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">OEE 趋势（最近24小时）</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[280px] w-full">
                <LineChart data={oeeTrendData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="time" className="text-xs" tick={{ fill: "var(--color-muted-foreground)" }} />
                  <YAxis className="text-xs" tick={{ fill: "var(--color-muted-foreground)" }} domain={[0, 100]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="oee"
                    stroke="var(--color-chart-1)"
                    strokeWidth={2}
                    dot={{ r: 3, fill: "var(--color-chart-1)" }}
                    activeDot={{ r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="target"
                    stroke="var(--color-chart-2)"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Fault Rate Trend */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">故障率趋势（最近7天）</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[280px] w-full">
                <LineChart data={faultRateData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="day" className="text-xs" tick={{ fill: "var(--color-muted-foreground)" }} />
                  <YAxis className="text-xs" tick={{ fill: "var(--color-muted-foreground)" }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="rate"
                    stroke="var(--color-chart-1)"
                    strokeWidth={2}
                    dot={{ r: 4, fill: "var(--color-chart-1)" }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* TOP5 Fault Equipment */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                TOP5 故障设备
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {top5FaultEquipment.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="text-xs font-medium text-muted-foreground w-5">#{index + 1}</span>
                      <span className="text-sm truncate">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{item.count}</span>
                      {item.trend === "up" ? (
                        <ArrowUp className="h-3 w-3 text-red-500" />
                      ) : (
                        <ArrowDown className="h-3 w-3 text-emerald-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* TOP5 Inefficient Equipment */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-amber-500" />
                TOP5 低效设备
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {top5InefficientEquipment.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="text-xs font-medium text-muted-foreground w-5">#{index + 1}</span>
                      <span className="text-sm truncate">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-amber-600">{item.oee}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Maintenance Plan Execution Rate */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Wrench className="h-4 w-4 text-blue-500" />
                维护计划执行率
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-4">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="var(--color-muted)"
                    strokeWidth="12"
                    fill="none"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="var(--color-chart-1)"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 56}`}
                    strokeDashoffset={`${2 * Math.PI * 56 * (1 - planExecutionRate / 100)}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold">{planExecutionRate}%</span>
                </div>
              </div>
              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground">本月完成计划</p>
                <p className="text-lg font-semibold">{completedPlans} / {totalPlans}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Real-time Alerts Timeline */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">实时预警</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-0">
              {alertsData.map((alert, index) => (
                <div key={alert.id} className="flex gap-3">
                  <div className="relative flex flex-col items-center">
                    <div className={`h-2 w-2 rounded-full mt-1.5 ${getDotColor(alert.type, alert.severity)}`} />
                    {index < alertsData.length - 1 && <div className="w-px flex-1 bg-border mt-1" />}
                  </div>
                  <div className="pb-4 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm leading-snug">{alert.text}</p>
                      {alert.severity === "high" && (
                        <Badge variant="destructive" className="text-xs">紧急</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
