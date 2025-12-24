"use client";

import type React from "react";

import { useState } from "react";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import type { DocumentType, DocumentField } from "@/lib/types";

interface DocumentFormProps {
  documentType: DocumentType;
  userId: string;
  initialData?: Record<string, any>;
  onSave: (data: Record<string, any>) => void;
  onCancel: () => void;
}

export function DocumentForm({
  documentType,
  userId,
  initialData,
  onSave,
  onCancel,
}: DocumentFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>(
    initialData || {}
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (fieldName: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
    if (errors[fieldName]) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    documentType.fields.forEach((field) => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.name} là bắt buộc`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  const renderField = (field: DocumentField) => {
    const value = formData[field.name] ?? "";
    const error = errors[field.name];

    switch (field.type) {
      case "text":
      case "number":
        return (
          <div key={field.id} className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              {field.name}
              {field.required && (
                <span className="text-destructive ml-1">*</span>
              )}
            </label>
            <Input
              type={field.type === "number" ? "number" : "text"}
              value={value}
              onChange={(e) => handleChange(field.name, e.target.value)}
              placeholder={`Nhập ${field.name.toLowerCase()}`}
              className={error ? "border-destructive" : ""}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        );

      case "date":
        return (
          <div key={field.id} className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              {field.name}
              {field.required && (
                <span className="text-destructive ml-1">*</span>
              )}
            </label>
            <Input
              type="date"
              value={value}
              onChange={(e) => handleChange(field.name, e.target.value)}
              className={error ? "border-destructive" : ""}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        );

      case "select":
        return (
          <div key={field.id} className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              {field.name}
              {field.required && (
                <span className="text-destructive ml-1">*</span>
              )}
            </label>
            <select
              value={value}
              onChange={(e) => handleChange(field.name, e.target.value)}
              className={`w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm ${
                error ? "border-destructive" : ""
              }`}
            >
              <option value="">-- Chọn --</option>
            </select>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        );

      case "textarea":
        return (
          <div key={field.id} className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              {field.name}
              {field.required && (
                <span className="text-destructive ml-1">*</span>
              )}
            </label>
            <textarea
              value={value}
              onChange={(e) => handleChange(field.name, e.target.value)}
              placeholder={`Nhập ${field.name.toLowerCase()}`}
              rows={3}
              className={`w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm ${
                error ? "border-destructive" : ""
              }`}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        );

      case "file":
        return (
          <div key={field.id} className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              {field.name}
              {field.required && (
                <span className="text-destructive ml-1">*</span>
              )}
            </label>
            <input
              type="file"
              onChange={(e) =>
                handleChange(field.name, e.target.files?.[0]?.name)
              }
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm"
            />
            {value && (
              <p className="text-xs text-muted-foreground">File: {value}</p>
            )}
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        );

      case "boolean":
        return (
          <div key={field.id} className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={value || false}
                onChange={(e) => handleChange(field.name, e.target.checked)}
              />
              <span className="text-sm font-medium text-foreground">
                {field.name}
              </span>
            </label>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {documentType.fields.map((field) => renderField(field))}
      </div>

      <div className="flex gap-3 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Hủy
        </Button>
        <Button type="submit">
          {initialData ? "Cập nhật" : "Tạo"} {documentType.name}
        </Button>
      </div>
    </form>
  );
}
