"use client";

import { useEffect, useMemo, useState } from "react";

import PageHeader from "@/components/commons/Header/header";
import { PaginationControls } from "@/components/commons/pagination-controls";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getUserTransactions } from "@/features/transaction/transactionThunk";
import { useAppDispatch, useAppSelector } from "@/lib/redux/useAppDispatch";
import {
  FilterState,
  Transaction,
  TransactionStatus,
} from "@/types/transaction/transaction.type";
import { Filter, Search } from "lucide-react";

const defaultFilters: FilterState = {
  timeRange: "all",
  amount: "",
  status: "all",
};

const statusFilterBarOptions = [
  { key: "all" as const, label: "Tất cả" },
  { key: TransactionStatus.Pending as const, label: "Chờ xử lý" },
  { key: TransactionStatus.Processing as const, label: "Đang xử lý" },
  { key: TransactionStatus.Completed as const, label: "Hoàn thành" },
  { key: TransactionStatus.Fail as const, label: "Thất bại" },
  { key: TransactionStatus.Cancelled as const, label: "Đã hủy" },
  { key: TransactionStatus.Refunded as const, label: "Đã hoàn tiền" },
  { key: TransactionStatus.Deposit as const, label: "Nạp tiền" },
];

const statusVariants: Record<
  TransactionStatus,
  { label: string; className: string }
