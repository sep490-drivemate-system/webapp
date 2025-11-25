"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NotificationCardData } from "./notification-card";
import { List, ShieldCheck, Users } from "lucide-react";
import { ComponentType } from "react";

type NotificationCategory = NotificationCardData["category"] | "all";

interface Stats {
  total: number;
  system: number;
  customer: number;
  unread: number;
}

interface NotificationTabsProps {
  activeFilter: NotificationCategory;
  onFilterChange: (category: NotificationCategory) => void;
  stats: Stats;
}

const filterOptions: Array<{
  value: NotificationCategory;
  label: string;
  icon: ComponentType<{ className?: string }>;
}> = [
  { value: "all", label: "Tất cả", icon: List },
  { value: "system", label: "Hệ thống", icon: ShieldCheck },
  { value: "customer", label: "Khách hàng", icon: Users },
];

const getFilterLabel = (value: NotificationCategory) =>
  filterOptions.find((option) => option.value === value)?.label ||
  filterOptions[0].label;

const getFilterIcon = (value: NotificationCategory) =>
  filterOptions.find((option) => option.value === value)?.icon ||
  filterOptions[0].icon;

export default function NotificationTabs({
  activeFilter,
  onFilterChange,
  stats,
}: NotificationTabsProps) {
  return (
    <section className="w-full">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
        <Label
          htmlFor="notification-filter"
          className="text-sm font-medium whitespace-nowrap"
        >
          Lọc theo nguồn:
        </Label>
        <Select
          value={activeFilter}
          onValueChange={(value) =>
            onFilterChange(value as NotificationCategory)
          }
        >
          <SelectTrigger
            id="notification-filter"
            className="w-full sm:w-[260px]"
          >
            <SelectValue placeholder="Chọn nguồn">
              <div className="flex items-center gap-2">
                {(() => {
                  const Icon = getFilterIcon(activeFilter);
                  return <Icon className="size-4" />;
                })()}
                <span>{getFilterLabel(activeFilter)}</span>
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {filterOptions.map((option) => {
              const Icon = option.icon;
              const count =
                option.value === "all"
                  ? stats.total
                  : option.value === "system"
                  ? stats.system
                  : stats.customer;
              return (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex w-full items-center gap-2">
                    <Icon className="size-4" />
                    <span className="flex-1 text-left">{option.label}</span>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                      {count}
                    </span>
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>
    </section>
  );
}
