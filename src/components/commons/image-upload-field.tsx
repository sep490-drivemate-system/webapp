"use client";

import { useState, useRef } from "react";
import { Upload, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface ImageUploadFieldProps {
  label: string;
  onUpload: (file: File | null) => void;
  preview?: string;
  labelClassName?: string;
  uploadAreaClassName?: string;
}

export default function ImageUploadField({
  label,
  onUpload,
  preview,
  labelClassName,
  uploadAreaClassName,
}: ImageUploadFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn file ảnh");
      return;
    }

    // Return File directly instead of converting to base64
    onUpload(file);
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
      <Label className={labelClassName || "text-foreground"}>{label}</Label>
      {preview ? (
        <div className="relative rounded-lg overflow-hidden border-2 border-border bg-secondary p-2">
          <img
            src={preview || "/placeholder.svg"}
            alt={label}
            className="w-full h-48 object-cover rounded"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onUpload(null)}
            className="absolute top-2 right-2 bg-transparent hover:bg-white/10 text-white rounded-full p-1"
          >
            <X className="w-4 h-4 text-white" />
          </Button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={
            uploadAreaClassName
              ? `${uploadAreaClassName} ${isDragging ? "!bg-[#10b981]/30" : ""}`
              : `border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                  isDragging
                    ? "border-accent bg-accent/10"
                    : "border-border hover:bg-secondary"
                }`
          }
        >
          <Upload className="w-8 h-8 mx-auto mb-2 text-[#10b981]" />
          <p className="text-sm font-medium text-white">
            Nhấp để tải lên hoặc kéo và thả
          </p>
          <p className="text-xs text-gray-300 mt-1">
            PNG, JPG, GIF lên đến 5MB
          </p>
        </div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileChange(file);
        }}
        className="hidden"
      />
    </div>
  );
}
