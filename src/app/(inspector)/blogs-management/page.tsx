"use client";

import React, { useMemo, useState } from "react";

import PageHeader from "@/components/commons/Header/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { useThunkAction } from "@/lib/redux/useThunkAction";
import {
  getListBlogsForInspector,
  approveBlogForInspector,
  banBlogForInspector,
  unbanBlogForInspector,
  rejectBlogForInspector,
  getBlogCategories,
  createCategoriesForInspector,
  deleteCategoryForInspector,
  getBlogDetailForInspector,
} from "@/features/blog/blogThunk";
import { Blog, BlogDetail, BlogCategory } from "@/types/blog/blog.type";
import { BlogStatus, BLOG_STATUS_LABELS } from "@/types/blog/blog.enum";
import { getUserById } from "@/features/user/userThunk";
import {
  CheckCircle,
  Eye,
  MoreHorizontal,
  Search,
  ShieldBan,
  Slash,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Clock,
  FileText,
  XCircle,
  Trash2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Image from "next/image";

type StatusFilterValue =
  | "all"
  | "pending"
  | "active"
  | "inactive"
  | "banned"
  | "reapply";

type AuthorMap = Record<string, string>;

const normalizeImageSrc = (src?: string | null) => {
  if (!src) return "/placeholder.svg";

  // Hỗ trợ absolute URL hoặc đường dẫn bắt đầu bằng "/"
  if (
    src.startsWith("http://") ||
    src.startsWith("https://") ||
    src.startsWith("/")
  ) {
    return src;
  }

  // Nếu backend trả về chuỗi không hợp lệ (vd: "string") thì fallback
  return "/placeholder.svg";
};

export default function BlogsInspectorManagementPage() {
  const {
    runSafe: runGetBlogs,
    loading: getBlogsLoading,
  } = useThunkAction(getListBlogsForInspector);
  const { runSafe: runGetBlogDetail } = useThunkAction(
    getBlogDetailForInspector
  );
  const { runSafe: runApproveBlog } = useThunkAction(approveBlogForInspector);
  const { runSafe: runBanBlog } = useThunkAction(banBlogForInspector);
  const { runSafe: runUnbanBlog } = useThunkAction(unbanBlogForInspector);
  const { runSafe: runRejectBlog } = useThunkAction(rejectBlogForInspector);
  const { runSafe: runGetUserById } = useThunkAction(getUserById);
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

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [selectedBlog, setSelectedBlog] = useState<BlogDetail | null>(null);
  const [authors, setAuthors] = useState<AuthorMap>({});
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  // Lưu trạng thái trước khi bị chặn để khôi phục khi bỏ chặn
  const [previousStatusBeforeBan, setPreviousStatusBeforeBan] = useState<
    Record<string, BlogStatus>
  >({});

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(
    null
  );

  const selectedBlogAuthorName =
    selectedBlog && selectedBlog.instructorId
      ? authors[selectedBlog.instructorId] || "Chưa cập nhật"
      : "Chưa cập nhật";

  const statusStats = useMemo(() => {
    const total = blogs.length;
    const pending = blogs.filter((b) => b.status === BlogStatus.Pending).length;
    const active = blogs.filter((b) => b.status === BlogStatus.Active).length;
    const inactive = blogs.filter((b) => b.status === BlogStatus.Inactive).length;
    const banned = blogs.filter((b) => b.status === BlogStatus.Banned).length;
    const reapply = blogs.filter((b) => b.status === BlogStatus.ReApply).length;

    return { total, pending, active, inactive, banned, reapply };
  }, [blogs]);

  // Fetch list blogs once
  React.useEffect(() => {
    const fetchBlogs = async () => {
      const res = await runGetBlogs();
      if (res.ok) {
        const paginated = res.data?.value;
        const pageContent = Array.isArray((paginated as any)?.pageContent)
          ? ((paginated as any).pageContent as Blog[])
          : [];
        setBlogs(pageContent);
      } else {
        setBlogs([]);
      }
    };

    fetchBlogs();
  }, [runGetBlogs]);

  // Fetch blog categories once
  React.useEffect(() => {
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

  // Fetch authors (full name) from instructorId
  React.useEffect(() => {
    const fetchAuthors = async () => {
      if (!blogs.length) return;

      const uniqueIds = Array.from(
        new Set(
          blogs
            .map((b) => b.instructorId)
            .filter((id): id is string => Boolean(id && typeof id === "string"))
        )
      );

      const missingIds = uniqueIds.filter((id) => !authors[id]);

      for (const instructorId of missingIds) {
        const res = await runGetUserById({ id: instructorId });
        if (res.ok && res.data?.value) {
          const user = res.data.value as any;
          setAuthors((prev) => ({
            ...prev,
            [instructorId]: user.fullName ?? "Chưa cập nhật",
          }));
        }
      }
    };

    fetchAuthors();
  }, [blogs, authors, runGetUserById]);

  const statusToFilterKey = (status: number): StatusFilterValue => {
    switch (status) {
      case BlogStatus.Pending:
        return "pending";
      case BlogStatus.Active:
        return "active";
      case BlogStatus.Inactive:
        return "inactive";
      case BlogStatus.Banned:
        return "banned";
      case BlogStatus.ReApply:
        return "reapply";
      default:
        return "all";
    }
  };

  const getStatusBadge = (status: number) => {
    const typedStatus = status as BlogStatus;
    const label = BLOG_STATUS_LABELS[typedStatus] ?? "Không xác định";

    switch (typedStatus) {
      case BlogStatus.Pending:
        return (
          <Badge className="bg-amber-50 text-amber-700">
            <Clock className="mr-1 size-3" />
            {label}
          </Badge>
        );
      case BlogStatus.Active:
        return (
          <Badge className="bg-emerald-50 text-emerald-700">
            <CheckCircle className="mr-1 size-3" />
            {label}
          </Badge>
        );
      case BlogStatus.Inactive:
        return (
          <Badge className="bg-rose-50 text-rose-600">
            <XCircle className="mr-1 size-3" />
            {label}
          </Badge>
        );
      case BlogStatus.Banned:
        return (
          <Badge className="bg-red-50 text-red-700">
            <ShieldBan className="mr-1 size-3" />
            {label}
          </Badge>
        );
      case BlogStatus.ReApply:
        return (
          <Badge className="bg-blue-50 text-blue-700">
            {label}
          </Badge>
        );
      default:
        return <Badge variant="outline">{label}</Badge>;
    }
  };

  const filteredBlogs = useMemo(() => {
    if (!blogs || blogs.length === 0) return [];
    return blogs
      .filter((blog) => {
        const matchesSearch =
          blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          blog.categoryName.toLowerCase().includes(searchTerm.toLowerCase());

        const filterKey = statusToFilterKey(blog.status);
        const matchesStatus =
          statusFilter === "all" || statusFilter === filterKey;

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => a.title.localeCompare(b.title));
  }, [blogs, searchTerm, statusFilter]);

  const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedBlogs = filteredBlogs.slice(startIndex, endIndex);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, itemsPerPage]);

  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToPreviousPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  const handleViewDetail = async (id: string) => {
    const res = await runGetBlogDetail({ id });
    if (res.ok && res.data?.value) {
      setSelectedBlog(res.data.value as BlogDetail);
    }
  };

  const updateBlogStatus = (id: string, status: BlogStatus) => {
    setBlogs((prev) =>
      prev.map((blog) =>
        blog.id === id ? { ...blog, status } : blog
      )
    );
  };

  const handleApprove = async (id: string) => {
    const res = await runApproveBlog({ id });
    if (res.ok) {
      updateBlogStatus(id, BlogStatus.Active);
    }
  };

  const handleReject = async (id: string) => {
    const res = await runRejectBlog({ id });
    if (res.ok) {
      updateBlogStatus(id, BlogStatus.Inactive);
    }
  };

  const handleBan = async (id: string) => {
    // Lưu trạng thái hiện tại trước khi chặn
    const blog = blogs.find((b) => b.id === id);
    if (blog) {
      setPreviousStatusBeforeBan((prev) => ({
        ...prev,
        [id]: blog.status as BlogStatus,
      }));
    }

    const res = await runBanBlog({ id });
    if (res.ok) {
      updateBlogStatus(id, BlogStatus.Banned);
    }
  };

  const handleUnban = async (id: string) => {
    const res = await runUnbanBlog({ id });
    if (res.ok) {
      // Khôi phục trạng thái trước khi bị chặn
      const previousStatus =
        previousStatusBeforeBan[id] ?? BlogStatus.Pending;
      updateBlogStatus(id, previousStatus);

      // Xóa khỏi map sau khi đã khôi phục
      setPreviousStatusBeforeBan((prev) => {
        const newMap = { ...prev };
        delete newMap[id];
        return newMap;
      });
    }
  };

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

  if (getBlogsLoading) {
    return (
      <div className="flex flex-col gap-4 h-[calc(100vh-10rem)] items-center justify-center">
        <Spinner variant="circle" className="size-10" />
        <p className="text-sm text-muted-foreground">
          Đang tải danh sách bài viết...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Quản Lý Bài Viết"
        description="Theo dõi, duyệt hoặc quản lý trạng thái các bài viết của giảng viên."
        className="space-y-4"
      />

      {/* Thống kê nhanh */}
      <Card className="rounded-3xl border bg-background shadow-sm">
        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <StatCard
              label="Tổng số bài viết"
              value={statusStats.total}
              icon={<FileText className="size-5" />}
              accent="bg-blue-50 text-blue-600"
            />
            <StatCard
              label="Chờ duyệt"
              value={statusStats.pending}
              icon={<Clock className="size-5" />}
              accent="bg-amber-50 text-amber-600"
            />
            <StatCard
              label="Đã duyệt"
              value={statusStats.active}
              icon={<CheckCircle className="size-5" />}
              accent="bg-emerald-50 text-emerald-600"
            />
            <StatCard
              label="Từ chối"
              value={statusStats.inactive}
              icon={<XCircle className="size-5" />}
              accent="bg-rose-50 text-rose-600"
            />
            <StatCard
              label="Bị chặn"
              value={statusStats.banned}
              icon={<ShieldBan className="size-5" />}
              accent="bg-red-50 text-red-600"
            />
          </div>
        </CardContent>
      </Card>

      {/* Bộ lọc & tìm kiếm */}
      <section className="rounded-3xl border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Tìm theo tiêu đề hoặc phân loại bài viết..."
              className="pl-10"
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={(value) =>
              setStatusFilter(
                value as StatusFilterValue
              )
            }
          >
            <SelectTrigger className="w-full md:w-56">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="pending">Chờ duyệt</SelectItem>
              <SelectItem value="active">Đã duyệt</SelectItem>
              <SelectItem value="inactive">Từ chối</SelectItem>
              <SelectItem value="banned">Bị chặn</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </section>

      {/* Bảng danh sách bài viết */}
      <section className="rounded-3xl border bg-card p-6 shadow-sm">
        <div className="overflow-x-auto rounded-2xl border">
          <Table>
            <TableHeader className="bg-muted/60 text-xs uppercase text-muted-foreground">
              <TableRow>
                <TableHead className="text-center font-semibold">STT</TableHead>
                <TableHead>Tiêu đề</TableHead>
                <TableHead>Tác giả</TableHead>
                <TableHead>Phân loại</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-center">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedBlogs.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-8 text-center text-sm text-muted-foreground"
                  >
                    Không tìm thấy bài viết phù hợp.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedBlogs.map((blog, index) => {
                  const status = blog.status as BlogStatus;
                  const authorName =
                    (blog.instructorId && authors[blog.instructorId]) ||
                    "Chưa cập nhật";

                  return (
                    <TableRow
                      key={blog.id}
                      className="hover:bg-muted/30"
                    >
                      <TableCell className="text-center text-sm font-semibold text-muted-foreground">
                        {startIndex + index + 1}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="relative h-10 w-16 overflow-hidden rounded-md border bg-muted">
                            <Image
                              src={normalizeImageSrc(blog.thumbnailUrl)}
                              alt={blog.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="space-y-1">
                            <p className="line-clamp-2 font-medium">
                              {blog.title}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {authorName}
                      </TableCell>
                      <TableCell className="text-sm">
                        {blog.categoryName}
                      </TableCell>
                      <TableCell>{getStatusBadge(blog.status)}</TableCell>
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
                                onSelect={() => handleViewDetail(blog.id)}
                              >
                                <Eye className="mr-2 size-4" />
                                Xem chi tiết
                              </DropdownMenuItem>

            
                              {status === BlogStatus.Pending && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => handleApprove(blog.id)}
                                    className="text-emerald-600"
                                  >
                                    <CheckCircle className="mr-2 size-4" />
                                    Duyệt bài viết
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleReject(blog.id)}
                                    className="text-rose-600"
                                  >
                                    <XCircle className="mr-2 size-4" />
                                    Từ chối bài viết
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleBan(blog.id)}
                                    className="text-red-600"
                                  >
                                    <ShieldBan className="mr-2 size-4" />
                                    Chặn bài viết
                                  </DropdownMenuItem>
                                </>
                              )}

                              {status === BlogStatus.Active && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => handleBan(blog.id)}
                                    className="text-red-600"
                                  >
                                    <ShieldBan className="mr-2 size-4" />
                                    Chặn bài viết
                                  </DropdownMenuItem>
                                </>
                              )}

                              {status === BlogStatus.Banned && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => handleUnban(blog.id)}
                                    className="text-emerald-600"
                                  >
                                    <ShieldBan className="mr-2 size-4 rotate-180" />
                                    Bỏ chặn
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

        {/* Pagination */}
        <div className="mt-6 flex flex-col gap-4 rounded-2xl bg-muted/20 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs text-muted-foreground sm:text-sm">
            Hiển thị {paginatedBlogs.length}/{filteredBlogs.length} bài viết.
          </div>
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Số hàng
              </span>
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
                Trang {currentPage}/{totalPages || 1}
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
      </section>

{/* Category management section */}
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

              {/* Hàng thêm phân loại mới */}
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

      {/* Dialog blog detail */}
      {selectedBlog && (
        <Dialog
          open={!!selectedBlog}
          onOpenChange={(open) => !open && setSelectedBlog(null)}
        >
          <DialogContent className="max-w-6xl xl:max-w-7xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Chi tiết bài viết</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="rounded-xl border bg-muted/30 p-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <InfoItem label="Tiêu đề" value={selectedBlog.title} />
                  <InfoItem
                    label="Tác giả"
                    value={selectedBlogAuthorName}
                  />
                  <InfoItem
                    label="Phân loại"
                    value={selectedBlog.categoryName}
                  />
                </div>
              </div>

              <SectionShell title="Ảnh bìa">
                <ImageTile
                  label="ẢNH THUMBNAIL"
                  src={selectedBlog.thumbnailUrl || null}
                />
              </SectionShell>

              <SectionShell title="Nội dung">
                <div className="prose prose-sm max-w-none text-foreground dark:prose-invert">
                  <div
                    className="space-y-4 text-sm leading-relaxed prose-headings:mb-3 prose-p:mb-4 prose-strong:font-semibold"
                    dangerouslySetInnerHTML={{
                      __html:
                        selectedBlog.content ||
                        "<p>Chưa có nội dung.</p>",
                    }}
                  />
                </div>
              </SectionShell>

              <SectionShell title="Thư viện hình ảnh">
                {selectedBlog.imageList?.length ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {selectedBlog.imageList.map((image, index) => (
                      <ImageTile
                        key={`${selectedBlog.id}-gallery-${index}`}
                        label={`Hình ${index + 1}`}
                        src={image || null}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Bài viết chưa có hình ảnh bổ sung.
                  </p>
                )}
              </SectionShell>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function SectionShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border bg-card p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      </div>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="space-y-1">
      <Label className="text-xs font-semibold uppercase text-muted-foreground">
        {label}
      </Label>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}

function ImageTile({ label, src }: { label: string; src: string | null }) {
  return (
    <div className="space-y-2">
      <Label className="text-xs font-medium text-muted-foreground">
        {label}
      </Label>
      {src ? (
        <div className="relative h-48 w-full overflow-hidden rounded-lg border bg-muted">
          <Image
            src={normalizeImageSrc(src)}
            alt={label}
            fill
            className="object-cover"
          />
        </div>
      ) : (
        <div className="flex h-48 w-full items-center justify-center rounded-lg border bg-muted text-xs text-muted-foreground">
          Chưa tải
        </div>
      )}
    </div>
  );
}

interface StatCardProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  value: number;
  subtitle?: string;
  className?: string;
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


