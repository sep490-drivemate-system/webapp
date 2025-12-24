"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Package as PackageIcon,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { PackageFormDialog } from "@/components/package/PackageFormDialog";
import { PackageViewDialog } from "@/components/package/PackageViewDialog";
import PageHeader from "@/components/commons/Header/header";
import { useThunkAction } from "@/lib/redux/useThunkAction";
import {
  getRoadTypes,
  createRoadType,
  updateRoadType,
  deleteRoadType,
  getDrivingSkills,
  createDrivingSkill,
  updateDrivingSkill,
  deleteDrivingSkill,
  getListPackages,
} from "@/features/package/packageThunk";
import {
  RoadType,
  DrivingSkill,
  Package as ServicePackage,
} from "@/types/package/package.type";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export interface PackageType {
  id: string;
  instructorId: string;
  instructorName: string;
  instructorAvatar: string;
  packageName: string;
  totalHours: number;
  usedHours: number;
  pendingHours: number;
  remainingHours: number;
  pricePerHour: number;
  totalPrice: number;
  hasVehicle: boolean;
  vehicleType: string | null;
  vehiclePlate: string | null;
  skills: string[];
  status: "active" | "completed" | "expired" | "cancelled";
  purchaseDate: string;
  expiryDate: string;
  sessions: any[];
}

