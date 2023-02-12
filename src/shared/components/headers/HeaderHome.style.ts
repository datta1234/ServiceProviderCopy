import { ExtendedTheme } from "@react-navigation/native";
import { ViewStyle, StyleSheet } from "react-native";
import { ImageStyle } from "react-native-fast-image";

interface Style {
  container: ViewStyle;
  content: ViewStyle;
  profileImage: ImageStyle;
  badge: ViewStyle;
}

export default (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create<Style>({
    container: {
      backgroundColor: "white",
      paddingHorizontal: 20,
      justifyContent: "center",
      height: 60,
    },
    content: {
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    profileImage: {
      height: 60,
      width: 60,
      borderRadius: 30,
    },
    badge: {
      position: "absolute",
      top: -2,
      right: -3,
      height: 12,
      width: 12,
      borderRadius: 12 / 2,
      backgroundColor: "red",
      justifyContent: "center",
      alignItems: "center",
      paddingBottom: 1,
    },
  });
};
