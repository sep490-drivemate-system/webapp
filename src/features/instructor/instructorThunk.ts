import { ICar } from "@/types/car/car.type";
import { HttpMethod } from "@/types/constants/httpMethod";
import {
  GetInstructorsParams,
  IInstructors,
  IInstructorStatistic,
  IInstructorStatisticFilter,
  InstructorApplication,
  IStatisticsInstructor,
  PaginatedInstructorsResponse
} from "@/types/instructor/instructor-management.types";
import { createThunk } from "../genericCreateThunk";

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
    buildUrl: (payload) => `${INSTRUCTOR_PATH}/${payload.id}`,
  }
);

export const getInstructorCars = createThunk<ICar[], { id: string }>(
  HttpMethod.GET,
  "getInstructorCars",
  `car/instructor/:id/cars`,
  {
    buildUrl: (payload) => `car/instructor/${payload.id}/cars`,
  }
);

export const getRecommendedInstructors = createThunk<IInstructors[], void>(
  HttpMethod.GET,
  "getRecommendedInstructors",
  `/${INSTRUCTOR_PATH}/recommended`
);

export const getIntructorApplicationByInstructorId = createThunk<
  InstructorApplication,
  { instructorId: string }
>(
  HttpMethod.GET,
  "getIntructorApplicationByInstructorId",
  `${INSTRUCTOR_PATH}/:instructorId/applicants`,
  {
    buildUrl: (payload) =>
      `${INSTRUCTOR_PATH}/${payload.instructorId}/applicants`,
  }
);

export const getStatisticsInstructor = createThunk<
  IInstructorStatistic,
  IInstructorStatisticFilter | void
>(HttpMethod.GET, "getStatisticsInstructor", `booking/instructor-statistic`, {
  buildUrl: (payload) => {
    const baseUrl = `booking/instructor-statistic`;
    if (!payload || typeof payload !== "object") {
      return baseUrl;
    }

    const params = new URLSearchParams();

    // Always add type if provided
    if (payload.type !== undefined && payload.type !== null) {
      params.append("type", payload.type.toString());
    }

    // Add year if provided
    if (
      payload.year !== undefined &&
      payload.year !== null &&
      payload.year !== 0
    ) {
      params.append("year", payload.year.toString());
    }

    // Add month if provided (for month and week viewMode)
    if (
      payload.month !== undefined &&
      payload.month !== null &&
      payload.month !== 0
    ) {
      params.append("month", payload.month.toString());
    }

    // Add week if provided (only for week viewMode)
    if (
      payload.week !== undefined &&
      payload.week !== null &&
      payload.week !== 0
    ) {
      params.append("week", payload.week.toString());
    }

    const queryString = params.toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
  },
});

export const getStatisticOverviewPriceInstructor = createThunk<
  IStatisticsInstructor,
  { instructorId: string }
>(HttpMethod.GET, "getWallet", `transaction/users/:id/statistics`, {
  buildUrl: (payload) => `transaction/users/${payload.instructorId}/statistic`,
});
