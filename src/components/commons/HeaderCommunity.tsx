"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    MessageSquare,
    HelpCircle,
    Bell,
    Settings,
    LogOut,
    Users,
    Search,
    FileText,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, UserRole } from "@/types/post/post.type";

interface HeaderCommunityProps {
    searchQuery?: string;
    onSearchChange?: (value: string) => void;
    searchPlaceholder?: string;
    currentUser?: User;
    showSearch?: boolean; // true = show search bar, false = show title/description
}

// Mock current user - should be replaced with actual auth
const defaultUser: User = {
    id: "user_novice_001",
    name: "Trần Văn Nam",
    email: "tranvannam@example.com",
    avatar: "https://i.pravatar.cc/150?img=20",
    role: UserRole.NOVICE_DRIVER,
};

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
    currentUser = defaultUser,
    showSearch = true,
}: HeaderCommunityProps) {
    const pathname = usePathname();
    const isForum = pathname?.includes("/forum");
    const isQA = pathname?.includes("/qa");
    const isPracticeTest = pathname?.includes("/practice-test");

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
                                    <p className="text-xs md:text-sm text-muted-foreground mt-0.5 hidden sm:block">
                                        Cộng đồng trao đổi và học hỏi kiến thức lái xe
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" className="relative">
                            <Bell className="size-5" />
                            <span className="absolute top-1 right-1 size-2 bg-red-500 rounded-full"></span>
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center gap-2 hover:bg-gray-100 rounded-lg p-2 transition-colors">
                                    <Avatar className="h-9 w-9 ring-2 ring-primary/20">
                                        <AvatarImage src={currentUser.avatar} />
                                        <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold">
                                            {currentUser.name.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuItem>
                                    <Users className="mr-2 size-4" />
                                    Hồ sơ của tôi
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Settings className="mr-2 size-4" />
                                    Cài đặt
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <LogOut className="mr-2 size-4" />
                                    Đăng xuất
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Navigation Tabs */}
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
                    <Link
                        href="/qa"
                        className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-colors ${isQA
                            ? "border-primary text-primary font-semibold"
                            : "border-transparent text-muted-foreground hover:text-primary hover:border-primary/50"
                            }`}
                    >
                        <HelpCircle className="size-5" />
                        <span>Hỏi & Đáp</span>
                    </Link>
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
