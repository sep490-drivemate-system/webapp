import { createThunk } from "@/features/genericCreateThunk";
import { HttpMethod } from "@/types/constants/httpMethod";

export interface UploadMeta {
    caption?: string;
    tags?: string[];
}

export interface UploadResponse {
    url: string;
    id?: string;
}

// Upload file kèm JSON metadata (multipart/form-data)
// Endpoint ví dụ: POST /files/upload
export const uploadFileWithMeta = createThunk<UploadResponse, FormData>(
    HttpMethod.POST,
    "uploadFileWithMeta",
    "files/upload"
    // Không cần set headers, interceptor sẽ tự xử lý multipart
);

// Ví dụ gửi JSON thuần (application/json)
export interface CreateProfilePayload {
    name: string;
    email: string;
}

export interface CreateProfileResponse {
    id: string;
    name: string;
    email: string;
}

export const createProfile = createThunk<
    CreateProfileResponse,
    CreateProfilePayload
>(HttpMethod.POST, "createProfile", "profiles");


