import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { getTransactions } from "@/features/transaction/transactionThunk";
import { Withdrawals } from "@/features/wallet/walletThunk";
import { useThunkAction } from "@/lib/redux/useThunkAction";
import {
    PaymentStatus,
    PaymentStats,
} from "@/types/payment/payment.type";
import { TransactionFilter, Transactions } from "@/types/transaction/transaction.filter.type";
import { TransactionStatus } from "@/types/transaction/transaction.type";
import { IWithdrawal, WithdrawStatus, BankType } from "@/types/withdrawal/withdrawal.type";

// Map TransactionStatus to PaymentStatus
const mapTransactionStatusToPaymentStatus = (status: TransactionStatus): PaymentStatus => {
    switch (status) {
        case TransactionStatus.Pending:
            return PaymentStatus.Pending;
        case TransactionStatus.Processing:
            return PaymentStatus.Processing;
        case TransactionStatus.Completed:
            return PaymentStatus.Completed;
        case TransactionStatus.Fail:
            return PaymentStatus.Failed;
        case TransactionStatus.Cancelled:
            return PaymentStatus.Cancelled;
        case TransactionStatus.Refunded:
            return PaymentStatus.Refunded;
        case TransactionStatus.Deposit:
            return PaymentStatus.Deposit;
        default:
            return PaymentStatus.Pending;
    }
};


const getStatusText = (status: TransactionStatus): string => {
    switch (status) {
        case TransactionStatus.Pending:
            return "Chờ xử lý";
        case TransactionStatus.Processing:
            return "Đang xử lý";
        case TransactionStatus.Completed:
            return "Hoàn thành";
        case TransactionStatus.Fail:
            return "Thất bại";
        case TransactionStatus.Cancelled:
            return "Đã hủy";
        case TransactionStatus.Refunded:
            return "Đã hoàn tiền";
        case TransactionStatus.Deposit:
            return "Nạp tiền";
        default:
            return "Không xác định";
    }
};


