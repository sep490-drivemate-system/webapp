import { HttpMethod } from "@/types/constants/httpMethod";
import { createThunk } from "../genericCreateThunk";
import { IPolicy } from "@/types/policy";

export const getInstructorPolicy = createThunk<
  IPolicy[],
  void
>(
  HttpMethod.GET,
  "getInstructorPolicy",
  `policy`,
  {
    buildUrl: () => `policy?policyType=2`
  }
);