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
import { PackageFilterSidebar, FilterSection } from "@/components/commons/package-filter-sidebar";
import { useAppDispatch, useAppSelector } from "@/lib/redux/useAppDispatch";
import { getListBlogsForAllRoles, getBlogCategories } from "@/features/blog/blogThunk";
import { getUserById } from "@/features/user/userThunk";
import { Blog, BlogCategory } from "@/types/blog/blog.type";

type AuthorMap = Record<string, { name: string; avatar: string }>;

const ITEMS_PER_PAGE = 6;

interface BlogFilters {
  category: string;
}

export default function BlogsPage() {
  const dispatch = useAppDispatch();
  const { blogs, pagination, isLoading, errorMessage } = useAppSelector(
    (state) => state.blog
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [authors, setAuthors] = useState<AuthorMap>({});
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [filters, setFilters] = useState<BlogFilters>({
    category: "all",
  });

  // Fetch categories
  useEffect(() => {
    dispatch(getBlogCategories())
      .unwrap()
      .then((response) => {
        const categoriesData = response?.value;
        if (Array.isArray(categoriesData)) {
          setCategories(categoriesData);
        }
      })
      .catch((error) => {
        console.error("Không thể tải danh sách danh mục", error);
      });
  }, [dispatch]);

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
  }, [searchQuery, filters.category]);

  const filteredBlogs = useMemo(() => {
    let result = blogs;

    // Filter by category
    if (filters.category && filters.category !== "all") {
      const selectedCategory = categories.find((cat) => cat.id === filters.category);
      if (selectedCategory) {
        result = result.filter((blog) => blog.categoryName === selectedCategory.name);
      }
    }

    // Filter by search query
    const normalizedSearch = searchQuery.trim().toLowerCase();
    if (normalizedSearch) {
      result = result.filter((blog) => {
        // Blog type doesn't have content field, so we only search by title and category
        const haystack = `${blog.title} ${blog.categoryName || ""}`.toLowerCase();
        return haystack.includes(normalizedSearch);
      });
    }

    return result;
  }, [blogs, searchQuery, filters.category, categories]);

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
        // Blog type doesn't have content field, use categoryName as fallback
        const rawContent = blog.categoryName || "";

        return {
          id: blog.id,
          title: blog.title,
          content: stripHtmlTags(rawContent),
          image: blog.thumbnailUrl || "/placeholder.svg",
          author: authorInfo
            ? {
                name: authorInfo.name,
                avatar: authorInfo.avatar,
                role: "Người hướng dẫn",
              }
            : undefined,
        };
      }),
    [paginatedBlogs, authors]
  );

  const totalCount = pagination?.totalCount ?? filteredBlogs.length;

  // Prepare filter sections for PackageFilterSidebar
  const filterSections: FilterSection<BlogFilters>[] = [
    {
      key: "category",
      label: "Danh mục",
      placeholder: "Tất cả danh mục",
      options: [
        { value: "all", label: "Tất cả danh mục" },
        ...categories.map((cat) => ({
          value: cat.id,
          label: cat.name,
        })),
      ],
    },
  ];

  const handleFilterChange = (key: keyof BlogFilters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      category: "all",
    });
    setCurrentPage(1);
  };

  return (
    <div className="pt-24 pb-12 lg:pt-32 lg:pb-16 bg-gradient-to-br from-blue-50 via-white to-blue-50 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Header */}
        <PageSectionHeader
          title="Bài viết"
          description="Tìm kiếm cẩm nang học lái xe mới nhất từ đội ngũ người hướng dẫn của DriveMate."
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

        {/* Main Content with Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
          {/* Filter Sidebar */}
          <div className="lg:col-span-1">
            <PackageFilterSidebar
              filters={filters}
              sections={filterSections}
              onFilterChange={handleFilterChange}
              onReset={handleResetFilters}
              title="Bộ lọc bài viết"
              resetLabel="Xóa bộ lọc"
            />
          </div>

          {/* Blog Content */}
          <div className="lg:col-span-3">

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
                        Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc để có kết quả phù hợp hơn.
                      </p>
                      <div className="flex gap-2 justify-center">
                        <Button variant="outline" onClick={() => setSearchQuery("")}>
                          Xóa từ khóa
                        </Button>
                        {(filters.category && filters.category !== "all") && (
                          <Button variant="outline" onClick={handleResetFilters}>
                            Xóa bộ lọc
                          </Button>
                        )}
                      </div>
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
      </div>
    </div>
  );
}
