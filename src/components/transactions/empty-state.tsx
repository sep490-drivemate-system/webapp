import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title?: string;
  description?: string;
  onReset?: () => void;
}

export function EmptyState({
  title = "Không tìm thấy giao dịch phù hợp",
  description = "Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm của bạn.",
  onReset,
}: EmptyStateProps) {
  return (
    <div className="p-8 text-center space-y-4">
      <div>
        <p className="text-lg font-semibold text-neutral-900">{title}</p>
        <p className="text-sm text-neutral-500 mt-1">{description}</p>
      </div>
      {onReset ? (
        <Button variant="outline" onClick={onReset}>
          Xóa bộ lọc
        </Button>
      ) : null}
    </div>
  );
}
