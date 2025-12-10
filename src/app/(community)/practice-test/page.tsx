"use client";

import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Car,
    Truck,
    Bus,
    CheckCircle2,
    XCircle,
    Clock,
    Award,
    ArrowLeft,
    ArrowRight,
    RotateCcw,
} from "lucide-react";
import { toast } from "sonner";
import practiceTestsData from "@/data/mock-practice-tests.json";

type LicenseType = "B" | "C" | "D";
type Question = {
    id: string;
    licenseType: LicenseType;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
};

const licenseTypes: { type: LicenseType; name: string; icon: typeof Car; description: string; color: string }[] = [
    {
        type: "B",
        name: "Bằng B",
        icon: Car,
        description: "Xe ô tô dưới 9 chỗ, xe tải dưới 3.5 tấn",
        color: "from-blue-500 to-blue-600",
    },
    {
        type: "C",
        name: "Bằng C",
        icon: Truck,
        description: "Xe tải từ 3.5 tấn trở lên",
        color: "from-green-500 to-green-600",
    },
    {
        type: "D",
        name: "Bằng D",
        icon: Bus,
        description: "Xe chở khách từ 16 chỗ trở lên",
        color: "from-purple-500 to-purple-600",
    },
];

export default function PracticeTestPage() {
    const [selectedLicense, setSelectedLicense] = useState<LicenseType | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
    const [score, setScore] = useState(0);
    const [timeRemaining, setTimeRemaining] = useState(1200); // 20 minutes in seconds
    const [isTestStarted, setIsTestStarted] = useState(false);

    const questions = useMemo(() => {
        if (!selectedLicense) return [];
        return (practiceTestsData.questions as Question[]).filter(
            (q) => q.licenseType === selectedLicense
        );
    }, [selectedLicense]);

    const currentQuestion = questions[currentQuestionIndex];
    const totalQuestions = questions.length;
    const progress = totalQuestions > 0 ? ((currentQuestionIndex + 1) / totalQuestions) * 100 : 0;

    // Timer effect
    useEffect(() => {
        if (!isTestStarted || timeRemaining <= 0) return;
        const timer = setInterval(() => {
            setTimeRemaining((prev) => {
                if (prev <= 1) {
                    setIsTestStarted(false);
                    const finalScore = Object.keys(userAnswers).reduce((acc, questionId) => {
                        const question = questions.find((q) => q.id === questionId);
                        if (question && userAnswers[questionId] === question.correctAnswer) {
                            return acc + 1;
                        }
                        return acc;
                    }, 0);
                    setScore(finalScore);
                    toast.success(`Hết thời gian! Điểm số: ${finalScore}/${totalQuestions}`);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [isTestStarted]);

    const handleStartTest = (licenseType: LicenseType) => {
        setSelectedLicense(licenseType);
        setCurrentQuestionIndex(0);
        setSelectedAnswer(null);
        setShowResult(false);
        setUserAnswers({});
        setScore(0);
        setTimeRemaining(1200);
        setIsTestStarted(true);
        toast.success(`Bắt đầu thi thử bằng ${licenseType}`);
    };

    const handleSelectAnswer = (answerIndex: number) => {
        if (showResult) return;
        setSelectedAnswer(answerIndex);
        setUserAnswers((prev) => ({
            ...prev,
            [currentQuestion.id]: answerIndex,
        }));
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < totalQuestions - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
            setSelectedAnswer(userAnswers[questions[currentQuestionIndex + 1]?.id] || null);
            setShowResult(false);
        } else {
            handleFinishTest();
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex((prev) => prev - 1);
            setSelectedAnswer(userAnswers[questions[currentQuestionIndex - 1]?.id] || null);
            setShowResult(false);
        }
    };

    const handleCheckAnswer = () => {
        if (selectedAnswer === null) {
            toast.error("Vui lòng chọn một đáp án!");
            return;
        }
        setShowResult(true);
        if (selectedAnswer === currentQuestion.correctAnswer) {
            setScore((prev) => prev + 1);
        }
    };

    const handleFinishTest = () => {
        setIsTestStarted(false);
        const finalScore = Object.keys(userAnswers).reduce((acc, questionId) => {
            const question = questions.find((q) => q.id === questionId);
            if (question && userAnswers[questionId] === question.correctAnswer) {
                return acc + 1;
            }
            return acc;
        }, 0);
        setScore(finalScore);
        toast.success(`Hoàn thành! Điểm số: ${finalScore}/${totalQuestions}`);
    };

    const handleReset = () => {
        setSelectedLicense(null);
        setCurrentQuestionIndex(0);
        setSelectedAnswer(null);
        setShowResult(false);
        setUserAnswers({});
        setScore(0);
        setTimeRemaining(1200);
        setIsTestStarted(false);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    if (!selectedLicense) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                            Thi thử lý thuyết lái xe
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            Chọn loại bằng lái để bắt đầu thi thử
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {licenseTypes.map((license) => {
                            const Icon = license.icon;
                            return (
                                <Card
                                    key={license.type}
                                    className="hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-primary/50"
                                    onClick={() => handleStartTest(license.type)}
                                >
                                    <CardContent className="p-6">
                                        <div className="flex flex-col items-center text-center space-y-4">
                                            <div
                                                className={`p-4 rounded-full bg-gradient-to-br ${license.color} text-white shadow-lg`}
                                            >
                                                <Icon className="size-8" />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-bold mb-2">{license.name}</h3>
                                                <p className="text-sm text-muted-foreground">
                                                    {license.description}
                                                </p>
                                            </div>
                                            <Button
                                                className={`w-full bg-gradient-to-r ${license.color} hover:opacity-90 text-white`}
                                            >
                                                Bắt đầu thi thử
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    <div className="mt-8 text-center">
                        <Card className="inline-block">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Clock className="size-5" />
                                    <span>Thời gian làm bài: 20 phút</span>
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground mt-2">
                                    <Award className="size-5" />
                                    <span>Điểm đạt: 26/30 câu trở lên</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        );
    }

    if (isTestStarted && currentQuestion) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-4 max-w-4xl">
                    {/* Header */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-4">
                                <Button variant="ghost" onClick={handleReset}>
                                    <ArrowLeft className="size-4 mr-2" />
                                    Quay lại
                                </Button>
                                <Badge variant="secondary" className="text-lg px-4 py-2">
                                    Bằng {selectedLicense}
                                </Badge>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Clock className="size-5" />
                                    <span className="font-mono text-lg font-semibold">
                                        {formatTime(timeRemaining)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                            <div
                                className="bg-gradient-to-r from-primary to-purple-600 h-3 rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                        <div className="text-sm text-muted-foreground text-right">
                            Câu {currentQuestionIndex + 1} / {totalQuestions}
                        </div>
                    </div>

                    {/* Question Card */}
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle className="text-xl">
                                {currentQuestion.question}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {currentQuestion.options.map((option, index) => {
                                const isSelected = selectedAnswer === index;
                                const isCorrect = index === currentQuestion.correctAnswer;
                                const isWrong = isSelected && !isCorrect && showResult;

                                let buttonClass = "w-full text-left p-4 rounded-lg border-2 transition-all ";
                                if (showResult) {
                                    if (isCorrect) {
                                        buttonClass += "bg-green-50 border-green-500 text-green-700";
                                    } else if (isWrong) {
                                        buttonClass += "bg-red-50 border-red-500 text-red-700";
                                    } else {
                                        buttonClass += "bg-gray-50 border-gray-200";
                                    }
                                } else {
                                    buttonClass += isSelected
                                        ? "bg-primary/10 border-primary text-primary font-semibold"
                                        : "bg-white border-gray-200 hover:border-primary/50 hover:bg-primary/5";
                                }

                                return (
                                    <button
                                        key={index}
                                        onClick={() => handleSelectAnswer(index)}
                                        disabled={showResult}
                                        className={buttonClass}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="flex-1 text-left">
                                                {String.fromCharCode(65 + index)}. {option}
                                            </span>
                                            {showResult && isCorrect && (
                                                <CheckCircle2 className="size-5 text-green-600 ml-2" />
                                            )}
                                            {showResult && isWrong && (
                                                <XCircle className="size-5 text-red-600 ml-2" />
                                            )}
                                        </div>
                                    </button>
                                );
                            })}

                            {showResult && (
                                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                    <p className="text-sm font-semibold text-blue-900 mb-1">
                                        Giải thích:
                                    </p>
                                    <p className="text-sm text-blue-800">
                                        {currentQuestion.explanation}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-between">
                        <Button
                            variant="outline"
                            onClick={handlePreviousQuestion}
                            disabled={currentQuestionIndex === 0}
                        >
                            <ArrowLeft className="size-4 mr-2" />
                            Câu trước
                        </Button>

                        {!showResult ? (
                            <Button onClick={handleCheckAnswer} disabled={selectedAnswer === null}>
                                Kiểm tra đáp án
                            </Button>
                        ) : (
                            <Button onClick={handleNextQuestion}>
                                {currentQuestionIndex < totalQuestions - 1 ? (
                                    <>
                                        Câu tiếp
                                        <ArrowRight className="size-4 ml-2" />
                                    </>
                                ) : (
                                    <>
                                        Hoàn thành
                                        <Award className="size-4 ml-2" />
                                    </>
                                )}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // Results Screen
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-4xl">
                <Card>
                    <CardContent className="p-8">
                        <div className="text-center space-y-6">
                            <div className="flex justify-center">
                                <div
                                    className={`p-6 rounded-full ${
                                        score >= 26
                                            ? "bg-green-100 text-green-600"
                                            : "bg-red-100 text-red-600"
                                    }`}
                                >
                                    {score >= 26 ? (
                                        <CheckCircle2 className="size-16" />
                                    ) : (
                                        <XCircle className="size-16" />
                                    )}
                                </div>
                            </div>

                            <div>
                                <h2 className="text-3xl font-bold mb-2">
                                    {score >= 26 ? "Chúc mừng! Bạn đã đạt!" : "Rất tiếc! Bạn chưa đạt"}
                                </h2>
                                <p className="text-muted-foreground text-lg">
                                    Điểm số: {score} / {totalQuestions}
                                </p>
                                <p className="text-muted-foreground">
                                    Tỷ lệ đúng: {((score / totalQuestions) * 100).toFixed(1)}%
                                </p>
                            </div>

                            <div className="flex gap-4 justify-center">
                                <Button onClick={handleReset} variant="outline">
                                    <RotateCcw className="size-4 mr-2" />
                                    Thi lại
                                </Button>
                                <Button onClick={() => setSelectedLicense(null)}>
                                    Chọn bằng khác
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

