"use client";

import { Search, Eye, CheckCircle, XCircle, MessageSquare, Loader2, Filter, MoreHorizontal, Calendar, User } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PostStatus } from "@/types/forum/post.enum";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { UserRole } from "@/types/auth/user-role.enum";
import { useRequireAuth } from "@/hooks/auth/useRequireAuth";
import { usePostManagement } from "@/hooks/forum/usePost";

export default function PostManagementPage() {
    useRequireAuth([UserRole.Admin, UserRole.Inspector]);

    const {
        posts,
        isLoading,
        isUpdating,
        searchTerm,
        setSearchTerm,
        statusFilter,
        setStatusFilter,
        showRejectDialog,
        setShowRejectDialog,
        rejectReason,
        setRejectReason,
        selectedPost,
        showViewDialog,
        setShowViewDialog,
        openViewDialog,
        closeViewDialog,
        handleApprove,
        handleReject,
        openRejectDialog,
        closeRejectDialog,
        getStatusBadge,
        stats,
    } = usePostManagement();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Quản lý bài viết</h1>
            </div>


            {/* Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Tìm kiếm bài viết..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Filter className="size-4 text-muted-foreground" />
                            <Select
                                value={statusFilter as string}
                                onValueChange={(value) => setStatusFilter(value as PostStatus | "all")}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Lọc theo trạng thái" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tất cả</SelectItem>
                                    <SelectItem value={String(PostStatus.Pending)}>Chờ duyệt</SelectItem>
                                    <SelectItem value={String(PostStatus.Approved)}>Đã duyệt</SelectItem>
                                    <SelectItem value={String(PostStatus.Rejected)}>Đã từ chối</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Posts List */}
            <Card>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="py-12 text-center">
                            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary mb-4" />
                            <p className="text-muted-foreground">Đang tải danh sách bài viết...</p>
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="py-12 text-center">
                            <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <p className="text-muted-foreground">
                                {searchTerm
                                    ? "Không tìm thấy bài viết nào."
                                    : "Không có bài viết nào."}
                            </p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50px]">STT</TableHead>
                                    <TableHead>Tiêu đề</TableHead>
                                    <TableHead>Tác giả</TableHead>
                                    <TableHead>Ngày tạo</TableHead>
                                    <TableHead>Trạng thái</TableHead>
                                    <TableHead className="text-center w-[100px]">Thao tác</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {posts.map((post, index) => {
                                    const statusBadge = getStatusBadge(post.status);
                                    const strippedTitle = post.title.replace(/<[^>]*>/g, "");
                                    const strippedContent = post.content.replace(/<[^>]*>/g, "");
                                    const truncatedContent = strippedContent.length > 100
                                        ? strippedContent.substring(0, 100) + "..."
                                        : strippedContent;

                                    return (
                                        <TableRow key={post.postId}>
                                            <TableCell className="font-medium">{index + 1}</TableCell>
                                            <TableCell>
                                                <div className="max-w-[400px]">
                                                    <div className="font-medium line-clamp-1">
                                                        {strippedTitle || "Không có tiêu đề"}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>{post.authorName || "N/A"}</TableCell>
                                            <TableCell>
                                                {new Date(post.createdAt).toLocaleDateString("vi-VN", {
                                                    year: "numeric",
                                                    month: "2-digit",
                                                    day: "2-digit",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    className={statusBadge.className}
                                                    variant={statusBadge.variant}
                                                >
                                                    {statusBadge.label}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            aria-label="Thao tác"
                                                        >
                                                            <MoreHorizontal className="size-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            onClick={() => openViewDialog(post)}
                                                        >
                                                            <Eye className="mr-2 size-4" />
                                                            Xem chi tiết
                                                        </DropdownMenuItem>
                                                        {post.status === PostStatus.Pending && (
                                                            <>
                                                                <DropdownMenuItem
                                                                    onClick={() => handleApprove(post.postId)}
                                                                    disabled={isUpdating}
                                                                >
                                                                    <CheckCircle className="mr-2 size-4" />
                                                                    Duyệt bài viết
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    onClick={() => openRejectDialog(post)}
                                                                    disabled={isUpdating}
                                                                    className="text-red-600"
                                                                >
                                                                    <XCircle className="mr-2 size-4" />
                                                                    Từ chối bài viết
                                                                </DropdownMenuItem>
                                                            </>
                                                        )}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* View Detail Dialog */}
            <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-2xl">Chi tiết bài viết</DialogTitle>
                    </DialogHeader>
                    {selectedPost && (
                        <div className="space-y-6 py-4">
                            {/* Header Info */}
                            <div className="flex items-start justify-between border-b pb-4">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <User className="size-4 text-muted-foreground" />
                                        <span className="font-semibold">{selectedPost.authorName || "N/A"}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Calendar className="size-4" />
                                        <span>
                                            {new Date(selectedPost.createdAt).toLocaleDateString("vi-VN", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </span>
                                    </div>
                                </div>
                                <Badge
                                    className={getStatusBadge(selectedPost.status).className}
                                    variant={getStatusBadge(selectedPost.status).variant}
                                >
                                    {getStatusBadge(selectedPost.status).label}
                                </Badge>
                            </div>

                            {/* Title */}
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground mb-2">Tiêu đề</h3>
                                <div
                                    className="text-xl font-bold prose prose-lg max-w-none"
                                    dangerouslySetInnerHTML={{ __html: selectedPost.title }}
                                />
                            </div>

                            {/* Content */}
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground mb-2">Nội dung</h3>
                                <div
                                    className="prose prose-sm max-w-none text-foreground"
                                    dangerouslySetInnerHTML={{ __html: selectedPost.content }}
                                />
                            </div>

                            {/* Images */}
                            {selectedPost.images && selectedPost.images.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground mb-2">
                                        Hình ảnh ({selectedPost.images.length})
                                    </h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {selectedPost.images
                                            .sort((a, b) => (a.order || 0) - (b.order || 0))
                                            .map((image, index) => (
                                                <div
                                                    key={index}
                                                    className="relative aspect-video rounded-lg overflow-hidden bg-muted"
                                                >
                                                    <Image
                                                        src={image.url}
                                                        alt={`Image ${index + 1}`}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            )}

                            {/* Videos */}
                            {selectedPost.videos && selectedPost.videos.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground mb-2">
                                        Video ({selectedPost.videos.length})
                                    </h3>
                                    <div className="space-y-4">
                                        {selectedPost.videos
                                            .sort((a, b) => a.order - b.order)
                                            .map((video, index) => (
                                                <div
                                                    key={index}
                                                    className="relative w-full aspect-video rounded-lg overflow-hidden bg-black"
                                                >
                                                    <video
                                                        src={video.url}
                                                        controls
                                                        className="w-full h-full object-contain"
                                                        preload="metadata"
                                                        playsInline
                                                    >
                                                        Trình duyệt của bạn không hỗ trợ video.
                                                    </video>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={closeViewDialog}>
                            Đóng
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Reject Dialog */}
            <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Từ chối bài viết</DialogTitle>
                        <DialogDescription>
                            Vui lòng nhập lý do từ chối bài viết "{selectedPost?.title}"
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="reason">Lý do từ chối *</Label>
                            <Textarea
                                id="reason"
                                placeholder="Nhập lý do từ chối bài viết..."
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                rows={4}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={closeRejectDialog}
                            disabled={isUpdating}
                        >
                            Hủy
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleReject}
                            disabled={isUpdating || !rejectReason.trim()}
                        >
                            {isUpdating ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Đang xử lý...
                                </>
                            ) : (
                                "Từ chối"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

