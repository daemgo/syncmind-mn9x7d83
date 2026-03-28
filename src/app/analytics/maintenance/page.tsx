"use client";

/**
 * 维护分析
 * 分析维护成本、计划执行率和响应时间
 */

import { AlertTriangle, ArrowDown, ArrowUp, Clock, DollarSign, TrendingUp, Wrench } from "lucide-react";
import { useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, XAxis, YAxis } from "recharts";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// ─── Mock Data ──────────────────────────────────────────────

const mockStats = {
  totalCost: 156800,
  planExecuteRate: 87.5,
  avgResponseTime: 2.3,
  avgRepairTime: 4.5,
};

const mockMaintenanceCostTrend = [
  { month: "10月", cost: 12.5 },
  { month: "11月", cost: 15.8 },
  { month: "12月", cost: 18.2 },
  { month: "1月", cost: 14.6 },
  { month: "2月", cost: 16.3 },
  { month: "3月", cost: 19.8 },
];

const mockPlanExecutionData = [
  { name: "已完成", value: 87.5, fill: "hsl(var(--chart-1))" },
  { name: "进行中", value: 8.3, fill: "hsl(var(--chart-2))" },
  { name: "未执行", value: 4.2, fill: "hsl(var(--chart-3))" },
];

const mockWorkshopOptions = [
  { value: "all", label: "全部车间" },
  { value: "WS001", label: "一车间" },
  { value: "WS002", label: "二车间" },
  { value: "WS003", label: "三车间" },
];

const mockWorkshopCostComparison = [
  { workshop: "一车间", cost: 58200, count: 42 },
  { workshop: "二车间", cost: 52300, count: 38 },
  { workshop: "三车间", cost: 46300, count: 33 },
];

// ─── Chart Config ───────────────────────────────────────────

const costChartConfig: ChartConfig = {
  cost: { label: "成本", color: "hsl(var(--chart-1))" },
};

const executionChartConfig: ChartConfig = {
  completed: { label: "已完成", color: "hsl(var(--chart-1))" },
  inProgress: { label: "进行中", color: "hsl(var(--chart-2))" },
  pending: { label: "未执行", color: "hsl(var(--chart-3))" },
};

// ─── Helpers ────────────────────────────────────────────────

function formatMoney(value: number): string {
  return `¥${value.toLocaleString("zh-CN")}`;
}

// ─── Component ──────────────────────────────────────────────

export default function MaintenanceAnalyticsPage() {
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to?: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  const [selectedWorkshop, setSelectedWorkshop] = useState("all");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-semibold tracking-tight">维护分析</h1>
          <p className="text-sm text-muted-foreground">维护成本与效率分析</p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6 space-y-6">
        {/* Filter Bar */}
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[280px] justify-start text-left font-normal">
                    {dateRange.from ? (
                      dateRange.to ? (
                        <>
                          {dateRange.from.toLocaleDateString("zh-CN")} - {dateRange.to.toLocaleDateString("zh-CN")}
                        </>
                      ) : (
                        dateRange.from.toLocaleDateString("zh-CN")
                      )
                    ) : (
                      <span>选择时间范围</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    selected={dateRange}
                    onSelect={(range) => setDateRange(range ?? { from: undefined, to: undefined })}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>

              <Select value={selectedWorkshop} onValueChange={setSelectedWorkshop}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="选择车间" />
                </SelectTrigger>
                <SelectContent>
                  {mockWorkshopOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={() => {
                setDateRange({ from: undefined, to: undefined });
                setSelectedWorkshop("all");
              }}>
                重置
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">总维护成本</p>
                <div className="bg-emerald-50 text-emerald-600 rounded-lg p-2">
                  <DollarSign className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-2 text-2xl font-bold">{formatMoney(mockStats.totalCost)}</p>
              <div className="mt-1 flex items-center gap-1 text-xs">
                <ArrowUp className="h-3 w-3 text-red-500" />
                <span className="text-red-500">+8.2%</span>
                <span className="text-muted-foreground">较上月</span>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">计划执行率</p>
                <div className="bg-blue-50 text-blue-600 rounded-lg p-2">
                  <TrendingUp className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-2 text-2xl font-bold">{mockStats.planExecuteRate}%</p>
              <div className="mt-1 flex items-center gap-1 text-xs">
                <ArrowUp className="h-3 w-3 text-emerald-600" />
                <span className="text-emerald-600">+3.5%</span>
                <span className="text-muted-foreground">较上月</span>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">平均响应时间</p>
                <div className="bg-violet-50 text-violet-600 rounded-lg p-2">
                  <Clock className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-2 text-2xl font-bold">{mockStats.avgResponseTime} 小时</p>
              <div className="mt-1 flex items-center gap-1 text-xs">
                <ArrowDown className="h-3 w-3 text-emerald-600" />
                <span className="text-emerald-600">-0.5h</span>
                <span className="text-muted-foreground">较上月</span>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">平均修复时间</p>
                <div className="bg-amber-50 text-amber-600 rounded-lg p-2">
                  <Wrench className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-2 text-2xl font-bold">{mockStats.avgRepairTime} 小时</p>
              <div className="mt-1 flex items-center gap-1 text-xs">
                <ArrowDown className="h-3 w-3 text-emerald-600" />
                <span className="text-emerald-600">-0.8h</span>
                <span className="text-muted-foreground">较上月</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Maintenance Cost Trend */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">维护成本趋势（月度）</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={costChartConfig} className="h-[280px] w-full">
                <BarChart data={mockMaintenanceCostTrend}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" tick={{ fill: "var(--color-muted-foreground)" }} />
                  <YAxis className="text-xs" tick={{ fill: "var(--color-muted-foreground)" }} />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    formatter={(value) => [`${value} 万元`, "成本"]}
                  />
                  <Bar dataKey="cost" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Plan Execution Rate */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">计划执行率</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={executionChartConfig} className="h-[220px] w-full">
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Pie
                    data={mockPlanExecutionData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    strokeWidth={2}
                    stroke="var(--color-background)"
                  >
                    {mockPlanExecutionData.map((entry) => (
                      <Cell key={entry.name} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {mockPlanExecutionData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2 text-xs">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.fill }} />
                    <span className="text-muted-foreground">{item.name}</span>
                    <span className="ml-auto font-medium">{item.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Workshop Cost Comparison */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">车间维护成本对比</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockWorkshopCostComparison.map((item) => (
                <div key={item.workshop} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-semibold">
                      {item.workshop.replace("车间", "")}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{item.workshop}</p>
                      <p className="text-xs text-muted-foreground">工单数: {item.count}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">{formatMoney(item.cost)}</p>
                    <p className="text-xs text-muted-foreground">
                      均价: ¥{Math.round(item.cost / item.count).toLocaleString("zh-CN")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alerts */}
        <Card className="hover:shadow-md transition-shadow border-amber-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium text-amber-600">
              <AlertTriangle className="inline mr-2 h-4 w-4" />
              需关注事项
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 border border-amber-200">
                <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-900">二车间维护成本持续上升</p>
                  <p className="text-xs text-amber-700 mt-1">本月较上月增长 12.3%，建议优化维护计划</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
                <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">夜间响应时间偏长</p>
                  <p className="text-xs text-blue-700 mt-1">平均响应时间 4.2 小时，建议调整值班安排</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
