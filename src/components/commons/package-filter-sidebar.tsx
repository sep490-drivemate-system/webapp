import { Filter } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface PackageFilterState {
  roadType: string;
  hasVehicle: string;
  hours: string;
}

type StringRecord<T> = {
  [K in keyof T]: string;
};

type FilterOption = {
  value: string;
  label: string;
};

export type FilterSection<TFilters> = {
  key: keyof TFilters;
  label: string;
  placeholder?: string;
  options: FilterOption[];
};

interface PackageFilterSidebarProps<TFilters extends StringRecord<TFilters>> {
  filters: TFilters;
  sections: FilterSection<TFilters>[];
  onFilterChange: (key: keyof TFilters, value: string) => void;
  onReset: () => void;
  title?: string;
  resetLabel?: string;
}

export function PackageFilterSidebar<TFilters extends StringRecord<TFilters>>({
  filters,
  sections,
  onFilterChange,
  onReset,
  title = "Bộ lọc",
  resetLabel = "Xóa bộ lọc",
}: PackageFilterSidebarProps<TFilters>) {
  return (
    <Card className="sticky top-4 border border-emerald-100 bg-gradient-to-br from-emerald-50/70 via-white to-white shadow-lg rounded-2xl">
      <CardContent className="p-6 space-y-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Filter className="h-5 w-5" />
            {title}
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="border border-emerald-200 text-emerald-700 shadow-sm hover:bg-emerald-50 hover:text-emerald-800"
          >
            {resetLabel}
          </Button>
        </div>

        <div className="space-y-5">
          {sections.map((section) => (
            <div key={section.key as string}>
              <label className="text-sm font-medium mb-2 block">
                {section.label}
              </label>
              <Select
                value={filters[section.key]}
                onValueChange={(value) => onFilterChange(section.key, value)}
              >
                <SelectTrigger className="w-full bg-white/80 border-emerald-200 focus:ring-emerald-500 focus:border-emerald-500">
                  <SelectValue placeholder={section.placeholder} />
                </SelectTrigger>
                <SelectContent className="w-full">
                  {section.options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
