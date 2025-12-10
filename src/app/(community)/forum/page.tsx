"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    MessageSquare,
    ThumbsUp,
    ThumbsDown,
    Share2,
    MessageCircle,
    Eye,
    Clock,
    Send,
    Car,
    GraduationCap,
    FileText,
    Wrench,
    ShoppingCart,
    Video,
    Play,
    ImageIcon,
    HelpCircle,
    Bell,
    Settings,
    LogOut,
    Plus,
    Search,
} from "lucide-react";
import { Post, PostStatus, Comment, ReactionType, UserRole, User } from "@/types/post/post.type";
import postsData from "@/data/mock-posts.json";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

// Mock current user
const currentUser: User = {
    id: "user_novice_001",
    name: "Trần Văn Nam",
    email: "tranvannam@example.com",
    avatar: "https://i.pravatar.cc/150?img=20",
    role: UserRole.NOVICE_DRIVER,
};

function Logo({ sizeClass = "h-16 w-16" }: { sizeClass?: string }) {
    return (
        <Link href="/" className={`flex items-center shrink-0`}>
            <div className={`relative left-10 ${sizeClass}`}>
                <Image
                    src="/logo.png"
                    alt="DriveMate Logo"
                    objectFit="cover"
                    width={200}
                    height={200}
                    priority
                    className="scale-200"
                />
            </div>
        </Link>
    );
}
export default function ForumPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
    const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
    const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});
    const [showCreatePostDialog, setShowCreatePostDialog] = useState(false);
    const [postTitle, setPostTitle] = useState("");
    const [postContent, setPostContent] = useState("");
    const [postCategory, setPostCategory] = useState("");
    const [postTags, setPostTags] = useState("");
    const [postThumbnail, setPostThumbnail] = useState("");
    const [postVideoUrl, setPostVideoUrl] = useState("");

    // Get only published posts
    const publishedPosts = useMemo(() => {
        return (postsData.posts as Post[]).filter(
            (post) => post.status === PostStatus.PUBLISHED
        );
    }, []);

    // Get comments for a post
    const getComments = (postId: string) => {
        const allComments = (postsData.comments as Comment[]).filter(
            (c) => c.postId === postId
        );
        const rootComments = allComments.filter((c) => !c.parentId);
        return rootComments.map((root) => {
            const replies = allComments.filter((r) => r.parentId === root.id);
            return { ...root, replies };
        });
    };

    // Get reactions for a post
    const getReactions = (postId: string) => {
        return (postsData.reactions as any[]).filter((r) => r.postId === postId);
    };

    // Filter posts
    const filteredPosts = useMemo(() => {
        let posts = publishedPosts;

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            posts = posts.filter(
                (post) =>
                    post.title.toLowerCase().includes(query) ||
                    post.content.toLowerCase().includes(query) ||
                    post.tags.some((tag) => tag.toLowerCase().includes(query))
            );
        }

        if (selectedCategory) {
            posts = posts.filter((post) => post.category === selectedCategory);
        }

        return posts.sort(
            (a, b) =>
                new Date(b.publishedAt || b.createdAt).getTime() -
                new Date(a.publishedAt || a.createdAt).getTime()
        );
    }, [publishedPosts, searchQuery, selectedCategory]);

    // Get unique categories with metadata
    const categories = useMemo(() => {
        const cats = new Set(publishedPosts.map((post) => post.category));
        const categoryData = Array.from(cats).map((cat) => {
            const postsInCategory = publishedPosts.filter((p) => p.category === cat);
            const postsWithVideo = postsInCategory.filter((p) => p.videoUrl);
            return {
                name: cat,
                count: postsInCategory.length,
                hasVideo: postsWithVideo.length > 0,
                latestVideo: postsWithVideo[0]?.videoUrl || null,
                latestPost: postsInCategory.sort(
                    (a, b) =>
                        new Date(b.publishedAt || b.createdAt).getTime() -
                        new Date(a.publishedAt || a.createdAt).getTime()
                )[0],
                icon: getCategoryIcon(cat),
                color: getCategoryColor(cat),
            };
        });
        return categoryData;
    }, [publishedPosts]);

    // Get category icon
    function getCategoryIcon(category: string) {
        const icons: Record<string, any> = {
            "Kỹ năng lái xe": Car,
            "Thi bằng lái": GraduationCap,
            "Luật giao thông": FileText,
            "Bảo dưỡng xe": Wrench,
            "Tư vấn xe": ShoppingCart,
        };
        return icons[category] || MessageSquare;
    }

    // Get category color
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

    const formatDate = (dateString: string) => {
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
    };

    const stripHtml = (html: string) => {
        return html.replace(/<[^>]*>/g, "");
    };

    const handleReaction = (postId: string, type: ReactionType) => {
        const reactions = getReactions(postId);
        const existingReaction = reactions.find((r) => r.userId === currentUser.id);

        if (existingReaction) {
            if (existingReaction.type === type) {
                const index = (postsData.reactions as any[]).findIndex(
                    (r) => r.id === existingReaction.id
                );
                if (index > -1) {
                    (postsData.reactions as any[]).splice(index, 1);
                }
            } else {
                existingReaction.type = type;
            }
        } else {
            const newReaction = {
                id: `reaction_${Date.now()}`,
                postId: postId,
                userId: currentUser.id,
                user: currentUser,
                type: type,
                createdAt: new Date().toISOString(),
            };
            (postsData.reactions as any[]).push(newReaction);
        }
        toast.success(
            type === ReactionType.LIKE ? "Đã thích bài viết" : "Đã không thích"
        );
        window.location.reload();
    };

    const handleComment = (postId: string) => {
        const content = commentInputs[postId]?.trim();
        if (!content) {
            toast.error("Vui lòng nhập nội dung bình luận.");
            return;
        }

        const newComment: Comment = {
            id: `comment_${Date.now()}`,
            postId: postId,
            userId: currentUser.id,
            user: currentUser,
            content: content,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            likes: 0,
            dislikes: 0,
        };

        (postsData.comments as any[]).push(newComment);
        setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
        toast.success("Đã thêm bình luận!");
        setExpandedComments((prev) => new Set(prev).add(postId));
        window.location.reload();
    };

    const handleReply = (postId: string, parentId: string) => {
        const content = replyInputs[`${postId}-${parentId}`]?.trim();
        if (!content) {
            toast.error("Vui lòng nhập nội dung phản hồi.");
            return;
        }

        const newReply: Comment = {
            id: `comment_${Date.now()}`,
            postId: postId,
            userId: currentUser.id,
            user: currentUser,
            content: content,
            parentId: parentId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            likes: 0,
            dislikes: 0,
        };

        (postsData.comments as any[]).push(newReply);
        setReplyInputs((prev) => ({ ...prev, [`${postId}-${parentId}`]: "" }));
        toast.success("Đã thêm phản hồi!");
        window.location.reload();
    };

    const toggleComments = (postId: string) => {
        setExpandedComments((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(postId)) {
                newSet.delete(postId);
            } else {
                newSet.add(postId);
            }
            return newSet;
        });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-6 max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Sidebar Left - Categories */}
                    <div className="hidden lg:block space-y-4">
                        <Card className="overflow-hidden">
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
                                            <Badge variant="secondary" className="text-xs">
                                                {publishedPosts.length}
                                            </Badge>
                                        </div>
                                    </button>

                                    {categories.map((cat) => {
                                        const Icon = cat.icon;
                                        const isSelected = selectedCategory === cat.name;
                                        return (
                                            <button
                                                key={cat.name}
                                                onClick={() =>
                                                    setSelectedCategory(
                                                        isSelected ? null : cat.name
                                                    )
                                                }
                                                className={`w-full text-left p-3 rounded-lg transition-all group ${isSelected
                                                    ? `bg-gradient-to-r ${cat.color} text-white shadow-lg`
                                                    : " border border-transparent "
                                                    }`}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div
                                                        className={`p-2 rounded-lg ${isSelected
                                                            ? "bg-white/20"
                                                            : `bg-gradient-to-br ${cat.color}`
                                                            }`}
                                                    >
                                                        <Icon
                                                            className={`size-5 ${isSelected ? "text-white" : "text-white"
                                                                }`}
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <span
                                                                className={`font-semibold text-sm ${isSelected
                                                                    ? "text-white"
                                                                    : "text-gray-900"
                                                                    }`}
                                                            >
                                                                {cat.name}
                                                            </span>
                                                            <Badge
                                                                variant={
                                                                    isSelected
                                                                        ? "secondary"
                                                                        : "outline"
                                                                }
                                                                className="text-xs shrink-0"
                                                            >
                                                                {cat.count}
                                                            </Badge>
                                                        </div>
                                                        {cat.hasVideo && (
                                                            <div className="flex items-center gap-1 mt-2">
                                                                <Video
                                                                    className={`size-3 ${isSelected
                                                                        ? "text-white/80"
                                                                        : "text-primary"
                                                                        }`}
                                                                />
                                                                <span
                                                                    className={`text-xs ${isSelected
                                                                        ? "text-white/80"
                                                                        : "text-muted-foreground"
                                                                        }`}
                                                                >
                                                                    Có video
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Feed */}
                    <div className="lg:col-span-3 space-y-4">
                        {/* Create Post Card */}
                        <Card>
                            <CardContent className="p-5">
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-12 w-12 ring-3 ring-primary/10 shadow-md shrink-0">
                                        <AvatarImage src={currentUser.avatar} />
                                        <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600 text-white font-bold">
                                            {currentUser.name.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 relative">
                                        <Input
                                            placeholder="Tìm kiếm bài viết, câu hỏi, hoặc chủ đề..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}

                                        />
                                    </div>
                                    <Dialog open={showCreatePostDialog} onOpenChange={setShowCreatePostDialog}>
                                        <DialogTrigger asChild>
                                            <Button variant="default">
                                                <Plus className="size-5 mr-2" />
                                                <span className="font-semibold">Đăng bài</span>
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                                            <DialogHeader>
                                                <DialogTitle>Tạo bài viết mới</DialogTitle>
                                                <DialogDescription>
                                                    Chia sẻ kiến thức và kinh nghiệm lái xe của bạn với cộng đồng
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="space-y-4 py-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="title">Tiêu đề bài viết *</Label>
                                                    <Input
                                                        id="title"
                                                        placeholder="Nhập tiêu đề bài viết..."
                                                        value={postTitle}
                                                        onChange={(e) => setPostTitle(e.target.value)}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="category">Danh mục *</Label>
                                                    <Select value={postCategory} onValueChange={setPostCategory}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Chọn danh mục" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {categories.map((cat) => {
                                                                const Icon = cat.icon;
                                                                return (
                                                                    <SelectItem key={cat.name} value={cat.name}>
                                                                        <div className="flex items-center gap-2">
                                                                            <Icon className="size-4" />
                                                                            <span>{cat.name}</span>
                                                                        </div>
                                                                    </SelectItem>
                                                                );
                                                            })}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="content">Nội dung bài viết *</Label>
                                                    <Textarea
                                                        id="content"
                                                        placeholder="Viết nội dung bài viết của bạn... (Hỗ trợ markdown cơ bản)"
                                                        value={postContent}
                                                        onChange={(e) => setPostContent(e.target.value)}
                                                        rows={12}
                                                        className="resize-none"
                                                    />
                                                    <p className="text-xs text-muted-foreground">
                                                        Bạn có thể sử dụng markdown để định dạng văn bản
                                                    </p>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="tags">Thẻ (Tags)</Label>
                                                        <Input
                                                            id="tags"
                                                            placeholder="Ví dụ: lái xe, an toàn, kỹ năng"
                                                            value={postTags}
                                                            onChange={(e) => setPostTags(e.target.value)}
                                                        />
                                                        <p className="text-xs text-muted-foreground">
                                                            Phân cách bằng dấu phẩy
                                                        </p>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="thumbnail">URL Ảnh đại diện</Label>
                                                        <Input
                                                            id="thumbnail"
                                                            placeholder="https://example.com/image.jpg"
                                                            value={postThumbnail}
                                                            onChange={(e) => setPostThumbnail(e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="video">URL Video (YouTube, Vimeo...)</Label>
                                                    <Input
                                                        id="video"
                                                        placeholder="https://youtube.com/watch?v=..."
                                                        value={postVideoUrl}
                                                        onChange={(e) => setPostVideoUrl(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <DialogFooter>
                                                <Button
                                                    variant="outline"
                                                    onClick={() => {
                                                        setShowCreatePostDialog(false);
                                                        setPostTitle("");
                                                        setPostContent("");
                                                        setPostCategory("");
                                                        setPostTags("");
                                                        setPostThumbnail("");
                                                        setPostVideoUrl("");
                                                    }}
                                                >
                                                    Hủy
                                                </Button>
                                                <Button
                                                    onClick={() => {
                                                        if (!postTitle || !postContent || !postCategory) {
                                                            toast.error("Vui lòng điền đầy đủ các trường bắt buộc!");
                                                            return;
                                                        }
                                                        // TODO: Implement actual post creation
                                                        toast.success("Bài viết đã được tạo thành công!");
                                                        setShowCreatePostDialog(false);
                                                        setPostTitle("");
                                                        setPostContent("");
                                                        setPostCategory("");
                                                        setPostTags("");
                                                        setPostThumbnail("");
                                                        setPostVideoUrl("");
                                                    }}
                                                >
                                                    Đăng bài
                                                </Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Posts Feed */}
                        {filteredPosts.length === 0 ? (
                            <Card>
                                <CardContent className="py-12 text-center">
                                    <MessageSquare className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                                    <h3 className="text-lg font-medium mb-2">Không tìm thấy bài viết</h3>
                                    <p className="text-gray-600">
                                        {searchQuery
                                            ? "Thử thay đổi từ khóa tìm kiếm."
                                            : "Chưa có bài viết nào."}
                                    </p>
                                </CardContent>
                            </Card>
                        ) : (
                            filteredPosts.map((post) => {
                                const comments = getComments(post.id);
                                const reactions = getReactions(post.id);
                                const userReaction = reactions.find(
                                    (r) => r.userId === currentUser.id
                                );
                                const likeCount = reactions.filter(
                                    (r) => r.type === ReactionType.LIKE
                                ).length;
                                const showComments = expandedComments.has(post.id);

                                return (
                                    <Card key={post.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 border-l-4 border-l-transparent ">
                                        {/* Post Header */}
                                        <CardContent className="pt-6">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-start gap-3 flex-1">
                                                    <Avatar className="h-12 w-12 ring-2 ring-primary/10">
                                                        <AvatarImage src={post.author.avatar} />
                                                        <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold">
                                                            {post.author.name.charAt(0)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="font-bold text-base">{post.author.name}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                            <Clock className="size-3" />
                                                            <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                                                            <span>•</span>
                                                            <Badge variant="outline" className="text-xs font-medium">
                                                                {post.category}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Post Content */}
                                            <Link href={`/forum/${post.id}`}>
                                                <h2 className="text-2xl font-bold mb-3  transition-colors cursor-pointer leading-tight">
                                                    {post.title}
                                                </h2>
                                            </Link>
                                            <p className="text-base text-gray-700 mb-4 line-clamp-3 leading-relaxed">
                                                {stripHtml(post.content)}
                                            </p>

                                            {post.thumbnail && (
                                                <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-muted shadow-md ">
                                                    <Image
                                                        src={post.thumbnail}
                                                        alt={post.title}
                                                        fill
                                                        className="object-cover "
                                                    />
                                                    {post.videoUrl && (
                                                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center ">
                                                            <div className="bg-white/90 rounded-full p-4 ">
                                                                <Play className="size-8 text-primary ml-1" />
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Post Stats */}
                                            <div className="flex items-center justify-between text-sm text-muted-foreground mb-4 pb-4 border-b border-gray-200">
                                                <div className="flex items-center gap-6">
                                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 ">
                                                        <ThumbsUp className="size-4" />
                                                        <span className="font-medium">{likeCount}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 ">
                                                        <MessageCircle className="size-4" />
                                                        <span className="font-medium">{comments.length}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-2 border-t border-gray-100 pt-3">
                                                <Button
                                                    variant="ghost"
                                                    className="flex-1 "
                                                    onClick={() => handleReaction(post.id, ReactionType.LIKE)}
                                                >
                                                    <ThumbsUp
                                                        className={`mr-2 size-5 ${userReaction?.type === ReactionType.LIKE
                                                            ? "text-blue-600 fill-blue-600"
                                                            : ""
                                                            }`}
                                                    />
                                                    <span className="font-medium">Thích</span>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    className="flex-1 "
                                                    onClick={() => toggleComments(post.id)}
                                                >
                                                    <MessageSquare className="mr-2 size-5" />
                                                    <span className="font-medium">Bình luận</span>
                                                </Button>
                                                <Button variant="ghost" className="flex-1 ">
                                                    <Share2 className="mr-2 size-5" />
                                                    <span className="font-medium">Chia sẻ</span>
                                                </Button>
                                            </div>

                                            {/* Comments Section */}
                                            {showComments && (
                                                <div className="mt-4 space-y-4">
                                                    {/* Comment Input */}
                                                    <div className="flex items-start gap-2">
                                                        <Avatar className="h-8 w-8">
                                                            <AvatarImage src={currentUser.avatar} />
                                                            <AvatarFallback>
                                                                {currentUser.name.charAt(0)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex-1 flex gap-2">
                                                            <Textarea
                                                                placeholder="Viết bình luận..."
                                                                value={commentInputs[post.id] || ""}
                                                                onChange={(e) =>
                                                                    setCommentInputs((prev) => ({
                                                                        ...prev,
                                                                        [post.id]: e.target.value,
                                                                    }))
                                                                }
                                                                rows={2}
                                                                className="resize-none"
                                                            />
                                                            <Button
                                                                size="icon"
                                                                onClick={() => handleComment(post.id)}
                                                            >
                                                                <Send className="size-4" />
                                                            </Button>
                                                        </div>
                                                    </div>

                                                    {comments.length > 0 && (
                                                        <div className="space-y-4">
                                                            {comments.map((comment) => (
                                                                <div key={comment.id} className="flex items-start gap-2">
                                                                    <Avatar className="h-8 w-8">
                                                                        <AvatarImage src={comment.user.avatar} />
                                                                        <AvatarFallback>
                                                                            {comment.user.name.charAt(0)}
                                                                        </AvatarFallback>
                                                                    </Avatar>
                                                                    <div className="flex-1">
                                                                        <div className="bg-gray-100 rounded-lg p-3">
                                                                            <div className="flex items-center gap-2 mb-1">
                                                                                <span className="font-semibold text-sm">
                                                                                    {comment.user.name}
                                                                                </span>
                                                                                <span className="text-xs text-muted-foreground">
                                                                                    {formatDate(comment.createdAt)}
                                                                                </span>
                                                                            </div>
                                                                            <p className="text-sm">{comment.content}</p>
                                                                        </div>
                                                                        <div className="flex items-center gap-4 mt-1 ml-2">
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="sm"
                                                                                className="h-6 text-xs"
                                                                                onClick={() =>
                                                                                    setReplyInputs((prev) => ({
                                                                                        ...prev,
                                                                                        [`${post.id}-${comment.id}`]: "",
                                                                                    }))
                                                                                }
                                                                            >
                                                                                Phản hồi
                                                                            </Button>
                                                                        </div>

                                                                        {/* Reply Input */}
                                                                        {replyInputs[`${post.id}-${comment.id}`] !== undefined && (
                                                                            <div className="mt-2 ml-8 flex items-start gap-2">
                                                                                <Avatar className="h-6 w-6">
                                                                                    <AvatarImage src={currentUser.avatar} />
                                                                                    <AvatarFallback>
                                                                                        {currentUser.name.charAt(0)}
                                                                                    </AvatarFallback>
                                                                                </Avatar>
                                                                                <div className="flex-1 flex gap-2">
                                                                                    <Input
                                                                                        placeholder="Viết phản hồi..."
                                                                                        value={
                                                                                            replyInputs[`${post.id}-${comment.id}`] || ""
                                                                                        }
                                                                                        onChange={(e) =>
                                                                                            setReplyInputs((prev) => ({
                                                                                                ...prev,
                                                                                                [`${post.id}-${comment.id}`]:
                                                                                                    e.target.value,
                                                                                            }))
                                                                                        }
                                                                                        onKeyDown={(e) => {
                                                                                            if (e.key === "Enter" && !e.shiftKey) {
                                                                                                e.preventDefault();
                                                                                                handleReply(post.id, comment.id);
                                                                                            }
                                                                                        }}
                                                                                    />
                                                                                    <Button
                                                                                        size="icon"
                                                                                        onClick={() =>
                                                                                            handleReply(post.id, comment.id)
                                                                                        }
                                                                                    >
                                                                                        <Send className="size-4" />
                                                                                    </Button>
                                                                                </div>
                                                                            </div>
                                                                        )}

                                                                        {/* Replies */}
                                                                        {comment.replies && comment.replies.length > 0 && (
                                                                            <div className="mt-2 ml-8 space-y-2">
                                                                                {comment.replies.map((reply) => (
                                                                                    <div
                                                                                        key={reply.id}
                                                                                        className="flex items-start gap-2"
                                                                                    >
                                                                                        <Avatar className="h-6 w-6">
                                                                                            <AvatarImage src={reply.user.avatar} />
                                                                                            <AvatarFallback>
                                                                                                {reply.user.name.charAt(0)}
                                                                                            </AvatarFallback>
                                                                                        </Avatar>
                                                                                        <div className="flex-1">
                                                                                            <div className="bg-gray-50 rounded-lg p-2">
                                                                                                <div className="flex items-center gap-2 mb-1">
                                                                                                    <span className="font-semibold text-xs">
                                                                                                        {reply.user.name}
                                                                                                    </span>
                                                                                                    <span className="text-xs text-muted-foreground">
                                                                                                        {formatDate(reply.createdAt)}
                                                                                                    </span>
                                                                                                </div>
                                                                                                <p className="text-xs">{reply.content}</p>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            ))}
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
