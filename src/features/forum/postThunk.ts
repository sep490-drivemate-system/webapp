import { createThunk } from "../genericCreateThunk";
import { HttpMethod } from "@/types/constants/httpMethod";
import {
    IPostCreation,
    IPostUpdate,
    IPostReaction,
    ICommentCreation,
    PostsDTO,
} from "@/types/forum/post.type";
import { IPostFilter } from "@/types/forum/post.type.filter";
import { PaginatedGeneric } from "@/types/generic/genericResponse";

export const POST_PATH = "post";

export const createPost = createThunk<boolean, IPostCreation>(
    HttpMethod.POST,
    "createPost",
    POST_PATH,
    {
        buildBody: (payload) => {
            const formData = new FormData();
            formData.append("Title", payload.title);
            formData.append("Content", payload.content);
            payload.tagIds?.forEach((id) => formData.append("TagIds", id));
            payload.categoryIds?.forEach((id) => formData.append("CategoryIds", id));

            payload.images?.forEach((file, idx) => {
                formData.append("Images", file);
                if (payload.imageOrders?.[idx] !== undefined) {
                    formData.append("ImageOrders", String(payload.imageOrders[idx]!));
                }
            });

            payload.videos?.forEach((file, idx) => {
                formData.append("Videos", file);
                if (payload.videoOrders?.[idx] !== undefined) {
                    formData.append("VideoOrders", String(payload.videoOrders[idx]!));
                }
            });

            return formData;
        },
        config: () => ({
            headers: { "Content-Type": "multipart/form-data" },
        }),
    }
);

export const getPosts = createThunk<PaginatedGeneric<PostsDTO>, IPostFilter>(
    HttpMethod.GET,
    "getPosts",
    POST_PATH,
    {
        buildUrl: (payload) => {
            if (!payload) return POST_PATH;
            const params = new URLSearchParams();
            if (payload.title) params.append("Title", payload.title);
            if (payload.category) params.append("Category", payload.category);
            payload.tag?.forEach((tag) => params.append("Tag", tag));
            if (payload.status !== undefined) params.append("Status", String(payload.status));
            if (payload.PageNumber) params.append("PageNumber", String(payload.PageNumber));
            if (payload.PageSize) params.append("PageSize", String(payload.PageSize));
            const query = params.toString();
            return `${POST_PATH}${query ? `?${query}` : ""}`;
        },
    }
);

export const updatePost = createThunk<boolean, { id: string; data: IPostUpdate }>(
    HttpMethod.PUT,
    "updatePost",
    `${POST_PATH}/:id`,
    {
        buildUrl: (payload) => `${POST_PATH}/${payload.id}`,
        buildBody: (payload) => payload.data,
    }
);

export const reactToPost = createThunk<boolean, { id: string; data: IPostReaction }>(
    HttpMethod.POST,
    "reactToPost",
    `${POST_PATH}/:id/reactions`,
    {
        buildUrl: (payload) => `${POST_PATH}/${payload.id}/reactions`,
        buildBody: (payload) => payload.data,
    }
);

export const commentOnPost = createThunk<boolean, { id: string; data: ICommentCreation }>(
    HttpMethod.POST,
    "commentOnPost",
    `${POST_PATH}/:id/comments`,
    {
        buildUrl: (payload) => `${POST_PATH}/${payload.id}/comments`,
        buildBody: (payload) => payload.data,
    }
);

