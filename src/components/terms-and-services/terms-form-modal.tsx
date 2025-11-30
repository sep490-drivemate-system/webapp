"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface Term {
  id: string;
  title: string;
  description: string;
  type: string;
  createdAt: string;
}

interface TermsFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  term?: Term;
  onSubmit: (term: Omit<Term, "id" | "createdAt">) => void;
  loading?: boolean;
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

export function TermsFormModal({
  open,
  onOpenChange,
  term,
  onSubmit,
  loading = false,
}: TermsFormModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("1");

  useEffect(() => {
    if (term) {
      setTitle(term.title);
      setDescription(term.description);
      setType(term.type);
    } else {
      setTitle("");
      setDescription("");
      setType("1");
    }
  }, [term, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      alert("Vui lòng nhập đủ thông tin");
      return;
    }

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      type,
    });

    setTitle("");
    setDescription("");
    setType("1");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {term ? "Chỉnh sửa điều khoản" : "Tạo điều khoản mới"}
          </DialogTitle>
          <DialogDescription>
            {term
              ? "Cập nhật thông tin điều khoản"
              : "Thêm một điều khoản dịch vụ mới"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Tiêu đề</label>
            <Input
              placeholder="ví dụ: Chính sách hủy lịch"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Chi tiết</label>
            <Textarea
              placeholder="Mô tả chi tiết về điều khoản..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              disabled={loading}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Loại</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              disabled={loading}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
            >
              <option value="1">Người lái mới</option>
              <option value="2">Người hướng dẫn</option>
            </select>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Đang lưu..." : term ? "Cập nhật" : "Tạo mới"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
