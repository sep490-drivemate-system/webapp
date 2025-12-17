"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import PageHeader from "@/components/commons/Header/header";
import { ArrowLeft, Edit, Trash2, Loader2 } from "lucide-react";
import { useThunkAction } from "@/lib/redux/useThunkAction";
import {
  deleteBlogForInstructor,
  gettBlogDetailForInstructor,
} from "@/features/blog/blogThunk";
import { useAppSelector } from "@/lib/redux/useAppDispatch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function BlogDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const postId = params?.id;

  const { blogDetail, isLoading, errorMessage } = useAppSelector(
    (state) => state.blog
  );
  const { run: fetchBlogDetail, loading: detailLoading } =
    useThunkAction(gettBlogDetailForInstructor);
  const { run: deleteBlog, loading: deleteLoading } =
    useThunkAction(deleteBlogForInstructor);

  useEffect(() => {
    if (postId) {
      fetchBlogDetail({ id: postId });
    }
  }, [postId, fetchBlogDetail]);

  const post = blogDetail;
  const contentHtml =
    post?.content ||
    (Array.isArray((post as any)?.contents)
      ? (post as any)?.contents.join("")
      : undefined) ||
    "<p>Chưa có nội dung.</p>";

  const headerActions = (
    <Link href="/blog-management">
      <ArrowLeft className="size-6" />
    </Link>
  );

  const handleDelete = () => {
    if (!postId) return;

    deleteBlog(
      { id: postId as string },
      {
        onSuccess: () => {
          router.push("/blog-management");
        },
        onError: () => {
          alert("Xóa bài viết thất bại. Vui lòng thử lại.");
        },
      }
    );
  };

  if (isLoading || detailLoading) {
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
              <Loader2 className="mx-auto size-8 animate-spin text-muted-foreground" />
              <p className="text-muted-foreground">
                Đang tải chi tiết bài viết...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post || errorMessage) {
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
                {errorMessage || "Bài viết không tồn tại"}
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
                src={post.thumbnailUrl || "/placeholder.svg"}
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
                  <span className="px-2 py-1 rounded-md bg-muted">
                    {post.categoryName}
                  </span>
                </div>
              </div>

              <div className="prose prose-sm max-w-none text-foreground dark:prose-invert">
                <div
                  className="space-y-4 text-lg leading-relaxed prose-headings:mb-3 prose-p:mb-4 prose-strong:font-semibold"
                  dangerouslySetInnerHTML={{
                    __html: contentHtml,
                  }}
                />
              </div>
              <div className="space-y-4">
                <div></div>
                {post.imageList?.length ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {post.imageList.map((image, index) => (
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
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="gap-2"
                      disabled={deleteLoading}
                    >
                      <Trash2 className="size-4" />
                      Xóa
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Bạn có chắc muốn xóa bài viết này?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Hành động này không thể hoàn tác. Bài viết sẽ bị xóa
                        vĩnh viễn khỏi hệ thống.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Hủy</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-destructive text-white hover:bg-destructive/90"
                        onClick={handleDelete}
                      >
                        Xóa
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
