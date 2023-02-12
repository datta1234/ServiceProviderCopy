import React, { useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import messaging from "@react-native-firebase/messaging";
import AsyncStorage from "@react-native-community/async-storage";
import publicIP from "react-native-public-ip";
import * as NavigationService from "react-navigation-helpers";

/**
 * ? Local Imports
 */
import { SCREENS } from "@shared-constants";
import { SystemInfo } from "utils/system/SystemGetters";
import { useAuth } from "@services/hooks/useAuth";
import { userActions } from "@services/states/user/user.slice";
import { bookingActions } from "@services/states/booking/booking.slice";
import { AUTHENTICATION } from "@shared-constants";
import { RootState } from "../../../../store";
import { useBooking } from "@services/hooks/useBooking";
import { Alert } from "react-native";

/**
 * Global Constants
 */
const TIMER = 5500;

const Setup: React.FC<any> = () => {
  const dispatch = useDispatch();
  const { TOKEN, SPID } = AUTHENTICATION;

  /**
   * ? Hooks
   */
  const { updateDeviceId, getInfo } = useAuth();
  const { onUserLogin, onSetToken, onSetDeviceDetails, onSetDeviceId } =
    userActions;
  const { fnUpdateServiceProviderActiveStatus } = bookingActions;
  const { updateServiceProviderActiveStatus } = useBooking();

  /**
   * ? Redux States
   */
  const { token, serviceProviderId, deviceDetails } = useSelector(
    (state: RootState) => state.user
  );
  const { goToScreen } = useSelector((state: RootState) => state.booking);

  /**
   * ? On Mount
   */
  useFocusEffect(
    useCallback(() => {
      onGetToken();
      setDeviceDetails();
    }, [])
  );

  /**
   * ? Functions
   */
  const onSetMessagingConfig = () => {
    // Get the device token
    messaging()
      .getToken()
      .then((token) => {
        return saveTokenToDatabase(token);
      });

    // If using other push notification providers (ie Amazon SNS, etc)
    // you may need to get the APNs token instead for iOS:
    // if(Platform.OS == 'ios') { messaging().getAPNSToken().then(token => { return saveTokenToDatabase(token); }); }

    // Listen to whether the token changes
    return messaging().onTokenRefresh((token) => {
      saveTokenToDatabase(token);
    });
  };

  const onGetToken = async () => {
    const token = (await AsyncStorage.getItem(TOKEN)) || "";

    dispatch(onSetToken(token));
    return token;
  };

  const onGetServiceProviderId = async () => {
    const id = (await AsyncStorage.getItem(SPID)) || "";
    return id;
  };

  const setDeviceDetails = async () => {
    const dispatchDeviceDetails = (ip: string) => {
      const thisDeviceDetails = {
        ...SystemInfo,
        IpAddress: ip || "192.168.1.1",
      };
      dispatch(onSetDeviceDetails(thisDeviceDetails));
    };

    await publicIP()
      .then((ip) => {
        dispatchDeviceDetails(ip);
      })
      .catch((error) => {
        console.log("setDeviceDetails error:", error);
        dispatchDeviceDetails("000.000.0.0");
      });

    onSetMessagingConfig();
  };

  const saveTokenToDatabase = async (deviceId: any) => {
    const id = await onGetServiceProviderId();
    dispatch(onSetDeviceId(deviceId));

    const payload = {
      ServiceProviderToken: await onGetToken(),
      ServiceProviderId: id,
      DeviceId: deviceId,
      DeviceDetails: deviceDetails,
    };

    console.log("updateDeviceId payload:", payload);
    updateDeviceId(
      payload,
      (data: any) => {
        // console.log("updateDeviceId data:", data);
        dispatch(onUserLogin(id));
        _getInfo();
      },
      (error) => {
        console.log("updateDeviceId error:", error);
        NavigationService.push(SCREENS.LOGIN);
      }
    );
  };

  const _getInfo = async () => {
    if (!token || !serviceProviderId) return;

    const payload = {
      ServiceProviderToken: token,
      ServiceProviderId: await AsyncStorage.getItem(SPID),
      DeviceDetails: deviceDetails,
    };

    getInfo(
      payload,
      (data: any) => {
        console.log("getInfo data:", data);
        onOffActiveStatus();
      },
      (err) => {
        console.log("getInfo err:", err);
        NavigationService.push(SCREENS.LOGIN);
      }
    );
  };

  const onOffActiveStatus = async () => {
    console.log("onOffActiveStatus");
    dispatch(fnUpdateServiceProviderActiveStatus(false));
    const payload = {
      ServiceProviderToken: token,
      ServiceProviderId: await AsyncStorage.getItem(SPID),
      Status: 0,
      DeviceDetails: deviceDetails,
    };

    updateServiceProviderActiveStatus(
      payload,
      (data: any) => {
        console.log("updateServiceProviderActiveStatus data:", data);

        if (!goToScreen) return NavigationService.navigate(SCREENS.HOME);
        NavigationService.navigate(SCREENS[`${goToScreen}`]);
      },
      (error) => {
        console.log("error:", error);
        Alert.alert("[Active Status]");

        NavigationService.push(SCREENS.LOGIN);
      }
    );
  };

  return null;
};

export default Setup;
