import { ISignInRequest, ISignInResponse } from "@/types/auth/signin.type";
import { createThunk } from "../genericCreateThunk";
import { HttpMethod } from "@/types/constants/httpMethod";
import { handleTokenStorage } from "@/lib/jwt/jwt.utils";
import type { ISignUpRequest, ISignUpResponse } from "@/types/auth/signup.type";

export const AUTH_PATH = "auth";

export const signIn = createThunk<ISignInResponse, ISignInRequest>(
  HttpMethod.POST,
  `signin`,
  `${AUTH_PATH}/signin`,
  {
    onSuccess: (res) => {
      const accessToken = res.data?.accessToken;
      const refreshToken = res.data?.refreshToken;
      if (accessToken && refreshToken) {
        handleTokenStorage(accessToken, refreshToken);
      }
    },
  }
);



export const signUp = createThunk<ISignUpResponse, ISignUpRequest>(
  HttpMethod.POST,
  `signup`,
  `${AUTH_PATH}/signup`
);

export const sendEmailCode = createThunk<string, { email: string }>(
  HttpMethod.POST,
  `verify-email`,
  `${AUTH_PATH}/verify-email`,
);

import type { InstructorSignupResponse, InstructorSignupRequest } from "@/types/auth/signup-instructor.types";

export const signUpInstructor = createThunk<InstructorSignupResponse, InstructorSignupRequest>(
  HttpMethod.POST,
  `signup-instructor`,
  `${AUTH_PATH}/instructor/signup`,
  {
    config: (payload) => {
      const form = new FormData();
      form.append("email", payload.email);
      form.append("b2LicenseFront", payload.b2LicenseFront);
      form.append("b2LicenseBack", payload.b2LicenseBack);
      form.append("cccdFront", payload.cccdFront);
      form.append("cccdBack", payload.cccdBack);
      form.append("professionalCertificate", payload.professionalCertificate);
      form.append("healthCertificate", payload.healthCertificate);
      form.append("vehiclePapers", payload.vehiclePapers);
      form.append("vehicleInsurance", payload.vehicleInsurance);

      return { data: form } as any;
    },
  }
);
