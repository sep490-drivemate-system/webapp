"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageHeader from "@/components/commons/Header/header";
import SettingCategoryList from "@/components/settings/setting-category-list";
import SettingForm from "@/components/settings/setting-form";
import SettingStats from "@/components/settings/setting-stats";
import SettingEditDialog from "@/components/settings/setting-edit-dialog";
import {
  settingsData,
  type Setting,
  type SettingCategory,
  type SettingInput,
  getSettingRoleLabelFromName,
  getSettingCategoryFromName,
  getSettingDisplayName,
} from "@/lib/settings";
import { ArrowLeft, ArrowRight, Settings, FileText, Users } from "lucide-react";
import { IconListDetails } from "@tabler/icons-react";

export default function ManagementSettingPage() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(
    searchParams.get("tab") || "overview"
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

  const handleAddSetting = () => {
    setEditingSetting(null);
    setShowForm(true);
  };

  const handleEditSetting = (id: string) => {
    setEditingSetting(id);
    setShowForm(true);
  };

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

  const handleDeleteSetting = (id: string) => {
    setSettings(settings.filter((s) => s.id !== id));
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

  const getCategoryLabel = (category: SettingCategory) => {
    const labels: Record<SettingCategory, string> = {
      "cancel-service-package": "Hủy gói dịch vụ",
      "cancel-driving-session": "Hủy buổi huấn luyện",
      "reschedule-driving-session": "Đổi lịch buổi huấn luyện",
    };
    return labels[category];
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
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-secondary">
            <TabsTrigger
              value="overview"
              className="text-sm text-foreground data-[state=active]:bg-emerald-600 data-[state=active]:text-primary-foreground flex items-center gap-2"
            >
              Tổng quan
            </TabsTrigger>
            <TabsTrigger
              value="details"
              className="text-sm text-foreground data-[state=active]:bg-emerald-600 data-[state=active]:text-primary-foreground flex items-center gap-2"
            >
              Cấu hình
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Overview */}
          <TabsContent value="overview" className="space-y-8">
            <Card className="mb-12 border border-border/60 shadow-sm bg-gradient-to-r from-muted/50 via-background to-background">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle className="text-xl">
                      Tổng quan chính sách
                    </CardTitle>
                    <CardDescription>
                      Thống kê nhanh các chính sách đang áp dụng trong hệ thống.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <SettingStats settings={settings} />
              </CardContent>
            </Card>

            {/* Danh mục chính sách (moved from separate tab) */}
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <IconListDetails className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle className="text-xl">
                      Chi tiết chính sách
                    </CardTitle>
                    <CardDescription>
                      Danh sách chi tiết các chính sách đang áp dụng trong hệ
                      thống.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                  {(
                    [
                      "cancel-service-package",
                      "cancel-driving-session",
                      "reschedule-driving-session",
                    ] as SettingCategory[]
                  ).map((category) => {
                    const categorySettings = settings.filter(
                      (s) => getSettingCategoryFromName(s.name) === category
                    );

                    if (!categorySettings.length) return null;

                    const settingsByRole = categorySettings.reduce<
                      Record<string, Setting[]>
                    >((acc, setting) => {
                      const roleLabel = getSettingRoleLabelFromName(
                        setting.name
                      );
                      if (!acc[roleLabel]) {
                        acc[roleLabel] = [];
                      }
                      acc[roleLabel].push(setting);
                      return acc;
                    }, {});

                    return (
                      <Card key={category}>
                        <CardHeader>
                          <CardTitle className="text-lg">
                            {getCategoryLabel(category)}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {Object.entries(settingsByRole).map(
                            ([role, roleSettings]) => (
                              <div key={role} className="space-y-2 text-sm">
                                <p className="font-medium text-foreground">
                                  {role}:
                                </p>
                                <ul className="text-muted-foreground space-y-1 ml-4">
                                  {roleSettings.map((setting) => (
                                    <li key={setting.id}>
                                      • {getSettingDisplayName(setting)}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 2: Config setting */}
          <TabsContent value="details" className="space-y-8">
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
