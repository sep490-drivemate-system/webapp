import { useAppSelector } from "@/lib/redux/useAppDispatch";
import { useAppDispatch } from "@/lib/redux/useAppDispatch";
import { signUp } from "@/features/auth/authThunk";
import { useThunkAction } from "@/lib/redux/useThunkAction";
import { useEffect, useState } from "react";
import { setInputCode, setSignupData } from "@/features/auth/authSlice";
import { ISignUpRequest } from "@/types/auth/signup.type";
import { sendEmailCode } from "@/features/auth/authThunk";

export const useSignUp = () => {
  const { runSafe: runSignUp, loading: signUpLoading } = useThunkAction(signUp);
  const { runSafe: runSendEmailCode, loading: emailLoading } =
    useThunkAction(sendEmailCode);
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (resendCooldown <= 0) return;

    const timer = setInterval(() => {
      setResendCooldown((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleSendEmailCode = async (basicInfo?: ISignUpRequest) => {
    if (basicInfo) {
      dispatch(setSignupData(basicInfo));
    }

    const payload = basicInfo ?? auth.signupData;
    const result = await runSendEmailCode({
      email: payload.email,
      phoneNumber: payload.phoneNumber,
    });
    if (result.ok) {
      setResendCooldown(60);
    }
    return result;
  };

  const handleVerificationResend = async () => {
    if (resendCooldown === 0) {
      await handleSendEmailCode();
    }
  };

  const handleRegisterNoviceDriver = async (basicInfo: ISignUpRequest) => {
    return runSignUp(basicInfo);
  };

  const handleVerificationSubmitWithCode = () => {
    if (auth.inputCode.length !== 6) {
      return false;
    }
    console.log(auth.inputCode, auth.verificationCode);
    return auth.inputCode === auth.verificationCode;
  };

  const handleInputCodeChange = (value: string) => {
    const cleanValue = value.replace(/\D/g, "").slice(0, 6);
    dispatch(setInputCode(cleanValue));
    return cleanValue;
  };

  const getMaskedContact = () => {
    return auth.signupData.email.replace(/(.{2}).*(@.*)/, "$1***$2");
  };

  return {
    ...auth,
    isLoading: auth.isLoading || signUpLoading || emailLoading,
    signUpLoading,
    dispatch,
    handleSendEmailCode,
    handleRegisterNoviceDriver,
    resendCooldown,
    setResendCooldown,
    handleVerificationSubmitWithCode,
    handleVerificationResend,
    handleInputCodeChange,
    getMaskedContact,
  };
};
