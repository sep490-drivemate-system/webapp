"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    MessageSquare,
    Search,
    FileText,
} from "lucide-react";
import { useAuth } from "@/hooks/auth/useAuth";

interface HeaderCommunityProps {
    searchQuery?: string;
    onSearchChange?: (value: string) => void;
    searchPlaceholder?: string;
    showSearch?: boolean;
}


function Logo() {
    return (
        <Link href="/" className="flex items-center shrink-0 group">
            <div className="relative left-10 h-16 w-16">
                <Image
                    src="/logo.png"
                    alt="DriveMate Logo"
                    width={200}
                    height={200}
                    priority
                    className="scale-200"
                />
            </div>
        </Link>
    );
}

export default function HeaderCommunity({
    searchQuery = "",
    onSearchChange,
    searchPlaceholder = "Tìm kiếm bài viết, câu hỏi, hoặc chủ đề...",
    showSearch = true,
}: HeaderCommunityProps) {
    const pathname = usePathname();
    const isForum = pathname?.includes("/forum");
    const isPracticeTest = pathname?.includes("/practice-test");

    const { isAuthenticated } = useAuth();

    return (
        <div className="sticky top-0 z-50 bg-white border-b shadow-md">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <Logo />

                    {showSearch ? (
                        <div className="flex-1 max-w-2xl mx-8">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder={searchPlaceholder}
                                    value={searchQuery}
                                    onChange={(e) => onSearchChange?.(e.target.value)}
                                    className="pl-12 pr-4 h-12 text-base border-2 focus:border-primary rounded-xl shadow-sm"
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 max-w-3xl mx-8">
                            <div className="flex items-center justify-center gap-3">
                                <div className="text-center">
                                    <h2 className="text-lg md:text-xl font-bold leading-tight">
                                        Chia sẻ kinh nghiệm & Hỏi đáp lái xe
                                    </h2>

                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex items-center gap-3">
                        {!isAuthenticated && (
                            <Link href="/signin">
                                <Button variant="outline">
                                    Đăng nhập
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-1">
                    <Link
                        href="/forum"
                        className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-colors ${isForum
                            ? "border-primary text-primary font-semibold"
                            : "border-transparent text-muted-foreground hover:text-primary hover:border-primary/50"
                            }`}
                    >
                        <MessageSquare className="size-5" />
                        <span>Diễn đàn</span>
                    </Link>
                    {/* <Link
                        href="/qa"
                        className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-colors ${isQA
                            ? "border-primary text-primary font-semibold"
                            : "border-transparent text-muted-foreground hover:text-primary hover:border-primary/50"
                            }`}
                    >
                        <HelpCircle className="size-5" />
                        <span>Hỏi & Đáp</span>
                    </Link> */}
                    <Link
                        href="/practice-test"
                        className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-colors ${isPracticeTest
                            ? "border-primary text-primary font-semibold"
                            : "border-transparent text-muted-foreground hover:text-primary hover:border-primary/50"
                            }`}
                    >
                        <FileText className="size-5" />
                        <span>Thi thử</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
