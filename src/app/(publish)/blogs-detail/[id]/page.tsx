"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { stripHtmlTags } from "@/lib/text-utils";
import { useAppDispatch, useAppSelector } from "@/lib/redux/useAppDispatch";
import { getBlogDetailForAllRoles } from "@/features/blog/blogThunk";
import { getUserById } from "@/features/user/userThunk";
import type { IUserInfo } from "@/types/user/user-profile.type";
import type { GenericResponse } from "@/types/generic/genericResponse";
import type { BlogDetail, BlogForInstructorDetail } from "@/types/blog/blog.type";

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const blogId = params.id as string;

  const dispatch = useAppDispatch();
  const { blogDetail, isLoading, errorMessage } = useAppSelector(
    (state) => state.blog
  );

  const [author, setAuthor] = useState<{
    name: string;
    avatar: string;
  } | null>(null);

  // Fetch blog detail
  useEffect(() => {
    if (!blogId) return;
    dispatch(getBlogDetailForAllRoles({ id: blogId }));
  }, [dispatch, blogId]);

  // Fetch author info based on instructorId from blog detail
  useEffect(() => {
    if (!blogDetail?.instructorId) return;

    dispatch(getUserById({ id: blogDetail.instructorId }))
      .unwrap()
      .then((response) => {
        const userResponse = response as GenericResponse<IUserInfo>;
        const user = userResponse?.value;
        if (!user) return;

        setAuthor({
          name: user.fullName,
          avatar: user.avatarUrl,
        });
      })
      .catch((error) => {
        console.error("Không thể tải thông tin tác giả", error);
      });
  }, [blogDetail?.instructorId, dispatch]);

  const blog = useMemo(() => {
    if (!blogDetail) return null;


    // Handle both BlogDetail and BlogForInstructorDetail types, and nested content structure
    type BlogDetailWithNestedContent = BlogDetail | BlogForInstructorDetail | {
      content?: string | { content?: string };
      createdAt?: string;
      publishedAt?: string;
    };
    
    const detail = blogDetail as BlogDetailWithNestedContent;
    const rawContent =
      (typeof detail.content === "object" && detail.content !== null && "content" in detail.content
        ? detail.content.content
        : typeof detail.content === "string"
        ? detail.content
        : "") ?? "";

    const publishedAt =
      "createdAt" in detail && detail.createdAt
        ? detail.createdAt
        : "publishedAt" in detail && detail.publishedAt
        ? detail.publishedAt
        : undefined;

    return {
      id: blogDetail.id,
      title: blogDetail.title,
      content: stripHtmlTags(
        typeof rawContent === "string" ? rawContent : String(rawContent ?? "")
      ),
      thumbnailUrl: blogDetail.thumbnailUrl || "/placeholder.svg",
      imageList: blogDetail.imageList || [],
      publishedAt,
    };
  }, [blogDetail]);

  if (isLoading && !blog) {
    return (
      <div className="pt-24 pb-12 lg:pt-32 lg:pb-16 bg-gradient-to-br from-blue-50 via-white to-blue-50 min-h-screen">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center py-16 text-gray-600">
            Đang tải chi tiết bài viết...
          </div>
        </div>
      </div>
    );
  }

  if (errorMessage || !blog) {
    return (
      <div className="pt-24 pb-12 lg:pt-32 lg:pb-16 bg-gradient-to-br from-blue-50 via-white to-blue-50 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {errorMessage || "Không tìm thấy bài viết"}
            </h1>
            <Button onClick={() => router.push("/blogs")} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại danh sách bài viết
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const formattedDate = blog.publishedAt
    ? new Date(blog.publishedAt).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : null;

  const galleryImages = blog.imageList.filter(
    (imageUrl) => imageUrl !== blog.thumbnailUrl
  );

  return (
    <div className="pt-24 pb-12 lg:pt-32 lg:pb-16 bg-gradient-to-br from-blue-50 via-white to-blue-50 min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {blog.title}
        </h1>

        {/* Published Date */}
        {formattedDate && (
          <div className="flex items-center gap-2 text-gray-600 mb-8">
            <span className="text-sm">Ngày tạo bài viết: {formattedDate}</span>
          </div>
        )}

        {/* Thumbnail Image */}
        <div className="relative w-full h-64 md:h-96 mb-8 rounded-lg overflow-hidden shadow-lg">
          <Image
            src={blog.thumbnailUrl}
            alt={blog.title}
            fill
            className="object-cover"
            priority
            unoptimized
          />
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none mb-8">
          <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {blog.content}
          </div>
        </div>

        {/* Gallery Images */}
        {galleryImages.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Hình ảnh liên quan
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {galleryImages.map((imageUrl, index) => (
                <div
                  key={index}
                  className="relative w-full h-64 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
                >
                  <Image
                    src={imageUrl}
                    alt={`${blog.title} - Hình ${index + 1}`}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                    unoptimized
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Author Info */}
        {author && (
          <div className="mt-12 border-t pt-6 flex items-center gap-4">
            <div className="relative w-14 h-14 rounded-full overflow-hidden border shadow-sm">
              <Image
                src={author.avatar || "/placeholder.svg"}
                alt={author.name}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Tác giả</div>
              <div className="font-semibold text-gray-900">{author.name}</div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}


