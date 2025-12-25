"use client";

import { ShadcnEditor } from "@/components/shadcn-editor/shadcn-editor";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/auth/useAuth";
import { useCreatePost } from "@/hooks/forum/usePost";
import { UserRole } from "@/types/auth/user-role.enum";
import { FileImage, Loader2, Plus, Video, X } from "lucide-react";

type CreatePostDialogProps = {
  onCreated?: () => void;
};

export function CreatePostDialog({ onCreated }: CreatePostDialogProps) {
  const {
    open,
    setOpen,
    isLoading,
    isLoadingData,
    title,
    setTitle,
    content,
    setContent,
    selectedCategoryId,
    setSelectedCategoryId,
    imageFiles,
    videoFiles,
    imagePreviews,
    videoPreviews,
    categories,
    handleImageChange,
    handleVideoChange,
    removeImage,
    removeVideo,
    handleSubmit,
    handleClose,
  } = useCreatePost(onCreated);

  const { isAuthenticated, role } = useAuth();
  if (!isAuthenticated) {
    return;
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {role === UserRole.Instructor && (
        <DialogTrigger asChild>
          <Button variant="default">
            <Plus className="size-5 mr-2" />
            <span className="font-semibold">Đăng bài</span>
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tạo bài viết mới</DialogTitle>
          <DialogDescription>
            Chia sẻ kiến thức và kinh nghiệm lái xe của bạn với cộng đồng
          </DialogDescription>
        </DialogHeader>

        {isLoadingData ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Đang tải dữ liệu...</span>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Tiêu đề bài viết *</Label>
              <div className="rounded-lg border">
                <ShadcnEditor
                  initialValue={title}
                  onChange={setTitle}
                  placeholder="Nhập tiêu đề bài viết..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Danh mục *</Label>
              <Select value={selectedCategoryId} onValueChange={setSelectedCategoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Nội dung bài viết *</Label>
              <div className="rounded-lg border">
                <ShadcnEditor
                  initialValue={content}
                  onChange={setContent}
                  placeholder="Viết nội dung bài viết của bạn..."
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Ảnh {imageFiles.length > 0 && <span className="text-muted-foreground">({imageFiles.length})</span>}</Label>
              <div className="border-2 border-dashed rounded-lg p-4 transition-colors hover:border-primary/50">
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="flex flex-col items-center justify-center cursor-pointer min-h-[100px]"
                >
                  <FileImage className="h-10 w-10 text-muted-foreground mb-2" />
                  <span className="text-sm font-medium text-foreground mb-1">
                    Chọn ảnh hoặc kéo thả vào đây
                  </span>
                  <span className="text-xs text-muted-foreground">
                    PNG, JPG, GIF tối đa 10MB mỗi ảnh
                  </span>
                </label>
              </div>
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                  {imagePreviews.map((preview, index) => (
                    <div
                      key={index}
                      className="relative group aspect-square rounded-lg overflow-hidden border-2 border-border bg-muted"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => removeImage(index)}
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                        {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Video {videoFiles.length > 0 && <span className="text-muted-foreground">({videoFiles.length})</span>}</Label>
              <div className="border-2 border-dashed rounded-lg p-4 transition-colors hover:border-primary/50">
                <Input
                  type="file"
                  accept="video/*"
                  multiple
                  onChange={handleVideoChange}
                  className="hidden"
                  id="video-upload"
                />
                <label
                  htmlFor="video-upload"
                  className="flex flex-col items-center justify-center cursor-pointer min-h-[100px]"
                >
                  <Video className="h-10 w-10 text-muted-foreground mb-2" />
                  <span className="text-sm font-medium text-foreground mb-1">
                    Chọn video hoặc kéo thả vào đây
                  </span>
                  <span className="text-xs text-muted-foreground">
                    MP4, MOV, AVI tối đa 100MB mỗi video
                  </span>
                </label>
              </div>
              {videoFiles.length > 0 && (
                <div className="space-y-4 mt-3">
                  {videoFiles.map((file, index) => {
                    const preview = videoPreviews[index] || URL.createObjectURL(file);
                    const fileSizeMB = file ? (file.size / (1024 * 1024)).toFixed(2) : "0";
                    return (
                      <div
                        key={`${file.name}-${index}`}
                        className="relative group rounded-lg overflow-hidden border-2 border-border bg-muted"
                      >
                        <div className="aspect-video bg-black relative w-full min-h-[200px]">
                          {preview ? (
                            <video
                              src={preview}
                              controls
                              className="w-full h-full object-contain"
                              preload="metadata"
                              playsInline
                              onError={(e) => {
                                console.error("Video load error:", e);
                              }}
                            >
                              Trình duyệt của bạn không hỗ trợ video.
                            </video>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white">
                              <div className="text-center">
                                <Video className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                <p className="text-sm">Không thể tải preview video</p>
                              </div>
                            </div>
                          )}
                          <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1 z-10">
                            <Video className="h-3 w-3" />
                            <span>Video {index + 1}</span>
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={() => removeVideo(index)}
                            className="absolute top-2 right-2 h-8 w-8 opacity-90 hover:opacity-100 z-10"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="p-3 bg-background border-t">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium truncate flex-1 mr-2" title={file.name}>
                              {file.name}
                            </span>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {fileSizeMB} MB
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            Hủy
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading || isLoadingData}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang tạo...
              </>
            ) : (
              "Đăng bài"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
