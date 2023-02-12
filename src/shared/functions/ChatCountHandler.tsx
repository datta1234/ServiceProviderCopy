import React, { useCallback, useEffect } from "react";
import database from "@react-native-firebase/database";
import { useDispatch, useSelector } from "react-redux";
import notifee from "@notifee/react-native";

import { RootState } from "../../../store";
import { systemActions } from "@services/states/system/system.slice";

interface IChatCountHandlerProps {
  style?: any;
  didReceiveNotif: boolean;
  setDidReceiveNotif: any;
}

const ChatCountHandler: React.FC<IChatCountHandlerProps> = ({
  didReceiveNotif,
  setDidReceiveNotif,
}) => {
  const dispatch = useDispatch();

  /**
   * ? Actions
   */
  const { onSetTotalChatCount } = systemActions;

  /**
   * ? Redux States
   */
  const { serviceProviderId } = useSelector((state: RootState) => state.user);

  /**
   * ? Watchers
   */
  useEffect(() => {
    if (!didReceiveNotif) return;
    fetchChatCount();
  }, [didReceiveNotif]);

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
        if (!data) return;

        let countArray: Array<any> = [];
        let totalCount: number = 0;
        Object?.keys(data).forEach(function (key) {
          const item = data[key];
          const { c_count } = item;
          totalCount += c_count;
          countArray.push({ bookingRef: key, count: c_count });
        });

        // fetchBookingHistory(countArray);
        console.log("countArray:", countArray);
        // setChatTotalCount(totalCount);
        console.log("totalCount:", totalCount);
        appBadgeCountHandler(totalCount || 0);
        setDidReceiveNotif(false);
      });
  }, []);

  // ? App icon badge count handler
  const appBadgeCountHandler = (count: number) => {
    dispatch(onSetTotalChatCount(count));

    notifee
      .setBadgeCount(count)
      .then(() => console.log("Badge count removed!"));
  };

  return null;
};

export default ChatCountHandler;
