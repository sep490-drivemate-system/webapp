import * as yup from "yup";

export const signupSchema = yup.object({
    userName: yup
        .string()
        .required("Tên người dùng không được để trống")
        .min(3, "Tên người dùng tối thiểu 3 ký tự"),
    email: yup
        .string()
        .required("Email không được để trống")
        .email("Email không hợp lệ"),
    password: yup
        .string()
        .required("Mật khẩu không được để trống")
        .min(6, "Mật khẩu tối thiểu 6 ký tự")
        .max(32, "Mật khẩu tối đa 32 ký tự"),
    confirmPassword: yup
        .string()
        .required("Xác nhận mật khẩu không được để trống")
        .min(6, "Xác nhận mật khẩu tối thiểu 6 ký tự")
        .oneOf([yup.ref('password')], "Mật khẩu xác nhận không khớp"),
});

export type SignupSchema = yup.InferType<typeof signupSchema>; 