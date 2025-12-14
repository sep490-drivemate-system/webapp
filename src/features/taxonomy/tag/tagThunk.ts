import { HttpMethod } from "@/types/constants/httpMethod";
import { createThunk } from "../../genericCreateThunk";
import {
  ITag,
  ICreateTagDto,
  IUpdateTagDto,
} from "@/types/taxonomy/tag/tag.type";

export const TAG_PATH = "tag";


export const getTags = createThunk<ITag[]>(
  HttpMethod.GET,
  "getTag",
  `${TAG_PATH}`
);

export const getTagById = createThunk<ITag, { id: string }>(
  HttpMethod.GET,
  "getTagById",
  `${TAG_PATH}/:id`,
  {
    buildUrl: (payload) => `${TAG_PATH}/${payload.id}`,
  }
);

export const createTag = createThunk<ITag, ICreateTagDto>(
  HttpMethod.POST,
  "createTag",
  `${TAG_PATH}`
);

export const updateTag = createThunk<ITag, { id: string; data: IUpdateTagDto }>(
  HttpMethod.PUT,
  "updateTag",
  `${TAG_PATH}/:id`,
  {
    buildUrl: (payload) => `${TAG_PATH}/${payload.id}`,
    buildBody: (payload) => payload.data as IUpdateTagDto,
  }
);

export const deleteTag = createThunk<boolean, { id: string }>(
  HttpMethod.DELETE,
  "deleteTag",
  `${TAG_PATH}/:id`,
  {
    buildUrl: (payload) => `${TAG_PATH}/${payload.id}`,
  }
);

