"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ThumbsUp, ThumbsDown, MessageCircle, Share2, Bookmark, ArrowLeft, Eye, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Post, PostStatus, Comment, ReactionType } from "@/types/post/post.type";
import postsData from "@/data/mock-posts.json";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

// Mock current user (novice driver)
const currentUser = {
  id: "user_novice_001",
  name: "Trần Văn Nam",
  email: "tranvannam@example.com",
  avatar: "https://i.pravatar.cc/150?img=20",
  role: "NOVICE_DRIVER",
};

export default function ForumPostDetailPage() {
  const params = useParams<{ id: string }>();
  const postId = params.id;
  const [commentContent, setCommentContent] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");

  const post = (postsData.posts as Post[]).find(
    (p) => p.id === postId && p.status === PostStatus.PUBLISHED
  );

  // Get comments for this post
  const comments = useMemo(() => {
    const allComments = (postsData.comments as Comment[]).filter(
      (c) => c.postId === postId
    );
    // Build comment tree
    const rootComments = allComments.filter((c) => !c.parentId);
    return rootComments.map((root) => {
      const replies = allComments.filter((r) => r.parentId === root.id);
      return { ...root, replies };
    });
  }, [postId]);

  // Get reactions for this post
  const reactions = useMemo(() => {
    return (postsData.reactions as any[]).filter(
      (r) => r.postId === postId
    );
  }, [postId]);

  const userReaction = useMemo(() => {
    return reactions.find((r) => r.userId === currentUser.id);
  }, [reactions]);

  const likeCount = reactions.filter((r) => r.type === ReactionType.LIKE).length;
  const dislikeCount = reactions.filter(
    (r) => r.type === ReactionType.DISLIKE
  ).length;

  if (!post) {
    return (
      <div className="pt-24 pb-12 min-h-screen">
        <div className="container mx-auto px-4">
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                Bài viết không tồn tại hoặc chưa được xuất bản.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const handleReaction = (type: ReactionType) => {
    // Check if user already reacted
    const existingReaction = reactions.find(
      (r) => r.userId === currentUser.id && r.postId === postId
    );

    if (existingReaction) {
      if (existingReaction.type === type) {
        // Remove reaction
        const index = (postsData.reactions as any[]).findIndex(
          (r) => r.id === existingReaction.id
        );
        if (index > -1) {
          (postsData.reactions as any[]).splice(index, 1);
        }
        toast.success("Đã bỏ " + (type === ReactionType.LIKE ? "thích" : "không thích"));
      } else {
        // Change reaction
        existingReaction.type = type;
        toast.success(
          "Đã " + (type === ReactionType.LIKE ? "thích" : "không thích") + " bài viết"
        );
      }
    } else {
      // Add new reaction
      const newReaction = {
        id: `reaction_${Date.now()}`,
        postId: postId,
        userId: currentUser.id,
        user: currentUser,
        type: type,
        createdAt: new Date().toISOString(),
      };
      (postsData.reactions as any[]).push(newReaction);
      toast.success(
        "Đã " + (type === ReactionType.LIKE ? "thích" : "không thích") + " bài viết"
      );
    }
    // Force re-render
    window.location.reload();
  };

  const handleComment = () => {
    if (!commentContent.trim()) {
      toast.error("Vui lòng nhập nội dung bình luận.");
      return;
    }

    const newComment: Comment = {
      id: `comment_${Date.now()}`,
      postId: postId,
      userId: currentUser.id,
      user: currentUser,
      content: commentContent,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      likes: 0,
      dislikes: 0,
    };

    (postsData.comments as any[]).push(newComment);
    setCommentContent("");
    toast.success("Đã thêm bình luận!");
    window.location.reload();
  };

  const handleReply = (parentId: string) => {
    if (!replyContent.trim()) {
      toast.error("Vui lòng nhập nội dung phản hồi.");
      return;
    }

    const newReply: Comment = {
      id: `comment_${Date.now()}`,
      postId: postId,
      userId: currentUser.id,
      user: currentUser,
      content: replyContent,
      parentId: parentId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      likes: 0,
      dislikes: 0,
    };

    (postsData.comments as any[]).push(newReply);
    setReplyContent("");
    setReplyingTo(null);
    toast.success("Đã thêm phản hồi!");
    window.location.reload();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const router = useRouter();
  const commentsCount = comments.length;

  return (
    <div className="pt-24 pb-12 min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/forum">Diễn đàn</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={`/forum?category=${post.category}`}>
                  {post.category}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="line-clamp-1">{post.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Back Button */}
        <div className="mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="gap-2"
          >
            <ArrowLeft className="size-4" />
            Quay lại
          </Button>
        </div>

        {/* Thread Header Stats */}
        <Card className="mb-4">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Eye className="size-4" />
                  <span>{post.views} lượt xem</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MessageCircle className="size-4" />
                  <span>{commentsCount} trả lời</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="size-4" />
                  <span>
                    {formatDate(post.publishedAt || post.createdAt)}
                  </span>
                </div>
              </div>
              <Badge variant="outline">{post.category}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Post Content */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="space-y-6">
              {/* Thread Header */}
              <div className="border-b pb-4">
                <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={post.author.avatar} />
                      <AvatarFallback>
                        {post.author.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{post.author.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {post.author.role === "INSTRUCTOR" ? "Giáo viên" : "Thành viên"}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Đã tạo {formatDate(post.createdAt)}
                      </p>
                    </div>
                  </div>
                  {post.tags.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap">
                      {post.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
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

              {/* Content */}
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

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

              {/* Actions */}
              <div className="flex items-center gap-4 border-t pt-4">
                <Button
                  variant={userReaction?.type === ReactionType.LIKE ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleReaction(ReactionType.LIKE)}
                >
                  <ThumbsUp className="mr-2 size-4" />
                  {likeCount}
                </Button>
                <Button
                  variant={userReaction?.type === ReactionType.DISLIKE ? "destructive" : "outline"}
                  size="sm"
                  onClick={() => handleReaction(ReactionType.DISLIKE)}
                >
                  <ThumbsDown className="mr-2 size-4" />
                  {dislikeCount}
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="mr-2 size-4" />
                  Chia sẻ
                </Button>
                <Button variant="outline" size="sm">
                  <Bookmark className="mr-2 size-4" />
                  Lưu
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comments Section */}
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-bold">
              Bình luận ({comments.length})
            </h2>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Comment Form */}
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <Avatar>
                  <AvatarImage src={currentUser.avatar} />
                  <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <Textarea
                    placeholder="Viết bình luận..."
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    rows={3}
                  />
                  <Button onClick={handleComment} size="sm">
                    <MessageCircle className="mr-2 size-4" />
                    Gửi bình luận
                  </Button>
                </div>
              </div>
            </div>

            {/* Comments List */}
            <div className="space-y-6">
              {comments.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
                </p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="space-y-4">
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarImage src={comment.user.avatar} />
                        <AvatarFallback>
                          {comment.user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold">{comment.user.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(comment.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm mb-2">{comment.content}</p>
                        <div className="flex items-center gap-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setReplyingTo(
                                replyingTo === comment.id ? null : comment.id
                              )
                            }
                          >
                            <MessageCircle className="mr-2 size-4" />
                            Phản hồi
                          </Button>
                        </div>

                        {/* Reply Form */}
                        {replyingTo === comment.id && (
                          <div className="mt-4 ml-8 space-y-2">
                            <Textarea
                              placeholder="Viết phản hồi..."
                              value={replyContent}
                              onChange={(e) => setReplyContent(e.target.value)}
                              rows={2}
                            />
                            <div className="flex gap-2">
                              <Button
                                onClick={() => handleReply(comment.id)}
                                size="sm"
                              >
                                Gửi
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setReplyingTo(null);
                                  setReplyContent("");
                                }}
                              >
                                Hủy
                              </Button>
                            </div>
                          </div>
                        )}

                        {/* Replies */}
                        {comment.replies && comment.replies.length > 0 && (
                          <div className="mt-4 ml-8 space-y-4">
                            {comment.replies.map((reply) => (
                              <div key={reply.id} className="flex items-start gap-4">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={reply.user.avatar} />
                                  <AvatarFallback>
                                    {reply.user.name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-semibold text-sm">
                                      {reply.user.name}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      {formatDate(reply.createdAt)}
                                    </span>
                                  </div>
                                  <p className="text-sm">{reply.content}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

