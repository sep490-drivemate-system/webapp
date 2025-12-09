"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import PageHeader from "@/components/commons/Header/header";
import { Post, PostStatus } from "@/types/post/post.type";
import postsData from "@/data/mock-posts.json";
import { Badge } from "@/components/ui/badge";

// Mock current user
const currentUser = {
  id: "user_001",
};

export default function PostDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const postId = params.id;

  const post = (postsData.posts as Post[]).find((p) => p.id === postId);

  if (!post) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Chi tiết bài viết"
          description="Bài viết không tồn tại"
          leftAction={
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="size-6" />
            </Button>
          }
        />
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Bài viết không tồn tại</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusBadge = (status: PostStatus) => {
    const variants: Record<
      PostStatus,
      "default" | "secondary" | "destructive"
    > = {
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
    return <Badge variant={variants[status]}>{labels[status]}</Badge>;
  };

  // Find moderation record
  const moderation = (postsData.moderations as any[]).find(
    (m) => m.postId === postId
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Chi tiết bài viết"
        description="Xem chi tiết bài viết của bạn"
        leftAction={
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="size-6" />
          </Button>
        }
      />

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            {/* Status Badge */}
            <div className="flex items-center justify-between">
              <div>{getStatusBadge(post.status)}</div>
              {post.status !== PostStatus.PUBLISHED && (
                <Button
                  variant="outline"
                  onClick={() =>
                    router.push(`/instructor/post-management/${post.id}/edit`)
                  }
                >
                  <Edit className="mr-2 size-4" />
                  Chỉnh sửa
                </Button>
              )}
            </div>

            {/* Thumbnail */}
            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
              <Image
                src={post.thumbnail}
                alt={post.title}
                fill
                className="object-cover"
              />
            </div>

            {/* Title and Meta */}
            <div>
              <h1 className="mb-3 text-4xl font-bold">{post.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span>
                  {new Date(post.createdAt).toLocaleDateString("vi-VN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                {post.publishedAt && (
                  <span>
                    Xuất bản:{" "}
                    {new Date(post.publishedAt).toLocaleDateString("vi-VN")}
                  </span>
                )}
                {post.views > 0 && <span>{post.views} lượt xem</span>}
                {post.likes > 0 && <span>{post.likes} lượt thích</span>}
              </div>
            </div>

            {/* Moderation Info */}
            {moderation && (
              <Card className="bg-muted/50">
                <CardContent className="pt-6">
                  <h3 className="mb-2 font-semibold">Thông tin kiểm duyệt</h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">Trạng thái:</span>{" "}
                      {moderation.status === "APPROVED"
                        ? "Đã duyệt"
                        : moderation.status === "REJECTED"
                        ? "Bị từ chối"
                        : "Đang chờ"}
                    </p>
                    {moderation.reviewNote && (
                      <p>
                        <span className="font-medium">Ghi chú:</span>{" "}
                        {moderation.reviewNote}
                      </p>
                    )}
                    {moderation.rejectionReason && (
                      <p className="text-destructive">
                        <span className="font-medium">Lý do từ chối:</span>{" "}
                        {moderation.rejectionReason}
                      </p>
                    )}
                    {moderation.reviewedAt && (
                      <p>
                        <span className="font-medium">Ngày duyệt:</span>{" "}
                        {new Date(moderation.reviewedAt).toLocaleDateString(
                          "vi-VN"
                        )}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Content */}
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Gallery */}
            {post.galleryImages && post.galleryImages.length > 0 && (
              <div>
                <h2 className="mb-4 text-2xl font-bold">Hình ảnh bổ sung</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {post.galleryImages.map((image, index) => (
                    <div
                      key={index}
                      className="relative aspect-video overflow-hidden rounded-lg bg-muted"
                    >
                      <Image
                        src={image}
                        alt={`Hình ảnh ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Video */}
            {post.videoUrl && (
              <div>
                <h2 className="mb-4 text-2xl font-bold">Video</h2>
                <div className="aspect-video w-full overflow-hidden rounded-lg">
                  <iframe
                    src={post.videoUrl}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

