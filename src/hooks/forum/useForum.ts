import { useState, useMemo, useEffect, useCallback } from "react";
import { useAppDispatch } from "@/lib/redux/useAppDispatch";
import { getPosts, reactToPost, commentOnPost } from "@/features/forum/postThunk";
import { getCategories } from "@/features/taxonomy/category/categoryThunk";
import { ICategory } from "@/types/taxonomy/category/category.type";
import { PostsDTO } from "@/types/forum/post.type";
import { IPostFilter } from "@/types/forum/post.type.filter";
import { ReactionType } from "@/types/forum/post.enum";
import { toast } from "sonner";
import { useAuth } from "@/hooks/auth/useAuth";
import { getUserInfo } from "@/lib/jwt/jwt.utils";
import { Car, GraduationCap, FileText, Wrench, ShoppingCart, MessageSquare, type LucideIcon } from "lucide-react";

interface UseForumOptions {
    initialSearchQuery?: string;
    initialCategory?: string | null;
    autoLoad?: boolean;
}

interface CategoryWithStats {
    id: string;
    name: string;
    count: number;
    hasVideo: boolean;
    latestVideo: string | null;
    latestPost: PostsDTO | null;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
}

export const useForum = (options: UseForumOptions = {}) => {
    const { initialSearchQuery = "", initialCategory = null, autoLoad = true } = options;
    const dispatch = useAppDispatch();
    const { isAuthenticated } = useAuth();

    const currentUser = useMemo(() => {
        const userInfo = getUserInfo();
        if (!userInfo) {
            return null;
        }
        return {
            id: userInfo.id || "",
            name: userInfo.userName || "Người dùng",
            email: userInfo.email || "",
            avatar: "https://i.pravatar.cc/150?img=1", // TODO: Get from API
            role: userInfo.role || null,
        };
    }, []);

    const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory);
    const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
    const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
    const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});

    const [posts, setPosts] = useState<PostsDTO[]>([]);
    const [categoriesFromAPI, setCategoriesFromAPI] = useState<ICategory[]>([]);
    const [isLoadingPosts, setIsLoadingPosts] = useState(false);
    const [isLoadingCategories, setIsLoadingCategories] = useState(false);
    const [isReacting, setIsReacting] = useState<Record<string, boolean>>({});
    const [isCommenting, setIsCommenting] = useState<Record<string, boolean>>({});

    useEffect(() => {
        const loadCategories = async () => {
            setIsLoadingCategories(true);
            try {
                const result = await dispatch(getCategories()).unwrap();
                if (result?.value) {
                    setCategoriesFromAPI(result.value);
                }
            } catch (error) {
                console.error("Error loading categories:", error);
                toast.error("Không thể tải danh mục. Vui lòng thử lại.");
            } finally {
                setIsLoadingCategories(false);
            }
        };
        loadCategories();
    }, [dispatch]);

    const loadPosts = useCallback(async (filter?: Partial<IPostFilter>) => {
        setIsLoadingPosts(true);
        try {
            const filterParams: IPostFilter = {
                ...filter,
            };
            const result = await dispatch(getPosts(filterParams)).unwrap();
            if (result?.value?.pageContent) {
                setPosts(result.value.pageContent);
            }
        } catch (error) {
            console.error("Error loading posts:", error);
            toast.error("Không thể tải bài viết. Vui lòng thử lại.");
        } finally {
            setIsLoadingPosts(false);
        }
    }, [dispatch]);

    useEffect(() => {
        if (autoLoad) {
            loadPosts();
        }
    }, [autoLoad, loadPosts]);

    const filteredPosts = useMemo(() => {
        let filtered = posts;

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (post) =>
                    post.title.toLowerCase().includes(query) ||
                    post.content.toLowerCase().includes(query)
            );
        }

        if (selectedCategory) {
            filtered = filtered.filter(() => {
                return true;
            });
        }

        return filtered.sort(
            (a, b) =>
                new Date(b.lastModifiedAt || b.createdAt).getTime() -
                new Date(a.lastModifiedAt || a.createdAt).getTime()
        );
    }, [posts, searchQuery, selectedCategory]);

    const categories: CategoryWithStats[] = useMemo(() => {
        const catsToUse = categoriesFromAPI.length > 0
            ? categoriesFromAPI
            : [];

        return catsToUse.map((cat) => {
            const postsInCategory = posts.filter(() => {
                return true;
            });
            const postsWithVideo = postsInCategory.filter((p) => p.videos && p.videos.length > 0);
            return {
                id: cat.id,
                name: cat.name,
                count: postsInCategory.length,
                hasVideo: postsWithVideo.length > 0,
                latestVideo: postsWithVideo[0]?.videos[0]?.url || null,
                latestPost: postsInCategory.sort(
                    (a, b) =>
                        new Date(b.lastModifiedAt || b.createdAt).getTime() -
                        new Date(a.lastModifiedAt || a.createdAt).getTime()
                )[0] || null,
                icon: getCategoryIcon(cat.name),
                color: getCategoryColor(cat.name),
            };
        });
    }, [posts, categoriesFromAPI]);

    const formatDate = useCallback((dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return "Vừa xong";
        if (minutes < 60) return `${minutes} phút trước`;
        if (hours < 24) return `${hours} giờ trước`;
        if (days < 7) return `${days} ngày trước`;
        return date.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
        });
    }, []);

    const stripHtml = useCallback((html: string) => {
        return html.replace(/<[^>]*>/g, "");
    }, []);

    // Reaction handler
    const handleReaction = useCallback(async (postId: string, type: ReactionType) => {
        if (!isAuthenticated || !currentUser) {
            toast.error("Vui lòng đăng nhập để thích bài viết.");
            return;
        }

        setIsReacting((prev) => ({ ...prev, [postId]: true }));
        try {
            const result = await dispatch(
                reactToPost({
                    id: postId,
                    data: { type },
                })
            ).unwrap();

            if (result?.value) {
                const reactionMessages: Record<ReactionType, string> = {
                    [ReactionType.Like]: "Đã thích bài viết",
                    [ReactionType.Love]: "Đã yêu thích bài viết",
                    [ReactionType.Haha]: "Đã cười với bài viết",
                    [ReactionType.Wow]: "Đã ngạc nhiên với bài viết",
                    [ReactionType.Sad]: "Đã buồn với bài viết",
                    [ReactionType.Angry]: "Đã tức giận với bài viết",
                };
                toast.success(reactionMessages[type] || "Đã phản ứng với bài viết");

                // Update local state instead of reloading
                setPosts((prevPosts) =>
                    prevPosts.map((post) => {
                        if (post.postId === postId) {
                            const newReaction = {
                                userId: currentUser.id,
                                userName: currentUser.name,
                                userAvatar: currentUser.avatar || "",
                                type: type,
                                createdAt: new Date().toISOString(),
                            };

                            // Check if user already reacted (to avoid duplicates)
                            const existingReaction = post.reactions?.find(
                                (r) => r.userId === currentUser.id
                            );

                            const updatedReactions = existingReaction
                                ? post.reactions?.map((r) =>
                                    r.userId === currentUser.id ? newReaction : r
                                ) || [newReaction]
                                : [...(post.reactions || []), newReaction];

                            return {
                                ...post,
                                reactions: updatedReactions,
                                likeCount: updatedReactions.length,
                            };
                        }
                        return post;
                    })
                );
            } else {
                toast.error("Không thể thực hiện thao tác. Vui lòng thử lại.");
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Không thể thực hiện thao tác. Vui lòng thử lại.";
            console.error("Error reacting to post:", error);
            toast.error(errorMessage);
        } finally {
            setIsReacting((prev) => ({ ...prev, [postId]: false }));
        }
    }, [dispatch, isAuthenticated, currentUser]);

    // Comment handler
    const handleComment = useCallback(async (postId: string) => {
        if (!isAuthenticated || !currentUser) {
            toast.error("Vui lòng đăng nhập để bình luận.");
            return;
        }

        const content = commentInputs[postId]?.trim();
        if (!content) {
            toast.error("Vui lòng nhập nội dung bình luận.");
            return;
        }

        setIsCommenting((prev) => ({ ...prev, [postId]: true }));
        try {
            const result = await dispatch(
                commentOnPost({
                    id: postId,
                    data: {
                        UserId: currentUser!.id,
                        content: content,
                    },
                })
            ).unwrap();

            if (result?.value) {
                toast.success("Đã thêm bình luận!");
                setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
                setExpandedComments((prev) => new Set(prev).add(postId));

                // Update local state instead of reloading
                setPosts((prevPosts) =>
                    prevPosts.map((post) => {
                        if (post.postId === postId) {
                            const newComment = {
                                commentId: `temp-${Date.now()}`, // Temporary ID, will be replaced by server response
                                authorId: currentUser.id,
                                authorName: currentUser.name,
                                authorAvatar: currentUser.avatar || "",
                                content: content,
                                parentCommentId: null,
                                createdAt: new Date().toISOString(),
                            };

                            return {
                                ...post,
                                comments: [...(post.comments || []), newComment],
                            };
                        }
                        return post;
                    })
                );
            } else {
                toast.error("Không thể thêm bình luận. Vui lòng thử lại.");
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Không thể thêm bình luận. Vui lòng thử lại.";
            console.error("Error commenting on post:", error);
            toast.error(errorMessage);
        } finally {
            setIsCommenting((prev) => ({ ...prev, [postId]: false }));
        }
    }, [dispatch, isAuthenticated, commentInputs, currentUser]);

    // Reply handler
    const handleReply = useCallback(async (postId: string, parentId: string) => {
        if (!isAuthenticated || !currentUser) {
            toast.error("Vui lòng đăng nhập để phản hồi.");
            return;
        }

        const content = replyInputs[`${postId}-${parentId}`]?.trim();
        if (!content) {
            toast.error("Vui lòng nhập nội dung phản hồi.");
            return;
        }

        const key = `${postId}-${parentId}`;
        setIsCommenting((prev) => ({ ...prev, [key]: true }));
        try {
            const result = await dispatch(
                commentOnPost({
                    id: postId,
                    data: {
                        UserId: currentUser!.id,
                        content: content,
                        parentCommentId: parentId,
                    },
                })
            ).unwrap();

            if (result?.value) {
                toast.success("Đã thêm phản hồi!");
                setReplyInputs((prev) => ({ ...prev, [key]: "" }));

                // Update local state instead of reloading
                setPosts((prevPosts) =>
                    prevPosts.map((post) => {
                        if (post.postId === postId) {
                            const newReply = {
                                commentId: `temp-${Date.now()}`, // Temporary ID
                                authorId: currentUser.id,
                                authorName: currentUser.name,
                                authorAvatar: currentUser.avatar || "",
                                content: content,
                                parentCommentId: parentId,
                                createdAt: new Date().toISOString(),
                            };

                            return {
                                ...post,
                                comments: [...(post.comments || []), newReply],
                            };
                        }
                        return post;
                    })
                );
            } else {
                toast.error("Không thể thêm phản hồi. Vui lòng thử lại.");
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Không thể thêm phản hồi. Vui lòng thử lại.";
            console.error("Error replying to comment:", error);
            toast.error(errorMessage);
        } finally {
            setIsCommenting((prev) => ({ ...prev, [key]: false }));
        }
    }, [dispatch, isAuthenticated, replyInputs, currentUser]);

    // Toggle comments
    const toggleComments = useCallback((postId: string) => {
        setExpandedComments((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(postId)) {
                newSet.delete(postId);
            } else {
                newSet.add(postId);
            }
            return newSet;
        });
    }, []);

    // Update comment input
    const updateCommentInput = useCallback((postId: string, value: string) => {
        setCommentInputs((prev) => ({ ...prev, [postId]: value }));
    }, []);

    // Update reply input
    const updateReplyInput = useCallback((postId: string, parentId: string, value: string) => {
        setReplyInputs((prev) => ({ ...prev, [`${postId}-${parentId}`]: value }));
    }, []);

    return {
        // State
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        expandedComments,
        commentInputs,
        replyInputs,
        currentUser,

        // Data
        posts: filteredPosts,
        categories,
        isLoadingPosts,
        isLoadingCategories,

        // Actions
        handleReaction,
        handleComment,
        handleReply,
        toggleComments,
        updateCommentInput,
        updateReplyInput,
        loadPosts,
        refreshPosts: () => loadPosts(),

        // Utilities
        formatDate,
        stripHtml,

        // Loading states
        isReacting,
        isCommenting,
    };
};

// Helper functions
function getCategoryIcon(category: string): LucideIcon {
    const icons: Record<string, LucideIcon> = {
        "Kỹ năng lái xe": Car,
        "Thi bằng lái": GraduationCap,
        "Luật giao thông": FileText,
        "Bảo dưỡng xe": Wrench,
        "Tư vấn xe": ShoppingCart,
    };
    return icons[category] || MessageSquare;
}

function getCategoryColor(category: string) {
    const colors: Record<string, string> = {
        "Kỹ năng lái xe": "from-blue-500 to-cyan-500",
        "Thi bằng lái": "from-purple-500 to-pink-500",
        "Luật giao thông": "from-orange-500 to-red-500",
        "Bảo dưỡng xe": "from-green-500 to-emerald-500",
        "Tư vấn xe": "from-indigo-500 to-blue-500",
    };
    return colors[category] || "from-gray-500 to-gray-600";
}

