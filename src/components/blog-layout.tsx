"use client";

import { ReactNode } from "react";

type BlogLayoutProps = {
  children: ReactNode;
  title?: string;
  description?: string;
  actions?: ReactNode;
  actionsPlacement?: "left" | "right";
};

export function BlogLayout({
  children,
  title = "Quản lý bài viết",
  description = "Theo dõi, chỉnh sửa và xem chi tiết các bài viết.",
  actions,
  actionsPlacement = "right",
}: BlogLayoutProps) {
  const renderActions = actions ? (
    <div className="flex-shrink-0">{actions}</div>
  ) : null;

  return (
    <div className="space-y-6">
      <header className="rounded-3xl border bg-background shadow-sm">
        <div className="flex flex-col gap-4 border-b bg-muted/20 p-6 md:flex-row md:items-center md:justify-between">
          {actionsPlacement === "left" ? renderActions : null}
          <div className="flex-1">
            <p className="text-2xl font-semibold text-foreground">{title}</p>
            {description && (
              <p className="text-muted-foreground">{description}</p>
            )}
          </div>
          {actionsPlacement === "right" ? renderActions : null}
        </div>
      </header>
      <main className="rounded-3xl border bg-card p-6 shadow-sm">
        <div className="mx-auto w-full max-w-5xl">{children}</div>
      </main>
    </div>
  );
}
