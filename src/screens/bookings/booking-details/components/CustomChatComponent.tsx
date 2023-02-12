import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { GiftedChat } from "react-native-gifted-chat";
import database from "@react-native-firebase/database";
import notifee from "@notifee/react-native";
import moment from "moment";
import * as _ from "lodash";

import { RootState } from "../../../../../store";
import { useBooking } from "@services/hooks/useBooking";
import { useSystem } from "@services/hooks/useSystem";
import { Alert } from "react-native";

interface IFetch {
  CustomerId: any;
  Cinfo: { DeviceId: string; PlatformOs: string };
  bookingItem: any;
}

const Fetch: React.FC<IFetch> = ({ CustomerId, Cinfo, bookingItem }) => {
  const { BookingRefNo } = bookingItem;
  /**
   * ? Hooks
   */
  const { sendNotification } = useBooking();
  const { saveNotificationLogs } = useSystem();

  /**
   * ? Redux States
   */
  const { info, serviceProviderId } = useSelector(
    (state: RootState) => state.user
  );
  const { Firstname } = info;
  const { receivedChatInfo } = useSelector((state: RootState) => state.system);
  const { _id } = receivedChatInfo;

  /**
   * ? States
   */
  const [messages, setMessages] = useState<Array<any>>([]);

  /**
   * ? Variables
   */
  const onSend = useCallback((messages = []) => {
    const { text, _id } = messages[0];
    setMessages((previousMessages: any) => {
      onSendChatNotif(text, _id);
      onGetCustomerChatCount(false);
      onGetSPChatCount(false);
      onSetChatData(text, _id);
      return GiftedChat.append(previousMessages, messages);
    });
  }, []);

  /**
   * ? Watchers
   */
  // ? Handles fetch of all chats when in app
  useEffect(() => {
    if (!CustomerId || !serviceProviderId || !Firstname) return;

    onGetCustomerChatCount(true);
    onGetSPChatCount(true);
    onGetChatMessages();
  }, []);

  useEffect(() => {
    onGetChatMessages();
  }, [_id]);

  /**
   * ? Functions
   */

  const onSendChatNotif = (text: string, _id: string) => {
    const { DeviceId, PlatformOs } = Cinfo;

    const notifPayload = {
      DeviceId,
      Priority: "high",
      IsAndroiodDevice: PlatformOs === "android" ? true : false,
      Data: {
        ScreenName: "BOOKING_CHAT",
        Message: JSON.stringify({
          text,
          _id,
          bookingItem,
        }),
        Remarks: "",
      },
      Notification: {
        Title: Firstname,
        Body: text,
      },
    };
    console.log("onSendChatNotif payload:", notifPayload);
    sendNotification(
      notifPayload,
      (data) => {
        console.log("onSendChatNotif data:", data);
        // onSaveNotificationLogs(
        //   serviceProviderId.toString(),
        //   CustomerId.toString(),
        //   JSON.stringify(notifPayload),
        //   JSON.stringify(data)
        // );
      },
      (err) => {
        console.log("onSendChatNotif err:", err);
        Alert.alert("Chat", "Something went wrong, please try again.");
        // onSaveNotificationLogs(
        //   serviceProviderId.toString(),
        //   CustomerId.toString(),
        //   JSON.stringify(notifPayload),
        //   JSON.stringify(err)
        // );
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

  const onGetCustomerChatCount = (onMount: boolean) => {
    database()
      .ref(`/chat_count/customer/${CustomerId}/${BookingRefNo}`)
      .once("value")
      .then((snapshot) => {
        const data = snapshot.val();
        // console.log("data:", data);

        // when 1st time reset for customer
        if (!data && onMount) return onSaveCustomerChat(0, 0, onMount);
        // when 1st time sending chat -> chat count is 1
        if (!data && !onMount) return onSaveCustomerChat(0, 1, onMount);

        // when there is data in firebase
        const { c_count, s_count } = data;
        // decreases chat app badge count when count is more than 0
        if (c_count > 0 && onMount) onDecrementAppBadgeCount(c_count);

        // reset for customer
        if (onMount) onSaveCustomerChat(0, s_count, onMount);
        // when sending chat -> chat count + 1
        if (!onMount) onSaveCustomerChat(c_count, s_count, onMount);
      });
  };
  const onSaveCustomerChat = (
    c_count: number,
    s_count: number,
    mounted: boolean
  ) => {
    database()
      .ref(`/chat_count/customer/${CustomerId}/${BookingRefNo}`)
      .set({
        c_count,
        s_count: mounted ? s_count : s_count + 1,
      })
      .then(() => console.log("onSaveCustomerChat Data set."));
  };

  const onGetSPChatCount = (onMount: boolean) => {
    database()
      .ref(`/chat_count/service-provider/${serviceProviderId}/${BookingRefNo}`)
      .once("value")
      .then((snapshot) => {
        const data = snapshot.val();
        // console.log("data:", data);

        if (!data && onMount) return onSaveServiceProviderChat(0, 0, onMount);
        // when 1st time sending chat -> chat count is 1
        if (!data && !onMount) return onSaveServiceProviderChat(0, 1, onMount);

        // when there is data in firebase
        const { c_count, s_count } = data;
        // decreases chat app badge count when count is more than 0
        if (c_count > 0 && onMount) onDecrementAppBadgeCount(c_count);

        if (onMount) onSaveServiceProviderChat(0, s_count, onMount);
        // when sending chat -> chat count + 1hi
        if (!onMount) onSaveServiceProviderChat(c_count, s_count, onMount);
      });
  };
  const onSaveServiceProviderChat = (
    c_count: number,
    s_count: number,
    mounted: boolean
  ) => {
    database()
      .ref(`/chat_count/service-provider/${serviceProviderId}/${BookingRefNo}`)
      .set({
        c_count,
        s_count: mounted ? s_count : s_count + 1,
      })
      .then(() => console.log("onSaveServiceProviderChat Data set."));
  };

  const onDecrementAppBadgeCount = (refCount: number) => {
    notifee
      .decrementBadgeCount(refCount)
      .then(() => notifee.getBadgeCount())
      .then((count) =>
        console.log(`Badge count decremented by ${refCount} to:`, count)
      );
  };

  const onGetChatMessages = () => {
    database()
      .ref(`/chats/${BookingRefNo}`)
      .once("value")
      .then((snapshot) => {
        // console.log("User data: ", snapshot.val());
        const data = snapshot.val();

        let newArray: Array<any> = [];

        if (!_.size(data)) return;
        Object?.keys(data).forEach(function (key) {
          const item = data[key];
          const { sender, text, type, createdAt, _id } = item;

          const formedMessage = {
            _id,
            text,
            createdAt: JSON.parse(createdAt) || "",
            user: {
              _id: type === "S" ? 1 : 2,
              name: sender,
              avatar: "https://placeimg.com/140/140/any",
            },
          };
          newArray.push(formedMessage);
        });

        const sortedArray: Array<any> = newArray.sort(
          (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
        );
        setMessages(sortedArray);
      });
  };

  const onSetChatData = (text: string, _id: string) => {
    const formedData = {
      sender: Firstname,
      type: "S",
      createdAt: JSON.stringify(moment()),
      text,
      _id,
    };

    const newReference = database().ref(`/chats/${BookingRefNo}`).push();
    newReference.set(formedData).then(() => console.log("Data updated."));
  };

  return (
    <GiftedChat
      messages={messages}
      onSend={(messages) => onSend(messages)}
      user={{
        _id: 1,
      }}
      infiniteScroll
    />
  );
};
export default Fetch;
