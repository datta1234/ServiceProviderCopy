import { useEffect, useRef, useState } from "react";
import { Alert, AppState } from "react-native";
import { useSelector } from "react-redux";
import RNLocation from "react-native-location";

import { useBooking } from "@services/hooks/useBooking";
import { RootState } from "../../../../../store";

const TIMER = 36000 * 2; // 2 minutes for sending live location

const UpdateLiveLocationComponent = () => {
  const { updateServiceProviderLocation } = useBooking();
  const appState = useRef(AppState.currentState);

  /**
   * ? States
   */
  const [_, setAppStateVisible] = useState(appState.current);

  const { token, serviceProviderId, deviceDetails } = useSelector(
    (state: RootState) => state.user
  );
  const { activeStatus } = useSelector((state: RootState) => state.booking);

  const getCurrentLocation = async () => {
    let permission = await RNLocation.checkPermission({
      ios: "whenInUse",
      android: {
        detail: "coarse",
      },
    });

    let location: any;

    if (!permission) {
      permission = await RNLocation.requestPermission({
        ios: "whenInUse",
        android: {
          detail: "coarse",
          rationale: {
            title: "We need to access your location",
            message: "We use your location to show where you are on the map",
            buttonPositive: "OK",
            buttonNegative: "Cancel",
          },
        },
      });
      location = await RNLocation.getLatestLocation({ timeout: 1000 });
      return false;
    } else {
      location = await RNLocation.getLatestLocation({ timeout: 1000 });
      // console.log("location:", location);

      if (!location?.latitude)
        return Alert.alert("Location", "Please turn on your location.");
      return { lat: location.latitude, lng: location.longitude };

      // for testing
      // return { lat: 14.5995, lng: 120.9842 };
    }
  };

  const onUpdateServiceProviderLocation = async () => {
    const location: any = await getCurrentLocation();
    if (!location) return;

    const payload = {
      ServiceProviderToken: token,
      ServiceProviderId: serviceProviderId,
      Longitude: location.lng,
      Latitude: location.lat,
      DeviceDetails: deviceDetails,
    };
    console.log("onUpdateServiceProviderLocation payload:", payload);

    updateServiceProviderLocation(
      payload,
      (data: any) => {
        console.log("updateServiceProviderLocation data:", data);
      },
      () => {
        // console.log("error");
      }
    );
  };

  /**
   * ? On Mount
   */

  // ? Sends live location to database every 2 minutes
  useEffect(() => {
    if (activeStatus) onUpdateServiceProviderLocation();

    const interval = setInterval(() => {
      if (activeStatus) onUpdateServiceProviderLocation();
      else clearInterval(interval);
    }, TIMER);

    return () => clearInterval(interval);
  }, [activeStatus]);

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
      setAppStateVisible(appState.current);
      if (!["background", "active"].includes(appState.current))
        console.log("inactive state");
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return null;
};

export default UpdateLiveLocationComponent;
