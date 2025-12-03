export interface IUserStatistic {
  totalUserCount: number;
  totalInspectorCount: number;
  totalInstructorCount: number;
  totalDriverCount: number;
}

export interface ITransactionStatistic {
  profit: number;
  instructors_payment: number;
  earning: number;
  holding: number;
  profit_graph: { [key: string]: number };
  earning_graph: { [key: string]: number };
}

export interface IBookingStatistic {
  total_package_count: number;
  total_car_count: number;
  total_booking_count: number;
  total_session_count: number;
  total_cancelation_count: number;
  booking_by_status_count: { [key: string]: number };
  session_by_status_count: { [key: string]: number };
  session_cancelation_count: { [key: string]: number };
  booking_by_status_percentage: { [key: string]: number };
  session_by_status_percentage: { [key: string]: number };
  session_cancelation_percentage: { [key: string]: number };
  booking_count_by_day: { [key: string]: number };
  session_average_time: { [key: string]: number };
}
