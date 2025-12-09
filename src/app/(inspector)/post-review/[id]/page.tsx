"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { ArrowLeft, CheckCircle, XCircle, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import PageHeader from "@/components/commons/Header/header";
import {
  Post,
  PostStatus,
  ModerationStatus,
  PostModeration,
} from "@/types/post/post.type";
import postsData from "@/data/mock-posts.json";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Mock current inspector
const currentInspector = {
  id: "user_inspector_001",
  name: "Hoàng Văn Đức",
  email: "hoangvanduc@example.com",
  avatar: "https://i.pravatar.cc/150?img=12",
  role: "INSPECTOR",
};

export default function PostReviewDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const postId = params.id;
  const [reviewNote, setReviewNote] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleApprove = async () => {
    setIsSubmitting(true);
    try {
      // Update post status
      post.status = PostStatus.PUBLISHED;
      post.publishedAt = new Date().toISOString();

      // Update or create moderation record
      let moderation = (postsData.moderations as any[]).find(
        (m) => m.postId === postId
      );
      if (moderation) {
        moderation.status = ModerationStatus.APPROVED;
        moderation.reviewNote = reviewNote || "Bài viết đã được duyệt.";
        moderation.reviewedAt = new Date().toISOString();
        moderation.inspectorId = currentInspector.id;
        moderation.inspector = currentInspector;
      } else {
        const newModeration: PostModeration = {
          id: `mod_${Date.now()}`,
          postId: postId,
          inspectorId: currentInspector.id,
          inspector: currentInspector,
          status: ModerationStatus.APPROVED,
          reviewNote: reviewNote || "Bài viết đã được duyệt.",
          createdAt: new Date().toISOString(),
          reviewedAt: new Date().toISOString(),
        };
        (postsData.moderations as any[]).push(newModeration);
      }

      toast.success("Bài viết đã được duyệt và xuất bản!");
      router.push("/inspector/post-review");
    } catch (error) {
      toast.error("Có lỗi xảy ra khi duyệt bài viết.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error("Vui lòng nhập lý do từ chối.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Update post status
      post.status = PostStatus.REJECTED;

      // Update or create moderation record
      let moderation = (postsData.moderations as any[]).find(
        (m) => m.postId === postId
      );
      if (moderation) {
        moderation.status = ModerationStatus.REJECTED;
        moderation.rejectionReason = rejectionReason;
        moderation.reviewedAt = new Date().toISOString();
        moderation.inspectorId = currentInspector.id;
        moderation.inspector = currentInspector;
      } else {
        const newModeration: PostModeration = {
          id: `mod_${Date.now()}`,
          postId: postId,
          inspectorId: currentInspector.id,
          inspector: currentInspector,
          status: ModerationStatus.REJECTED,
          rejectionReason: rejectionReason,
          createdAt: new Date().toISOString(),
          reviewedAt: new Date().toISOString(),
        };
        (postsData.moderations as any[]).push(newModeration);
      }

      toast.success("Bài viết đã bị từ chối.");
      setShowRejectDialog(false);
      router.push("/inspector/post-review");
    } catch (error) {
      toast.error("Có lỗi xảy ra khi từ chối bài viết.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Kiểm Duyệt Bài Viết"
        description="Xem chi tiết và quyết định duyệt hoặc từ chối bài viết"
        leftAction={
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="size-6" />
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
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
                    <span>Tác giả: {post.author.name}</span>
                    <span>•</span>
                    <span>
                      {new Date(post.createdAt).toLocaleDateString("vi-VN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                    <span>•</span>
                    <span>Danh mục: {post.category}</span>
                  </div>
                </div>

                {/* Content */}
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Gallery */}
                {post.galleryImages && post.galleryImages.length > 0 && (
                  <div>
                    <h2 className="mb-4 text-2xl font-bold">
                      Hình ảnh bổ sung
                    </h2>
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

        {/* Review Panel */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Quyết định kiểm duyệt</h3>

                <div className="space-y-2">
                  <Label htmlFor="reviewNote">Ghi chú (tùy chọn)</Label>
                  <Textarea
                    id="reviewNote"
                    placeholder="Nhập ghi chú cho tác giả..."
                    value={reviewNote}
                    onChange={(e) => setReviewNote(e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Button
                    variant="default"
                    className="w-full"
                    onClick={handleApprove}
                    disabled={isSubmitting}
                  >
                    <CheckCircle className="mr-2 size-4" />
                    Duyệt bài viết
                  </Button>
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={() => setShowRejectDialog(true)}
                    disabled={isSubmitting}
                  >
                    <XCircle className="mr-2 size-4" />
                    Từ chối bài viết
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Từ chối bài viết</DialogTitle>
            <DialogDescription>
              Vui lòng nhập lý do từ chối bài viết này. Lý do này sẽ được gửi
              đến tác giả.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="rejectionReason">Lý do từ chối *</Label>
            <Textarea
              id="rejectionReason"
              placeholder="Nhập lý do từ chối..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
              required
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowRejectDialog(false);
                setRejectionReason("");
              }}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={isSubmitting || !rejectionReason.trim()}
            >
              Xác nhận từ chối
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

