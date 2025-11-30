"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { TransactionCard } from "@/components/transactions/transaction-card";
import { TransactionFilters } from "@/components/transactions/transaction-filters";
import { TransactionSearch } from "@/components/transactions/transaction-search";
import { EmptyState } from "@/components/transactions/empty-state";
import { mockTransactions, type Transaction } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PageHeader from "@/components/commons/Header/header";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronDown, Filter as FilterIcon } from "lucide-react";

interface FilterState {
  timeRange: string;
  amount: string;
  status: string;
}

const DEFAULT_FILTERS: FilterState = {
  timeRange: "all",
  amount: "",
  status: "all",
};

const TRANSACTION_TABS = [
  { label: "Tất cả giao dịch", value: "all" },
  { label: "Nạp tiền", value: "deposit" },
  { label: "Thanh toán", value: "payment" },
  { label: "Hoàn tiền", value: "refund" },
] as const;

type TransactionTabValue = (typeof TRANSACTION_TABS)[number]["value"];

const ITEMS_PER_PAGE = 5;

const generateTimeRangeOptions = () => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const targetMonth = (currentMonth - 1 + 12) % 12;
  const targetYear = currentYear - 1;

  const options = [{ label: "Tất cả thời gian", value: "all" }];
  let month = currentMonth;
  let year = currentYear;

  while (year > targetYear || (year === targetYear && month >= targetMonth)) {
    const label = `${String(month + 1).padStart(2, "0")}/${year}`;
    options.push({ label, value: label });
    month -= 1;
    if (month < 0) {
      month = 11;
      year -= 1;
    }
  }

  return options;
};

export default function TransactionsPage() {
  const [searchText, setSearchText] = useState("");
  const [transactionTab, setTransactionTab] =
    useState<TransactionTabValue>("all");
  const [appliedFilters, setAppliedFilters] =
    useState<FilterState>(DEFAULT_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const timeOptions = useMemo(() => generateTimeRangeOptions(), []);

  const matchesTimeRange = (transaction: Transaction, timeRange: string) => {
    if (timeRange === "all") return true;
    const transactionDate = new Date(
      transaction.date.split("/").reverse().join("-")
    );
    const [month, year] = timeRange.split("/").map(Number);
    return (
      transactionDate.getMonth() + 1 === month &&
      transactionDate.getFullYear() === year
    );
  };

  const matchesAmount = (transaction: Transaction, amount: string) => {
    if (!amount) return true;
    const filterAmount = Number.parseInt(amount);
    return transaction.amount >= filterAmount;
  };

  const matchesStatus = (transaction: Transaction, status: string) => {
    if (status === "all") return true;
    return transaction.status === status;
  };

  const filteredByCriteria = useMemo(() => {
    return mockTransactions.filter((transaction) => {
      const matchesSearch = transaction.title
        .toLowerCase()
        .includes(searchText.toLowerCase());
      const matchesTimeFilter = matchesTimeRange(
        transaction,
        appliedFilters.timeRange
      );
      const matchesAmountFilter = matchesAmount(
        transaction,
        appliedFilters.amount
      );
      const matchesStatusFilter = matchesStatus(
        transaction,
        appliedFilters.status
      );
      return (
        matchesSearch &&
        matchesTimeFilter &&
        matchesAmountFilter &&
        matchesStatusFilter
      );
    });
  }, [searchText, appliedFilters]);

  const getTransactionsByTab = useCallback(
    (tabValue: TransactionTabValue) => {
      if (tabValue === "all") return filteredByCriteria;
      return filteredByCriteria.filter(
        (transaction) => transaction.type === tabValue
      );
    },
    [filteredByCriteria]
  );

  const activeTransactions = getTransactionsByTab(transactionTab);
  const totalPages = Math.max(
    1,
    Math.ceil(activeTransactions.length / ITEMS_PER_PAGE)
  );
  const paginatedTransactions = activeTransactions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchText, appliedFilters, transactionTab]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleTabChange = (value: string) => {
    setTransactionTab(value as TransactionTabValue);
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleResetFilters = () => {
    setAppliedFilters(DEFAULT_FILTERS);
  };

  const displayStart =
    paginatedTransactions.length === 0
      ? 0
      : (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const displayEnd = Math.min(
    currentPage * ITEMS_PER_PAGE,
    activeTransactions.length
  );

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
      <div className="min-h-screen mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        <section className="-mx-4 sm:-mx-6">
          <Card className="w-full rounded-none border-x-0 border-b border-t bg-white shadow-sm sm:rounded-2xl sm:border">
            <CardHeader className="space-y-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="w-full flex-1">
                  <TransactionSearch
                    value={searchText}
                    onChange={setSearchText}
                  />
                </div>
                <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="flex items-center justify-between gap-2 px-4 py-2 sm:w-auto"
                    >
                      <div className="flex items-center gap-2">
                        <FilterIcon className="h-4 w-4" />
                        <span>Bộ lọc</span>
                      </div>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          isFilterOpen ? "rotate-180" : ""
                        }`}
                      />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    align="end"
                    className="w-[320px] sm:w-[420px] space-y-4"
                  >
                    <TransactionFilters
                      appliedFilters={appliedFilters}
                      onFiltersChange={setAppliedFilters}
                      timeOptions={timeOptions}
                      onReset={() => {
                        handleResetFilters();
                      }}
                      onApply={() => setIsFilterOpen(false)}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </CardHeader>
          </Card>
        </section>

        <section className="-mx-4 sm:-mx-6">
          <Tabs
            value={transactionTab}
            onValueChange={handleTabChange}
            className="space-y-4"
          >
            <Card className="w-full rounded-none border-x-0 border-b border-t bg-white shadow-sm sm:rounded-2xl sm:border">
              <CardHeader className="space-y-6">
                <TabsList className="grid w-full grid-cols-4 bg-secondary">
                  {TRANSACTION_TABS.map((tab) => (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className="text-sm text-foreground data-[state=active]:bg-emerald-600 data-[state=active]:text-primary-foreground"
                    >
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </CardHeader>
              <CardContent>
                <TabsContent value={transactionTab} className="mt-0 space-y-4">
                  {paginatedTransactions.length > 0 ? (
                    <>
                      <div className="space-y-3">
                        {paginatedTransactions.map((transaction) => (
                          <TransactionCard
                            key={transaction.id}
                            transaction={transaction}
                          />
                        ))}
                      </div>
                      <div className="flex flex-col gap-3 border-t pt-4 text-sm text-neutral-600 sm:flex-row sm:items-center sm:justify-between">
                        <p>
                          Hiển thị{" "}
                          <span className="font-medium text-neutral-900">
                            {displayStart}-{displayEnd}
                          </span>{" "}
                          trên {activeTransactions.length} giao dịch
                        </p>
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handlePrevPage}
                            disabled={currentPage === 1}
                          >
                            Trước
                          </Button>
                          <span className="text-neutral-500">
                            Trang {currentPage}/{totalPages}
                          </span>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleNextPage}
                            disabled={
                              currentPage === totalPages ||
                              activeTransactions.length === 0
                            }
                          >
                            Sau
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-neutral-200 bg-neutral-50">
                      <EmptyState />
                    </div>
                  )}
                </TabsContent>
              </CardContent>
            </Card>
          </Tabs>
        </section>
      </div>
    </main>
  );
}
