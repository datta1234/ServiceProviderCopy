import React, { useMemo } from "react";
import { View, StyleProp, ViewStyle } from "react-native";
import { useTheme } from "@react-navigation/native";
import * as NavigationService from "react-navigation-helpers";
import CalendarPicker from "react-native-calendar-picker";
import Modal from "react-native-modal";
import GestureRecognizer from "react-native-swipe-gestures";
import { useDispatch } from "react-redux";
import moment from "moment";

/**
 * ? Local Imports
 */
import createStyles from "./CalendarModal.style";
import Text from "@shared-components/text-wrapper/TextWrapper";
import { SCREENS } from "@shared-constants";

import { bookingActions } from "@services/states/booking/booking.slice";

type CustomStyleProp = StyleProp<ViewStyle> | Array<StyleProp<ViewStyle>>;

interface ICalendarModalProps {
  style?: CustomStyleProp;
  isVisible: boolean;
  setIsVisible: Function;
}

const CalendarModal: React.FC<ICalendarModalProps> = ({
  isVisible,
  setIsVisible,
}) => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);
  const dispatch = useDispatch();

  const minDate = new Date(Date.now() + 24 * 60 * 60 * 1000); // Tomorrow

  /**
   * ? States
   */

  /* -------------------------------------------------------------------------- */
  /*                               Render Methods                               */
  /* -------------------------------------------------------------------------- */
  const Header = () => (
    <View style={styles.header}>
      <Text h3 bold color="black">
        Pick a Date
      </Text>
    </View>
  );

  const Footer = () => <View style={{ marginBottom: 30 }}></View>;

  return (
    <GestureRecognizer onSwipeDown={() => setIsVisible(false)}>
      <Modal
        isVisible={isVisible}
        swipeDirection="down"
        style={styles.modal}
        animationOut="slideOutDown"
        animationInTiming={500}
        animationOutTiming={500}
        useNativeDriver
        hideModalContentWhileAnimating
        backdropTransitionOutTiming={0}
      >
        <View style={styles.content}>
          <Header />
          <CalendarPicker
            startFromMonday
            minDate={minDate}
            todayBackgroundColor={"transparent"}
            onDateChange={(data) => {
              setIsVisible(false);
              setTimeout(() => {
                NavigationService.navigate(SCREENS.BOOKING);
                dispatch(
                  bookingActions.onSetDateAndQueue({
                    queue: "later",
                    date: moment(data).format("LL"),
                  }),
                );
              }, 500);
            }}
          />
          <Footer />
        </View>
      </Modal>
    </GestureRecognizer>
  );
};

export default CalendarModal;
