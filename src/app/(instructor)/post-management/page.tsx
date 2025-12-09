"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Eye, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PageHeader from "@/components/commons/Header/header";
import { Post, PostStatus } from "@/types/post/post.type";
import postsData from "@/data/mock-posts.json";
import { Badge } from "@/components/ui/badge";

// Mock current user (instructor)
const currentUser = {
  id: "user_001",
  role: "INSTRUCTOR",
};

export default function PostManagementPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<PostStatus | "ALL">("ALL");

  // Filter posts by current instructor
  const myPosts = useMemo(() => {
    return (postsData.posts as Post[]).filter(
      (post) => post.author.id === currentUser.id
    );
  }, []);

  const filteredPosts = useMemo(() => {
    return myPosts.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "ALL" || post.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [myPosts, searchTerm, statusFilter]);

  const getStatusBadge = (status: PostStatus) => {
    const variants: Record<PostStatus, "default" | "secondary" | "destructive"> =
      {
        [PostStatus.PUBLISHED]: "default",
        [PostStatus.PENDING_REVIEW]: "secondary",
        [PostStatus.REJECTED]: "destructive",
        [PostStatus.DRAFT]: "secondary",
      };
    const labels: Record<PostStatus, string> = {
      [PostStatus.PUBLISHED]: "Đã xuất bản",
      [PostStatus.PENDING_REVIEW]: "Chờ duyệt",
      [PostStatus.REJECTED]: "Bị từ chối",
      [PostStatus.DRAFT]: "Bản nháp",
    };
    return (
      <Badge variant={variants[status]}>{labels[status]}</Badge>
    );
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Bạn có chắc muốn xóa bài viết này?")) {
      // In real app, call API to delete
      console.log("Delete post:", id);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quản Lý Bài Viết"
        description="Tạo và quản lý các bài viết của bạn"
        actionButton={{
          label: "Tạo bài viết mới",
          onClick: () => router.push("/instructor/post-management/create"),
          icon: Plus,
        }}
      />

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm bài viết..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === "ALL" ? "default" : "outline"}
                onClick={() => setStatusFilter("ALL")}
                size="sm"
              >
                Tất cả
              </Button>
              <Button
                variant={
                  statusFilter === PostStatus.PENDING_REVIEW
                    ? "default"
                    : "outline"
                }
                onClick={() => setStatusFilter(PostStatus.PENDING_REVIEW)}
                size="sm"
              >
                Chờ duyệt
              </Button>
              <Button
                variant={
                  statusFilter === PostStatus.PUBLISHED ? "default" : "outline"
                }
                onClick={() => setStatusFilter(PostStatus.PUBLISHED)}
                size="sm"
              >
                Đã xuất bản
              </Button>
              <Button
                variant={
                  statusFilter === PostStatus.REJECTED ? "default" : "outline"
                }
                onClick={() => setStatusFilter(PostStatus.REJECTED)}
                size="sm"
              >
                Bị từ chối
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Posts List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredPosts.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== "ALL"
                  ? "Không tìm thấy bài viết nào."
                  : "Bạn chưa có bài viết nào. Hãy tạo bài viết mới!"}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredPosts.map((post) => (
            <Card key={post.id} className="flex flex-col">
              <div className="aspect-video w-full overflow-hidden bg-muted">
                <img
                  src={post.thumbnail}
                  alt={post.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="line-clamp-2 text-lg">
                    {post.title}
                  </CardTitle>
                  {getStatusBadge(post.status)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                </p>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="line-clamp-3 text-sm text-muted-foreground">
                  {post.excerpt || post.content.replace(/<[^>]*>/g, "").substring(0, 150)}
                </p>
              </CardContent>
              <CardContent className="flex gap-2 border-t pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() =>
                    router.push(`/instructor/post-management/${post.id}`)
                  }
                >
                  <Eye className="mr-2 size-4" />
                  Xem
                </Button>
                {post.status !== PostStatus.PUBLISHED && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() =>
                      router.push(
                        `/instructor/post-management/${post.id}/edit`
                      )
                    }
                  >
                    <Edit className="mr-2 size-4" />
                    Sửa
                  </Button>
                )}
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(post.id)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

