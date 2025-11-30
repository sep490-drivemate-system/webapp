import { NextRequest, NextResponse } from "next/server";

interface Term {
  id: string;
  title: string;
  description: string;
  type: string;
  createdAt: string;
}

// In-memory storage (trong production nên dùng database)
let terms: Term[] = [];

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

