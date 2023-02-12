import { useEffect } from "react";
import messaging from "@react-native-firebase/messaging";
import { useDispatch, useSelector } from "react-redux";
import * as NavigationService from "react-navigation-helpers";
import AsyncStorage from "@react-native-community/async-storage";
import notifee from "@notifee/react-native";

import { SCREENS } from "@shared-constants";
import { bookingActions } from "@services/states/booking/booking.slice";
import { RootState } from "../../../store";
import { useBooking } from "@services/hooks/useBooking";
import { AUTHENTICATION } from "@shared-constants";
import { isAndroid } from "@freakycoder/react-native-helpers";
import { systemActions } from "@services/states/system/system.slice";
import { useSystem } from "@services/hooks/useSystem";

interface INotificationHandler {
  setNotifData: any;
  setRemoteData: any;
  setShowNotifModal: any;
  setActionName: any;
  setWithActionCancel: any;
  setDidReceiveNotif: any;
  action?: string;
}

const NotificationHandler: React.FC<INotificationHandler> = ({
  setNotifData,
  setRemoteData,
  setShowNotifModal,
  setActionName,
  setWithActionCancel,
  setDidReceiveNotif,
  // action,
}) => {
  const dispatch = useDispatch();
  const { SPID } = AUTHENTICATION;

  /**
   * ? Hooks
   */
  const {
    pushSPBookingStatus,
    sendNotification,
    cancelBooking,
    getBookingHistory,
  } = useBooking();
  const { saveNotificationLogs } = useSystem();

  /**
   * ? Actions
   */
  const { onSetGoToScreen, onSetBookingItem } = bookingActions;
  const { onSetReceivedChatInfo } = systemActions;

  /**
   * ? Redux States
   */
  const { serviceProviderId, deviceDetails, appState } = useSelector(
    (state: RootState) => state.user
  );

  // ? When app is in background or closed
  messaging().setBackgroundMessageHandler(async (remoteMessage: any) => {
    // console.log("Message handled in the background!", remoteMessage);

    const { notification, data } = remoteMessage;
    // const { title, body } = notification;
    const { ScreenName, Message } = data;
    dispatch(onSetGoToScreen(ScreenName));
    dispatch(onSetBookingItem(JSON.parse(Message)?.bookingItem));

    if (ScreenName === "HOME") {
      onSetModalOnDemand(notification, data);
      setShowNotifModal(true);
    }

    if (ScreenName === "BOOKING_CHAT") handleReceivedChat(data, true);

    // onDisplayNotification(title, body);
  });

  // ? When in app
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage: any) => {
      // console.log("remoteMessage:", remoteMessage);

      const { data, notification } = remoteMessage;
      const { ScreenName, Message } = remoteMessage.data;
      setRemoteData(data);

      if (data?.ScreenName === "BOOKING_CHAT") {
        return handleReceivedChat(data, false);
      }
      // handling for cancel, reschedule, dispute notification
      if (ScreenName === "BOOKING_DETAILS") {
        onDisplayNotification("LawnQ", notification?.body);
        return;
      }
      if (ScreenName === "BOOKING_DETAIL") {
        onSetProcessScheduled(notification, Message, ScreenName);
        setShowNotifModal(true);
        return;
      }

      if (ScreenName !== "BOOKING_DETAIL") {
        setWithActionCancel(true);
        onSetModalOnDemand(notification, data);
        return;
      }
    });

    return unsubscribe;
  }, []);

  /**
   * ? Functions
   */
  const onSetModalOnDemand = (notification: any, data: any) => {
    console.log("onSetModalOnDemand");
    setWithActionCancel(true);
    setShowNotifModal(true);
    setNotifData({
      title: notification?.title,
      body: notification?.body,
      onPress1: () => {
        setActionName("ACCEPT");
        setShowNotifModal(false);
        handleOnDemandBookingAction(data, "ACCEPT");
      },
      onPress2: () => {
        console.log("onPress2");
        setActionName("CANCEL");
        setShowNotifModal(false);
        handleOnDemandBookingAction(data, "CANCEL");
      },
    });
  };

  const onSetProcessScheduled = (
    notification: any,
    Message: any,
    ScreenName: string
  ) => {
    console.log("onSetProcessScheduled");
    setWithActionCancel(false);
    setNotifData({
      title: notification?.title,
      body: notification?.body,
      onPress1: () => {
        setShowNotifModal(false);
        dispatch(onSetBookingItem(JSON.parse(Message)?.bookingItem));
        NavigationService.navigate(SCREENS[`${ScreenName}`]);
      },
      onPress2: () => {},
    });
  };

  /**
   * ? On Demand Booking Handlers
   */
  const handleOnDemandBookingAction = async (
    thisData: any,
    thisAction: string
  ) => {
    if (!!thisAction) {
      const parsedData = await JSON.parse(thisData.Message);
      const { bookingRefNo, CustomerId } = parsedData;

      const payload = {
        ServiceProviderId: await AsyncStorage.getItem(SPID),
        CustomerId,
        BookingRefNo: bookingRefNo || "00",
        BookingStatus: thisAction,
        DeviceDetails: deviceDetails,
      };

      console.log("pushSPBookingStatus payload:", payload);
      pushSPBookingStatus(
        payload,
        (pushSPBookingdata: any) => {
          console.log("pushSPBookingStatus data:", pushSPBookingdata);

          if (thisAction === "CANCEL")
            _cancelBooking(pushSPBookingdata[0], thisData);
          else
            _sendNotificationToCustomer(
              pushSPBookingdata[0],
              thisData,
              "ACCEPT"
            );
        },
        (err) => {
          console.log("pushSPBookingStatus err:", err);
        }
      );
    }
  };

  const _cancelBooking = async (thisData: any, data: any) => {
    const cancelPayload = {
      ServiceProviderId: await AsyncStorage.getItem(SPID),
      BookingRefNo: JSON.parse(data.Message).bookingRefNo || "00",
      Remarks: "None",
      DeviceDetails: deviceDetails,
    };

    cancelBooking(
      cancelPayload,
      (cancelBookingdata: any) => {
        console.log("cancelBooking data:", cancelBookingdata);
        _sendNotificationToCustomer(thisData, data, "CANCEL");
      },
      (err) => {
        console.log("cancelBooking err:", err);
      }
    );
  };

  const _sendNotificationToCustomer = async (
    thisData: any,
    data: any,
    action: string
  ) => {
    console.log("_sendNotificationToCustomer thisData:", thisData);
    console.log("_sendNotificationToCustomer data:", data);
    const parsedMessage = await JSON.parse(data.Message);
    const { CustomerId } = parsedMessage;
    const ServiceProviderId = (await AsyncStorage.getItem(SPID)) || "0";

    const { CustomerDeviceId } = thisData;
    const notifPayload = {
      DeviceId: CustomerDeviceId,
      Priority: "high",
      IsAndroiodDevice: isAndroid,
      Data: {
        ScreenName: "",
        Message: JSON.stringify({
          action,
          bookingRefNo: JSON.parse(data.Message)?.bookingRefNo || "00",
          CustomerLatitude: JSON.parse(data.Message)?.CustomerLatitude,
          CustomerLongitude: JSON.parse(data.Message)?.CustomerLongitude,
        }),
        Remarks: "NO_NOTIF",
      },
      Notification: {
        Title: "Booking Status",
        Body:
          action === "ACCEPT"
            ? `Your booking has been accepted\nBooking Reference Number: ${
                JSON.parse(data.Message)?.bookingRefNo || "00"
              }`
            : "Your booking has been declined",
      },
    };

    console.log("notifPayload:", notifPayload);
    sendNotification(
      notifPayload,
      (notifData) => {
        console.log("sendNotification data:", notifData);
        fetchBookingHistory(data);
        // NavigationService.navigate(SCREENS.BOOKING_DETAIL, { data });

        onSaveNotificationLogs(
          ServiceProviderId.toString(),
          CustomerId.toString(),
          JSON.stringify(notifPayload),
          JSON.stringify(data)
        );
      },
      (err) => {
        console.log("err from notification:", err);

        onSaveNotificationLogs(
          ServiceProviderId.toString(),
          CustomerId.toString(),
          JSON.stringify(notifPayload),
          JSON.stringify(err)
        );
      }
    );
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

  /**
   * ? Other functions
   */
  const fetchBookingHistory = async (data: any) => {
    console.log("fetchBookingHistory");
    const payload = {
      ServiceProviderId: await AsyncStorage.getItem(SPID),
      BookingRefNo: JSON?.parse(data.Message).bookingRefNo,
      DeviceDetails: deviceDetails,
    };
    console.log("fetchBookingHistory payload:", payload);

    getBookingHistory(
      payload,
      (data: any) => {
        console.log("getBookingHistory data:", data);
        dispatch(onSetBookingItem(data[0]));
        NavigationService.navigate(SCREENS.BOOKING_DETAIL);
      },
      (error) => {
        console.log("error:", error);
      }
    );
  };

  const handleReceivedChat = (data: { Message: string }, navigate: boolean) => {
    console.log("handleReceivedChat");
    const { text, _id, bookingItem } = JSON.parse(data?.Message);

    setDidReceiveNotif(true);

    dispatch(
      onSetReceivedChatInfo({
        text,
        show: navigate,
        _id,
      })
    );
    if (navigate) {
      dispatch(onSetBookingItem(bookingItem));
      dispatch(onSetGoToScreen("BOOKING_DETAIL"));
      if (appState === "background")
        NavigationService.navigate(SCREENS.BOOKING_DETAIL);
      else onDisplayNotification("Chat", text);
    } else onDisplayNotification("Chat", text);
  };

  const onDisplayNotification = async (title: string, body: string) => {
    // Request permissions (required for iOS)
    await notifee.requestPermission();

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: "sound",
      name: "Default Channel",
      sound: "notification",
    });

    // Display a notification
    await notifee.displayNotification({
      title,
      body,
      android: {
        channelId,
        // pressAction is needed if you want the notification to open the app when pressed
        pressAction: {
          id: "default",
        },
        sound: "notification",
      },
      ios: {
        // iOS resource (.wav, aiff, .caf)
        sound: "notification.mp4",
      },
    });
  };

  return null;
};

export default NotificationHandler;
