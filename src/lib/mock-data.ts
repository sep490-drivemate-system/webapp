import blogsData from "@/data/mock-blogs.json";

type RawBlogPost = (typeof blogsData.blogs)[number];

export type BlogTag = {
  id: string;
  name: string;
};

export type MockBlogPost = Omit<RawBlogPost, "tags"> & {
  tags: BlogTag[];
  thumbnail: string;
  createdAt: string;
  galleryImages: string[];
};

export const mockBlogPosts: MockBlogPost[] = blogsData.blogs.map((post) => ({
  ...post,
  thumbnail: post.image,
  createdAt: post.publishedAt,
  galleryImages: post.galleryImages ?? [],
  tags: post.tags.map((tag, index) => ({
    id: `${post.id}-tag-${index}`,
    name: tag,
  })),
}));

export type TransactionStatus = "completed" | "pending" | "failed";
export type TransactionType = "deposit" | "payment" | "refund";

export type Transaction = {
  id: string;
  title: string;
  description: string;
  date: string; // format: DD/MM/YYYY
  amount: number;
  status: TransactionStatus;
  type: TransactionType;
  reference: string;
  paymentMethod: string;
};

export const mockTransactions: Transaction[] = [
  {
    id: "TXN-241012-01",
    title: "Thanh toán gói luyện thi B2",
    description: "Thanh toán đợt 2 cho khóa luyện thi bằng lái B2",
    date: "12/10/2024",
    amount: 1800000,
    status: "completed",
    type: "payment",
    reference: "INV-B2-2024-10A",
    paymentMethod: "VNPay",
  },
  {
    id: "TXN-241009-02",
    title: "Hoàn tiền buổi học bị hủy",
    description: "Hoàn tiền do hủy buổi học ngày 09/10",
    date: "09/10/2024",
    amount: 450000,
    status: "completed",
    type: "refund",
    reference: "RFN-2024-10-09",
    paymentMethod: "Chuyển khoản",
  },
  {
    id: "TXN-240928-01",
    title: "Nạp ví đào tạo",
    description: "Nạp thêm tiền vào ví để đặt lịch xe số tự động",
    date: "28/09/2024",
    amount: 2000000,
    status: "completed",
    type: "deposit",
    reference: "WLT-2024-09-28",
    paymentMethod: "MoMo",
  },
  {
    id: "TXN-240925-03",
    title: "Thanh toán đặt lịch xe số sàn",
    description: "Thanh toán 2 buổi tập với HLV Nguyễn Văn A",
    date: "25/09/2024",
    amount: 900000,
    status: "completed",
    type: "payment",
    reference: "INV-TRAIN-2024-09C",
    paymentMethod: "VNPay",
  },
  {
    id: "TXN-240915-02",
    title: "Thanh toán phí thi thử",
    description: "Phí thi thử mô phỏng tháng 09",
    date: "15/09/2024",
    amount: 350000,
    status: "pending",
    type: "payment",
    reference: "INV-SIM-2024-09",
    paymentMethod: "Ví đào tạo",
  },
  {
    id: "TXN-240901-01",
    title: "Hoàn tiền học phần lý thuyết",
    description: "Hoàn tiền do trung tâm thay đổi lịch học",
    date: "01/09/2024",
    amount: 250000,
    status: "completed",
    type: "refund",
    reference: "RFN-2024-09-01",
    paymentMethod: "Chuyển khoản",
  },
  {
    id: "TXN-240825-04",
    title: "Nạp ví đào tạo",
    description: "Khuyến mãi +5% khi nạp từ 2.5 triệu",
    date: "25/08/2024",
    amount: 2500000,
    status: "completed",
    type: "deposit",
    reference: "WLT-2024-08-25",
    paymentMethod: "MoMo",
  },
  {
    id: "TXN-240820-02",
    title: "Thanh toán đặt lịch sa hình",
    description: "Thanh toán 1 buổi tập sa hình nâng cao",
    date: "20/08/2024",
    amount: 600000,
    status: "failed",
    type: "payment",
    reference: "INV-SA-2024-08",
    paymentMethod: "ATM nội địa",
  },
];

