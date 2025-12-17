"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Plus,
  Search,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/commons/Header/header";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BlogCard } from "@/components/blogs/blog-card";
import { Badge } from "@/components/ui/badge";
import { useAppDispatch, useAppSelector } from "@/lib/redux/useAppDispatch";
import { getListBlogsForInstructor } from "@/features/blog/blogThunk";
import { BlogForInstructor } from "@/types/blog/blog.type";
import { BlogStatus, BLOG_STATUS_LABELS } from "@/types/blog/blog.enum";

export default function BlogsInstructorManagementPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { blogs, pagination, isLoading, errorMessage } = useAppSelector(
    (state) => state.blog
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  // Fetch blogs on component mount and when pagination changes
  useEffect(() => {
    dispatch(
      getListBlogsForInstructor({
        pageNumber: currentPage,
        pageSize: itemsPerPage,
      })
    );
  }, [dispatch, currentPage, itemsPerPage]);

  // Client-side filtering for search
  const filteredPosts = useMemo(() => {
    if (!searchTerm) return blogs;
    return blogs.filter(
      (post) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [blogs, searchTerm]);

  // Use API pagination if available, otherwise use client-side pagination
  const totalPages = pagination
    ? Math.max(1, Math.ceil(pagination.totalCount / itemsPerPage))
    : Math.max(1, Math.ceil(filteredPosts.length / itemsPerPage));

  // If using API pagination, show all filtered results. Otherwise, slice for client-side pagination
  const paginatedPosts = pagination
    ? filteredPosts
    : filteredPosts.slice(
        (currentPage - 1) * itemsPerPage,
        (currentPage - 1) * itemsPerPage + itemsPerPage
      );

  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToPreviousPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, itemsPerPage]);

  // Map BlogForInstructor to BlogCard props
  const statusStyle = (status?: number) => {
    const base = "bg-muted text-muted-foreground";
    switch (status) {
      case BlogStatus.Pending:
        return "bg-amber-100 text-amber-700";
      case BlogStatus.Active:
        return "bg-emerald-100 text-emerald-700";
      case BlogStatus.Inactive:
        return "bg-slate-200 text-slate-700";
      case BlogStatus.ReApply:
        return "bg-blue-100 text-blue-700";
      case BlogStatus.Banned:
        return "bg-red-100 text-red-700";
      default:
        return base;
    }
  };

  const mapBlogToCardProps = (blog: BlogForInstructor) => ({
    id: blog.id,
    title: blog.title,
    content: blog.categoryName || "",
    image: blog.thumbnailUrl,
    publishedAt: new Date().toISOString(),
    statusLabel: BLOG_STATUS_LABELS[blog.status as BlogStatus] || "Không xác định",
    statusClassName: statusStyle(blog.status),
  });

  return (
    <div className="space-y-8">
      <PageHeader
        title="Quản Lý Bài Viết"
        description="Theo dõi, tìm kiếm và tạo mới các bài viết trên hệ thống."
        actionButton={{
          label: "Tạo bài viết",
          onClick: () => router.push("/blog-management/new/form"),
          icon: Plus,
        }}
        className="space-y-4"
      />

      <section className="rounded-3xl border bg-card p-6 shadow-sm">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm bài viết theo tiêu đề hoặc nội dung..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="pl-10"
          />
        </div>
      </section>

      <section className="rounded-3xl border bg-card p-6 shadow-sm">
        {isLoading ? (
          <div className="py-16 text-center">
            <p className="text-muted-foreground text-lg">
              Đang tải danh sách bài viết...
            </p>
          </div>
        ) : errorMessage ? (
          <div className="py-16 text-center">
            <p className="text-destructive text-lg">{errorMessage}</p>
          </div>
        ) : paginatedPosts.length > 0 ? (
          <div className="grid auto-rows-fr gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {paginatedPosts.map((post) => {
              const cardProps = mapBlogToCardProps(post as BlogForInstructor);
              return <BlogCard key={post.id} {...cardProps} variant="instructor" />;
            })}
          </div>
        ) : (
          <div className="py-16 text-center">
            <p className="text-muted-foreground text-lg">
              {searchTerm
                ? "Không tìm thấy bài viết nào phù hợp."
                : "Chưa có bài viết nào được tạo."}
            </p>
          </div>
        )}
        <div className="mt-6 flex flex-col gap-4 rounded-2xl bg-muted/20 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs text-muted-foreground sm:text-sm">
            Hiển thị {paginatedPosts.length}/
            {pagination?.totalCount || filteredPosts.length} bài viết.
          </div>
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Số bài viết</span>
              <Select
                value={`${itemsPerPage}`}
                onValueChange={(value) => setItemsPerPage(Number(value))}
              >
                <SelectTrigger className="h-8 w-20 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent side="top">
                  {[3, 6, 9, 12].map((size) => (
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
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: string;
}) {
  return (
    <Card className="border-none bg-white shadow-inner">
      <CardHeader className="space-y-1 pb-2">
        <CardDescription className="text-xs uppercase tracking-wide">
          {label}
        </CardDescription>
        <CardTitle className={`text-2xl ${accent ?? ""}`}>{value}</CardTitle>
      </CardHeader>
      <CardContent />
    </Card>
  );
}
