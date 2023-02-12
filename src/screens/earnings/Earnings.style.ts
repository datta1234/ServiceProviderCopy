import { ExtendedTheme } from "@react-navigation/native";
import { v2Colors } from "@theme/themes";
import { ViewStyle, StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

interface Style {
  container: ViewStyle;

  headerContainer: ViewStyle;
  contentContainer: ViewStyle;
  cashGreen: ViewStyle;
  cashoutContainer: ViewStyle;

  listContainer: ViewStyle;
  listHeaderContainer: ViewStyle;
  activelistHeaderTextContainer: ViewStyle;
  listHeaderTextContainer: ViewStyle;
  itemContainer: ViewStyle;
  leftContainer: ViewStyle;

  downloadButtonContainer: ViewStyle;
}

export default (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create<Style>({
    container: {
      flex: 1,
    },

    headerContainer: {
      marginTop: 80,
      height: 110,
      marginHorizontal: 24,
      backgroundColor: v2Colors.green,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,

      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,

      elevation: 5,
    },
    contentContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      height: "100%",
    },
    cashGreen: {
      position: "absolute",
      right: 24,
      bottom: -20,
    },
    cashoutContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 20,
      backgroundColor: v2Colors.highlight,
      paddingHorizontal: 18,
      paddingVertical: 6,
      borderRadius: 60,
      zIndex: 3,
    },

    listContainer: {
      flex: 1,
      backgroundColor: "white",
      borderTopWidth: 1.5,
      borderColor: v2Colors.border,
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,

      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,

      elevation: 5,
    },
    listHeaderContainer: {
      height: 70,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-around",
      paddingHorizontal: 20,
      borderBottomWidth: 1.5,
      borderBottomColor: v2Colors.border,
    },
    activelistHeaderTextContainer: {
      backgroundColor: v2Colors.highlight,
      // paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 20,
      width: width * 0.23,
      alignItems: "center",
    },
    listHeaderTextContainer: {
      backgroundColor: "white",
      borderWidth: 1.5,
      borderColor: v2Colors.highlight,
      // paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 20,
      width: width * 0.23,
      alignItems: "center",
    },
    itemContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingLeft: 10,
      paddingRight: 20,
      paddingVertical: 20,
    },
    leftContainer: {
      position: "absolute",
      height: 110,
      width: 2,
      backgroundColor: v2Colors.green,
    },

    downloadButtonContainer: {
      position: "absolute",
      bottom: 30,
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "center",
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 30,
      backgroundColor: v2Colors.green,
    },
  });
};
