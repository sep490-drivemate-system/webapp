import { ArrowDownRight, ArrowUpRight, RotateCcw } from "lucide-react";

import { cn } from "@/lib/utils";
import { type Transaction } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const TYPE_ICON = {
  deposit: ArrowUpRight,
  payment: ArrowDownRight,
  refund: RotateCcw,
} as const;

const TYPE_LABEL = {
  deposit: "Nạp tiền",
  payment: "Thanh toán",
  refund: "Hoàn tiền",
} as const;

const STATUS_BADGE = {
  completed: "bg-emerald-50 text-emerald-700",
  pending: "bg-amber-50 text-amber-700",
  failed: "bg-rose-50 text-rose-700",
} as const;

interface TransactionCardProps {
  transaction: Transaction;
}

export function TransactionCard({ transaction }: TransactionCardProps) {
  const Icon = TYPE_ICON[transaction.type];

  return (
    <Card className="border border-neutral-200 shadow-sm">
      <CardContent className="p-4 sm:p-5 flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div
            className={cn(
              "flex h-11 w-11 items-center justify-center rounded-xl",
              transaction.type === "deposit" &&
                "bg-emerald-50 text-emerald-600",
              transaction.type === "payment" && "bg-blue-50 text-blue-600",
              transaction.type === "refund" && "bg-amber-50 text-amber-600"
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-base font-semibold text-neutral-900">
                {transaction.title}
              </p>
              <Badge
                variant="secondary"
                className={cn("capitalize", STATUS_BADGE[transaction.status])}
              >
                {transaction.status === "completed"
                  ? "Hoàn tất"
                  : transaction.status === "pending"
                  ? "Đang xử lý"
                  : "Thất bại"}
              </Badge>
            </div>
            <p className="text-sm text-neutral-600 mt-1">
              {transaction.description}
            </p>
            <div className="mt-2 text-sm text-neutral-500 space-y-1">
              <p>Mã giao dịch: {transaction.reference}</p>
              <p>Phương thức: {transaction.paymentMethod}</p>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold text-neutral-900">
            {transaction.type === "deposit" || transaction.type === "refund"
              ? "+"
              : "-"}
            {transaction.amount.toLocaleString("vi-VN")}₫
          </p>
          <p className="text-sm text-neutral-500 mt-1">
            {TYPE_LABEL[transaction.type]} · {transaction.date}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
