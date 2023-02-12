import React, { useMemo, useCallback } from "react";
import { View, StyleProp, ViewStyle, ActivityIndicator } from "react-native";
import { useFocusEffect, useTheme } from "@react-navigation/native";
import * as NavigationService from "react-navigation-helpers";
import publicIP from "react-native-public-ip";

/**
 * ? Local imports
 */
import createStyles from "./LandingScreen.style";

import { SCREENS } from "@shared-constants";
import { SystemInfo } from "../../utils/system/SystemGetters";
import AsyncStorage from "@react-native-community/async-storage";
import { AUTHENTICATION } from "@shared-constants";
import { useDispatch } from "react-redux";
import { userActions } from "@services/states/user/user.slice";

type CustomStyleProp = StyleProp<ViewStyle> | Array<StyleProp<ViewStyle>>;

interface ILandingScreenProps {
  style?: CustomStyleProp;
}

const LandingScreen: React.FC<ILandingScreenProps> = ({}) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const dispatch = useDispatch();

  const { TOKEN, SPID } = AUTHENTICATION;
  const { onUserLogin } = userActions;

  /**
   * ? Actions
   */
  const { onSetToken, onSetDeviceDetails } = userActions;

  useFocusEffect(
    useCallback(() => {
      setDeviceDetails();
    }, [])
  );

  const assessUserToken = async () => {
    await onGetServiceProviderId();

    const token = (await AsyncStorage.getItem(TOKEN)) || "";
    if (!!token) {
      dispatch(onSetToken(token));
      NavigationService.push(SCREENS.WELCOME);
      return;
    }
    return NavigationService.push(SCREENS.LOGIN);
  };

  const onGetServiceProviderId = async () => {
    const id = (await AsyncStorage.getItem(SPID)) || "";
    dispatch(onUserLogin(id));
  };

  const setDeviceDetails = async () => {
    const dispatchDeviceDetails = (ip: string) => {
      const deviceDetails = {
        ...SystemInfo,
        IpAddress: ip,
      };
      dispatch(onSetDeviceDetails(deviceDetails));
    };

    publicIP()
      .then((ip) => {
        dispatchDeviceDetails(ip);
        assessUserToken();
      })
      .catch((error) => {
        console.log("error:", error);
        dispatchDeviceDetails("000.000.0.0");
      });
  };

  /* -------------------------------------------------------------------------- */
  /*                               Render Methods                               */
  /* -------------------------------------------------------------------------- */

  return (
    <View style={styles.container}>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        {/* <ActivityIndicator size="large" color="black" /> */}
      </View>
    </View>
  );
};

export default LandingScreen;
