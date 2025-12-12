"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import PageHeader from "@/components/commons/Header/header";
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
    <Link href="/blog-management">
      <ArrowLeft className="size-6" />
    </Link>
  );

  const handleDelete = () => {
    if (window.confirm("Bạn có chắc muốn xóa bài viết này?")) {
      router.push("/blog-management");
    }
  };

  if (!post) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Chi tiết bài viết"
          description="Xem chi tiết, chỉnh sửa hoặc xóa bài viết"
          leftAction={headerActions}
        />
        <div className="rounded-3xl border bg-card p-6 shadow-sm">
          <div className="mx-auto w-full max-w-5xl">
            <div className="space-y-4 py-12 text-center">
              <h1 className="text-2xl font-bold text-foreground">
                Bài viết không tồn tại
              </h1>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Chi tiết bài viết"
        description="Xem chi tiết, chỉnh sửa hoặc xóa bài viết"
        leftAction={headerActions}
      />
      <div className="rounded-3xl border bg-card p-6 shadow-sm">
        <div className="mx-auto w-full max-w-5xl">
          <div className="space-y-6">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
              <Image
                src={post.thumbnail || "/placeholder.svg"}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-300 hover:scale-105"
                sizes="(max-width: 768px) 100vw, 768px"
              />
            </div>

            <div className="space-y-4">
              <div>
                <h1 className="mb-3 text-4xl font-bold text-foreground">
                  {post.title}
                </h1>
                <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
                  <span>
                    {new Date(post.createdAt).toLocaleDateString("vi-VN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>

              <div className="prose prose-sm max-w-none text-foreground dark:prose-invert">
                <div
                  className="space-y-4 text-lg leading-relaxed prose-headings:mb-3 prose-p:mb-4 prose-strong:font-semibold"
                  dangerouslySetInnerHTML={{
                    __html: post.content || "<p>Chưa có nội dung.</p>",
                  }}
                />
              </div>
              <div className="space-y-4">
                <div></div>
                {post.galleryImages?.length ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {post.galleryImages.map((image, index) => (
                      <div
                        key={`${post.id}-gallery-${index}`}
                        className="relative h-44 overflow-hidden rounded-xl border bg-muted"
                      >
                        <Image
                          src={image || "/placeholder.svg"}
                          alt={`Hình ảnh ${index + 1} của ${post.title}`}
                          fill
                          className="object-cover transition-transform duration-300 hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Bài viết chưa có hình ảnh bổ sung.
                  </p>
                )}
              </div>
              <div className="flex flex-wrap gap-2 justify-end">
                <Link href={`/blog-management/${post.id}/form`}>
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
        </div>
      </div>
    </div>
  );
}
