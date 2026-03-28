"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Plug, Server, Clock, User, Lock } from "lucide-react";

// Protocol dictionary
const PROTOCOL_DICT = {
  opcua: { label: "OPC UA", value: "opcua" },
  modbus: { label: "Modbus TCP", value: "modbus" },
} as const;

type ProtocolType = keyof typeof PROTOCOL_DICT;

interface IntegrationFormData {
  protocol: ProtocolType;
  serverHost: string;
  serverPort: number;
  username: string;
  password: string;
  collectInterval: number;
}

// Initial form data (simulating saved config)
const initialFormData: IntegrationFormData = {
  protocol: "opcua",
  serverHost: "192.168.1.100",
  serverPort: 4840,
  username: "admin",
  password: "",
  collectInterval: 5,
};

export default function IntegrationSettingsPage() {
  const [formData, setFormData] = useState<IntegrationFormData>(initialFormData);
  const [isTesting, setIsTesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (field: keyof IntegrationFormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    try {
      // Simulate connection test
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success("连接测试成功", {
        description: `成功连接到 ${formData.serverHost}:${formData.serverPort}`,
      });
    } catch {
      toast.error("连接测试失败", {
        description: "无法连接到服务器，请检查配置参数",
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate save
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("保存成功", {
        description: "西门子集成配置已更新",
      });
    } catch {
      toast.error("保存失败", {
        description: "配置保存时发生错误",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-semibold tracking-tight">西门子集成配置</h1>
          <p className="text-sm text-muted-foreground">配置西门子设备数据采集参数</p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        <Card className="hover:shadow-md transition-shadow max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">连接配置</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Protocol Type */}
              <div className="space-y-2">
                <Label htmlFor="protocol" className="flex items-center gap-2">
                  <Plug className="h-4 w-4" />
                  协议类型 <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.protocol}
                  onValueChange={(value) => handleChange("protocol", value as ProtocolType)}
                >
                  <SelectTrigger id="protocol">
                    <SelectValue placeholder="选择协议类型" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(PROTOCOL_DICT).map((protocol) => (
                      <SelectItem key={protocol.value} value={protocol.value}>
                        {protocol.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Server Address */}
              <div className="space-y-2">
                <Label htmlFor="serverHost" className="flex items-center gap-2">
                  <Server className="h-4 w-4" />
                  服务器地址 <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="serverHost"
                  placeholder="例如: 192.168.1.100"
                  value={formData.serverHost}
                  onChange={(e) => handleChange("serverHost", e.target.value)}
                  required
                />
              </div>

              {/* Server Port */}
              <div className="space-y-2">
                <Label htmlFor="serverPort" className="flex items-center gap-2">
                  <Server className="h-4 w-4" />
                  服务器端口 <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="serverPort"
                  type="number"
                  placeholder="例如: 4840"
                  value={formData.serverPort}
                  onChange={(e) => handleChange("serverPort", parseInt(e.target.value) || 0)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  {formData.protocol === "opcua" ? "OPC UA 默认端口: 4840" : "Modbus TCP 默认端口: 502"}
                </p>
              </div>

              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  用户名 <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="username"
                  placeholder="请输入用户名"
                  value={formData.username}
                  onChange={(e) => handleChange("username", e.target.value)}
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  密码 <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="请输入密码"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">留空表示保持原密码不变</p>
              </div>

              {/* Collect Interval */}
              <div className="space-y-2">
                <Label htmlFor="collectInterval" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  采集频率(秒) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="collectInterval"
                  type="number"
                  min="1"
                  max="3600"
                  placeholder="建议: 5-60"
                  value={formData.collectInterval}
                  onChange={(e) => handleChange("collectInterval", parseInt(e.target.value) || 5)}
                  required
                />
                <p className="text-xs text-muted-foreground">数据采集间隔时间，单位: 秒</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-4 border-t">
                <Button onClick={handleTestConnection} variant="outline" disabled={isTesting}>
                  {isTesting ? "测试中..." : "测试连接"}
                </Button>
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? "保存中..." : "保存"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
