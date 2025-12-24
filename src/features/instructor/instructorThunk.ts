import { ICar } from "@/types/car/car.type";
import { createThunk } from "../genericCreateThunk";
import { HttpMethod } from "@/types/constants/httpMethod";
import { GetInstructorsParams, IInstructors, InstructorApplication, PaginatedInstructorsResponse, IInstructorStatistic } from "@/types/instructor/instructor-management.types";

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

export const getIntructorApplicationByInstructorId = createThunk<
  InstructorApplication,
  { instructorId: string }
>(HttpMethod.GET, "getIntructorApplicationByInstructorId", `${INSTRUCTOR_PATH}/:instructorId/applicants`, {
  buildUrl: (payload) => `${INSTRUCTOR_PATH}/${payload.instructorId}/applicants`
});

export interface GetInstructorStatisticParams {
  from?: string; // ISO 8601 date string
  to?: string; // ISO 8601 date string
}

export const getInstructorStatistic = createThunk<
  IInstructorStatistic,
  GetInstructorStatisticParams | void
>(
  HttpMethod.GET,
  "getInstructorStatistic",
  "booking/instructor-statistic",
  {
    buildUrl: (payload) => {
      if (!payload || (!payload.from && !payload.to)) {
        return "booking/instructor-statistic";
      }
      
      const params = new URLSearchParams();
      if (payload.from) params.append("from", payload.from);
      if (payload.to) params.append("to", payload.to);
      
      const queryString = params.toString();
      return `booking/instructor-statistic${queryString ? `?${queryString}` : ""}`;
    },
  }
);