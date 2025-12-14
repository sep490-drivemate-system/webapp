"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Question } from "@/types/post/qa.type";
import { User } from "@/types/post/post.type";
import { UserRole } from "@/types/auth/user-role.enum";
import { useAuth } from "@/hooks/auth/useAuth";
import { ShadcnEditor } from "@/components/shadcn-editor/shadcn-editor";

interface AskQuestionCardProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    categories: string[];
    currentUser: User;
    onQuestionCreated?: () => void;
}

export default function AskQuestionCard({
    searchQuery,
    onSearchChange,
    categories,
    currentUser,
    onQuestionCreated,
}: AskQuestionCardProps) {
    const [showAskDialog, setShowAskDialog] = useState(false);
    const [questionTitle, setQuestionTitle] = useState("");
    const [questionContent, setQuestionContent] = useState("");
    const [questionCategory, setQuestionCategory] = useState("");

    const handleAskQuestion = () => {
        // Strip HTML tags to check if content is empty
        const titleText = questionTitle.replace(/<[^>]*>/g, "").trim();
        const contentText = questionContent.replace(/<[^>]*>/g, "").trim();
        
        if (!titleText || !contentText || !questionCategory) {
            toast.error("Vui lòng điền đầy đủ thông tin.");
            return;
        }

        import("@/data/mock-qa.json").then((qaData) => {
            const newQuestion: Question = {
                id: `qa_${Date.now()}`,
                title: questionTitle,
                content: questionContent,
                category: questionCategory,
                author: currentUser as any,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                views: 0,
                upvotes: 0,
                downvotes: 0,
                isSolved: false,
                tags: [],
            };

            (qaData.questions as any[]).unshift(newQuestion);
            toast.success("Câu hỏi đã được đăng!");
            setShowAskDialog(false);
            setQuestionTitle("");
            setQuestionContent("");
            setQuestionCategory("");

            if (onQuestionCreated) {
                onQuestionCreated();
            } else {
                window.location.reload();
            }
        });
    };

    const { isAuthenticated, role } = useAuth();
    const canAskQuestion = isAuthenticated && role === UserRole.NoviceDriver;

    return (
        <Card>
            <CardContent className="p-5">
                <div className="flex items-center gap-4">
                    <div className="flex-1 relative">
                        <Input
                            placeholder="Tìm kiếm câu hỏi, chủ đề..."
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                        />
                    </div>
                    {canAskQuestion && (
                        <Dialog open={showAskDialog} onOpenChange={setShowAskDialog}>
                            <DialogTrigger asChild>
                                <Button variant="default" className="shrink-0">
                                    <Plus className="size-4 mr-2" />
                                    Đặt câu hỏi
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                    <DialogTitle>Đặt câu hỏi mới</DialogTitle>
                                    <DialogDescription>
                                        Chia sẻ câu hỏi của bạn để nhận được sự giúp đỡ từ cộng đồng
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="question-title">Tiêu đề câu hỏi *</Label>
                                        <div className="rounded-lg border">
                                            <ShadcnEditor
                                                initialValue={questionTitle}
                                                onChange={setQuestionTitle}
                                                placeholder="Ví dụ: Làm thế nào để đỗ xe song song?"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="question-category">Danh mục *</Label>
                                        <Select
                                            value={questionCategory}
                                            onValueChange={setQuestionCategory}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Chọn danh mục" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map((cat) => (
                                                    <SelectItem key={cat} value={cat}>
                                                        {cat}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="question-content">Nội dung chi tiết *</Label>
                                        <div className="rounded-lg border">
                                            <ShadcnEditor
                                                initialValue={questionContent}
                                                onChange={setQuestionContent}
                                                placeholder="Mô tả chi tiết câu hỏi của bạn..."
                                            />
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button
                                        variant="outline"
                                        onClick={() => setShowAskDialog(false)}
                                    >
                                        Hủy
                                    </Button>
                                    <Button onClick={handleAskQuestion}>Đăng câu hỏi</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

