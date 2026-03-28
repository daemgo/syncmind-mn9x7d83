"use client";

/**
 * 设备绩效分析
 * 分析设备运行效率、OEE 指标和故障情况
 */

import { Activity, ArrowDown, ArrowUp, TrendingUp, Wrench } from "lucide-react";
import { useState } from "react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

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
  avgOEE: 82.5,
  avgFaultRate: 3.2,
  avgDowntime: 4.8,
};

const mockOEETrend = [
  { hour: "00:00", oee: 75.2 },
  { hour: "02:00", oee: 78.5 },
  { hour: "04:00", oee: 82.1 },
  { hour: "06:00", oee: 85.3 },
  { hour: "08:00", oee: 83.7 },
  { hour: "10:00", oee: 86.2 },
  { hour: "12:00", oee: 84.8 },
  { hour: "14:00", oee: 87.5 },
  { hour: "16:00", oee: 85.9 },
  { hour: "18:00", oee: 83.2 },
  { hour: "20:00", oee: 80.6 },
  { hour: "22:00", oee: 78.1 },
];

const mockOEETop5 = [
  { equipmentNo: "EQ2603012", equipmentName: "加工中心 Z-003", oee: 92.5 },
  { equipmentNo: "EQ2603005", equipmentName: "数控铣床 X-008", oee: 90.8 },
  { equipmentNo: "EQ2603021", equipmentName: "车床 C-015", oee: 89.3 },
  { equipmentNo: "EQ2603030", equipmentName: "磨床 M-009", oee: 88.7 },
  { equipmentNo: "EQ2603018", equipmentName: "铣床 X-014", oee: 87.6 },
];

const mockOEEBottom5 = [
  { equipmentNo: "EQ2603008", equipmentName: "车床 C-009", oee: 62.3 },
  { equipmentNo: "EQ2603019", equipmentName: "铣床 X-012", oee: 68.5 },
  { equipmentNo: "EQ2603025", equipmentName: "磨床 M-007", oee: 71.2 },
  { equipmentNo: "EQ2603036", equipmentName: "加工中心 Z-008", oee: 73.8 },
  { equipmentNo: "EQ2603044", equipmentName: "数控铣床 X-021", oee: 75.4 },
];

const mockTopFaultDevices = [
  { equipmentNo: "EQ2603001", equipmentName: "数控铣床 X-001", faultCount: 8 },
  { equipmentNo: "EQ2603015", equipmentName: "车床 C-023", faultCount: 6 },
  { equipmentNo: "EQ2603028", equipmentName: "磨床 M-011", faultCount: 5 },
  { equipmentNo: "EQ2603033", equipmentName: "加工中心 Z-005", faultCount: 4 },
  { equipmentNo: "EQ2603041", equipmentName: "铣床 X-018", faultCount: 3 },
];

const mockEquipmentOptions = [
  { value: "all", label: "全部设备" },
  { value: "EQ2603001", label: "数控铣床 X-001" },
  { value: "EQ2603005", label: "数控铣床 X-008" },
  { value: "EQ2603012", label: "加工中心 Z-003" },
];

const mockWorkshopOptions = [
  { value: "all", label: "全部车间" },
  { value: "WS001", label: "一车间" },
  { value: "WS002", label: "二车间" },
  { value: "WS003", label: "三车间" },
];

// ─── Chart Config ───────────────────────────────────────────

const oeeChartConfig: ChartConfig = {
  oee: { label: "OEE", color: "hsl(var(--chart-1))" },
};

// ─── Component ──────────────────────────────────────────────

export default function PerformanceAnalyticsPage() {
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to?: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  const [selectedEquipment, setSelectedEquipment] = useState("all");
  const [selectedWorkshop, setSelectedWorkshop] = useState("all");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-semibold tracking-tight">设备绩效分析</h1>
          <p className="text-sm text-muted-foreground">设备运行效率与 OEE 指标分析</p>
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

              <Select value={selectedEquipment} onValueChange={setSelectedEquipment}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="选择设备" />
                </SelectTrigger>
                <SelectContent>
                  {mockEquipmentOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

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
                setSelectedEquipment("all");
                setSelectedWorkshop("all");
              }}>
                重置
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">平均 OEE</p>
                <div className="bg-violet-50 text-violet-600 rounded-lg p-2">
                  <TrendingUp className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-2 text-2xl font-bold">{mockStats.avgOEE}%</p>
              <div className="mt-1 flex items-center gap-1 text-xs">
                <ArrowUp className="h-3 w-3 text-emerald-600" />
                <span className="text-emerald-600">+2.3%</span>
                <span className="text-muted-foreground">较上周</span>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">平均故障率</p>
                <div className="bg-red-50 text-red-600 rounded-lg p-2">
                  <Activity className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-2 text-2xl font-bold">{mockStats.avgFaultRate}%</p>
              <div className="mt-1 flex items-center gap-1 text-xs">
                <ArrowDown className="h-3 w-3 text-emerald-600" />
                <span className="text-emerald-600">-0.8%</span>
                <span className="text-muted-foreground">较上周</span>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">平均停机时间</p>
                <div className="bg-amber-50 text-amber-600 rounded-lg p-2">
                  <Wrench className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-2 text-2xl font-bold">{mockStats.avgDowntime} 小时</p>
              <div className="mt-1 flex items-center gap-1 text-xs">
                <ArrowDown className="h-3 w-3 text-emerald-600" />
                <span className="text-emerald-600">-1.2h</span>
                <span className="text-muted-foreground">较上周</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* OEE Trend Chart */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">OEE 趋势（小时级）</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={oeeChartConfig} className="h-[280px] w-full">
              <LineChart data={mockOEETrend}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="hour" className="text-xs" tick={{ fill: "var(--color-muted-foreground)" }} />
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

        {/* Top Lists */}
        <div className="grid gap-4 lg:grid-cols-3">
          {/* OEE TOP5 */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium text-emerald-600">
                <TrendingUp className="inline mr-2 h-4 w-4" />
                OEE TOP5
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {mockOEETop5.map((device, i) => (
                  <div
                    key={device.equipmentNo}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 text-xs font-bold">
                        {i + 1}
                      </span>
                      <div>
                        <p className="text-sm font-medium">{device.equipmentName}</p>
                        <p className="text-xs text-muted-foreground">{device.equipmentNo}</p>
                      </div>
                    </div>
                    <Badge variant="default" className="bg-emerald-600">{device.oee}%</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* OEE BOTTOM5 */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium text-amber-600">
                <ArrowDown className="inline mr-2 h-4 w-4" />
                OEE BOTTOM5
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {mockOEEBottom5.map((device, i) => (
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

          {/* Fault Count TOP5 */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium text-red-600">
                <Activity className="inline mr-2 h-4 w-4" />
                故障次数 TOP5
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
        </div>
      </div>
    </div>
  );
}
