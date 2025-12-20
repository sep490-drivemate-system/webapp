import { useState, useEffect, useMemo } from "react";
import { createPost, getPosts, updatePost, rejectPost } from "@/features/forum/postThunk";
import { getCategories } from "@/features/taxonomy/category/categoryThunk";
import { getTags } from "@/features/taxonomy/tag/tagThunk";
import { ICategory } from "@/types/taxonomy/category/category.type";
import { ITag } from "@/types/taxonomy/tag/tag.type";
import { IPostCreation, PostsDTO } from "@/types/forum/post.type";
import { PostStatus } from "@/types/forum/post.enum";
import { IPostFilter } from "@/types/forum/post.type.filter";
import { toast } from "sonner";
import { useThunkAction } from "@/lib/redux/useThunkAction";

export const useCreatePost = (onSuccess?: () => void) => {
  const [open, setOpen] = useState(false);

  // Use runSafe for thunk actions
  const { runSafe: runGetCategories, loading: isLoadingCategories } = useThunkAction(getCategories);
  const { runSafe: runGetTags, loading: isLoadingTags } = useThunkAction(getTags);
  const { runSafe: runCreatePost, loading: isLoading } = useThunkAction(createPost);

  const isLoadingData = isLoadingCategories || isLoadingTags;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [videoFiles, setVideoFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [videoPreviews, setVideoPreviews] = useState<string[]>([]);

  const [categories, setCategories] = useState<ICategory[]>([]);
  const [tags, setTags] = useState<ITag[]>([]);

  useEffect(() => {
    if (open) {
      loadCategoriesAndTags();
    }
  }, [open]);

  const loadCategoriesAndTags = async () => {
    const [categoriesResult, tagsResult] = await Promise.all([
      runGetCategories(undefined, {
        onError: () => {
          toast.error("Không thể tải danh mục. Vui lòng thử lại.");
        },
      }),
      runGetTags(undefined, {
        onError: () => {
          toast.error("Không thể tải thẻ. Vui lòng thử lại.");
        },
      }),
    ]);

    if (categoriesResult.ok && categoriesResult.data?.value) {
      setCategories(categoriesResult.data.value);
    }

    if (tagsResult.ok && tagsResult.data?.value) {
      setTags(tagsResult.data.value);
    }
  };

  // Cleanup preview URLs
  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
      videoPreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviews, videoPreviews]);

  const resetForm = () => {
    // Cleanup preview URLs before resetting
    imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    videoPreviews.forEach((url) => URL.revokeObjectURL(url));

    setTitle("");
    setContent("");
    setSelectedCategoryId("");
    setSelectedTagIds([]);
    setImageFiles([]);
    setVideoFiles([]);
    setImagePreviews([]);
    setVideoPreviews([]);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Validate file types
    const validFiles = files.filter((file) => file.type.startsWith("image/"));
    if (validFiles.length !== files.length) {
      toast.error("Chỉ chấp nhận file ảnh!");
      return;
    }

    // Validate file sizes (max 10MB per image)
    const maxSize = 10 * 1024 * 1024; // 10MB
    const oversizedFiles = validFiles.filter((file) => file.size > maxSize);
    if (oversizedFiles.length > 0) {
      toast.error(`Một số file vượt quá 10MB: ${oversizedFiles.map((f) => f.name).join(", ")}`);
      return;
    }

    // Create preview URLs
    const newPreviews = validFiles.map((file) => URL.createObjectURL(file));

    setImageFiles((prev) => [...prev, ...validFiles]);
    setImagePreviews((prev) => [...prev, ...newPreviews]);

    // Reset input
    e.target.value = "";
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Validate file types
    const validFiles = files.filter((file) => file.type.startsWith("video/"));
    if (validFiles.length !== files.length) {
      toast.error("Chỉ chấp nhận file video!");
      return;
    }

    // Validate file sizes (max 100MB per video)
    const maxSize = 100 * 1024 * 1024; // 100MB
    const oversizedFiles = validFiles.filter((file) => file.size > maxSize);
    if (oversizedFiles.length > 0) {
      toast.error(`Một số file vượt quá 100MB: ${oversizedFiles.map((f) => f.name).join(", ")}`);
      return;
    }

    // Create preview URLs
    const newPreviews = validFiles.map((file) => {
      try {
        return URL.createObjectURL(file);
      } catch (error) {
        console.error("Error creating video preview URL:", error);
        return "";
      }
    }).filter((url) => url !== "");

    if (newPreviews.length !== validFiles.length) {
      toast.error("Không thể tạo preview cho một số video. Vui lòng thử lại.");
      return;
    }

    setVideoFiles((prev) => [...prev, ...validFiles]);
    setVideoPreviews((prev) => [...prev, ...newPreviews]);

    // Reset input
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    // Revoke the preview URL
    URL.revokeObjectURL(imagePreviews[index]);

    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeVideo = (index: number) => {
    // Revoke the preview URL
    URL.revokeObjectURL(videoPreviews[index]);

    setVideoFiles((prev) => prev.filter((_, i) => i !== index));
    setVideoPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleTag = (tagId: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleSubmit = async () => {
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle || !trimmedContent) {
      toast.error("Vui lòng điền đủ tiêu đề và nội dung.");
      return;
    }


    if (!selectedCategoryId || selectedCategoryId.trim() === "") {
      toast.error("Vui lòng chọn danh mục.");
      return;
    }

    const postData: IPostCreation = {
      title: trimmedTitle,
      content: trimmedContent,
      categoryIds: [selectedCategoryId],
      tagIds: selectedTagIds.length > 0 ? selectedTagIds : [],
      images: imageFiles.length > 0 ? imageFiles : undefined,
      imageOrders: imageFiles.length > 0 ? imageFiles.map((_, idx) => idx + 1) : undefined,
      videos: videoFiles.length > 0 ? videoFiles : undefined,
      videoOrders: videoFiles.length > 0 ? videoFiles.map((_, idx) => idx + 1) : undefined,
    };

    const result = await runCreatePost(postData, {
      onSuccess: (data) => {
        if (data?.value) {
          toast.success("Bài viết của bạn đang được kiểm duyệt", {
            description: "Bạn sẽ được thông báo khi bài viết được duyệt.",
            duration: 5000,
          });
          resetForm();
          setOpen(false);
          onSuccess?.();
        } else {
          toast.error(data?.message || "Không thể tạo bài viết. Vui lòng thử lại.");
        }
      },
      onError: (error: any) => {
        console.error("Error creating post:", error);
        toast.error(error?.message || "Không thể tạo bài viết. Vui lòng thử lại.");
      },
    });

    if (!result.ok && result.error) {
      // Error already handled in onError callback
      return;
    }
  };

  const handleClose = () => {
    resetForm();
    setOpen(false);
  };

  return {
    // Dialog state
    open,
    setOpen,

    // Loading states
    isLoading,
    isLoadingData,

    // Form values
    title,
    setTitle,
    content,
    setContent,
    selectedCategoryId,
    setSelectedCategoryId,
    selectedTagIds,
    imageFiles,
    videoFiles,
    imagePreviews,
    videoPreviews,
    categories,
    tags,
    handleImageChange,
    handleVideoChange,
    removeImage,
    removeVideo,
    toggleTag,
    handleSubmit,
    handleClose,
  };
};

/**
 * Hook for managing posts (approve, reject, filter, search)
 */
export const usePostManagement = () => {
  const [posts, setPosts] = useState<PostsDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<PostStatus | "all">("all");
  const [selectedPost, setSelectedPost] = useState<PostsDTO | null>(null);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const { runSafe: runGetPosts } = useThunkAction(getPosts);
  const { runSafe: runUpdatePost, loading: isUpdatingPost } = useThunkAction(updatePost);
  const { runSafe: runRejectPost, loading: isRejectingPost } = useThunkAction(rejectPost);

  useEffect(() => {
    loadPosts();
  }, [statusFilter]);

  const loadPosts = async () => {
    setIsLoading(true);
    try {
      const filter: IPostFilter = {
        PageNumber: 1,
        PageSize: 100,
      };

      if (statusFilter !== "all") {
        filter.status = statusFilter;
      }

      const result = await runGetPosts(filter, {
        onError: () => {
          toast.error("Không thể tải danh sách bài viết. Vui lòng thử lại.");
        },
      });

      if (result.ok && result.data?.value?.pageContent) {
        setPosts(result.data.value.pageContent);
      }
    } catch (error) {
      console.error("Error loading posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPosts = useMemo(() => {
    if (!searchTerm) return posts;

    const query = searchTerm.toLowerCase();
    return posts.filter(
      (post) =>
        post.title.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query) ||
        post.authorName.toLowerCase().includes(query)
    );
  }, [posts, searchTerm]);

  const handleApprove = async (postId: string) => {
    setIsUpdating(true);
    try {
      const result = await runUpdatePost(
        {
          id: postId,
          data: {
            status: PostStatus.Approved,
          },
        },
        {
          onSuccess: () => {
            toast.success("Bài viết đã được duyệt thành công!");
            loadPosts();
          },
          onError: (error: any) => {
            toast.error(error?.message || "Không thể duyệt bài viết. Vui lòng thử lại.");
          },
        }
      );

      if (!result.ok) {
        // Error already handled in onError callback
        return;
      }
    } catch (error: any) {
      console.error("Error approving post:", error);
      toast.error(error?.message || "Không thể duyệt bài viết. Vui lòng thử lại.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleReject = async () => {
    console.log("handleReject", selectedPost?.postId);
    if (!selectedPost) return;

    if (!rejectReason.trim()) {
      toast.error("Vui lòng nhập lý do từ chối.");
      return;
    }

    setIsUpdating(true);
    try {
      const result = await runRejectPost(
        {
          postId: selectedPost.postId,
          reason: rejectReason.trim(),
        },
        {
          onSuccess: () => {
            toast.success("Bài viết đã bị từ chối.");
            setShowRejectDialog(false);
            setRejectReason("");
            setSelectedPost(null);
            loadPosts();
          },
          onError: (error: any) => {
            toast.error(error?.message || "Không thể từ chối bài viết. Vui lòng thử lại.");
          },
        }
      );

      if (!result.ok) {
        // Error already handled in onError callback
        return;
      }
    } catch (error: any) {
      console.error("Error rejecting post:", error);
      toast.error(error?.message || "Không thể từ chối bài viết. Vui lòng thử lại.");
    } finally {
      setIsUpdating(false);
    }
  };

  const openRejectDialog = (post: PostsDTO) => {
    setSelectedPost(post);
    setShowRejectDialog(true);
  };

  const closeRejectDialog = () => {
    setShowRejectDialog(false);
    setRejectReason("");
    setSelectedPost(null);
  };

  const openViewDialog = (post: PostsDTO) => {
    setSelectedPost(post);
    setShowViewDialog(true);
  };

  const closeViewDialog = () => {
    setShowViewDialog(false);
    setSelectedPost(null);
  };

  const getStatusBadge = (status: PostStatus) => {
    const statusConfig = {
      [PostStatus.Pending]: {
        label: "Chờ duyệt",
        variant: "secondary" as const,
        className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
      },
      [PostStatus.Approved]: {
        label: "Đã duyệt",
        variant: "default" as const,
        className: "bg-green-100 text-green-800 hover:bg-green-100",
      },
      [PostStatus.Rejected]: {
        label: "Đã từ chối",
        variant: "destructive" as const,
        className: "bg-red-100 text-red-800 hover:bg-red-100",
      },
    };

    const config = statusConfig[status];
    return {
      label: config.label,
      variant: config.variant,
      className: config.className,
    };
  };

  const stats = useMemo(() => {
    return {
      total: posts.length,
      pending: posts.filter((p) => p.status === PostStatus.Pending).length,
      approved: posts.filter((p) => p.status === PostStatus.Approved).length,
      rejected: posts.filter((p) => p.status === PostStatus.Rejected).length,
    };
  }, [posts]);

  return {
    // Posts data
    posts: filteredPosts,
    isLoading,
    isUpdating: isUpdating || isUpdatingPost || isRejectingPost,

    // Filters
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,

    // Reject dialog
    showRejectDialog,
    setShowRejectDialog,
    rejectReason,
    setRejectReason,
    selectedPost,

    // View dialog
    showViewDialog,
    setShowViewDialog,
    openViewDialog,
    closeViewDialog,

    // Actions
    handleApprove,
    handleReject,
    openRejectDialog,
    closeRejectDialog,
    loadPosts,

    // Utilities
    getStatusBadge,
    stats,
  };
};

