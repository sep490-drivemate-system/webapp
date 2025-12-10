"use client";

import Footer from "@/components/commons/Footer";
import HeaderCommunity from "@/components/commons/HeaderCommunity";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";

export default function CommunityLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();

    const isQA = pathname?.includes("/qa");
    const isForum = pathname?.includes("/forum");
    const isPracticeTest = pathname?.includes("/practice-test");
    const showSearch = false;

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <HeaderCommunity
                showSearch={showSearch}
                searchPlaceholder={
                    isQA
                        ? "Tìm kiếm câu hỏi, chủ đề..."
                        : "Tìm kiếm bài viết, câu hỏi, hoặc chủ đề..."
                }
            />
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    );
}