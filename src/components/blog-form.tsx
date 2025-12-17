"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";
import { Trash2, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MockBlogPost } from "@/lib/mock-data";
import { stripHtmlTags } from "@/lib/text-utils";
import { ShadcnEditor } from "@/components/shadcn-editor/shadcn-editor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BlogCategory } from "@/types/blog/blog.type";
import { log } from "console";

export type BlogFormValues = {
  title: string;
  content: string;
  thumbnail: string;
  galleryImages: string[];
  categoryId: string | null;
};

type BlogFormProps = {
  mode: "create" | "edit";
  initialPost?: MockBlogPost | null;
  onSubmit?: (values: BlogFormValues) => Promise<void> | void;
  categories?: BlogCategory[];
  initialCategoryId?: string;
};

// Square image upload component for blog form
function SquareImageUpload({
  label,
  onUpload,
  preview,
}: {
  label: string;
  onUpload: (base64: string) => void;
  preview?: string;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn file ảnh (JPG, PNG, SVG, ...)");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      onUpload(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileChange(file);
  };

  return (
    <div className="space-y-2">
      {label && <Label className="text-foreground">{label}</Label>}
      {preview ? (
        <div className="aspect-square w-full max-w-xs rounded-lg border-2 border-border bg-secondary">
          <img
            src={preview || "/placeholder.svg"}
            alt={label || "Preview"}
            className="w-full h-full object-contain"
          />
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`aspect-square w-full max-w-xs border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors flex flex-col items-center justify-center ${
            isDragging
              ? "border-accent bg-accent/10"
              : "border-border hover:bg-secondary"
          }`}
        >
          <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
          <p className="text-sm font-medium text-foreground">
            Nhấp để tải lên hoặc kéo và thả
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            JPG, PNG, SVG lên đến 5MB
          </p>
        </div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/svg+xml,image/gif,image/webp"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileChange(file);
        }}
        className="hidden"
      />
    </div>
  );
}

