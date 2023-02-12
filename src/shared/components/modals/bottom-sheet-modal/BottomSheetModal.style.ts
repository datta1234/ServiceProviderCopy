import { ExtendedTheme } from "@react-navigation/native";
import { ViewStyle, StyleSheet, Platform } from "react-native";

interface Style {
  container: ViewStyle;
  modal: ViewStyle;
  content: ViewStyle;
  contentContainer: ViewStyle;
  header: ViewStyle;
  body: ViewStyle;
}

export default (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create<Style>({
    container: {
      flex: 1,
    },
    modal: {
      justifyContent: "flex-end",
      margin: 0,
    },
    content: {
      flex: 1,
    },
    contentContainer: {
      height: "100%",
      backgroundColor: "#fff",
    },
    header: {
      alignItems: "center",
      backgroundColor: colors.lightGray,
      marginHorizontal: 20,
      paddingVertical: 10,
      borderColor: "black",
      borderRadius: 10,

      shadowColor: "rgba(0,0,0, .4)", // IOS
      shadowOffset: { height: 1, width: 1 }, // IOS
      shadowOpacity: 1, // IOS
      shadowRadius: 1, //IOS
      elevation: 5, // Android
    },
    body: {
      flex: 1,
      marginLeft: 30,
    },
  });
};
