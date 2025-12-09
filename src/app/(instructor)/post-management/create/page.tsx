"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/commons/Header/header";
import { BlogForm, BlogFormValues } from "@/components/blogs/blog-form";
import { PostStatus } from "@/types/post/post.type";
import postsData from "@/data/mock-posts.json";
import { toast } from "sonner";

// Mock current user (instructor)
const currentUser = {
  id: "user_001",
  name: "Nguyễn Văn An",
  email: "nguyenvanan@example.com",
  avatar: "https://i.pravatar.cc/150?img=1",
  role: "INSTRUCTOR",
};

export default function CreatePostPage() {
  const router = useRouter();

  const handleSubmit = (values: BlogFormValues) => {
    // In real app, call API to create post
    const newPost = {
      id: `post_${Date.now()}`,
      title: values.title,
      content: values.content,
      thumbnail: values.thumbnail,
      galleryImages: values.galleryImages,
      category: "Kỹ năng lái xe", // Default, can be added to form later
      tags: [], // Can be added to form later
      author: currentUser,
      status: PostStatus.PENDING_REVIEW,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 0,
      likes: 0,
      dislikes: 0,
      featured: false,
    };

    // Add to mock data (in real app, this would be an API call)
    (postsData.posts as any[]).unshift(newPost);

    // Create moderation record
    const newModeration = {
      id: `mod_${Date.now()}`,
      postId: newPost.id,
      inspectorId: "",
      inspector: null,
      status: "WAITING",
      createdAt: new Date().toISOString(),
    };
    (postsData.moderations as any[]).push(newModeration);

    toast.success("Bài viết đã được tạo và đang chờ kiểm duyệt!");
    router.push("/instructor/post-management");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tạo Bài Viết Mới"
        description="Tạo bài viết mới để chia sẻ kiến thức và kinh nghiệm lái xe"
        leftAction={
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
          >
            <ArrowLeft className="size-6" />
          </Button>
        }
      />

      <div className="max-w-4xl">
        <BlogForm mode="create" onSubmit={handleSubmit} />
      </div>
    </div>
  );
}

