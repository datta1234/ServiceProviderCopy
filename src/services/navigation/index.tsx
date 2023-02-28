import React, { useEffect } from "react";
import { useColorScheme, View } from "react-native";
import Icon from "react-native-dynamic-vector-icons";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { isReadyRef, navigationRef } from "react-navigation-helpers";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

/**
 * ? Local & Shared Imports
 */
import { SCREENS } from "@shared-constants";
import { palette, v2Colors } from "@theme/themes";
import { LightTheme, DarkTheme } from "@theme/themes";

import { useSelector } from "react-redux";
import { RootState } from "../../../store";

/**
 * ? Screens
 */
import LoginScreen from "@screens/login/LoginScreen";
import LandingScreen from "@screens/landing/LandingScreen";

import SignupScreen from "@screens/signup/SignupScreen";
import SetupPassword from "@screens/signup/SetupPassword";
import ServiceType from "@screens/signup/ServiceType";
import OTPScreen from "@screens/signup/otp/OTPScreen";
import SetLocationScreen from "@screens/signup/set-location/SetLocation";

import HomeScreen from "@screens/home/HomeScreen";
import MenuScreen from "@screens/account/AccountScreen";

import ProfileScreen from "@screens/account/profile/ProfileScreen";
import ScheduleScreen from "@screens/schedule/ScheduleScreen";
import InboxScreen from "@screens/account/menu-screens/inbox/InboxScreen";
import ReservationsScreen from "@screens/bookings/BookingsScreen";
import EarningsScreen from "@screens/earnings/EarningsScreen";
import DocumentsScreen from "@screens/account/menu-screens/documents/DocumentsScreen";

import AboutUsScreen from "@screens/account/menu-screens/about-us/AboutUsScreen";
import PrivacyScreen from "@screens/account/menu-screens/privacy/PrivacyScreen";

import BookingDetailScreen from "@screens/bookings/booking-details/BookingDetails";
import RatingFeedbackScreen from "@screens/rating-feedback/RatingFeedback";
import FAQScreen from "@screens/account/menu-screens/faq/FAQScreen";

import WelcomeScreen from "@screens/welcome/WelcomeScreen";

import UploadIdScreen from "@screens/upload-id/UploadIdScreen";
import AddBankScreen from "@screens/banks/AddBankScreen";

/**
 * ? SVGs
 */
import Home from "@assets/v2/bottom-nav/home.svg";
import HomeGreen from "@assets/v2/bottom-nav/home-green.svg";
import Bookings from "@assets/v2/bottom-nav/bookings.svg";
import BookingsGreen from "@assets/v2/bottom-nav/bookings-green.svg";
import Earnings from "@assets/v2/bottom-nav/earnings.svg";
import EarningsGreen from "@assets/v2/bottom-nav/earnings-green.svg";
import Mail from "@assets/v2/bottom-nav/mail.svg";
import MailGreen from "@assets/v2/bottom-nav/mail-green.svg";
import User from "@assets/v2/bottom-nav/user.svg";
import UserGreen from "@assets/v2/bottom-nav/user-green.svg";
import AvailabilityScreen from "@screens/schedule/ScheduleScreen";
import Calendar from "@assets/v2/bookings/icons/calendar-gray.svg";
import CalendarGreen from "@assets/v2/bookings/icons/calendar.svg";

