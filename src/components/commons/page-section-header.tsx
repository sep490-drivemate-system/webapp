import { ReactNode } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface PageSectionHeaderProps {
  title: string;
  description?: string;
  centered?: boolean;
  className?: string;
  extra?: ReactNode;
}

export function PageSectionHeader({
  title,
  description,
  centered = true,
  className = "",
  extra,
}: PageSectionHeaderProps) {
  return (
    <div className={`mb-8 ${centered ? "text-center" : ""} ${className}`}>
      <Card className="border-0 bg-transparent shadow-none">
        <CardHeader className={centered ? "items-center" : ""}>
          <CardTitle className="text-3xl sm:text-4xl font-bold text-gray-900">
            {title}
          </CardTitle>
          {description && (
            <CardDescription className="text-gray-600 max-w-2xl mx-auto">
              {description}
            </CardDescription>
          )}
          {extra && <div className="mt-2">{extra}</div>}
        </CardHeader>
      </Card>
    </div>
  );
}
