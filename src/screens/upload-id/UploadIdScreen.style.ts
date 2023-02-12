import { ExtendedTheme } from "@react-navigation/native";
import { v2Colors } from "@theme/themes";
import { ViewStyle, StyleSheet } from "react-native";
import { ImageStyle } from "react-native-fast-image";

interface Style {
  container: ViewStyle;
  leftIcon: ImageStyle;
  button: ViewStyle;
  imageContainer: ViewStyle;
  imageBox: ImageStyle;

  buttonContainer: ViewStyle;
}

export default (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create<Style>({
    container: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: "10%",
      backgroundColor: "white",
    },
    leftIcon: {
      height: 18,
      width: 18,
      marginTop: 18,
      marginRight: 8,
    },
    button: {
      backgroundColor: v2Colors.highlight,
      alignItems: "center",
      paddingVertical: 16,
      marginHorizontal: 60,
      borderRadius: 60,
    },
    imageContainer: {
      marginTop: 30,
      marginBottom: 50,
      alignItems: "center",
    },
    imageBox: {
      width: 300,
      height: 300,
    },

    buttonContainer: {
      flexGrow: 1,
      justifyContent: "flex-end",
      marginBottom: 30,
    },
  });
};
