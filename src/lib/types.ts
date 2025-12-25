export interface DocumentField {
  id: string;
  name: string;
  type: string;
  required?: boolean;
}

export interface DocumentType {
  id: string;
  name: string;
  categoryType: "personal" | "vehicle";
  fields: DocumentField[];
}

export interface DocumentRecord {
  id: string;
  typeId: string;
  typeName: string;
  userId: string;
  data: Record<string, unknown>;
  files: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  status: "pending" | "verified" | "rejected";
}

export const DEFAULT_DOCUMENT_TYPES: DocumentType[] = [
  {
    id: "1",
    name: "Căn Cước Công Dân",
    categoryType: "personal",
    fields: [
      { id: "1", name: "Số CCCD", type: "text", required: true },
      { id: "2", name: "Họ và Tên", type: "text", required: true },
      { id: "3", name: "Ngày Sinh", type: "date", required: true },
    ],
  },
  {
    id: "2",
    name: "Bằng Lái Xe",
    categoryType: "personal",
    fields: [
      { id: "1", name: "Hạng Bằng", type: "text", required: true },
      { id: "2", name: "Ảnh Mặt Trước", type: "file", required: true },
      { id: "3", name: "Ảnh Mặt Sau", type: "file", required: true },
    ],
  },
  {
    id: "6",
    name: "Chứng Chỉ Hành Nghề",
    categoryType: "personal",
    fields: [
      { id: "1", name: "Ảnh Chứng Chỉ Hành Nghề", type: "file", required: true },
      { id: "2", name: "Hạng Lái Xe Được Đào Tạo Giảng Dạy", type: "text", required: true },
    ],
  },
  {
    id: "7",
    name: "Giấy Khám Sức Khỏe",
    categoryType: "personal",
    fields: [
      { id: "1", name: "Ảnh Giấy Khám Sức Khỏe", type: "file", required: true },
    ],
  },
  {
    id: "8",
    name: "Thông Tin Liên Hệ Khẩn Cấp",
    categoryType: "personal",
    fields: [
      { id: "1", name: "Tên Người Liên Hệ Khẩn Cấp", type: "text", required: true },
      { id: "2", name: "Số Điện Thoại Người Liên Hệ Khẩn Cấp", type: "text", required: true },
    ],
  },
  {
    id: "3",
    name: "Giấy Đăng Ký Xe",
    categoryType: "vehicle",
    fields: [
      { id: "1", name: "Biển Số Xe", type: "text", required: true },
      { id: "2", name: "Hãng Xe", type: "text", required: true },
      { id: "3", name: "Màu Xe", type: "text", required: true },
      { id: "4", name: "Số Chỗ Ngồi", type: "number", required: true },
      { id: "5", name: "Mẫu Xe", type: "text", required: true },
      { id: "6", name: "Nhiên Liệu", type: "text", required: true },
      { id: "7", name: "Giá Thuê", type: "number", required: true },
    ],
  },
  {
    id: "4",
    name: "Giấy Đăng Kiểm",
    categoryType: "vehicle",
    fields: [
      { id: "1", name: "Ảnh Mặt Trước", type: "file", required: true },
      { id: "2", name: "Ảnh Mặt Sau", type: "file", required: true },
    ],
  },
  {
    id: "5",
    name: "Bảo Hiểm Xe",
    categoryType: "vehicle",
    fields: [
      { id: "1", name: "Ảnh Mặt Trước", type: "file", required: true },
      { id: "2", name: "Ảnh Mặt Sau", type: "file", required: true },
    ],
  },
  {
    id: "9",
    name: "Giá Thuê Xe",
    categoryType: "vehicle",
    fields: [
      { id: "1", name: "Giá Thuê Xe Theo Giờ", type: "number", required: true },
    ],
  },
  {
    id: "10",
    name: "Ảnh Xác Thực",
    categoryType: "vehicle",
    fields: [
      { id: "1", name: "Ảnh Phía Trước", type: "file", required: true },
      { id: "2", name: "Ảnh Phía Sau", type: "file", required: true },
      { id: "3", name: "Ảnh Bên Hông Trái", type: "file", required: true },
      { id: "4", name: "Ảnh Bên Hông Phải", type: "file", required: true },
      { id: "5", name: "Nội Thất", type: "file", required: true },
    ],
  },
];

