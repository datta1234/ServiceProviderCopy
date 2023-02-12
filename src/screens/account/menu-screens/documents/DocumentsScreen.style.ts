import { ExtendedTheme } from "@react-navigation/native";
import { v2Colors } from "@theme/themes";
import { ViewStyle, StyleSheet } from "react-native";

interface Style {
  container: ViewStyle;

  itemContainer: ViewStyle;
  itemRightContainer: ViewStyle;
  statusContainer: ViewStyle;
}

export default (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create<Style>({
    container: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 30,
      backgroundColor: "white",
    },

    itemContainer: {
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
      backgroundColor: v2Colors.backgroundGray,
      borderRadius: 7,
      paddingLeft: 30,
      paddingRight: 10,
      paddingVertical: 20,
    },
    itemRightContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    statusContainer: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 20,
    },
  });
};
