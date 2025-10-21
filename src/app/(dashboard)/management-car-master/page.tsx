"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Pencil, Trash2, Search, X, Car, CreditCard } from "lucide-react";
import { useRequireAuth } from "@/hooks/auth/useRequireAuth";
import { UserRole } from "@/types/auth/user-role.enum";

// Types
interface Brand {
    id: string;
    name: string;
    country: string;
    status: "Active" | "Inactive";
    createdAt: string;
}

interface LicenseType {
    id: string;
    code: string;
    name: string;
    description: string;
    status: "Active" | "Inactive";
    createdAt: string;
}

// Mock data
const initialBrands: Brand[] = [
    {
        id: "1",
        name: "Honda",
        country: "Nhật Bản",
        status: "Active",
        createdAt: "2024-01-15",
    },
    {
        id: "2",
        name: "Toyota",
        country: "Nhật Bản",
        status: "Active",
        createdAt: "2024-01-20",
    },
    {
        id: "3",
        name: "VinFast",
        country: "Việt Nam",
        status: "Active",
        createdAt: "2024-02-01",
    },
    {
        id: "4",
        name: "Hyundai",
        country: "Hàn Quốc",
        status: "Active",
        createdAt: "2024-02-10",
    },
    {
        id: "5",
        name: "Kia",
        country: "Hàn Quốc",
        status: "Active",
        createdAt: "2024-02-15",
    },
    {
        id: "6",
        name: "Mazda",
        country: "Nhật Bản",
        status: "Inactive",
        createdAt: "2024-03-01",
    },
];

const initialLicenseTypes: LicenseType[] = [
    {
        id: "1",
        code: "A1",
        name: "Bằng lái A1",
        description: "Xe mô tô có dung tích xi-lanh từ 50 cm³ đến dưới 175 cm³",
        status: "Active",
        createdAt: "2024-01-15",
    },
    {
        id: "2",
        code: "A2",
        name: "Bằng lái A2",
        description: "Xe mô tô có dung tích xi-lanh từ 175 cm³ trở lên và các loại xe quy định cho A1",
        status: "Active",
        createdAt: "2024-01-15",
    },
    {
        id: "3",
        code: "B",
        name: "Bằng lái B",
        description: "Xe ô tô chở người đến 9 chỗ ngồi; xe ô tô tải có trọng tải thiết kế dưới 3.500kg",
        status: "Active",
        createdAt: "2024-01-15",
    },
    {
        id: "4",
        code: "C",
        name: "Bằng lái C",
        description: "Xe ô tô tải có trọng tải thiết kế từ 3.500kg trở lên",
        status: "Active",
        createdAt: "2024-01-15",
    },
    {
        id: "5",
        code: "D",
        name: "Bằng lái D",
        description: "Xe ô tô chở người từ 10 đến 30 chỗ ngồi",
        status: "Active",
        createdAt: "2024-01-15",
    },
    {
        id: "6",
        code: "E",
        name: "Bằng lái E",
        description: "Xe ô tô chở người trên 30 chỗ ngồi",
        status: "Active",
        createdAt: "2024-01-15",
    },
];

