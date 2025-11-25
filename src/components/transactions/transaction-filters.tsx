import { type ChangeEvent } from "react";

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

const STATUS_OPTIONS = [
  { label: "Tất cả trạng thái", value: "all" },
  { label: "Hoàn tất", value: "completed" },
  { label: "Đang xử lý", value: "pending" },
  { label: "Thất bại", value: "failed" },
];

type FilterState = {
  timeRange: string;
  amount: string;
  status: string;
};

interface TransactionFiltersProps {
  appliedFilters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  timeOptions: { label: string; value: string }[];
  onReset?: () => void;
  onApply?: () => void;
}

export function TransactionFilters({
  appliedFilters,
  onFiltersChange,
  timeOptions,
  onReset,
  onApply,
}: TransactionFiltersProps) {
  const handleAmountChange = (event: ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({
      ...appliedFilters,
      amount: event.target.value,
    });
  };

  const handleStatusChange = (value: string) => {
    onFiltersChange({
      ...appliedFilters,
      status: value,
    });
  };

  const handleTimeRangeChange = (value: string) => {
    onFiltersChange({
      ...appliedFilters,
      timeRange: value,
    });
  };

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label className="text-sm font-medium text-neutral-700">
          Khoảng thời gian
        </Label>
        <Select
          value={appliedFilters.timeRange}
          onValueChange={handleTimeRangeChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Khoảng thời gian" />
          </SelectTrigger>
          <SelectContent>
            {timeOptions.map((range) => (
              <SelectItem key={range.value} value={range.value}>
                {range.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-neutral-700">
          Số tiền tối thiểu (₫)
        </Label>
        <Input
          type="number"
          min={0}
          value={appliedFilters.amount}
          onChange={handleAmountChange}
          placeholder="Nhập số tiền tối thiểu"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-neutral-700">
          Trạng thái
        </Label>
        <Select
          value={appliedFilters.status}
          onValueChange={handleStatusChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {(onReset || onApply) && (
        <div className="flex items-center justify-end gap-2 border-t pt-4">
          {onReset ? (
            <Button variant="ghost" size="sm" onClick={onReset}>
              Xóa bộ lọc
            </Button>
          ) : null}
          {onApply ? (
            <Button size="sm" onClick={onApply}>
              Áp dụng
            </Button>
          ) : null}
        </div>
      )}
    </div>
  );
}
