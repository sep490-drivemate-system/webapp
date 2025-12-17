export interface Blog{
    id: string,
    instructorId: string,
    title: string,
    thumbnailUrl: string,
    categoryName: string,
    status: number,
}

export interface BlogDetail{
    id: string,
    instructorId: string,
    title: string,
    thumbnailUrl: string,
    imageList: string[],
    categoryId: string,
    categoryName: string,
    content: string,
    status: number,
}
export interface BlogCategory{
    id: string,
    name: string,
}

export interface BlogForInstructor{
    id: string,
    instructorId: string,
    title: string,
    thumbnailUrl: string,
    categoryName: string,
    status: number,
}

export interface BlogForInstructorDetail{
    id: string,
    instructorId: string,
    title: string,
    thumbnailUrl: string,
    imageList: string[],
    categoryId: string,
    categoryName: string,
    status: number,
    content: string,
}

export interface BlogForInstructorCreateUpdate{
    Title: string,
    Thumbnail: string | File,
    Images: (string | File)[],
    CategoryId: string | null,
    Content: string,
}

