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
import blogsData from "@/data/mock-blogs.json";
import { BlogCard } from "@/components/blogs/blog-card";

type BlogPost = (typeof blogsData.blogs)[number];

export default function BlogsInstructorManagementPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>(() => blogsData.blogs);
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
    return {
      total: posts.length,
    };
  }, [posts]);

  const handleDelete = (id: string) => {
    if (window.confirm("Bạn có chắc muốn xóa bài viết này?")) {
      setPosts((prev) => prev.filter((post) => post.id !== id));
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Quản Lý Bài Viết"
        description="Theo dõi, tìm kiếm và tạo mới các bài viết trên hệ thống."
        actionButton={{
          label: "Tạo bài viết",
          onClick: () => router.push("/blogs/new/form"),
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
        {paginatedPosts.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {paginatedPosts.map((post) => (
              <BlogCard
                key={post.id}
                id={post.id}
                title={post.title}
                content={post.content}
                image={post.image}
                publishedAt={post.publishedAt}
                variant="inspector"
              />
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
