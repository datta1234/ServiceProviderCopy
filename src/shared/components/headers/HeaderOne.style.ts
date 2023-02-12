import { ExtendedTheme } from "@react-navigation/native";
import { ViewStyle, StyleSheet } from "react-native";

interface Style {
  header: ViewStyle;
}

export default (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create<Style>({
    header: {
      height: "20%",
      justifyContent: "flex-end",
      marginBottom: 20,
      backgroundColor: colors.darkerGray,
      paddingHorizontal: "6%",
      paddingBottom: "2%",
    },
  });
};
