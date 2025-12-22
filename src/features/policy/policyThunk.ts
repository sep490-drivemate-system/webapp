import { HttpMethod } from "@/types/constants/httpMethod";
import { createThunk } from "../genericCreateThunk";
import { IPolicy, Policy } from "@/types/policy";

export const getNewDriverPolicy = createThunk<
  IPolicy[],
  void
>(
  HttpMethod.GET,
  "getNewDriverPolicy",
  `policy`,
  {
    buildUrl: () => `policy?policyType=1`
  }
);

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

export const createPolicy = createThunk<
  Policy,
  Omit<Policy, "id">
>(
  HttpMethod.POST,
  "createPolicy",
  `policy`
);

export const updatePolicy = createThunk<
  Policy,
  { id: string; data: Omit<Policy, "id"> }
>(
  HttpMethod.PUT,
  "updatePolicy",
  `policy/:id`,
  {
    buildUrl: (payload) => `policy/${payload.id}`,
    buildBody: (payload) => payload.data,
  }
);
  
export const deletePolicy = createThunk<
  void,
  string[]
>(
  HttpMethod.DELETE,
  "deletePolicy",
  `policy/batch`,
  {
    buildBody: (payload) => payload,
  }
);
