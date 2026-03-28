"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Equipment } from "@/types/equipment";
import { equipmentStatusOptions } from "@/mock/equipment";
import { ArrowLeft, Calendar, MapPin, Settings, DollarSign, Activity, Wrench } from "lucide-react";
import Link from "next/link";

interface EquipmentDetailProps {
  data: Equipment;
}

function getStatusVariant(status: string): "default" | "outline" | "destructive" {
  const option = equipmentStatusOptions.find((opt) => opt.value === status);
  const color = option?.color;

  if (color === "green") return "default";
  if (color === "red") return "destructive";
  return "outline";
}

function getCategoryColor(categoryName: string): string {
  const colors: Record<string, string> = {
    "数控机床": "bg-blue-50 text-blue-700 border-blue-200",
    "铣床": "bg-violet-50 text-violet-700 border-violet-200",
    "车床": "bg-emerald-50 text-emerald-700 border-emerald-200",
    "磨床": "bg-amber-50 text-amber-700 border-amber-200",
    "其他": "bg-gray-50 text-gray-700 border-gray-200",
  };
  return colors[categoryName] || colors["其他"];
}

export function EquipmentDetail({ data }: EquipmentDetailProps) {
  const statusOption = equipmentStatusOptions.find((opt) => opt.value === data.status);

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link href="/equipment">
        <Button variant="ghost" size="sm" className="gap-1">
          <ArrowLeft className="h-4 w-4" />
          返回列表
        </Button>
      </Link>

      {/* Header Card */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <CardTitle className="text-xl">{data.equipmentName}</CardTitle>
                <Badge variant="outline" className={getCategoryColor(data.categoryName)}>
                  {data.categoryName}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground font-mono">{data.equipmentNo}</p>
            </div>
            <Badge variant={getStatusVariant(data.status)} className="text-sm px-3 py-1">
              {statusOption?.label}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Info Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Basic Info */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Settings className="h-4 w-4 text-muted-foreground" />
              基本信息
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <InfoRow label="设备型号" value={data.model} />
            <InfoRow label="制造商" value={data.manufacturer} />
            <InfoRow label="所属车间" value={data.workshopName} />
            <InfoRow label="设备位置" value={data.location} icon={<MapPin className="h-3 w-3" />} />
          </CardContent>
        </Card>

        {/* Financial Info */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              财务信息
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <InfoRow
              label="采购价格"
              value={`¥${data.purchasePrice.toLocaleString()}`}
            />
            <InfoRow
              label="投产日期"
              value={data.commissionDate}
              icon={<Calendar className="h-3 w-3" />}
            />
          </CardContent>
        </Card>

        {/* Operational Status */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="h-4 w-4 text-muted-foreground" />
              运行状态
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">运行状态</span>
              <Badge variant={getStatusVariant(data.status)}>
                {statusOption?.label}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">OEE</span>
              <span className="font-medium">{data.oee}%</span>
            </div>
          </CardContent>
        </Card>

        {/* Maintenance Info */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Wrench className="h-4 w-4 text-muted-foreground" />
              维护信息
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <InfoRow
              label="下次维护日期"
              value={data.nextMaintenanceDate}
              icon={<Calendar className="h-3 w-3" />}
            />
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              编辑设备
            </Button>
            <Button variant="outline" size="sm">
              维护记录
            </Button>
            <Button variant="outline" size="sm">
              运行日志
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function InfoRow({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-muted-foreground flex items-center gap-1">
        {icon}
        {label}
      </span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}
