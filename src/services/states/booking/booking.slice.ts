import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface BokingState {
  activeStatus: boolean;
  bookingItem: {
    Address1: string;
    BookingRefNo: string;
    BookingStatus: string;
    BookingTypeDesc: string;
    CustomerId: string;
    DateCompleted: string;
    IntervalTimeLabel: string;
    LawnAreaLabel: string;
    LawnArea: string;
    PropertyAddId: string;
    ServiceFee: string;
    ServiceProviderId: string;
    ServiceTypeDesc: string;
    Alias: string;
  };
  message: any;
  goToScreen: any;
  chatCount: number;
}

const initialState: BokingState = {
  activeStatus: false,
  bookingItem: {
    Address1: "",
    BookingRefNo: "",
    BookingStatus: "",
    BookingTypeDesc: "",
    CustomerId: "",
    DateCompleted: "",
    IntervalTimeLabel: "",
    LawnAreaLabel: "",
    LawnArea: "",
    PropertyAddId: "",
    ServiceFee: "",
    ServiceProviderId: "",
    ServiceTypeDesc: "",
    Alias: "",
  },
  message: "",
  goToScreen: "",
  chatCount: 0,
};

export const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    fnUpdateServiceProviderActiveStatus(state, action: PayloadAction<any>) {
      state.activeStatus = action.payload;
    },
    onSetBookingItem(state, action: PayloadAction<any>) {
      state.bookingItem = action.payload;
    },
    onSetMessage(state, action: PayloadAction<any>) {
      state.message = action.payload;
    },
    onSetGoToScreen(state, action: PayloadAction<any>) {
      state.goToScreen = action.payload;
    },
    onSetChatCount(state, action: PayloadAction<any>) {
      state.chatCount = action.payload;
    },
  },
});

export const bookingActions = bookingSlice.actions;
export default bookingSlice.reducer;
