"use client";

/**
 * EAM 监控大屏
 * 实时展示设备运行状态和关键指标
 */

import {
  Activity,
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Cable,
  Expand,
  RefreshCw,
  Settings,
  Wrench,
} from "lucide-react";
import { useState, useEffect } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// ─── Mock Data ──────────────────────────────────────────────

const mockStats = {
  totalDevices: 156,
  runningCount: 124,
  stoppedCount: 22,
  faultCount: 10,
  overallOEE: 82.5,
};

const mockWorkshopData = [
  { name: "一车间", running: 45, stopped: 8, fault: 3, total: 56, oee: 84.2 },
  { name: "二车间", running: 42, stopped: 10, fault: 4, total: 56, oee: 79.8 },
  { name: "三车间", running: 37, stopped: 4, fault: 3, total: 44, oee: 86.1 },
];

const mockTopFaultDevices = [
  { equipmentNo: "EQ2603001", equipmentName: "数控铣床 X-001", faultCount: 8 },
  { equipmentNo: "EQ2603015", equipmentName: "车床 C-023", faultCount: 6 },
  { equipmentNo: "EQ2603028", equipmentName: "磨床 M-011", faultCount: 5 },
  { equipmentNo: "EQ2603033", equipmentName: "加工中心 Z-005", faultCount: 4 },
  { equipmentNo: "EQ2603041", equipmentName: "铣床 X-018", faultCount: 3 },
];

const mockTopInefficientDevices = [
  { equipmentNo: "EQ2603008", equipmentName: "车床 C-009", oee: 62.3 },
  { equipmentNo: "EQ2603019", equipmentName: "铣床 X-012", oee: 68.5 },
  { equipmentNo: "EQ2603025", equipmentName: "磨床 M-007", oee: 71.2 },
  { equipmentNo: "EQ2603036", equipmentName: "加工中心 Z-008", oee: 73.8 },
  { equipmentNo: "EQ2603044", equipmentName: "数控铣床 X-021", oee: 75.4 },
];

const mockMaintenanceExecution = { completed: 42, total: 48, rate: 87.5 };

const mockAlerts = [
  { id: 1, time: "10:32", type: "fault" as const, message: "设备 EQ2603001 数控铣床 X-001 发生故障", level: "high" as const },
  { id: 2, time: "10:28", type: "workorder" as const, message: "工单 WO2603045 等待派工", level: "medium" as const },
  { id: 3, time: "10:15", type: "fault" as const, message: "设备 EQ2603015 车床 C-023 温度异常", level: "high" as const },
  { id: 4, time: "09:58", type: "workorder" as const, message: "工单 WO2603044 执行超时", level: "medium" as const },
  { id: 5, time: "09:42", type: "alert" as const, message: "备件 SP2603012 库存不足", level: "low" as const },
  { id: 6, time: "09:30", type: "fault" as const, message: "设备 EQ2603028 磨床 M-011 振动异常", level: "high" as const },
  { id: 7, time: "09:15", type: "workorder" as const, message: "工单 WO2603043 等待验收", level: "low" as const },
  { id: 8, time: "08:50", type: "alert" as const, message: "设备 EQ2603002 保养计划到期", level: "low" as const },
  { id: 9, time: "08:30", type: "fault" as const, message: "设备 EQ2603033 加工中心 Z-005 主轴报警", level: "high" as const },
  { id: 10, time: "08:15", type: "alert" as const, message: "一车间 OEE 低于预警阈值", level: "medium" as const },
];

const mockOEETrend = [
  { time: "00:00", oee: 75.2 },
  { time: "02:00", oee: 78.5 },
  { time: "04:00", oee: 82.1 },
  { time: "06:00", oee: 85.3 },
  { time: "08:00", oee: 83.7 },
  { time: "10:00", oee: 86.2 },
  { time: "12:00", oee: 84.8 },
  { time: "14:00", oee: 87.5 },
  { time: "16:00", oee: 85.9 },
  { time: "18:00", oee: 83.2 },
  { time: "20:00", oee: 80.6 },
  { time: "22:00", oee: 78.1 },
];

const mockFaultRateTrend = [
  { date: "03-22", rate: 3.2 },
  { date: "03-23", rate: 2.8 },
  { date: "03-24", rate: 4.1 },
  { date: "03-25", rate: 3.5 },
  { date: "03-26", rate: 2.9 },
  { date: "03-27", rate: 3.8 },
  { date: "03-28", rate: 4.2 },
];

const mockMaintenanceCostTrend = [
  { month: "10月", cost: 12.5 },
  { month: "11月", cost: 15.8 },
  { month: "12月", cost: 18.2 },
  { month: "1月", cost: 14.6 },
  { month: "2月", cost: 16.3 },
  { month: "3月", cost: 19.8 },
];

