"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import { stripHtmlTags } from "@/lib/text-utils";
import { BlogCard } from "@/components/blogs/blog-card";
import { PageSectionHeader } from "@/components/commons/page-section-header";
import { SearchBar } from "@/components/commons/search-bar";
import { PaginationControls } from "@/components/commons/pagination-controls";
import { useAppDispatch, useAppSelector } from "@/lib/redux/useAppDispatch";
import { getListBlogsForAllRoles } from "@/features/blog/blogThunk";
import { getUserById } from "@/features/user/userThunk";
import { Blog } from "@/types/blog/blog.type";

type AuthorMap = Record<string, { name: string; avatar: string }>;

const ITEMS_PER_PAGE = 6;

export default function BlogsPage() {
  const dispatch = useAppDispatch();
  const { blogs, pagination, isLoading, errorMessage } = useAppSelector(
    (state) => state.blog
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [authors, setAuthors] = useState<AuthorMap>({});

  // Fetch list blogs with API pagination
  useEffect(() => {
    dispatch(
      getListBlogsForAllRoles({
        pageNumber: currentPage,
        pageSize: ITEMS_PER_PAGE,
      })
    );
  }, [dispatch, currentPage]);

  // Fetch author info based on instructorId
  useEffect(() => {
    if (!blogs.length) return;

    const missingInstructorIds = Array.from(
      new Set(
        blogs
          .map((blog) => blog.instructorId)
          .filter(
            (id): id is string => Boolean(id && typeof id === "string")
          )
      )
    ).filter((id) => !authors[id]);

    missingInstructorIds.forEach((instructorId) => {
      dispatch(getUserById({ id: instructorId }))
        .unwrap()
        .then((response) => {
          const user = response?.value;
          if (!user) return;

          setAuthors((prev) => ({
            ...prev,
            [instructorId]: {
              name: user.fullName,
              avatar: user.avatarUrl,
            },
          }));
        })
        .catch((error) => {
          console.error("Không thể tải thông tin tác giả", error);
        });
    });
  }, [blogs, authors, dispatch]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const filteredBlogs = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();
    if (!normalizedSearch) return blogs;

    return blogs.filter((blog) => {
      const rawContent =
        (blog as any).content ??
        ((blog as any).contents?.join(" ") as string | undefined) ??
        blog.categoryName ??
        "";
      const haystack = `${blog.title} ${stripHtmlTags(rawContent)}`.toLowerCase();
      return haystack.includes(normalizedSearch);
    });
  }, [blogs, searchQuery]);

  const shouldUseClientPagination = searchQuery.length > 0 || !pagination;
  const totalPages = shouldUseClientPagination
    ? Math.max(1, Math.ceil(filteredBlogs.length / ITEMS_PER_PAGE))
    : Math.max(
        1,
        Math.ceil(
          (pagination?.totalCount ?? filteredBlogs.length) / ITEMS_PER_PAGE
        )
      );

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedBlogs = shouldUseClientPagination
    ? filteredBlogs.slice(startIndex, startIndex + ITEMS_PER_PAGE)
    : filteredBlogs;

  const blogCards = useMemo(
    () =>
      paginatedBlogs.map((blog: Blog) => {
        const authorInfo = authors[blog.instructorId];
        const rawContent =
          (blog as any).content ??
          ((blog as any).contents?.join(" ") as string | undefined) ??
          blog.categoryName ??
          "";
        const publishedAt =
          (blog as any).createdAt ??
          (blog as any).publishedAt ??
          new Date().toISOString();

        return {
          id: blog.id,
          title: blog.title,
          content: stripHtmlTags(rawContent),
          image: blog.thumbnailUrl || "/placeholder.svg",
          publishedAt,
          author: authorInfo
            ? {
                name: authorInfo.name,
                avatar: authorInfo.avatar,
                role: "Huấn luyện viên",
              }
            : undefined,
        };
      }),
    [paginatedBlogs, authors]
  );

  const totalCount = pagination?.totalCount ?? filteredBlogs.length;

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
            <p className="text-sm text-gray-600">{totalCount} bài viết</p>
          </div>

          {isLoading ? (
            <Card>
              <CardContent className="py-12">
                <div className="text-center text-gray-600">
                  Đang tải danh sách bài viết...
                </div>
              </CardContent>
            </Card>
          ) : errorMessage ? (
            <Card>
              <CardContent className="py-12">
                <div className="text-center text-red-500">{errorMessage}</div>
              </CardContent>
            </Card>
          ) : filteredBlogs.length === 0 ? (
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
              {blogCards.map((blog) => (
                <BlogCard
                  key={blog.id}
                  id={blog.id}
                  title={blog.title}
                  content={blog.content}
                  image={blog.image}
                  publishedAt={blog.publishedAt}
                  author={blog.author}
                  variant="publish"
                  previewLength={120}
                />
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
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
