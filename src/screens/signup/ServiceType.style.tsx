import { ExtendedTheme } from "@react-navigation/native";
import { ImageStyle } from "react-native-fast-image";
import { ViewStyle, StyleSheet, TextStyle, Platform } from "react-native";
import { v2Colors } from "@theme/themes";

interface Style {
  container: ViewStyle;
  //   titleTextStyle: TextStyle;
  //   buttonStyle: ViewStyle;
  //   buttonTextStyle: TextStyle;
  //   leftIcon: ImageStyle;
  //   rightIcon: ImageStyle;
  //   socialIcon: ImageStyle;
  //   OrContainer: ViewStyle;
  //   lineSeparator: ViewStyle;
  //   socialsContainer: ViewStyle;
  //   registerContainer: ViewStyle;
  //   errorContainer: ViewStyle;
}

export default (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create<Style>({
    container: {
      flex: 1,
      justifyContent: "center",
      
    },
  });
};
