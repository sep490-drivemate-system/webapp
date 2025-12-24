import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BaseState } from '@/types/generic/baseState';
import {
    IMyPackgesResponse,
} from '@/types/package/package.type';
import {
    IBookingSession,
    ISessionDetailResponse,
    SessionStatus,
} from '@/types/booking/booking.type';
import {
    ISessionRoutes,
} from '@/types/booking/booking.type';
import {
    IInstructorSchedule,
    IInstructorBookedSession,
    IPolicy,
    IUserInfo,
} from './bookingThunk';
import {
    getMyPackages,
    getBookingSessions,
    getAllSessions,
    getSessionRoutes,
    getSessionDetail,
    getPolicies,
    createSession,
    addSessionLog,

    updateSessionStatus,
    submitFeedback,
    cancelPackageBooking,
} from './bookingThunk';
import {
    getInstructorSchedule,
    getInstructorBookedSessions,
} from '../schedule/scheduleThunk';

interface BookingState extends BaseState {
    myPackages: IMyPackgesResponse[];

    bookingSessions: IBookingSession[];
    allSessions: IBookingSession[];
    sessionDetail: ISessionDetailResponse | null;
    sessionRoutes: ISessionRoutes[];

    instructorSchedule: IInstructorSchedule[];
    instructorBookedSessions: IInstructorBookedSession[];

    policies: IPolicy[];

    userInfo: IUserInfo | null;

    isCreatingSession: boolean;
    isSavingRoutes: boolean;
    isAddingLog: boolean;
    isCancellingSession: boolean;
    isReschedulingSession: boolean;
    isUpdatingStatus: boolean;
    isSubmittingFeedback: boolean;
    isCancellingBooking: boolean;
}

const initialState: BookingState = {
    isLoading: false,
    errorMessage: null,
    isSuccess: false,

    myPackages: [],
    bookingSessions: [],
    allSessions: [],
    sessionDetail: null,
    sessionRoutes: [],
    instructorSchedule: [],
    instructorBookedSessions: [],
    policies: [],
    userInfo: null,

    isCreatingSession: false,
    isSavingRoutes: false,
    isAddingLog: false,
    isCancellingSession: false,
    isReschedulingSession: false,
    isUpdatingStatus: false,
    isSubmittingFeedback: false,
    isCancellingBooking: false,
};

const mapStatusStringToEnum = (status: string | number): SessionStatus => {
    if (typeof status === 'number') {
        return status as SessionStatus;
    }
    
    switch (status) {
        case 'Planning':
            return SessionStatus.Planning;
        case 'Upcoming':
            return SessionStatus.Upcoming;
        case 'InProgress':
            return SessionStatus.InProgress;
        case 'Completed':
            return SessionStatus.Completed;
        case 'Reschedule':
            return SessionStatus.Reschedule;
        case 'Cancelled':
            return SessionStatus.Cancelled;
        default:
            return SessionStatus.Planning;
    }
};

const transformSessionResponse = (apiSession: any): IBookingSession => {
    return {
        id: apiSession.id,
        packageName: apiSession.packageName,
        displayStartLocationName: apiSession.displayStartLocationName,
        date: apiSession.date,
        startTime: apiSession.startTime,
        endTime: apiSession.endTime,
        duration: apiSession.duration,
        startingLatitude: apiSession.startingLatitude,
        startingLongtitude: apiSession.startingLongtitude,
        displayEndLocationName: apiSession.displayEndLocationName,
        endingLatitude: apiSession.endingLatitude,
        endingLongtitude: apiSession.endingLongtitude,
        vehicleName: apiSession.carName || apiSession.vehicleName || null,
        status: mapStatusStringToEnum(apiSession.status),
        createdAt: apiSession.createdAt,
    };
};

