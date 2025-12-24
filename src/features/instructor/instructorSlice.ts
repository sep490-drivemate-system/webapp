import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BaseState } from '@/types/generic/baseState';
import { IInstructors, IInstructorStatistic, IStatisticsInstructor } from '@/types/instructor/instructor-management.types';
import {
  FilterType,
  DistanceFilter,
  ExperienceLevel,
  MinimumRating,
  SortType,
  FilterState,
} from '@/types/instructor/instructor-filter.type';
import { getStatisticsInstructor, getStatisticOverviewPriceInstructor } from './instructorThunk';

interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
}

interface InstructorState extends BaseState {
  allInstructors: IInstructors[];
  filteredInstructors: IInstructors[];
  displayedInstructors: IInstructors[];
  
  statistics: IInstructorStatistic | null;
  revenueStatistics: IStatisticsInstructor | null;
  
  searchQuery: string;
  filters: FilterState;
  tempFilters: FilterState;
  
  sortBy: SortType;
  sortAscending: boolean;
  
  showFilterModal: boolean;
  isRefreshing: boolean;
  
  pagination: PaginationState;
}

const initialFilterState: FilterState = {
  availability: FilterType.All,
  distance: DistanceFilter.All,
  experience: ExperienceLevel.All,
  priceRange: [200000, 500000],
  minRating: MinimumRating.All,
};

const initialState: InstructorState = {
  allInstructors: [],
  filteredInstructors: [],
  displayedInstructors: [],
  
  statistics: null,
  revenueStatistics: null,
  
  searchQuery: '',
  filters: initialFilterState,
  tempFilters: initialFilterState,
  
  sortBy: SortType.Rating,
  sortAscending: false,
  
  showFilterModal: false,
  isRefreshing: false,
  
  pagination: {
    currentPage: 1,
    itemsPerPage: 8,
    totalItems: 0,
  },
  
  isLoading: false,
  errorMessage: null,
  isSuccess: false,
};

const instructorSlice = createSlice({
  name: 'instructor',
  initialState,
  reducers: {
    setAllInstructors: (state, action: PayloadAction<IInstructors[]>) => {
      state.allInstructors = action.payload;
    },
    setFilteredInstructors: (state, action: PayloadAction<IInstructors[]>) => {
      state.filteredInstructors = action.payload;
    },
    setDisplayedInstructors: (state, action: PayloadAction<IInstructors[]>) => {
      state.displayedInstructors = action.payload;
    },
    
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setFilters: (state, action: PayloadAction<FilterState>) => {
      state.filters = action.payload;
    },
    setTempFilters: (state, action: PayloadAction<FilterState>) => {
      state.tempFilters = action.payload;
    },
    resetFilters: (state) => {
      state.filters = initialFilterState;
      state.tempFilters = initialFilterState;
    },
    applyTempFilters: (state) => {
      state.filters = state.tempFilters;
    },
    
    setSortBy: (state, action: PayloadAction<SortType>) => {
      state.sortBy = action.payload;
    },
    setSortAscending: (state, action: PayloadAction<boolean>) => {
      state.sortAscending = action.payload;
    },
    toggleSortOrder: (state) => {
      state.sortAscending = !state.sortAscending;
    },
    
    setShowFilterModal: (state, action: PayloadAction<boolean>) => {
      state.showFilterModal = action.payload;
    },
    setIsRefreshing: (state, action: PayloadAction<boolean>) => {
      state.isRefreshing = action.payload;
    },
    
    setPagination: (state, action: PayloadAction<Partial<PaginationState>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    resetPagination: (state) => {
      state.pagination = {
        currentPage: 1,
        itemsPerPage: 8,
        totalItems: 0,
      };
    },
    
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.errorMessage = action.payload;
      state.isLoading = false;
    },
    setSuccess: (state, action: PayloadAction<boolean>) => {
      state.isSuccess = action.payload;
    },
    clearError: (state) => {
      state.errorMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getStatisticsInstructor.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = null;
      })
      .addCase(getStatisticsInstructor.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        if (action.payload.value) {
          state.statistics = action.payload.value;
        }
      })
      .addCase(getStatisticsInstructor.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.errorMessage = action.payload || 'Failed to fetch statistics';
      })
      .addCase(getStatisticOverviewPriceInstructor.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = null;
      })
      .addCase(getStatisticOverviewPriceInstructor.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        if (action.payload.value) {
          state.revenueStatistics = action.payload.value;
        }
      })
      .addCase(getStatisticOverviewPriceInstructor.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.errorMessage = action.payload || 'Failed to fetch revenue statistics';
      });
  },
});

export const {
  setAllInstructors,
  setFilteredInstructors,
  setDisplayedInstructors,
  
  setSearchQuery,
  setFilters,
  setTempFilters,
  resetFilters,
  applyTempFilters,
  
  setSortBy,
  setSortAscending,
  toggleSortOrder,
  
  setShowFilterModal,
  setIsRefreshing,
  
  setPagination,
  resetPagination,
  
  setLoading,
  setError,
  setSuccess,
  clearError,
} = instructorSlice.actions;

export default instructorSlice.reducer;
