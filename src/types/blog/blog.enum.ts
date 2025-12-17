export enum BlogStatus {
    Pending = 1,
    Active = 2,
    Inactive = 3,
    ReApply = 4,
    Banned = 5,
}

// Vietnamese labels for displaying blog status
export const BLOG_STATUS_LABELS: Record<BlogStatus, string> = {
    [BlogStatus.Pending]: "Chờ duyệt",
    [BlogStatus.Active]: "Đang hoạt động",
    [BlogStatus.Inactive]: "Từ chối",
    [BlogStatus.ReApply]: "Yêu cầu cập nhật",
    [BlogStatus.Banned]: "Chặn",
};