import React, { useCallback, useMemo, useRef } from "react";
import { View, StyleProp, ViewStyle, Animated } from "react-native";
import { useFocusEffect, useTheme } from "@react-navigation/native";
import LottieView from "lottie-react-native";
import * as NavigationService from "react-navigation-helpers";

/**
 * ? Local imports
 */
import createStyles from "./WelcomeScreen.style";
import Setup from "./functions/Setup";
import { SCREENS } from "@shared-constants";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";

/**
 * ? Constants
 */
const ANIMATION =
  "../../assets/animations/custom-lottie-animation/logo-animation.json";
const TIMER = 4500;

type CustomStyleProp = StyleProp<ViewStyle> | Array<StyleProp<ViewStyle>>;

interface IWelcomeScreenProps {
  style?: CustomStyleProp;
}

const WelcomeScreen: React.FC<IWelcomeScreenProps> = () => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  /**
   * ? Redux States
   */
  const { goToScreen } = useSelector((state: RootState) => state.booking);

  /**
   * ? References
   */
  const opacity = useRef(new Animated.Value(0)).current;

  /**
   * ? On Mount
   */
  useFocusEffect(
    useCallback(() => {
      handleShowSubText();
    }, [])
  );

  /**
   * ? Functions
   */
  const handleShowSubText = () => {
    opacity.setValue(0);
    Animated.timing(opacity, {
      toValue: 1,
      duration: TIMER - 2000,
      useNativeDriver: true,
    }).start();
  };

  /* -------------------------------------------------------------------------- */
  /*                               Render Methods                               */
  /* -------------------------------------------------------------------------- */
  const Animation = () => (
    <LottieView
      source={require(ANIMATION)}
      autoPlay
      loop={false}
      onAnimationFinish={() => {
        // if (!goToScreen) return NavigationService.navigate(SCREENS.HOME);
        // NavigationService.navigate(SCREENS[`${goToScreen}`]);
      }}
    />
  );

  return (
    <View style={styles.container}>
      <Setup />
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Animation />
      </View>
    </View>
  );
};

export default WelcomeScreen;
