import { ViewStyle, StyleSheet, NativeModules, Dimensions } from "react-native";
import { ExtendedTheme } from "@react-navigation/native";
import { v2Colors } from "@theme/themes";
import { ImageStyle } from "react-native-fast-image";

const { StatusBarManager } = NativeModules;
const { width } = Dimensions.get("window");

interface Style {
  parentContainer: ViewStyle;
  container: ViewStyle;

  earningsContainer: ViewStyle;
  earningsLeftContainer: ViewStyle;
  earningsRightContainer: ViewStyle;

  analyticsContainer: ViewStyle;
  analyticsHeaderContainer: ViewStyle;
  analyticsTopRow: ViewStyle;
  analyticsBotRow: ViewStyle;
  analyticsItem: ViewStyle;
  analyticsVerticalSeparator: ViewStyle;

  pendingBookingsContainer: ViewStyle;
  pendingDateHeaderContainer: ViewStyle;
  pendingDateHeaderItem: ViewStyle;
  activeDateHeaderItem: ViewStyle;
  listContainer: ViewStyle;
  item: ViewStyle;
  itemHeaderContainer: ViewStyle;
  itemLeftContainer: ViewStyle;

  onlineSwitchContainer: ViewStyle;
  onlineSwitch: ImageStyle;
  statusContainer: ViewStyle;
}

export default (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create<Style>({
    parentContainer: {
      flex: 1,
      paddingTop: StatusBarManager.HEIGHT,
    },

    container: {
      flex: 1,
      paddingHorizontal: 10,
    },

    earningsContainer: {
      marginHorizontal: 10,
      padding: 10,
      backgroundColor: v2Colors.green,
      borderRadius: 7,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    earningsLeftContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    earningsRightContainer: {
      flexDirection: "row",
      alignItems: "center",
    },

    analyticsContainer: {
      borderWidth: 1.5,
      borderColor: v2Colors.border,
      borderRadius: 7,
      marginTop: 20,
      marginHorizontal: 10,
    },
    analyticsHeaderContainer: {
      padding: 14,
      flexDirection: "row",
      justifyContent: "space-between",
      borderBottomWidth: 1.5,
      borderBottomColor: v2Colors.border,
    },
    analyticsTopRow: {
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      borderBottomWidth: 1.5,
      borderBottomColor: v2Colors.border,
    },
    analyticsBotRow: {
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
    },
    analyticsItem: {
      justifyContent: "center",
      alignItems: "center",
      width: "50%",
      paddingVertical: 14,
    },
    analyticsVerticalSeparator: {
      borderRightWidth: 1.5,
      borderRightColor: v2Colors.border,
    },

    pendingBookingsContainer: {
      marginTop: 20,
      marginHorizontal: 10,
      height: 500,
    },
    pendingDateHeaderContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      marginTop: 10,
    },
    pendingDateHeaderItem: {
      paddingVertical: 14,
      backgroundColor: "white",
      borderWidth: 1.5,
      borderColor: v2Colors.highlight,
      borderRadius: 60,
      width: width * 0.25,
      alignItems: "center",
    },
    activeDateHeaderItem: {
      paddingVertical: 14,
      backgroundColor: v2Colors.highlight,
      borderRadius: 60,
      alignItems: "center",
      width: width * 0.25,
    },
    listContainer: {
      flex: 1,
    },
    item: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 8,
      borderBottomWidth: 1.5,
      borderBottomColor: v2Colors.border,
    },
    itemHeaderContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    itemLeftContainer: {
      width: "85%",
    },

    onlineSwitchContainer: {
      position: "absolute",
      height: 140,
      width: 140,
      bottom: -50,
      alignSelf: "center",
    },
    onlineSwitch: {
      height: 60,
    },
    statusContainer: {
      backgroundColor: v2Colors.highlight,
      position: "absolute",
      bottom: 0,
      width: "100%",
      alignItems: "center",
      paddingVertical: 4,
    },
  });
};