> = {
  [TransactionStatus.Pending]: {
    label: "Chờ xử lý",
    className: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  [TransactionStatus.Processing]: {
    label: "Đang xử lý",
    className: "bg-blue-100 text-blue-800 border-blue-200",
  },
  [TransactionStatus.Completed]: {
    label: "Hoàn thành",
    className: "bg-green-100 text-green-800 border-green-200",
  },
  [TransactionStatus.Fail]: {
    label: "Thất bại",
    className: "bg-red-100 text-red-800 border-red-200",
  },
  [TransactionStatus.Cancelled]: {
    label: "Đã hủy",
    className: "bg-gray-100 text-gray-800 border-gray-200",
  },
  [TransactionStatus.Refunded]: {
    label: "Đã hoàn tiền",
    className: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
  [TransactionStatus.Deposit]: {
    label: "Nạp tiền",
    className: "bg-indigo-100 text-indigo-800 border-indigo-200",
  },
};

const buildMonthYearOptions = () => {
  const now = new Date();
  const options = [{ value: "all", label: "Tất cả thời gian" }];

  const stopYear = now.getFullYear() - 1;
  const stopMonth = now.getMonth();

  const cursor = new Date(now.getFullYear(), now.getMonth(), 1);
  while (true) {
    const month = String(cursor.getMonth() + 1).padStart(2, "0");
    const year = cursor.getFullYear();
    options.push({
      value: `${year}-${month}`,
      label: `Tháng ${month}/${year}`,
    });

    if (cursor.getFullYear() === stopYear && cursor.getMonth() === stopMonth) {
      break;
    }

    cursor.setMonth(cursor.getMonth() - 1);
  }

  return options;
};

type TransactionItem = Transaction & {
  id?: string;
};

const renderStatusBadge = (status: TransactionStatus) => {
  const variant =
    statusVariants[status] ?? statusVariants[TransactionStatus.Pending];
  return (
    <Badge className={`${variant.className} border`} variant="secondary">
      {variant.label}
    </Badge>
  );
};

export default function TransactionsPage() {
  const dispatch = useAppDispatch();
  const { transactions, isLoading, errorMessage } = useAppSelector(
    (state) => state.transaction
  );

  const [searchValue, setSearchValue] = useState("");
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const monthYearOptions = useMemo(buildMonthYearOptions, []);

  useEffect(() => {
    dispatch(getUserTransactions());
  }, [dispatch]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const transactionItems: TransactionItem[] = useMemo(
    () =>
      (transactions ?? []).map((transaction) => ({
        ...transaction,
        id:
          (transaction as unknown as { id?: string }).id ??
          (transaction as unknown as { _id?: string })._id ??
          transaction.title,
      })),
    [transactions]
  );

  const filteredTransactions = useMemo(() => {
    const matchTimeRange = (dateValue: Date | string) => {
      if (filters.timeRange === "all") return true;

      const date = new Date(dateValue);
      const [year, month] = filters.timeRange.split("-").map(Number);
      if (Number.isNaN(date.getTime()) || !year || !month) return false;
      return (
        date.getFullYear() === year && date.getMonth() + 1 === Number(month)
      );
    };

    const matchAmount = (value: number) => {
      if (!filters.amount.trim()) return true;
      const normalizedAmount = Number(filters.amount.replace(/[,\s]/g, ""));
      if (Number.isNaN(normalizedAmount)) return true;
      return value >= normalizedAmount;
    };

    const matchStatus =
      filters.status === "all"
        ? () => true
        : (status: TransactionStatus) => String(status) === filters.status;

    return transactionItems.filter((tx) => {
      const matchesSearch = tx.title
        .toLowerCase()
        .includes(searchValue.trim().toLowerCase());

      return (
        matchesSearch &&
        matchTimeRange(tx.date) &&
        matchAmount(tx.value) &&
        matchStatus(tx.status)
      );
    });
  }, [transactionItems, searchValue, filters]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredTransactions.length / pageSize)
  );

  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredTransactions.slice(startIndex, startIndex + pageSize);
  }, [filteredTransactions, currentPage]);

  const hasActiveFilters = useMemo(() => {
    return (
      filters.timeRange !== "all" ||
      filters.amount.trim() !== "" ||
      filters.status !== "all" ||
      searchValue.trim() !== ""
    );
  }, [filters, searchValue]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue, filters]);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleStatusChange = (status: string) => {
    setFilters((prev) => ({ ...prev, status }));
    setCurrentPage(1);
  };

  const handleReset = () => {
    setFilters(defaultFilters);
    setSearchValue("");
    setCurrentPage(1);
    setShowFilters(false);
  };

  return (
    <main className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-50">
        <PageHeader
          title="Lịch Sử Giao Dịch"
          description="Quản lý và theo dõi tất cả giao dịch của bạn"
        />
      </div>
      {/* Main Content */}
      <div className="min-h-screen mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <Card className="border-none shadow-lg">
          <CardContent className="p-6 space-y-6">
            <div className="flex flex-wrap items-center gap-3 md:flex-nowrap md:justify-between">
              <div className="flex-1 min-w-[260px]">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="Tìm kiếm giao dịch..."
                    className="pl-10 h-11 bg-white/80 backdrop-blur-sm"
                  />
                </div>
              </div>
              <div className="relative">
                <Button
                  variant="outline"
                  className="flex h-11 items-center gap-2"
                  onClick={() => setShowFilters((prev) => !prev)}
                >
                  <Filter className="w-4 h-4" />
                  Bộ lọc
                </Button>
                {showFilters && (
                  <Card className="absolute right-0 z-20 mt-2 w-72 shadow-xl border border-emerald-100">
                    <CardContent className="p-4 space-y-4">
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700">
                          Thời gian
                        </p>
                        <Select
                          value={filters.timeRange}
                          onValueChange={(value) =>
                            handleFilterChange("timeRange", value)
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Chọn thời gian" />
                          </SelectTrigger>
                          <SelectContent>
                            {monthYearOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700">
                          Số tiền
                        </p>
                        <Input
                          type="number"
                          min={0}
                          inputMode="numeric"
                          value={filters.amount}
                          placeholder="Nhập số tiền tối thiểu"
                          onChange={(e) =>
                            handleFilterChange("amount", e.target.value)
                          }
                          className="h-11"
                        />
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-emerald-700"
                          onClick={handleReset}
                        >
                          Xóa bộ lọc
                        </Button>
                        <Button
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700"
                          onClick={() => setShowFilters(false)}
                        >
                          Áp dụng
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
            <Tabs
              value={filters.status}
              onValueChange={handleStatusChange}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 bg-secondary h-auto p-1">
                {statusFilterBarOptions.map((option) => {
                  const value =
                    option.key === "all" ? "all" : String(option.key);
                  return (
                    <TabsTrigger
                      key={String(option.key)}
                      value={value}
                      className="text-sm text-foreground data-[state=active]:bg-emerald-600 data-[state=active]:text-primary-foreground whitespace-nowrap"
                    >
                      {option.label}
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </Tabs>

            {isLoading && (
              <div className="border rounded-xl p-6 text-sm text-gray-600 bg-white">
                Đang tải lịch sử giao dịch...
              </div>
            )}

            {!isLoading && errorMessage && (
              <div className="border rounded-xl p-6 text-sm text-red-600 bg-red-50">
                {errorMessage}
              </div>
            )}

            {!isLoading && paginatedTransactions.length === 0 && (
              <div className="border rounded-xl p-6 text-sm text-gray-600 bg-white">
                {hasActiveFilters
                  ? "Không có giao dịch phù hợp với bộ lọc hiện tại."
                  : "Không có giao dịch nào."}
              </div>
            )}

            {!isLoading &&
              paginatedTransactions.map((transaction) => (
                <div
                  key={transaction.id ?? transaction.title}
                  className="border rounded-xl p-5 hover:shadow-md transition-all bg-white"
                >
                  <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="flex flex-col">
                        <h3 className="font-semibold text-lg mb-2 text-gray-900">
                          {transaction.title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          {formatDate(String(transaction.date))}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end justify-between gap-2 sm:min-w-[140px]">
                      {renderStatusBadge(transaction.status)}
                      <p className="text-xl font-bold text-[#1AD562]">
                        {formatPrice(transaction.value)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

            {filteredTransactions.length > pageSize && (
              <div className="pt-2 border-t border-gray-100 space-y-4">
                <div className="flex justify-center">
                  <PaginationControls
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
                <div className="flex justify-center">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage > 1) {
                              setCurrentPage(currentPage - 1);
                            }
                          }}
                          className={
                            currentPage === 1
                              ? "pointer-events-none opacity-50"
                              : ""
                          }
                        />
                      </PaginationItem>
                      {Array.from(
                        { length: Math.min(totalPages, 5) },
                        (_, i) => {
                          let pageNum: number;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }
                          return (
                            <PaginationItem key={pageNum}>
                              <PaginationLink
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setCurrentPage(pageNum);
                                }}
                                isActive={currentPage === pageNum}
                              >
                                {pageNum}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        }
                      )}
                      {totalPages > 5 && currentPage < totalPages - 2 && (
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )}
                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage < totalPages) {
                              setCurrentPage(currentPage + 1);
                            }
                          }}
                          className={
                            currentPage === totalPages
                              ? "pointer-events-none opacity-50"
                              : ""
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
