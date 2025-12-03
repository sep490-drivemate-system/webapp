import {
  getBookingStatistic,
  getTransactionStatistic,
  getUserStatistic,
} from "@/features/statictis/statictisThunk";
import { useThunkAction } from "@/lib/redux/useThunkAction";

export const useStatistic = () => {
  const { runSafe: runGetUserStatistic, loading: getUserStatisticLoading } =
    useThunkAction(getUserStatistic);
  const {
    runSafe: runGetTransactionStatistic,
    loading: getTransactionStatisticLoading,
  } = useThunkAction(getTransactionStatistic);
  const {
    runSafe: runGetBookingStatistic,
    loading: getBookingStatisticLoading,
  } = useThunkAction(getBookingStatistic);

  const getUserStatisticData = async (params?: {
    type?: number;
    year?: number;
    month?: number;
    week?: number;
  }) => {
    const res = await runGetUserStatistic(params || {});

    if (res.ok && res.data?.value) {
      console.log("[useStatistic] Returning data:", res.data.value);
      return res.data.value;
    } else {
      console.warn("[useStatistic] API call failed or no data:", {
        ok: res.ok,
        hasData: !!res.data,
        hasValue: !!res.data?.value,
        error: res.ok ? null : res.error,
      });
      return null;
    }
  };

  const getTransactionStatisticData = async (params?: {
    type?: number;
    year?: number;
    month?: number;
    week?: number;
  }) => {
    const res = await runGetTransactionStatistic(params || {});
    if (res.ok && res.data?.value) {
      console.log("[useStatistic] Returning data:", res.data.value);
      return res.data.value;
    } else {
      console.warn("[useStatistic] API call failed or no data:", {
        ok: res.ok,
        hasData: !!res.data,
        hasValue: !!res.data?.value,
        error: res.ok ? null : res.error,
      });
      return null;
    }
  };

  const getBookingStatisticData = async (params?: {
    type?: number;
    year?: number;
    month?: number;
    week?: number;
  }) => {
    const res = await runGetBookingStatistic(params || {});
    if (res.ok && res.data?.value) {
      console.log("[useStatistic] Returning data:", res.data.value);
      return res.data.value;
    } else {
      console.warn("[useStatistic] API call failed or no data:", {
        ok: res.ok,
        hasData: !!res.data,
        hasValue: !!res.data?.value,
        error: res.ok ? null : res.error,
      });
      return null;
    }
  };

  return {
    getUserStatisticData,
    getUserStatisticLoading,
    getTransactionStatisticData,
    getTransactionStatisticLoading,
    getBookingStatisticData,
    getBookingStatisticLoading,
  };
};
