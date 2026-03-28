"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Wrench,
  CalendarClock,
  Package,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

const systemName = "EAM设备管理系统";

const menuItems = [
  {
    id: "dashboard",
    name: "监控大屏",
    icon: LayoutDashboard,
    route: "/dashboard",
  },
  {
    id: "equipment",
    name: "设备管理",
    icon: Wrench,
    route: "/equipment",
    children: [
      { name: "设备台账", route: "/equipment" },
      { name: "设备详情", route: "/equipment/" },
    ],
  },
  {
    id: "maintenance",
    name: "维护管理",
    icon: CalendarClock,
    route: "/maintenance",
    children: [
      { name: "维护计划", route: "/maintenance/plans" },
      { name: "维修工单", route: "/maintenance/workorders" },
    ],
  },
  {
    id: "spares",
    name: "备件管理",
    icon: Package,
    route: "/spares",
    children: [
      { name: "备件台账", route: "/spares" },
      { name: "库存预警", route: "/spares/alerts" },
    ],
  },
  {
    id: "analytics",
    name: "分析报表",
    icon: BarChart3,
    route: "/analytics",
    children: [
      { name: "设备绩效", route: "/analytics/performance" },
      { name: "维护分析", route: "/analytics/maintenance" },
    ],
  },
  {
    id: "settings",
    name: "系统设置",
    icon: Settings,
    route: "/settings",
    children: [
      { name: "基础数据", route: "/settings/basis" },
      { name: "集成配置", route: "/settings/integration" },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(
    new Set(["equipment", "maintenance", "spares", "analytics", "settings"])
  );

  const toggleMenu = (id: string) => {
    const newExpanded = new Set(expandedMenus);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedMenus(newExpanded);
  };

  const isActive = (route: string) => {
    return pathname === route || pathname.startsWith(route + "/");
  };

  return (
    <aside className="fixed left-0 top-0 z-20 h-screen w-60 bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex flex-col">
      {/* Logo/Brand */}
      <div className="px-4 py-5 border-b border-sidebar-border">
        <h2 className="text-lg font-semibold text-sidebar-foreground">{systemName}</h2>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const hasChildren = item.children && item.children.length > 0;
          const isExpanded = expandedMenus.has(item.id);
          const isParentActive = isActive(item.route);

          return (
            <div key={item.id}>
              {hasChildren ? (
                <>
                  <button
                    onClick={() => toggleMenu(item.id)}
                    className={cn(
                      "flex items-center justify-between gap-3 w-full rounded-lg px-3 py-2 text-sm transition-colors",
                      isParentActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4" />
                      {item.name}
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                  {isExpanded && (
                    <div className="ml-9 mt-1 space-y-1">
                      {item.children!.map((child) => (
                        <Link
                          key={child.route}
                          href={child.route}
                          className={cn(
                            "block rounded-lg px-3 py-1.5 text-sm transition-colors",
                            isActive(child.route)
                              ? "bg-sidebar-accent text-sidebar-accent-foreground"
                              : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                          )}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={item.route}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                    isActive(item.route)
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
