"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, Eye, CheckCircle, XCircle, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PageHeader from "@/components/commons/Header/header";
import { Post, PostStatus, ModerationStatus } from "@/types/post/post.type";
import postsData from "@/data/mock-posts.json";
import { Badge } from "@/components/ui/badge";

export default function PostReviewPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  // Get posts pending review
  const pendingPosts = useMemo(() => {
    return (postsData.posts as Post[]).filter(
      (post) => post.status === PostStatus.PENDING_REVIEW
    );
  }, []);

  const filteredPosts = useMemo(() => {
    return pendingPosts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [pendingPosts, searchTerm]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Kiểm Duyệt Bài Viết"
        description="Xem và duyệt các bài viết đang chờ kiểm duyệt"
      />

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm bài viết..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tổng số bài chờ duyệt
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pendingPosts.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Đã duyệt hôm nay
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Đang xử lý
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{filteredPosts.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Posts List */}
      {filteredPosts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              {searchTerm
                ? "Không tìm thấy bài viết nào."
                : "Không có bài viết nào đang chờ duyệt."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post) => (
            <Card key={post.id} className="flex flex-col">
              <div className="aspect-video w-full overflow-hidden bg-muted">
                <img
                  src={post.thumbnail}
                  alt={post.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle className="line-clamp-2 text-lg">
                  {post.title}
                </CardTitle>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Tác giả: {post.author.name}</span>
                  <span>•</span>
                  <span>
                    {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                  </span>
                </div>
                <Badge variant="secondary">Chờ duyệt</Badge>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="line-clamp-3 text-sm text-muted-foreground">
                  {post.excerpt ||
                    post.content.replace(/<[^>]*>/g, "").substring(0, 150)}
                </p>
              </CardContent>
              <CardContent className="flex gap-2 border-t pt-4">
                <Button
                  variant="default"
                  size="sm"
                  className="flex-1"
                  onClick={() => router.push(`/post-review/${post.id}`)}
                >
                  <Eye className="mr-2 size-4" />
                  Xem & Duyệt
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
