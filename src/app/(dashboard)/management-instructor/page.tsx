"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, CheckCircle, XCircle, Clock, User, Users, UserCheck, UserX, Search, X, FileText, AlertTriangle, RefreshCw, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { InstructorApplication } from "@/types/instructor-management.types";
import mockData from "@/data/mock-instructors-updated.json";

export default function ManagementInstructorPage() {
    const [selectedInstructor, setSelectedInstructor] = useState<InstructorApplication | null>(null);
    const [applications, setApplications] = useState<InstructorApplication[]>(mockData.instructors as InstructorApplication[]);
    const [reapplyDocument, setReapplyDocument] = useState<{ instructorId: string, docType: string } | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Filter applications based on search term
    const filteredApplications = applications.filter(instructor =>
        instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        instructor.phone.includes(searchTerm) ||
        instructor.emergencyContact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        instructor.emergencyContact.phone.includes(searchTerm)
    );

    // Pagination calculations
    const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedApplications = filteredApplications.slice(startIndex, endIndex);

    // Reset to first page when search changes
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const goToFirstPage = () => setCurrentPage(1);
    const goToLastPage = () => setCurrentPage(totalPages);
    const goToPreviousPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
    const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
    const canGoPrevious = currentPage > 1;
    const canGoNext = currentPage < totalPages;

    // Calculate stats
    const stats = {
        total: applications.length,
        pending: applications.filter(app => app.status === 'pending').length,
        approved: applications.filter(app => app.status === 'approved').length,
        rejected: applications.filter(app => app.status === 'rejected').length,
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Chờ duyệt</Badge>;
            case 'approved':
                return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Đã duyệt</Badge>;
            case 'rejected':
                return <Badge variant="destructive" className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />Từ chối</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const handleApprove = (id: string) => {
        console.log('Approving instructor:', id);
        // TODO: Implement approve logic
    };

    const handleReject = (id: string) => {
        console.log('Rejecting instructor:', id);
        // TODO: Implement reject logic
    };

    const checkDocumentStatus = (instructor: InstructorApplication) => {
        let totalDocs = Object.keys(instructor.documents).length;
        let verifiedDocs = Object.values(instructor.documents).filter((doc: any) => doc.verified).length;
        
        // Add vehicle documents if vehicle exists
        if (instructor.vehicle) {
            totalDocs += Object.keys(instructor.vehicle.documents).length;
            verifiedDocs += Object.values(instructor.vehicle.documents).filter((doc: any) => doc.verified).length;
        }
        
        return { total: totalDocs, verified: verifiedDocs, allVerified: verifiedDocs === totalDocs };
    };

    const handleReapplyDocument = (instructorId: string, docType: string) => {
        setReapplyDocument({ instructorId, docType });
        // TODO: Implement reapply logic with image upload
    };

    const handleVerifyDocument = (instructorId: string, docType: string) => {
        setApplications(prev => prev.map(app =>
            app.id === instructorId
                ? {
                    ...app,
                    documents: {
                        ...app.documents,
                        [docType]: {
                            ...app.documents[docType as keyof typeof app.documents],
                            verified: true
                        }
                    }
                }
                : app
        ));
    };

    return (
        <div className="flex flex-1 flex-col space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Quản lý người hướng dẫn</h1>
                    <p className="text-muted-foreground">
                        Duyệt và quản lý đơn đăng ký trở thành người hướng dẫn
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tổng đơn đăng ký</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Chờ duyệt</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Đã duyệt</CardTitle>
                        <UserCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Từ chối</CardTitle>
                        <UserX className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Search */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Tìm kiếm theo tên, số điện thoại hoặc thông tin liên hệ khẩn cấp..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="flex-1"
                        />
                        {searchTerm && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSearchTerm("")}
                                className="h-8 w-8 p-0"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Table */}
            <Card className="py-0">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-muted sticky top-0 z-10">
                                <TableRow>
                                    <TableHead className="text-center">STT</TableHead>
                                    <TableHead>Họ và tên</TableHead>
                                    <TableHead>Số điện thoại</TableHead>
                                    <TableHead>Ngày nộp</TableHead>
                                    <TableHead>Có xe</TableHead>
                                    <TableHead>Trạng thái</TableHead>
                                    <TableHead className="text-center">Thao tác</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedApplications.map((instructor, index) => {
                                    const docStatus = checkDocumentStatus(instructor);
                                    const globalIndex = startIndex + index;
                                    return (
                                        <TableRow key={instructor.id}>
                                            <TableCell className="text-center font-medium">
                                                {globalIndex + 1}
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-medium">{instructor.name}</div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm">{instructor.phone}</div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm">
                                                    {formatDate(instructor.submittedAt)}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {instructor.vehicle ? (
                                                    <Badge variant="default" className="bg-blue-100 text-blue-800">
                                                        <CheckCircle className="w-3 h-3 mr-1" />
                                                        Có xe
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                                                        <XCircle className="w-3 h-3 mr-1" />
                                                        Không có xe
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {getStatusBadge(instructor.status)}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex gap-1 justify-center">
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => setSelectedInstructor(instructor)}
                                                                className="h-8 w-8 p-0"
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                                                            <DialogHeader>
                                                                <DialogTitle>Chi tiết đơn đăng ký - {instructor.name}</DialogTitle>
                                                            </DialogHeader>
                                                            <div className="space-y-6">
                                                                {/* Personal Info */}
                                                                <div className="grid grid-cols-2 gap-4">
                                                                    <div>
                                                                        <h3 className="font-semibold mb-2">Thông tin cá nhân</h3>
                                                                        <div className="space-y-2 text-sm">
                                                                            <div><strong>Họ tên:</strong> {instructor.name}</div>
                                                                            <div><strong>Số điện thoại:</strong> {instructor.phone}</div>
                                                                            <div><strong>Ngày nộp:</strong> {formatDate(instructor.submittedAt)}</div>
                                                                        </div>
                                                                        <div className="mt-4">
                                                                            <h4 className="font-medium text-sm mb-2">Liên hệ khẩn cấp</h4>
                                                                            <div className="space-y-1 text-sm">
                                                                                <div><strong>Họ tên:</strong> {instructor.emergencyContact.name}</div>
                                                                                <div><strong>Số điện thoại:</strong> {instructor.emergencyContact.phone}</div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <h3 className="font-semibold mb-2">Trạng thái</h3>
                                                                        {getStatusBadge(instructor.status)}
                                                                    </div>
                                                                </div>

                                                                {/* Documents Overview */}
                                                                <div>
                                                                    <h3 className="font-semibold mb-4">Tổng quan giấy tờ</h3>
                                                                    <div className="grid grid-cols-3 gap-4">
                                                                        {Object.entries(instructor.documents).map(([key, doc]) => (
                                                                            <div key={key} className="border rounded-lg p-3 text-center">
                                                                                <div className="mb-2">
                                                                                    <div className="w-16 h-16 mx-auto bg-gray-100 rounded border flex items-center justify-center mb-2">
                                                                                        <span className="text-lg font-bold text-gray-600">
                                                                                            {key === 'drivingLicense' ? 'DL' :
                                                                                                key === 'professionalCertificate' ? 'PC' :
                                                                                                    key === 'criminalRecord' ? 'CR' :
                                                                                                        key === 'healthCertificate' ? 'HC' : 'XX'}
                                                                                        </span>
                                                                                    </div>
                                                                                    <h4 className="text-sm font-medium">
                                                                                        {key === 'drivingLicense' ? 'Giấy phép lái xe' :
                                                                                            key === 'professionalCertificate' ? 'Chứng chỉ hành nghề' :
                                                                                                key === 'criminalRecord' ? 'Lý lịch tư pháp' :
                                                                                                    key === 'healthCertificate' ? 'Giấy khám sức khỏe' : 'Khác'}
                                                                                    </h4>
                                                                                </div>
                                                                                <div className="space-y-2">
                                                                                    {doc.verified ? (
                                                                                        <Badge variant="default" className="bg-green-100 text-green-800 text-xs">
                                                                                            <CheckCircle className="w-3 h-3 mr-1" />
                                                                                            Đã xác thực
                                                                                        </Badge>
                                                                                    ) : (
                                                                                        <div className="space-y-1">
                                                                                            <Badge variant="secondary" className="text-xs">
                                                                                                <Clock className="w-3 h-3 mr-1" />
                                                                                                Chưa xác thực
                                                                                            </Badge>
                                                                                            <div className="flex gap-1 justify-center">
                                                                                                <Button
                                                                                                    size="sm"
                                                                                                    variant="outline"
                                                                                                    className="h-6 px-2 text-xs"
                                                                                                    onClick={() => handleVerifyDocument(instructor.id, key)}
                                                                                                >
                                                                                                    <CheckCircle className="w-3 h-3" />
                                                                                                </Button>
                                                                                                <Button
                                                                                                    size="sm"
                                                                                                    variant="outline"
                                                                                                    className="h-6 px-2 text-xs"
                                                                                                    onClick={() => handleReapplyDocument(instructor.id, key)}
                                                                                                >
                                                                                                    <RefreshCw className="w-3 h-3" />
                                                                                                </Button>
                                                                                            </div>
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>

                                                                    {/* Document Status Summary */}
                                                                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                                                        <div className="flex items-center justify-between">
                                                                            <span className="text-sm font-medium">Tổng kết giấy tờ:</span>
                                                                            <div className="flex items-center gap-2">
                                                                                {checkDocumentStatus(instructor).allVerified ? (
                                                                                    <Badge variant="default" className="bg-green-100 text-green-800">
                                                                                        <CheckCircle className="w-3 h-3 mr-1" />
                                                                                        Đã xác thực đầy đủ ({checkDocumentStatus(instructor).verified}/{checkDocumentStatus(instructor).total})
                                                                                    </Badge>
                                                                                ) : (
                                                                                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                                                                                        <AlertTriangle className="w-3 h-3 mr-1" />
                                                                                        Chưa đầy đủ ({checkDocumentStatus(instructor).verified}/{checkDocumentStatus(instructor).total})
                                                                                    </Badge>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {/* Vehicle Information */}
                                                                {instructor.vehicle && (
                                                                    <div>
                                                                        <h3 className="font-semibold mb-4">Thông tin xe đăng ký</h3>
                                                                        <div className="grid grid-cols-2 gap-6">
                                                                            {/* Vehicle Details */}
                                                                            <div className="space-y-4">
                                                                                <h4 className="font-medium text-sm">Chi tiết xe</h4>
                                                                                <div className="space-y-2 text-sm">
                                                                                    <div><strong>Hãng xe:</strong> {instructor.vehicle.brand}</div>
                                                                                    <div><strong>Mẫu xe:</strong> {instructor.vehicle.model}</div>
                                                                                    <div><strong>Số chỗ ngồi:</strong> {instructor.vehicle.seats}</div>
                                                                                    <div><strong>Biển số:</strong> {instructor.vehicle.licensePlate}</div>
                                                                                    <div><strong>Loại nhiên liệu:</strong> {instructor.vehicle.fuelType === 'gasoline' ? 'Xăng' : instructor.vehicle.fuelType === 'diesel' ? 'Dầu' : instructor.vehicle.fuelType === 'electric' ? 'Điện' : 'Hybrid'}</div>
                                                                                    <div><strong>Chủ xe:</strong> {instructor.vehicle.ownerName}</div>
                                                                                    <div><strong>Ngày cấp:</strong> {formatDate(instructor.vehicle.issueDate)}</div>
                                                                                </div>
                                                                                <div>
                                                                                    <h4 className="font-medium text-sm mb-2">Giá thuê</h4>
                                                                                    <div className="space-y-1 text-sm">
                                                                                        <div><strong>Theo giờ:</strong> {instructor.vehicle.price.hourly.toLocaleString('vi-VN')} VNĐ</div>
                                                                                        <div><strong>Theo ngày:</strong> {instructor.vehicle.price.daily.toLocaleString('vi-VN')} VNĐ</div>
                                                                                        <div><strong>Theo tháng:</strong> {instructor.vehicle.price.monthly.toLocaleString('vi-VN')} VNĐ</div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>

                                                                            {/* Vehicle Documents */}
                                                                            <div>
                                                                                <h4 className="font-medium text-sm mb-3">Giấy tờ xe</h4>
                                                                                <div className="grid grid-cols-1 gap-3">
                                                                                    {Object.entries(instructor.vehicle.documents).map(([key, doc]) => (
                                                                                        <div key={key} className="border rounded-lg p-3">
                                                                                            <div className="flex items-center justify-between">
                                                                                                <div className="flex items-center gap-2">
                                                                                                    <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                                                                                                        <span className="text-xs font-bold text-gray-600">
                                                                                                            {key === 'registration' ? 'REG' :
                                                                                                                key === 'insurance' ? 'INS' :
                                                                                                                    key === 'inspection' ? 'INSP' : 'DOC'}
                                                                                                        </span>
                                                                                                    </div>
                                                                                                    <span className="text-sm font-medium">
                                                                                                        {key === 'registration' ? 'Giấy đăng ký xe' :
                                                                                                            key === 'insurance' ? 'Bảo hiểm xe' :
                                                                                                                key === 'inspection' ? 'Giấy đăng kiểm' : 'Giấy tờ khác'}
                                                                                                    </span>
                                                                                                </div>
                                                                                                <div className="flex items-center gap-1">
                                                                                                    {doc.verified ? (
                                                                                                        <Badge variant="default" className="bg-green-100 text-green-800 text-xs">
                                                                                                            <CheckCircle className="w-3 h-3 mr-1" />
                                                                                                            Đã xác thực
                                                                                                        </Badge>
                                                                                                    ) : (
                                                                                                        <div className="flex gap-1">
                                                                                                            <Badge variant="secondary" className="text-xs">
                                                                                                                <Clock className="w-3 h-3 mr-1" />
                                                                                                                Chưa xác thực
                                                                                                            </Badge>
                                                                                                            <Button
                                                                                                                size="sm"
                                                                                                                variant="outline"
                                                                                                                className="h-6 px-2 text-xs"
                                                                                                                onClick={() => {
                                                                                                                    // Handle vehicle document verification
                                                                                                                    console.log('Verify vehicle document:', key);
                                                                                                                }}
                                                                                                            >
                                                                                                                <CheckCircle className="w-3 h-3" />
                                                                                                            </Button>
                                                                                                        </div>
                                                                                                    )}
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    ))}
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                        {/* Vehicle Images */}
                                                                        <div className="mt-4">
                                                                            <h4 className="font-medium text-sm mb-3">Hình ảnh xe</h4>
                                                                            <div className="grid grid-cols-2 gap-3">
                                                                                <div className="text-center">
                                                                                    <div className="w-full h-24 bg-gray-100 rounded border mb-1 flex items-center justify-center">
                                                                                        <span className="text-xs text-gray-500">Mặt trước</span>
                                                                                    </div>
                                                                                    <span className="text-xs text-gray-600">Front</span>
                                                                                </div>
                                                                                <div className="text-center">
                                                                                    <div className="w-full h-24 bg-gray-100 rounded border mb-1 flex items-center justify-center">
                                                                                        <span className="text-xs text-gray-500">Mặt sau</span>
                                                                                    </div>
                                                                                    <span className="text-xs text-gray-600">Back</span>
                                                                                </div>
                                                                                <div className="text-center">
                                                                                    <div className="w-full h-24 bg-gray-100 rounded border mb-1 flex items-center justify-center">
                                                                                        <span className="text-xs text-gray-500">Bên hông</span>
                                                                                    </div>
                                                                                    <span className="text-xs text-gray-600">Side</span>
                                                                                </div>
                                                                                <div className="text-center">
                                                                                    <div className="w-full h-24 bg-gray-100 rounded border mb-1 flex items-center justify-center">
                                                                                        <span className="text-xs text-gray-500">Nội thất</span>
                                                                                    </div>
                                                                                    <span className="text-xs text-gray-600">Interior</span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {/* Action Buttons */}
                                                                {instructor.status === 'pending' && (
                                                                    <div className="flex gap-3 justify-end pt-4 border-t">
                                                                        <Button
                                                                            variant="destructive"
                                                                            onClick={() => {
                                                                                handleReject(instructor.id);
                                                                                setSelectedInstructor(null);
                                                                            }}
                                                                        >
                                                                            <XCircle className="w-4 h-4 mr-2" />
                                                                            Từ chối đơn
                                                                        </Button>
                                                                        <Button
                                                                            variant="default"
                                                                            className="bg-green-600 hover:bg-green-700"
                                                                            onClick={() => {
                                                                                handleApprove(instructor.id);
                                                                                setSelectedInstructor(null);
                                                                            }}
                                                                            disabled={!checkDocumentStatus(instructor).allVerified}
                                                                        >
                                                                            <CheckCircle className="w-4 h-4 mr-2" />
                                                                            Duyệt đơn
                                                                        </Button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </DialogContent>
                                                    </Dialog>

                                                    {instructor.status === 'pending' && (
                                                        <>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleApprove(instructor.id)}
                                                                className="h-8 w-8 p-0"
                                                                disabled={!docStatus.allVerified}
                                                            >
                                                                <UserCheck className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleReject(instructor.id)}
                                                                className="h-8 w-8 p-0"
                                                            >
                                                                <UserX className="h-4 w-4" />
                                                            </Button>
                                                        </>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination Controls */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-4 border-t">
                        <div className="text-muted-foreground hidden flex-1 text-xs sm:text-sm lg:flex">
                            Hiển thị {paginatedApplications.length} trong{" "}
                            {filteredApplications.length} kết quả.
                        </div>
                        <div className="flex w-full items-center justify-center sm:justify-end gap-4 sm:gap-8 lg:w-fit">
                            <div className="hidden items-center gap-2 lg:flex">
                                <Label htmlFor="rows-per-page" className="text-sm font-medium">
                                    Số hàng mỗi trang
                                </Label>
                                <Select
                                    value={`${itemsPerPage}`}
                                    onValueChange={(value) => {
                                        setItemsPerPage(Number(value));
                                        setCurrentPage(1);
                                    }}
                                >
                                    <SelectTrigger className="w-20" id="rows-per-page">
                                        <SelectValue placeholder={itemsPerPage} />
                                    </SelectTrigger>
                                    <SelectContent side="top">
                                        {[5, 10, 20, 30, 50].map((pageSize) => (
                                            <SelectItem key={pageSize} value={`${pageSize}`}>
                                                {pageSize}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex w-fit items-center justify-center text-xs sm:text-sm font-medium">
                                Trang {currentPage} trong {totalPages}
                            </div>
                            <div className="flex items-center gap-1 sm:gap-2">
                                <Button
                                    variant="outline"
                                    className="hidden h-7 w-7 sm:h-8 sm:w-8 p-0 lg:flex"
                                    onClick={goToFirstPage}
                                    disabled={!canGoPrevious}
                                >
                                    <span className="sr-only">Go to first page</span>
                                    <ChevronsLeft className="size-3 sm:size-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    className="size-7 sm:size-8"
                                    onClick={goToPreviousPage}
                                    disabled={!canGoPrevious}
                                >
                                    <span className="sr-only">Go to previous page</span>
                                    <ChevronLeft className="size-3 sm:size-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    className="size-7 sm:size-8"
                                    onClick={goToNextPage}
                                    disabled={!canGoNext}
                                >
                                    <span className="sr-only">Go to next page</span>
                                    <ChevronRight className="size-3 sm:size-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    className="hidden size-7 sm:size-8 lg:flex"
                                    onClick={goToLastPage}
                                    disabled={!canGoNext}
                                >
                                    <span className="sr-only">Go to last page</span>
                                    <ChevronsRight className="size-3 sm:size-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Reapply Document Dialog */}
            <Dialog open={!!reapplyDocument} onOpenChange={() => setReapplyDocument(null)}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Nộp lại giấy tờ</DialogTitle>
                    </DialogHeader>
                    {reapplyDocument && (
                        <div className="space-y-4">
                            <div className="text-sm text-gray-600">
                                <p>Bạn đang yêu cầu nộp lại giấy tờ:</p>
                                <p className="font-semibold">
                                    {reapplyDocument.docType === 'drivingLicense' ? 'Giấy phép lái xe' :
                                        reapplyDocument.docType === 'professionalCertificate' ? 'Chứng chỉ hành nghề' :
                                            reapplyDocument.docType === 'criminalRecord' ? 'Lý lịch tư pháp' :
                                                reapplyDocument.docType === 'healthCertificate' ? 'Giấy khám sức khỏe' :
                                                    reapplyDocument.docType === 'registration' ? 'Giấy đăng ký xe' :
                                                        reapplyDocument.docType === 'insurance' ? 'Bảo hiểm xe' :
                                                            reapplyDocument.docType === 'inspection' ? 'Giấy đăng kiểm xe' : 'Giấy tờ khác'}
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Chụp ảnh mặt trước</label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                        <AlertTriangle className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                                        <p className="text-sm text-gray-600">Nhấp để chọn ảnh hoặc kéo thả vào đây</p>
                                        <input type="file" accept="image/*" className="hidden" />
                                    </div>
                                </div>

                                {(reapplyDocument.docType === 'drivingLicense' || reapplyDocument.docType === 'registration' || reapplyDocument.docType === 'insurance' || reapplyDocument.docType === 'inspection') && (
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Chụp ảnh mặt sau</label>
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                            <AlertTriangle className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                                            <p className="text-sm text-gray-600">Nhấp để chọn ảnh hoặc kéo thả vào đây</p>
                                            <input type="file" accept="image/*" className="hidden" />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-2 justify-end">
                                <Button variant="outline" onClick={() => setReapplyDocument(null)}>
                                    Hủy
                                </Button>
                                <Button onClick={() => {
                                    console.log('Reapplying document:', reapplyDocument);
                                    setReapplyDocument(null);
                                }}>
                                    Nộp lại
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}