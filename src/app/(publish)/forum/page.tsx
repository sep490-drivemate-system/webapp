"use client";

import { useMemo } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import {
  MessageSquare,
  ThumbsUp,
  MessageCircle,
  Clock,
  Send,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { CreatePostDialog } from "./components/CreatePostDialog";
import { useForum } from "@/hooks/forum/useForum";
import {
  ReactionType as ForumReactionType,
  PostStatus,
} from "@/types/forum/post.enum";
import { UserRole } from "@/types/auth/user-role.enum";
import { useEffect } from "react";

export default function ForumPage() {
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    expandedComments,
    commentInputs,
    replyInputs,
    currentUser,
    categories,
    posts,
    isLoadingPosts,
    isLoadingCategories,
    handleReaction,
    handleComment,
    handleReply,
    toggleComments,
    updateCommentInput,
    updateReplyInput,
    formatDate,
    loadPosts,
    isCommenting,
  } = useForum({ autoLoad: true });

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const filteredPosts = useMemo(() => {
    if (!currentUser) {
      return posts.filter((post) => post.status === PostStatus.Approved);
    }

    const userId = currentUser.id;
    const userRole = currentUser.role;

    return posts.filter((post) => {
      const isOwnPost = post.authorId === userId;
      const isApproved = post.status === PostStatus.Approved;
      const isPending = post.status === PostStatus.Pending;

      if (userRole === UserRole.NoviceDriver) {
        return isApproved;
      }

      if (userRole === UserRole.Instructor) {
        return isApproved || (isPending && isOwnPost);
      }
      return isApproved || (isPending && isOwnPost);
    });
  }, [posts, currentUser]);

  const finalFilteredPosts = useMemo(() => {
    let result = filteredPosts;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.content.toLowerCase().includes(query)
      );
    }

    return result.sort(
      (a, b) =>
        new Date(b.lastModifiedAt || b.createdAt).getTime() -
        new Date(a.lastModifiedAt || a.createdAt).getTime()
    );
  }, [filteredPosts, searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50 mt-16">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="hidden lg:block space-y-4">
            <Card className="overflow-hidden mt-10">
              <CardContent className="p-0">
                <div className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 border-b">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <MessageSquare className="size-5 text-primary" />
                    Danh mục
                  </h3>
                </div>
                <div className="p-4 space-y-3">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`w-full text-left p-3 rounded-lg transition-all ${selectedCategory === null
                      ? "bg-primary text-primary-foreground shadow-md"
                      : ""
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Tất cả</span>
                    </div>
                  </button>

                  {isLoadingCategories ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  ) : categories.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Chưa có danh mục nào
                    </p>
                  ) : (
                    categories.map((cat) => {
                      const isSelected = selectedCategory === cat.name;
                      return (
                        <button
                          key={cat.id}
                          onClick={() =>
                            setSelectedCategory(isSelected ? null : cat.name)
                          }
                          className={`w-full text-left p-3 rounded-lg transition-all group ${isSelected
                            ? `bg-gradient-to-r ${cat.color} text-white shadow-lg`
                            : " border border-transparent "
                            }`}
                        >
                          <div className="flex items-center justify-between">
                            <span
                              className={`font-semibold text-sm ${isSelected ? "text-white" : "text-gray-900"
                                }`}
                            >
                              {cat.name}
                            </span>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3 space-y-4">
            <Card className="mt-10">
              <CardContent className="p-5">
                <div className="flex items-center gap-4">
                  <div className="flex-1 relative">
                    <Input
                      placeholder="Tìm kiếm bài viết..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <CreatePostDialog />
                </div>
              </CardContent>
            </Card>

            {/* Posts Feed */}
            {isLoadingPosts ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Loader2 className="h-8 w-8 mx-auto animate-spin text-primary mb-4" />
                  <p className="text-gray-600">Đang tải bài viết...</p>
                </CardContent>
              </Card>
            ) : finalFilteredPosts.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <MessageSquare className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    Không tìm thấy bài viết
                  </h3>
                  <p className="text-gray-600">
                    {searchQuery
                      ? "Thử thay đổi từ khóa tìm kiếm."
                      : "Chưa có bài viết nào."}
                  </p>
                </CardContent>
              </Card>
            ) : (
              finalFilteredPosts.map((post) => {
                const isOwnPost =
                  currentUser && post.authorId === currentUser.id;
                const isPending = post.status === PostStatus.Pending;
                const showComments = expandedComments.has(post.postId);

                // Sort images and videos by order and combine them
                const sortedImages = post.images
                  ? [...post.images].sort(
                    (a, b) => (a.order || 0) - (b.order || 0)
                  )
                  : [];
                const sortedVideos = post.videos
                  ? [...post.videos].sort((a, b) => a.order - b.order)
                  : [];

                // Combine images and videos into a single array with type indicator
                type MediaItem =
                  | { type: "image"; url: string; order: number }
                  | { type: "video"; url: string; order: number };
                const mediaItems: MediaItem[] = [
                  ...sortedImages.map((img) => ({
                    type: "image" as const,
                    url: img.url,
                    order: img.order || 0,
                  })),
                  ...sortedVideos.map((vid) => ({
                    type: "video" as const,
                    url: vid.url,
                    order: vid.order,
                  })),
                ].sort((a, b) => a.order - b.order);

                const hasMedia = mediaItems.length > 0;

                return (
                  <Card
                    key={post.postId}
                    className="overflow-hidden hover:shadow-xl transition-all duration-300 border-l-4 border-l-transparent "
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-3 flex-1">
                          <Avatar className="h-12 w-12 ring-2 ring-primary/10">
                            {post.authorAvatar && (
                              <AvatarImage
                                src={post.authorAvatar}
                                alt={post.authorName}
                              />
                            )}
                            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold">
                              {post.authorName.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-base">
                                {post.authorName}
                              </span>
                              {isOwnPost && isPending && (
                                <Badge
                                  variant="secondary"
                                  className="bg-yellow-100 text-yellow-800 border-yellow-300"
                                >
                                  Bài viết của bạn đang được kiểm duyệt
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Clock className="size-3" />
                              <span>{formatDate(post.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Post Content */}

                      <div
                        className="text-2xl font-bold mb-3 transition-colors cursor-pointer leading-tight prose prose-lg max-w-none"
                        dangerouslySetInnerHTML={{ __html: post.title }}
                      />

                      <div
                        className="text-base text-gray-700 mb-4 line-clamp-3 leading-relaxed prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                      />

                      {/* Media Gallery - Combined Images and Videos */}
                      {hasMedia && (
                        <div className="mb-4">
                          {mediaItems.length === 1 ? (
                            // Single media item
                            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black shadow-md">
                              {mediaItems[0].type === "image" ? (
                                <Image
                                  src={mediaItems[0].url}
                                  alt={post.title}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <video
                                  src={mediaItems[0].url}
                                  controls
                                  className="w-full h-full object-contain"
                                  preload="metadata"
                                  playsInline
                                >
                                  Trình duyệt của bạn không hỗ trợ video.
                                </video>
                              )}
                            </div>
                          ) : mediaItems.length === 2 ? (
                            // Two media items - side by side
                            <div className="grid grid-cols-2 gap-2">
                              {mediaItems.map((item, index) => (
                                <div
                                  key={index}
                                  className="relative aspect-square rounded-xl overflow-hidden bg-black shadow-md"
                                >
                                  {item.type === "image" ? (
                                    <Image
                                      src={item.url}
                                      alt={`${post.title} - ${index + 1}`}
                                      fill
                                      className="object-cover"
                                    />
                                  ) : (
                                    <video
                                      src={item.url}
                                      controls
                                      className="w-full h-full object-contain"
                                      preload="metadata"
                                      playsInline
                                    >
                                      Trình duyệt của bạn không hỗ trợ video.
                                    </video>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : mediaItems.length === 3 ? (
                            // Three media items - first one large, two small
                            <div className="grid grid-cols-2 gap-2">
                              <div className="relative col-span-2 aspect-video rounded-xl overflow-hidden bg-black shadow-md">
                                {mediaItems[0].type === "image" ? (
                                  <Image
                                    src={mediaItems[0].url}
                                    alt={post.title}
                                    fill
                                    className="object-cover"
                                  />
                                ) : (
                                  <video
                                    src={mediaItems[0].url}
                                    controls
                                    className="w-full h-full object-contain"
                                    preload="metadata"
                                    playsInline
                                  >
                                    Trình duyệt của bạn không hỗ trợ video.
                                  </video>
                                )}
                              </div>
                              {mediaItems.slice(1).map((item, index) => (
                                <div
                                  key={index + 1}
                                  className="relative aspect-square rounded-xl overflow-hidden bg-black shadow-md"
                                >
                                  {item.type === "image" ? (
                                    <Image
                                      src={item.url}
                                      alt={`${post.title} - ${index + 2}`}
                                      fill
                                      className="object-cover"
                                    />
                                  ) : (
                                    <video
                                      src={item.url}
                                      controls
                                      className="w-full h-full object-contain"
                                      preload="metadata"
                                      playsInline
                                    >
                                      Trình duyệt của bạn không hỗ trợ video.
                                    </video>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            // Four or more media items - grid layout
                            <div className="grid grid-cols-2 gap-2">
                              {mediaItems.slice(0, 4).map((item, index) => (
                                <div
                                  key={index}
                                  className={`relative rounded-xl overflow-hidden bg-black shadow-md ${index === 0 && mediaItems.length > 4
                                    ? "col-span-2 aspect-video"
                                    : "aspect-square"
                                    }`}
                                >
                                  {item.type === "image" ? (
                                    <Image
                                      src={item.url}
                                      alt={`${post.title} - ${index + 1}`}
                                      fill
                                      className="object-cover"
                                    />
                                  ) : (
                                    <video
                                      src={item.url}
                                      controls
                                      className="w-full h-full object-contain"
                                      preload="metadata"
                                      playsInline
                                    >
                                      Trình duyệt của bạn không hỗ trợ video.
                                    </video>
                                  )}
                                  {index === 3 && mediaItems.length > 4 && (
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                      <span className="text-white text-2xl font-bold">
                                        +{mediaItems.length - 4}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4 pb-4 border-b border-gray-200">
                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 ">
                            <ThumbsUp className="size-4" />
                            <span className="font-medium">
                              {post.likeCount || post.reactions?.length || 0}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 ">
                            <MessageCircle className="size-4" />
                            <span className="font-medium">
                              {post.comments?.length || 0}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 border-t border-gray-100 pt-3">
                        <Button
                          variant="ghost"
                          className="flex-1 "
                          onClick={() =>
                            handleReaction(post.postId, ForumReactionType.Like)
                          }
                          disabled={isPending && !isOwnPost}
                        >
                          <ThumbsUp className="mr-2 size-5" />
                          <span className="font-medium">Thích</span>
                        </Button>
                        <Button
                          variant="ghost"
                          className="flex-1 "
                          onClick={() => toggleComments(post.postId)}
                          disabled={isPending && !isOwnPost}
                        >
                          <MessageSquare className="mr-2 size-5" />
                          <span className="font-medium">Bình luận</span>
                        </Button>
                      </div>

                      {/* Comments Section */}
                      {showComments && (
                        <div className="mt-4 space-y-4">
                          {/* Comment Input */}
                          {currentUser && !isPending && (
                            <div className="flex items-start gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>
                                  {currentUser.name.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 flex gap-2">
                                <Textarea
                                  placeholder="Viết bình luận..."
                                  value={commentInputs[post.postId] || ""}
                                  onChange={(e) =>
                                    updateCommentInput(
                                      post.postId,
                                      e.target.value
                                    )
                                  }
                                  rows={2}
                                  className="resize-none"
                                  disabled={isCommenting[post.postId]}
                                />
                                <Button
                                  size="icon"
                                  onClick={() => handleComment(post.postId)}
                                  disabled={
                                    isCommenting[post.postId] ||
                                    !commentInputs[post.postId]?.trim()
                                  }
                                >
                                  {isCommenting[post.postId] ? (
                                    <Loader2 className="size-4 animate-spin" />
                                  ) : (
                                    <Send className="size-4" />
                                  )}
                                </Button>
                              </div>
                            </div>
                          )}

                          {isPending && !isOwnPost && (
                            <div className="text-center py-4 text-sm text-muted-foreground">
                              Bài viết đang được kiểm duyệt. Bạn không thể bình
                              luận.
                            </div>
                          )}

                          {/* Comments List */}
                          {post.comments && post.comments.length > 0 ? (
                            <div className="space-y-3 mt-4">
                              {post.comments
                                .filter((comment) => !comment.parentCommentId)
                                .map((comment) => (
                                  <div
                                    key={comment.commentId}
                                    className="flex items-start gap-3"
                                  >
                                    <Avatar className="h-8 w-8">
                                      {comment.authorAvatar ? (
                                        <AvatarImage
                                          src={comment.authorAvatar}
                                          alt={comment.authorName}
                                        />
                                      ) : null}
                                      <AvatarFallback>
                                        {comment.authorName
                                          .charAt(0)
                                          .toUpperCase()}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                      <div className="bg-gray-50 rounded-lg p-3">
                                        <div className="flex items-center gap-2 mb-1">
                                          <span className="font-semibold text-sm">
                                            {comment.authorName}
                                          </span>
                                          <span className="text-xs text-muted-foreground">
                                            {formatDate(comment.createdAt)}
                                          </span>
                                        </div>
                                        <p className="text-sm text-gray-700">
                                          {comment.content}
                                        </p>
                                      </div>

                                      {/* Reply Input for this comment */}
                                      {currentUser && !isPending && (
                                        <div className="mt-2 flex items-start gap-2">
                                          <Avatar className="h-6 w-6">
                                            <AvatarFallback className="text-xs">
                                              {currentUser.name
                                                .charAt(0)
                                                .toUpperCase()}
                                            </AvatarFallback>
                                          </Avatar>
                                          <div className="flex-1 flex gap-2">
                                            <Textarea
                                              placeholder="Viết phản hồi..."
                                              value={
                                                replyInputs[
                                                `${post.postId}-${comment.commentId}`
                                                ] || ""
                                              }
                                              onChange={(e) =>
                                                updateReplyInput(
                                                  post.postId,
                                                  comment.commentId,
                                                  e.target.value
                                                )
                                              }
                                              rows={1}
                                              className="resize-none text-sm"
                                              disabled={
                                                isCommenting[
                                                `${post.postId}-${comment.commentId}`
                                                ]
                                              }
                                            />
                                            <Button
                                              size="icon"
                                              variant="ghost"
                                              onClick={() =>
                                                handleReply(
                                                  post.postId,
                                                  comment.commentId
                                                )
                                              }
                                              disabled={
                                                isCommenting[
                                                `${post.postId}-${comment.commentId}`
                                                ] ||
                                                !replyInputs[
                                                  `${post.postId}-${comment.commentId}`
                                                ]?.trim()
                                              }
                                            >
                                              {isCommenting[
                                                `${post.postId}-${comment.commentId}`
                                              ] ? (
                                                <Loader2 className="size-3 animate-spin" />
                                              ) : (
                                                <Send className="size-3" />
                                              )}
                                            </Button>
                                          </div>
                                        </div>
                                      )}

                                      {/* Replies */}
                                      {post.comments
                                        ?.filter(
                                          (reply) =>
                                            reply.parentCommentId ===
                                            comment.commentId
                                        )
                                        .map((reply) => (
                                          <div
                                            key={reply.commentId}
                                            className="flex items-start gap-2 mt-2 ml-4"
                                          >
                                            <Avatar className="h-6 w-6">
                                              {reply.authorAvatar ? (
                                                <AvatarImage
                                                  src={reply.authorAvatar}
                                                  alt={reply.authorName}
                                                />
                                              ) : null}
                                              <AvatarFallback className="text-xs">
                                                {reply.authorName
                                                  .charAt(0)
                                                  .toUpperCase()}
                                              </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 bg-gray-50 rounded-lg p-2">
                                              <div className="flex items-center gap-2 mb-1">
                                                <span className="font-semibold text-xs">
                                                  {reply.authorName}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                  {formatDate(reply.createdAt)}
                                                </span>
                                              </div>
                                              <p className="text-xs text-gray-700">
                                                {reply.content}
                                              </p>
                                            </div>
                                          </div>
                                        ))}
                                    </div>
                                  </div>
                                ))}
                            </div>
                          ) : null}

                          {(!post.comments || post.comments.length === 0) && (
                            <div className="text-center py-4 text-sm text-muted-foreground">
                              Chưa có bình luận nào. Hãy là người đầu tiên bình
                              luận!
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
