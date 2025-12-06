"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Calendar, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import blogsData from "@/data/mock-blogs.json";
import { stripHtmlTags } from "@/lib/text-utils";

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const blogId = params.id as string;

  const blog = blogsData.blogs.find((b) => b.id === blogId);

  if (!blog) {
    return (
      <div className="pt-24 pb-12 lg:pt-32 lg:pb-16 bg-gradient-to-br from-blue-50 via-white to-blue-50 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Không tìm thấy bài viết
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formattedDate = formatDate(blog.publishedAt);
  const content = stripHtmlTags(blog.content) || blog.content;

  return (
    <div className="pt-24 pb-12 lg:pt-32 lg:pb-16 bg-gradient-to-br from-blue-50 via-white to-blue-50 min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {blog.title}
        </h1>

        {/* Published Date */}
        <div className="flex items-center gap-2 text-gray-600 mb-8">
          <span className="text-sm">Ngày tạo bài viết: {formattedDate}</span>
        </div>

        {/* Thumbnail Image */}
        <div className="relative w-full h-64 md:h-96 mb-8 rounded-lg overflow-hidden shadow-lg">
          <Image
            src={blog.image}
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
            {content}
          </div>
        </div>

        {/* Gallery Images */}
        {blog.galleryImages && blog.galleryImages.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Hình ảnh liên quan
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {blog.galleryImages.map((imageUrl, index) => (
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

        {/* Back Button */}
        <div className="mt-12 flex justify-center">
          <Button
            className="w-full"
            variant="green"
            onClick={() => router.push("/blogs")}
          > 
            Quay lại danh sách bài viết
          </Button>
        </div>
      </div>
    </div>
  );
}