const workshopStatusColors = {
  running: "#10b981",
  stopped: "#94a3b8",
  fault: "#ef4444",
};

// ─── Chart Config ───────────────────────────────────────────

const oeeChartConfig: ChartConfig = {
  oee: { label: "OEE", color: "hsl(var(--chart-1))" },
};

const faultRateChartConfig: ChartConfig = {
  rate: { label: "故障率", color: "hsl(var(--chart-2))" },
};

const workshopChartConfig: ChartConfig = {
  running: { label: "运行中", color: workshopStatusColors.running },
  stopped: { label: "停机", color: workshopStatusColors.stopped },
  fault: { label: "故障", color: workshopStatusColors.fault },
};

// ─── Helpers ────────────────────────────────────────────────

function getAlertIcon(type: string) {
  switch (type) {
    case "fault":
      return AlertTriangle;
    case "workorder":
      return Wrench;
    case "alert":
      return Cable;
    default:
      return Activity;
  }
}

function getAlertColor(level: string) {
  switch (level) {
    case "high":
      return "bg-red-500";
    case "medium":
      return "bg-amber-500";
    case "low":
      return "bg-blue-500";
    default:
      return "bg-gray-500";
  }
}

// ─── Component ──────────────────────────────────────────────

export default function EAMDashboardPage() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const refreshData = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastUpdate(new Date());
    }, 1000);
  };

  // Auto refresh every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`min-h-screen bg-background ${isFullscreen ? "p-0" : ""}`}>
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">EAM 监控大屏</h1>
            <p className="text-sm text-muted-foreground">设备运行状态总览</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              更新时间: {lastUpdate.toLocaleTimeString("zh-CN")}
            </span>
            <Button variant="outline" size="sm" onClick={refreshData} disabled={isRefreshing}>
              <RefreshCw className={`mr-1.5 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              刷新
            </Button>
            <Button variant="outline" size="sm" onClick={toggleFullscreen}>
              <Expand className="mr-1.5 h-4 w-4" />
              全屏
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="mr-1.5 h-4 w-4" />
              设置
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">设备总数</p>
                <div className="bg-blue-50 text-blue-600 rounded-lg p-2">
                  <Activity className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-2 text-2xl font-bold">{mockStats.totalDevices}</p>
              <p className="text-xs text-muted-foreground mt-1">全厂设备统计</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">运行中</p>
                <div className="bg-emerald-50 text-emerald-600 rounded-lg p-2">
                  <Activity className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-2 text-2xl font-bold text-emerald-600">{mockStats.runningCount}</p>
              <p className="text-xs text-muted-foreground mt-1">
                占比 {((mockStats.runningCount / mockStats.totalDevices) * 100).toFixed(1)}%
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">停机</p>
                <div className="bg-gray-50 text-gray-600 rounded-lg p-2">
                  <Activity className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-2 text-2xl font-bold text-gray-600">{mockStats.stoppedCount}</p>
              <p className="text-xs text-muted-foreground mt-1">
                占比 {((mockStats.stoppedCount / mockStats.totalDevices) * 100).toFixed(1)}%
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow border-red-200">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">故障</p>
                <div className="bg-red-50 text-red-600 rounded-lg p-2 animate-pulse">
                  <AlertTriangle className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-2 text-2xl font-bold text-red-600">{mockStats.faultCount}</p>
              <p className="text-xs text-muted-foreground mt-1">
                占比 {((mockStats.faultCount / mockStats.totalDevices) * 100).toFixed(1)}%
              </p>
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
              <p className="mt-2 text-2xl font-bold text-violet-600">{mockStats.overallOEE}%</p>
              <div className="mt-1 flex items-center gap-1 text-xs">
                <ArrowUp className="h-3 w-3 text-emerald-600" />
                <span className="text-emerald-600">+2.3%</span>
                <span className="text-muted-foreground">较昨日</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Workshop Status */}
        <div className="grid gap-4 lg:grid-cols-3">
          {mockWorkshopData.map((workshop) => (
            <Card key={workshop.name} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium flex items-center justify-between">
                  {workshop.name}
                  <Badge variant="outline" className="ml-2">
                    OEE: {workshop.oee}%
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={workshopChartConfig} className="h-[140px] w-full">
                  <PieChart>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Pie
                      data={[
                        { name: "运行中", value: workshop.running, fill: workshopStatusColors.running },
                        { name: "停机", value: workshop.stopped, fill: workshopStatusColors.stopped },
                        { name: "故障", value: workshop.fault, fill: workshopStatusColors.fault },
                      ]}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={60}
                      strokeWidth={2}
                      stroke="var(--color-background)"
                    />
                  </PieChart>
                </ChartContainer>
                <div className="mt-2 flex justify-around text-xs">
                  <div className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="text-muted-foreground">运行: {workshop.running}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-gray-400" />
                    <span className="text-muted-foreground">停机: {workshop.stopped}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-red-500" />
                    <span className="text-muted-foreground">故障: {workshop.fault}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Top Lists + Maintenance */}
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Top Fault Devices */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium text-red-600">
                <AlertTriangle className="inline mr-2 h-4 w-4" />
                TOP5 故障设备
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {mockTopFaultDevices.map((device, i) => (
                  <div
                    key={device.equipmentNo}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-red-600 text-xs font-bold">
                        {i + 1}
                      </span>
                      <div>
                        <p className="text-sm font-medium">{device.equipmentName}</p>
                        <p className="text-xs text-muted-foreground">{device.equipmentNo}</p>
                      </div>
                    </div>
                    <Badge variant="destructive">{device.faultCount} 次</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Inefficient Devices */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium text-amber-600">
                <ArrowDown className="inline mr-2 h-4 w-4" />
                TOP5 低效设备
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {mockTopInefficientDevices.map((device, i) => (
                  <div
                    key={device.equipmentNo}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-amber-600 text-xs font-bold">
                        {i + 1}
                      </span>
                      <div>
                        <p className="text-sm font-medium">{device.equipmentName}</p>
                        <p className="text-xs text-muted-foreground">{device.equipmentNo}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-amber-600 border-amber-600">
                      {device.oee}%
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Maintenance Execution Rate */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium text-blue-600">
                <Wrench className="inline mr-2 h-4 w-4" />
                维护计划执行率
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-4">
                <div className="relative h-32 w-32">
                  <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="hsl(var(--muted))"
                      strokeWidth="10"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="hsl(var(--primary))"
                      strokeWidth="10"
                      strokeDasharray={`${mockMaintenanceExecution.rate * 2.51} 251`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold">{mockMaintenanceExecution.rate}%</span>
                  </div>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  本月已完成 {mockMaintenanceExecution.completed} / {mockMaintenanceExecution.total} 计划
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts Timeline + Charts */}
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Real-time Alerts */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">实时预警</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {mockAlerts.map((alert) => {
                  const Icon = getAlertIcon(alert.type);
                  return (
                    <div key={alert.id} className="flex gap-3">
                      <div className="relative flex flex-col items-center">
                        <div className={`h-2 w-2 rounded-full mt-1.5 ${getAlertColor(alert.level)} ${alert.level === "high" ? "animate-pulse" : ""}`} />
                        {alert.id < mockAlerts.length && (
                          <div className="w-px flex-1 bg-border mt-1" />
                        )}
                      </div>
                      <div className="pb-2">
                        <div className="flex items-start gap-2">
                          <Icon className="h-3.5 w-3.5 mt-0.5 text-muted-foreground" />
                          <p className="text-sm leading-snug">{alert.message}</p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 ml-5">{alert.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* OEE Trend Chart */}
          <Card className="lg:col-span-2 hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">OEE 趋势（近 24 小时）</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={oeeChartConfig} className="h-[280px] w-full">
                <LineChart data={mockOEETrend}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="time" className="text-xs" tick={{ fill: "var(--color-muted-foreground)" }} />
                  <YAxis className="text-xs" tick={{ fill: "var(--color-muted-foreground)" }} domain={[0, 100]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="oee"
                    stroke="hsl(var(--chart-1))"
                    strokeWidth={2}
                    dot={{ r: 3, fill: "hsl(var(--chart-1))" }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Trend Charts */}
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Fault Rate Trend */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">故障率趋势（近 7 天）</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={faultRateChartConfig} className="h-[200px] w-full">
                <BarChart data={mockFaultRateTrend}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs" tick={{ fill: "var(--color-muted-foreground)" }} />
                  <YAxis className="text-xs" tick={{ fill: "var(--color-muted-foreground)" }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="rate" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Maintenance Cost Trend */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">维护成本趋势（近 6 个月）</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={faultRateChartConfig} className="h-[200px] w-full">
                <BarChart data={mockMaintenanceCostTrend}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" tick={{ fill: "var(--color-muted-foreground)" }} />
                  <YAxis className="text-xs" tick={{ fill: "var(--color-muted-foreground)" }} />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    formatter={(value) => [`${value} 万元`, "成本"]}
                  />
                  <Bar dataKey="cost" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
