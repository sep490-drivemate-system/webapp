"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { BlogLayout } from "@/components/blog-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { mockBlogPosts, type MockBlogPost } from "@/lib/mock-data";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";

export default function BlogDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const postId = params?.id;

  const post = mockBlogPosts.find(
    (blogPost: MockBlogPost) => blogPost.id === postId
  );

  const headerActions = (
    <Link href="/blogs-management">
      <ArrowLeft className="size-6" />
    </Link>
  );

  const handleDelete = () => {
    if (window.confirm("Bạn có chắc muốn xóa bài viết này?")) {
      router.push("/blogs-management");
    }
  };

  if (!post) {
    return (
      <BlogLayout
        title="Chi tiết bài viết"
        description="Xem chi tiết, chỉnh sửa hoặc xóa bài viết"
        actions={headerActions}
        actionsPlacement="left"
      >
        <div className="space-y-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-foreground">
            Bài viết không tồn tại
          </h1>
        </div>
      </BlogLayout>
    );
  }

  return (
    <BlogLayout
      title="Chi tiết bài viết"
      description="Xem chi tiết, chỉnh sửa hoặc xóa bài viết"
      actions={headerActions}
      actionsPlacement="left"
    >
      <div className="space-y-6">
        <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
          <Image
            src={post.thumbnail || "/placeholder.svg"}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </div>

        <div className="space-y-4">
          <div>
            <h1 className="mb-3 text-4xl font-bold text-foreground">
              {post.title}
            </h1>
            <div className="mb-4 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge
                  key={tag.id}
                  variant="secondary"
                  className="text-[11px] font-medium"
                >
                  {tag.name}
                </Badge>
              ))}
            </div>
            <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">
                {post.author.name}
              </span>
              <span>•</span>
              <span>
                {new Date(post.createdAt).toLocaleDateString("vi-VN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>

          <Card className="bg-card p-6">
            <div className="prose prose-sm max-w-none text-foreground dark:prose-invert">
              <p className="whitespace-pre-wrap text-lg leading-relaxed">
                {post.content}
              </p>
            </div>
          </Card>
          <div className="flex flex-wrap gap-2 justify-end">
            <Link href={`/blogs/${post.id}/form`}>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 border border-border"
              >
                <Edit className="size-4" />
                Chỉnh sửa
              </Button>
            </Link>
            <Button
              variant="destructive"
              size="sm"
              className="gap-2"
              onClick={handleDelete}
            >
              <Trash2 className="size-4" />
              Xóa
            </Button>
          </div>
        </div>
      </div>
    </BlogLayout>
  );
}