const bookingSlice = createSlice({
    name: 'booking',
    initialState,
    reducers: {
        clearSessionDetail: (state) => {
            state.sessionDetail = null;
        },
        clearSessionRoutes: (state) => {
            state.sessionRoutes = [];
        },
        clearError: (state) => {
            state.errorMessage = null;
        },
        clearSuccess: (state) => {
            state.isSuccess = false;
        },

        setUserInfo: (state, action: PayloadAction<IUserInfo | null>) => {
            state.userInfo = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getMyPackages.pending, (state) => {
                state.isLoading = true;
                state.errorMessage = null;
            })
            .addCase(getMyPackages.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                const response = action.payload as any;
                state.myPackages = Array.isArray(response) ? response : (response?.value || []);
            })
            .addCase(getMyPackages.rejected, (state, action) => {
                state.isLoading = false;
                state.isSuccess = false;
                state.errorMessage = action.error.message || 'Không thể tải danh sách gói';
            });

        builder
            .addCase(getBookingSessions.pending, (state) => {
                state.isLoading = true;
                state.errorMessage = null;
            })
            .addCase(getBookingSessions.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                const response = action.payload as any;
                state.bookingSessions = Array.isArray(response) ? response : (response?.value || []);
            })
            .addCase(getBookingSessions.rejected, (state, action) => {
                state.isLoading = false;
                state.isSuccess = false;
                state.errorMessage = action.error.message || 'Không thể tải danh sách buổi học';
            });

        builder
            .addCase(getAllSessions.pending, (state) => {
                state.isLoading = true;
                state.errorMessage = null;
            })
            .addCase(getAllSessions.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                const response = action.payload as any;
                const sessions = Array.isArray(response) ? response : (response?.value || []);
                state.allSessions = sessions.map(transformSessionResponse);
            })
            .addCase(getAllSessions.rejected, (state, action) => {
                state.isLoading = false;
                state.isSuccess = false;
                state.errorMessage = action.error.message || 'Không thể tải danh sách buổi học';
            });

        builder
            .addCase(getSessionRoutes.pending, (state) => {
                state.isLoading = true;
                state.errorMessage = null;
            })
            .addCase(getSessionRoutes.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                const response = action.payload as any;
                state.sessionRoutes = Array.isArray(response) ? response : (response?.value || []);
            })
            .addCase(getSessionRoutes.rejected, (state, action) => {
                state.isLoading = false;
                state.isSuccess = false;
                state.errorMessage = action.error.message || 'Không thể tải lộ trình';
            });

        builder
            .addCase(getSessionDetail.pending, (state) => {
                state.isLoading = true;
                state.errorMessage = null;
            })
            .addCase(getSessionDetail.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                const response = action.payload as any;
                state.sessionDetail = response?.value || response;
            })
            .addCase(getSessionDetail.rejected, (state, action) => {
                state.isLoading = false;
                state.isSuccess = false;
                state.errorMessage = action.error.message || 'Không thể tải chi tiết buổi học';
            });

        builder
            .addCase(getInstructorSchedule.pending, (state) => {
                state.isLoading = true;
                state.errorMessage = null;
            })
            .addCase(getInstructorSchedule.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                const response = action.payload as any;
                state.instructorSchedule = Array.isArray(response) ? response : (response?.value || []);
            })
            .addCase(getInstructorSchedule.rejected, (state, action) => {
                state.isLoading = false;
                state.isSuccess = false;
                state.errorMessage = action.error.message || 'Không thể tải lịch trình';
            });

        builder
            .addCase(getInstructorBookedSessions.pending, (state) => {
                state.isLoading = true;
                state.errorMessage = null;
            })
            .addCase(getInstructorBookedSessions.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                const response = action.payload as any;
                state.instructorBookedSessions = Array.isArray(response) ? response : (response?.value || []);
            })
            .addCase(getInstructorBookedSessions.rejected, (state, action) => {
                state.isLoading = false;
                state.isSuccess = false;
                state.errorMessage = action.error.message || 'Không thể tải danh sách buổi học đã đặt';
            });

        builder
            .addCase(getPolicies.pending, (state) => {
                state.isLoading = true;
                state.errorMessage = null;
            })
            .addCase(getPolicies.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                const response = action.payload as any;
                state.policies = Array.isArray(response) ? response : (response?.value || []);
            })
            .addCase(getPolicies.rejected, (state, action) => {
                state.isLoading = false;
                state.isSuccess = false;
                state.errorMessage = action.error.message || 'Không thể tải chính sách';
            });

        builder
            .addCase(createSession.pending, (state) => {
                state.isCreatingSession = true;
                state.errorMessage = null;
            })
            .addCase(createSession.fulfilled, (state) => {
                state.isCreatingSession = false;
                state.isSuccess = true;
            })
            .addCase(createSession.rejected, (state, action) => {
                state.isCreatingSession = false;
                state.isSuccess = false;
                state.errorMessage = action.error.message || 'Không thể tạo buổi học';
            });

        builder
            .addCase(addSessionLog.pending, (state) => {
                state.isAddingLog = true;
                state.errorMessage = null;
            })
            .addCase(addSessionLog.fulfilled, (state) => {
                state.isAddingLog = false;
                state.isSuccess = true;
            })
            .addCase(addSessionLog.rejected, (state, action) => {
                state.isAddingLog = false;
                state.isSuccess = false;
                state.errorMessage = action.payload || 'Không thể thêm log';
            });

        builder
            .addCase(updateSessionStatus.pending, (state) => {
                state.isUpdatingStatus = true;
                state.errorMessage = null;
            })
            .addCase(updateSessionStatus.fulfilled, (state) => {
                state.isUpdatingStatus = false;
                state.isSuccess = true;
            })
            .addCase(updateSessionStatus.rejected, (state, action) => {
                state.isUpdatingStatus = false;
                state.isSuccess = false;
                state.errorMessage = action.payload || 'Không thể cập nhật trạng thái buổi tập lái';
            });

        builder
            .addCase(submitFeedback.pending, (state) => {
                state.isSubmittingFeedback = true;
                state.errorMessage = null;
            })
            .addCase(submitFeedback.fulfilled, (state) => {
                state.isSubmittingFeedback = false;
                state.isSuccess = true;
            })
            .addCase(submitFeedback.rejected, (state, action) => {
                state.isSubmittingFeedback = false;
                state.isSuccess = false;
                state.errorMessage = action.payload || 'Không thể gửi phản hồi';
            });

        builder
            .addCase(cancelPackageBooking.pending, (state) => {
                state.isCancellingBooking = true;
                state.errorMessage = null;
            })
            .addCase(cancelPackageBooking.fulfilled, (state) => {
                state.isCancellingBooking = false;
                state.isSuccess = true;
            })
            .addCase(cancelPackageBooking.rejected, (state, action) => {
                state.isCancellingBooking = false;
                state.isSuccess = false;
                state.errorMessage = action.error.message || 'Không thể hủy gói học';
            });

    },
});

export const {
    clearSessionDetail,
    clearSessionRoutes,
    clearError,
    clearSuccess,
    setUserInfo,
} = bookingSlice.actions;

export default bookingSlice.reducer;

