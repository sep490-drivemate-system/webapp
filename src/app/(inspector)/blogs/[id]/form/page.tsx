"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { BlogForm, type BlogFormValues } from "@/components/blog-form";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/commons/Header/header";
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
    isEditMode && post ? `/blogs-management/${post.id}` : "/blogs-management";

  if (postId && postId !== "new" && !post) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Bài viết không tồn tại"
          description="Không tìm thấy bài viết bạn yêu cầu. Vui lòng quay lại danh sách bài viết."
        />
        <div className="rounded-3xl border bg-card p-6 shadow-sm">
          <div className="mx-auto w-full max-w-5xl">
            <div className="space-y-4 py-12 text-center">
              <Link href="/blogs-management">
                <Button variant="outline" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Quay lại danh sách
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
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
    <div className="space-y-6">
      <PageHeader
        title={isEditMode ? "Chỉnh sửa bài viết" : "Tạo bài viết"}
        description=""
        leftAction={backButton}
      />
      <div className="rounded-3xl border bg-card p-6 shadow-sm">
        <div className="mx-auto w-full max-w-5xl">
          <div className="w-full space-y-6">
            <BlogForm
              mode={isEditMode ? "edit" : "create"}
              initialPost={post ?? undefined}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
