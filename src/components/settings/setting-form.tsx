"use client";

import { useState, useEffect, FormEvent } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Setting, SettingInput, SettingValueType } from "@/lib/settings";
import {
  getSettingDisplayNameFromName,
  getSettingDescriptionFromName,
} from "@/lib/settings";

interface SettingFormProps {
  setting: Setting | null;
  onSave: (data: SettingInput) => void;
  onCancel: () => void;
}

export default function SettingForm({
  setting,
  onSave,
  onCancel,
}: SettingFormProps) {
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [valueType, setValueType] = useState<SettingValueType>("int");
  const [unitOfMeasurement, setUnitOfMeasurement] = useState<number>(0);
  const [days, setDays] = useState<number>(0);

  useEffect(() => {
    if (setting) {
      setName(setting.name);
      setValue(setting.value);
      setValueType(setting.valueType);
      setUnitOfMeasurement(setting.unitOfMeasurement);
      setDays(setting.days);
    } else {
      setName("");
      setValue("");
      setValueType("int");
      setUnitOfMeasurement(0);
      setDays(0);
    }
  }, [setting]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave({
      name: name.trim(),
      value: value.toString().trim(),
      valueType,
      unitOfMeasurement,
      days,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {setting ? "Chỉnh sửa chính sách" : "Tạo chính sách mới"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="name">Mã policy (name)</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ví dụ: CancelServicePackage_WithinDays_Unused_NoviceDriver"
              required
            />
          </div>

          {name && (
            <>
              <div className="space-y-2">
                <Label>Tiêu đề hiển thị</Label>
                <div className="p-3 bg-muted rounded-md text-sm">
                  {getSettingDisplayNameFromName(name)}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Mô tả / Nội dung chính sách</Label>
                <div className="p-3 bg-muted rounded-md text-sm">
                  {getSettingDescriptionFromName(name) || "Chưa có mô tả"}
                </div>
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="value">Giá trị (value)</Label>
            <Input
              id="value"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Ví dụ: 100, refundBookedHours..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="valueType">Kiểu giá trị (valueType)</Label>
            <select
              id="valueType"
              className="border-input bg-background text-sm rounded-md px-3 py-2"
              value={valueType}
              onChange={(e) => setValueType(e.target.value as SettingValueType)}
            >
              <option value="int">int</option>
              <option value="string">string</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="uom">Đơn vị đo (unitOfMeasurement)</Label>
              <Input
                id="uom"
                type="number"
                value={unitOfMeasurement}
                onChange={(e) =>
                  setUnitOfMeasurement(Number(e.target.value) || 0)
                }
                placeholder="Ví dụ: 1 hoặc 0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="days">Số ngày (days)</Label>
              <Input
                id="days"
                type="number"
                value={days}
                onChange={(e) => setDays(Number(e.target.value) || 0)}
                placeholder="Ví dụ: 30 (cho 1 tháng), 1 (cho 24h)"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Hủy
            </Button>
            <Button type="submit">
              {setting ? "Lưu thay đổi" : "Tạo mới"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