export default function ManagementCarMasterPage() {
    // useRequireAuth([UserRole.Admin, UserRole.Manager]);

    const [activeTab, setActiveTab] = useState("brands");
    
    // Brand states
    const [brands, setBrands] = useState<Brand[]>(initialBrands);
    const [brandSearchTerm, setBrandSearchTerm] = useState("");
    const [brandStatusFilter, setBrandStatusFilter] = useState<string>("all");
    const [isBrandCreateDialogOpen, setIsBrandCreateDialogOpen] = useState(false);
    const [isBrandEditDialogOpen, setIsBrandEditDialogOpen] = useState(false);
    const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
    const [brandFormData, setBrandFormData] = useState({
        name: "",
        country: "",
        status: "Active" as Brand["status"],
    });
    
    // License states
    const [licenseTypes, setLicenseTypes] = useState<LicenseType[]>(initialLicenseTypes);
    const [licenseSearchTerm, setLicenseSearchTerm] = useState("");
    const [licenseStatusFilter, setLicenseStatusFilter] = useState<string>("all");
    const [isLicenseCreateDialogOpen, setIsLicenseCreateDialogOpen] = useState(false);
    const [isLicenseEditDialogOpen, setIsLicenseEditDialogOpen] = useState(false);
    const [editingLicense, setEditingLicense] = useState<LicenseType | null>(null);
    const [licenseFormData, setLicenseFormData] = useState({
        code: "",
        name: "",
        description: "",
        status: "Active" as LicenseType["status"],
    });
    
    // Brand functions
    const filteredBrands = brands.filter((brand) => {
        const matchesSearch = brand.name.toLowerCase().includes(brandSearchTerm.toLowerCase()) ||
                            brand.country.toLowerCase().includes(brandSearchTerm.toLowerCase());
        const matchesStatus = brandStatusFilter === "all" || brand.status === brandStatusFilter;
        return matchesSearch && matchesStatus;
    });
    
    const resetBrandForm = () => {
        setBrandFormData({
            name: "",
            country: "",
            status: "Active",
        });
    };
    
    const handleCreateBrand = () => {
        const newBrand: Brand = {
            id: Date.now().toString(),
            ...brandFormData,
            createdAt: new Date().toISOString().split("T")[0],
        };
        setBrands([...brands, newBrand]);
        setIsBrandCreateDialogOpen(false);
        resetBrandForm();
    };
    
    const handleEditBrand = (brand: Brand) => {
        setEditingBrand(brand);
        setBrandFormData({
            name: brand.name,
            country: brand.country,
            status: brand.status,
        });
        setIsBrandEditDialogOpen(true);
    };
    
    const handleUpdateBrand = () => {
        if (!editingBrand) return;
        setBrands(brands.map((brand) =>
            brand.id === editingBrand.id ? { ...brand, ...brandFormData } : brand
        ));
        setIsBrandEditDialogOpen(false);
        setEditingBrand(null);
        resetBrandForm();
    };
    
    const handleDeleteBrand = (brandId: string) => {
        setBrands(brands.filter((brand) => brand.id !== brandId));
    };
    
    // License functions
    const filteredLicenseTypes = licenseTypes.filter((license) => {
        const matchesSearch = license.code.toLowerCase().includes(licenseSearchTerm.toLowerCase()) ||
                            license.name.toLowerCase().includes(licenseSearchTerm.toLowerCase()) ||
                            license.description.toLowerCase().includes(licenseSearchTerm.toLowerCase());
        const matchesStatus = licenseStatusFilter === "all" || license.status === licenseStatusFilter;
        return matchesSearch && matchesStatus;
    });
    
    const resetLicenseForm = () => {
        setLicenseFormData({
            code: "",
            name: "",
            description: "",
            status: "Active",
        });
    };
    
    const handleCreateLicense = () => {
        const newLicense: LicenseType = {
            id: Date.now().toString(),
            ...licenseFormData,
            createdAt: new Date().toISOString().split("T")[0],
        };
        setLicenseTypes([...licenseTypes, newLicense]);
        setIsLicenseCreateDialogOpen(false);
        resetLicenseForm();
    };
    
    const handleEditLicense = (license: LicenseType) => {
        setEditingLicense(license);
        setLicenseFormData({
            code: license.code,
            name: license.name,
            description: license.description,
            status: license.status,
        });
        setIsLicenseEditDialogOpen(true);
    };
    
    const handleUpdateLicense = () => {
        if (!editingLicense) return;
        setLicenseTypes(licenseTypes.map((license) =>
            license.id === editingLicense.id ? { ...license, ...licenseFormData } : license
        ));
        setIsLicenseEditDialogOpen(false);
        setEditingLicense(null);
        resetLicenseForm();
    };
    
    const handleDeleteLicense = (licenseId: string) => {
        setLicenseTypes(licenseTypes.filter((license) => license.id !== licenseId));
    };

    return (
        <div className="flex flex-1 flex-col space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Quản lý Master Data Xe</h1>
                    <p className="text-muted-foreground">
                        Quản lý thông tin cơ bản về thương hiệu xe và loại bằng lái
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="brands" className="flex items-center gap-2">
                        <Car className="h-4 w-4" />
                        Thương hiệu xe
                    </TabsTrigger>
                    <TabsTrigger value="licenses" className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        Loại bằng lái
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="brands" className="space-y-6">
                    {/* Stats Cards */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Tổng thương hiệu</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{brands.length}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Đang hoạt động</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {brands.filter((b) => b.status === "Active").length}
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Thương hiệu Nhật</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {brands.filter((b) => b.country === "Nhật Bản").length}
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Thương hiệu Việt</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {brands.filter((b) => b.country === "Việt Nam").length}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Brand Management */}
                    <Card>
                        <CardContent>
                            <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                                {/* Search Bar */}
                                <div className="flex flex-1 items-center space-x-2">
                                    <div className="relative flex-1 max-w-sm">
                                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            placeholder="Tìm kiếm thương hiệu..."
                                            value={brandSearchTerm}
                                            onChange={(e) => setBrandSearchTerm(e.target.value)}
                                            className="pl-9"
                                        />
                                    </div>
                                    {brandSearchTerm && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setBrandSearchTerm("")}
                                            className="h-9 px-2 shrink-0"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    )}
                                    <Select value={brandStatusFilter} onValueChange={setBrandStatusFilter}>
                                        <SelectTrigger className="w-[150px]">
                                            <SelectValue placeholder="Trạng thái" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Tất cả</SelectItem>
                                            <SelectItem value="Active">Hoạt động</SelectItem>
                                            <SelectItem value="Inactive">Không hoạt động</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Add Brand Button */}
                                <Dialog open={isBrandCreateDialogOpen} onOpenChange={setIsBrandCreateDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button>
                                            <Plus className="mr-2 h-4 w-4" />
                                            Thêm thương hiệu
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[500px]">
                                        <DialogHeader>
                                            <DialogTitle>Thêm thương hiệu mới</DialogTitle>
                                            <DialogDescription>
                                                Nhập thông tin thương hiệu xe mới.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="grid gap-4 py-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="brand-name">Tên thương hiệu</Label>
                                                <Input
                                                    id="brand-name"
                                                    value={brandFormData.name}
                                                    onChange={(e) => setBrandFormData({ ...brandFormData, name: e.target.value })}
                                                    placeholder="Nhập tên thương hiệu"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="brand-country">Quốc gia</Label>
                                                <Input
                                                    id="brand-country"
                                                    value={brandFormData.country}
                                                    onChange={(e) => setBrandFormData({ ...brandFormData, country: e.target.value })}
                                                    placeholder="Nhập quốc gia"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="brand-status">Trạng thái</Label>
                                                <Select
                                                    value={brandFormData.status}
                                                    onValueChange={(value: Brand["status"]) =>
                                                        setBrandFormData({ ...brandFormData, status: value })
                                                    }
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Chọn trạng thái" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Active">Hoạt động</SelectItem>
                                                        <SelectItem value="Inactive">Không hoạt động</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button type="submit" onClick={handleCreateBrand}>
                                                Tạo thương hiệu
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </CardContent>
                        
                        {/* Brands Table */}
                        <CardContent className="p-0">
                            <div className="rounded-md border">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b bg-muted/50">
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                                Tên thương hiệu
                                            </th>
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                                Quốc gia
                                            </th>
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                                Trạng thái
                                            </th>
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                                Ngày tạo
                                            </th>
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                                Thao tác
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredBrands.map((brand) => (
                                            <tr key={brand.id} className="border-b transition-colors hover:bg-muted/50">
                                                <td className="p-4 align-middle font-medium">{brand.name}</td>
                                                <td className="p-4 align-middle">{brand.country}</td>
                                                <td className="p-4 align-middle">
                                                    <Badge variant={brand.status === "Active" ? "default" : "secondary"}>
                                                        {brand.status === "Active" ? "Hoạt động" : "Không hoạt động"}
                                                    </Badge>
                                                </td>
                                                <td className="p-4 align-middle">{brand.createdAt}</td>
                                                <td className="p-4 align-middle">
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleEditBrand(brand)}
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => {
                                                                if (window.confirm(`Bạn có chắc chắn muốn xóa thương hiệu "${brand.name}"?`)) {
                                                                    handleDeleteBrand(brand.id);
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
                                {filteredBrands.length === 0 && (
                                    <div className="text-center py-8">
                                        <p className="text-muted-foreground">Không tìm thấy thương hiệu nào</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                    
                    {/* Edit Brand Dialog */}
                    <Dialog open={isBrandEditDialogOpen} onOpenChange={setIsBrandEditDialogOpen}>
                        <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                                <DialogTitle>Chỉnh sửa thương hiệu</DialogTitle>
                                <DialogDescription>
                                    Cập nhật thông tin thương hiệu xe.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="edit-brand-name">Tên thương hiệu</Label>
                                    <Input
                                        id="edit-brand-name"
                                        value={brandFormData.name}
                                        onChange={(e) => setBrandFormData({ ...brandFormData, name: e.target.value })}
                                        placeholder="Nhập tên thương hiệu"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-brand-country">Quốc gia</Label>
                                    <Input
                                        id="edit-brand-country"
                                        value={brandFormData.country}
                                        onChange={(e) => setBrandFormData({ ...brandFormData, country: e.target.value })}
                                        placeholder="Nhập quốc gia"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-brand-status">Trạng thái</Label>
                                    <Select
                                        value={brandFormData.status}
                                        onValueChange={(value: Brand["status"]) =>
                                            setBrandFormData({ ...brandFormData, status: value })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Active">Hoạt động</SelectItem>
                                            <SelectItem value="Inactive">Không hoạt động</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" onClick={handleUpdateBrand}>
                                    Cập nhật
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </TabsContent>

                <TabsContent value="licenses" className="space-y-6">
                    {/* Stats Cards */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Tổng loại bằng</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{licenseTypes.length}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Đang hoạt động</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {licenseTypes.filter((l) => l.status === "Active").length}
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Bằng mô tô</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {licenseTypes.filter((l) => l.code.startsWith("A")).length}
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Bằng ô tô</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {licenseTypes.filter((l) => ["B", "C", "D", "E"].includes(l.code)).length}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* License Management */}
                    <Card>
                        <CardContent>
                            <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                                {/* Search Bar */}
                                <div className="flex flex-1 items-center space-x-2">
                                    <div className="relative flex-1 max-w-sm">
                                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            placeholder="Tìm kiếm loại bằng lái..."
                                            value={licenseSearchTerm}
                                            onChange={(e) => setLicenseSearchTerm(e.target.value)}
                                            className="pl-9"
                                        />
                                    </div>
                                    {licenseSearchTerm && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setLicenseSearchTerm("")}
                                            className="h-9 px-2 shrink-0"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    )}
                                    <Select value={licenseStatusFilter} onValueChange={setLicenseStatusFilter}>
                                        <SelectTrigger className="w-[150px]">
                                            <SelectValue placeholder="Trạng thái" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Tất cả</SelectItem>
                                            <SelectItem value="Active">Hoạt động</SelectItem>
                                            <SelectItem value="Inactive">Không hoạt động</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Add License Button */}
                                <Dialog open={isLicenseCreateDialogOpen} onOpenChange={setIsLicenseCreateDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button>
                                            <Plus className="mr-2 h-4 w-4" />
                                            Thêm loại bằng
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[500px]">
                                        <DialogHeader>
                                            <DialogTitle>Thêm loại bằng lái mới</DialogTitle>
                                            <DialogDescription>
                                                Nhập thông tin loại bằng lái mới.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="grid gap-4 py-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="license-code">Mã bằng</Label>
                                                <Input
                                                    id="license-code"
                                                    value={licenseFormData.code}
                                                    onChange={(e) => setLicenseFormData({ ...licenseFormData, code: e.target.value })}
                                                    placeholder="Nhập mã bằng (VD: A1, B, C...)"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="license-name">Tên bằng</Label>
                                                <Input
                                                    id="license-name"
                                                    value={licenseFormData.name}
                                                    onChange={(e) => setLicenseFormData({ ...licenseFormData, name: e.target.value })}
                                                    placeholder="Nhập tên bằng lái"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="license-description">Mô tả</Label>
                                                <Input
                                                    id="license-description"
                                                    value={licenseFormData.description}
                                                    onChange={(e) => setLicenseFormData({ ...licenseFormData, description: e.target.value })}
                                                    placeholder="Nhập mô tả chi tiết"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="license-status">Trạng thái</Label>
                                                <Select
                                                    value={licenseFormData.status}
                                                    onValueChange={(value: LicenseType["status"]) =>
                                                        setLicenseFormData({ ...licenseFormData, status: value })
                                                    }
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Chọn trạng thái" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Active">Hoạt động</SelectItem>
                                                        <SelectItem value="Inactive">Không hoạt động</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button type="submit" onClick={handleCreateLicense}>
                                                Tạo loại bằng
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </CardContent>
                        
                        {/* License Types Table */}
                        <CardContent className="p-0">
                            <div className="rounded-md border">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b bg-muted/50">
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                                Mã bằng
                                            </th>
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                                Tên bằng
                                            </th>
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                                Mô tả
                                            </th>
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                                Trạng thái
                                            </th>
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                                Ngày tạo
                                            </th>
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                                Thao tác
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredLicenseTypes.map((license) => (
                                            <tr key={license.id} className="border-b transition-colors hover:bg-muted/50">
                                                <td className="p-4 align-middle font-medium">{license.code}</td>
                                                <td className="p-4 align-middle">{license.name}</td>
                                                <td className="p-4 align-middle max-w-xs truncate" title={license.description}>
                                                    {license.description}
                                                </td>
                                                <td className="p-4 align-middle">
                                                    <Badge variant={license.status === "Active" ? "default" : "secondary"}>
                                                        {license.status === "Active" ? "Hoạt động" : "Không hoạt động"}
                                                    </Badge>
                                                </td>
                                                <td className="p-4 align-middle">{license.createdAt}</td>
                                                <td className="p-4 align-middle">
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleEditLicense(license)}
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => {
                                                                if (window.confirm(`Bạn có chắc chắn muốn xóa loại bằng "${license.name}"?`)) {
                                                                    handleDeleteLicense(license.id);
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
                                {filteredLicenseTypes.length === 0 && (
                                    <div className="text-center py-8">
                                        <p className="text-muted-foreground">Không tìm thấy loại bằng lái nào</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                    
                    {/* Edit License Dialog */}
                    <Dialog open={isLicenseEditDialogOpen} onOpenChange={setIsLicenseEditDialogOpen}>
                        <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                                <DialogTitle>Chỉnh sửa loại bằng lái</DialogTitle>
                                <DialogDescription>
                                    Cập nhật thông tin loại bằng lái.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="edit-license-code">Mã bằng</Label>
                                    <Input
                                        id="edit-license-code"
                                        value={licenseFormData.code}
                                        onChange={(e) => setLicenseFormData({ ...licenseFormData, code: e.target.value })}
                                        placeholder="Nhập mã bằng (VD: A1, B, C...)"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-license-name">Tên bằng</Label>
                                    <Input
                                        id="edit-license-name"
                                        value={licenseFormData.name}
                                        onChange={(e) => setLicenseFormData({ ...licenseFormData, name: e.target.value })}
                                        placeholder="Nhập tên bằng lái"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-license-description">Mô tả</Label>
                                    <Input
                                        id="edit-license-description"
                                        value={licenseFormData.description}
                                        onChange={(e) => setLicenseFormData({ ...licenseFormData, description: e.target.value })}
                                        placeholder="Nhập mô tả chi tiết"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-license-status">Trạng thái</Label>
                                    <Select
                                        value={licenseFormData.status}
                                        onValueChange={(value: LicenseType["status"]) =>
                                            setLicenseFormData({ ...licenseFormData, status: value })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Active">Hoạt động</SelectItem>
                                            <SelectItem value="Inactive">Không hoạt động</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" onClick={handleUpdateLicense}>
                                    Cập nhật
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </TabsContent>
            </Tabs>
        </div>
    );
}
