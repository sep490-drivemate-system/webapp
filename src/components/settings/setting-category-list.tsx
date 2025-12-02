"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pencil, Settings } from "lucide-react";
import {
  type Setting,
  type SettingCategory,
  getSettingRoleLabelFromName,
  getSettingDisplayName,
  getSettingDescription,
} from "@/lib/settings";

interface SettingCategoryListProps {
  category: SettingCategory;
  settings: Setting[];
  onCategoryChange: (category: SettingCategory) => void;
  onEdit: (setting: Setting) => void;
}

const AVAILABLE_CATEGORIES: SettingCategory[] = [
  "cancel-service-package",
  "cancel-driving-session",
  "reschedule-driving-session",
];

const getCategoryTitle = (category: SettingCategory) => {
  switch (category) {
    case "cancel-service-package":
      return "Hủy gói dịch vụ";
    case "cancel-driving-session":
      return "Hủy buổi huấn luyện";
    case "reschedule-driving-session":
      return "Đổi lịch buổi huấn luyện";
    default:
      return "Chính sách";
  }
};

export default function SettingCategoryList({
  category,
  settings,
  onCategoryChange,
  onEdit,
}: SettingCategoryListProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          <div>
            <CardTitle className="text-xl">
              {getCategoryTitle(category)}
            </CardTitle>
            <CardDescription>
              Danh sách các chính sách đang áp dụng cho danh mục này.
            </CardDescription>
          </div>
        </div>
        <Tabs
          value={category}
          onValueChange={(value) => onCategoryChange(value as SettingCategory)}
          className="w-full mt-4"
        >
          <TabsList className="mb-2 grid w-full grid-cols-1 sm:grid-cols-3 bg-secondary">
            {AVAILABLE_CATEGORIES.map((cat) => (
              <TabsTrigger
                key={cat}
                value={cat}
                className="w-full text-sm text-foreground data-[state=active]:bg-emerald-600 data-[state=active]:text-primary-foreground flex items-center gap-2"
              >
                {getCategoryTitle(cat)}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="space-y-4">
        {settings.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Chưa có chính sách nào.
          </p>
        ) : (
          <div className="space-y-3">
            {settings.map((setting) => (
              <div key={setting.id} className="rounded-lg border bg-card p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground">
                        {getSettingDisplayName(setting)}
                      </h3>
                      <Badge variant="outline">
                        {getSettingRoleLabelFromName(setting.name)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {getSettingDescription(setting)}
                    </p>
                  </div>
                  <button
                    onClick={() => onEdit(setting)}
                    className="p-2 hover:bg-muted rounded transition-colors"
                    title="Chỉnh sửa"
                  >
                    <Pencil className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
