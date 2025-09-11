export interface ISignUpRequest {
    userName: string;
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

// properties for component Step1ContactMethod
export interface Step1ContactMethodProps {
    onSelect: (method: SignupMethod) => void
}

// properties for component Step2ContactInput
export interface Step2ContactInputProps {
    method: SignupMethod
    value: string
    onChange: (value: string) => void
    onNext: () => void
    onBack: () => void
}

// properties for component Step3Verification
export interface Step3VerificationProps {
    onNext: () => void
    onBack: () => void
    onResend: () => void
}


// properties for component Step4BasicInfo
export interface Step4BasicInfoProps {
    onNext: (data: ISignUpRequest) => void
    onBack: () => void
}