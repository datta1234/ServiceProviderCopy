import { ExtendedTheme } from "@react-navigation/native";
import { ViewStyle, StyleSheet } from "react-native";

interface Style {
  container: ViewStyle;
  modal: ViewStyle;
  content: ViewStyle;
  header: ViewStyle;
  body: ViewStyle;
  buttonContainer: ViewStyle;
  button1: ViewStyle;
  button2: ViewStyle;
  singleBtn: ViewStyle;
}

export default (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create<Style>({
    container: {
      flex: 1,
    },
    modal: {
      flexGrow: 1,
      justifyContent: "flex-end",
      margin: 0,
    },
    content: {
      backgroundColor: "#fff",
      minHeight: "30%",
      borderRadius: 10,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingTop: 20,
      paddingHorizontal: 20,
      paddingBottom: 10,
      borderBottomWidth: 3,
      borderBottomColor: "rgba(0,0,0,0.1)",
    },
    body: {
      flexGrow: 1,
      paddingHorizontal: 20,
      paddingTop: 20,
    },
    buttonContainer: {
      flex: 1,
      justifyContent: "center",
      flexDirection: "row",
      paddingBottom: 20,
      zIndex: 2,
    },
    button1: {
      backgroundColor: "black",
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 30,
      borderRadius: 5,
      zIndex: 500,
      marginRight: 10,
      flexDirection: "row",
      height: 40,
    },
    button2: {
      borderWidth: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 30,
      borderRadius: 5,
      zIndex: 500,
      marginLeft: 10,
      flexDirection: "row",
      height: 40,
    },
    singleBtn: {
      backgroundColor: "black",
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 30,
      height: 50,
      borderRadius: 5,
      zIndex: 500,
      marginRight: 10,
      flexDirection: "row",
    },
  });
};
