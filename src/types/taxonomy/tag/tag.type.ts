export interface ITag {
    id: string;
    name: string;
    description?: string;
}

export interface ICreateTagDto {
    name: string;
    description?: string;
}

export interface IUpdateTagDto {
    name?: string;
    description?: string;
}