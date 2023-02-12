import React, { useEffect, useMemo, useState, memo, useCallback } from "react";
import { View, StyleProp, ViewStyle, ActivityIndicator } from "react-native";
import { useTheme } from "@react-navigation/native";
import { CalendarList } from "react-native-calendars";
import moment from "moment";
import _ from "lodash";

/**
 * ? Local imports
 */
import createStyles from "../ScheduleScreen.style";

/**
 * ? Constants
 */
const INITIAL_DATE = moment().format("YYYY-MM-DD");

type CustomStyleProp = StyleProp<ViewStyle> | Array<StyleProp<ViewStyle>>;

interface ICalendarProps {
  style?: CustomStyleProp;
  dates: any;
  handleDayPress: any;
  selecting: boolean;
}

const Calendar: React.FC<ICalendarProps> = ({
  dates,
  handleDayPress,
  selecting,
}) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  /* -------------------------------------------------------------------------- */
  /*                               Render Methods                               */
  /* -------------------------------------------------------------------------- */
  const CalendarView = memo(() => (
    <CalendarList
      horizontal={true}
      pagingEnabled={true}
      pastScrollRange={2}
      futureScrollRange={12}
      scrollEnabled={true}
      markedDates={dates}
      allowSelectionOutOfRange={false}
      disableAllTouchEventsForDisabledDays
      onDayPress={(details) => {
        const { dateString } = details;
        handleDayPress(dateString);
      }}
      minDate={INITIAL_DATE}
    />
  ));

  const Loader = () => (
    <View style={{ marginTop: 30 }}>
      <ActivityIndicator size="large" color="black" />
    </View>
  );

  return (
    <>
      {!selecting && <CalendarView />}
      {selecting && <Loader />}
    </>
  );
};

export default Calendar;
