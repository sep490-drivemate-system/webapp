"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MockBlogPost } from "@/lib/mock-data";
import { stripHtmlTags } from "@/lib/text-utils";
import { ShadcnEditor } from "@/components/shadcn-editor/shadcn-editor";

export type BlogFormValues = {
  title: string;
  content: string;
  thumbnail: string;
  galleryImages: string[];
};

type BlogFormProps = {
  mode: "create" | "edit";
  initialPost?: MockBlogPost | null;
  onSubmit?: (values: BlogFormValues) => void;
};

export function BlogForm({ mode, initialPost, onSubmit }: BlogFormProps) {
  const [values, setValues] = useState<BlogFormValues>(() => ({
    title: initialPost?.title ?? "",
    content: initialPost?.content ?? "",
    thumbnail: initialPost?.thumbnail ?? "",
    galleryImages: initialPost?.galleryImages ?? [],
  }));
  const [galleryInput, setGalleryInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setValues({
      title: initialPost?.title ?? "",
      content: initialPost?.content ?? "",
      thumbnail: initialPost?.thumbnail ?? "",
      galleryImages: initialPost?.galleryImages ?? [],
    });
    setGalleryInput("");
  }, [initialPost]);

  const isContentEmpty = useMemo(
    () => !stripHtmlTags(values.content),
    [values.content]
  );

  const handleChange =
    (field: keyof BlogFormValues) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setValues((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

  const handleContentChange = (html: string) => {
    setValues((prev) => ({
      ...prev,
      content: html,
    }));
  };

  const handleGalleryAdd = () => {
    if (!galleryInput.trim()) {
      return;
    }
    setValues((prev) => ({
      ...prev,
      galleryImages: [...prev.galleryImages, galleryInput.trim()],
    }));
    setGalleryInput("");
  };

  const handleGalleryChange = (index: number, value: string) => {
    setValues((prev) => {
      const updated = [...prev.galleryImages];
      updated[index] = value;
      return {
        ...prev,
        galleryImages: updated,
      };
    });
  };

  const handleGalleryRemove = (index: number) => {
    setValues((prev) => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isContentEmpty) {
      return;
    }
    setIsSubmitting(true);

    onSubmit?.(values);
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
        <CardContent className="space-y-6">
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
            <Label>Nội dung</Label>
            <div className="rounded-xl border bg-muted/30">
              <ShadcnEditor
                key={initialPost?.id ?? "new-blog"}
                initialValue={initialPost?.content ?? ""}
                onChange={handleContentChange}
                placeholder="Viết nội dung chính của bài blog..."
              />
            </div>
            {isContentEmpty ? (
              <p className="text-xs text-destructive">
                Nội dung không được để trống.
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Nội dung được định dạng với Shadcn Editor (Lexical).
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="thumbnail">Ảnh đại diện</Label>
            <Input
              id="thumbnail"
              placeholder="https://example.com/image.jpg"
              value={values.thumbnail}
              onChange={handleChange("thumbnail")}
              type="url"
            />
          </div>
          <div className="space-y-3">
            <Label>Danh sách ảnh bổ sung</Label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                placeholder="https://example.com/gallery-image.jpg"
                value={galleryInput}
                onChange={(event) => setGalleryInput(event.target.value)}
              />
              <Button
                type="button"
                variant="secondary"
                onClick={handleGalleryAdd}
                disabled={!galleryInput.trim()}
              >
                Thêm ảnh
              </Button>
            </div>
            {values.galleryImages.length > 0 ? (
              <div className="space-y-2">
                {values.galleryImages.map((image, index) => (
                  <div key={`${image}-${index}`} className="flex items-center gap-2">
                    <Input
                      value={image}
                      onChange={(event) => handleGalleryChange(index, event.target.value)}
                      placeholder={`Ảnh #${index + 1}`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleGalleryRemove(index)}
                    >
                      <Trash2 className="size-4" />
                      <span className="sr-only">Xóa ảnh</span>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Chưa có ảnh bổ sung nào. Bạn có thể thêm nhiều ảnh để hiển thị cuối bài viết.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-end">
        <Button type="submit" className="gap-2" disabled={isSubmitting || isContentEmpty}>
          {mode === "edit" ? "Lưu thay đổi" : "Tạo bài viết"}
        </Button>
      </div>
    </form>
  );
}
