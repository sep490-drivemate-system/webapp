export interface ICategory {
    id: string;
    name: string;
}

export interface ICreateCategoryDto {
    name: string;
    description?: string;
    slug?: string;
}

export interface IUpdateCategoryDto {
    name?: string;
    description?: string;
    slug?: string;
}
