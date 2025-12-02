"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Search,
  Clock,
  Calendar,
  User,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import blogsData from "@/data/mock-blogs.json";
import { getPreviewFromContent, stripHtmlTags } from "@/lib/text-utils";
import { PageSectionHeader } from "@/components/commons/page-section-header";
import { SearchBar } from "@/components/commons/search-bar";
import { PaginationControls } from "@/components/commons/pagination-controls";

interface Blog {
  id: string;
  title: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  image: string;
  publishedAt: string;
  readTime: number;
  views: number;
  likes: number;
  featured: boolean;
  content: string;
}

const ITEMS_PER_PAGE = 6;

export default function BlogsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const blogs: Blog[] = blogsData.blogs;

  const filteredBlogs = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    const filtered = blogs.filter((blog) => {
      if (!normalizedSearch) {
        return true;
      }

      const contentText = stripHtmlTags(blog.content).toLowerCase();
      const haystack = `${blog.title} ${contentText}`.toLowerCase();
      return haystack.includes(normalizedSearch);
    });

    return filtered.sort(
      (a, b) =>
        Number(b.featured) - Number(a.featured) ||
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }, [blogs, searchQuery]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredBlogs.length / ITEMS_PER_PAGE)
  );
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedBlogs = filteredBlogs.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="pt-24 pb-12 lg:pt-32 lg:pb-16 bg-gradient-to-br from-blue-50 via-white to-blue-50 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Header */}
        <PageSectionHeader
          title="Bài viết"
          description="Tìm kiếm cẩm nang học lái xe mới nhất từ đội ngũ huấn luyện viên của DriveMate."
        />
        {/* Search */}
        <SearchBar
          value={searchQuery}
          onChange={(value) => {
            setSearchQuery(value);
            setCurrentPage(1);
          }}
          placeholder="Tìm bài viết theo tiêu đề hoặc nội dung…"
        />

        {/* Blog Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <h2 className="text-2xl font-bold text-gray-900">
              Tất cả bài viết
            </h2>
            <p className="text-sm text-gray-600">
              {filteredBlogs.length} bài viết
            </p>
          </div>

          {filteredBlogs.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <BookOpen className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Không tìm thấy bài viết
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Thử thay đổi từ khóa tìm kiếm để có kết quả phù hợp hơn.
                  </p>
                  <Button variant="outline" onClick={() => setSearchQuery("")}>
                    Xóa từ khóa
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedBlogs.map((blog) => (
                <Card
                  key={blog.id}
                  className="overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full group p-0 gap-0"
                >
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={blog.image}
                      alt={blog.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                      unoptimized
                    />
                  </div>

                  <CardHeader className="flex-shrink-0">
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {blog.title}
                    </h3>
                  </CardHeader>

                  <CardContent className="flex-1 flex flex-col space-y-4 pb-4">
                    <p className="text-sm text-gray-600 line-clamp-3 flex-1">
                      {getPreviewFromContent(blog.content, 120)}
                    </p>
                  </CardContent>

                  <CardFooter className="pt-0 pb-4 px-6 flex items-center justify-between flex-shrink-0">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={blog.author.avatar} />
                        <AvatarFallback>
                          {getInitials(blog.author.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-xs font-medium text-gray-900">
                          {blog.author.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(blog.publishedAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{blog.readTime} phút đọc</span>
                      </div>
                      <div className="hidden md:flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>
                          {new Date(blog.publishedAt).toLocaleDateString(
                            "vi-VN"
                          )}
                        </span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/blogs/${blog.id}`}>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredBlogs.length > ITEMS_PER_PAGE && (
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        )}
      </div>
    </div>
  );
}
