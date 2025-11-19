import blogsData from "@/data/mock-blogs.json";

type RawBlogPost = (typeof blogsData.blogs)[number];

export type BlogTag = {
  id: string;
  name: string;
};

export type MockBlogPost = Omit<RawBlogPost, "tags"> & {
  tags: BlogTag[];
  thumbnail: string;
  createdAt: string;
};

export const mockBlogPosts: MockBlogPost[] = blogsData.blogs.map((post) => ({
  ...post,
  thumbnail: post.image,
  createdAt: post.publishedAt,
  tags: post.tags.map((tag, index) => ({
    id: `${post.id}-tag-${index}`,
    name: tag,
  })),
}));

