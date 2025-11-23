import { createThunk } from "../genericCreateThunk";
import { HttpMethod } from "@/types/constants/httpMethod";
import { InstructorApplication } from "@/types/instructor-management.types";

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
