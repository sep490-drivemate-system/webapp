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
  publishedAt: string;
  author?: BlogAuthor;
  readTime?: number;
  variant?: "inspector" | "publish";
  detailLink?: string;
  previewLength?: number;
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
  readTime,
  variant = "inspector",
  detailLink,
  previewLength = 110,
}: BlogCardProps) {
  const formattedDate = formatDate(publishedAt);
  const contentPreview = getPreviewFromContent(content, previewLength);
  const linkPath =
    detailLink ||
    (variant === "inspector"
      ? `/blogs-management/${id}`
      : `/blogs-detail/${id}`);

  if (variant === "inspector") {
    return (
      <Card className="flex h-full flex-col overflow-hidden">
        <div className="aspect-video w-full overflow-hidden bg-muted">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
        <CardHeader className="space-y-3">
          <p className="text-xs text-muted-foreground">{formattedDate}</p>
          <CardTitle className="line-clamp-2 text-lg">{title}</CardTitle>
          <CardDescription className="line-clamp-3">
            {contentPreview}
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex items-center justify-end gap-2 border-t bg-muted/30">
          <Button
            variant="outline"
            size="sm"
            className="gap-2 border border-border"
            asChild
          >
            <Link href={linkPath}>
              <Eye className="size-4" />
              Xem chi tiết
            </Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // Publish variant
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
