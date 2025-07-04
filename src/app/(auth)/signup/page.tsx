"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, type SignupSchema } from "@/schemas/auth/signup.schema";
import { Button } from "@/components/ui/button";
import { useSignUp } from "@/hooks/auth/useSignUp";
import { signIWithGoogle, signInWithFacebook, signInWithZalo } from "@/features/auth/authThunk";
import { useAppDispatch } from "@/lib/redux/useAppDispatch";

export default function SignUpPage() {
    const [showPassword, setShowPassword] = useState(false);
    const { handleSignUp, isLoading, isError, errorMessage } = useSignUp();
    const dispatch = useAppDispatch();

    const form = useForm<SignupSchema>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            userName: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-sky-100 px-2">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
                <div className="mb-8 text-center">
                    <div className="text-3xl font-extrabold text-sky-600 mb-2 tracking-tight">Drive Mate</div>
                    <div className="text-lg text-gray-500 font-medium">Tạo tài khoản mới</div>
                </div>
                <form onSubmit={form.handleSubmit(handleSignUp)} className="space-y-5">
                    <div>
                        <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-1">
                            Tên người dùng
                        </label>
                        <input
                            id="userName"
                            type="text"
                            autoComplete="username"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
                            placeholder="Nhập tên người dùng"
                            {...form.register("userName")}
                        />
                        {form.formState.errors.userName && (
                            <p className="text-xs text-red-500 mt-1">{form.formState.errors.userName.message}</p>
                        )}
                    </div>
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
                                autoComplete="new-password"
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
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                            Xác nhận mật khẩu
                        </label>
                        <div className="relative">
                            <input
                                id="confirmPassword"
                                type={showPassword ? "text" : "password"}
                                autoComplete="new-password"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 pr-10"
                                placeholder="Nhập lại mật khẩu"
                                {...form.register("confirmPassword")}
                            />
                        </div>
                        {form.formState.errors.confirmPassword && (
                            <p className="text-xs text-red-500 mt-1">{form.formState.errors.confirmPassword.message}</p>
                        )}
                    </div>
                    <div className="flex flex-col gap-3 mb-4">
                        <button
                            type="button"
                            className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2 hover:bg-gray-50 transition"
                            onClick={() => dispatch(signIWithGoogle())}
                        >
                            <img src="/icons/google.svg" alt="Google" className="w-5 h-5" />
                            Đăng ký với Google
                        </button>
                        <button
                            type="button"
                            className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2 hover:bg-gray-50 transition"
                            onClick={() => dispatch(signInWithFacebook())}
                        >
                            <img src="/icons/facebook.svg" alt="Facebook" className="w-5 h-5" />
                            Đăng ký với Facebook
                        </button>
                        <button
                            type="button"
                            className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2 hover:bg-gray-50 transition"
                            onClick={() => dispatch(signInWithZalo())}
                        >
                            <img src="/icons/zalo.svg" alt="Zalo" className="w-5 h-5" />
                            Đăng ký với Zalo
                        </button>
                    </div>
                    <Button
                        type="submit"
                        className="w-full mt-2"
                        variant="modernBlue"
                        disabled={isLoading}
                    >
                        {isLoading ? "Đang đăng ký..." : "Đăng ký"}
                    </Button>
                    {errorMessage && (
                        <p className="text-center text-red-500 text-sm mt-2">{errorMessage}</p>
                    )}
                </form>
                <div className="mt-6 text-center text-sm text-gray-500">
                    Đã có tài khoản? <a href="/signin" className="text-sky-600 font-semibold hover:underline">Đăng nhập</a>
                </div>
            </div>
        </div>
    );
} 