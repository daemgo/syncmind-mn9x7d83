"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Equipment, EquipmentStatus } from "@/types/equipment";
import { equipmentStatusOptions } from "@/mock/equipment";
import Link from "next/link";

interface EquipmentTableProps {
  data: Equipment[];
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
}

function getStatusVariant(status: EquipmentStatus): "default" | "outline" | "destructive" {
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

export function EquipmentTable({ data, onView, onEdit }: EquipmentTableProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">
          设备列表
          <span className="ml-2 text-sm font-normal text-muted-foreground">共 {data.length} 条</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>设备编号</TableHead>
              <TableHead>设备名称</TableHead>
              <TableHead>设备分类</TableHead>
              <TableHead>车间</TableHead>
              <TableHead>运行状态</TableHead>
              <TableHead className="text-right">OEE</TableHead>
              <TableHead>下次维护</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id} className="cursor-pointer hover:bg-muted/50">
                <TableCell className="font-mono text-sm font-medium">
                  <Link href={`/equipment/${item.id}`} className="hover:underline">
                    {item.equipmentNo}
                  </Link>
                </TableCell>
                <TableCell>{item.equipmentName}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={getCategoryColor(item.categoryName)}>
                    {item.categoryName}
                  </Badge>
                </TableCell>
                <TableCell>{item.workshopName}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(item.status)}>
                    {equipmentStatusOptions.find((opt) => opt.value === item.status)?.label}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-medium">{item.oee}%</TableCell>
                <TableCell>{item.nextMaintenanceDate}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onView?.(item.id)}>查看</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit?.(item.id)}>编辑</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
