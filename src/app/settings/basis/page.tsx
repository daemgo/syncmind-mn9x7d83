"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus, Search, MoreHorizontal, Pencil, Trash2 } from "lucide-react";

// Mock data types
interface BaseDataItem {
  id: string;
  code: string;
  name: string;
  description?: string;
  status: "active" | "inactive";
}

// Mock data generators
const generateEquipmentCategories = (): BaseDataItem[] => [
  { id: "1", code: "CNC", name: "数控机床", description: "高精度数控加工设备", status: "active" },
  { id: "2", code: "MILL", name: "铣床", description: "铣削加工设备", status: "active" },
  { id: "3", code: "LATHE", name: "车床", description: "车削加工设备", status: "active" },
  { id: "4", code: "GRIND", name: "磨床", description: "精密磨削设备", status: "active" },
  { id: "5", code: "OTHER", name: "其他", description: "其他类型设备", status: "active" },
];

const generateWorkshops = (): BaseDataItem[] => [
  { id: "1", code: "WS01", name: "一车间", description: "主生产车间", status: "active" },
  { id: "2", code: "WS02", name: "二车间", description: "精加工车间", status: "active" },
  { id: "3", code: "WS03", name: "三车间", description: "装配车间", status: "active" },
];

const generateFaultTypes = (): BaseDataItem[] => [
  { id: "1", code: "FT001", name: "电气故障", description: "电气系统相关故障", status: "active" },
  { id: "2", code: "FT002", name: "机械故障", description: "机械部件相关故障", status: "active" },
  { id: "3", code: "FT003", name: "液压故障", description: "液压系统相关故障", status: "active" },
  { id: "4", code: "FT004", name: "控制系统故障", description: "PLC/控制系统故障", status: "active" },
];

const generateSpareCategories = (): BaseDataItem[] => [
  { id: "1", code: "SC001", name: "电气配件", description: "开关、传感器、继电器等", status: "active" },
  { id: "2", code: "SC002", name: "机械配件", description: "轴承、齿轮、皮带等", status: "active" },
  { id: "3", code: "SC003", name: "液压配件", description: "泵、阀、密封件等", status: "active" },
  { id: "4", code: "SC004", name: "控制元件", description: "PLC模块、触摸屏等", status: "active" },
];

// Tab data configuration
const tabDataMap = {
  "equipment-category": { title: "设备分类", data: generateEquipmentCategories(), columns: ["分类编号", "分类名称", "描述", "状态"] },
  "workshop": { title: "车间列表", data: generateWorkshops(), columns: ["车间编号", "车间名称", "描述", "状态"] },
  "fault-type": { title: "故障类型", data: generateFaultTypes(), columns: ["类型编号", "类型名称", "描述", "状态"] },
  "spare-category": { title: "备件分类", data: generateSpareCategories(), columns: ["分类编号", "分类名称", "描述", "状态"] },
};

type TabKey = keyof typeof tabDataMap;

function getStatusVariant(status: string): "default" | "outline" | "destructive" {
  return status === "active" ? "default" : "outline";
}

function getStatusLabel(status: string): string {
  return status === "active" ? "启用" : "停用";
}

export default function BasisSettingsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("equipment-category");
  const [searchQuery, setSearchQuery] = useState("");

  const currentTab = tabDataMap[activeTab];
  const filteredData = currentTab.data.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = () => {
    // TODO: Open add dialog
    console.log("Add new item");
  };

  const handleEdit = (id: string) => {
    // TODO: Open edit dialog
    console.log("Edit item:", id);
  };

  const handleDelete = (id: string) => {
    // TODO: Open delete confirmation
    console.log("Delete item:", id);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-semibold tracking-tight">基础数据管理</h1>
          <p className="text-sm text-muted-foreground">管理系统基础分类数据和字典信息</p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6 space-y-6">
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabKey)}>
          <TabsList>
            <TabsTrigger value="equipment-category">设备分类</TabsTrigger>
            <TabsTrigger value="workshop">车间列表</TabsTrigger>
            <TabsTrigger value="fault-type">故障类型</TabsTrigger>
            <TabsTrigger value="spare-category">备件分类</TabsTrigger>
          </TabsList>

          {/* Tab Content */}
          <TabsContent value={activeTab} className="space-y-4 mt-4">
            {/* Search Bar */}
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder={`搜索${currentTab.title}...`}
                      className="pl-9"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleAdd}>
                    <Plus className="mr-1.5 h-4 w-4" />
                    新增{currentTab.title.replace("列表", "").replace("设备", "")}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Data Table */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">
                  {currentTab.title}
                  <span className="ml-2 text-sm font-normal text-muted-foreground">共 {filteredData.length} 条</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{currentTab.columns[0]}</TableHead>
                      <TableHead>{currentTab.columns[1]}</TableHead>
                      <TableHead>{currentTab.columns[2]}</TableHead>
                      <TableHead>{currentTab.columns[3]}</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((item) => (
                      <TableRow key={item.id} className="cursor-pointer hover:bg-muted/50">
                        <TableCell className="font-mono text-sm font-medium">{item.code}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell className="max-w-[300px] truncate text-muted-foreground">
                          {item.description || "-"}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(item.status)}>
                            {getStatusLabel(item.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEdit(item.id)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                编辑
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDelete(item.id)} className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                删除
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredData.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                          暂无数据
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
