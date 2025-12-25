"use client";

import { PaginationControls } from "@/components/commons/pagination-controls";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useRequireAuth } from "@/hooks/auth/useRequireAuth";
import { usePayment } from "@/hooks/payment/usePayment";
import { UserRole } from "@/types/auth/user-role.enum";
import { PaymentStatus } from "@/types/payment/payment.type";
import { Transactions } from "@/types/transaction/transaction.filter.type";
import { TransactionStatus } from "@/types/transaction/transaction.type";
import { BankType, WithdrawStatus } from "@/types/withdrawal/withdrawal.type";
import {
  Banknote,
  Eye,
  Filter,
  Loader2,
  MoreHorizontal,
  Search,
  User,
  Wallet,
} from "lucide-react";

export default function PaymentManagementPage() {
  useRequireAuth([UserRole.Admin]);

  const {
    transactions,
    isLoading,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    getStatusBadge,
    currentPage,
    pageSize,
    totalCount,
    totalPages,
    handlePageChange,
    showDetailDialog,
    setShowDetailDialog,
    showWithdrawalDialog,
    setShowWithdrawalDialog,
    selectedTransaction,
    openDetailDialog,
    closeDetailDialog,
    openWithdrawalDialog,
    closeWithdrawalDialog,
    withdrawalStatus,
    setWithdrawalStatus,
    bankType,
    setBankType,
    reason,
    setReason,
    handleWithdrawal,
  } = usePayment();


  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount);
  };

  const getTypeLabel = (type?: string) => {
    switch (type) {
      case "deposit":
        return "Nạp tiền";
      case "payment":
        return "Thanh toán";
      case "refund":
        return "Hoàn tiền";
      case "withdrawal":
        return "Rút tiền";
      default:
        return "Giao dịch";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Quản lý giao dịch hệ thống
        </h1>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tên, email, số điện thoại, mã giao dịch hoặc khóa học..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="size-4 text-muted-foreground" />
              <Select
                value={statusFilter as string}
                onValueChange={(value) =>
                  setStatusFilter(value as PaymentStatus | "all")
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Lọc theo trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value={String(PaymentStatus.Pending)}>
                    Chờ xử lý
                  </SelectItem>
                  <SelectItem value={String(PaymentStatus.Processing)}>
                    Đang xử lý
                  </SelectItem>
                  <SelectItem value={String(PaymentStatus.Completed)}>
                    Hoàn thành
                  </SelectItem>
                  <SelectItem value={String(PaymentStatus.Failed)}>
                    Thất bại
                  </SelectItem>
                  <SelectItem value={String(PaymentStatus.Cancelled)}>
                    Đã hủy
                  </SelectItem>
                  <SelectItem value={String(PaymentStatus.Refunded)}>
                    Đã hoàn tiền
                  </SelectItem>
                  <SelectItem value={String(PaymentStatus.Deposit)}>
                    Nạp tiền
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions List */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="py-12 text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary mb-4" />
              <p className="text-muted-foreground">
                Đang tải danh sách giao dịch...
              </p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="py-12 text-center">
              <Wallet className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {searchTerm
                  ? "Không tìm thấy giao dịch nào."
                  : "Không có giao dịch nào."}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">STT</TableHead>
                  <TableHead>Người dùng</TableHead>
                  <TableHead>Số tiền</TableHead>
                  <TableHead>Ngày giao dịch</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-center w-[100px]">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction: Transactions, index: number) => {
                  const statusBadge = getStatusBadge(transaction.status as unknown as PaymentStatus);

                  return (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <User className="size-5 text-muted-foreground" />
                          <div>
                            <div className="font-medium">
                              {transaction.fullName}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {transaction.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div
                          className={`font-semibold text-lg ${transaction.status === TransactionStatus.Deposit ||
                            transaction.status === TransactionStatus.Refunded
                            ? "text-green-600"
                            : "text-primary"
                            }`}
                        >
                          {transaction.status === TransactionStatus.Deposit ||
                            transaction.status === TransactionStatus.Refunded
                            ? "+"
                            : "-"}
                          {formatCurrency(transaction.transactionValue)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                          <span>
                            {new Date(
                              transaction.updatedAt
                            ).toLocaleDateString("vi-VN", {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusBadge.variant}>
                          {statusBadge.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              aria-label="Thao tác"
                            >
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => openDetailDialog(transaction)}
                            >
                              <Eye className="mr-2 size-4" />
                              Xem chi tiết
                            </DropdownMenuItem>
                            {transaction.status === TransactionStatus.Pending && (
                              <DropdownMenuItem
                                onClick={() => openWithdrawalDialog(transaction)}
                              >
                                <Banknote className="mr-2 size-4" />
                                Xử lý rút tiền
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
        {!isLoading && transactions.length > 0 && (
          <div className="flex items-center justify-between border-t px-6 py-4">
            {searchTerm ? (
              <div className="text-sm text-muted-foreground">
                Tìm thấy {transactions.length} giao dịch phù hợp
              </div>
            ) : (
              <>
                <div className="text-sm text-muted-foreground">
                  Hiển thị {((currentPage - 1) * pageSize) + 1} - {Math.min(currentPage * pageSize, totalCount)} trong tổng số {totalCount} giao dịch
                </div>
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </div>
        )}
      </Card>

      {/* Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chi tiết giao dịch</DialogTitle>
            <DialogDescription>
              Thông tin chi tiết về giao dịch
            </DialogDescription>
          </DialogHeader>
          {selectedTransaction && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Mã giao dịch</Label>
                  <div className="font-medium">{selectedTransaction.id}</div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Trạng thái</Label>
                  <Badge variant={getStatusBadge(selectedTransaction.status as unknown as PaymentStatus).variant}>
                    {getStatusBadge(selectedTransaction.status as unknown as PaymentStatus).label}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Người dùng</Label>
                  <div>
                    <div className="font-medium">{selectedTransaction.fullName}</div>
                    {selectedTransaction.email && (
                      <div className="text-sm text-muted-foreground">{selectedTransaction.email}</div>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Số tiền</Label>
                  <div className={`font-semibold text-lg ${selectedTransaction.status === TransactionStatus.Deposit || selectedTransaction.status === TransactionStatus.Refunded
                    ? "text-green-600"
                    : "text-primary"
                    }`}>
                    {selectedTransaction.status === TransactionStatus.Deposit || selectedTransaction.status === TransactionStatus.Refunded ? "+" : "-"}
                    {formatCurrency(selectedTransaction.transactionValue || 0)}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Loại giao dịch</Label>
                  <div>{getTypeLabel(selectedTransaction.status as unknown as string)}</div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Phương thức</Label>
                  <div>{selectedTransaction.fromWalletId || "N/A"}</div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Ngày giao dịch</Label>
                  <div>
                    {new Date(selectedTransaction.updatedAt).toLocaleDateString("vi-VN", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
                {selectedTransaction.referenceCode && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Mã tham chiếu</Label>
                    <div>{selectedTransaction.referenceCode}</div>
                  </div>
                )}
              </div>
              {selectedTransaction.transactionNote && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Mô tả</Label>
                  <div className="p-3 bg-muted rounded-md">{selectedTransaction.transactionNote}</div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={closeDetailDialog}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Withdrawal Dialog */}
      <Dialog open={showWithdrawalDialog} onOpenChange={setShowWithdrawalDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Xử lý rút tiền</DialogTitle>
            <DialogDescription>
              {selectedTransaction?.fullName} - {formatCurrency(selectedTransaction?.transactionValue || 0) || "-"}
            </DialogDescription>
          </DialogHeader>
          {selectedTransaction && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Chọn hành động *</Label>
                <div className="flex gap-2">
                  <Button
                    variant={withdrawalStatus === WithdrawStatus.Approved ? "default" : "outline"}
                    onClick={() => setWithdrawalStatus(WithdrawStatus.Approved)}
                    className="flex-1"
                  >
                    Cho rút tiền
                  </Button>
                  <Button
                    variant={withdrawalStatus === WithdrawStatus.Rejected ? "destructive" : "outline"}
                    onClick={() => setWithdrawalStatus(WithdrawStatus.Rejected)}
                    className="flex-1"
                  >
                    Không cho rút tiền
                  </Button>
                </div>
              </div>

              {withdrawalStatus === WithdrawStatus.Approved && (
                <div className="space-y-2">
                  <Label htmlFor="bankType">Phương thức thanh toán *</Label>
                  <Select
                    value={String(bankType)}
                    onValueChange={(value) => setBankType(Number(value) as BankType)}
                  >
                    <SelectTrigger id="bankType">
                      <SelectValue placeholder="Chọn phương thức thanh toán" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={String(BankType.VnPay)}>VNPay</SelectItem>
                      <SelectItem value={String(BankType.ZaloPay)}>ZaloPay</SelectItem>
                      <SelectItem value={String(BankType.PayOs)}>PayOS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {withdrawalStatus === WithdrawStatus.Rejected && (
                <div className="space-y-2">
                  <Label htmlFor="reason">Lý do từ chối *</Label>
                  <Textarea
                    id="reason"
                    placeholder="Nhập lý do từ chối rút tiền..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={4}
                  />
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={closeWithdrawalDialog} disabled={isLoading}>
              Hủy
            </Button>
            <Button
              onClick={handleWithdrawal}
            // disabled={isLoading || !withdrawalStatus || (!bankType) || (withdrawalStatus === WithdrawStatus.Rejected && !reason.trim())}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                "Xác nhận"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
