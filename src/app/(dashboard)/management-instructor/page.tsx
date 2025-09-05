"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, CheckCircle, XCircle, Clock, User, Mail, Phone, Calendar, Upload, AlertTriangle, RefreshCw } from "lucide-react";
import Image from "next/image";
import { InstructorApplication } from "@/types/instructor-management.types";
import mockData from "@/data/mock-instructors.json";

export default function ManagementInstructorPage() {
    const [selectedInstructor, setSelectedInstructor] = useState<InstructorApplication | null>(null);
    const [applications, setApplications] = useState<InstructorApplication[]>(mockData.instructors as InstructorApplication[]);
    const [reapplyDocument, setReapplyDocument] = useState<{ instructorId: string, docType: string } | null>(null);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
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

    const checkDocumentStatus = (documents: any) => {
        const totalDocs = Object.keys(documents).length;
        const verifiedDocs = Object.values(documents).filter((doc: any) => doc.verified).length;
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
        <div className="container mx-auto py-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Quản lý người hướng dẫn</h1>
                    <p className="text-gray-600 mt-2">Duyệt và quản lý đơn đăng ký trở thành người hướng dẫn</p>
                </div>
                <div className="flex gap-2">
                    <Badge variant="outline" className="text-sm">
                        Tổng: {applications.length} đơn
                    </Badge>
                    <Badge variant="secondary" className="text-sm">
                        Chờ duyệt: {applications.filter(app => app.status === 'pending').length}
                    </Badge>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Danh sách đơn đăng ký
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Thông tin cá nhân</TableHead>
                                    <TableHead>Liên hệ</TableHead>
                                    <TableHead>Ngày nộp</TableHead>
                                    <TableHead>Trạng thái</TableHead>
                                    <TableHead className="text-center">Thao tác</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {applications.map((instructor, index) => {
                                    const docStatus = checkDocumentStatus(instructor.documents);
                                    return (
                                        <TableRow key={instructor.id}>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <div className="font-semibold">{instructor.name}</div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <Mail className="w-4 h-4 text-gray-400" />
                                                        {instructor.email}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Calendar className="w-4 h-4 text-gray-400" />
                                                    {formatDate(instructor.submittedAt)}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {getStatusBadge(instructor.status)}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex gap-2 justify-center">
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => setSelectedInstructor(instructor)}
                                                            >
                                                                <Eye className="w-4 h-4 mr-1" />
                                                                Xem
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
                                                                            <div><strong>Email:</strong> {instructor.email}</div>
                                                                            <div><strong>Ngày nộp:</strong> {formatDate(instructor.submittedAt)}</div>
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
                                                                                            {key === 'b2License' ? 'B2' :
                                                                                                key === 'cccd' ? 'CC' :
                                                                                                    key === 'professionalCertificate' ? 'PC' :
                                                                                                        key === 'healthCertificate' ? 'HC' :
                                                                                                            key === 'vehiclePapers' ? 'VP' : 'VI'}
                                                                                        </span>
                                                                                    </div>
                                                                                    <h4 className="text-sm font-medium">
                                                                                        {key === 'b2License' ? 'Bằng B2' :
                                                                                            key === 'cccd' ? 'CCCD' :
                                                                                                key === 'professionalCertificate' ? 'Chứng chỉ' :
                                                                                                    key === 'healthCertificate' ? 'Khám sức khỏe' :
                                                                                                        key === 'vehiclePapers' ? 'Giấy tờ xe' : 'Bảo hiểm'}
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
                                                                                {checkDocumentStatus(instructor.documents).allVerified ? (
                                                                                    <Badge variant="default" className="bg-green-100 text-green-800">
                                                                                        <CheckCircle className="w-3 h-3 mr-1" />
                                                                                        Đã xác thực đầy đủ ({checkDocumentStatus(instructor.documents).verified}/{checkDocumentStatus(instructor.documents).total})
                                                                                    </Badge>
                                                                                ) : (
                                                                                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                                                                                        <AlertTriangle className="w-3 h-3 mr-1" />
                                                                                        Chưa đầy đủ ({checkDocumentStatus(instructor.documents).verified}/{checkDocumentStatus(instructor.documents).total})
                                                                                    </Badge>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>

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
                                                                            disabled={!checkDocumentStatus(instructor.documents).allVerified}
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
                                                                variant="default"
                                                                size="sm"
                                                                onClick={() => handleApprove(instructor.id)}
                                                                className="bg-green-600 hover:bg-green-700"
                                                                disabled={!docStatus.allVerified}
                                                            >
                                                                <CheckCircle className="w-4 h-4 mr-1" />
                                                                Duyệt
                                                            </Button>
                                                            <Button
                                                                variant="destructive"
                                                                size="sm"
                                                                onClick={() => handleReject(instructor.id)}
                                                            >
                                                                <XCircle className="w-4 h-4 mr-1" />
                                                                Từ chối
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
                                    {reapplyDocument.docType === 'b2License' ? 'Bằng lái xe B2' :
                                        reapplyDocument.docType === 'cccd' ? 'Căn cước công dân' :
                                            reapplyDocument.docType === 'professionalCertificate' ? 'Chứng chỉ hành nghề' :
                                                reapplyDocument.docType === 'healthCertificate' ? 'Giấy khám sức khỏe' :
                                                    reapplyDocument.docType === 'vehiclePapers' ? 'Giấy tờ xe' : 'Bảo hiểm xe'}
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Chụp ảnh mặt trước</label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                        <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                                        <p className="text-sm text-gray-600">Nhấp để chọn ảnh hoặc kéo thả vào đây</p>
                                        <input type="file" accept="image/*" className="hidden" />
                                    </div>
                                </div>

                                {(reapplyDocument.docType === 'b2License' || reapplyDocument.docType === 'cccd') && (
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Chụp ảnh mặt sau</label>
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                            <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
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
                                    <Upload className="w-4 h-4 mr-2" />
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