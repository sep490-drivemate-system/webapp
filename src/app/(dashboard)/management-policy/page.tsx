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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Pencil, Trash2, Search, X, FileText, Shield } from "lucide-react";
import { useRequireAuth } from "@/hooks/auth/useRequireAuth";
import { UserRole } from "@/types/auth/user-role.enum";

// Types
interface Policy {
    id: string;
    title: string;
    description: string;
    content: string;
    category: "Privacy" | "Terms" | "Refund" | "Safety" | "General";
    status: "Active" | "Draft" | "Archived";
    version: string;
    effectiveDate: string;
    createdAt: string;
    updatedAt: string;
}

// Mock data
const initialPolicies: Policy[] = [
    {
        id: "1",
        title: "Chính sách bảo mật thông tin",
        description: "Quy định về việc thu thập, sử dụng và bảo vệ thông tin cá nhân của người dùng",
        content: "Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn...",
        category: "Privacy",
        status: "Active",
        version: "1.2",
        effectiveDate: "2024-01-01",
        createdAt: "2024-01-01",
        updatedAt: "2024-03-15",
    },
    {
        id: "2", 
        title: "Điều khoản sử dụng dịch vụ",
        description: "Các điều khoản và điều kiện khi sử dụng dịch vụ của DriveMate",
        content: "Khi sử dụng dịch vụ của chúng tôi, bạn đồng ý với các điều khoản sau...",
        category: "Terms",
        status: "Active",
        version: "2.1",
        effectiveDate: "2024-02-01",
        createdAt: "2024-01-15",
        updatedAt: "2024-04-01",
    },
    {
        id: "3",
        title: "Chính sách hoàn tiền",
        description: "Quy định về việc hoàn tiền cho các dịch vụ đã đặt",
        content: "Chính sách hoàn tiền áp dụng trong các trường hợp sau...",
        category: "Refund",
        status: "Active", 
        version: "1.0",
        effectiveDate: "2024-01-01",
        createdAt: "2024-01-01",
        updatedAt: "2024-01-01",
    },
    {
        id: "4",
        title: "Quy định an toàn lái xe",
        description: "Các quy tắc và hướng dẫn đảm bảo an toàn trong quá trình học lái xe",
        content: "Để đảm bảo an toàn cho học viên và giảng viên...",
        category: "Safety",
        status: "Draft",
        version: "1.0",
        effectiveDate: "2024-06-01",
        createdAt: "2024-04-15",
        updatedAt: "2024-04-20",
    },
];

