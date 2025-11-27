export enum BookingStatus {
  RoutePlanning = 1,
  Pending,
  Upcoming,
  Ongoing,
  Completed,
  Rescheduled,
  Cancelled,
}

export const bookingStatusToText = (status: BookingStatus): string => {
  switch (status) {
    case BookingStatus.RoutePlanning:
      return "Lên lộ trình";
    case BookingStatus.Pending:
      return "Đợi xác nhận";
    case BookingStatus.Upcoming:
      return "Sắp diễn ra";
    case BookingStatus.Ongoing:
      return "Đang diễn ra";
    case BookingStatus.Completed:
      return "Hoàn thành";
    case BookingStatus.Rescheduled:
      return "Đổi lịch";
    case BookingStatus.Cancelled:
      return "Đã hủy";
    default:
      return "Chưa xác định";
  }
};

