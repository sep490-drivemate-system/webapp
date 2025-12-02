"use client";

import { useState, useEffect, FormEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Setting } from "@/lib/settings";
import { getSettingDisplayName, getSettingDescription } from "@/lib/settings";

interface SettingEditDialogProps {
  setting: Setting | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: { days: number; value: string }) => void;
}

const READONLY_VALUE_SETTINGS = [
  "CancelServicePackage_WithinDays_PartiallyUsed_Formula_NoviceDriver",
  "RescheduleDrivingSession_OnOrBeforeDays_NoviceDriver",
  "RescheduleDrivingSession_UnderDays_NoviceDriver",
  "RescheduleDrivingSession_OnOrBeforeDays_Instructor",
  "RescheduleDrivingSession_UnderDays_Instructor",
];

export default function SettingEditDialog({
  setting,
  open,
  onOpenChange,
  onSave,
}: SettingEditDialogProps) {
  const [days, setDays] = useState<number>(0);
  const [value, setValue] = useState<string>("");

  useEffect(() => {
    if (setting) {
      setDays(setting.days);
      setValue(setting.value);
    }
  }, [setting]);

  const canEditValue = setting
    ? !READONLY_VALUE_SETTINGS.includes(setting.name)
    : false;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (setting) {
      onSave({ days, value });
      onOpenChange(false);
    }
  };

  if (!setting) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa chính sách</DialogTitle>
          <DialogDescription>
            {canEditValue
              ? "Cập nhật số ngày và giá trị cho chính sách này."
              : "Cập nhật số ngày cho chính sách này."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Tên chính sách</Label>
            <div className="p-3 bg-muted rounded-md text-sm font-medium">
              {getSettingDisplayName({ ...setting, days })}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Mô tả</Label>
            <div className="p-3 bg-muted rounded-md text-sm text-muted-foreground">
              {getSettingDescription({ ...setting, value })}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="days">
              Số ngày <span className="text-destructive">*</span>
            </Label>
            <Input
              id="days"
              type="number"
              value={days}
              onChange={(e) => setDays(Number(e.target.value) || 0)}
              placeholder="Ví dụ: 1, 1.5, 30..."
              required
              min={1}
              max={31}
              step={0.5}
            />
          </div>

          {canEditValue && (
            <div className="space-y-2">
              <Label htmlFor="value">
                Giá trị %<span className="text-destructive">*</span>
              </Label>
              <Input
                id="value"
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Ví dụ: 0, 50.5, 100..."
                required
                min={0}
                max={100}
                step={0.01}
              />
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Hủy
            </Button>
            <Button type="submit">Lưu thay đổi</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
