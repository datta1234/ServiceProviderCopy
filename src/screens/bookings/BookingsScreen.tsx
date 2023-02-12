import React, { useCallback, useLayoutEffect, useMemo, useState } from "react";
import { View, StyleProp, ViewStyle, useWindowDimensions } from "react-native";
import { useFocusEffect, useTheme } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import * as _ from "lodash";
import database from "@react-native-firebase/database";

// ? Tabs
import Reusable from "./tab-views/reusable-tab/ReusableTab";

/**
 * ? Local imports
 */
import createStyles from "./BookingsScreen.style";

import { SCREENS } from "@shared-constants";
import Text from "@shared-components/text-wrapper/TextWrapper";
import HeaderContainer from "@shared-components/headers/HeaderContainer";
import { pendingBookings } from "./mocks/mockData";

import { RootState } from "../../../store";
import { useBooking } from "@services/hooks/useBooking";
import { systemActions } from "@services/states/system/system.slice";
import { v2Colors } from "@theme/themes";

/**
 * ? Constants
 */
const RESERVATIONS_INITIAL_DATA: any = [];

interface IReservationsItemProps {
  Address1: string;
  BookingRefNo: string;
  BookingStatus: string;
  BookingTypeDesc: string;
  CustomerId: string;
  DateCompleted: string;
  IntervalTimeLabel: string;
  LawnAreaLabel: string;
  PropertyAddId: string;
  ServiceFee: string;
  ServiceProviderId: string;
  ServiceTypeDesc: string;
}

type CustomStyleProp = StyleProp<ViewStyle> | Array<StyleProp<ViewStyle>>;

interface IBookingsScreenProps {
  style?: CustomStyleProp;
  navigation: any;
  route?: any;
}

