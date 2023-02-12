import { ExtendedTheme } from "@react-navigation/native";
import { ViewStyle, StyleSheet } from "react-native";
import { ImageStyle } from "react-native-fast-image";

interface Style {
  verticalSpacing: ViewStyle;
  textInputStyle: ViewStyle;
  textInInputStyle: ViewStyle;
  icon: ImageStyle;
  dropdownIcon: ImageStyle;
  modalMainContainerStyle: ViewStyle;
  modalInnerContainerStyle: ViewStyle;
  modalHeaderStyle: ViewStyle;
  modalHeaderTextStyle: ViewStyle;
  modalHeaderButtonStyle: ViewStyle;
}

export default (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create<Style>({
    textInputStyle: {
      paddingVertical: 5,
    },
    textInInputStyle: {
      position: "absolute",
      top: 21,
      right: 0,
      bottom: 0,
    },
    verticalSpacing: {
      marginVertical: 8,
    },
    icon: {
      height: 25,
      width: 25,
      marginTop: 8,
      marginRight: 8,
    },
    dropdownIcon: {
      justifyContent: "center",
      height: 25,
      width: 25,
      resizeMode: "contain",
    },
    modalMainContainerStyle: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      justifyContent: "center",
      padding: 10,
    },
    modalInnerContainerStyle: {
      backgroundColor: "#FFFFFF",
      padding: 20,
      borderRadius: 10,
    },
    modalHeaderStyle: {
      flexDirection: "row",
    },
    modalHeaderTextStyle: {
      flexShrink: 1,
      flexGrow: 2,
      alignContent: "flex-start",
    },
    modalHeaderButtonStyle: {
      alignContent: "flex-end",
      justifyContent: "flex-end",
      alignItems: "flex-end",
      flexShrink: 2,
      flexGrow: 1,
    },
  });
};
