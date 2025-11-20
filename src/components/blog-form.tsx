"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { MockBlogPost } from "@/lib/mock-data";

const CATEGORY_OPTIONS = [
  "Kỹ năng lái xe",
  "Thi bằng lái",
  "Luật giao thông",
  "Bảo dưỡng xe",
  "Tư vấn xe",
];

export type BlogFormValues = {
  title: string;
  category: string;
  excerpt: string;
  content: string;
  image: string;
  tags: string[];
};

type BlogFormProps = {
  mode: "create" | "edit";
  initialPost?: MockBlogPost | null;
  onSubmit?: (values: BlogFormValues) => void;
};

export function BlogForm({ mode, initialPost, onSubmit }: BlogFormProps) {
  const [values, setValues] = useState<BlogFormValues>(() => ({
    title: initialPost?.title ?? "",
    category: initialPost?.category ?? CATEGORY_OPTIONS[0],
    excerpt: initialPost?.excerpt ?? "",
    content: initialPost?.content ?? "",
    image: initialPost?.thumbnail ?? "",
    tags: initialPost?.tags.map((tag) => tag.name) ?? [],
  }));
  const [tagInput, setTagInput] = useState(
    initialPost?.tags.map((tag) => tag.name).join(", ") ?? ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setValues({
      title: initialPost?.title ?? "",
      category: initialPost?.category ?? CATEGORY_OPTIONS[0],
      excerpt: initialPost?.excerpt ?? "",
      content: initialPost?.content ?? "",
      image: initialPost?.thumbnail ?? "",
      tags: initialPost?.tags.map((tag) => tag.name) ?? [],
    });
    setTagInput(initialPost?.tags.map((tag) => tag.name).join(", ") ?? "");
  }, [initialPost]);

  const parsedTags = useMemo(
    () =>
      tagInput
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    [tagInput]
  );

  const handleChange =
    (field: keyof BlogFormValues) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value;
      setValues((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

  const handleCategoryChange = (category: string) => {
    setValues((prev) => ({
      ...prev,
      category,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const payload: BlogFormValues = {
      ...values,
      tags: parsedTags,
    };

    onSubmit?.(payload);
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>
            {mode === "edit" ? "Thông tin bài viết" : "Tạo bài viết"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Tiêu đề</Label>
            <Input
              id="title"
              placeholder="Nhập tiêu đề bài viết"
              value={values.title}
              onChange={handleChange("title")}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Danh mục</Label>
            <Select
              value={values.category}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Chọn danh mục" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORY_OPTIONS.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="excerpt">Mô tả ngắn</Label>
            <Textarea
              id="excerpt"
              placeholder="Nhập mô tả ngắn gọn"
              value={values.excerpt}
              onChange={handleChange("excerpt")}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Nội dung</Label>
            <Textarea
              id="content"
              placeholder="Nhập nội dung chính"
              value={values.content}
              onChange={handleChange("content")}
              rows={8}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="image">Ảnh đại diện</Label>
            <Input
              id="image"
              placeholder="https://example.com/image.jpg"
              value={values.image}
              onChange={handleChange("image")}
              type="url"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tags">Thẻ (cách nhau bởi dấu phẩy)</Label>
            <Input
              id="tags"
              placeholder="An toàn, Lái xe, Kỹ thuật"
              value={tagInput}
              onChange={(event) => setTagInput(event.target.value)}
            />
            {parsedTags.length > 0 ? (
              <p className="text-sm text-muted-foreground">
                Thẻ hiện tại: {parsedTags.map((tag) => `#${tag}`).join(", ")}
              </p>
            ) : null}
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-end">
        <Button type="submit" className="gap-2" disabled={isSubmitting}>
          {mode === "edit" ? "Lưu thay đổi" : "Tạo bài viết"}
        </Button>
      </div>
    </form>
  );
}
