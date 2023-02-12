import React, { useMemo } from "react";
import { View, StyleProp, ViewStyle, StatusBar, Alert } from "react-native";
import { useTheme } from "@react-navigation/native";
import * as NavigationService from "react-navigation-helpers";
import FastImage from "react-native-fast-image";
import { useDispatch, useSelector } from "react-redux";
import { startCase } from "lodash";
import { getReadableVersion } from "react-native-device-info";

/**
 * ? Local imports
 */
import createStyles from "./AccountScreen.style";
import { v2Colors } from "@theme/themes";
import fonts from "@fonts";
import { SCREENS, AUTHENTICATION } from "@shared-constants";
import Text from "@shared-components/text-wrapper/TextWrapper";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";

import { userActions } from "@services/states/user/user.slice";
import { useBooking } from "@services/hooks/useBooking";
import { RootState } from "../../../store";

/**
 * ? SVGs
 */
import SampleProfile from "@assets/v2/account/images/sample-profile.svg";
import Logout from "@assets/v2/account/icons/logout.svg";
import Wallet from "@assets/v2/account/icons/wallet.svg";
import Info from "@assets/v2/account/icons/info.svg";
import Document from "@assets/v2/account/icons/document.svg";
import Eye from "@assets/v2/account/icons/eye.svg";
import HelpCircle from "@assets/v2/account/icons/help-circle.svg";
import ChevronRight from "@assets/v2/account/icons/chevron-right.svg";
import File from "@assets/v2/homescreen/icons/file.svg";
import { bookingActions } from "@services/states/booking/booking.slice";
import AsyncStorage from "@react-native-community/async-storage";

type CustomStyleProp = StyleProp<ViewStyle> | Array<StyleProp<ViewStyle>>;

interface IMenuScreenProps {
  style?: CustomStyleProp;
}

const MenuScreen: React.FC<IMenuScreenProps> = () => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);
  const dispatch = useDispatch();
  const { SPID } = AUTHENTICATION;

  const { updateServiceProviderActiveStatus } = useBooking();
  const { fnUpdateServiceProviderActiveStatus } = bookingActions;

  /**
   * ? Redux States
   */
  const { token, deviceDetails, info } = useSelector(
    (state: RootState) => state.user
  );

  /**
   * ? Functions
   */
  const onOffActiveStatus = async () => {
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
      },
      (error) => {
        console.log("error:", error);
        Alert.alert(
          "[Active Status]",
          "Something went wrong, please try again."
        );
      }
    );
  };

  /* -------------------------------------------------------------------------- */
  /*                               Render Methods                               */
  /* -------------------------------------------------------------------------- */
  const Header = () => (
    <View style={styles.headerContainer}>
      <View style={styles.subHeaderContainer}>
        <SampleProfile height={90} width={90} style={{ marginRight: 10 }} />
        {/* <FastImage
          source={require(PROFILE)}
          style={styles.profilePicImageStyle}
          resizeMode={"contain"}
        /> */}
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text
              h3
              color={"white"}
              style={{ fontFamily: fonts.lexend.extraBold, fontWeight: "600" }}
            >
              {`${startCase(info.Firstname || "john")} ${startCase(
                info.Lastname
              )}`}
            </Text>
            <View style={{ height: 30 }} />
          </View>

          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => NavigationService.navigate(SCREENS.PROFILE)}
          >
            <Text h5 color={v2Colors.green}>
              Edit Profile
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => {
            dispatch(userActions.userLoggedOut());
            onOffActiveStatus();
            NavigationService.navigate(SCREENS.LANDING);
          }}
          style={styles.logoutContainer}
        >
          <Logout />
        </TouchableOpacity>
      </View>
    </View>
  );

  const Body = () => (
    <View style={{ flexGrow: 1, marginTop: 20 }}>
      <View style={styles.topContent}>
        <TouchableOpacity
          onPress={() => NavigationService.navigate(SCREENS.DOCUMENTS)}
          style={styles.squareContainer}
        >
          <File height={35} width={35} />
          <Text h4 color="black" style={{ marginTop: 10 }}>
            Documents
          </Text>
        </TouchableOpacity>
        <View style={{ width: "4%" }} />
        <TouchableOpacity
          onPress={() => NavigationService.navigate(SCREENS.ADD_BANK)}
          style={styles.squareContainer}
        >
          <Wallet height={35} width={35} />
          <Text h4 color="black" style={{ marginTop: 10 }}>
            Bank
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ marginTop: 50, marginBottom: 20 }}>
        <Text h4 bold color="black">
          General
        </Text>
      </View>

      {ListItem(<Info height={22} width={22} />, "About Us", () =>
        NavigationService.navigate(SCREENS.ABOUT_US)
      )}
      {ListItem(
        <Document height={22} width={22} />,
        "Terms and Conditions",
        () => console.log("terms and conditions")
      )}
      {ListItem(<Eye height={22} width={22} />, "Privacy", () =>
        NavigationService.navigate(SCREENS.PRIVACY)
      )}
      {ListItem(<HelpCircle height={22} width={22} />, "FAQ", () =>
        NavigationService.navigate(SCREENS.FAQ)
      )}
    </View>
  );

  const ListItem = (icon: JSX.Element, text: string, onPress: () => void) => (
    <TouchableOpacity style={styles.listItem} onPress={onPress}>
      <View style={styles.leftContent}>
        {icon}
        <View style={{ width: 12 }} />
        <Text h4>{text}</Text>
      </View>
      <ChevronRight />
    </TouchableOpacity>
  );

  const Bottom = () => (
    <View style={styles.bottomContentContainer}>
      <Text style={{ marginTop: 10 }}>{`v${getReadableVersion()}`}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle={"dark-content"} />
      <Header />
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        <View style={styles.subContainer}>
          <Body />
        </View>

        <Bottom />
      </ScrollView>
    </View>
  );
};

export default MenuScreen;
