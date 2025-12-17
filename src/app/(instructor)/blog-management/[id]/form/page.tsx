"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { BlogForm, type BlogFormValues } from "@/components/blog-form";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/commons/Header/header";
import type { MockBlogPost } from "@/lib/mock-data";
import { ArrowLeft } from "lucide-react";
import { useThunkAction } from "@/lib/redux/useThunkAction";
import {
  createBlogForInstructor,
  gettBlogDetailForInstructor,
  getBlogCategories,
  updateBlogForInstructor,
} from "@/features/blog/blogThunk";
import { BlogCategory } from "@/types/blog/blog.type";
import { toast } from "sonner";

export default function BlogFormPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const postId = params?.id;

  const isEditMode = !!postId && postId !== "new";
  const backHref = isEditMode
    ? `/blog-management/${postId}`
    : "/blog-management";

  const [post, setPost] = useState<MockBlogPost | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const { run: fetchCategories } = useThunkAction(getBlogCategories);
  const { run: createBlog } = useThunkAction(createBlogForInstructor);
  const { run: updateBlog } = useThunkAction(updateBlogForInstructor);
  const { run: fetchBlogDetail } = useThunkAction(gettBlogDetailForInstructor);

  useEffect(() => {
    fetchCategories(undefined, {
      onSuccess: (response) => {
        const result = response as any;
        const data = result?.value ?? result;
        const successFlag =
          typeof result?.success === "boolean"
            ? result.success
            : typeof result?.isSuccess === "boolean"
              ? result.isSuccess
              : true;

        if (successFlag && Array.isArray(data)) {
          setCategories(data);
        } else {
          toast.error(
            result?.message || "Không thể tải danh sách phân loại bài viết."
          );
        }
      },
      onError: () => {
        toast.error("Không thể tải danh sách phân loại bài viết.");
      },
    });
  }, [fetchCategories]);

  useEffect(() => {
    if (!isEditMode || !postId) return;

    fetchBlogDetail(
      { id: postId as string },
      {
        onSuccess: (response) => {
          const result = response as any;
          const data = result?.value ?? result;

          if (!data) {
            setNotFound(true);
            toast.error(
              result?.message ||
                "Không thể tải chi tiết bài viết. Vui lòng thử lại."
            );
            return;
          }

          const contentHtml =
            (data as any)?.content && typeof (data as any).content === "string"
              ? (data as any).content
              : "";

          const adaptedPost: MockBlogPost = {
            id: data.id,
            title: data.title,
            content: contentHtml,
            thumbnail: data.thumbnailUrl,
            galleryImages: data.imageList ?? [],
            categoryId: data.categoryId,
          } as unknown as MockBlogPost;

          setPost(adaptedPost);
          console.log(adaptedPost)
          setNotFound(false);
        },
        onError: () => {
          setNotFound(true);
          toast.error("Không thể tải chi tiết bài viết. Vui lòng thử lại.");
        },
      }
    );
  }, [fetchBlogDetail, isEditMode, postId]);

  const initialCategoryId = useMemo(() => {
    return (post as unknown as { categoryId?: string })?.categoryId;
  }, [post]);

  if (isEditMode && notFound) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Bài viết không tồn tại"
          description="Không tìm thấy bài viết bạn yêu cầu. Vui lòng quay lại danh sách bài viết."
        />
        <div className="rounded-3xl border bg-card p-6 shadow-sm">
          <div className="mx-auto w-full max-w-5xl">
            <div className="space-y-4 py-12 text-center">
              <Link href="/blog-management">
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

  const handleSubmit = async (values: BlogFormValues) => {
    try {
      const payload = {
        Title: values.title,
        Content: values.content,
        Thumbnail: values.thumbnail,
        Images: values.galleryImages,
        CategoryId: values.categoryId,
      };

      const response = isEditMode
        ? ((await updateBlog(
            {
              id: postId as string,
              ...payload,
            },
          )) as any)
        : ((await createBlog(payload)) as any);

      const successFlag =
        typeof response?.success === "boolean"
          ? response.success
          : typeof response?.isSuccess === "boolean"
            ? response.isSuccess
            : true;

      if (!successFlag) {
        throw new Error(
          response?.message || "Không thể tạo bài viết. Vui lòng thử lại."
        );
      }

      toast.success(
        response?.message ||
          (isEditMode
            ? "Cập nhật bài viết thành công."
            : "Tạo bài viết thành công.")
      );
      router.push(isEditMode ? backHref : "/blog-management");
    } catch (error) {
      const message =
        (error as any)?.message || "Không thể tạo bài viết. Vui lòng thử lại.";
      toast.error(message);
    }
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
              categories={categories}
              initialCategoryId={initialCategoryId}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
