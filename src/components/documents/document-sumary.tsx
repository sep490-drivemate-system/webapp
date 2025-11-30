"use client";

import { Card } from "@/components/ui/card";

import { DEFAULT_DOCUMENT_TYPES, DocumentType } from "@/lib/types";

export function DocumentSummary() {
  const personalDocs = DEFAULT_DOCUMENT_TYPES.filter(
    (d: DocumentType) => d.categoryType === "personal"
  );

  const vehicleDocs = DEFAULT_DOCUMENT_TYPES.filter(
    (d: DocumentType) => d.categoryType === "vehicle"
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="p-6 bg-card border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Loại Giấy Tờ Cá Nhân
        </h3>
        <div className="space-y-3">
          {personalDocs.map((doc: DocumentType) => (
            <div
              key={doc.id}
              className="flex items-start justify-between pb-3 border-b border-border last:border-b-0"
            >
              <div>
                <p className="font-medium text-foreground">{doc.name}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {doc.fields.length} trường
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 bg-card border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Loại Giấy Tờ Xe
        </h3>
        <div className="space-y-3">
          {vehicleDocs.map((doc: DocumentType) => (
            <div
              key={doc.id}
              className="flex items-start justify-between pb-3 border-b border-border last:border-b-0"
            >
              <div>
                <p className="font-medium text-foreground">{doc.name}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {doc.fields.length} trường
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
