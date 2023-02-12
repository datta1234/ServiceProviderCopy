import { useEffect, useRef } from "react";
import { AppState } from "react-native";
import { useDispatch } from "react-redux";

import { bookingActions } from "@services/states/booking/booking.slice";
import { userActions } from "@services/states/user/user.slice";

const BackgroundActivityHandler = () => {
  const appState = useRef(AppState.currentState);
  const dispatch = useDispatch();

  const { onSetGoToScreen } = bookingActions;
  const { onSetAppState } = userActions;

  /**
   * ? Watchers
   */
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background|inactive/) &&
        nextAppState === "active"
      ) {
      }

      appState.current = nextAppState;
      dispatch(onSetAppState(appState.current));

      if (!["background", "active"].includes(appState.current))
        dispatch(onSetGoToScreen(""));
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return null;
};

export default BackgroundActivityHandler;
