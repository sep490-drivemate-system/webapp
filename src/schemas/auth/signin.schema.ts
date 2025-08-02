import * as yup from "yup";

export const signinSchema = yup.object({
    email: yup
        .string()
        .required("Email không được để trống")
        .email("Email không hợp lệ"),

    password: yup
        .string()
        .required("Mật khẩu không được để trống")
        .min(6, "Mật khẩu tối thiểu 6 ký tự")
        .max(32, "Mật khẩu tối đa 32 ký tự"),
});

export type SigninSchema = yup.InferType<typeof signinSchema>;
