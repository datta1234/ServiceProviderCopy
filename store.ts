import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import userReducer from "./src/services/states/user/user.slice";
import bookingReducer from "@services/states/booking/booking.slice";
import systemReducer from "@services/states/system/system.slice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    booking: bookingReducer,
    system: systemReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
