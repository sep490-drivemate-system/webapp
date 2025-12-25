import { createSlice } from '@reduxjs/toolkit';
import { BaseState } from '@/types/generic/baseState';
import { IPolicy, Policy } from '@/types/policy';
import { getNewDriverPolicy, getInstructorPolicy, createPolicy, updatePolicy, deletePolicy } from './policyThunk';

interface PolicyState extends BaseState {
    newDriverPolicies: IPolicy[];
    instructorPolicies: IPolicy[];
}

const initialState: PolicyState = {
    isLoading: false,
    errorMessage: null,
    isSuccess: false,
    newDriverPolicies: [],
    instructorPolicies: [],
};

const policySlice = createSlice({
    name: 'policy',
    initialState,
    reducers: {
        clearError: (state) => {
            state.errorMessage = null;
        },
        clearSuccess: (state) => {
            state.isSuccess = false;
        },
        clearPolicies: (state) => {
            state.newDriverPolicies = [];
            state.instructorPolicies = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getNewDriverPolicy.pending, (state) => {
                state.isLoading = true;
                state.errorMessage = null;
            })
            .addCase(getNewDriverPolicy.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                const response = action.payload as { value?: IPolicy[] } | unknown;
                
                const policies: IPolicy[] = response?.value;
                
                if (Array.isArray(policies)) {
                    state.newDriverPolicies = policies;
                } else {
                    state.newDriverPolicies = [];
                }
            })
            .addCase(getNewDriverPolicy.rejected, (state, action) => {
                state.isLoading = false;
                state.isSuccess = false;
                state.errorMessage = action.payload || 'Không thể tải điều khoản người lái mới';
            });

        builder
            .addCase(getInstructorPolicy.pending, (state) => {
                state.isLoading = true;
                state.errorMessage = null;
            })
            .addCase(getInstructorPolicy.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                const response = action.payload as { value?: IPolicy[] } | unknown;
                
                const policies: IPolicy[] = response?.value;
                
                if (Array.isArray(policies)) {
                    state.instructorPolicies = policies;
                } else {
                    state.instructorPolicies = [];
                }
            })
            .addCase(getInstructorPolicy.rejected, (state, action) => {
                state.isLoading = false;
                state.isSuccess = false;
                state.errorMessage = action.payload || 'Không thể tải điều khoản người hướng dẫn';
            });

        builder
            .addCase(createPolicy.pending, (state) => {
                state.isLoading = true;
                state.errorMessage = null;
            })
            .addCase(createPolicy.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                const response = action.payload as { value?: Policy } | unknown;
                const policy: Policy = response?.value;
                
                if (policy) {
                    const ipolicy: IPolicy = {
                        id: policy.id,
                        title: policy.title,
                        detail: policy.description,
                        type: policy.type,
                    };
                    
                    if (ipolicy.type === 1) {
                        state.newDriverPolicies.push(ipolicy);
                    } else if (ipolicy.type === 2) {
                        state.instructorPolicies.push(ipolicy);
                    }
                }
            })
            .addCase(createPolicy.rejected, (state, action) => {
                state.isLoading = false;
                state.isSuccess = false;
                state.errorMessage = action.payload || 'Không thể tạo điều khoản';
            });

        builder
            .addCase(updatePolicy.pending, (state) => {
                state.isLoading = true;
                state.errorMessage = null;
            })
            .addCase(updatePolicy.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                const response = action.payload as { value?: Policy } | unknown;
                const updatedPolicy: Policy = response?.value;
                
                if (updatedPolicy) {
                    const ipolicy: IPolicy = {
                        id: updatedPolicy.id,
                        title: updatedPolicy.title,
                        detail: updatedPolicy.description,
                        type: updatedPolicy.type,
                    };
                    
                    if (ipolicy.type === 1) {
                        const index = state.newDriverPolicies.findIndex(p => p.id === ipolicy.id);
                        if (index !== -1) {
                            state.newDriverPolicies[index] = ipolicy;
                        }
                    } else if (ipolicy.type === 2) {
                        const index = state.instructorPolicies.findIndex(p => p.id === ipolicy.id);
                        if (index !== -1) {
                            state.instructorPolicies[index] = ipolicy;
                        }
                    }
                }
            })
            .addCase(updatePolicy.rejected, (state, action) => {
                state.isLoading = false;
                state.isSuccess = false;
                state.errorMessage = action.payload || 'Không thể cập nhật điều khoản';
            });

        builder
            .addCase(deletePolicy.pending, (state) => {
                state.isLoading = true;
                state.errorMessage = null;
            })
            .addCase(deletePolicy.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                const deletedIds = action.meta.arg;
                
                if (Array.isArray(deletedIds)) {
                    state.newDriverPolicies = state.newDriverPolicies.filter(
                        (policy) => !deletedIds.includes(policy.id)
                    );
                    state.instructorPolicies = state.instructorPolicies.filter(
                        (policy) => !deletedIds.includes(policy.id)
                    );
                }
            })
            .addCase(deletePolicy.rejected, (state, action) => {
                state.isLoading = false;
                state.isSuccess = false;
                state.errorMessage = action.payload || 'Không thể xóa điều khoản';
            });
    },
});

export const {
    clearError,
    clearSuccess,
    clearPolicies,
} = policySlice.actions;

export default policySlice.reducer;

