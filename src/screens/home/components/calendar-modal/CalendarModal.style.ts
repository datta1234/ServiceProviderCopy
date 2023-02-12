import { ViewStyle, StyleSheet } from "react-native";
import { ExtendedTheme } from "@react-navigation/native";
import { ScreenWidth } from "@freakycoder/react-native-helpers";

interface Style {
  modal: ViewStyle;
  content: ViewStyle;
  header: ViewStyle;
}

export default (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create<Style>({
    modal: {
        justifyContent: "flex-end",
        margin: 0,
        zIndex: 1000,
    },
    content: {
        backgroundColor: "white"
    },
    header: {
        alignSelf: 'center',
        height: 30,
        margin: 10
    }
  });
};
