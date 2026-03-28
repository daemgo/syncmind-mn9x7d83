"use client";

import { ChevronLeft, Save } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { getDictOptions } from "@/lib/dict";

export default function SpareCreatePage() {
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
              <h1 className="text-2xl font-semibold tracking-tight">新增备件</h1>
              <p className="text-sm text-muted-foreground">录入新备件信息</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">取消</Button>
            <Button>
              <Save className="mr-1.5 h-4 w-4" />
              保存
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        <Card className="hover:shadow-md transition-shadow max-w-3xl">
          <CardHeader>
            <CardTitle>基本信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Row 1 */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="spareNo">备件编号 <span className="text-destructive">*</span></Label>
                <Input id="spareNo" placeholder="SP26030031" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="spareName">备件名称 <span className="text-destructive">*</span></Label>
                <Input id="spareName" placeholder="请输入备件名称" />
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="category">备件分类 <span className="text-destructive">*</span></Label>
                <Select>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="请选择分类" />
                  </SelectTrigger>
                  <SelectContent>
                    {getDictOptions("spare-category").map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="specification">规格型号</Label>
                <Input id="specification" placeholder="如：SKD11/50×50×20" />
              </div>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="currentStock">当前库存 <span className="text-destructive">*</span></Label>
                <Input id="currentStock" type="number" placeholder="0" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="safetyStock">安全库存 <span className="text-destructive">*</span></Label>
                <Input id="safetyStock" type="number" placeholder="10" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit">计量单位</Label>
                <Select>
                  <SelectTrigger id="unit">
                    <SelectValue placeholder="请选择" />
                  </SelectTrigger>
                  <SelectContent>
                    {getDictOptions("unit").map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Row 4 */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="unitPrice">单价（元）</Label>
                <Input id="unitPrice" type="number" placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supplier">供应商</Label>
                <Input id="supplier" placeholder="请输入供应商名称" />
              </div>
            </div>

            {/* Row 5 */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="location">存放位置</Label>
                <Input id="location" placeholder="如：A-01-01" />
              </div>
            </div>

            {/* Row 6 */}
            <div className="space-y-2">
              <Label htmlFor="remark">备注</Label>
              <Textarea id="remark" placeholder="请输入备注信息" rows={3} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
