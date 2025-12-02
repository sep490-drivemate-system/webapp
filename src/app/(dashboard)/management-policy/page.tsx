"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  X,
  FileText,
  Shield,
  Settings,
  Eye,
} from "lucide-react";
import { useRequireAuth } from "@/hooks/auth/useRequireAuth";
import { UserRole } from "@/types/auth/user-role.enum";
import { Policy, PolicySection, PolicyValue } from "@/types/policy";
import { mockPolicies } from "@/data/mock-policies";
import PageHeader from "@/components/commons/Header/header";

// Component để hiển thị policy như trong hình
const PolicyDisplay = ({ policy }: { policy: Policy }) => {
  return (
    <div className="bg-white p-6 rounded-lg border">
      <h2 className="text-2xl font-bold text-blue-600 mb-6 text-center">
        {policy.title}
      </h2>

      {policy.sections.map((section, index) => (
        <div key={section.id} className="mb-6">
          <h3 className="text-lg font-semibold text-blue-600 mb-3">
            {section.title}
          </h3>

          {/* Hiển thị các values có thể điều chỉnh */}
          {section.values.length > 0 && (
            <div className="mb-4">
              {section.values.map((value) => (
                <div key={value.id} className="mb-2">
                  <span className="font-medium">• {value.label}: </span>
                  <span className="font-bold text-green-600">
                    {value.value}
                    {value.unit}
                  </span>
                  {value.description && (
                    <span className="text-gray-600 ml-2">
                      ({value.description})
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Hiển thị các rules */}
          <ul className="list-disc ml-6 space-y-1">
            {section.rules.map((rule, ruleIndex) => (
              <li key={ruleIndex} className="text-gray-700">
                {rule}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

// Component để chỉnh sửa giá trị
const ValueEditor = ({
  value,
  onUpdate,
}: {
  value: PolicyValue;
  onUpdate: (updatedValue: PolicyValue) => void;
}) => {
  const [editValue, setEditValue] = useState(value.value);

  const handleSave = () => {
    onUpdate({ ...value, value: editValue });
  };

  return (
    <div className="flex items-center gap-2 p-2 border rounded">
      <span className="font-medium min-w-0 flex-1">{value.label}:</span>
      <Input
        type="number"
        value={editValue}
        onChange={(e) => setEditValue(Number(e.target.value))}
        className="w-20"
      />
      <span className="text-sm text-gray-600">{value.unit}</span>
      <Button size="sm" onClick={handleSave}>
        Lưu
      </Button>
    </div>
  );
};

export default function ManagementPolicyPage() {
  // useRequireAuth([UserRole.Admin, UserRole.Manager]);

  const [policies, setPolicies] = useState<Policy[]>(mockPolicies);
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<PolicySection | null>(
    null
  );

  const handleViewPolicy = (policy: Policy) => {
    setSelectedPolicy(policy);
    setIsViewDialogOpen(true);
  };

  const handleEditPolicy = (policy: Policy) => {
    setSelectedPolicy(policy);
    setIsEditDialogOpen(true);
  };

  const handleUpdateValue = (
    policyId: string,
    sectionId: string,
    updatedValue: PolicyValue
  ) => {
    setPolicies(
      policies.map((policy) => {
        if (policy.id === policyId) {
          return {
            ...policy,
            sections: policy.sections.map((section) => {
              if (section.id === sectionId) {
                return {
                  ...section,
                  values: section.values.map((value) =>
                    value.id === updatedValue.id ? updatedValue : value
                  ),
                };
              }
              return section;
            }),
            updatedAt: new Date(),
          };
        }
        return policy;
      })
    );
  };

  const formatDate = (date: Date | string) => {
    if (typeof date === "string") {
      return new Date(date).toLocaleDateString("vi-VN");
    }
    return date.toLocaleDateString("vi-VN");
  };

  return (
    <div className="flex flex-1 flex-col space-y-6">
      {/* Header */}
      <PageHeader
        title="Quản Lý Cài Đặt Hệ Thống"
        description="Quản lý các chính sách và điều khoản với các tham số có thể điều chỉnh"
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card">
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div className="space-y-1">
              <CardDescription className="text-sm font-medium text-muted-foreground">
                Tổng chính sách
              </CardDescription>
              <CardTitle className="text-2xl font-semibold">
                {policies.length}
              </CardTitle>
            </div>
            <span className="rounded-xl p-3 bg-blue-50 text-blue-600">
              <FileText className="size-5" />
            </span>
          </CardHeader>
        </Card>
        <Card className="bg-card">
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div className="space-y-1">
              <CardDescription className="text-sm font-medium text-muted-foreground">
                Đang áp dụng
              </CardDescription>
              <CardTitle className="text-2xl font-semibold">
                {policies.filter((p) => p.isActive).length}
              </CardTitle>
            </div>
            <span className="rounded-xl p-3 bg-purple-50 text-purple-600">
              <Shield className="size-5" />
            </span>
          </CardHeader>
        </Card>
        <Card className="bg-card">
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div className="space-y-1">
              <CardDescription className="text-sm font-medium text-muted-foreground">
                Tổng tham số
              </CardDescription>
              <CardTitle className="text-2xl font-semibold">
                {policies.reduce(
                  (total, policy) =>
                    total +
                    policy.sections.reduce(
                      (sectionTotal, section) =>
                        sectionTotal + section.values.length,
                      0
                    ),
                  0
                )}
              </CardTitle>
            </div>
            <span className="rounded-xl p-3 bg-sky-50 text-sky-600">
              <Settings className="size-5" />
            </span>
          </CardHeader>
        </Card>
        <Card className="bg-card">
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div className="space-y-1">
              <CardDescription className="text-sm font-medium text-muted-foreground">
                Phiên bản mới nhất
              </CardDescription>
              <CardTitle className="text-2xl font-semibold">
                {Math.max(...policies.map((p) => parseFloat(p.version)))}
              </CardTitle>
            </div>
            <span className="rounded-xl p-3 bg-emerald-50 text-emerald-600">
              <FileText className="size-5" />
            </span>
          </CardHeader>
        </Card>
      </div>

      {/* Policies List */}
      <div className="grid gap-4">
        {policies.map((policy) => (
          <Card key={policy.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">{policy.title}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {policy.description}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant={policy.isActive ? "default" : "secondary"}>
                      {policy.isActive ? "Đang áp dụng" : "Không hoạt động"}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      Phiên bản {policy.version}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      Cập nhật: {formatDate(policy.updatedAt)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewPolicy(policy)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Xem
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditPolicy(policy)}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Chỉnh sửa
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {policy.sections.map((section) => (
                  <div key={section.id} className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-2">{section.title}</h4>
                    {section.values.length > 0 && (
                      <div className="grid gap-2 mb-3">
                        {section.values.map((value) => (
                          <div
                            key={value.id}
                            className="flex items-center justify-between text-sm"
                          >
                            <span>{value.label}:</span>
                            <span className="font-medium text-blue-600">
                              {value.value}
                              {value.unit}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                    <p className="text-sm text-muted-foreground">
                      {section.rules.length} quy tắc được định nghĩa
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* View Policy Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Xem chính sách</DialogTitle>
            <DialogDescription>
              Hiển thị chi tiết chính sách như người dùng sẽ thấy
            </DialogDescription>
          </DialogHeader>
          {selectedPolicy && <PolicyDisplay policy={selectedPolicy} />}
        </DialogContent>
      </Dialog>

      {/* Edit Policy Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa tham số chính sách</DialogTitle>
            <DialogDescription>
              Điều chỉnh các con số và tham số trong chính sách
            </DialogDescription>
          </DialogHeader>
          {selectedPolicy && (
            <div className="space-y-6">
              {selectedPolicy.sections.map((section) => (
                <div key={section.id} className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-4">{section.title}</h4>
                  <div className="space-y-3">
                    {section.values.map((value) => (
                      <ValueEditor
                        key={value.id}
                        value={value}
                        onUpdate={(updatedValue) =>
                          handleUpdateValue(
                            selectedPolicy.id,
                            section.id,
                            updatedValue
                          )
                        }
                      />
                    ))}
                  </div>
                  {section.rules.length > 0 && (
                    <div className="mt-4">
                      <h5 className="font-medium mb-2">Quy tắc:</h5>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {section.rules.map((rule, index) => (
                          <li key={index}>• {rule}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
