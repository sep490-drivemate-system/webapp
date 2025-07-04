import { z } from "zod";

export const signupSchema = z.object({
    userName: z
        .string({ required_error: "Tên người dùng không được để trống" })
        .min(3, "Tên người dùng tối thiểu 3 ký tự"),
    email: z
        .string({ required_error: "Email không được để trống" })
        .min(1, "Vui lòng nhập email")
        .email("Email không hợp lệ"),
    password: z
        .string({ required_error: "Mật khẩu không được để trống" })
        .min(6, "Mật khẩu tối thiểu 6 ký tự")
        .max(32, "Mật khẩu tối đa 32 ký tự"),
    confirmPassword: z
        .string({ required_error: "Xác nhận mật khẩu không được để trống" })
        .min(6, "Xác nhận mật khẩu tối thiểu 6 ký tự"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
});

export type SignupSchema = z.infer<typeof signupSchema>; 