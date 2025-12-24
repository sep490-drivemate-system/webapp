import { createThunk } from "../genericCreateThunk";
import { HttpMethod } from "@/types/constants/httpMethod";
import {
  InstructorRevew,
  CarReview,
} from "@/types/reviews/reviews.type";

export const FEEDBACK_PATH = "feedback";

export const getInstructorReviews = 
  createThunk<InstructorRevew[], { id: string }>(
    HttpMethod.GET,
    "getInstructorReviews",
    `/${FEEDBACK_PATH}/instructors/:id`,
    {
      buildUrl: (payload) => `/${FEEDBACK_PATH}/instructors/${payload.id}`,
    }
  );

export const getCarReviews = createThunk<CarReview[], { id: string }>(
  HttpMethod.GET,
  "getCarReviews",
  `/${FEEDBACK_PATH}/cars/:id`,
  {
    buildUrl: (payload) => `/${FEEDBACK_PATH}/cars/${payload.id}`,
  }
);