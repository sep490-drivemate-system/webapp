"use client";

import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PageHeaderProps {
  title: string;
  description: string;
  actionButton?: {
    label: string;
    onClick: () => void;
    icon: LucideIcon;
  };
  leftAction?: ReactNode;
  className?: string;
}

export default function PageHeader({
  title,
  description,
  actionButton,
  leftAction,
  className = "space-y-3",
}: PageHeaderProps) {
  return (
    <section className={className}>
      <Card className="rounded-2xl border bg-white p-6 shadow-sm">
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {leftAction && <div className="flex-shrink-0">{leftAction}</div>}
            <div className={`space-y-2 ${leftAction ? "flex-1" : ""}`}>
              <CardTitle className="text-2xl text-foreground">
                {title}
              </CardTitle>
              {description && (
                <CardDescription className="text-sm text-muted-foreground">
                  {description}
                </CardDescription>
              )}
            </div>
            {actionButton && (
              <div className="flex items-center gap-4">
                <Button
                  onClick={actionButton.onClick}
                  variant="green"
                  className="rounded-full px-6 py-2.5 font-medium"
                >
                  <actionButton.icon size={18} />
                  <span>{actionButton.label}</span>
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
      </Card>
    </section>
  );
}