const BookingsScreen: React.FC<IBookingsScreenProps> = ({
  navigation,
  route,
}) => {
  const theme = useTheme();
  const { colors } = theme;
  const layout = useWindowDimensions();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const dispatch = useDispatch();

  /**
   * ? Hooks
   */
  const { getBookingHistory } = useBooking();

  /**
   * ? Actions
   */
  const {
    onSetPendingChatCount,
    onSetCompletedChatCount,
    onSetInDisputeChatCount,
  } = systemActions;

  /**
   * ? Redux States
   */
  const { serviceProviderId, deviceDetails } = useSelector(
    (state: RootState) => state.user
  );
  const { completedChatCount, pendingChatCount } = useSelector(
    (state: RootState) => state.system
  );
  const [inDisputeReservations, setInDisputeReservations] = useState<
    Array<IReservationsItemProps>
  >([]);

  /**
   * ? States
   */
  const [completedReservations, setCompletedReservations] = useState<
    Array<IReservationsItemProps>
  >([]);
  const [outstandingReservations, setOutstandingReservations] = useState<
    Array<IReservationsItemProps>
  >([]);
  const [chatTotalCount, setChatTotalCount] = useState<number>(0);

  /**
   * ? On Mount
   */
  useFocusEffect(
    useCallback(() => {
      fetchChatCount();
    }, [route])
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      tabBarBadge: !chatTotalCount ? null : chatTotalCount,
    });
  }, [chatTotalCount]);

  /**
   * ? Functions
   */
  const fetchChatCount = useCallback(() => {
    database()
      .ref(`/chat_count/service-provider/${serviceProviderId}/`)
      .once("value")
      .then((snapshot) => {
        const data = snapshot.val();
        // console.log("data:", data);
        if (!data) return fetchBookingHistory([]);

        let countArray: Array<any> = [];
        let totalCount: number = 0;
        Object?.keys(data).forEach(function (key) {
          const item = data[key];
          const { c_count } = item;
          totalCount += c_count;
          countArray.push({ bookingRef: key, count: c_count });
        });

        fetchBookingHistory(countArray);
        setChatTotalCount(totalCount);
      });
  }, []);

  const fetchBookingHistory = async (countArray: Array<any>) => {
    // console.log("countArray:", countArray);
    const payload = {
      ServiceProviderId: serviceProviderId,
      BookingRefNo: "",
      DeviceDetails: deviceDetails,
    };

    let fetchedTotalCompletedChatCount: number = 0;
    let fetchedTotalPendingChatCount: number = 0;
    let fetchedTotalInDisputeChatCount: number = 0;

    console.log("fetchBookingHistory payload:", payload);
    getBookingHistory(
      payload,
      (data: any) => {
        let newArrayCompleted: any = [];
        let newArrayOutstanding: any = [];
        let newArrayInDispute: any = [];

        data?.map((d: any) => {
          const { BookingRefNo } = d;
          let hasCompletedNotif = false;
          let hasPendingNotif = false;
          let hasInDisputeNotif = false;

          if (!_.size(countArray)) {
            if (d.BookingStatus === "COMPLETED")
              newArrayCompleted.push({ ...d, s_count: 0 });
            if (d.BookingStatus === "ACCEPTED")
              newArrayOutstanding.push({ ...d, s_count: 0 });
            if (d.BookingStatus === "DISPUTE")
              newArrayInDispute.push({ ...d, s_count: 0 });
            return;
          }

          countArray?.map((countItem: any) => {
            const { bookingRef, count } = countItem;
            if (BookingRefNo === bookingRef) {
              if (d.BookingStatus === "COMPLETED") {
                newArrayCompleted.push({ ...d, s_count: count });
                hasCompletedNotif = true;
                fetchedTotalCompletedChatCount += count;
                return;
              } else hasCompletedNotif = false;

              if (d.BookingStatus === "ACCEPTED") {
                newArrayOutstanding.push({ ...d, s_count: count });
                hasPendingNotif = true;
                fetchedTotalPendingChatCount += count;
                return;
              } else hasPendingNotif = false;

              if (d.BookingStatus === "DISPUTE") {
                newArrayInDispute.push({ ...d, s_count: count });
                hasInDisputeNotif = true;
                fetchedTotalInDisputeChatCount += count;
              } else hasInDisputeNotif = false;
            }
          });
          if (d.BookingStatus === "COMPLETED" && !hasCompletedNotif)
            return newArrayCompleted.push({ ...d, s_count: 0 });
          if (d.BookingStatus === "ACCEPTED" && !hasPendingNotif)
            return newArrayOutstanding.push({ ...d, s_count: 0 });
          if (d.BookingStatus === "DISPUTE" && !hasPendingNotif)
            return newArrayInDispute.push({ ...d, s_count: 0 });
        });

        setCompletedReservations(newArrayCompleted);
        setOutstandingReservations(newArrayOutstanding);
        setInDisputeReservations(newArrayInDispute);

        dispatch(onSetCompletedChatCount(fetchedTotalCompletedChatCount));
        dispatch(onSetPendingChatCount(fetchedTotalPendingChatCount));
        dispatch(onSetInDisputeChatCount(fetchedTotalInDisputeChatCount));
      },
      (error: any) => {
        console.log("error:", error);
      }
    );
  };

  /**
   * ? For Tabs
   */
  const FirstScreen = () => (
    <Reusable
      navigation={navigation}
      data={outstandingReservations}
      statusType="pending"
    />
  );
  const SecondScreen = () => (
    <Reusable
      navigation={navigation}
      data={completedReservations}
      statusType="completed"
    />
  );
  const ThirdScreen = () => (
    <Reusable
      navigation={navigation}
      data={inDisputeReservations}
      statusType="dispute"
    />
  );

  const renderScene = SceneMap({
    first: FirstScreen,
    second: SecondScreen,
    third: ThirdScreen,
  });

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "first", title: "Pending" },
    { key: "second", title: "Completed" },
    { key: "third", title: "In Dispute" },
  ]);

  /* -------------------------------------------------------------------------- */
  /*                               Render Methods                               */
  /* -------------------------------------------------------------------------- */
  const Count = (props: { count: number }) => {
    return (
      <View style={styles.chatCountContainer}>
        <Text bold color="white">
          {props.count}
        </Text>
      </View>
    );
  };

  return (
    <>
      <HeaderContainer
        pageTitle="Bookings"
        navigateTo={SCREENS.HOME}
        backDisabled
      />
      <View style={styles.container}>
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
          renderTabBar={(props) => {
            return (
              <TabBar
                {...props}
                indicatorStyle={{ backgroundColor: colors.neonGreen }}
                style={{
                  backgroundColor: "white",

                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 1,
                  },
                  shadowOpacity: 0.22,
                  shadowRadius: 2.22,

                  elevation: 3,
                }}
                pressOpacity={0}
                renderLabel={({ route, focused, color }) => (
                  <View>
                    {route.title == "Pending" && !!pendingChatCount && (
                      <Count count={pendingChatCount} />
                    )}
                    {route.title == "Completed" && !!completedChatCount && (
                      <Count count={completedChatCount} />
                    )}
                    <Text
                      color={focused ? v2Colors.green : v2Colors.gray}
                      style={{ fontWeight: "600" }}
                    >
                      {_.toUpper(route.title)}
                    </Text>
                  </View>
                )}
              />
            );
          }}
        />
      </View>
    </>
  );
};

export default BookingsScreen;
