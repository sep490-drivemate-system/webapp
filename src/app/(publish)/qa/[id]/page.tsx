"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    ArrowLeft,
    ArrowUp,
    ArrowDown,
    CheckCircle2,
    MessageCircle,
    Eye,
    Clock,
    Tag,
    GraduationCap,
    Send,
} from "lucide-react";
import { Question, Answer } from "@/types/forum/qa.type";
import qaData from "@/data/mock-qa.json";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { UserRole } from "@/types/auth/user-role.enum";

const currentUser = {
    id: "user_novice_001",
    name: "Trần Văn Nam",
    email: "tranvannam@example.com",
    avatar: "https://i.pravatar.cc/150?img=20",
    role: UserRole.NoviceDriver,
};

export default function QADetailPage() {
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const questionId = params.id;
    const [answerContent, setAnswerContent] = useState("");

    const question = (qaData.questions as Question[]).find((q) => q.id === questionId);
    const answers = (qaData.answers as Answer[]).filter((a) => a.questionId === questionId);

    if (!question) {
        return (
            <div className="min-h-screen bg-gray-50 pt-24 pb-12">
                <div className="container mx-auto px-4">
                    <Card>
                        <CardContent className="py-12 text-center">
                            <p className="text-muted-foreground">Câu hỏi không tồn tại.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    const sortedAnswers = useMemo(() => {
        const accepted = answers.find((a) => a.isAccepted);
        const others = answers.filter((a) => !a.isAccepted);
        return accepted ? [accepted, ...others] : others;
    }, [answers]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const handleVote = (type: "up" | "down", target: "question" | string) => {
        if (target === "question") {
            if (type === "up") {
                question.upvotes++;
            } else {
                question.downvotes++;
            }
        } else {
            const answer = answers.find((a) => a.id === target);
            if (answer) {
                if (type === "up") {
                    answer.upvotes++;
                } else {
                    answer.downvotes++;
                }
            }
        }
        toast.success(type === "up" ? "Đã vote lên" : "Đã vote xuống");
        window.location.reload();
    };

    const handleSubmitAnswer = () => {
        if (!answerContent.trim()) {
            toast.error("Vui lòng nhập câu trả lời.");
            return;
        }

        const newAnswer: Answer = {
            id: `answer_${Date.now()}`,
            questionId: questionId,
            content: answerContent,
            author: currentUser as any,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            upvotes: 0,
            downvotes: 0,
            isAccepted: false,
            isInstructorAnswer: false,
        };

        (qaData.answers as any[]).push(newAnswer);
        setAnswerContent("");
        toast.success("Câu trả lời đã được đăng!");
        window.location.reload();
    };

    const handleAcceptAnswer = (answerId: string) => {
        if (question.author.id !== currentUser.id) {
            toast.error("Chỉ người đặt câu hỏi mới có thể chấp nhận câu trả lời.");
            return;
        }

        answers.forEach((a) => {
            a.isAccepted = false;
        });

        const answer = answers.find((a) => a.id === answerId);
        if (answer) {
            answer.isAccepted = true;
            question.isSolved = true;
            question.acceptedAnswerId = answerId;
        }

        toast.success("Đã chấp nhận câu trả lời!");
        window.location.reload();
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-5 pb-5">
            <div className="container mx-auto px-2 max-w-6xl">
                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                    className="mb-4 gap-2"
                >
                    <ArrowLeft className="size-4" />
                    Quay lại
                </Button>

                <Card className="mb-6">
                    <CardContent className="pt-6">
                        <div className="flex gap-4">
                            <div className="flex flex-col items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleVote("up", "question")}
                                >
                                    <ArrowUp className="size-5" />
                                </Button>
                                <div className="text-2xl font-bold">
                                    {question.upvotes - question.downvotes}
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleVote("down", "question")}
                                >
                                    <ArrowDown className="size-5" />
                                </Button>
                                {question.isSolved && (
                                    <CheckCircle2 className="size-8 text-green-600 mt-2" />
                                )}
                            </div>

                            <div className="flex-1">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h1 className="text-3xl font-bold mb-3">{question.title}</h1>
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                                            <div className="flex items-center gap-2">
                                                <Clock className="size-4" />
                                                <span>{formatDate(question.createdAt)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="prose max-w-none mb-4">
                                    <p className="text-base leading-relaxed whitespace-pre-wrap">
                                        {question.content}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2 flex-wrap mb-4">
                                    <Badge variant="outline">{question.category}</Badge>
                                    {question.tags.map((tag) => (
                                        <Badge key={tag} variant="secondary" className="text-xs">
                                            <Tag className="size-3 mr-1" />
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>

                                <div className="flex items-center gap-3 pt-4 border-t">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={question.author.avatar} />
                                        <AvatarFallback>
                                            {question.author.name.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="font-semibold">{question.author.name}</div>
                                        <div className="text-xs text-muted-foreground">
                                            Người đặt câu hỏi
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold">
                            {answers.length} {answers.length === 1 ? "Câu trả lời" : "Câu trả lời"}
                        </h2>
                    </div>

                    <div className="space-y-4">
                        {sortedAnswers.length === 0 ? (
                            <Card>
                                <CardContent className="py-12 text-center">
                                    <MessageCircle className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                                    <p className="text-muted-foreground">
                                        Chưa có câu trả lời nào. Hãy là người đầu tiên trả lời!
                                    </p>
                                </CardContent>
                            </Card>
                        ) : (
                            sortedAnswers.map((answer) => (
                                <Card
                                    key={answer.id}
                                    className={answer.isAccepted ? "border-green-500 border-2" : ""}
                                >
                                    <CardContent className="pt-6">
                                        <div className="flex gap-4">
                                            <div className="flex flex-col items-center gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleVote("up", answer.id)}
                                                >
                                                    <ArrowUp className="size-5" />
                                                </Button>
                                                <div className="text-lg font-bold">
                                                    {answer.upvotes - answer.downvotes}
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleVote("down", answer.id)}
                                                >
                                                    <ArrowDown className="size-5" />
                                                </Button>
                                                {answer.isAccepted && (
                                                    <CheckCircle2 className="size-6 text-green-600 mt-2" />
                                                )}
                                            </div>

                                            <div className="flex-1">

                                                <div className="prose max-w-none mb-4">
                                                    <p className="text-base leading-relaxed whitespace-pre-wrap">
                                                        {answer.content}
                                                    </p>
                                                </div>

                                                <div className="flex items-center justify-between pt-4 border-t">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-8 w-8">
                                                            <AvatarImage src={answer.author.avatar} />
                                                            <AvatarFallback>
                                                                {answer.author.name.charAt(0)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-semibold text-sm">
                                                                    {answer.author.name}
                                                                </span>
                                                                {answer.isInstructorAnswer && (
                                                                    <Badge variant="secondary" className="text-xs">
                                                                        <GraduationCap className="size-3 mr-1" />
                                                                        Giáo viên
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                            <div className="text-xs text-muted-foreground">
                                                                {formatDate(answer.createdAt)}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {question.author.id === currentUser.id &&
                                                        !question.isSolved && (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleAcceptAnswer(answer.id)}
                                                            >
                                                                <CheckCircle2 className="size-4 mr-2" />
                                                                Chấp nhận
                                                            </Button>
                                                        )}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Trả lời câu hỏi</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <Textarea
                                placeholder="Nhập câu trả lời của bạn..."
                                value={answerContent}
                                onChange={(e) => setAnswerContent(e.target.value)}
                                rows={6}
                            />
                            <div className="flex justify-end">
                                <Button onClick={handleSubmitAnswer} className="gap-2">
                                    <Send className="size-4" />
                                    Đăng câu trả lời
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}