export default function ManagementPackagePage() {
  const [servicePackages, setServicePackages] = useState<ServicePackage[]>([]);
  const [packageTotalCount, setPackageTotalCount] = useState(0);
  const [packageTotalCountAll, setPackageTotalCountAll] = useState(0);
  const [packageListLoading, setPackageListLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [vehicleFilter, setVehicleFilter] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isServiceViewOpen, setIsServiceViewOpen] = useState(false);
  const [selectedServicePackage, setSelectedServicePackage] =
    useState<ServicePackage | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<PackageType | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [roadTypes, setRoadTypes] = useState<RoadType[]>([]);
  const [drivingSkills, setDrivingSkills] = useState<DrivingSkill[]>([]);
  const [roadCurrentPage, setRoadCurrentPage] = useState(1);
  const [roadItemsPerPage, setRoadItemsPerPage] = useState(8);
  const { run: fetchRoadTypes, loading: loadingRoadTypes } =
    useThunkAction(getRoadTypes);
  const { run: fetchDrivingSkills, loading: loadingDrivingSkills } =
    useThunkAction(getDrivingSkills);
  const { run: fetchPackages } = useThunkAction(getListPackages);
  const { run: createRoadTypeAction, loading: creatingRoadType } =
    useThunkAction(createRoadType);
  const { run: updateRoadTypeAction, loading: updatingRoadType } =
    useThunkAction(updateRoadType);
  const { run: deleteRoadTypeAction, loading: deletingRoadType } =
    useThunkAction(deleteRoadType);
  const { run: createDrivingSkillAction, loading: creatingDrivingSkill } =
    useThunkAction(createDrivingSkill);
  const { run: updateDrivingSkillAction, loading: updatingDrivingSkill } =
    useThunkAction(updateDrivingSkill);
  const { run: deleteDrivingSkillAction, loading: deletingDrivingSkill } =
    useThunkAction(deleteDrivingSkill);
  const [isRoadTypeModalOpen, setIsRoadTypeModalOpen] = useState(false);
  const [editingRoadType, setEditingRoadType] = useState<RoadType | null>(null);
  const [roadTypeName, setRoadTypeName] = useState("");
  const [isDeleteRoadTypeDialogOpen, setIsDeleteRoadTypeDialogOpen] =
    useState(false);
  const [roadTypeToDelete, setRoadTypeToDelete] = useState<RoadType | null>(
    null
  );
  const [isDrivingSkillModalOpen, setIsDrivingSkillModalOpen] = useState(false);
  const [editingDrivingSkill, setEditingDrivingSkill] =
    useState<DrivingSkill | null>(null);
  const [drivingSkillName, setDrivingSkillName] = useState("");
  const [isDeleteDrivingSkillDialogOpen, setIsDeleteDrivingSkillDialogOpen] =
    useState(false);
  const [drivingSkillToDelete, setDrivingSkillToDelete] =
    useState<DrivingSkill | null>(null);
  const [skillCurrentPage, setSkillCurrentPage] = useState(1);
  const [skillItemsPerPage, setSkillItemsPerPage] = useState(8);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, vehicleFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(packageTotalCount / itemsPerPage)
  );
  const startIndex = (currentPage - 1) * itemsPerPage;

  useEffect(() => {
    fetchPackages(
      {
        pageNumber: 1,
        pageSize: 1,
      },
      {
        onSuccess: (response) => {
          setPackageTotalCountAll(response?.value?.totalCount ?? 0);
        },
        onError: (error) => {
          console.error("Error fetching total packages:", error);
        },
      }
    );
  }, [fetchPackages]);

  useEffect(() => {
    setPackageListLoading(true);

    const normalizedSearchKey =
      searchQuery.trim() !== "" ? searchQuery.trim().toLocaleLowerCase() : undefined;

    fetchPackages(
      {
        pageNumber: currentPage,
        pageSize: itemsPerPage,
        searchKey: normalizedSearchKey,
      },
      {
        onSuccess: (response) => {
          let pageContent = response?.value?.pageContent ?? [];

          if (vehicleFilter === "with") {
            pageContent = pageContent.filter(
              (pkg: any) => pkg.isRentalCar === true
            );
          } else if (vehicleFilter === "without") {
            pageContent = pageContent.filter(
              (pkg: any) => pkg.isRentalCar === false
            );
          }

          setServicePackages(pageContent);
          setPackageTotalCount(response?.value?.totalCount ?? 0);
        },
        onError: (error) => {
          console.error("Error fetching packages:", error);
        },
        onFinally: () => {
          setPackageListLoading(false);
        },
      }
    );
  }, [fetchPackages, currentPage, itemsPerPage, searchQuery, vehicleFilter]);

  const roadTotalPages = Math.max(
    1,
    Math.ceil(roadTypes.length / roadItemsPerPage)
  );
  const roadStartIndex = (roadCurrentPage - 1) * roadItemsPerPage;
  const paginatedRoadTypes = useMemo(
    () => roadTypes.slice(roadStartIndex, roadStartIndex + roadItemsPerPage),
    [roadTypes, roadStartIndex, roadItemsPerPage]
  );

  const skillTotalPages = Math.max(
    1,
    Math.ceil(drivingSkills.length / skillItemsPerPage)
  );
  const skillStartIndex = (skillCurrentPage - 1) * skillItemsPerPage;
  const paginatedDrivingSkills = useMemo(
    () =>
      drivingSkills.slice(skillStartIndex, skillStartIndex + skillItemsPerPage),
    [drivingSkills, skillStartIndex, skillItemsPerPage]
  );

  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;
  const canGoPreviousRoad = roadCurrentPage > 1;
  const canGoNextRoad = roadCurrentPage < roadTotalPages;
  const canGoPreviousSkill = skillCurrentPage > 1;
  const canGoNextSkill = skillCurrentPage < skillTotalPages;

  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToPreviousPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const goToFirstRoadPage = () => setRoadCurrentPage(1);
  const goToLastRoadPage = () => setRoadCurrentPage(roadTotalPages);
  const goToPreviousRoadPage = () =>
    setRoadCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToNextRoadPage = () =>
    setRoadCurrentPage((prev) => Math.min(prev + 1, roadTotalPages));

  const goToFirstSkillPage = () => setSkillCurrentPage(1);
  const goToLastSkillPage = () => setSkillCurrentPage(skillTotalPages);
  const goToPreviousSkillPage = () =>
    setSkillCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToNextSkillPage = () =>
    setSkillCurrentPage((prev) => Math.min(prev + 1, skillTotalPages));

  const handleCreatePackage = (newPackage: PackageType) => {
    setIsCreateDialogOpen(false);
  };

  const handleEditPackage = (updatedPackage: PackageType) => {
    setIsEditDialogOpen(false);
    setSelectedPackage(null);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount);
  };

  useEffect(() => {
    fetchRoadTypes(undefined, {
      onSuccess: (response) => {
        setRoadTypes(response?.value ?? []);
      },
      onError: (error) => {
        console.error("Error fetching road types:", error);
      },
    });
  }, [fetchRoadTypes]);

  useEffect(() => {
    setRoadCurrentPage(1);
  }, [roadTypes.length]);

  useEffect(() => {
    fetchDrivingSkills(undefined, {
      onSuccess: (response) => {
        setDrivingSkills(response?.value ?? []);
      },
      onError: (error) => {
        console.error("Error fetching driving skills:", error);
      },
    });
  }, [fetchDrivingSkills]);

  useEffect(() => {
    setSkillCurrentPage(1);
  }, [drivingSkills.length]);

  const handleOpenCreateRoadType = () => {
    setEditingRoadType(null);
    setRoadTypeName("");
    setIsRoadTypeModalOpen(true);
  };

  const handleOpenEditRoadType = (roadType: RoadType) => {
    setEditingRoadType(roadType);
    setRoadTypeName(roadType.name);
    setIsRoadTypeModalOpen(true);
  };

  const handleSubmitRoadType = async () => {
    const trimmedName = roadTypeName.trim();
    if (!trimmedName) {
      alert("Vui lòng nhập tên loại đường");
      return;
    }

    if (editingRoadType) {
      await updateRoadTypeAction(
        { id: editingRoadType.id, name: trimmedName },
        {
          onSuccess: () => {
            fetchRoadTypes(undefined, {
              onSuccess: (res) => {
                setRoadTypes(res?.value ?? []);
              },
            });
            setIsRoadTypeModalOpen(false);
            setEditingRoadType(null);
            setRoadTypeName("");
          },
          onError: (error) => {
            console.error("Error updating road type:", error);
            alert("Có lỗi xảy ra khi cập nhật loại đường. Vui lòng thử lại.");
          },
        }
      );
    } else {
      await createRoadTypeAction(
        { name: trimmedName },
        {
          onSuccess: () => {
            fetchRoadTypes(undefined, {
              onSuccess: (res) => {
                setRoadTypes(res?.value ?? []);
              },
            });
            setIsRoadTypeModalOpen(false);
            setRoadTypeName("");
          },
          onError: (error) => {
            console.error("Error creating road type:", error);
            alert("Có lỗi xảy ra khi tạo loại đường. Vui lòng thử lại.");
          },
        }
      );
    }
  };

  const handleConfirmDeleteRoadType = async () => {
    if (!roadTypeToDelete) return;

    await deleteRoadTypeAction(
      { id: roadTypeToDelete.id },
      {
        onSuccess: () => {
          fetchRoadTypes(undefined, {
            onSuccess: (res) => {
              setRoadTypes(res?.value ?? []);
            },
          });
          setIsDeleteRoadTypeDialogOpen(false);
          setRoadTypeToDelete(null);
        },
        onError: (error) => {
          console.error("Error deleting road type:", error);
          alert("Có lỗi xảy ra khi xóa loại đường. Vui lòng thử lại.");
        },
      }
    );
  };

  const handleOpenCreateDrivingSkill = () => {
    setEditingDrivingSkill(null);
    setDrivingSkillName("");
    setIsDrivingSkillModalOpen(true);
  };

  const handleOpenEditDrivingSkill = (skill: DrivingSkill) => {
    setEditingDrivingSkill(skill);
    setDrivingSkillName(skill.display_name);
    setIsDrivingSkillModalOpen(true);
  };

  const handleSubmitDrivingSkill = async () => {
    const trimmedName = drivingSkillName.trim();
    if (!trimmedName) {
      alert("Vui lòng nhập tên loại kỹ năng");
      return;
    }

    if (editingDrivingSkill) {
      await updateDrivingSkillAction(
        { id: editingDrivingSkill.id, name: trimmedName },
        {
          onSuccess: () => {
            fetchDrivingSkills(undefined, {
              onSuccess: (res) => {
                setDrivingSkills(res?.value ?? []);
              },
            });
            setIsDrivingSkillModalOpen(false);
            setEditingDrivingSkill(null);
            setDrivingSkillName("");
          },
          onError: (error) => {
            console.error("Error updating driving skill:", error);
            alert("Có lỗi xảy ra khi cập nhật loại kỹ năng. Vui lòng thử lại.");
          },
        }
      );
    } else {
      await createDrivingSkillAction(
        { name: trimmedName },
        {
          onSuccess: () => {
            fetchDrivingSkills(undefined, {
              onSuccess: (res) => {
                setDrivingSkills(res?.value ?? []);
              },
            });
            setIsDrivingSkillModalOpen(false);
            setDrivingSkillName("");
          },
          onError: (error) => {
            console.error("Error creating driving skill:", error);
            alert("Có lỗi xảy ra khi tạo loại kỹ năng. Vui lòng thử lại.");
          },
        }
      );
    }
  };

  const handleConfirmDeleteDrivingSkill = async () => {
    if (!drivingSkillToDelete) return;

    await deleteDrivingSkillAction(
      { id: drivingSkillToDelete.id },
      {
        onSuccess: () => {
          fetchDrivingSkills(undefined, {
            onSuccess: (res) => {
              setDrivingSkills(res?.value ?? []);
            },
          });
          setIsDeleteDrivingSkillDialogOpen(false);
          setDrivingSkillToDelete(null);
        },
        onError: (error) => {
          console.error("Error deleting driving skill:", error);
          alert("Có lỗi xảy ra khi xóa loại kỹ năng. Vui lòng thử lại.");
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quản Lý Gói Dịch Vụ"
        description="Quản lý và theo dõi tất cả các gói dịch vụ trong hệ thống."
      />

      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Thống kê gói dịch vụ & buổi huấn luyện</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-end justify-between gap-4">
                <div className="space-y-1">
                  <CardDescription className="text-sm font-medium">
                    Tổng số gói dịch vụ
                  </CardDescription>
                  <CardTitle className="text-2xl font-semibold">
                    {packageTotalCountAll}
                  </CardTitle>
                </div>
                <span className="rounded-xl p-3 bg-blue-50 text-blue-600">
                  <PackageIcon className="size-5" />
                </span>
              </CardHeader>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm theo tên gói dịch vụ, người hướng dẫn..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div>
                  <Select
                    value={vehicleFilter}
                    onValueChange={setVehicleFilter}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tất cả tùy chọn xe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả tùy chọn xe</SelectItem>
                      <SelectItem value="with">Kèm thuê xe</SelectItem>
                      <SelectItem value="without">Không kèm thuê xe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
      
              </div>
            </div>
          </div>
        </CardContent>
        <CardContent className="pt-0">
          <div className="rounded-2xl border">
            <div className="overflow-x-auto rounded-2xl">
              <Table className="w-full text-left text-sm">
                <TableHeader className="bg-muted/60 text-xs uppercase text-muted-foreground">
                  <TableRow>
                    <TableHead className="px-4 py-3 font-semibold">
                      STT
                    </TableHead>
                    <TableHead className="px-4 py-3 font-semibold">
                      Tên gói dịch vụ
                    </TableHead>
                    <TableHead className="px-4 py-3 font-semibold">
                      Giá
                    </TableHead>
                    <TableHead className="px-4 py-3 font-semibold">
                      Người hướng dẫn
                    </TableHead>
                    <TableHead className="px-4 py-3 font-semibold">
                      Xe
                    </TableHead>
                    <TableHead className="px-4 py-3 font-semibold text-center">
                      Thao tác
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {packageListLoading ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="px-4 py-8 text-center text-sm text-muted-foreground"
                      >
                        Đang tải danh sách gói dịch vụ...
                      </TableCell>
                    </TableRow>
                  ) : servicePackages.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="px-4 py-8 text-center text-sm text-muted-foreground"
                      >
                        Không tìm thấy gói học phù hợp.
                      </TableCell>
                    </TableRow>
                  ) : (
                    servicePackages.map((pkg, index) => (
                      <TableRow
                        key={pkg.id}
                        className="border-b last:border-b-0 hover:bg-muted/50"
                      >
                        <TableCell className="px-4 py-3 text-sm font-semibold text-muted-foreground">
                          {startIndex + index + 1}
                        </TableCell>
                        <TableCell className="px-4 py-3">
                          <div className="font-medium">{pkg.name}</div>
                        </TableCell>
                        <TableCell className="px-4 py-3">
                          <div className="text-sm">
                            <div className="font-medium">
                              {formatCurrency(pkg.price)} VNĐ
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={pkg.instructorAvatar} />
                              <AvatarFallback>
                                {pkg.instructorName?.[0] ?? "N/A"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium">
                                {pkg.instructorName}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3">
                          <span className="text-sm">
                            {(pkg as any).isRentalCar ?? !pkg.isRentalCar
                              ? "Kèm thuê xe"
                              : "Không kèm thuê xe"}
                          </span>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-center">
                          <Button
                            variant="outline"
                            size="icon"
                            aria-label="Xem chi tiết"
                            onClick={() => {
                              setSelectedServicePackage(pkg);
                              setIsServiceViewOpen(true);
                            }}
                          >
                            <Eye className="size-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
          <div className="mt-6 flex flex-col gap-4 rounded-2xl bg-muted/20 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-xs text-muted-foreground sm:text-sm">
              Hiển thị {servicePackages.length}/{packageTotalCount} gói học.
            </div>
            <div className="flex flex-col items-center gap-4 sm:flex-row">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Số hàng</span>
                <Select
                  value={`${itemsPerPage}`}
                  onValueChange={(value) => setItemsPerPage(Number(value))}
                >
                  <SelectTrigger className="h-8 w-20 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent side="top">
                    {[5, 10, 20, 30, 50].map((size) => (
                      <SelectItem key={size} value={`${size}`}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="hidden sm:flex"
                  onClick={goToFirstPage}
                  disabled={!canGoPrevious}
                >
                  <ChevronsLeft className="size-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={goToPreviousPage}
                  disabled={!canGoPrevious}
                >
                  <ChevronLeft className="size-4" />
                </Button>
                <span className="text-sm font-medium">
                  Trang {currentPage}/{totalPages}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={goToNextPage}
                  disabled={!canGoNext}
                >
                  <ChevronRight className="size-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="hidden sm:flex"
                  onClick={goToLastPage}
                  disabled={!canGoNext}
                >
                  <ChevronsRight className="size-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div>
            <CardTitle>Danh sách loại đường</CardTitle>
            <CardDescription>
              Quản lý các loại đường áp dụng cho gói dịch vụ.
            </CardDescription>
          </div>
          <Button
            size="sm"
            className="inline-flex items-center gap-2"
            onClick={handleOpenCreateRoadType}
          >
            <Plus className="h-4 w-4" />
            Thêm loại đường
          </Button>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="rounded-2xl border">
            <div className="overflow-x-auto rounded-2xl">
              <Table className="w-full text-left text-sm">
                <TableHeader className="bg-muted/60 text-xs uppercase text-muted-foreground">
                  <TableRow>
                    <TableHead className="px-4 py-3 font-semibold">
                      STT
                    </TableHead>
                    <TableHead className="px-4 py-3 font-semibold">
                      Tên loại đường
                    </TableHead>
                    <TableHead className="px-4 py-3 font-semibold text-center">
                      Thao tác
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingRoadTypes ? (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="px-4 py-6 text-center text-sm text-muted-foreground"
                      >
                        Đang tải danh sách loại đường...
                      </TableCell>
                    </TableRow>
                  ) : roadTypes.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="px-4 py-6 text-center text-sm text-muted-foreground"
                      >
                        Chưa có loại đường nào.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedRoadTypes.map((roadType: RoadType, index: number) => (
                      <TableRow key={roadType.id}>
                        <TableCell className="px-4 py-3 text-sm font-semibold text-muted-foreground">
                          {roadStartIndex + index + 1}
                        </TableCell>
                        <TableCell className="px-4 py-3">
                          <div className="font-medium">{roadType.name}</div>
                          {roadType.description && (
                            <div className="text-xs text-muted-foreground">
                              {roadType.description}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="px-4 py-3">
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleOpenEditRoadType(roadType)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 text-red-600"
                              onClick={() => {
                                setRoadTypeToDelete(roadType);
                                setIsDeleteRoadTypeDialogOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {!loadingRoadTypes && roadTypes.length > 0 && (
            <div className="mt-4 flex flex-col gap-4 rounded-2xl bg-muted/20 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-xs text-muted-foreground sm:text-sm">
                Hiển thị {paginatedRoadTypes.length}/{roadTypes.length} loại
                đường.
              </div>
              <div className="flex flex-col items-center gap-4 sm:flex-row">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Số hàng</span>
                  <Select
                    value={`${roadItemsPerPage}`}
                    onValueChange={(value) => {
                      setRoadItemsPerPage(Number(value));
                      setRoadCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="h-8 w-20 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent side="top">
                      {[5, 8, 10, 20, 30].map((size) => (
                        <SelectItem key={size} value={`${size}`}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="hidden sm:flex"
                    onClick={goToFirstRoadPage}
                    disabled={!canGoPreviousRoad}
                  >
                    <ChevronsLeft className="size-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={goToPreviousRoadPage}
                    disabled={!canGoPreviousRoad}
                  >
                    <ChevronLeft className="size-4" />
                  </Button>
                  <span className="text-sm font-medium">
                    Trang {roadCurrentPage}/{roadTotalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={goToNextRoadPage}
                    disabled={!canGoNextRoad}
                  >
                    <ChevronRight className="size-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="hidden sm:flex"
                    onClick={goToLastRoadPage}
                    disabled={!canGoNextRoad}
                  >
                    <ChevronsRight className="size-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div>
            <CardTitle>Danh sách loại kỹ năng</CardTitle>
            <CardDescription>
              Quản lý các loại kỹ năng áp dụng cho gói dịch vụ.
            </CardDescription>
          </div>
          <Button
            size="sm"
            className="inline-flex items-center gap-2"
            onClick={handleOpenCreateDrivingSkill}
          >
            <Plus className="h-4 w-4" />
            Thêm loại kỹ năng
          </Button>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="rounded-2xl border">
            <div className="overflow-x-auto rounded-2xl">
              <Table className="w-full text-left text-sm">
                <TableHeader className="bg-muted/60 text-xs uppercase text-muted-foreground">
                  <TableRow>
                    <TableHead className="px-4 py-3 font-semibold">
                      STT
                    </TableHead>
                    <TableHead className="px-4 py-3 font-semibold">
                      Tên loại kỹ năng
                    </TableHead>
                    <TableHead className="px-4 py-3 font-semibold text-center">
                      Thao tác
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingDrivingSkills ? (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="px-4 py-6 text-center text-sm text-muted-foreground"
                      >
                        Đang tải danh sách loại kỹ năng...
                      </TableCell>
                    </TableRow>
                  ) : drivingSkills.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="px-4 py-6 text-center text-sm text-muted-foreground"
                      >
                        Chưa có loại kỹ năng nào.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedDrivingSkills.map((skill: DrivingSkill, index: number) => (
                      <TableRow key={skill.id}>
                        <TableCell className="px-4 py-3 text-sm font-semibold text-muted-foreground">
                          {skillStartIndex + index + 1}
                        </TableCell>
                        <TableCell className="px-4 py-3">
                          <div className="font-medium">
                            {skill.display_name}
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3">
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleOpenEditDrivingSkill(skill)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 text-red-600"
                              onClick={() => {
                                setDrivingSkillToDelete(skill);
                                setIsDeleteDrivingSkillDialogOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {!loadingDrivingSkills && drivingSkills.length > 0 && (
            <div className="mt-4 flex flex-col gap-4 rounded-2xl bg-muted/20 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-xs text-muted-foreground sm:text-sm">
                Hiển thị {paginatedDrivingSkills.length}/
                {drivingSkills.length} loại kỹ năng.
              </div>
              <div className="flex flex-col items-center gap-4 sm:flex-row">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Số hàng</span>
                  <Select
                    value={`${skillItemsPerPage}`}
                    onValueChange={(value) => {
                      setSkillItemsPerPage(Number(value));
                      setSkillCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="h-8 w-20 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent side="top">
                      {[5, 8, 10, 20, 30].map((size) => (
                        <SelectItem key={size} value={`${size}`}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="hidden sm:flex"
                    onClick={goToFirstSkillPage}
                    disabled={!canGoPreviousSkill}
                  >
                    <ChevronsLeft className="size-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={goToPreviousSkillPage}
                    disabled={!canGoPreviousSkill}
                  >
                    <ChevronLeft className="size-4" />
                  </Button>
                  <span className="text-sm font-medium">
                    Trang {skillCurrentPage}/{skillTotalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={goToNextSkillPage}
                    disabled={!canGoNextSkill}
                  >
                    <ChevronRight className="size-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="hidden sm:flex"
                    onClick={goToLastSkillPage}
                    disabled={!canGoNextSkill}
                  >
                    <ChevronsRight className="size-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isServiceViewOpen} onOpenChange={setIsServiceViewOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          {selectedServicePackage && (
            <div className="space-y-6">
              <DialogHeader className="space-y-2">
                <DialogTitle className="text-2xl">
                  {selectedServicePackage.name}
                </DialogTitle>
                <DialogDescription>
                  Thông tin chi tiết gói dịch vụ và người hướng dẫn phụ trách.
                </DialogDescription>
              </DialogHeader>

              <div className="flex flex-col gap-4 rounded-2xl border bg-muted/40 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-14 w-14">
                    <AvatarImage src={selectedServicePackage.instructorAvatar} />
                    <AvatarFallback>
                      {selectedServicePackage.instructorName?.[0] ?? "GV"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <div className="text-base text-muted-foreground">
                      Người hướng dẫn
                    </div>
                    <div className="text-lg font-semibold">
                      {selectedServicePackage.instructorName}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-1">
                <Card className="md:col-span-2">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-muted-foreground">
                      Giá & thời lượng
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-3">
                    <div className="text-3xl font-bold text-primary">
                      {formatCurrency(selectedServicePackage.price)} VNĐ
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="secondary" className="rounded-full px-3 py-1">
                        {(selectedServicePackage as any).isRentalCar ??
                        !selectedServicePackage.isRentalCar
                          ? "Kèm thuê xe"
                          : "Không kèm thuê xe"}
                      </Badge>
                      <Badge variant="outline" className="rounded-full px-3 py-1">
                        <Clock className="mr-1 h-4 w-4" />
                        {selectedServicePackage.duration} giờ
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="rounded-2xl border p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <PackageIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="font-semibold">Số lượng đã mua</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="rounded-full px-4 py-2 text-base">
                    {selectedServicePackage.bookingCount}
                  </Badge>
                </div>
              </div>

              <div className="rounded-2xl border p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  <span className="font-semibold">Loại đường</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedServicePackage.roadTypes.map((road) => (
                    <Badge key={road} variant="outline" className="rounded-full px-3 py-1">
                      {road}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  <span className="font-semibold">Kỹ năng</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedServicePackage.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="rounded-full px-3 py-1">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <PackageFormDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreatePackage}
        mode="create"
      />

      <PackageFormDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSubmit={handleEditPackage}
        mode="edit"
        initialData={selectedPackage}
      />

      <PackageViewDialog
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        package={selectedPackage}
      />

      <Dialog open={isRoadTypeModalOpen} onOpenChange={setIsRoadTypeModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingRoadType ? "Chỉnh sửa loại đường" : "Thêm loại đường mới"}
            </DialogTitle>
            <DialogDescription>
              {editingRoadType
                ? "Cập nhật thông tin loại đường."
                : "Nhập tên loại đường mới để thêm vào danh sách."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Tên loại đường
            </label>
            <Input
              placeholder="Nhập tên loại đường"
              value={roadTypeName}
              onChange={(e) => setRoadTypeName(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsRoadTypeModalOpen(false);
                setEditingRoadType(null);
                setRoadTypeName("");
              }}
              disabled={creatingRoadType || updatingRoadType}
            >
              Hủy
            </Button>
            <Button
              onClick={handleSubmitRoadType}
              disabled={creatingRoadType || updatingRoadType}
            >
              {creatingRoadType || updatingRoadType
                ? "Đang lưu..."
                : editingRoadType
                ? "Lưu thay đổi"
                : "Thêm mới"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={isDeleteRoadTypeDialogOpen}
        onOpenChange={setIsDeleteRoadTypeDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Xác nhận xóa loại đường
            </AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa loại đường{" "}
              <span className="font-semibold">
                {roadTypeToDelete?.name ?? ""}
              </span>
              ? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deletingRoadType}>
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDeleteRoadType}
              disabled={deletingRoadType}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {deletingRoadType ? "Đang xóa..." : "Xóa"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog
        open={isDrivingSkillModalOpen}
        onOpenChange={setIsDrivingSkillModalOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingDrivingSkill
                ? "Chỉnh sửa loại kỹ năng"
                : "Thêm loại kỹ năng mới"}
            </DialogTitle>
            <DialogDescription>
              {editingDrivingSkill
                ? "Cập nhật thông tin loại kỹ năng."
                : "Nhập tên loại kỹ năng mới để thêm vào danh sách."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Tên loại kỹ năng
            </label>
            <Input
              placeholder="Nhập tên loại kỹ năng"
              value={drivingSkillName}
              onChange={(e) => setDrivingSkillName(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDrivingSkillModalOpen(false);
                setEditingDrivingSkill(null);
                setDrivingSkillName("");
              }}
              disabled={creatingDrivingSkill || updatingDrivingSkill}
            >
              Hủy
            </Button>
            <Button
              onClick={handleSubmitDrivingSkill}
              disabled={creatingDrivingSkill || updatingDrivingSkill}
            >
              {creatingDrivingSkill || updatingDrivingSkill
                ? "Đang lưu..."
                : editingDrivingSkill
                ? "Lưu thay đổi"
                : "Thêm mới"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={isDeleteDrivingSkillDialogOpen}
        onOpenChange={setIsDeleteDrivingSkillDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa loại kỹ năng</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa loại kỹ năng{" "}
              <span className="font-semibold">
                {drivingSkillToDelete?.display_name ?? ""}
              </span>
              ? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deletingDrivingSkill}>
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDeleteDrivingSkill}
              disabled={deletingDrivingSkill}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {deletingDrivingSkill ? "Đang xóa..." : "Xóa"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
