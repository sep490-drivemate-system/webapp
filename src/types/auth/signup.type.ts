export interface ISignUpRequest {
    phoneNumber: string;
    email: string;
    password: string;
}


export interface ISignUpResponse {
    accessToken: string;
    refreshToken: string;
}

export enum SignupMethod {
    EMAIL = "email",
    PHONE = "phone",
}

export type SignupStep = 1 | 2 | 3 | 4

export interface Step1ContactMethodProps {
    onSelect: (method: SignupMethod) => void
}

export interface Step2ContactInputProps {
    method: SignupMethod
    value: string
    onChange: (value: string) => void
    onNext: () => void
    onBack: () => void
}

export interface Step3VerificationProps {
    onNext: () => void
    onBack: () => void
    onResend: () => void
}

export interface Step4BasicInfoProps {
    onNext: (data: ISignUpRequest) => void
    onBack: () => void
}