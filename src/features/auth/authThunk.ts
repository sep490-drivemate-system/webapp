import { ISignInRequest, ISignInResponse } from "@/types/auth/signin.type";
import { createThunk } from "../genericCreateThunk";
import { HttpMethod } from "@/types/constants/httpMethod";
import { handleTokenStorage } from "@/lib/jwt/jwt.utils";
import type { ISignUpRequest, ISignUpResponse } from "@/types/auth/signup.type";
import { INSTRUCTOR_PATH } from "../instructor/instructorThunk";
export const AUTH_PATH = "auth";
export const NOVICE_DRIVER_PATH = "novice-driver";

export const signIn = createThunk<ISignInResponse, ISignInRequest>(
  HttpMethod.POST,
  `signin`,
  `/${AUTH_PATH}/signin`,
  {
    onSuccess: (res) => {
      const accessToken = res.value?.token;
      if (accessToken) {
        handleTokenStorage(accessToken);
      }
    },
    onError: (error) => {
      console.log("[auth thunk] error in signIn", error);
    },
  }
);

export const signUp = createThunk<ISignUpResponse, ISignUpRequest>(
  HttpMethod.POST,
  `signup`,
  `${NOVICE_DRIVER_PATH}/registration`
);

export const sendEmailCode = createThunk<
  string,
  { email: string; phoneNumber: string }
>(HttpMethod.POST, `verify`, `${AUTH_PATH}/verify`);

import type {
  InstructorSignupResponse,
  InstructorSignupRequest,
} from "@/types/auth/signup-instructor.types";
import type { TestDto } from "@/types/test";
import type {
  InstructorRegistrationRequest,
} from "@/types/auth/instructor-registration.type";

export const signUpInstructor = createThunk<
  InstructorSignupResponse,
  InstructorSignupRequest
>(HttpMethod.POST, `signup-instructor`, `${AUTH_PATH}/instructor/signup`, {
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

    return { data: form };
  },
});

export const test = createThunk<unknown, TestDto>(
  HttpMethod.POST,
  `test`,
  `api/auth/test-form`,
  {
    config: (payload) => {
      const form = new FormData();
      form.append("testccdmat.cccdmt", payload.testccdmat.cccdmt.toString());
      form.append("testccdmat.formFilecccd", payload.testccdmat.formFilecccd);
      form.append("testccdmas.cccdms", payload.testccdmas.cccdms.toString());
      form.append(
        "testccdmas.formFilecccdms",
        payload.testccdmas.formFilecccdms
      );

      return { data: form };
    },
  }
);

export const registerInstructor = createThunk<
  string, // instructorId
  InstructorRegistrationRequest
>(HttpMethod.POST, `register-instructor`, `${INSTRUCTOR_PATH}/register`, {
  buildBody: (payload) => {
    const form = new FormData();

    form.append("Fullname", payload.Fullname);
    form.append("RawPassword", payload.RawPassword);
    form.append("Email", payload.Email);
    form.append("PhoneNumber", payload.PhoneNumber);
    form.append("BirthDate", payload.BirthDate);
    form.append("Gender", payload.Gender);
    form.append("DrivingLicenseTier", payload.DrivingLicenseTier);
    form.append("TeachingTier", payload.TeachingTier);

    if (payload.Avatar) {
      form.append("Avatar", payload.Avatar);
    }
    if (payload.DrivingLicenseFront) {
      form.append("DrivingLicenseFront", payload.DrivingLicenseFront);
    }
    if (payload.DrivingLicenseBack) {
      form.append("DrivingLicenseBack", payload.DrivingLicenseBack);
    }
    if (payload.TeachingLicenseFront) {
      form.append("TeachingLicenseFront", payload.TeachingLicenseFront);
    }
    if (payload.HealthCheckup) {
      form.append("HealthCheckup", payload.HealthCheckup);
    }
    if (payload.PersonalProfile) {
      form.append("PersonalProfile", payload.PersonalProfile);
    }

    return form;
  },
  onSuccess: (res) => {
    console.log("[auth thunk] Instructor registration successful", res);
  },
  onError: (error) => {
    console.log("[auth thunk] error in registerInstructor", error);
  },
});
