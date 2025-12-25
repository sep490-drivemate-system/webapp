"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function SetSchedule() {
  const [maxDays, setMaxDays] = useState<number>(7);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (maxDays < 1 || maxDays > 365) {
      setError("Số ngày phải từ 1 đến 365");
      return;
    }

    setIsSaving(true);
    setError(null);
    setSaveSuccess(false);

    try {
      // TODO: Implement API call to save the configuration
      // await saveMaxDaysConfiguration(maxDays);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch {
      setError("Có lỗi xảy ra khi lưu cấu hình. Vui lòng thử lại.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-card">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <div>
              <CardTitle className="text-xl">Chính sách hẹn lịch</CardTitle>
              <CardDescription>
                Thiết lập thời gian tối đa giữa khi người hướng dẫn nộp giấy tờ
                và khi người kiểm duyệt xem xét tại trung tâm.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="max-days" className="text-base font-semibold">
              Thời Gian Tối Đa (Số Ngày)
            </Label>
            <div className="flex items-center gap-4 pt-2">
              <Input
                id="max-days"
                type="number"
                min="1"
                max="365"
                value={maxDays}
                onChange={(e) => {
                  const value = parseInt(e.target.value, 10);
                  if (!isNaN(value) && value > 0) {
                    setMaxDays(value);
                    setError(null);
                  } else if (e.target.value === "") {
                    setMaxDays(0);
                  }
                }}
                className="w-32"
                placeholder="Nhập số ngày"
              />
              <span className="text-sm text-muted-foreground">ngày</span>
            </div>
            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {saveSuccess && (
              <Alert className="mt-4 border-emerald-600 bg-emerald-50 dark:bg-emerald-950/20">
                <AlertCircle className="h-4 w-4 text-emerald-600" />
                <AlertDescription className="text-emerald-800 dark:text-emerald-200">
                  Đã lưu cấu hình thành công!
                </AlertDescription>
              </Alert>
            )}
          </div>

          <div className="flex items-center gap-4 pt-4 border-t">
            <Button
              onClick={handleSave}
              disabled={isSaving || maxDays < 1 || maxDays > 365}
              className="flex items-center gap-2"
            >
              {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
            <p className="text-sm text-muted-foreground">
              Giá trị hiện tại:{" "}
              <span className="font-semibold">{maxDays} ngày</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
