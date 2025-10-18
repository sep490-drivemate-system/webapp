import * as yup from "yup";

// All validation Ui fields 
export const formSchema = yup.object({
    basicInfo: yup.object({
        signUpRequest: yup.object({
            userName: yup.string().required("Tên đăng nhập bắt buộc"),
            password: yup
                .string()
                .required("Mật khẩu không được để trống")
                .min(6, "Mật khẩu tối thiểu 6 ký tự")
                .max(32, "Mật khẩu tối đa 32 ký tự"),
        }),
        confirmPassword: yup
            .string()
            .oneOf([yup.ref("signUpRequest.password")], "Mật khẩu không khớp")
            .required("Xác nhận mật khẩu bắt buộc"),
    }),
});

export type FormSchema = yup.InferType<typeof formSchema>;

// Validate single field
export async function validateField<T extends keyof FormSchema>(
    field: T,
    value: FormSchema[T]
): Promise<{ isValid: boolean; error?: string }> {
    try {
        await formSchema.validateAt(field, { [field]: value });
        return { isValid: true };
    } catch (err) {
        if (err instanceof yup.ValidationError) {
            return { isValid: false, error: err.message };
        }
        return { isValid: false, error: "Validation error" };
    }
}

// Validate all fields in form
export async function validateForm(
    values: FormSchema
): Promise<{ isValid: boolean; errors: Record<string, string> }> {
    try {
        await formSchema.validate(values, { abortEarly: false });
        return { isValid: true, errors: {} };
    } catch (err) {
        if (err instanceof yup.ValidationError) {
            const errors: Record<string, string> = {};
            err.inner.forEach((e) => {
                if (e.path) errors[e.path] = e.message;
            });
            return { isValid: false, errors };
        }
        return { isValid: false, errors: {} };
    }
}