import { ExtendedTheme } from "@react-navigation/native";
import { v2Colors } from "@theme/themes";
import { ViewStyle, StyleSheet } from "react-native";

interface Style {
  container: ViewStyle;

  legendsContainer: ViewStyle;
  textContainer: ViewStyle;
  orangeCircle: ViewStyle;
  greenCircle: ViewStyle;

  instructionsContainer: ViewStyle;
  rulesContentContainer: ViewStyle;
  instructionItemContainer: ViewStyle;

  button: ViewStyle;
}

export default (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create<Style>({
    container: {
      flex: 1,
      backgroundColor: "white",
    },

    legendsContainer: {
      marginTop: 30,
      marginHorizontal: 20,
      padding: 10,
      borderWidth: 1.5,
      borderColor: v2Colors.border,
      borderRadius: 7,
      backgroundColor: "white",

      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,

      elevation: 5,
    },
    textContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    orangeCircle: {
      height: 18,
      width: 18,
      borderRadius: 18 / 2,
      backgroundColor: v2Colors.orange,
    },
    greenCircle: {
      height: 18,
      width: 18,
      borderRadius: 18 / 2,
      backgroundColor: v2Colors.highlight,
    },

    instructionsContainer: {
      marginTop: 30,
      marginHorizontal: 20,
    },
    rulesContentContainer: {
      marginTop: 30,
    },
    instructionItemContainer: {
      flexDirection: "row",
      marginTop: 1,
    },

    button: {
      flexGrow: 1,
      justifyContent: "flex-end",
      marginTop: "10%",
    },
  });
};
