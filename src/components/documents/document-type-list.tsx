"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

import { Card } from "@/components/ui/card";

import { Plus, Edit2, Trash2, ChevronDown, ChevronUp } from "lucide-react";

import type { DocumentType } from "@/lib/types";

import { DocumentTypeForm } from "./document-type-form";

interface DocumentTypeListProps {
  documentTypes: DocumentType[];
  categoryType: "personal" | "vehicle";
  onSave: (type: DocumentType) => void;
  onDelete: (id: string) => void;
  onRefresh: () => void;
}

export function DocumentTypeList({
  documentTypes,
  categoryType,
  onSave,
  onDelete,
  onRefresh,
}: DocumentTypeListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingType, setEditingType] = useState<DocumentType | null>(null);

  const handleEdit = (type: DocumentType) => {
    setEditingType(type);
    setEditingId(type.id);
  };

  const handleDelete = (id: string) => {
    if (
      confirm(
        "Bạn có chắc chắn muốn xóa loại giấy tờ này? Hành động này không thể hoàn tác."
      )
    ) {
      onDelete(id);
    }
  };

  const handleSave = (type: DocumentType) => {
    onSave(type);
    setEditingId(null);
    setEditingType(null);
    setIsCreating(false);
    onRefresh();
  };

  const filtered = documentTypes.filter((t) => t.categoryType === categoryType);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-foreground">
          {categoryType === "personal" ? "Giấy tờ cá nhân" : "Giấy tờ xe"}
        </h3>
        <Button size="sm" onClick={() => setIsCreating(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Thêm loại giấy tờ
        </Button>
      </div>

      {isCreating && (
        <Card className="p-6 bg-card border-border">
          <DocumentTypeForm
            categoryType={categoryType}
            onSave={handleSave}
            onCancel={() => setIsCreating(false)}
          />
        </Card>
      )}

      <div className="grid gap-3">
        {filtered.map((type) => (
          <div key={type.id}>
            <button
              onClick={() =>
                setExpandedId(expandedId === type.id ? null : type.id)
              }
              className="w-full flex items-start justify-between p-4 border border-border rounded-lg bg-card hover:bg-muted/50 transition-colors"
            >
              <div className="text-left flex-1">
                <h4 className="font-semibold text-foreground">{type.name}</h4>
                <div className="mt-2 flex flex-wrap gap-2">
                  {type.fields.map((field) => (
                    <span
                      key={field.id}
                      className="inline-block px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded"
                    >
                      {field.name}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3 ml-4">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(type);
                    }}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(type.id);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                {expandedId === type.id ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </div>
            </button>

            {expandedId === type.id && (
              <Card className="mt-2 p-4 bg-muted/50 border-border">
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      Tên
                    </p>
                    <p className="text-sm text-foreground font-medium">
                      {type.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      Số trường
                    </p>
                    <p className="text-sm text-foreground font-medium">
                      {type.fields.length} trường
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      Các trường
                    </p>
                    <div className="mt-2 space-y-1">
                      {type.fields.map((field) => (
                        <div
                          key={field.id}
                          className="text-xs p-2 bg-card rounded border border-border"
                        >
                          <p className="font-medium text-foreground">
                            {field.name}
                          </p>
                          <p className="text-muted-foreground">
                            Loại: {field.type} {field.required && "(Bắt buộc)"}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>
        ))}
      </div>

      {editingId && editingType && (
        <Card className="p-6 bg-card border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Chỉnh sửa {editingType.name}
          </h3>
          <DocumentTypeForm
            initialData={editingType}
            categoryType={categoryType}
            onSave={handleSave}
            onCancel={() => {
              setEditingId(null);
              setEditingType(null);
            }}
          />
        </Card>
      )}
    </div>
  );
}
