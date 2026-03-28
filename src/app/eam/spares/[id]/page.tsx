"use client";

import { ChevronLeft, Edit, History, Package } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { spares } from "@/mock/spares";
import { getDictLabel } from "@/lib/dict";

export default function SpareDetailPage() {
  const { id } = useParams();
  const spare = spares.find(s => s.id === id);

  if (!spare) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-6 py-6">
          <Button variant="ghost" asChild>
            <Link href="/eam/spares">
              <ChevronLeft className="h-4 w-4" />
              返回列表
            </Link>
          </Button>
          <div className="mt-8 text-center">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">备件不存在</p>
          </div>
        </div>
      </div>
    );
  }

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
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/eam/spares">
                <ChevronLeft className="h-4 w-4" />
                返回
              </Link>
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold tracking-tight">{spare.spareName}</h1>
                <Badge variant={stockStatusVariant(spare.stockStatus)}>
                  {getDictLabel("stock-status", spare.stockStatus)}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">{spare.spareNo}</p>
            </div>
          </div>
          <Button variant="outline">
            <Edit className="mr-1.5 h-4 w-4" />
            编辑
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">概览</TabsTrigger>
            <TabsTrigger value="history">出入库记录</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Basic Info */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>基本信息</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground">备件编号</p>
                    <p className="font-mono font-medium mt-1">{spare.spareNo}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">备件名称</p>
                    <p className="font-medium mt-1">{spare.spareName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">备件分类</p>
                    <div className="mt-1">
                      <Badge variant="outline" className={categoryVariant(spare.categoryId)}>
                        {spare.categoryName}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">规格型号</p>
                    <p className="mt-1">{spare.specification}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stock Info */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>库存信息</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground">当前库存</p>
                    <p className={`text-2xl font-bold mt-1 ${spare.currentStock <= spare.safetyStock ? "text-red-600" : ""}`}>
                      {spare.currentStock}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">安全库存</p>
                    <p className="text-2xl font-bold mt-1">{spare.safetyStock}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">库存状态</p>
                    <div className="mt-1">
                      <Badge variant={stockStatusVariant(spare.stockStatus)}>
                        {getDictLabel("stock-status", spare.stockStatus)}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">存放位置</p>
                    <p className="font-medium mt-1">{spare.location || "-"}</p>
                  </div>
                </div>

                {spare.currentStock <= spare.safetyStock && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-700">
                      当前库存低于安全库存 {spare.safetyStock - spare.currentStock} 件，建议及时补货。
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Purchase Info */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>采购信息</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground">单价</p>
                    <p className="font-medium mt-1">{formatMoney(spare.unitPrice)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">供应商</p>
                    <p className="mt-1">{spare.supplier || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">最后入库日期</p>
                    <p className="mt-1">{spare.lastInDate || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">计量单位</p>
                    <p className="mt-1">{getDictLabel("unit", spare.unit)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* System Info */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>系统信息</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground">创建时间</p>
                    <p className="mt-1 text-sm">{spare.createdAt}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">更新时间</p>
                    <p className="mt-1 text-sm">{spare.updatedAt}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>出入库记录</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="py-12 text-center">
                  <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">暂无出入库记录</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
