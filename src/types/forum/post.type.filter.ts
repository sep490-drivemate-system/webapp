import { PostStatus } from "./post.enum";

export interface IPostFilter {
    title?: string;
    category?: string;
    tag?: string[];
    status?: PostStatus;
    PageNumber?: number;
    PageSize?: number;
}