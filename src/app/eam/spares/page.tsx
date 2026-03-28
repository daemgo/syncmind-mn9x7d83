"use client";

import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Plus,
  Search,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { spares } from "@/mock/spares";
import { getDictLabel, getDictOptions } from "@/lib/dict";

export default function SparesListPage() {
  const statusTabs = ["全部", "正常", "预警", "缺货"];

  function stockStatusVariant(status: string) {
    switch (status) {
      case "normal": return "default" as const;
      case "warning": return "secondary" as const;
      case "outofstock": return "destructive" as const;
      default: return "outline" as const;
    }
  }

  function categoryVariant(category: string) {
    switch (category) {
      case "electrical": return "border-blue-200 bg-blue-50 text-blue-700";
      case "mechanical": return "border-green-200 bg-green-50 text-green-700";
      case "hydraulic": return "border-purple-200 bg-purple-50 text-purple-700";
      case "cutting": return "border-amber-200 bg-amber-50 text-amber-700";
      default: return "border-gray-200 bg-gray-50 text-gray-700";
    }
  }

  function formatMoney(amount: number) {
    return `¥${amount.toLocaleString("zh-CN", { minimumFractionDigits: 2 })}`;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">备件管理</h1>
            <p className="text-sm text-muted-foreground">管理备件库存和安全库存预警</p>
          </div>
          <Button asChild>
            <Link href="/eam/spares/create">
              <Plus className="mr-1.5 h-4 w-4" />
              新增备件
            </Link>
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6 space-y-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-2">
          {statusTabs.map((tab) => (
            <Button
              key={tab}
              variant={tab === "全部" ? "default" : "outline"}
              size="sm"
              className="text-sm"
            >
              {tab}
            </Button>
          ))}
        </div>

        {/* Filters */}
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[200px] max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="搜索备件编号、名称..." className="pl-9" />
              </div>
              <Select>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="备件分类" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部分类</SelectItem>
                  {getDictOptions("spare-category").map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="库存状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  {getDictOptions("stock-status").map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                重置
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Data Table */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-medium">
              备件列表
              <span className="ml-2 text-sm font-normal text-muted-foreground">共 {spares.length} 条</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[140px]">备件编号</TableHead>
                  <TableHead>备件名称</TableHead>
                  <TableHead>备件分类</TableHead>
                  <TableHead>规格</TableHead>
                  <TableHead className="text-right">当前库存</TableHead>
                  <TableHead className="text-right">安全库存</TableHead>
                  <TableHead>库存状态</TableHead>
                  <TableHead className="text-right">单价</TableHead>
                  <TableHead className="w-[50px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {spares.map((spare) => (
                  <TableRow key={spare.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell className="font-mono text-sm font-medium">
                      <Link href={`/eam/spares/${spare.id}`} className="hover:text-primary">
                        {spare.spareNo}
                      </Link>
                    </TableCell>
                    <TableCell className="max-w-[180px] truncate">{spare.spareName}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={categoryVariant(spare.categoryId)}>
                        {spare.categoryName}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">{spare.specification}</TableCell>
                    <TableCell className="text-right font-medium">{spare.currentStock}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{spare.safetyStock}</TableCell>
                    <TableCell>
                      <Badge variant={stockStatusVariant(spare.stockStatus)}>
                        {getDictLabel("stock-status", spare.stockStatus)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">{formatMoney(spare.unitPrice)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>查看详情</DropdownMenuItem>
                          <DropdownMenuItem>编辑</DropdownMenuItem>
                          <DropdownMenuItem>入库记录</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">删除</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">显示 1-{spares.length} 条，共 {spares.length} 条</p>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="sm" disabled>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">1</Button>
                <Button variant="outline" size="sm">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
