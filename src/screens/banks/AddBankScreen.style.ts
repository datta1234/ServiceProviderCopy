import { ExtendedTheme } from "@react-navigation/native";
import { ViewStyle, StyleSheet, ImageStyle } from "react-native";

interface Style {
  container: ViewStyle;
  leftIcon: ImageStyle;
  button: ViewStyle;
  imageContainer: ViewStyle;
  imageBox: ImageStyle;

  buttonContainer: ImageStyle;
}

export default (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create<Style>({
    container: {
      flex: 1,
      flexDirection: "column",
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
      backgroundColor: colors.primary,
      paddingHorizontal: 20,
      paddingVertical: 8,
      borderRadius: 5,
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