export const usePayment = () => {
    const [transactions, setTransactions] = useState<Transactions[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<PaymentStatus | "all">("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(20);
    const [totalCount, setTotalCount] = useState(0);

    // Dialog states
    const [showDetailDialog, setShowDetailDialog] = useState(false);
    const [showWithdrawalDialog, setShowWithdrawalDialog] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<Transactions | null>(null);

    const [withdrawalStatus, setWithdrawalStatus] = useState<WithdrawStatus | null>(null);
    const [bankType, setBankType] = useState<BankType>(BankType.VnPay);
    const [reason, setReason] = useState("");

    const { runSafe: runGetTransactions } = useThunkAction(getTransactions);
    const { runSafe: runWithdrawals, loading: isProcessingWithdrawal } = useThunkAction(Withdrawals);

    const loadTransactions = async (page: number = 1, status?: TransactionStatus) => {
        setIsLoading(true);
        try {
            const filter: TransactionFilter = {
                PageNumber: page,
                PageSize: pageSize,
                status: status,
            };

            const result = await runGetTransactions(filter, {
                onSuccess: (data) => {
                    console.log("API Response:", data);
                    // Data is wrapped in GenericResponse, so we need to access data.value
                    const paginatedData = data?.value;

                    if (paginatedData) {
                        // Always set totalCount and currentPage if data exists
                        setTotalCount(paginatedData.totalCount || 0);
                        setCurrentPage(paginatedData.currentPage || 1);

                        if (paginatedData.pageContent && paginatedData.pageContent.length > 0) {
                            setTransactions(paginatedData.pageContent);
                        } else {
                            // Page might be empty but totalCount > 0 (e.g., page 2+ with no data)
                            setTransactions([]);
                        }
                    } else {
                        setTransactions([]);
                        setTotalCount(0);
                    }
                },
                onError: (error: any) => {
                    console.error("Error loading transactions:", error);
                    toast.error(error?.message || "Không thể tải danh sách giao dịch.");
                    setTransactions([]);
                },
            });
        } catch (error: any) {
            console.error("Error loading transactions:", error);
            toast.error("Không thể tải danh sách giao dịch.");
            setTransactions([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const statusToFilter = statusFilter === "all"
            ? undefined
            : mapPaymentStatusToTransactionStatus(statusFilter);
        setCurrentPage(1);
        loadTransactions(1, statusToFilter);
    }, [statusFilter]);

    const mapPaymentStatusToTransactionStatus = (status: PaymentStatus): TransactionStatus => {
        switch (status) {
            case PaymentStatus.Pending:
                return TransactionStatus.Pending;
            case PaymentStatus.Processing:
                return TransactionStatus.Processing;
            case PaymentStatus.Completed:
                return TransactionStatus.Completed;
            case PaymentStatus.Failed:
                return TransactionStatus.Fail;
            case PaymentStatus.Cancelled:
                return TransactionStatus.Cancelled;
            case PaymentStatus.Refunded:
                return TransactionStatus.Refunded;
            case PaymentStatus.Deposit:
                return TransactionStatus.Deposit;
            default:
                return TransactionStatus.Pending;
        }
    };

    const getStatusBadge = (status: PaymentStatus) => {
        switch (status) {
            case PaymentStatus.Pending:
                return { label: "Chờ xử lý", variant: "default" as const };
            case PaymentStatus.Processing:
                return { label: "Đang xử lý", variant: "secondary" as const };
            case PaymentStatus.Completed:
                return { label: "Hoàn thành", variant: "default" as const };
            case PaymentStatus.Failed:
                return { label: "Thất bại", variant: "destructive" as const };
            case PaymentStatus.Cancelled:
                return { label: "Đã hủy", variant: "outline" as const };
            case PaymentStatus.Refunded:
                return { label: "Đã hoàn tiền", variant: "secondary" as const };
            case PaymentStatus.Deposit:
                return { label: "Nạp tiền", variant: "default" as const };
            default:
                return { label: "Không xác định", variant: "outline" as const };
        }
    };

    const filteredTransactions = useMemo(() => {
        if (!searchTerm) {
            return transactions;
        }
        return transactions.filter((transaction) => {
            const matchesSearch =
                transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                transaction.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                transaction.email?.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesSearch;
        });
    }, [transactions, searchTerm]);

    const stats: PaymentStats = useMemo(() => {
        const pending = transactions.filter((t) => t.status === TransactionStatus.Pending);
        const processing = transactions.filter((t) => t.status === TransactionStatus.Processing);
        const completed = transactions.filter((t) => t.status === TransactionStatus.Completed);
        const failed = transactions.filter((t) => t.status === TransactionStatus.Fail);
        const cancelled = transactions.filter((t) => t.status === TransactionStatus.Cancelled);
        const refunded = transactions.filter((t) => t.status === TransactionStatus.Refunded);
        const deposit = transactions.filter((t) => t.status === TransactionStatus.Deposit);

        return {
            totalPending: pending.length,
            totalProcessing: processing.length,
            totalCompleted: completed.length,
            totalFailed: failed.length,
            totalCancelled: cancelled.length,
            totalRefunded: refunded.length,
            totalDeposit: deposit.length,
            totalAmountPending: pending.reduce((sum, t) => sum + t.transactionValue, 0),
            totalAmountProcessing: processing.reduce((sum, t) => sum + t.transactionValue, 0),
            totalAmountCompleted: completed.reduce((sum, t) => sum + t.transactionValue, 0),
            totalAmountFailed: failed.reduce((sum, t) => sum + t.transactionValue, 0),
            totalAmountCancelled: cancelled.reduce((sum, t) => sum + t.transactionValue, 0),
            totalAmountRefunded: refunded.reduce((sum, t) => sum + t.transactionValue, 0),
            totalAmountDeposit: deposit.reduce((sum, t) => sum + t.transactionValue, 0),
        };
    }, [transactions]);

    const handlePageChange = (page: number) => {
        const statusToFilter = statusFilter === "all"
            ? undefined
            : mapPaymentStatusToTransactionStatus(statusFilter);
        loadTransactions(page, statusToFilter);
    };

    const totalPages = Math.ceil(totalCount / pageSize);

    const openDetailDialog = (transaction: Transactions) => {
        setSelectedTransaction(transaction);
        setShowDetailDialog(true);
    };

    const closeDetailDialog = () => {
        setShowDetailDialog(false);
        setSelectedTransaction(null);
    };

    const openWithdrawalDialog = (transaction: Transactions) => {
        setSelectedTransaction(transaction);
        setWithdrawalStatus(null);
        setBankType(BankType.VnPay);
        setReason("");
        setShowWithdrawalDialog(true);
    };

    const closeWithdrawalDialog = () => {
        setShowWithdrawalDialog(false);
        setSelectedTransaction(null);
        setWithdrawalStatus(null);
        setBankType(BankType.VnPay);
        setReason("");
    };

    const handleWithdrawal = async () => {
        console.log("withdrawalStatus", withdrawalStatus);
        console.log("bankType", bankType);
        console.log("reason", reason);
        console.log("selectedTransaction", selectedTransaction);
        // Check for null/undefined explicitly, not !withdrawalStatus because 0 (Approved) is falsy
        if (!selectedTransaction || withdrawalStatus === null || withdrawalStatus === undefined) {
            toast.error("Vui lòng chọn hành động.");
            return;
        }

        if (withdrawalStatus === WithdrawStatus.Rejected && !reason.trim()) {
            toast.error("Vui lòng nhập lý do từ chối.");
            return;
        }



        setIsLoading(true);
        try {
            const withdrawalData: IWithdrawal = {
                status: withdrawalStatus,
                transactionId: selectedTransaction.id,
                reason: reason.trim() || (withdrawalStatus === WithdrawStatus.Rejected ? "Không cho phép rút tiền" : ""),
                email: selectedTransaction.email || "",
                fullName: selectedTransaction.fullName,
                paymentMethod: bankType,
            };

            await runWithdrawals(withdrawalData, {
                onSuccess: (data) => {
                    // data is GenericResponse<string | null>
                    // Truy cập vào string từ response (có thể là URL)
                    const responseString: string | null | undefined = data?.value;
                    
                    console.log("Withdrawal response string:", responseString);
                    console.log("Full response data:", data);
                    
                    // Nếu responseString là URL, mở trong tab mới
                    if (responseString && (responseString.startsWith('http://') || responseString.startsWith('https://'))) {
                        window.open(responseString, '_blank');
                        toast.success("Đang mở trang thanh toán...");
                    } else {
                        // Sử dụng string từ response hoặc message mặc định
                        const successMessage = responseString 
                            ? responseString 
                            : (withdrawalStatus === WithdrawStatus.Approved
                                ? "Đã cho phép rút tiền thành công."
                                : "Đã từ chối rút tiền.");
                        toast.success(successMessage);
                    }
                    
                    closeWithdrawalDialog();
                    // Reload transactions
                    const statusToFilter = statusFilter === "all"
                        ? undefined
                        : mapPaymentStatusToTransactionStatus(statusFilter);
                    loadTransactions(currentPage, statusToFilter);
                },
                onError: (error: any) => {
                    toast.error(error?.message || "Không thể xử lý yêu cầu rút tiền.");
                },
            });
        } catch (error: any) {
            console.error("Error processing withdrawal:", error);
            toast.error("Không thể xử lý yêu cầu rút tiền.");
        } finally {
            setIsLoading(false);
        }
    };

    return {
        transactions: filteredTransactions,
        allTransactions: transactions,
        isLoading: isLoading || isProcessingWithdrawal,
        searchTerm,
        setSearchTerm,
        statusFilter,
        setStatusFilter,
        getStatusBadge,
        stats,
        loadTransactions,
        currentPage,
        pageSize,
        totalCount,
        totalPages,
        handlePageChange,
        // Dialog states
        showDetailDialog,
        setShowDetailDialog,
        showWithdrawalDialog,
        setShowWithdrawalDialog,
        selectedTransaction,
        openDetailDialog,
        closeDetailDialog,
        openWithdrawalDialog,
        closeWithdrawalDialog,
        // Withdrawal states
        withdrawalStatus,
        setWithdrawalStatus,
        bankType,
        setBankType,
        reason,
        setReason,
        handleWithdrawal,
    };
};
