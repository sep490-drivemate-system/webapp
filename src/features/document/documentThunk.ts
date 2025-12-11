import { createThunk } from "../genericCreateThunk";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { HttpMethod } from "@/types/constants/httpMethod";
import { ApplicantDocument, EmergencyContact, licenseNovice } from "@/types/document/document.type";
import { GenericResponse } from "@/types/generic/genericResponse";
import axiosInstance from "@/lib/axios/axiosInstance";

export const INSTRUCTOR_PATH = "instructors";
export const USER_PATH = "users";
export const NOVICE_DRIVER_PATH = "novice-driver";

export const getInstructorApplication = createThunk<
  ApplicantDocument,
  { id: string }
>(
  HttpMethod.GET,
  "getInstructorApplication",
  `/${INSTRUCTOR_PATH}/:id/applicants`,
  {
    buildUrl: (payload) => {
      if (!payload.id || payload.id.trim() === "") {
        throw new Error("Instructor ID is required");
      }
      return `/${INSTRUCTOR_PATH}/${payload.id}/applicants`;
    },
  }
);

export const getUserEmergencyContact = createThunk<
  EmergencyContact[],
  { id: string }
>(
  HttpMethod.GET,
  "getUserEmergencyContact",
  `/${USER_PATH}/:id/emergency-contact`,
  {
    buildUrl: (payload) => {
      if (!payload.id || payload.id.trim() === "") {
        throw new Error("User ID is required");
      }
      return `/${USER_PATH}/${payload.id}/emergency-contact`;
    },
  }
);

export const updateUserEmergencyContact = createThunk<
  boolean,
  EmergencyContact
>(
  HttpMethod.PUT,
  "updateUserEmergencyContact",
  `/${USER_PATH}/emergency-contact/:id`,
  {
    buildUrl: (payload) => {
      if (!payload.id || payload.id.trim() === "") {
        throw new Error("Emergency contact ID is required");
      }
      return `/${USER_PATH}/emergency-contact/${payload.id}`;
    },
  }
);

function base64ToBlob(dataUrl: string): Blob {
  const [meta, base64Data] = dataUrl.split(",");
  const mimeMatch = meta.match(/data:(.*);base64/);
  const mimeType = mimeMatch?.[1] || "image/jpeg";
  const binary = atob(base64Data);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new Blob([bytes], { type: mimeType });
}

function createLicenseNoviceFormData(image: string | File | null): FormData {
  const formData = new FormData();
  
  if (image !== null && image !== undefined) {
    if (image instanceof File) {
      formData.append("image", image);
    } else if (image.startsWith("data:")) {
      const blob = base64ToBlob(image);
      formData.append("image", blob, "license.jpg");
    } else if (image.startsWith("file://") || image.startsWith("content://")) {
      const uri = image;
      const extension = uri.split('.').pop()?.toLowerCase() || 'jpg';
      const mimeType = extension === 'png' ? 'image/png' : 
                     extension === 'jpeg' || extension === 'jpg' ? 'image/jpeg' : 
                     'image/jpeg';
      formData.append("image", {
        uri: uri,
        type: mimeType,
        name: `license.${extension}`,
      } as any);
    } else {
      formData.append("image", image);
    }
  }
  
  return formData;
}


export const updateNoviceDriverLicense = createAsyncThunk<
  GenericResponse<licenseNovice>,
  { id: string; image: string | File | null },
  { rejectValue: string }
>("updateNoviceDriverLicense", async (payload, { rejectWithValue }) => {
  if (!payload.id || payload.id.trim() === "") {
    return rejectWithValue("Novice driver ID is required");
  }

  const url = `/${NOVICE_DRIVER_PATH}/${payload.id}/license`;
  const formData = createLicenseNoviceFormData(payload.image);

  try {
    const response = await axiosInstance.put<GenericResponse<licenseNovice>>(
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

    console.log(`[Thunk Error] PUT ${url}:`, error);

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