// ? If you want to use stack or tab or both
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const Navigation = () => {
  const scheme = useColorScheme();
  const isDarkMode = scheme === "dark";

  /**
   * ? Redux States
   */
  const { totalChatCount } = useSelector((state: RootState) => state.system);

  /**
   * ? On Mount
   */

  useEffect((): any => {
    return () => (isReadyRef.current = false);
  }, []);

  const renderActiveIcon = (icon: JSX.Element) => (
    <View style={{ borderTopWidth: 2, marginTop: -6 }}>{icon}</View>
  );

  const renderTabIcon = (route: any, focused: boolean) => {
    switch (route.name) {
      case "Home":
        return focused ? (
          renderActiveIcon(<HomeGreen style={{ marginTop: 6 }} />)
        ) : (
          <Home />
        );
      case "Bookings":
        return focused ? (
          renderActiveIcon(<BookingsGreen style={{ marginTop: 6 }} />)
        ) : (
          <Bookings />
        );
      case SCREENS.AVAILABILITY:
        return focused ? (
          renderActiveIcon(
            <CalendarGreen height={23} width={23} style={{ marginTop: 6 }} />
          )
        ) : (
          <Calendar height={23} width={23} />
        );
      case SCREENS.EARNINGS:
        return focused ? (
          renderActiveIcon(
            <EarningsGreen height={23} width={23} style={{ marginTop: 6 }} />
          )
        ) : (
          <Earnings height={23} width={23} />
        );
      case SCREENS.INBOX:
        return focused ? (
          renderActiveIcon(<MailGreen style={{ marginTop: 6 }} />)
        ) : (
          <Mail />
        );
      case "Account":
        return focused ? (
          renderActiveIcon(<UserGreen style={{ marginTop: 6 }} />)
        ) : (
          <User />
        );
      default:
        return focused ? (
          renderActiveIcon(<HomeGreen style={{ marginTop: 6 }} />)
        ) : (
          <Home />
        );
    }
  };

  const RenderTabNavigation = () => {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused }) => renderTabIcon(route, focused),
          tabBarActiveTintColor: v2Colors.green,
          tabBarInactiveTintColor: "gray",
        })}
      >
        <Tab.Screen name={"Home "} component={HomeScreen} />
        <Tab.Screen
          name={"Bookings"}
          component={ReservationsScreen}
          options={{
            tabBarBadge: !totalChatCount ? undefined : totalChatCount,
          }}
        />
        <Tab.Screen
          name={SCREENS.AVAILABILITY}
          component={AvailabilityScreen}
        />
        <Tab.Screen name={SCREENS.EARNINGS} component={EarningsScreen} />
        <Tab.Screen name={"Account"} component={MenuScreen} />
      </Tab.Navigator>
    );
  };

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        isReadyRef.current = true;
      }}
      theme={isDarkMode ? DarkTheme : LightTheme}
    >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name={SCREENS.LANDING} component={LandingScreen} />
        <Stack.Screen name={SCREENS.LOGIN} component={LoginScreen} />

        <Stack.Screen name={SCREENS.SIGNUP} component={SignupScreen} />
        <Stack.Screen
          name={SCREENS.SET_LOCATION}
          component={SetLocationScreen}
        />
        <Stack.Screen name={SCREENS.SET_PASS} component={SetupPassword} />
        <Stack.Screen name={SCREENS.SERVICE_TYPE} component={ServiceType} />
        <Stack.Screen name={SCREENS.OTP} component={OTPScreen} />

        <Stack.Screen name={SCREENS.WELCOME} component={WelcomeScreen} />
        <Stack.Screen
          name={SCREENS.HOME}
          component={RenderTabNavigation}
          options={{ gestureEnabled: false }}
        />

        <Stack.Screen name={SCREENS.MENU} component={MenuScreen} />
        <Stack.Screen name={SCREENS.PROFILE} component={ProfileScreen} />
        <Stack.Screen name={SCREENS.AVAILABILITY} component={ScheduleScreen} />
        <Stack.Screen name={SCREENS.INBOX} component={InboxScreen} />
        <Stack.Screen
          name={SCREENS.RESERVATIONS}
          component={ReservationsScreen}
        />
        <Stack.Screen name={SCREENS.EARNINGS} component={EarningsScreen} />
        <Stack.Screen name={SCREENS.DOCUMENTS} component={DocumentsScreen} />

        <Stack.Screen name={SCREENS.ABOUT_US} component={AboutUsScreen} />
        <Stack.Screen name={SCREENS.PRIVACY} component={PrivacyScreen} />
        <Stack.Screen name={SCREENS.FAQ} component={FAQScreen} />

        <Stack.Screen
          name={SCREENS.BOOKING_DETAIL}
          component={BookingDetailScreen}
        />
        <Stack.Screen
          name={SCREENS.RATING_FEEDBACK}
          component={RatingFeedbackScreen}
        />
        <Stack.Screen name={SCREENS.UPLOAD_ID} component={UploadIdScreen} />
        <Stack.Screen name={SCREENS.ADD_BANK} component={AddBankScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
