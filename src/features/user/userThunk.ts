import { IUserInfo, InstructorDetailDTO } from "@/types/user/user-profile.type";
import { createThunk } from "../genericCreateThunk";
import { HttpMethod } from "@/types/constants/httpMethod";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axios/axiosInstance";
import { GenericResponse } from "@/types/generic/genericResponse";

export const USER_PATH = "users";
export const NOVICE_DRIVER_PATH = "novice-driver";
export const INSTRUCTOR_PATH = "instructors";

export const getUserById = createThunk<
    IUserInfo,
    { id: string }
>(
    HttpMethod.GET,
    "getUserById",
    `/${USER_PATH}`,
    {
        buildUrl: (payload) => {
            if (!payload.id || payload.id.trim() === "") {
                throw new Error("User ID is required");
            }
            return `/${USER_PATH}/${payload.id}`;
        }
    }
);

export const getLicenseValidity = createThunk<
    boolean,
    void
>(
    HttpMethod.GET,
    "getLicenseValidity",
    `/${NOVICE_DRIVER_PATH}/license-validity`
);

export interface UpdateInstructorPayload {
    id: string;
    bio?: string;
    experienceYear?: number;
}

/**
 * Helper function to convert UpdateInstructorPayload to FormData
 */
function createUpdateInstructorFormData(payload: UpdateInstructorPayload): FormData {
    const formData = new FormData();
    
    if (payload.bio !== undefined) {
        formData.append("Bio", payload.bio);
    }
    if (payload.experienceYear !== undefined) {
        formData.append("ExperienceYear", payload.experienceYear.toString());
    }
    
    return formData;
}

/**
 * Update instructor thunk that accepts id and optional fields, converts to FormData
 * PATCH /instructors/{id}
 */
export const updateInstructor = createAsyncThunk<
    GenericResponse<InstructorDetailDTO>,
    UpdateInstructorPayload,
    { rejectValue: string }
>("updateInstructor", async (payload, { rejectWithValue }) => {
    if (!payload.id || payload.id.trim() === "") {
        return rejectWithValue("Instructor ID is required");
    }

    const url = `/${INSTRUCTOR_PATH}/${payload.id}`;
    const formData = createUpdateInstructorFormData(payload);

    try {
        const response = await axiosInstance.patch<GenericResponse<InstructorDetailDTO>>(
            url,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        console.log(`[Thunk] Response:`, response.data);
        return response.data;
    } catch (err) {
        const error = err as unknown as {
            response?: { data?: { message?: string } };
            message?: string;
        };

        console.log(`[Thunk Error] PATCH ${url}:`, error);

        let message = "";
        if (error.response?.data?.message) {
            message = error.response.data.message;
        } else if (error.message) {
            message = error.message;
        } else {
            message = "Đã xảy ra lỗi. Vui lòng thử lại.";
        }

        return rejectWithValue(message);
    }
});

