"use client";

import React, { useEffect, useState } from "react";
import { Search, Eye, CheckCircle, XCircle, Loader2, MoreHorizontal, Calendar, User, Clock, FileText, Trash2 } from "lucide-react";
import Image from "next/image";
import PageHeader from "@/components/commons/Header/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
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
import { useThunkAction } from "@/lib/redux/useThunkAction";
import {
    getBlogCategories,
    createCategoriesForInspector,
    deleteCategoryForInspector,
} from "@/features/blog/blogThunk";
import { BlogCategory } from "@/types/blog/blog.type";

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

    const {
        runSafe: runGetCategories,
        loading: getCategoriesLoading,
    } = useThunkAction(getBlogCategories);
    const {
        runSafe: runCreateCategory,
        loading: createCategoryLoading,
    } = useThunkAction(createCategoriesForInspector);
    const {
        runSafe: runDeleteCategory,
        loading: deleteCategoryLoading,
    } = useThunkAction(deleteCategoryForInspector);

    const [categories, setCategories] = useState<BlogCategory[]>([]);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            const res = await runGetCategories(undefined as void);
            if (res.ok) {
                const data = res.data?.value;
                setCategories(Array.isArray(data) ? (data as BlogCategory[]) : []);
            } else {
                setCategories([]);
            }
        };

        fetchCategories();
    }, [runGetCategories]);

    const handleCreateCategory = async () => {
        const name = newCategoryName.trim();
        if (!name) return;

        const res = await runCreateCategory({ name });
        if (res.ok && res.data?.value) {
            const created = res.data.value as BlogCategory;
            setCategories((prev) => [...prev, created]);
            setNewCategoryName("");
        }
    };

    const handleDeleteCategory = async (id: string) => {
        setDeletingCategoryId(id);
        const res = await runDeleteCategory({ id });
        if (res.ok) {
            setCategories((prev) => prev.filter((category) => category.id !== id));
        }
        setDeletingCategoryId(null);
    };

    return (
        <div className="space-y-8">
            <PageHeader
                title="Quản Lý Bài Viết"
                description="Theo dõi, duyệt hoặc quản lý trạng thái các bài viết của giảng viên."
                className="space-y-4"
            />
            <Card className="rounded-3xl border bg-background shadow-sm">
                <CardContent className="p-6">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <StatCard
                            label="Tổng số bài đăng"
                            value={stats.total}
                            icon={<FileText className="size-5" />}
                            accent="bg-blue-50 text-blue-600"
                        />
                        <StatCard
                            label="Chờ duyệt"
                            value={stats.pending}
                            icon={<Clock className="size-5" />}
                            accent="bg-amber-50 text-amber-600"
                        />
                        <StatCard
                            label="Đã duyệt"
                            value={stats.approved}
                            icon={<CheckCircle className="size-5" />}
                            accent="bg-emerald-50 text-emerald-600"
                        />
                        <StatCard
                            label="Từ chối"
                            value={stats.rejected}
                            icon={<XCircle className="size-5" />}
                            accent="bg-rose-50 text-rose-600"
                        />
                    </div>
                </CardContent>
            </Card>

            <section className="rounded-3xl border bg-card p-6 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                    <div className="relative flex-1">
                        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                            placeholder="Tìm kiếm bài viết..."
                            className="pl-10"
                        />
                    </div>
                    <Select
                        value={statusFilter as string}
                        onValueChange={(value) => setStatusFilter(value as PostStatus | "all")}
                    >
                        <SelectTrigger className="w-full md:w-56">
                            <SelectValue placeholder="Trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tất cả trạng thái</SelectItem>
                            <SelectItem value={String(PostStatus.Pending)}>Chờ duyệt</SelectItem>
                            <SelectItem value={String(PostStatus.Approved)}>Đã duyệt</SelectItem>
                            <SelectItem value={String(PostStatus.Rejected)}>Đã từ chối</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </section>

            <section className="rounded-3xl border bg-card p-6 shadow-sm">
                <div className="overflow-x-auto rounded-2xl border">
                    <Table>
                        <TableHeader className="bg-muted/60 text-xs uppercase text-muted-foreground">
                            <TableRow>
                                <TableHead className="text-center font-semibold">STT</TableHead>
                                <TableHead>Tiêu đề</TableHead>
                                <TableHead>Tác giả</TableHead>
                                <TableHead>Ngày tạo</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead className="text-center">Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
                                        className="py-8 text-center text-sm text-muted-foreground"
                                    >
                                        <div className="flex items-center justify-center gap-2">
                                            <Spinner variant="circle" className="size-4" />
                                            <span>Đang tải danh sách bài viết...</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : posts.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
                                        className="py-8 text-center text-sm text-muted-foreground"
                                    >
                                        {searchTerm
                                            ? "Không tìm thấy bài viết phù hợp."
                                            : "Không có bài viết nào."}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                posts.map((post, index) => {
                                    const statusBadge = getStatusBadge(post.status);
                                    const strippedTitle = post.title.replace(/<[^>]*>/g, "");

                                    return (
                                        <TableRow
                                            key={post.postId}
                                            className="hover:bg-muted/30"
                                        >
                                            <TableCell className="text-center text-sm font-semibold text-muted-foreground">
                                                {index + 1}
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <p className="line-clamp-2 font-medium">
                                                        {strippedTitle || "Không có tiêu đề"}
                                                    </p>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-sm">
                                                {post.authorName || "N/A"}
                                            </TableCell>
                                            <TableCell className="text-sm">
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
                                            <TableCell>
                                                <div className="flex justify-center">
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
                                                            <DropdownMenuItem
                                                                onSelect={() => openViewDialog(post)}
                                                            >
                                                                <Eye className="mr-2 size-4" />
                                                                Xem chi tiết
                                                            </DropdownMenuItem>

                                                            {post.status === PostStatus.Pending && (
                                                                <>
                                                                    <DropdownMenuSeparator />
                                                                    <DropdownMenuItem
                                                                        onClick={() => handleApprove(post.postId)}
                                                                        disabled={isUpdating}
                                                                        className="text-emerald-600"
                                                                    >
                                                                        <CheckCircle className="mr-2 size-4" />
                                                                        Duyệt bài viết
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem
                                                                        onClick={() => openRejectDialog(post)}
                                                                        disabled={isUpdating}
                                                                        className="text-rose-600"
                                                                    >
                                                                        <XCircle className="mr-2 size-4" />
                                                                        Từ chối bài viết
                                                                    </DropdownMenuItem>
                                                                </>
                                                            )}
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </div>
            </section>

            <section className="rounded-3xl border bg-card p-6 shadow-sm">
                <div className="space-y-3">
                    <h2 className="text-lg font-semibold">Quản lý phân loại bài viết</h2>
                    <p className="text-sm text-muted-foreground">
                        Xem danh sách phân loại hiện có và thêm mới phân loại cho bài viết.
                    </p>
                </div>
                <div className="mt-4 overflow-x-auto rounded-2xl border bg-muted/20">
                    <Table>
                        <TableHeader className="bg-muted/60 text-xs uppercase text-muted-foreground">
                            <TableRow>
                                <TableHead className="w-[60px] text-center font-semibold">
                                    STT
                                </TableHead>
                                <TableHead className="font-semibold">Tên phân loại</TableHead>
                                <TableHead className="w-[140px] text-center font-semibold">
                                    Thao tác
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {getCategoriesLoading ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={3}
                                        className="py-6 text-center text-sm text-muted-foreground"
                                    >
                                        <div className="flex items-center justify-center gap-2">
                                            <Spinner variant="circle" className="size-4" />
                                            <span>Đang tải danh sách phân loại...</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : categories.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={3}
                                        className="py-6 text-center text-sm text-muted-foreground"
                                    >
                                        Chưa có phân loại nào.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                categories.map((category, index) => (
                                    <TableRow key={category.id}>
                                        <TableCell className="text-center text-sm text-muted-foreground">
                                            {index + 1}
                                        </TableCell>
                                        <TableCell className="text-sm">{category.name}</TableCell>
                                        <TableCell className="text-center">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                className="border-destructive/40 text-destructive hover:bg-destructive hover:text-white transition-colors"
                                                onClick={() => handleDeleteCategory(category.id)}
                                                disabled={
                                                    deleteCategoryLoading ||
                                                    deletingCategoryId === category.id
                                                }
                                                aria-label="Xóa phân loại"
                                            >
                                                <Trash2 className="size-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                            <TableRow>
                                <TableCell />
                                <TableCell>
                                    <Input
                                        id="new-category-name"
                                        value={newCategoryName}
                                        onChange={(e) => setNewCategoryName(e.target.value)}
                                        placeholder="Nhập tên phân loại mới..."
                                        className="h-9"
                                    />
                                </TableCell>
                                <TableCell className="text-center">
                                    <Button
                                        type="button"
                                        size="sm"
                                        onClick={handleCreateCategory}
                                        disabled={!newCategoryName.trim() || createCategoryLoading}
                                    >
                                        {createCategoryLoading ? (
                                            <Spinner
                                                variant="circle"
                                                className="mr-2 size-4 text-primary-foreground"
                                            />
                                        ) : null}
                                        Thêm phân loại
                                    </Button>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </section>

            <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-2xl">Chi tiết bài viết</DialogTitle>
                    </DialogHeader>
                    {selectedPost && (
                        <div className="space-y-6 py-4">
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
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground mb-2">Tiêu đề</h3>
                                <div
                                    className="text-xl font-bold prose prose-lg max-w-none"
                                    dangerouslySetInnerHTML={{ __html: selectedPost.title }}
                                />
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground mb-2">Nội dung</h3>
                                <div
                                    className="prose prose-sm max-w-none text-foreground"
                                    dangerouslySetInnerHTML={{ __html: selectedPost.content }}
                                />
                            </div>
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
            <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Từ chối bài viết</DialogTitle>
                        <DialogDescription>
                            Vui lòng nhập lý do từ chối bài viết &quot;{selectedPost?.title}&quot;
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

function StatCard({
    label,
    value,
    icon,
    accent,
}: {
    label: string;
    value: number;
    icon?: React.ReactNode;
    accent?: string;
}) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div className="space-y-1">
                    <CardDescription className="text-sm font-medium">
                        {label}
                    </CardDescription>
                    <CardTitle className="text-2xl font-semibold">{value}</CardTitle>
                </div>
                {icon && (
                    <span
                        className={`rounded-xl p-3 ${accent || "bg-blue-50 text-blue-600"}`}
                    >
                        {icon}
                    </span>
                )}
            </CardHeader>
        </Card>
    );
}

