import { ExtendedTheme } from "@react-navigation/native";
import { ViewStyle, StyleSheet } from "react-native";

interface Style {
  container: ViewStyle;
  item: ViewStyle;
  column_1: ViewStyle;
  column_2: ViewStyle;
  chatCountContainer: ViewStyle;
}

export default (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create<Style>({
    container: {
      flex: 1,
    },
    item: {
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottomColor: "rgba(0,0,0,0.1)",
      borderBottomWidth: 1,
      paddingTop: 6,
    },
    column_1: { marginBottom: 10, width: "65%" },
    column_2: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    chatCountContainer: {
      position: "absolute",
      top: -6,
      right: -20,
      backgroundColor: "red",
      height: 18,
      width: 18,
      borderRadius: 18 / 2,
      justifyContent: "center",
      alignItems: "center",
    },
  });
};
