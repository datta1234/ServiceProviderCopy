import { DefaultTheme, ExtendedTheme } from "@react-navigation/native";

export const palette = {
  primary: "#333",
  secondary: "#b6b5b3",
  background: "#f3f3f3",
  white: "#fff",
  black: "#101214",
  button: "#1c1e21",
  lightGreen: "#bcd631",
  shadow: "#757575",
  text: "#30363b",
  textError: "#f44336",
  borderColor: "#d0d7de",
  borderColorDark: "#333942",
  borderColorError: "#f44336",
  placeholder: "#a1a1a1",
  danger: "#cc3333",
  title: "rgb(102, 102, 102)",
  separator: "rgb(194, 194, 195)",
  highlight: "rgb(199, 198, 203)",
  blackOverlay: "rgba(0,0,0,0.6)",
  iconWhite: "#fff",
  iconBlack: "#101214",
  dynamicWhite: "#fff",
  dynamicBlack: "#1c1e21",
  dynamicBackground: "#fff",
  transparent: "transparent",
  calpyse: "#2b7488",
  darkerGray: "#1c1c1c",
  darkGray: "#404040",
  lightCardContainerBg: "#D4d4d4",
  neonGreen: "#d2F15e",
  lightGray: "#f0f0f0",
  fontDarkGray: "#707070",
};

export const v2Colors = {
  border: "#E7E7E7",
  highlight: "#98C23C",
  green: "#1E4940",
  greenShade2: "#51736C",
  lightGreen: "rgba(152, 194, 60, 0.19)",
  gray: "#A0A0A0",
  lightRed: "#E98692",
  backgroundGray: "#F6F6F6",
  orange: "#F39C12",
  blue: "#3498DB",
  red: "#E74C3C",
  blackOpacity6: "rgba(0,0,0,0.6)",
};

export const LightTheme: ExtendedTheme = {
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    ...palette,
  },
};

export const DarkTheme: ExtendedTheme = {
  ...DefaultTheme,
  colors: {
    ...LightTheme.colors,
    background: palette.black,
    foreground: palette.white,
    text: palette.white,
    tabBar: palette.black,
    iconWhite: palette.black,
    iconBlack: palette.white,
    dynamicBackground: palette.dynamicBlack,
    shadow: palette.transparent,
    borderColor: palette.borderColorDark,
  },
};
