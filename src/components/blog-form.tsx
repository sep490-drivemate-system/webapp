"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";
import { Trash2, Plus, Upload } from "lucide-react";

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

export function BlogForm({ mode, initialPost, onSubmit }: BlogFormProps) {
  const [values, setValues] = useState<BlogFormValues>(() => ({
    title: initialPost?.title ?? "",
    content: initialPost?.content ?? "",
    thumbnail: initialPost?.thumbnail ?? "",
    galleryImages: initialPost?.galleryImages ?? [],
  }));
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setValues({
      title: initialPost?.title ?? "",
      content: initialPost?.content ?? "",
      thumbnail: initialPost?.thumbnail ?? "",
      galleryImages: initialPost?.galleryImages ?? [],
    });
  }, [initialPost]);

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
    };

  const handleContentChange = (html: string) => {
    setValues((prev) => ({
      ...prev,
      content: html,
    }));
  };

  const handleThumbnailUpload = (base64: string) => {
    setValues((prev) => ({
      ...prev,
      thumbnail: base64,
    }));
  };

  const handleGalleryAdd = (base64: string) => {
    setValues((prev) => ({
      ...prev,
      galleryImages: [...prev.galleryImages, base64],
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
            <div className="flex items-center gap-25">
              <Label className="text-sm">Ảnh đại diện bài viết</Label>
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
          </div>
          <div className="space-y-3">
            <Label>Danh sách ảnh bổ sung</Label>
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
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-end">
        <Button
          type="submit"
          className="gap-2"
          disabled={isSubmitting || isContentEmpty}
        >
          {mode === "edit" ? "Lưu thay đổi" : "Tạo bài viết"}
        </Button>
      </div>
    </form>
  );
}