export function BlogForm({
  mode,
  initialPost,
  onSubmit,
  categories = [],
  initialCategoryId,
}: BlogFormProps) {
  const [values, setValues] = useState<BlogFormValues>(() => ({
    title: initialPost?.title ?? "",
    content: initialPost?.content ?? "",
    thumbnail: initialPost?.thumbnail ?? "",
    galleryImages: initialPost?.galleryImages ?? [],
    categoryId:
      initialCategoryId ??
      ((initialPost as unknown as { categoryId?: string | null })?.categoryId ??
        null),
  }));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    title?: string;
    content?: string;
    thumbnail?: string;
    galleryImages?: string;
  }>({});

  useEffect(() => {
    setValues({
      title: initialPost?.title ?? "",
      content: initialPost?.content ?? "",
      thumbnail: initialPost?.thumbnail ?? "",
      galleryImages: initialPost?.galleryImages ?? [],
      categoryId:
        initialCategoryId ??
        ((initialPost as unknown as { categoryId?: string | null })?.categoryId ??
          null),
    });
    console.log(values.title);
    console.log(values.content);
    console.log(values.thumbnail);
  }, [initialPost, initialCategoryId]);

  const isContentEmpty = useMemo(
    () => !stripHtmlTags(values.content),
    [values.content]
  );

  const handleChange =
    (field: keyof BlogFormValues) => (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setValues((prev) => ({
        ...prev,
        [field]: value,
      }));
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    };

  const handleContentChange = (html: string) => {
    setValues((prev) => ({
      ...prev,
      content: html,
    }));
    setErrors((prev) => ({
      ...prev,
      content: undefined,
    }));
  };

  const handleThumbnailUpload = (base64: string) => {
    setValues((prev) => ({
      ...prev,
      thumbnail: base64,
    }));
    setErrors((prev) => ({
      ...prev,
      thumbnail: undefined,
    }));
  };

  const handleGalleryAdd = (base64: string) => {
    setValues((prev) => ({
      ...prev,
      galleryImages: [...prev.galleryImages, base64],
    }));
    setErrors((prev) => ({
      ...prev,
      galleryImages: undefined,
    }));
  };

  const handleGalleryChange = (index: number, base64: string) => {
    setValues((prev) => {
      const updated = [...prev.galleryImages];
      updated[index] = base64;
      return {
        ...prev,
        galleryImages: updated,
      };
    });
  };

  const handleGalleryRemove = (index: number) => {
    setValues((prev) => ({
      ...prev,
      galleryImages: prev.galleryImages.filter(
        (_, itemIndex) => itemIndex !== index
      ),
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: {
      title?: string;
      content?: string;
      thumbnail?: string;
      galleryImages?: string;
    } = {};

    if (!values.title.trim()) {
      nextErrors.title = "Tiêu đề không được để trống.";
    }

    if (isContentEmpty) {
      nextErrors.content = "Nội dung không được để trống.";
    }

    if (!values.thumbnail) {
      nextErrors.thumbnail = "Ảnh đại diện bài viết không được để trống.";
    }

    // Danh sách ảnh bổ sung là bắt buộc trong chế độ tạo bài viết
    if (mode === "create" && values.galleryImages.length === 0) {
      nextErrors.galleryImages = "Danh sách ảnh bổ sung không được để trống.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit?.(values);
    } finally {
      setIsSubmitting(false);
    }
  };

  console.log(values.content);
  if(mode === "edit" && !values.content) {
    return null;
  }

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
            <Label htmlFor="title">
              Tiêu đề <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              placeholder="Nhập tiêu đề bài viết"
              value={values.title}
              onChange={handleChange("title")}
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label>
              Nội dung <span className="text-destructive">*</span>
            </Label>
            <div className="rounded-xl border bg-muted/30">
              <ShadcnEditor
                key={`blog-editor-${initialPost?.id ?? "new"}-${initialPost ? "edit" : "create"}`}
                initialValue={values.content}
                onChange={handleContentChange}
                placeholder="Viết nội dung chính của bài blog..."
              />
            </div>
            {errors.content ? (
              <p className="text-xs text-destructive">{errors.content}</p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Nội dung được định dạng với Shadcn Editor (Lexical).
              </p>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-25">
              <Label className="text-sm">
                Ảnh đại diện bài viết <span className="text-destructive">*</span>
              </Label>
              {values.thumbnail && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleThumbnailUpload("")}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="size-4" />
                </Button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <SquareImageUpload
                label=""
                onUpload={handleThumbnailUpload}
                preview={values.thumbnail}
              />
            </div>
            {errors.thumbnail && (
              <p className="text-xs text-destructive">{errors.thumbnail}</p>
            )}
          </div>
          <div className="space-y-3">
            <Label>Danh sách ảnh bổ sung <span className="text-destructive">*</span></Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {values.galleryImages.map((image, index) => (
                <div key={`gallery-${index}`} className="h-fit">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm text-muted-foreground">
                      Ảnh #{index + 1}
                    </Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleGalleryRemove(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="size-4" />
                      <span className="sr-only">Xóa ảnh</span>
                    </Button>
                  </div>
                  <SquareImageUpload
                    label=""
                    onUpload={(base64) => handleGalleryChange(index, base64)}
                    preview={image}
                  />
                </div>
              ))}
              <div className="pt-8">
                <SquareImageUpload
                  label=""
                  onUpload={(base64) => handleGalleryAdd(base64)}
                />
              </div>
            </div>
            {errors.galleryImages && (
              <p className="text-xs text-destructive">{errors.galleryImages}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Phân loại bài viết</Label>
            <Select
              value={values.categoryId ?? ""}
              onValueChange={(value) =>
                setValues((prev) => ({
                  ...prev,
                  categoryId: value || null,
                }))
              }
              disabled={isSubmitting}
            >
              <SelectTrigger>
                <SelectValue placeholder="Phân loại bài viết" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__placeholder__" disabled>
                  Phân loại bài viết
                </SelectItem>
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="__no_categories__" disabled>
                    Không có phân loại khả dụng
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-end">
        <Button
          type="submit"
          className="gap-2"
          disabled={isSubmitting}
        >
          {mode === "edit" ? "Lưu thay đổi" : "Tạo bài viết"}
        </Button>
      </div>
    </form>
  );
}
