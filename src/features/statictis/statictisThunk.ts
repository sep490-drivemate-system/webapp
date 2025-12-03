import { HttpMethod } from "@/types/constants/httpMethod";
import { createThunk } from "../genericCreateThunk";
import { IBookingStatistic, ITransactionStatistic, IUserStatistic } from "@/types/statistic/statistic.type";

const USER_PATH = "users";
const TRANSACTION_PATH = "transaction";
const BOOKING_PATH = "booking";

export const getUserStatistic = createThunk<
  IUserStatistic,
  { type?: number; year?: number; month?: number; week?: number }
>(HttpMethod.GET, `getUserStatistic`, `${USER_PATH}/statistic`, {
  buildUrl: (payload) => {
    const { year, month, week, type } = payload;
    if (year && month && week && type === 0) {
      return `${USER_PATH}/statistic?Year=${year}&Month=${month}&Week=${week}&Type=${type}`;
    } else if (year && month && type === 1) {
      return `${USER_PATH}/statistic?Year=${year}&Month=${month}&Type=${type}`;
    } else if (year && type === 2) {
      return `${USER_PATH}/statistic?Year=${year}&Type=${type}`;
    } else {
      return `${USER_PATH}/statistic`;
    }
  },
});

export const getTransactionStatistic = createThunk<
  ITransactionStatistic,
  { type?: number; year?: number; month?: number; week?: number }
>(HttpMethod.GET, `getTransactionStatistic`, `${TRANSACTION_PATH}/statistic`, {
  buildUrl: (payload) => {
    const { year, month, week, type } = payload;
    if (year && month && week && type === 0) {
      return `${TRANSACTION_PATH}/statistic?Year=${year}&Month=${month}&Week=${week}&Type=${type}`;
    } else if (year && month && type === 1) {
      return `${TRANSACTION_PATH}/statistic?Year=${year}&Month=${month}&Type=${type}`;
    } else if (year && type === 2) {
      return `${TRANSACTION_PATH}/statistic?Year=${year}&Type=${type}`;
    } else {
      return `${TRANSACTION_PATH}/statistic`;
    }
  },
});

export const getBookingStatistic = createThunk<
  IBookingStatistic,
  { type?: number; year?: number; month?: number; week?: number }
>(HttpMethod.GET, `getBookingStatistic`, `${BOOKING_PATH}/statistic`, {
  buildUrl: (payload) => {
    const { year, month, week, type } = payload;
    if (year && month && week && type === 0) {
      return `${BOOKING_PATH}/statistic?Year=${year}&Month=${month}&Week=${week}&Type=${type}`;
    } else if (year && month && type === 1) {
      return `${BOOKING_PATH}/statistic?Year=${year}&Month=${month}&Type=${type}`;
    } else if (year && type === 2) {
      return `${BOOKING_PATH}/statistic?Year=${year}&Type=${type}`;
    } else {
      return `${BOOKING_PATH}/statistic`;
    }
  },
});
