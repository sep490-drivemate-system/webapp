"use client";

import type { DocumentField } from "@/lib/types";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Trash2, Plus } from "lucide-react";

interface FieldEditorProps {
  field: DocumentField;
  onChange: (field: DocumentField) => void;
  onDelete: () => void;
}

const DATA_TYPES: { value: string; label: string }[] = [
  { value: "text", label: "Text (Văn bản)" },
  { value: "number", label: "Số (Number)" },
  { value: "boolean", label: "Boolean (Đúng/Sai)" },
  { value: "date", label: "Ngày (Date)" },
  { value: "file", label: "File/Ảnh (File)" },
  { value: "select", label: "Lựa chọn (Select)" },
  { value: "textarea", label: "Văn bản dài (Textarea)" },
];

export function FieldEditor({ field, onChange, onDelete }: FieldEditorProps) {
  return (
    <div className="p-4 border border-border rounded-lg bg-muted/50 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-muted-foreground">
            Tên trường *
          </label>
          <Input
            value={field.name}
            onChange={(e) => onChange({ ...field, name: e.target.value })}
            placeholder="Ví dụ: Họ và tên"
            className="mt-1"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground">
            Loại dữ liệu *
          </label>
          <select
            value={field.type}
            onChange={(e) => onChange({ ...field, type: e.target.value })}
            className="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm"
          >
            {DATA_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={field.required || false}
            onChange={(e) => onChange({ ...field, required: e.target.checked })}
          />
          <span className="text-xs font-medium text-muted-foreground">
            Bắt buộc
          </span>
        </label>
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={onDelete}
        className="w-full text-destructive hover:text-destructive/80 bg-transparent"
      >
        <Trash2 className="w-4 h-4 mr-2" />
        Xóa trường
      </Button>
    </div>
  );
}
