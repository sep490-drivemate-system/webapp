"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    MessageSquare,
    CheckCircle2,
    ArrowUp,
    ArrowDown,
    MessageCircle,
    Clock,
    Tag,
    GraduationCap,
    Loader2,
} from "lucide-react";
import { Question, Answer } from "@/types/post/qa.type";
import qaData from "@/data/mock-qa.json";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useCategories } from "@/hooks/taxonomy/useCategories";
import AskQuestionCard from "./components/AskQuestionCard";


export default function QAPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<"newest" | "popular" | "unanswered">("newest");

    const { categories: categoriesFromAPI, isLoading: isLoadingCategories } = useCategories();

    const questions = (qaData.questions as Question[]);
    const answers = (qaData.answers as Answer[]);

    const getAnswers = (questionId: string) => {
        return answers.filter((a) => a.questionId === questionId);
    };

    // Get categories - use API data, fallback to extracting from   
    const categories = useMemo(() => {
        if (categoriesFromAPI.length > 0) {
            return categoriesFromAPI.map((cat) => cat.name);
        }
        // Fallback to extracting from questions if API fails
        const cats = new Set(questions.map((q) => q.category));
        return Array.from(cats);
    }, [categoriesFromAPI, questions]);

    // Filter and sort questions
    const filteredQuestions = useMemo(() => {
        let filtered = questions;

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (q) =>
                    q.title.toLowerCase().includes(query) ||
                    q.content.toLowerCase().includes(query) ||
                    q.tags.some((tag) => tag.toLowerCase().includes(query))
            );
        }

        if (selectedCategory) {
            filtered = filtered.filter((q) => q.category === selectedCategory);
        }

        if (sortBy === "unanswered") {
            filtered = filtered.filter((q) => !q.isSolved);
        }

        // Sort
        filtered.sort((a, b) => {
            if (sortBy === "popular") {
                return b.upvotes - a.upvotes;
            }
            return (
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
        });

        return filtered;
    }, [questions, searchQuery, selectedCategory, sortBy]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return "Vừa xong";
        if (minutes < 60) return `${minutes} phút trước`;
        if (hours < 24) return `${hours} giờ trước`;
        if (days < 7) return `${days} ngày trước`;
        return date.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
        });
    };


    const handleVote = (questionId: string, type: "up" | "down") => {
        const question = questions.find((q) => q.id === questionId);
        if (question) {
            if (type === "up") {
                question.upvotes++;
            } else {
                question.downvotes++;
            }
            toast.success(type === "up" ? "Đã vote lên" : "Đã vote xuống");
            window.location.reload();
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">

            <div className="container mx-auto px-4 py-6 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Sidebar */}
                    <div className="lg:col-span-1 space-y-4">
                        <Card>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Danh mục</label>
                                    {isLoadingCategories ? (
                                        <div className="flex items-center justify-center py-4">
                                            <Loader2 className="h-5 w-5 animate-spin text-primary" />
                                        </div>
                                    ) : categories.length === 0 ? (
                                        <p className="text-sm text-muted-foreground py-4 text-center">
                                            Không có danh mục nào
                                        </p>
                                    ) : (
                                        <div className="space-y-2">
                                            <Button
                                                variant={selectedCategory === null ? "default" : "outline"}
                                                className="w-full justify-start"
                                                size="sm"
                                                onClick={() => setSelectedCategory(null)}
                                            >
                                                Tất cả
                                            </Button>
                                            {categories.map((cat) => (
                                                <Button
                                                    key={cat}
                                                    variant={selectedCategory === cat ? "default" : "outline"}
                                                    className="w-full justify-start"
                                                    size="sm"
                                                    onClick={() => setSelectedCategory(cat)}
                                                >
                                                    {cat}
                                                </Button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3 space-y-4">
                        <AskQuestionCard
                            searchQuery={searchQuery}
                            onSearchChange={setSearchQuery}
                            categories={categories}
                            currentUser={{
                                id: "user_novice_001",
                                name: "Trần Văn Nam",
                                email: "tranvannam@example.com",
                                avatar: "https://i.pravatar.cc/150?img=20",
                                role: "NOVICE_DRIVER" as any,
                            }}
                        />

                        {filteredQuestions.length === 0 ? (
                            <Card>
                                <CardContent className="py-12 text-center">
                                    <MessageSquare className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                                    <h3 className="text-lg font-medium mb-2">Không tìm thấy câu hỏi</h3>
                                    <p className="text-gray-600">
                                        {searchQuery
                                            ? "Thử thay đổi từ khóa tìm kiếm."
                                            : "Chưa có câu hỏi nào."}
                                    </p>
                                </CardContent>
                            </Card>
                        ) : (
                            filteredQuestions.map((question) => {
                                const questionAnswers = getAnswers(question.id);
                                const acceptedAnswer = questionAnswers.find(
                                    (a) => a.isAccepted
                                );
                                const instructorAnswers = questionAnswers.filter(
                                    (a) => a.isInstructorAnswer
                                );

                                return (
                                    <Card key={question.id} className="hover:shadow-lg transition-shadow">
                                        <CardContent className="pt-6">
                                            <div className="flex gap-4">
                                                {/* Vote Section */}
                                                <div className="flex flex-col items-center gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleVote(question.id, "up")}
                                                    >
                                                        <ArrowUp className="size-5" />
                                                    </Button>
                                                    <div className="text-lg font-bold">
                                                        {question.upvotes - question.downvotes}
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleVote(question.id, "down")}
                                                    >
                                                        <ArrowDown className="size-5" />
                                                    </Button>
                                                    {question.isSolved && (
                                                        <CheckCircle2 className="size-6 text-green-600 mt-2" />
                                                    )}
                                                </div>

                                                <div className="flex-1">
                                                    <div className="flex items-start justify-between mb-2">
                                                        <Link
                                                            href={`/qa/${question.id}`}
                                                            className="flex-1"
                                                        >
                                                            <h3 className="text-xl font-bold hover:text-primary transition-colors mb-2">
                                                                {question.title}
                                                            </h3>
                                                        </Link>
                                                    </div>

                                                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                                        {question.content}
                                                    </p>

                                                    <div className="flex items-center gap-4 flex-wrap mb-4">
                                                        <Badge variant="outline">{question.category}</Badge>
                                                        {question.tags.map((tag) => (
                                                            <Badge
                                                                key={tag}
                                                                variant="secondary"
                                                                className="text-xs"
                                                            >
                                                                <Tag className="size-3 mr-1" />
                                                                {tag}
                                                            </Badge>
                                                        ))}
                                                    </div>

                                                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                                                        <div className="flex items-center gap-4">
                                                            <div className="flex items-center gap-2">
                                                                <Avatar className="h-6 w-6">
                                                                    <AvatarImage src={question.author.avatar} />
                                                                    <AvatarFallback>
                                                                        {question.author.name.charAt(0)}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <span>{question.author.name}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <Clock className="size-4" />
                                                                <span>{formatDate(question.createdAt)}</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-4">
                                                            <div className="flex items-center gap-1">
                                                                <MessageCircle className="size-4" />
                                                                <span>{questionAnswers.length} trả lời</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {acceptedAnswer && (
                                                        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                                                            <div className="flex items-start gap-2 mb-2">
                                                                <CheckCircle2 className="size-4 text-green-600 mt-0.5" />
                                                                <span className="text-sm font-semibold text-green-800">
                                                                    Câu trả lời được chấp nhận
                                                                </span>
                                                            </div>
                                                            <div className="flex items-start gap-2">
                                                                {acceptedAnswer.isInstructorAnswer && (
                                                                    <GraduationCap className="size-4 text-primary mt-0.5 shrink-0" />
                                                                )}
                                                                <p className="text-sm text-gray-700 line-clamp-2">
                                                                    {acceptedAnswer.content}
                                                                </p>
                                                            </div>
                                                            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                                                                <Avatar className="h-5 w-5">
                                                                    <AvatarImage
                                                                        src={acceptedAnswer.author.avatar}
                                                                    />
                                                                    <AvatarFallback>
                                                                        {acceptedAnswer.author.name.charAt(0)}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <span>{acceptedAnswer.author.name}</span>
                                                                {acceptedAnswer.isInstructorAnswer && (
                                                                    <Badge variant="secondary" className="text-xs">
                                                                        Giáo viên
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}


