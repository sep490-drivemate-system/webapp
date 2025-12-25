"use client";

import Link from "next/link";
import Image from "next/image";
import { Eye } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getPreviewFromContent } from "@/lib/text-utils";

interface BlogAuthor {
  name: string;
  avatar: string;
  role?: string;
}

interface BlogCardProps {
  id: string;
  title: string;
  content: string;
  image: string;
  publishedAt?: string;
  author?: BlogAuthor;
  readTime?: number;
  variant?: "instructor" | "publish" | "inspector"; // keep inspector as backward alias
  detailLink?: string;
  previewLength?: number;
  statusLabel?: string;
  statusClassName?: string;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export function BlogCard({
  id,
  title,
  content,
  image,
  publishedAt,
  author,
  variant = "instructor",
  detailLink,
  previewLength = 110,
  statusLabel,
  statusClassName,
}: BlogCardProps) {
  const formattedDate = publishedAt ? formatDate(publishedAt) : null;
  const contentPreview = getPreviewFromContent(content, previewLength);
  const linkPath =
    detailLink ||
    (variant === "instructor" || variant === "inspector"
      ? `/blog-management/${id}`
      : `/blogs-detail/${id}`);

  if (variant === "instructor" || variant === "inspector") {
    return (
      <Card className="flex h-full flex-col overflow-hidden p-0">
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
            unoptimized
          />
        </div>
        <CardHeader className="space-y-3 px-4 pt-4 flex-1">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            {formattedDate && (
              <p className="text-xs text-muted-foreground">{formattedDate}</p>
            )}
            {statusLabel ? (
              <span
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${statusClassName ?? "bg-muted text-muted-foreground"}`}
              >
                {statusLabel}
              </span>
            ) : null}
          </div>
          <CardTitle className="line-clamp-2 text-lg">{title}</CardTitle>
          <CardDescription className="line-clamp-3">
            {contentPreview}
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex items-center justify-end gap-2 border-t bg-muted/30 px-4 pb-4 pt-3">
          <Button className="w-full" variant="green" size="sm" asChild>
            <Link href={linkPath}>
              <Eye className="size-4" />
              Xem chi tiết
            </Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full group p-0 gap-0">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
          unoptimized
        />
      </div>

      <CardHeader className="flex-shrink-0">
        <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
          {title}
        </h3>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col space-y-4 pb-4">
        <p className="text-sm text-gray-600 line-clamp-3 flex-1">
          {contentPreview}
        </p>
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          {author ? (
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 overflow-hidden rounded-full bg-gray-100">
                <Image
                  src={author.avatar || "/placeholder.svg"}
                  alt={author.name}
                  fill
                  className="object-cover"
                  sizes="40px"
                  unoptimized
                />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-900">
                  {author.name}
                </span>
                <span className="text-xs text-gray-500">
                  {author.role || "Huấn luyện viên"}
                </span>
              </div>
            </div>
          ) : (
            <span className="text-sm font-medium text-gray-700">
              Không có thông tin tác giả
            </span>
          )}
          {formattedDate && (
            <span className="text-xs text-gray-500">{formattedDate}</span>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-end gap-2 border-t bg-gray-50/50 px-6 py-4 mt-auto">
        <Button className="w-full" variant="green" asChild>
          <Link href={linkPath}>
            <Eye className="h-4 w-4 mr-2" />
            Xem chi tiết
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
