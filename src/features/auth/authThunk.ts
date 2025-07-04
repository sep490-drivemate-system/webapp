import { ISignInRequest, ISignInResponse } from "@/types/auth/signin.type";
import { createThunk } from "../genericCreateThunk";
import { HttpMethod } from "@/types/constants/httpMethod";
import { handleTokenStorage } from "@/lib/jwt/jwt.utils";

export const signIn = createThunk<ISignInResponse, ISignInRequest>(
  HttpMethod.POST,
  `signin`,
  `auth/signin`,
  {
    onSuccess: (res) => {
      const accessToken = res.data?.accessToken;
      const refreshToken = res.data?.refreshToken;
      handleTokenStorage(accessToken!, refreshToken!);
    },
  }
);
export const signIWithGoogle = createThunk<void, void>(
  HttpMethod.GET,
  "signin-google",
  `auth/signin-google`,
  {
    onSuccess: (res) => {
      const gatewayUrl = process.env.NEXT_PUBLIC_BASE_URL;
      window.location.href = `${gatewayUrl}/auth/signin-google`;
    },
    onError: (error) => {
      console.error("Error initiating Google login:", error);
    },
  }
);

export const signInWithFacebook = createThunk<void, void>(
  HttpMethod.GET,
  "signin-facebook",
  `auth/signin-facebook`,
  {
    onSuccess: (res) => {
      const gatewayUrl = process.env.NEXT_PUBLIC_BASE_URL;
      window.location.href = `${gatewayUrl}/auth/signin-facebook`;
    },
    onError: (error) => {
      console.error("Error initiating Facebook login:", error);
    },
  }
);

export const signInWithZalo = createThunk<void, void>(
  HttpMethod.GET,
  "signin-zalo",
  `auth/signin-zalo`,
  {
    onSuccess: (res) => {
      const gatewayUrl = process.env.NEXT_PUBLIC_BASE_URL;
      window.location.href = `${gatewayUrl}/auth/signin-zalo`;
    },
    onError: (error) => {
      console.error("Error initiating Zalo login:", error);
    },
  }
);

export const signUp = createThunk<boolean, ISignInRequest>(
  HttpMethod.POST,
  `signup`,
  `auth/signup`,
);
// export const signUpWithGoogle = createThunk<void, void>(
//   HttpMethod.GET,
//   "signup-google",
//   `auth/signin-google`,
//   {
//     onSuccess: (res) => {
//       const gatewayUrl = process.env.NEXT_PUBLIC_BASE_URL;
//       window.location.href = `${gatewayUrl}/auth/signin-google`;
//     },
//     onError: (error) => {
//       console.error("Error initiating Google login:", error);
//     },
//   }
// );
// export const signUpWithGoogle = createThunk<void, void>(
//   HttpMethod.GET,
//   "signup-google",
//   `auth/signin-google`,
//   {
//     onSuccess: (res) => {
//       const gatewayUrl = process.env.NEXT_PUBLIC_BASE_URL;
//       window.location.href = `${gatewayUrl}/auth/signin-google`;
//     },
//     onError: (error) => {
//       console.error("Error initiating Google login:", error);
//     },
//   }
// );
// export const signUp = createPostThunk<void, RegisterRequest>(
//   "auth/sign-up",
//   "auth/sign-up"
// );
// export const profile = createGetThunk<User, void>(`user`, `user`);
// export const upDateProfile = createPutThunk<UserToken, UserToken>(
//   `user/update`,
//   `user`
// );
// export const confirmEmail = createPostThunk<
//   ConfirmEmailResponse,
//   { access_token: string }
// >("auth/confirm-email", "auth/confirm-email", {});
