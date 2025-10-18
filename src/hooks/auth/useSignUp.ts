import { useAppSelector } from "@/lib/redux/useAppDispatch";
import { useAppDispatch } from "@/lib/redux/useAppDispatch";
import { signUp } from "@/features/auth/authThunk";
import { useRouter } from "next/navigation";
import { useThunkAction } from "@/lib/redux/useThunkAction";
import { useState } from "react";
import {
  setCurrentStep,
  setSignupMethod,
  setSignupContact,
  setInputCode,
  setSignupVerificationCode
} from "@/features/auth/authSlice";
import { SignupStep, ISignUpRequest } from "@/types/auth/signup.type";
import { useValidation } from "@/hooks/commonHooks";
import { sendEmailCode } from "@/features/auth/authThunk";

export const useSignUp = () => {
  const { runSafe: runSignUp, loading } = useThunkAction(signUp);
  const { runSafe: runSendEmailCode, loading: emailLoading } = useThunkAction(sendEmailCode);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);

  const { validateInput, clearError } = useValidation()

  // const handleSignUp = async (data: SignupSchema) => {
  //   const res = await runSignUp(data);
  //   if (res.ok) {
  //     router.push("/");
  //   }
  // };

  const handleMethodSelect = (method: 'email' | 'phone') => {
    dispatch(setSignupMethod(method));
    dispatch(setCurrentStep(2));
  }

  const handleContactSubmit = async (contact: string) => {
    dispatch(setSignupContact(contact));
    const result = await runSendEmailCode({ email: contact });
    if (result.ok) {
      dispatch(setCurrentStep(3));
    }
  }
  const handleSubmit = (e: React.FormEvent, onNext: () => void) => {
    e.preventDefault()
    const success = handleVerificationSubmitWithCode()
    if (success) {
      onNext();
    }
  }
  const handleVerificationSubmit = () => {
    dispatch(setCurrentStep(4));
  }

  const handleResendCode = async () => {
    await runSendEmailCode({ email: auth.signupData.contact });
  }

  const handleBasicInfoSubmit = async (basicInfo: ISignUpRequest) => {
    const result = await runSignUp(basicInfo);
    if (result.ok) {
      router.push("/");
    }
  }

  const handleBack = () => {
    if (auth.currentStep > 1) {
      dispatch(setCurrentStep((auth.currentStep - 1) as SignupStep));
    }
  }


  // Step 3 Verification logic
  const [resendCooldown, setResendCooldown] = useState(0)

  const handleVerificationSubmitWithCode = () => {
    dispatch(setSignupVerificationCode(auth.inputCode))
    if (auth.inputCode.length !== 6) {
      return false
    }

    if (auth.inputCode === auth.verificationCode) {
      handleVerificationSubmit()
      return true
    } else {
      return false
    }
  }

  const handleVerificationResend = async () => {
    if (resendCooldown === 0) {
      await handleResendCode()
      setResendCooldown(60)
    }
  }

  const handleInputCodeChange = (value: string) => {
    const cleanValue = value.replace(/\D/g, '').slice(0, 6)
    dispatch(setInputCode(cleanValue))
    return cleanValue
  }

  const getMaskedContact = () => {
    return auth.signupData.method === 'email'
      ? auth.signupData.contact.replace(/(.{2}).*(@.*)/, '$1***$2')
      : auth.signupData.contact.replace(/(\d{3})\d{4}(\d{3})/, '$1****$2')
  }
  return {
    ...auth,
    isLoading: auth.isLoading || loading || emailLoading,
    loading,
    dispatch,
    handleSubmit,
    handleMethodSelect,
    handleContactSubmit,
    handleVerificationSubmit,
    handleResendCode,
    handleBasicInfoSubmit,
    handleBack,
    // Step 3 Verification
    resendCooldown,
    setResendCooldown,
    handleVerificationSubmitWithCode,
    handleVerificationResend,
    handleInputCodeChange,
    getMaskedContact
  };
};