export default function ManagementPolicyPage() {
    // useRequireAuth([UserRole.Admin, UserRole.Manager]);

    const [policies, setPolicies] = useState<Policy[]>(initialPolicies);
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<string>("all");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editingPolicy, setEditingPolicy] = useState<Policy | null>(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        content: "",
        category: "General" as Policy["category"],
        status: "Draft" as Policy["status"],
        version: "1.0",
        effectiveDate: "",
    });

    // Filter policies
    const filteredPolicies = policies.filter((policy) => {
        const matchesSearch = policy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            policy.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === "all" || policy.category === categoryFilter;
        const matchesStatus = statusFilter === "all" || policy.status === statusFilter;
        return matchesSearch && matchesCategory && matchesStatus;
    });

    const resetForm = () => {
        setFormData({
            title: "",
            description: "",
            content: "",
            category: "General",
            status: "Draft",
            version: "1.0",
            effectiveDate: "",
        });
    };

    const handleCreate = () => {
        const newPolicy: Policy = {
            id: Date.now().toString(),
            ...formData,
            createdAt: new Date().toISOString().split("T")[0],
            updatedAt: new Date().toISOString().split("T")[0],
        };
        setPolicies([...policies, newPolicy]);
        setIsCreateDialogOpen(false);
        resetForm();
    };

    const handleEdit = (policy: Policy) => {
        setEditingPolicy(policy);
        setFormData({
            title: policy.title,
            description: policy.description,
            content: policy.content,
            category: policy.category,
            status: policy.status,
            version: policy.version,
            effectiveDate: policy.effectiveDate,
        });
        setIsEditDialogOpen(true);
    };

    const handleUpdate = () => {
        if (!editingPolicy) return;
        setPolicies(policies.map((policy) =>
            policy.id === editingPolicy.id 
                ? { ...policy, ...formData, updatedAt: new Date().toISOString().split("T")[0] }
                : policy
        ));
        setIsEditDialogOpen(false);
        setEditingPolicy(null);
        resetForm();
    };

    const handleDelete = (policyId: string) => {
        setPolicies(policies.filter((policy) => policy.id !== policyId));
    };

    const getCategoryLabel = (category: Policy["category"]) => {
        const labels = {
            Privacy: "Bảo mật",
            Terms: "Điều khoản",
            Refund: "Hoàn tiền", 
            Safety: "An toàn",
            General: "Chung"
        };
        return labels[category];
    };

    const getStatusLabel = (status: Policy["status"]) => {
        const labels = {
            Active: "Đang áp dụng",
            Draft: "Bản nháp",
            Archived: "Lưu trữ"
        };
        return labels[status];
    };

    return (
        <div className="flex flex-1 flex-col space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Quản lý Chính sách</h1>
                    <p className="text-muted-foreground">
                        Quản lý các chính sách và điều khoản của hệ thống
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tổng chính sách</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{policies.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Đang áp dụng</CardTitle>
                        <Shield className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {policies.filter((p) => p.status === "Active").length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Bản nháp</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {policies.filter((p) => p.status === "Draft").length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Lưu trữ</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {policies.filter((p) => p.status === "Archived").length}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Policy Management */}
            <Card>
                <CardContent>
                    <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                        {/* Search and Filters */}
                        <div className="flex flex-1 items-center space-x-2">
                            <div className="relative flex-1 max-w-sm">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Tìm kiếm chính sách..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                            {searchTerm && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSearchTerm("")}
                                    className="h-9 px-2 shrink-0"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            )}
                            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                <SelectTrigger className="w-[150px]">
                                    <SelectValue placeholder="Danh mục" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tất cả</SelectItem>
                                    <SelectItem value="Privacy">Bảo mật</SelectItem>
                                    <SelectItem value="Terms">Điều khoản</SelectItem>
                                    <SelectItem value="Refund">Hoàn tiền</SelectItem>
                                    <SelectItem value="Safety">An toàn</SelectItem>
                                    <SelectItem value="General">Chung</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-[150px]">
                                    <SelectValue placeholder="Trạng thái" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tất cả</SelectItem>
                                    <SelectItem value="Active">Đang áp dụng</SelectItem>
                                    <SelectItem value="Draft">Bản nháp</SelectItem>
                                    <SelectItem value="Archived">Lưu trữ</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Add Policy Button */}
                        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                            <DialogTrigger asChild>
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Thêm chính sách
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle>Thêm chính sách mới</DialogTitle>
                                    <DialogDescription>
                                        Tạo chính sách hoặc điều khoản mới cho hệ thống.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="title">Tiêu đề</Label>
                                        <Input
                                            id="title"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            placeholder="Nhập tiêu đề chính sách"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="description">Mô tả</Label>
                                        <Textarea
                                            id="description"
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            placeholder="Nhập mô tả ngắn gọn"
                                            rows={3}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="content">Nội dung</Label>
                                        <Textarea
                                            id="content"
                                            value={formData.content}
                                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                            placeholder="Nhập nội dung chi tiết của chính sách"
                                            rows={6}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="category">Danh mục</Label>
                                            <Select
                                                value={formData.category}
                                                onValueChange={(value: Policy["category"]) =>
                                                    setFormData({ ...formData, category: value })
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Chọn danh mục" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Privacy">Bảo mật</SelectItem>
                                                    <SelectItem value="Terms">Điều khoản</SelectItem>
                                                    <SelectItem value="Refund">Hoàn tiền</SelectItem>
                                                    <SelectItem value="Safety">An toàn</SelectItem>
                                                    <SelectItem value="General">Chung</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="status">Trạng thái</Label>
                                            <Select
                                                value={formData.status}
                                                onValueChange={(value: Policy["status"]) =>
                                                    setFormData({ ...formData, status: value })
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Chọn trạng thái" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Draft">Bản nháp</SelectItem>
                                                    <SelectItem value="Active">Đang áp dụng</SelectItem>
                                                    <SelectItem value="Archived">Lưu trữ</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="version">Phiên bản</Label>
                                            <Input
                                                id="version"
                                                value={formData.version}
                                                onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                                                placeholder="1.0"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="effectiveDate">Ngày có hiệu lực</Label>
                                            <Input
                                                id="effectiveDate"
                                                type="date"
                                                value={formData.effectiveDate}
                                                onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="submit" onClick={handleCreate}>
                                        Tạo chính sách
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardContent>
                
                {/* Policies Table */}
                <CardContent className="p-0">
                    <div className="rounded-md border">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b bg-muted/50">
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                        Tiêu đề
                                    </th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                        Danh mục
                                    </th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                        Trạng thái
                                    </th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                        Phiên bản
                                    </th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                        Ngày cập nhật
                                    </th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                        Thao tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPolicies.map((policy) => (
                                    <tr key={policy.id} className="border-b transition-colors hover:bg-muted/50">
                                        <td className="p-4 align-middle">
                                            <div>
                                                <div className="font-medium">{policy.title}</div>
                                                <div className="text-sm text-muted-foreground truncate max-w-xs">
                                                    {policy.description}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 align-middle">
                                            <Badge variant="outline">
                                                {getCategoryLabel(policy.category)}
                                            </Badge>
                                        </td>
                                        <td className="p-4 align-middle">
                                            <Badge 
                                                variant={
                                                    policy.status === "Active" ? "default" : 
                                                    policy.status === "Draft" ? "secondary" : "outline"
                                                }
                                            >
                                                {getStatusLabel(policy.status)}
                                            </Badge>
                                        </td>
                                        <td className="p-4 align-middle">{policy.version}</td>
                                        <td className="p-4 align-middle">{policy.updatedAt}</td>
                                        <td className="p-4 align-middle">
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleEdit(policy)}
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        if (window.confirm(`Bạn có chắc chắn muốn xóa chính sách "${policy.title}"?`)) {
                                                            handleDelete(policy.id);
                                                        }
                                                    }}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredPolicies.length === 0 && (
                            <div className="text-center py-8">
                                <p className="text-muted-foreground">Không tìm thấy chính sách nào</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
            
            {/* Edit Policy Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Chỉnh sửa chính sách</DialogTitle>
                        <DialogDescription>
                            Cập nhật thông tin chính sách.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-title">Tiêu đề</Label>
                            <Input
                                id="edit-title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="Nhập tiêu đề chính sách"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-description">Mô tả</Label>
                            <Textarea
                                id="edit-description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Nhập mô tả ngắn gọn"
                                rows={3}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-content">Nội dung</Label>
                            <Textarea
                                id="edit-content"
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                placeholder="Nhập nội dung chi tiết của chính sách"
                                rows={6}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-category">Danh mục</Label>
                                <Select
                                    value={formData.category}
                                    onValueChange={(value: Policy["category"]) =>
                                        setFormData({ ...formData, category: value })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Privacy">Bảo mật</SelectItem>
                                        <SelectItem value="Terms">Điều khoản</SelectItem>
                                        <SelectItem value="Refund">Hoàn tiền</SelectItem>
                                        <SelectItem value="Safety">An toàn</SelectItem>
                                        <SelectItem value="General">Chung</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-status">Trạng thái</Label>
                                <Select
                                    value={formData.status}
                                    onValueChange={(value: Policy["status"]) =>
                                        setFormData({ ...formData, status: value })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Draft">Bản nháp</SelectItem>
                                        <SelectItem value="Active">Đang áp dụng</SelectItem>
                                        <SelectItem value="Archived">Lưu trữ</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-version">Phiên bản</Label>
                                <Input
                                    id="edit-version"
                                    value={formData.version}
                                    onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                                    placeholder="1.0"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-effectiveDate">Ngày có hiệu lực</Label>
                                <Input
                                    id="edit-effectiveDate"
                                    type="date"
                                    value={formData.effectiveDate}
                                    onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" onClick={handleUpdate}>
                            Cập nhật
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
