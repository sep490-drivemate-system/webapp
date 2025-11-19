"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { BlogLayout } from "@/components/blog-layout";
import { BlogForm, type BlogFormValues } from "@/components/blog-form";
import { Button } from "@/components/ui/button";
import { mockBlogPosts } from "@/lib/mock-data";
import { ArrowLeft } from "lucide-react";

export default function BlogFormPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const postId = params?.id;

  const post =
    postId && postId !== "new"
      ? mockBlogPosts.find((item) => item.id === postId)
      : null;
  const isEditMode = Boolean(post);
  const backHref =
    isEditMode && post ? `/blogs-detail/${post.id}` : "/blogs-management";

  if (postId && postId !== "new" && !post) {
    return (
      <BlogLayout>
        <div className="space-y-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-foreground">
            Bài viết không tồn tại
          </h1>
          <p className="text-muted-foreground">
            Không tìm thấy bài viết bạn yêu cầu. Vui lòng quay lại danh sách bài
            viết.
          </p>
          <Link href="/blogs-management">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Quay lại danh sách
            </Button>
          </Link>
        </div>
      </BlogLayout>
    );
  }

  const handleSubmit = (values: BlogFormValues) => {
    console.log("Blog form submitted", values);
    router.push(backHref);
  };

  const backButton = (
    <Link href={backHref}>
      <ArrowLeft className="w-6 h-6" />
    </Link>
  );

  return (
    <BlogLayout
      title={isEditMode ? "Chỉnh sửa bài viết" : "Tạo bài viết"}
      description=""
      actions={backButton}
      actionsPlacement={"left"}
    >
      <div className="w-full space-y-6">
        <BlogForm
          mode={isEditMode ? "edit" : "create"}
          initialPost={post ?? undefined}
          onSubmit={handleSubmit}
        />
      </div>
    </BlogLayout>
  );
}
