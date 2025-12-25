"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, Edit2 } from "lucide-react";
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
} from "@tabler/icons-react";
import { usePagination } from "@/hooks/commonHooks";

interface Term {
  id: string;
  title: string;
  description: string;
  type: string;
  createdAt: string;
}

interface TermsListProps {
  onEdit: (term: Term) => void;
  onDelete: (id: string) => void;
  refreshTrigger: number;
  terms: Term[];
  loading: boolean;
}

const getTypeLabel = (type: string): string => {
  switch (type) {
    case "1":
      return "Người lái mới";
    case "2":
      return "Người hướng dẫn";
    default:
      return `Loại ${type}`;
  }
};

const DEFAULT_PAGE_SIZE = 10;

export function TermsList({ onEdit, onDelete, terms, loading }: TermsListProps) {
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const { page, totalPages, currentItems, setPage, next, prev } = usePagination(
    terms,
    pageSize
  );

  const handleDelete = (id: string) => {
    onDelete(id);
  };

  const canGoPrevious = page > 1;
  const canGoNext = page < totalPages;

  if (loading) {
    return (
      <div className="text-center py-8 text-muted-foreground">Đang tải...</div>
    );
  }

  if (terms.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">Chưa có điều khoản nào</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {currentItems.map((term) => (
          <Card key={term.id} className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-lg">{term.title}</h3>
                  <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                    {getTypeLabel(term.type)}
                  </span>
                </div>
                <p className="text-muted-foreground text-sm line-clamp-2">
                  {term.description}
                </p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(term)}
                  className="gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Sửa
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(term.id)}
                  className="gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Xóa
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4">
        <div className="text-muted-foreground hidden flex-1 text-xs sm:text-sm lg:flex">
          Hiển thị {currentItems.length} trong {terms.length} kết quả.
        </div>
        <div className="flex w-full items-center justify-center sm:justify-end gap-4 sm:gap-8 lg:w-fit">
          <div className="hidden items-center gap-2 lg:flex">
            <Label htmlFor="rows-per-page" className="text-sm font-medium">
              Số hàng mỗi trang
            </Label>
            <Select
              value={`${pageSize}`}
              onValueChange={(value) => {
                setPageSize(Number(value));
                setPage(1);
              }}
            >
              <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                <SelectValue placeholder={pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((size) => (
                  <SelectItem key={size} value={`${size}`}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-fit items-center justify-center text-xs sm:text-sm font-medium">
            Trang {page} trong {totalPages}
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <Button
              variant="outline"
              className="hidden h-7 w-7 sm:h-8 sm:w-8 p-0 lg:flex"
              onClick={() => setPage(1)}
              disabled={!canGoPrevious}
            >
              <span className="sr-only">Go to first page</span>
              <IconChevronsLeft className="size-3 sm:size-4" />
            </Button>
            <Button
              variant="outline"
              className="size-7 sm:size-8"
              size="icon"
              onClick={prev}
              disabled={!canGoPrevious}
            >
              <span className="sr-only">Go to previous page</span>
              <IconChevronLeft className="size-3 sm:size-4" />
            </Button>
            <Button
              variant="outline"
              className="size-7 sm:size-8"
              size="icon"
              onClick={next}
              disabled={!canGoNext}
            >
              <span className="sr-only">Go to next page</span>
              <IconChevronRight className="size-3 sm:size-4" />
            </Button>
            <Button
              variant="outline"
              className="hidden size-7 sm:size-8 lg:flex"
              size="icon"
              onClick={() => setPage(totalPages)}
              disabled={!canGoNext}
            >
              <span className="sr-only">Go to last page</span>
              <IconChevronsRight className="size-3 sm:size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
