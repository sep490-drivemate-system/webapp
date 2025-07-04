// src/app/(publish)/layout.tsx
import { ReactNode } from "react";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-semibold mb-4 text-blue-600">
        📝 Khu vực xuất bản
      </h1>
      <div className="bg-white rounded-xl shadow p-6">{children}</div>
    </div>
  );
}
