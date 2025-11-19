"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eye,
  Plus,
  Search,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import blogsData from "@/data/mock-blogs.json";

type BlogPost = (typeof blogsData.blogs)[number] & {
  status?: "published" | "draft" | "scheduled";
};

export default function BlogsInstructorManagementPage() {
  const [posts, setPosts] = useState<BlogPost[]>(() =>
    blogsData.blogs.map((post) => ({
      ...post,
      status: "published" as const,
    }))
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  const filteredPosts = useMemo(() => {
    return posts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [posts, searchTerm]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredPosts.length / itemsPerPage)
  );
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPosts = filteredPosts.slice(
    startIndex,
    startIndex + itemsPerPage
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

  const stats = useMemo(() => {
    const published = posts.filter(
      (post) => post.status === "published"
    ).length;
    const drafts = posts.filter((post) => post.status === "draft").length;
    const scheduled = posts.filter(
      (post) => post.status === "scheduled"
    ).length;
    return {
      total: posts.length,
      published,
      drafts,
      scheduled,
    };
  }, [posts]);

  const handleDelete = (id: string) => {
    if (window.confirm("Bạn có chắc muốn xóa bài viết này?")) {
      setPosts((prev) => prev.filter((post) => post.id !== id));
    }
  };

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border bg-background shadow-sm">
        <CardHeader className="flex flex-col gap-4 border-b bg-muted/20 p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="text-2xl font-semibold text-foreground">
              Quản lý bài viết
            </CardTitle>
            <CardDescription>
              Theo dõi, tìm kiếm và tạo mới các bài viết trên hệ thống.
            </CardDescription>
          </div>
          <Link href="/blogs/new/form">
            <button className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-full font-medium shadow-lg hover:shadow-xl hover:from-green-500 hover:to-green-600 transition-all active:scale-95">
              <Plus size={18} />
              <span>Tạo bài viết</span>
            </button>
          </Link>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Tổng bài viết" value={stats.total} />
            <StatCard
              label="Đã xuất bản"
              value={stats.published}
              accent="text-emerald-600"
            />
            <StatCard
              label="Lên lịch"
              value={stats.scheduled}
              accent="text-blue-600"
            />
            <StatCard
              label="Bản nháp"
              value={stats.drafts}
              accent="text-amber-600"
            />
          </div>
        </CardContent>
      </section>

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
        {paginatedPosts.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {paginatedPosts.map((post) => (
              <BlogCardItem key={post.id} post={post} onDelete={handleDelete} />
            ))}
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
            Hiển thị {paginatedPosts.length}/{filteredPosts.length} bài viết.
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

function BlogCardItem({
  post,
  onDelete,
}: {
  post: BlogPost;
  onDelete: (id: string) => void;
}) {
  const formattedDate = new Date(post.publishedAt).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <div className="aspect-video w-full overflow-hidden bg-muted">
        <img
          src={post.image}
          alt={post.title}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <CardHeader className="space-y-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{formattedDate}</span>
          <Badge variant="secondary" className="text-[11px] font-medium">
            {post.category}
          </Badge>
        </div>
        <CardTitle className="line-clamp-2 text-lg">{post.title}</CardTitle>
        <CardDescription className="line-clamp-3">
          {post.excerpt}
        </CardDescription>
      </CardHeader>
      <CardContent className="mt-auto space-y-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-3">
          <Image
            src={post.author.avatar || "/placeholder.svg"}
            alt={post.author.name}
            width={40}
            height={40}
            className="rounded-full object-cover"
          />
          <div>
            <p className="font-medium text-foreground">{post.author.name}</p>
            <p className="text-xs">{post.author.role}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-end gap-2 border-t bg-muted/30">
        <Button
          variant="outline"
          size="sm"
          className="gap-2 border border-border"
          asChild
        >
          <Link href={`/blogs-detail/${post.id}`}>
            <Eye className="size-4" />
            Xem chi tiết
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
