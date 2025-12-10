import { ICar } from "@/types/car/car.type";
import { createThunk } from "../genericCreateThunk";
import { HttpMethod } from "@/types/constants/httpMethod";
import { GetInstructorsParams, IInstructors, InstructorApplication, PaginatedInstructorsResponse } from "@/types/instructor/instructor-management.types";

export const INSTRUCTOR_PATH = "instructors";

export const getAllInstructorApplications = createThunk<
  InstructorApplication[],
  void
>(
  HttpMethod.GET,
  `getAllInstructorApplications`,
  `/${INSTRUCTOR_PATH}/applicants`
);

export const handleInstructorApplication = createThunk<
  void,
  { applicationId: string; action: "approve" | "reject"; note: string }
>(
  HttpMethod.POST,
  `approveInstructorApplication`,
  `/${INSTRUCTOR_PATH}/applicants/inspection`,
  {
    buildUrl: (payload) =>
      `/${INSTRUCTOR_PATH}/applicants/${payload.applicationId}/inspection?action=${payload.action}`,
    buildBody: (payload) => ({ note: payload.note }),
  }
);

export const getListInstructors = createThunk<
  PaginatedInstructorsResponse,
  GetInstructorsParams
>(HttpMethod.GET, "getListInstructors", `/${INSTRUCTOR_PATH}`, {
  buildUrl: (payload) => {
    const params = new URLSearchParams();
    if (payload?.searchKey) params.append("SearchKey", payload.searchKey);
    if (payload?.pageNumber)
      params.append("PageNumber", payload.pageNumber.toString());
    if (payload?.pageSize)
      params.append("PageSize", payload.pageSize.toString());

    const queryString = params.toString();
    return `/${INSTRUCTOR_PATH}${queryString ? `?${queryString}` : ""}`;
  },
});

export const getInstructorById = createThunk<IInstructors, { id: string }>(
  HttpMethod.GET,
  "getInstructorById",
  `${INSTRUCTOR_PATH}/:id`,
  {
    buildUrl: (payload) => `${INSTRUCTOR_PATH}/${payload.id}`
  }
);

export const getInstructorCars = createThunk<
  ICar[],
  { id: string }
>(HttpMethod.GET, "getInstructorCars", `car/instructor/:id/cars`, {
  buildUrl: (payload) => `car/instructor/${payload.id}/cars`,
});

export const getRecommendedInstructors = createThunk<
  IInstructors[],
  void
>(HttpMethod.GET, "getRecommendedInstructors", `/${INSTRUCTOR_PATH}/recommended`);