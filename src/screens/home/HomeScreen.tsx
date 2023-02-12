import React, { useMemo, useEffect, memo, useCallback, useState } from "react";
import {
  View,
  StyleProp,
  ViewStyle,
  BackHandler,
  Alert,
  Switch,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect, useTheme } from "@react-navigation/native";
import * as _ from "lodash";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-community/async-storage";
import * as NavigationService from "react-navigation-helpers";
import moment from "moment";
import { SafeAreaView } from "react-native-safe-area-context";
import Collapsible from "react-native-collapsible";

/**
 * ? Local Imports
 */
import { SCREENS } from "@shared-constants";
import { v2Colors } from "@theme/themes";
import createStyles from "./HomeScreen.style";
import HeaderHome from "@shared-components/headers/HeaderHome";
import Text from "@shared-components/text-wrapper/TextWrapper";
import UpdateLiveLocationComponent from "./components/functions/UpdateLiveLocation";

import { useBooking } from "@services/hooks/useBooking";
import { bookingActions } from "@services/states/booking/booking.slice";
import { RootState } from "../../../store";
import { AUTHENTICATION } from "@shared-constants";
import ChatCountHandler from "shared/functions/ChatCountHandler";
import { pendingBookings } from "./mock/MockData";

/**
 * ? SVGs
 */
import CASH from "@assets/v2/homescreen/icons/cash.svg";
import CHEVRON_RIGHT from "@assets/v2/homescreen/icons/chevron-right.svg";
import MINUS_CIRCLE from "@assets/v2/homescreen/icons/minus-circle.svg";
import PLUS_CIRCLE from "@assets/v2/homescreen/icons/plus-circle.svg";
import FILE from "@assets/v2/homescreen/icons/file.svg";
import CHECK_SQUARE from "@assets/v2/homescreen/icons/check-square.svg";
import LIKE from "@assets/v2/homescreen/icons/like.svg";
import STAR from "@assets/v2/homescreen/icons/star.svg";
import TIME_ORANGE from "@assets/v2/homescreen/icons/time-orange.svg";
import CHEVRON_RIGHT_BLACK from "@assets/v2/homescreen/icons/chevron-right-black.svg";
import FastImage from "react-native-fast-image";
import GoOnlineSound from "./components/functions/GoOnlineSound";
import GoOfflineSound from "./components/functions/GoOfflineSound";
// import ONLINE from "@assets/v2/homescreen/images/online.svg";
// import OFFLINE from "@assets/v2/homescreen/images/offline.svg";

/**
 * ? Images
 */
const ONLINE = "../../assets/v2/homescreen/images/online.png";
const OFFLINE = "../../assets/v2/homescreen/images/offline.png";

/**
 * ? Constants
 */
const IS_DOCS_COMPLETE = false;
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

interface IHomeScreenProps {
  style?: CustomStyleProp;
  navigation?: any;
  route?: any;
}

