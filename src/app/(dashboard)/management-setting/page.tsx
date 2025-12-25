"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

import PageHeader from "@/components/commons/Header/header";
import { SetSchedule } from "@/components/documents/set-schdedule";
import SettingCategoryList from "@/components/settings/setting-category-list";
import SettingEditDialog from "@/components/settings/setting-edit-dialog";
import SettingForm from "@/components/settings/setting-form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getSettingCategoryFromName,
  settingsData,
  type Setting,
  type SettingCategory,
  type SettingInput
} from "@/lib/settings";
import { AlertCircle, Percent } from "lucide-react";

export default function ManagementSettingPage() { 
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(
    searchParams.get("tab") || "policy"
  );
  const [selectedCategory, setSelectedCategory] = useState<SettingCategory>(
    "cancel-service-package"
  );
  const [showForm, setShowForm] = useState(false);
  const [editingSetting, setEditingSetting] = useState<string | null>(null);
  const [settings, setSettings] = useState<Setting[]>(settingsData);
  const [editingSettingForDialog, setEditingSettingForDialog] =
    useState<Setting | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [commission, setCommission] = useState<number>(15);
  const [commissionError, setCommissionError] = useState<string | null>(null);
  const [commissionSaving, setCommissionSaving] = useState(false);
  const [commissionSaved, setCommissionSaved] = useState(false);

  const handleSaveSetting = (settingData: SettingInput) => {
    if (editingSetting) {
      setSettings(
        settings.map((s) =>
          s.id === editingSetting ? { ...s, ...settingData } : s
        )
      );
    } else {
      setSettings([...settings, { id: Date.now().toString(), ...settingData }]);
    }
    setShowForm(false);
  };

  const handleEditSettingQuick = (setting: Setting) => {
    setEditingSettingForDialog(setting);
    setIsEditDialogOpen(true);
  };

  const handleSaveSettingQuick = (data: { days: number; value: string }) => {
    if (editingSettingForDialog) {
      setSettings(
        settings.map((s) =>
          s.id === editingSettingForDialog.id
            ? { ...s, days: data.days, value: data.value }
            : s
        )
      );
    }
    setIsEditDialogOpen(false);
    setEditingSettingForDialog(null);
  };

  const handleSaveCommission = async () => {
    if (commission < 0 || commission > 100) {
      setCommissionError("Tỉ lệ hoa hồng phải trong khoảng 0% - 100%");
      return;
    }

    setCommissionError(null);
    setCommissionSaved(false);
    setCommissionSaving(true);

    try {
      // TODO: Replace with API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      setCommissionSaved(true);
      setTimeout(() => setCommissionSaved(false), 2500);
    } catch {
      setCommissionError("Không thể lưu tỉ lệ hoa hồng. Vui lòng thử lại.");
    } finally {
      setCommissionSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Quản lý cài đặt hệ thống"
        description="Quản lý các cài đặt cho hệ thống cho người dùng và chính sách"
        className="border-b border-border bg-background"
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-secondary">
            <TabsTrigger
              value="policy"
              className="text-sm text-foreground data-[state=active]:bg-emerald-600 data-[state=active]:text-primary-foreground flex items-center gap-2"
            >
              Chính sách
            </TabsTrigger>
            <TabsTrigger
              value="schedule"
              className="text-sm text-foreground data-[state=active]:bg-emerald-600 data-[state=active]:text-primary-foreground flex items-center gap-2"
            >
              Hẹn lịch
            </TabsTrigger>
            <TabsTrigger
              value="commission"
              className="text-sm text-foreground data-[state=active]:bg-emerald-600 data-[state=active]:text-primary-foreground flex items-center gap-2"
            >
              Hoa hồng
            </TabsTrigger>
          </TabsList>

          {/* Tab: Policy */}
          <TabsContent value="policy" className="space-y-8">
            {/* Main Content */}
            <div>
              {showForm ? (
                <SettingForm
                  setting={
                    editingSetting
                      ? settings.find((s) => s.id === editingSetting) ?? null
                      : null
                  }
                  onSave={handleSaveSetting}
                  onCancel={() => {
                    setShowForm(false);
                    setEditingSetting(null);
                  }}
                />
              ) : (
                <SettingCategoryList
                  category={selectedCategory}
                  settings={settings.filter(
                    (s) =>
                      getSettingCategoryFromName(s.name) === selectedCategory
                  )}
                  onCategoryChange={(cat) => {
                    setSelectedCategory(cat);
                    setShowForm(false);
                  }}
                  onEdit={handleEditSettingQuick}
                />
              )}
            </div>
          </TabsContent>

          {/* Tab: schedule */}
          <TabsContent value="schedule" className="space-y-8">
            <SetSchedule />
          </TabsContent>

          {/* Tab: commission */}
          <TabsContent value="commission" className="space-y-8">
            <Card className="max-w-2xl">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Percent className="h-5 w-5 text-primary" />
                  <div>
                  <CardTitle className="text-xl">Chính sách hoa hồng</CardTitle>
                    <CardDescription>
                    Thiết lập tỉ lệ hoa hồng áp dụng cho hệ thống trong mỗi giao
                    dịch.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="commission"
                    className="text-sm font-medium text-foreground"
                  >
                    Tỉ lệ hoa hồng (%)
                  </label>
                  <div className="flex items-center gap-3">
                    <Input
                      id="commission"
                      type="number"
                      min={0}
                      max={100}
                      value={commission}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        setCommission(value);
                        if (commissionError) setCommissionError(null);
                      }}
                      className="w-24"
                    />
                    <span className="text-sm text-muted-foreground">
                      (0% - 100%)
                    </span>
                  </div>
                </div>

                {commissionError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{commissionError}</AlertDescription>
                  </Alert>
                )}

                {commissionSaved && (
                  <Alert className="border-emerald-600 bg-emerald-50 dark:bg-emerald-950/20">
                    <AlertCircle className="h-4 w-4 text-emerald-600" />
                    <AlertDescription className="text-emerald-800 dark:text-emerald-200">
                      Đã lưu tỉ lệ hoa hồng thành công.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex items-center gap-4 pt-2 border-t">
                  <Button
                    onClick={handleSaveCommission}
                    disabled={commissionSaving || commission < 0 || commission > 100}
                  >
                    {commissionSaving ? "Đang lưu..." : "Lưu thay đổi"}
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    Giá trị hiện tại:{" "}
                    <span className="font-semibold">{commission}%</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <SettingEditDialog
        setting={editingSettingForDialog}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSave={handleSaveSettingQuick}
      />
    </div>
  );
}
