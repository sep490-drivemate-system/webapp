"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signinSchema, type SigninSchema } from "@/schemas/auth/signin.schema";
import { Button } from "@/components/ui/button";
import { useSignIn } from "@/hooks/auth/useSignIn";

export default function SignInPage() {
    const [showPassword, setShowPassword] = useState(false);
    const { handleSignIn, isLoading, isError, errorMessage } = useSignIn();

    const form = useForm<SigninSchema>({
        resolver: zodResolver(signinSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-sky-100 px-2">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
                <div className="mb-8 text-center">
                    <div className="text-3xl font-extrabold text-sky-600 mb-2 tracking-tight">Drive Mate</div>
                    <div className="text-lg text-gray-500 font-medium">Chào mừng trở lại!</div>
                </div>
                <form onSubmit={form.handleSubmit(handleSignIn)} className="space-y-5">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            autoComplete="email"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
                            placeholder="Nhập email của bạn"
                            {...form.register("email")}
                        />
                        {form.formState.errors.email && (
                            <p className="text-xs text-red-500 mt-1">{form.formState.errors.email.message}</p>
                        )}
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Mật khẩu
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                autoComplete="current-password"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 pr-10"
                                placeholder="Nhập mật khẩu"
                                {...form.register("password")}
                            />
                            <button
                                type="button"
                                tabIndex={-1}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                onClick={() => setShowPassword((v) => !v)}
                                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.403-3.22 1.125-4.575M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                )}
                            </button>
                        </div>
                        {form.formState.errors.password && (
                            <p className="text-xs text-red-500 mt-1">{form.formState.errors.password.message}</p>
                        )}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2">
                            <input type="checkbox" className="rounded border-gray-300" />
                            Lưu mật khẩu
                        </label>
                        <a href="#" className="text-sky-500 hover:underline">Quên mật khẩu?</a>
                    </div>
                    <Button
                        type="submit"
                        className="w-full mt-2"
                        variant="modernBlue"
                        disabled={isLoading}
                    >
                        {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
                    </Button>
                    {isError && (
                        <p className="text-center text-red-500 text-sm mt-2">{errorMessage}</p>
                    )}
                </form>
                <div className="mt-6 text-center text-sm text-gray-500">
                    Bạn chưa có tài khoản? <a href="/signup" className="text-sky-600 font-semibold hover:underline">Đăng ký</a>
                </div>
            </div>
        </div>
    );
}