const HomeScreen: React.FC<IHomeScreenProps> = ({ route }) => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);
  const dispatch = useDispatch();
  const { SPID } = AUTHENTICATION;

  const {
    updateServiceProviderActiveStatus,
    getBookingHistory,
    getActiveStatus,
  } = useBooking();
  const { fnUpdateServiceProviderActiveStatus, onSetBookingItem } =
    bookingActions;

  /**
   * ? Redux States
   */
  const { token, serviceProviderId, deviceDetails, info } = useSelector(
    (state: RootState) => state.user
  );
  const { activeStatus } = useSelector((state: RootState) => state.booking);

  /**
   * States
   */
  const [reservationsData, setReservationsData] = useState<
    Array<IReservationsItemProps>
  >(RESERVATIONS_INITIAL_DATA);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
  const [dateFilterText, setDateFilterText] = useState<string>("Today");
  const [playOnlineSound, setPlayOnlineSound] = useState(false);
  const [playOfflineSound, setPlayOfflineSound] = useState(false);

  // chat count handler
  const [didReceiveNotif, setDidReceiveNotif] = useState<boolean>(false);

  /**
   * ? On Mount
   */
  useFocusEffect(
    useCallback(() => {
      fetchBookingHistory();
      setDidReceiveNotif(true);
    }, [])
  );

  useEffect(() => {
    fetchActiveStatus();
    // onUpdateActiveStatus(true);
  }, []);

  /**
   * ? Watchers
   */
  useEffect(() => {
    if (route.name !== "Home") return;
    const backAction = () => {
      Alert.alert("Hold on!", "Are you sure you want to close the app?", [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel",
        },
        { text: "YES", onPress: () => BackHandler.exitApp() },
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [route.name]);

  /**
   * ? Functions
   */
  const fetchBookingHistory = () => {
    const payload = {
      ServiceProviderId: serviceProviderId,
      BookingRefNo: "",
      DeviceDetails: deviceDetails,
    };

    getBookingHistory(
      payload,
      (data: any) => {
        let newArray: any = [];
        data?.map((d: any) => {
          if (d.BookingStatus === "ACCEPTED") newArray.push(d);
        });

        setReservationsData(newArray);
      },
      (error: any) => {
        console.log("fetchBookingHistory error:", error);
      }
    );
  };

  const fetchActiveStatus = () => {
    const payload = {
      ServiceProviderId: serviceProviderId,
      DeviceDetails: deviceDetails,
    };

    console.log("getActiveStatus payload:", payload);
    getActiveStatus(
      payload,
      (data: any) => {
        console.log("data:", data);
        const { IsActive } = data[0];
        // console.log("IsActive:", IsActive);
        if (IsActive === undefined) {
        } else
          dispatch(
            fnUpdateServiceProviderActiveStatus(!IsActive ? false : true)
          );
      },
      (err: any) => {
        console.log("fetchActiveStatus err:", err);
      }
    );
  };

  const onUpdateActiveStatus = async (turnOff?: boolean) => {
    !activeStatus ? onPlayOnlineSound() : onPlayOfflineSound();
    dispatch(fnUpdateServiceProviderActiveStatus(!activeStatus));
    const payload = {
      ServiceProviderToken: token,
      ServiceProviderId: await AsyncStorage.getItem(SPID),
      Status: !!turnOff ? 0 : !activeStatus ? 1 : 0,
      DeviceDetails: deviceDetails,
    };

    updateServiceProviderActiveStatus(
      payload,
      (data: any) => {
        console.log("updateServiceProviderActiveStatus data:", data);
      },
      (error) => {
        console.log("error:", error);
      }
    );

    !!turnOff && dispatch(fnUpdateServiceProviderActiveStatus(false));
  };

  const goToBookingDetails = (item: any) => {
    dispatch(onSetBookingItem(item.item));
    NavigationService.navigate(SCREENS.BOOKING_DETAIL);
  };

  const onPlayOnlineSound = () => {
    setPlayOnlineSound(true);
  };
  const onPlayOfflineSound = () => {
    setPlayOfflineSound(true);
  };

  /* -------------------------------------------------------------------------- */
  /*                               Render Methods                               */
  /* -------------------------------------------------------------------------- */
  const Earnings = () => (
    <View style={styles.earningsContainer}>
      <View style={styles.earningsLeftContainer}>
        <CASH />
        <View style={{ width: 14 }} />
        <Text>
          <Text h3 bold color={"white"}>
            Earnings
          </Text>{" "}
          <Text h3 color="white">
            $650.00
          </Text>
        </Text>
      </View>

      <View style={styles.earningsRightContainer}>
        <Text h4 bold color={"white"}>
          Today
        </Text>
        <View style={{ width: 14 }} />
        <CHEVRON_RIGHT />
      </View>
    </View>
  );

  const Analytics = () => (
    <View style={styles.analyticsContainer}>
      <TouchableOpacity
        onPress={() => setIsCollapsed((collapsed) => !collapsed)}
        style={styles.analyticsHeaderContainer}
      >
        <Text h3 bold>
          Analytics
        </Text>
        {isCollapsed ? <PLUS_CIRCLE /> : <MINUS_CIRCLE />}
      </TouchableOpacity>
      <Collapsible collapsed={isCollapsed}>
        <View>
          <View style={styles.analyticsTopRow}>
            {renderAnalyticsItem(<FILE />, "Bookings", "12", true)}
            {renderAnalyticsItem(
              <CHECK_SQUARE />,
              "Total Jobs Completed",
              "45"
            )}
          </View>

          <View style={styles.analyticsBotRow}>
            {renderAnalyticsItem(<LIKE />, "Acceptance Rate", "75%", true)}
            {renderAnalyticsItem(<STAR />, "Service Star Rating", "5")}
          </View>
        </View>
      </Collapsible>
    </View>
  );

  const renderAnalyticsItem = (
    icon: JSX.Element,
    title: string,
    number: string,
    left?: boolean
  ) => (
    <View
      style={[styles.analyticsItem, left && styles.analyticsVerticalSeparator]}
    >
      {icon}
      <Text style={{ marginTop: 10 }}>{title}</Text>
      <Text h4 bold>
        {number}
      </Text>
    </View>
  );

  const PendingBookings = () => {
    return (
      <View style={styles.pendingBookingsContainer}>
        <Text h3 bold>
          Pending Bookings
        </Text>

        <View style={styles.pendingDateHeaderContainer}>
          {renderDateFilterHeader("Today")}
          {renderDateFilterHeader("This Week")}
          {renderDateFilterHeader("This Month")}
        </View>

        <View style={styles.listContainer}>
          <FlatList
            data={reservationsData}
            // data={pendingBookings}
            renderItem={renderItem}
            contentContainerStyle={{
              padding: 10,
            }}
            style={{ flex: 1, marginBottom: isCollapsed ? 20 : 150 }}
            keyExtractor={(_, index) => index.toString()}
            ListEmptyComponent={renderEmpty}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    );
  };

  const renderDateFilterHeader = (text: string) => {
    const isActive = dateFilterText === text;

    return (
      <TouchableOpacity
        style={
          isActive ? styles.activeDateHeaderItem : styles.pendingDateHeaderItem
        }
        onPress={() => setDateFilterText(text)}
      >
        <Text
          color={isActive ? v2Colors.green : v2Colors.highlight}
          style={{ fontWeight: isActive ? "bold" : "normal" }}
        >
          {text}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderItem = (item: any) => {
    const { BookingRefNo, Address1, BookingDate } = item.item;
    if (item.index > 4) return null;

    return (
      <View
        style={[styles.item]}
        // onPress={() => goToBookingDetails(item)}
      >
        <View style={styles.itemLeftContainer}>
          <View style={styles.itemHeaderContainer}>
            <TIME_ORANGE />
            <View style={{ width: 10 }} />
            <Text h4 bold color={v2Colors.orange} style={{ marginBottom: 3 }}>
              {BookingRefNo || ""}
            </Text>
          </View>
          <Text h5 style={{ marginTop: 4 }}>
            {Address1 || ""}
          </Text>
          <Text h5 style={{ marginTop: 2 }}>
            {moment(BookingDate).format("LLL") || ""}
          </Text>
        </View>
        <View>
          <CHEVRON_RIGHT_BLACK />
        </View>
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={{ marginTop: 20 }}>
      <Text h4 color={colors.fontDarkGray} style={{ textAlign: "center" }}>
        No pending bookings yet.
      </Text>
    </View>
  );

  const OnlineSwitch = memo(() => {
    return (
      <TouchableOpacity
        style={styles.onlineSwitchContainer}
        onPress={() => {
          onUpdateActiveStatus();
        }}
      >
        {activeStatus ? (
          <FastImage
            source={require(ONLINE)}
            style={styles.onlineSwitch}
            resizeMode="contain"
          />
        ) : (
          <FastImage
            source={require(OFFLINE)}
            style={styles.onlineSwitch}
            resizeMode="contain"
          />
        )}
      </TouchableOpacity>
    );
  });

  const Status = () => (
    <View
      style={[
        styles.statusContainer,
        {
          backgroundColor: activeStatus ? v2Colors.highlight : v2Colors.red,
        },
      ]}
    >
      <Text bold color={"white"}>
        {activeStatus ? "You are Online" : "You are Offline"}
      </Text>
    </View>
  );

  return (
    <View style={styles.parentContainer}>
      <UpdateLiveLocationComponent />
      <HeaderHome
        name={
          _.truncate(_.upperFirst(info.Firstname), { length: 20 }) || "John"
        }
      />
      <View style={styles.container}>
        <Earnings />
        <Analytics />
        <PendingBookings />
        {!IS_DOCS_COMPLETE && <OnlineSwitch />}
        <GoOnlineSound
          play={playOnlineSound}
          setPlayOnlineSound={setPlayOnlineSound}
        />
        <GoOfflineSound
          play={playOfflineSound}
          setPlayOfflineSound={setPlayOfflineSound}
        />
      </View>
      <Status />

      <ChatCountHandler
        didReceiveNotif={didReceiveNotif}
        setDidReceiveNotif={setDidReceiveNotif}
      />
    </View>
  );
};

export default HomeScreen;
