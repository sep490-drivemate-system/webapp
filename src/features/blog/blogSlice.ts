import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BaseState } from '@/types/generic/baseState';
import { Blog, BlogDetail, BlogForInstructorDetail } from '@/types/blog/blog.type';
import { PaginatedGeneric } from '@/types/generic/genericResponse';
import { getListBlogs, getBlogDetailForAllRoles, getListBlogsForInstructor, gettBlogDetailForInstructor, deleteBlogForInstructor } from './blogThunk';

interface BlogState extends BaseState {
    blogs: Blog[];
    blogDetail: BlogDetail | BlogForInstructorDetail | null;
    pagination: {
        currentPage: number;
        pageSize: number;
        totalCount: number;
    } | null;
}

const initialState: BlogState = {
    isLoading: false,
    errorMessage: null,
    isSuccess: false,
    blogs: [],
    blogDetail: null,
    pagination: null,
};

const blogSlice = createSlice({
    name: 'blog',
    initialState,
    reducers: {
        clearError: (state) => {
            state.errorMessage = null;
        },
        clearSuccess: (state) => {
            state.isSuccess = false;
        },
        clearBlogs: (state) => {
            state.blogs = [];
            state.pagination = null;
        },
        clearBlogDetail: (state) => {
            state.blogDetail = null;
        },
    },
    extraReducers: (builder) => {
        // Get List Blogs
        builder
            .addCase(getListBlogs.pending, (state) => {
                state.isLoading = true;
                state.errorMessage = null;
            })
            .addCase(getListBlogs.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                const response = action.payload as any;
                
                // Handle both GenericResponse format and direct response
                // API returns: { value: PaginatedGeneric<Blog>, isSuccess: boolean, message: string, errorCode: null }
                // GenericResponse expects: { value: T, success: boolean, message: string, errorCode: null }
                const paginatedData: PaginatedGeneric<Blog> = response?.value;
                
                if (paginatedData && Array.isArray(paginatedData.pageContent)) {
                    state.blogs = paginatedData.pageContent;
                    state.pagination = {
                        currentPage: paginatedData.currentPage || 1,
                        pageSize: paginatedData.pageSize || 12,
                        totalCount: paginatedData.totalCount || 0,
                    };
                } else {
                    state.blogs = [];
                    state.pagination = null;
                }
            })
            .addCase(getListBlogs.rejected, (state, action) => {
                state.isLoading = false;
                state.isSuccess = false;
                state.errorMessage = action.payload || 'Không thể tải danh sách bài viết';
            });
        
        // Get List Blogs For Instructor
        builder
            .addCase(getListBlogsForInstructor.pending, (state) => {
                state.isLoading = true;
                state.errorMessage = null;
            })
            .addCase(getListBlogsForInstructor.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                const response = action.payload as any;
                
                // Handle both GenericResponse format and direct response
                // API returns: { value: PaginatedGeneric<Blog>, isSuccess: boolean, message: string, errorCode: null }
                const paginatedData: PaginatedGeneric<Blog> = response?.value;
                
                if (paginatedData && Array.isArray(paginatedData.pageContent)) {
                    state.blogs = paginatedData.pageContent;
                    state.pagination = {
                        currentPage: paginatedData.currentPage || 1,
                        pageSize: paginatedData.pageSize || 12,
                        totalCount: paginatedData.totalCount || 0,
                    };
                } else {
                    state.blogs = [];
                    state.pagination = null;
                }
            })
            .addCase(getListBlogsForInstructor.rejected, (state, action) => {
                state.isLoading = false;
                state.isSuccess = false;
                state.errorMessage = action.payload || 'Không thể tải danh sách bài viết';
            });
        
        // Get Blog Detail
        builder
            .addCase(getBlogDetailForAllRoles.pending, (state) => {
                state.isLoading = true;
                state.errorMessage = null;
            })
            .addCase(getBlogDetailForAllRoles.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                const response = action.payload as any;
                
                // Handle GenericResponse format
                // API returns: { value: BlogDetail, isSuccess: boolean, message: string, errorCode: null }
                const blogDetail: BlogDetail = response?.value;
                
                if (blogDetail) {
                    state.blogDetail = blogDetail;
                } else {
                    state.blogDetail = null;
                }
            })
            .addCase(getBlogDetailForAllRoles.rejected, (state, action) => {
                state.isLoading = false;
                state.isSuccess = false;
                state.errorMessage = action.payload || 'Không thể tải chi tiết bài viết';
                state.blogDetail = null;
            });

        // Get Blog Detail For Instructor
        builder
            .addCase(gettBlogDetailForInstructor.pending, (state) => {
                state.isLoading = true;
                state.errorMessage = null;
            })
            .addCase(gettBlogDetailForInstructor.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                const response = action.payload as any;

                // API returns: { value: BlogForInstructorDetail, isSuccess: boolean, message: string, errorCode: null }
                const blogDetail: BlogForInstructorDetail = response?.value;

                if (blogDetail) {
                    state.blogDetail = blogDetail;
                } else {
                    state.blogDetail = null;
                }
            })
            .addCase(gettBlogDetailForInstructor.rejected, (state, action) => {
                state.isLoading = false;
                state.isSuccess = false;
                state.errorMessage = action.payload || 'Không thể tải chi tiết bài viết';
                state.blogDetail = null;
            });

        // Delete Blog For Instructor
        builder
            .addCase(deleteBlogForInstructor.pending, (state) => {
                state.isLoading = true;
                state.errorMessage = null;
            })
            .addCase(deleteBlogForInstructor.fulfilled, (state) => {
                state.isLoading = false;
                state.isSuccess = true;
            })
            .addCase(deleteBlogForInstructor.rejected, (state, action) => {
                state.isLoading = false;
                state.isSuccess = false;
                state.errorMessage = action.payload || 'Không thể xóa bài viết';
            });
    },
});

export const {
    clearError,
    clearSuccess,
    clearBlogs,
    clearBlogDetail,
} = blogSlice.actions;

export default blogSlice.reducer;

