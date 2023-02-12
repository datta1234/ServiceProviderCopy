import React, { useEffect } from "react";
import PushNotification from "react-native-push-notification";

interface IAppIconCountHandler {
  x?: any;
}

const AppIconCountHandler: React.FC<IAppIconCountHandler> = () => {
  useEffect(() => {
    console.log("number");
    PushNotification.setApplicationIconBadgeNumber(1);
  }, []);

  return null;
};
export default AppIconCountHandler;
