import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  GiftedChat,
  Bubble,
  MessageText,
  Composer,
  InputToolbar,
  Send,
} from "react-native-gifted-chat";
import database from "@react-native-firebase/database";
import notifee from "@notifee/react-native";
import moment from "moment";
import * as _ from "lodash";
import { useKeyboard } from "@react-native-community/hooks";

import styles from "./styles";
import { RootState } from "../../../../../../store";
import { useBooking } from "@services/hooks/useBooking";
import { useSystem } from "@services/hooks/useSystem";
import { Alert, TouchableOpacity, View } from "react-native";

/**
 * ? SVGs
 */
import SEND from "@assets/v2/chat/icons/send.svg";
import X_RED from "@assets/v2/chat/icons/x-red.svg";
import { isAndroid } from "@freakycoder/react-native-helpers";
import { v2Colors } from "@theme/themes";
import fonts from "@fonts";

interface ICustomChatComponent {
  CustomerId: any;
  Cinfo: { DeviceId: string; PlatformOs: string };
  bookingItem: any;
  setInitChat: Function;
  setSnapPoint: Function;
}

interface IPureGiftedChatComponent {
  messages: any;
  onSend: any;
  renderBubble: any;
  renderMessageText: any;
  renderInputToolbar: any;
  renderComposer: any;
  renderSend: any;
}

class PureGiftedChatComponent extends React.PureComponent<IPureGiftedChatComponent> {
  render() {
    const {
      messages,
      onSend,
      renderBubble,
      renderMessageText,
      renderInputToolbar,
      renderComposer,
      renderSend,
    } = this.props;

    return (
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: 1,
        }}
        infiniteScroll
        renderBubble={renderBubble}
        renderMessageText={renderMessageText}
        renderInputToolbar={renderInputToolbar}
        renderComposer={renderComposer}
        renderSend={renderSend}
        placeholder={"Enter Message"}
        minInputToolbarHeight={60}
        keyboardShouldPersistTaps={"never"}
      />
    );
  }
}

const CustomChatComponent: React.FC<ICustomChatComponent> = ({
  CustomerId,
  Cinfo,
  bookingItem,
  setInitChat,
  setSnapPoint,
}) => {
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

  /**
   * ? States
   */
  const [messages, setMessages] = useState<Array<any>>([]);
  const keyboard = useKeyboard();
  const { keyboardShown, keyboardHeight } = keyboard;

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
  }, [receivedChatInfo]);

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
        console.log("User data: ", snapshot.val());
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
              // avatar: "https://placeimg.com/140/140/any",
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

  const renderBubble = (props: any) => (
    <Bubble
      {...props}
      wrapperStyle={{
        left: {
          backgroundColor: v2Colors.lightGreen,
        },
        right: {
          backgroundColor: v2Colors.green,
        },
      }}
    />
  );

  const renderMessageText = (props: any) => (
    <MessageText
      {...props}
      textStyle={{
        left: { color: v2Colors.green, fontFamily: fonts.lexend.regular },
        right: { color: "white", fontFamily: fonts.lexend.regular },
      }}
      customTextStyle={{ fontSize: 16, lineHeight: 24 }}
    />
  );

  const renderInputToolbar = (props: any) => (
    <InputToolbar
      {...props}
      containerStyle={{
        width: "85%",
        borderRadius: 7,
        backgroundColor: "#FFFFFF",
        paddingHorizontal: 10,
        marginHorizontal: 14,
        marginBottom: 5,
        alignItems: "center",
        borderWidth: 1,
        borderColor: v2Colors.border,

        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 1,
      }}
      primaryStyle={{ alignItems: "center" }}
    />
  );

  const renderComposer = (props: any) => (
    <Composer
      {...props}
      textInputStyle={{
        fontFamily: fonts.lexend.regular,
        fontSize: 16,
        color: v2Colors.gray,
      }}
    />
  );

  const renderSend = (props: any) => (
    <Send
      {...props}
      disabled={!props.text}
      containerStyle={{
        width: 44,
        height: 44,
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 4,
      }}
    >
      <SEND />
    </Send>
  );

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => {
          setInitChat(false);
          setSnapPoint(0);
        }}
      >
        <X_RED />
      </TouchableOpacity>
      <PureGiftedChatComponent
        messages={messages}
        onSend={onSend}
        renderBubble={renderBubble}
        renderMessageText={renderMessageText}
        renderInputToolbar={renderInputToolbar}
        renderComposer={renderComposer}
        renderSend={renderSend}
      />

      {keyboardShown && isAndroid && (
        <View style={{ height: keyboardHeight + 40 }} />
      )}
    </View>
  );
};
export default CustomChatComponent;
