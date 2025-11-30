import { NextRequest, NextResponse } from "next/server";

interface Term {
  id: string;
  title: string;
  description: string;
  type: string;
  createdAt: string;
}

// In-memory storage (trong production nên dùng database)
let terms: Term[] = [
  {
    id: "1",
    title: "Chính sách hủy lịch",
    description:
      "Khách hàng có thể hủy lịch trước 24 giờ mà không mất phí. Hủy trong vòng 24 giờ sẽ tính 50% phí dịch vụ.",
    type: "1",
    createdAt: "2025-01-01T10:00:00.000Z",
  },
  {
    id: "2",
    title: "Yêu cầu về tài liệu tài chính",
    description:
      "Người lái mới phải nộp giấy phép lái xe hợp lệ và bằng cấp chứng chỉ lái xe. Tất cả tài liệu phải được xác thực bởi cơ quan chính phủ.",
    type: "1",
    createdAt: "2025-01-01T10:05:00.000Z",
  },
  {
    id: "3",
    title: "Quy tắc an toàn khi lái xe",
    description:
      "Người lái mới phải tuân thủ tất cả các quy luật giao thông. Đeo dây an toàn, không sử dụng điện thoại khi lái, giữ tốc độ hợp pháp.",
    type: "1",
    createdAt: "2025-01-01T10:10:00.000Z",
  },
  {
    id: "4",
    title: "Quyền và trách nhiệm của người hướng dẫn",
    description:
      "Người hướng dẫn có trách nhiệm giám sát an toàn của người lái. Có quyền yêu cầu dừng lại bất cứ lúc nào nếu thấy nguy hiểm. Phải có bằng cấp hướng dẫn lái xe được công nhân.",
    type: "2",
    createdAt: "2025-01-01T10:15:00.000Z",
  },
  {
    id: "5",
    title: "Mức lương và thanh toán cho người hướng dẫn",
    description:
      "Người hướng dẫn sẽ nhận 80% lệ phí hướng dẫn. Thanh toán được thực hiện hàng tuần vào thứ Sáu. Cần cung cấp thông tin ngân hàng để nhận tiền.",
    type: "2",
    createdAt: "2025-01-01T10:20:00.000Z",
  },
  {
    id: "6",
    title: "Bảo hiểm và bảo vệ người hướng dẫn",
    description:
      "Công ty bảo vệ toàn bộ bảo hiểm trách nhiệm dân sự. Nếu xảy ra tai nạn, người hướng dẫn sẽ được hỗ trợ y tế. Yêu cầu báo cáo sự cố trong vòng 24 giờ.",
    type: "2",
    createdAt: "2025-01-01T10:25:00.000Z",
  },
];

// GET - Lấy danh sách terms
export async function GET() {
  return NextResponse.json(terms);
}

// POST - Tạo term mới
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, type } = body;

    if (!title || !description || !type) {
      return NextResponse.json(
        { error: "Thiếu thông tin bắt buộc" },
        { status: 400 }
      );
    }

    const newTerm: Term = {
      id: Date.now().toString(),
      title,
      description,
      type,
      createdAt: new Date().toISOString(),
    };

    terms.push(newTerm);
    return NextResponse.json(newTerm, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Lỗi khi tạo điều khoản" },
      { status: 500 }
    );
  }
}

// PUT - Cập nhật term
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, description, type } = body;

    if (!id || !title || !description || !type) {
      return NextResponse.json(
        { error: "Thiếu thông tin bắt buộc" },
        { status: 400 }
      );
    }

    const index = terms.findIndex((t) => t.id === id);
    if (index === -1) {
      return NextResponse.json(
        { error: "Không tìm thấy điều khoản" },
        { status: 404 }
      );
    }

    terms[index] = {
      ...terms[index],
      title,
      description,
      type,
    };

    return NextResponse.json(terms[index]);
  } catch (error) {
    return NextResponse.json(
      { error: "Lỗi khi cập nhật điều khoản" },
      { status: 500 }
    );
  }
}

// DELETE - Xóa term
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Thiếu ID điều khoản" },
        { status: 400 }
      );
    }

    const index = terms.findIndex((t) => t.id === id);
    if (index === -1) {
      return NextResponse.json(
        { error: "Không tìm thấy điều khoản" },
        { status: 404 }
      );
    }

    terms = terms.filter((t) => t.id !== id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Lỗi khi xóa điều khoản" },
      { status: 500 }
    );
  }
}

