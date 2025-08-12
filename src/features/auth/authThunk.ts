import { ISignInRequest, ISignInResponse } from "@/types/auth/signin.type";
import { createThunk } from "../genericCreateThunk";
import { HttpMethod } from "@/types/constants/httpMethod";
import { handleTokenStorage } from "@/lib/jwt/jwt.utils";

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

import type { ISignUpRequest } from "@/types/auth/signup.type";

export const signUp = createThunk<boolean, ISignUpRequest>(
  HttpMethod.POST,
  `signup`,
  `${AUTH_PATH}/signup`
);
