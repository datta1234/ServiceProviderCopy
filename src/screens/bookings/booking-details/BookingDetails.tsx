import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  StyleProp,
  ViewStyle,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import * as NavigationService from "react-navigation-helpers";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import _, { toLower } from "lodash";
import database from "@react-native-firebase/database";

/**
 * ? Local Imports
 */
import createStyles from "./BookingDetails.style";
import Text from "@shared-components/text-wrapper/TextWrapper";
import HeaderContainer from "@shared-components/headers/HeaderContainer";
import { SCREENS } from "@shared-constants";
import CustomChatComponent from "./components/custom-chat-component/";
import BottomSheetModal from "@screens/bookings/booking-details/components/bottom-sheet-modal/BottomSheetModal";

import { RootState } from "../../../../store";
import { systemActions } from "@services/states/system/system.slice";
import { useBooking } from "@services/hooks/useBooking";
import { v2Colors } from "@theme/themes";

/**
 * ? SVGs
 */
import PENDING_WHITE from "@assets/v2/bookings/icons/pending-white.svg";
import CHECK_WHITE from "@assets/v2/bookings/icons/check-white.svg";
import RESCHEDULE from "@assets/v2/bookings/icons/reschedule.svg";
import CANCEL from "@assets/v2/bookings/icons/cancel.svg";

import CALENDAR_GREEN from "@assets/v2/bookings/icons/calendar-green.svg";
import HOUSE_PROPERY_GREEN from "@assets/v2/bookings/icons/house-property-green.svg";
import PIN_GREEN from "@assets/v2/bookings/icons/pin-green.svg";
import BOOKING_TYPE_GREEN from "@assets/v2/bookings/icons/booking-type.svg";
import PET_GREEN from "@assets/v2/bookings/icons/pet-green.svg";

import CALL_DARK_GREEN from "@assets/v2/bookings/icons/call-dark-green.svg";
import CHAT_DARK_GREEN from "@assets/v2/bookings/icons/chat-dark-green.svg";
import DISPUTE from "@assets/v2/bookings/icons/dispute.svg";
import RECEIPT from "@assets/v2/bookings/icons/receipt.svg";

/**
 * ? Constants
 */
const INITIAL_BOOKING_DATA = {
  Address1: "",
  BookingRefNo: "",
  BookingStatus: "",
  BookingTypeDesc: "",
  CustomerId: "",
  DateCompleted: "",
  IntervalTimeLabel: "",
  LawnAreaLabel: "",
  PropertyAddId: "",
  ServiceFee: "",
  ServiceProviderId: "",
  ServiceTypeDesc: "",
};

type CustomStyleProp = StyleProp<ViewStyle> | Array<StyleProp<ViewStyle>>;

interface IBookingDetailScreenProps {
  style?: CustomStyleProp;
  route?: any;
  navigation?: any;
}

