import { z } from "zod";

export const signinSchema = z.object({
    email: z
        .string({ required_error: "Email không được để trống" })
        .min(1, "Vui lòng nhập email")
        .email("Email không hợp lệ"),

    password: z
        .string({ required_error: "Mật khẩu không được để trống" })
        .min(6, "Mật khẩu tối thiểu 6 ký tự")
        .max(32, "Mật khẩu tối đa 32 ký tự"),
});

export type SigninSchema = z.infer<typeof signinSchema>;
