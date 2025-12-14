import { HttpMethod } from "@/types/constants/httpMethod";
import { createThunk } from "../../genericCreateThunk";
import {
  ICategory,
  ICreateCategoryDto,
  IUpdateCategoryDto,
} from "@/types/taxonomy/category/category.type";

export const CATEGORY_PATH = "category";


export const getCategories = createThunk<ICategory[]>(
  HttpMethod.GET,
  "getCategory",
  `${CATEGORY_PATH}`
);

export const getCategoryById = createThunk<ICategory, { id: string }>(
  HttpMethod.GET,
  "getCategoryById",
  `${CATEGORY_PATH}/:id`,
  {
    buildUrl: (payload) => `${CATEGORY_PATH}/${payload.id}`,
  }
);

export const createCategory = createThunk<ICategory, ICreateCategoryDto>(
  HttpMethod.POST,
  "createCategory",
  `${CATEGORY_PATH}`
);

export const updateCategory = createThunk<
  ICategory,
  { id: string; data: IUpdateCategoryDto }
>(HttpMethod.PUT, "updateCategory", `${CATEGORY_PATH}/:id`, {
  buildUrl: (payload) => `${CATEGORY_PATH}/${payload.id}`,
  buildBody: (payload) => payload.data as IUpdateCategoryDto,
});

export const deleteCategory = createThunk<boolean, { id: string }>(
  HttpMethod.DELETE,
  "deleteCategory",
  `${CATEGORY_PATH}/:id`,
  {
    buildUrl: (payload) => `${CATEGORY_PATH}/${payload.id}`,
  }
);

