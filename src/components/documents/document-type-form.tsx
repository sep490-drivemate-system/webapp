"use client";

import type React from "react";

import { useState } from "react";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Plus, ChevronDown, ChevronUp, Save } from "lucide-react";

import type { DocumentType, DocumentField } from "@/lib/types";

import { FieldEditor } from "./field-editor";

interface DocumentTypeFormProps {
  categoryType: "personal" | "vehicle";
  initialData?: DocumentType;
  onSave: (data: DocumentType) => void;
  onCancel: () => void;
}

const generateId = () =>
  `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export function DocumentTypeForm({
  categoryType,
  initialData,
  onSave,
  onCancel,
}: DocumentTypeFormProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [fields, setFields] = useState<DocumentField[]>(
    initialData?.fields || []
  );
  const [expandedFieldId, setExpandedFieldId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const addField = () => {
    const newField: DocumentField = {
      id: generateId(),
      name: `field_${Date.now()}`,
      type: "text",
      required: false,
    };
    setFields([...fields, newField]);
  };

  const removeField = (id: string) => {
    setFields(fields.filter((f) => f.id !== id));
  };

  const updateField = (id: string, updates: DocumentField) => {
    setFields(fields.map((f) => (f.id === id ? updates : f)));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = "Tên loại giấy tờ là bắt buộc";
    }

    if (fields.length === 0) {
      newErrors.fields = "Phải có ít nhất một trường";
    }

    fields.forEach((field, index) => {
      if (!field.name.trim()) {
        newErrors[`field-${index}-name`] = "Tên trường là bắt buộc";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const documentType: DocumentType = {
      id: initialData?.id || `doc-${Date.now()}`,
      name,
      categoryType,
      fields,
    };

    onSave(documentType);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Tên loại giấy tờ *
          </label>
          <Input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) {
                setErrors({ ...errors, name: "" });
              }
            }}
            placeholder="Ví dụ: Căn cước công dân"
            className={errors.name ? "border-destructive" : ""}
          />
          {errors.name && (
            <p className="text-xs text-destructive mt-1">{errors.name}</p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="font-semibold text-foreground">
            Các trường dữ liệu *
          </h4>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={addField}
            className="gap-2 bg-transparent"
          >
            <Plus className="w-4 h-4" />
            Thêm trường
          </Button>
        </div>

        {errors.fields && (
          <p className="text-xs text-destructive">{errors.fields}</p>
        )}

        <div className="space-y-2">
          {fields.map((field, index) => (
            <div key={field.id}>
              <button
                type="button"
                onClick={() =>
                  setExpandedFieldId(
                    expandedFieldId === field.id ? null : field.id
                  )
                }
                className="w-full flex items-center justify-between p-3 border border-border rounded-lg bg-card hover:bg-muted/50 transition-colors"
              >
                <div className="text-left">
                  <p className="text-sm font-medium text-foreground">
                    {field.name || `Trường ${index + 1}`}
                  </p>
                  <p className="text-xs text-muted-foreground">{field.type}</p>
                </div>
                {expandedFieldId === field.id ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>

              {expandedFieldId === field.id && (
                <div className="mt-2">
                  <FieldEditor
                    field={field}
                    onChange={(updated: DocumentField) =>
                      updateField(field.id, updated)
                    }
                    onDelete={() => removeField(field.id)}
                  />
                </div>
              )}

              {errors[`field-${index}-name`] && (
                <p className="text-xs text-destructive mt-1">
                  {errors[`field-${index}-name`]}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3 justify-end pt-4 border-t border-border">
        <Button type="button" variant="outline" onClick={onCancel}>
          Hủy
        </Button>
        {initialData ? (
          <Button type="submit" className="gap-2">
            <Save className="h-4 w-4" />
            Lưu cấu hình
          </Button>
        ) : (
          <Button type="submit">Thêm giấy tờ</Button>
        )}
      </div>
    </form>
  );
}
