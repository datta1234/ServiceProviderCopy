import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  View,
  StyleProp,
  ViewStyle,
  Pressable,
  TextInput,
  Alert,
  Keyboard,
} from "react-native";
import { useFocusEffect, useTheme } from "@react-navigation/native";
import * as NavigationService from "react-navigation-helpers";
import Icon from "react-native-dynamic-vector-icons";
import moment from "moment";

/**
 * ? Local imports
 */
import createStyles from "./RatingFeedback.style";
import HeaderContainer from "@shared-components/headers/HeaderContainer";
import Text from "@shared-components/text-wrapper/TextWrapper";
import { SCREENS } from "@shared-constants";
import CommonButton from "@shared-components/buttons/CommonButton";
import { isAndroid } from "@freakycoder/react-native-helpers";

import { useBooking } from "@services/hooks/useBooking";
import { useSystem } from "@services/hooks/useSystem";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";

/**
 * ? Constants
 */
const STARS_NUMBER: Array<number> = [1, 2, 3, 4, 5];

type CustomStyleProp = StyleProp<ViewStyle> | Array<StyleProp<ViewStyle>>;

interface IRatingFeedbackScreenProps {
  style?: CustomStyleProp;
  route?: any;
}

const RatingFeedbackScreen: React.FC<IRatingFeedbackScreenProps> = ({
  route,
}) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const completeBookingPayload = route.params?.completeBookingData;
  const bookingData = route.params?.bookingData;
  const { CustomerId } = bookingData;

  /**
   * ? Hooks
   */
  const {
    completeBooking,
    saveFeedback,
    getCustomerDeviceID,
    sendNotification,
  } = useBooking();
  const { saveNotificationLogs } = useSystem();

  /**
   * ? Refs
   */
  const textRef = useRef<any>();

  /**
   * ? Redux States
   */
  const { serviceProviderId, deviceDetails } = useSelector(
    (state: RootState) => state.user
  );

  /**
   * ? States
   */
  const [rating, setRating] = useState<number>(5);
  const [feedback, setFeedback] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [customerDeviceID, setCustomerDeviceID] = useState<string>("");

  /**
   * ? On Mount
   */
  useFocusEffect(
    useCallback(() => {
      const unsubscribe = fetchCustomerDeviceID();

      return () => unsubscribe;
    }, [])
  );

  /**
   * ? Functions
   */
  const handleStarPress = (value: number) => {
    setRating(value);
  };

  const onSubmit = () => {
    setIsLoading(true);
    onSubmitFeedback();
  };

  const onSubmitFeedback = () => {
    const payload = {
      BookingRefNo: completeBookingPayload.BookingRefNo,
      ServiceProviderId: serviceProviderId,
      Stars: rating,
      Feedback: feedback,
      Image: "",
      DeviceDetails: deviceDetails,
    };

    saveFeedback(
      payload,
      (data: any) => {
        console.log("saveFeedback data:", data);
        onCompleteBooking();
        // onGetDeviceInfo();
      },
      (err) => {
        console.log("saveFeedback err:", err);
        onAlertGenericError(err);
      }
    );
  };

  const onCompleteBooking = () => {
    console.log("completeBookingPayload:", completeBookingPayload);
    completeBooking(
      completeBookingPayload,
      (data: any) => {
        setIsLoading(false);
        Alert.alert("Success", "Successfully completed this service.", [
          {
            onPress: () => {
              onGetDeviceInfo();
            },
            text: "Confirm",
          },
        ]);
      },
      (err) => {
        console.log("completeBooking err:", err);
        onAlertGenericError(err);
      }
    );
  };

  const onAlertGenericError = (err: any) => {
    setIsLoading(false);
    Alert.alert("Oops", `Something went wrong. Please try again\n${err}`, [
      {
        onPress: () => {
          NavigationService.navigate(SCREENS.HOME);
        },
        text: "Confirm",
      },
    ]);
  };

  const onGetDeviceInfo = () => {
    const payload = {
      CustomerId,
      DeviceDetails: deviceDetails,
    };
    getCustomerDeviceID(
      payload,
      (data: any) => {
        console.log("getSPDeviceInfo data:", data);
        const { PlatformOs } = data[0];

        onNotifyCustomer(PlatformOs);
      },
      (err: any) => {
        console.log("getCustomerDeviceID err:", err);
      }
    );
  };

  const onNotifyCustomer = async (platformOs: string) => {
    const { BookingRefNo } = completeBookingPayload;
    const payload = {
      DeviceId: customerDeviceID,
      Priority: "high",
      IsAndroiodDevice: platformOs === "ios" ? false : true,
      Data: {
        ScreenName: "RATING_FEEDBACK",
        Message: JSON.stringify({ BookingRefNo: `${BookingRefNo}` }),
        Remarks: "BOOKING_COMPLETED",
      },
      Notification: {
        Title: "Booking Complete",
        Body: `Your booking is completed (${moment().format("LLL")})`,
      },
    };

    sendNotification(
      payload,
      (data: any) => {
        // console.log("sendNotification data:", data);
        NavigationService.navigate(SCREENS.HOME);

        onSaveNotificationLogs(
          serviceProviderId.toString(),
          CustomerId.toString(),
          JSON.stringify(payload),
          JSON.stringify(data)
        );
      },
      (err: any) => {
        console.log("err:", err);
        onAlertGenericError(err);

        onSaveNotificationLogs(
          serviceProviderId.toString(),
          CustomerId.toString(),
          JSON.stringify(payload),
          JSON.stringify(err)
        );
      }
    );

    // NavigationService.goBack();
  };

  const onSaveNotificationLogs = (
    Sender: string,
    Receiver: string,
    Request: any,
    Response: any
  ) => {
    const payload = {
      Sender,
      Receiver,
      Request,
      Response,
    };

    console.log("onSaveNotificationLogs payload:", payload);
    saveNotificationLogs(
      payload,
      (data: any) => {
        console.log("onSaveNotificationLogs data:", data);
      },
      (err: any) => {
        console.log("onSaveNotificationLogs err:", err);
      }
    );
  };

  const fetchCustomerDeviceID = async () => {
    setCustomerDeviceID("");
    const { CustomerId } = bookingData;
    const payload = {
      CustomerId,
      DeviceDetails: deviceDetails,
    };

    getCustomerDeviceID(
      payload,
      (data: any) => {
        // console.log("getCustomerDeviceID data:", data);
        setCustomerDeviceID(data[0]?.DeviceId);
      },
      (err: any) => {
        onAlertGenericError(err);
      }
    );
  };

  /* -------------------------------------------------------------------------- */
  /*                               Render Methods                               */
  /* -------------------------------------------------------------------------- */
  const renderHeader = (text: string, marginBottom: number) => (
    <Text h3 color="black" style={{ marginBottom, textAlign: "center" }}>
      {text}
    </Text>
  );

  const Spacer = () => <View style={{ marginVertical: 20 }} />;

  const Stars = () => (
    <View style={styles.starsContainer}>
      {STARS_NUMBER.map((rate: number) => {
        return (
          <Pressable onPress={() => handleStarPress(rate)}>
            <Icon
              name={rate <= rating ? "star" : "staro"}
              type="AntDesign"
              color={"rgba(200,170,0,1)"}
              size={40}
            />
          </Pressable>
        );
      })}
    </View>
  );

  const Feedback = () => (
    <TextInput
      ref={textRef}
      value={textRef.current}
      style={styles.input}
      onEndEditing={(value: any) => {
        const { text } = value.nativeEvent;
        textRef.current = text;
        setFeedback(text);
      }}
      autoCorrect={false}
      multiline
      numberOfLines={5}
      allowFontScaling={false}
      placeholder={"Please enter your feedback here..."}
    />
  );

  const Submit = () => (
    <View
      style={{
        flexGrow: 1,
        justifyContent: "flex-end",
      }}
    >
      <CommonButton
        text={"Submit"}
        style={styles.submitBtn}
        onPress={() => onSubmit()}
        isFetching={isLoading}
      />
    </View>
  );

  return (
    <>
      <HeaderContainer
        pageTitle="Rating and Feedback"
        navigateTo={SCREENS.BOOKING_DETAIL}
      />
      <Pressable style={styles.container} onPress={() => Keyboard.dismiss()}>
        <View style={{ flex: 1, padding: 20 }}>
          {renderHeader("Rate your Customer", 10)}
          <Stars />
          <Spacer />
          {renderHeader("Feedback", 5)}
          <Feedback />
          <Submit />
        </View>
      </Pressable>
    </>
  );
};

export default RatingFeedbackScreen;
