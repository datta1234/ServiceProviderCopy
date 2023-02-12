import { ExtendedTheme } from "@react-navigation/native";
import { v2Colors } from "@theme/themes";
import { ViewStyle, StyleSheet, TextStyle } from "react-native";

interface Style {
  container: ViewStyle;

  viewOnTop: ViewStyle;

  headerContainer: ViewStyle;
  headerTopLeftContent: ViewStyle;
  statusContainer: ViewStyle;
  headerMidContent: ViewStyle;
  headerBottomContent: ViewStyle;
  squareContainer: ViewStyle;

  commsActionsContainer: ViewStyle;

  bottomContainer: ViewStyle;
  item: ViewStyle;
  bottomSheetContainer: ViewStyle;
  customTextInput: ViewStyle;

  completeButtonContainer: ViewStyle;
}

export default (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create<Style>({
    container: {
      flex: 1,
      backgroundColor: "white",
    },

    viewOnTop: {
      position: "absolute",
      height: "100%",
      width: "100%",
      backgroundColor: v2Colors.green,
      opacity: 0.75,
    },

    headerContainer: {
      backgroundColor: v2Colors.lightGreen,
      marginHorizontal: 20,
      borderRadius: 10,
      padding: 20,
      marginBottom: 20,
    },
    headerTopLeftContent: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    statusContainer: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: v2Colors.orange,
      borderRadius: 60,
      marginBottom: 20,
    },
    headerMidContent: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    headerBottomContent: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: 10,
    },
    squareContainer: {
      height: 50,
      width: "47%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "white",
      borderRadius: 7,
    },

    commsActionsContainer: {
      position: "absolute",
      bottom: 20,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      alignSelf: "center",
    },

    item: {
      flexDirection: "row",
      marginBottom: 10,
      borderBottomWidth: 1,
      paddingBottom: 10,
      paddingTop: 5,
      borderBottomColor: "rgba(0,0,0,0.04)",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 20,
    },
    bottomContainer: {
      flex: 1,
      justifyContent: "flex-end",
      paddingHorizontal: 20,
      paddingBottom: 20,
    },
    bottomSheetContainer: {
      flex: 1,
      alignItems: "center",
    },
    customTextInput: {
      borderTopWidth: 0.5,
      borderTopColor: "rgba(0,0,0,0.5)",

      paddingBottom: 100,
      paddingHorizontal: 20,
    },

    completeButtonContainer: {
      backgroundColor: v2Colors.green,
      paddingVertical: 20,
      paddingHorizontal: 20,
      borderRadius: 60,
      marginBottom: 6,
    },
  });
};
