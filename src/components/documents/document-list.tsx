"use client";

import { Card } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import type { DocumentType } from "@/lib/types";

import { Edit2, Trash2, Eye, CheckCircle, AlertCircle } from "lucide-react";

interface DocumentRecord {
  id: string;
  typeName: string;
  userId: string;
  status: "pending" | "verified" | "rejected";
  data: Record<string, any>;
  updatedAt: string;
}

interface DocumentListProps {
  documents: DocumentRecord[];
  documentType: DocumentType;
  onEdit: (doc: DocumentRecord) => void;
  onDelete: (id: string) => void;
  onVerify: (id: string) => void;
  onReject: (id: string) => void;
}

export function DocumentList({
  documents,
  documentType,
  onEdit,
  onDelete,
  onVerify,
  onReject,
}: DocumentListProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-700 text-xs rounded">
            <CheckCircle className="w-3 h-3" />
            Đã xác nhận
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-500/20 text-red-700 text-xs rounded">
            <AlertCircle className="w-3 h-3" />
            Bị từ chối
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-500/20 text-yellow-700 text-xs rounded">
            <Eye className="w-3 h-3" />
            Chờ xác nhận
          </span>
        );
    }
  };

  if (documents.length === 0) {
    return (
      <Card className="p-8 bg-card border-border text-center">
        <p className="text-muted-foreground">Chưa có {documentType.name} nào</p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {documents.map((doc) => (
        <Card
          key={doc.id}
          className="p-4 bg-card border-border hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h4 className="font-semibold text-foreground">
                  {doc.typeName}
                </h4>
                {getStatusBadge(doc.status)}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Người dùng:</p>
                  <p className="text-foreground font-medium">{doc.userId}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Cập nhật:</p>
                  <p className="text-foreground font-medium">
                    {new Date(doc.updatedAt).toLocaleDateString("vi-VN")}
                  </p>
                </div>
              </div>

              <div className="mt-3 p-3 bg-muted/50 rounded border border-border">
                {Object.entries(doc.data).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-sm py-1">
                    <span className="text-muted-foreground">
                      {documentType.fields.find((f) => f.name === key)?.name ||
                        key}
                      :
                    </span>
                    <span className="font-medium text-foreground">
                      {String(value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2 ml-4 flex-wrap justify-end">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onEdit(doc)}
                title="Chỉnh sửa"
              >
                <Edit2 className="w-4 h-4" />
              </Button>
              {doc.status === "pending" && (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-green-500/10 border-green-500/50 hover:bg-green-500/20"
                    onClick={() => onVerify(doc.id)}
                    title="Xác nhận"
                  >
                    <CheckCircle className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-red-500/10 border-red-500/50 hover:bg-red-500/20"
                    onClick={() => onReject(doc.id)}
                    title="Từ chối"
                  >
                    <AlertCircle className="w-4 h-4" />
                  </Button>
                </>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={() => onDelete(doc.id)}
                title="Xóa"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
