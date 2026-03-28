"use client";

import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Package,
  ShoppingCart,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { spareAlerts } from "@/mock/spares";
import { getDictLabel } from "@/lib/dict";

export default function SparesAlertsPage() {
  function alertLevelVariant(level: string) {
    switch (level) {
      case "critical": return "destructive" as const;
      case "warning": return "secondary" as const;
      default: return "outline" as const;
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/eam/spares">
                <ChevronLeft className="h-4 w-4" />
                返回
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">库存预警</h1>
              <p className="text-sm text-muted-foreground">当前库存低于或等于安全库存的备件</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6 space-y-4">
        {/* Alert Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">预警总数</p>
                <div className="bg-amber-50 text-amber-600 rounded-lg p-2">
                  <Package className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-2 text-2xl font-bold">{spareAlerts.length}</p>
              <p className="text-xs text-muted-foreground mt-1">需要关注</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">严重缺货</p>
                <div className="bg-red-50 text-red-600 rounded-lg p-2">
                  <Package className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-2 text-2xl font-bold">
                {spareAlerts.filter(a => a.alertLevel === "critical").length}
              </p>
              <p className="text-xs text-muted-foreground mt-1">库存为零</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">建议采购</p>
                <div className="bg-blue-50 text-blue-600 rounded-lg p-2">
                  <ShoppingCart className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-2 text-2xl font-bold">
                {spareAlerts.reduce((sum, a) => sum + a.suggestedPurchaseQty, 0)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">件数</p>
            </CardContent>
          </Card>
        </div>

        {/* Alert Table */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-medium">
              预警列表
              <span className="ml-2 text-sm font-normal text-muted-foreground">共 {spareAlerts.length} 条</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>备件名称</TableHead>
                  <TableHead className="w-[120px]">备件编号</TableHead>
                  <TableHead className="text-right">当前库存</TableHead>
                  <TableHead className="text-right">安全库存</TableHead>
                  <TableHead className="text-right">缺口数量</TableHead>
                  <TableHead>预警级别</TableHead>
                  <TableHead className="text-right">建议采购量</TableHead>
                  <TableHead className="w-[50px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {spareAlerts.map((alert) => (
                  <TableRow key={alert.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell className="font-medium">
                      <Link href={`/eam/spares/${alert.spareId}`} className="hover:text-primary">
                        {alert.spareName}
                      </Link>
                    </TableCell>
                    <TableCell className="font-mono text-sm text-muted-foreground">{alert.spareNo}</TableCell>
                    <TableCell className="text-right font-medium">{alert.currentStock}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{alert.safetyStock}</TableCell>
                    <TableCell className="text-right">
                      <span className="text-red-600 font-medium">-{alert.gap}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={alertLevelVariant(alert.alertLevel)}>
                        {alert.alertLevel === "critical" ? "严重缺货" : "库存预警"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium text-blue-600">
                      {alert.suggestedPurchaseQty}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>查看详情</DropdownMenuItem>
                          <DropdownMenuItem>
                            <ShoppingCart className="mr-2 h-3.5 w-3.5" />
                            生成采购单
                          </DropdownMenuItem>
                          <DropdownMenuItem>调整安全库存</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Empty State */}
            {spareAlerts.length === 0 && (
              <div className="py-12 text-center">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">暂无库存预警</p>
              </div>
            )}

            {/* Pagination */}
            {spareAlerts.length > 0 && (
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  显示 1-{spareAlerts.length} 条，共 {spareAlerts.length} 条
                </p>
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="sm" disabled>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">
                    1
                  </Button>
                  <Button variant="outline" size="sm">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
