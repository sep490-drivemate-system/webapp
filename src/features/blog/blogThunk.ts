import { createThunk } from "../genericCreateThunk";
import { HttpMethod } from "@/types/constants/httpMethod";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axios/axiosInstance";
import {
  Blog,
  BlogDetail,
  BlogCategory,
  BlogForInstructorDetail,
  BlogForInstructorCreateUpdate,
} from "@/types/blog/blog.type";
import { PaginatedGeneric, GenericResponse } from "@/types/generic/genericResponse";

export interface IGetListBlogsParams {
  pageNumber?: number;
  pageSize?: number;
}

const BLOG_PATH = "blogs";

function dataUrlToBlob(dataUrl: string): Blob {
  const arr = dataUrl.split(",");
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : "application/octet-stream";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

export const getListBlogsForAllRoles = createThunk<
  PaginatedGeneric<Blog>,
  IGetListBlogsParams | void
>(
  HttpMethod.GET,
  "getListBlogs",
  `${BLOG_PATH}/paged`,
  {
    buildUrl: (payload) => {
      const params = new URLSearchParams();
      if (payload?.pageNumber) {
        params.append("PageNumber", payload.pageNumber.toString());
      }
      if (payload?.pageSize) {
        params.append("PageSize", payload.pageSize.toString());
      }
      const queryString = params.toString();
      return `${BLOG_PATH}/paged${queryString ? `?${queryString}` : ""}`;
    },
  }
);

// Alias for backward compatibility
export const getListBlogs = getListBlogsForAllRoles;

export const getBlogDetailForAllRoles = createThunk<
  BlogDetail,
  { id: string }
>(
  HttpMethod.GET,
  "getBlogDetail",
  `${BLOG_PATH}/:id`,
  {
    buildUrl: (payload) => `${BLOG_PATH}/${payload.id}`,
  }
);

export const getBlogCategories = createThunk<
  BlogCategory[],
  void
>(
  HttpMethod.GET,
  "getBlogCategories",
  `/category`
);


export const getListBlogsForInstructor = createThunk<
  PaginatedGeneric<Blog>,
  IGetListBlogsParams | void
>(
  HttpMethod.GET,
  "getListBlogsForInstructor",
  `${BLOG_PATH}/my-blogs`,
  {
    buildUrl: (payload) => {
      const params = new URLSearchParams();
      if (payload?.pageNumber) {
        params.append("PageNumber", payload.pageNumber.toString());
      }
      if (payload?.pageSize) {
        params.append("PageSize", payload.pageSize.toString());
      }
      const queryString = params.toString();
      return `${BLOG_PATH}/my-blogs${queryString ? `?${queryString}` : ""}`;
    },
  }
);

export const gettBlogDetailForInstructor = createThunk<
  BlogForInstructorDetail,
  { id: string }
>(
  HttpMethod.GET,
  "getBlogDetailForInstructor",
  `${BLOG_PATH}/my-blogs/:id`,
  {
    buildUrl: (payload) => `${BLOG_PATH}/my-blogs/${payload.id}`,
  }
);

export const deleteBlogForInstructor = createThunk<
  void,
  { id: string }
>(
  HttpMethod.DELETE,
  "deleteBlogForInstructor",
  `${BLOG_PATH}/:id`,
  {
    buildUrl: (payload) => `${BLOG_PATH}/${payload.id}`,
  }
);

export const createBlogForInstructor = createAsyncThunk<
  GenericResponse<BlogForInstructorDetail>,
  BlogForInstructorCreateUpdate,
  { rejectValue: string }
>("createBlogForInstructor", async (payload, { rejectWithValue }) => {
  const url = `/${BLOG_PATH}`;

  const formData = new FormData();

  if (payload.Title !== undefined) {
    formData.append("Title", payload.Title);
  }
  if (payload.Thumbnail !== undefined) {
    if (payload.Thumbnail instanceof File) {
      formData.append("Thumbnail", payload.Thumbnail);
    } else if (
      typeof payload.Thumbnail === "string" &&
      payload.Thumbnail.startsWith("data:")
    ) {
      const blob = dataUrlToBlob(payload.Thumbnail);
      formData.append("Thumbnail", blob, "thumbnail.png");
    }
  }
  if (payload.Images?.length) {
    payload.Images.forEach((image) => {
      if (image instanceof File) {
        formData.append("Images", image);
      } else if (typeof image === "string" && image.startsWith("data:")) {
        const blob = dataUrlToBlob(image);
        formData.append("Images", blob, "image.png");
      }
    });
  }
  if (payload.CategoryId !== undefined) {
    const categoryValue =
      payload.CategoryId === null || payload.CategoryId === ""
        ? ""
        : payload.CategoryId;
    formData.append("CategoryId", categoryValue);
  }
  if (payload.Content !== undefined) {
    formData.append("Content", payload.Content);
  }

  try {
    const response = await axiosInstance.post<
      GenericResponse<BlogForInstructorDetail>
    >(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log(`[Thunk] Response:`, response.data);
    return response.data;
  } catch (err) {
    const error = err as unknown as {
      response?: { data?: { message?: string } };
      message?: string;
    };

    console.log(`[Thunk Error] POST ${url}:`, error);

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

export const updateBlogForInstructor = createAsyncThunk<
  GenericResponse<BlogForInstructorDetail>,
  { id: string } & BlogForInstructorCreateUpdate,
  { rejectValue: string }
>("updateBlogForInstructor", async (payload, { rejectWithValue }) => {
  const { id, ...data } = payload;
  const url = `/${BLOG_PATH}/${id}`;

  const formData = new FormData();

  if (data.Title !== undefined) {
    formData.append("Title", data.Title);
  }
  if (data.Thumbnail !== undefined) {
    if (data.Thumbnail instanceof File) {
      formData.append("Thumbnail", data.Thumbnail);
    } else if (
      typeof data.Thumbnail === "string" &&
      data.Thumbnail.startsWith("data:")
    ) {
      const blob = dataUrlToBlob(data.Thumbnail);
      formData.append("Thumbnail", blob, "thumbnail.png");
    }
  }
  if (data.Images?.length) {
    data.Images.forEach((image) => {
      if (image instanceof File) {
        formData.append("Images", image);
      } else if (typeof image === "string" && image.startsWith("data:")) {
        const blob = dataUrlToBlob(image);
        formData.append("Images", blob, "image.png");
      }
    });
  }
  if (data.CategoryId !== undefined) {
    const categoryValue =
      data.CategoryId === null || data.CategoryId === ""
        ? ""
        : data.CategoryId;
    formData.append("CategoryId", categoryValue);
  }
  if (data.Content !== undefined) {
    formData.append("Content", data.Content);
  }

  try {
    const response = await axiosInstance.put<
      GenericResponse<BlogForInstructorDetail>
    >(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

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

export const getListBlogsForInspector = createThunk<
  PaginatedGeneric<Blog>,
  IGetListBlogsParams | void
>(
  HttpMethod.GET,
  "getListBlogsForInspector",
  `${BLOG_PATH}/list`,
  {
    buildUrl: (payload) => {
      const params = new URLSearchParams();
      if (payload?.pageNumber) {
        params.append("PageNumber", payload.pageNumber.toString());
      }
      if (payload?.pageSize) {
        params.append("PageSize", payload.pageSize.toString());
      }
      const queryString = params.toString();
      return `${BLOG_PATH}/list${queryString ? `?${queryString}` : ""}`;
    },
  }
);

export const getBlogDetailForInspector = createThunk<
  BlogDetail,
  { id: string }
>(
  HttpMethod.GET,
  "getBlogDetailForInspector",
  `${BLOG_PATH}/list/:id`,
  {
    buildUrl: (payload) => `${BLOG_PATH}/list/${payload.id}`,
  }
);

export const approveBlogForInspector = createThunk<void, { id: string }>(
  HttpMethod.POST,
  "approveBlogForInspector",
  `${BLOG_PATH}/:id/approve`,
  {
    buildUrl: (payload) => `${BLOG_PATH}/${payload.id}/approve`,
  }
);

export const banBlogForInspector = createThunk<void, { id: string }>(
  HttpMethod.POST,
  "banBlogForInspector",
  `${BLOG_PATH}/:id/ban`,
  {
    buildUrl: (payload) => `${BLOG_PATH}/${payload.id}/ban`,
  }
);

export const unbanBlogForInspector = createThunk<void, { id: string }>(
  HttpMethod.POST,
  "unbanBlogForInspector",
  `${BLOG_PATH}/:id/unban`,
  {
    buildUrl: (payload) => `${BLOG_PATH}/${payload.id}/unban`,
  }
);

export const rejectBlogForInspector = createThunk<void, { id: string }>(
  HttpMethod.POST,
  "rejectBlogForInspector",
  `${BLOG_PATH}/:id/reject`,
  {
    buildUrl: (payload) => `${BLOG_PATH}/${payload.id}/reject`,
  }
);

export const createCategoriesForInspector = createThunk<
  BlogCategory,
  { name: string }
>(
  HttpMethod.POST,
  "createCategoriesForInspector",
  `/category`,
  {
    buildBody: (payload) => ({
      name: payload.name,
    }),
  }
);

export const deleteCategoryForInspector = createThunk<void, { id: string }>(
  HttpMethod.DELETE,
  "deleteCategoryForInspector",
  `/category/:id`,
  {
    buildUrl: (payload) => `/category/${payload.id}`,
  }
);