const BookingDetailScreen: React.FC<IBookingDetailScreenProps> = ({}) => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);
  const dispatch = useDispatch();

  /**
   * ? Hooks
   */
  const { getBookingHistory, getCustomerDeviceID } = useBooking();

  /**
   * ? Actions
   */
  const { onResetReceivedChat } = systemActions;

  /**
   * ? Redux States
   */
  const { serviceProviderId, deviceDetails } = useSelector(
    (state: RootState) => state.user
  );
  const { bookingItem, message } = useSelector(
    (state: RootState) => state.booking
  );

  /**
   * ? States
   */
  const [bookingData, setBookingData] = useState<any>(INITIAL_BOOKING_DATA);
  const {
    Alias,
    Address1,
    lawnArea,
    LawnArea,
    BookingRefNo,
    BookingStatus,
    BookingTypeDesc,
    HasOutdoorPets,
    DateCompleted,
    Cost,
    ServiceTypeDesc,
    BookingDate,
    CustomerId,
  } = bookingData;
  const [initChat, setInitChat] = useState<boolean>(false);
  const [showChat, setShowChat] = useState<boolean>(false);
  const [Cinfo, setCinfo] = useState<{
    DeviceId: string;
    PlatformOs: string;
  }>({ DeviceId: "", PlatformOs: "" });

  /**
   * ? Variables
   */
  const today = moment();

  const [chatCount, setChatCount] = useState<number>(0);
  const [snapPoint, setSnapPoint] = useState<number>(0);
  const [text, setText] = useState<string>("");

  /**
   * ? On Mount
   */
  useEffect(() => {
    if (!message) return handleGetItem();
    onFetchBookingHistory();
  }, []);

  /**
   * ? Watchers
   */
  useEffect(() => {
    if (!CustomerId || !serviceProviderId) return;
    onGetDeviceInfo();
  }, [CustomerId, serviceProviderId]);

  useEffect(() => {
    if (!BookingRefNo) return;
    getChatCount();
  }, [initChat, BookingRefNo]);

  /**
   * ? Functions
   */
  const onFetchBookingHistory = () => {
    console.log("onFetchBookingHistory");
    const payload = {
      ServiceProviderId: serviceProviderId,
      BookingRefNo: JSON?.parse(message).bookingRefNo,
      DeviceDetails: deviceDetails,
    };

    getBookingHistory(
      payload,
      (data: any) => {
        setBookingData(data[0]);
      },
      (error) => {
        console.log("error:", error);
      }
    );
  };

  const handleGetItem = () => {
    if (!!bookingItem) setBookingData(bookingItem);
  };

  const onGetDeviceInfo = () => {
    console.log("onGetDeviceInfo");
    const payload = {
      CustomerId,
      DeviceDetails: deviceDetails,
    };
    getCustomerDeviceID(
      payload,
      (data: any) => {
        // console.log("getSPDeviceInfo data:", data);
        const { DeviceId, PlatformOs } = data[0];
        setCinfo({
          DeviceId,
          PlatformOs,
        });
        // fetchPathConversationId();
      },
      (err: any) => {
        console.log("err:", err);
      }
    );
  };

  const getChatCount = async () => {
    database()
      .ref(`/chat_count/service-provider/${serviceProviderId}/${BookingRefNo}`)
      .once("value")
      .then((snapshot) => {
        const data = snapshot.val();
        console.log("getChatCount data:", data);
        if (!data) return;
        setChatCount(data.c_count || 0);
      });
  };

  const onCompleteService = () => {
    const payload = {
      BookingRefNo: BookingRefNo || JSON?.parse(message).bookingRefNo,
      Remarks: "None",
      DeviceDetails: deviceDetails,
    };
    console.log("onCompleteService payload:", payload);

    NavigationService.navigate(SCREENS.RATING_FEEDBACK, {
      completeBookingData: payload,
      bookingData,
    });
  };

  const viewQueueLater = () => {
    if (
      BookingStatus.includes("ACCEPT") &&
      BookingTypeDesc === "Queue Later" &&
      moment(today).isSameOrAfter(BookingDate)
    )
      return true;
    return false;
  };

  /* -------------------------------------------------------------------------- */
  /*                               Render Methods                               */
  /* -------------------------------------------------------------------------- */
  const ViewOnTop = () => <View style={styles.viewOnTop} />;

  const PendingStatus = () => (
    <View style={styles.statusContainer}>
      <Text h4 color={"white"}>
        {"Pending"}
      </Text>
      <View style={{ width: 5 }} />
      <PENDING_WHITE style={{ top: 2 }} />
    </View>
  );

  const CompletedStatus = () => (
    <View style={[styles.statusContainer, { backgroundColor: v2Colors.blue }]}>
      <Text h4 color={"white"}>
        {"Completed"}
      </Text>
      <View style={{ width: 5 }} />
      <CHECK_WHITE />
    </View>
  );

  const PendingActions = () => (
    <View style={styles.headerBottomContent}>
      <TouchableOpacity style={styles.squareContainer}>
        <RESCHEDULE />
        <View style={{ width: 20 }} />
        <Text color={v2Colors.green}>Reschedule</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.squareContainer}>
        <CANCEL />
        <View style={{ width: 20 }} />
        <Text color={v2Colors.highlight}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );

  const CompletedActions = () => (
    <View style={styles.headerBottomContent}>
      <TouchableOpacity style={styles.squareContainer}>
        <DISPUTE />
        <View style={{ width: 20 }} />
        <Text color={v2Colors.green}>Dispute</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.squareContainer}>
        <RECEIPT />
        <View style={{ width: 20 }} />
        <Text color={v2Colors.highlight}>Receipt</Text>
      </TouchableOpacity>
    </View>
  );

  const Header = () => (
    <View style={styles.headerContainer}>
      <View style={styles.headerTopLeftContent}>
        <View>
          <Text h3 bold color={v2Colors.green}>
            Reference No.
          </Text>
          <Text h3 color={v2Colors.greenShade2}>
            {BookingRefNo}
          </Text>
        </View>
        {BookingStatus === "ACCEPTED" && <PendingStatus />}
        {BookingStatus === "COMPLETED" && <CompletedStatus />}
      </View>
      <View style={styles.headerMidContent}>
        <Text h3 color={v2Colors.green}>
          {BookingTypeDesc}
        </Text>
        <Text h2 bold color={v2Colors.green}>
          {`$${Number(Cost).toFixed(2)}`}
        </Text>
      </View>
      {/* {BookingStatus === "ACCEPTED" && <PendingActions />}
      {BookingStatus === "COMPLETED" && <CompletedActions />} */}
    </View>
  );

  const Details = () => (
    <>
      {renderLineItem(
        "Booking Date",
        toLower(BookingTypeDesc) === "queue later"
          ? moment(BookingDate).format("LL")
          : moment(BookingDate).format("LLL"),
        <CALENDAR_GREEN height={24} width={24} />
      )}
      {renderLineItem(
        "Alias",
        Alias,
        <HOUSE_PROPERY_GREEN height={24} width={24} />
      )}
      {renderLineItem(
        "Address",
        Address1,
        <PIN_GREEN height={24} width={24} />
      )}
      {!!DateCompleted &&
        renderLineItem(
          "Date Completed",
          DateCompleted,
          <CALENDAR_GREEN height={24} width={24} />
        )}
      {renderLineItem(
        "Booking Type",
        BookingTypeDesc,
        <BOOKING_TYPE_GREEN height={24} width={24} />
      )}
      {renderLineItem(
        "Outdoor Pets",
        !!Number(HasOutdoorPets) ? "Yes" : "No",
        <PET_GREEN height={30} width={30} />
      )}
      <View style={{ height: 100 }} />
    </>
  );

  const renderLineItem = (title: string, value: string, icon: JSX.Element) => {
    return (
      <View style={styles.item}>
        <View style={{ width: "80%" }}>
          <Text h3 bold color={v2Colors.green}>
            {title}
          </Text>
          <Text h4 color={v2Colors.greenShade2}>
            {value}
          </Text>
        </View>
        {icon}
      </View>
    );
  };

  const CommunicationActions = () => (
    <View style={styles.commsActionsContainer}>
      <TouchableOpacity>
        <CALL_DARK_GREEN />
      </TouchableOpacity>

      <View style={{ width: 10 }} />

      <TouchableOpacity onPress={() => setInitChat(true)}>
        <CHAT_DARK_GREEN />
      </TouchableOpacity>

      {(BookingStatus.includes("ACCEPT") && BookingTypeDesc === "Queue Now") ||
        (viewQueueLater() && (
          <>
            <View style={{ width: 20 }} />
            <Complete />
          </>
        ))}
    </View>
  );

  const Complete = () => (
    <TouchableOpacity
      onPress={() => onCompleteService()}
      style={styles.completeButtonContainer}
    >
      <Text color={"white"}>Complete</Text>
    </TouchableOpacity>
  );

  const BodyContent = () => (
    <CustomChatComponent
      CustomerId={CustomerId}
      bookingItem={bookingData}
      Cinfo={Cinfo}
      setInitChat={setInitChat}
      setSnapPoint={setSnapPoint}
    />
  );

  return (
    <>
      <HeaderContainer pageTitle="Booking Details" navigateTo={SCREENS.HOME} />
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 20 }}
          style={{ height: "80%" }}
        >
          <Header />
          <Details />
        </ScrollView>

        <CommunicationActions />
      </View>

      {snapPoint === 1 && initChat && <ViewOnTop />}

      {initChat && (
        <BottomSheetModal
          handleClose={() => {
            setShowChat(false);
            setInitChat(false);
          }}
          body={<BodyContent />}
          snapPoint={snapPoint}
          setSnapPoint={setSnapPoint}
          text={text}
          setText={setText}
        />
      )}
    </>
  );
};

export default BookingDetailScreen;
