import "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import { StatusBar, useColorScheme, LogBox, View } from "react-native";
import SplashScreen from "react-native-splash-screen";
import { QueryClient, QueryClientProvider } from "react-query";
import { Provider } from "react-redux";
import { getStatusBarHeight } from "@freakycoder/react-native-helpers";
import { SafeAreaProvider } from "react-native-safe-area-context";

/**
 * ? Local Imports
 */
import Navigation from "./src/services/navigation";
import { isAndroid } from "@freakycoder/react-native-helpers";
import { store } from "./store";
import LocationEnabler from "shared/functions/LocationEnabler";
import ChatCountHandler from "shared/functions/ChatCountHandler";

import CenterModal from "@shared-components/modals/center-modal/CenterModal";
import NotificationHandler from "shared/functions/NoficationHandler";
import BackgroundActivityHandler from "shared/functions/BackgroundActivityHandler";

export const queryClient = new QueryClient();

LogBox.ignoreAllLogs();
LogBox.ignoreLogs([
  "[react-native-gesture-handler] Seems like you're using an old API with gesture components, check out new Gestures system!",
]);
LogBox.ignoreLogs(["Require cycle:"]);
LogBox.ignoreLogs([
  "Require cycles are allowed, but can result in uninitialized values. Consider refactoring to remove the need for a cycle.",
]);

const App = () => {
  const scheme = useColorScheme();
  const isDarkMode = scheme === "dark";

  const [_, setRemoteData] = useState<any>();
  const [actionName, setActionName] = useState<string>("");
  const [withActionCancel, setWithActionCancel] = useState<boolean>(false);
  const [didReceiveNotif, setDidReceiveNotif] = useState<boolean>(false);

  const [showNotifModal, setShowNotifModal] = useState<boolean>(false);
  const [notifData, setNotifData] = useState<{
    title: string | undefined;
    body: string | undefined;
    onPress1?: any;
    onPress2?: any;
  }>({
    title: "",
    body: "",
    onPress1: () => {},
    onPress2: () => {},
  });

  useEffect(() => {
    StatusBar.setBarStyle(isDarkMode ? "light-content" : "dark-content");
    if (isAndroid) {
      StatusBar.setBackgroundColor("rgba(0,0,0,0)");
      StatusBar.setTranslucent(true);
    }

    setTimeout(() => {
      SplashScreen.hide();
    }, 500);
  }, [scheme]);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <SafeAreaProvider>
            <Navigation />

            {/** location enabler broken package - comment when using ios / uncomment when using android */}
            {/* <LocationEnabler /> */}

            <BackgroundActivityHandler />
            <NotificationHandler
              setNotifData={setNotifData}
              setRemoteData={setRemoteData}
              setShowNotifModal={setShowNotifModal}
              setActionName={setActionName}
              setWithActionCancel={setWithActionCancel}
              setDidReceiveNotif={setDidReceiveNotif}
              action={actionName}
            />
            <ChatCountHandler
              didReceiveNotif={didReceiveNotif}
              setDidReceiveNotif={setDidReceiveNotif}
            />
          </SafeAreaProvider>
        </Provider>
      </QueryClientProvider>

      <CenterModal
        isVisible={showNotifModal}
        setIsVisible={setShowNotifModal}
        title={notifData.title}
        body={notifData.body}
        onPress1={notifData.onPress1}
        onPress2={notifData.onPress2}
        onCancel={notifData.onPress2}
        buttonText1={withActionCancel ? "Accept" : "Go to Booking Detail"}
        withActionCancel={withActionCancel}
        isTimerEnabled={withActionCancel}
      />
    </>
  );
};

export default App;
