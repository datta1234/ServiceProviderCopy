import React, { useMemo, useState, memo, useCallback } from "react";
import {
  View,
  StyleProp,
  ViewStyle,
  Alert,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import _ from "lodash";
import { useFocusEffect } from "@react-navigation/native";
import * as NavigationService from "react-navigation-helpers";
import CalendarPicker from "react-native-calendar-picker";

/**
 * ? Local imports
 */
import createStyles from "./ScheduleScreen.style";

import { SCREENS } from "@shared-constants";
import HeaderContainer from "@shared-components/headers/HeaderContainer";
import CommonButton from "@shared-components/buttons/CommonButton";
import CenterModal from "@shared-components/modals/center-modal/CenterModal";
import Text from "@shared-components/text-wrapper/TextWrapper";

import { useBooking } from "@services/hooks/useBooking";

/**
 * ? SVGs
 */
import CHEVRON_LEFT from "@assets/v2/common/icons/chevron-left.svg";
import CHEVRON_RIGHT from "@assets/v2/common/icons/chevron-right.svg";
import CHAT_GREEN from "@assets/v2/common/icons/chat-green.svg";
import X_CIRCLE_GREEN from "@assets/v2/common/icons/x-circle-green.svg";
import SLASH_CIRCLE_GREEN from "@assets/v2/common/icons/slash-circle-green.svg";

/**
 * ? Constants
 */
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import fonts from "@fonts";
import { v2Colors } from "@theme/themes";

type CustomStyleProp = StyleProp<ViewStyle> | Array<StyleProp<ViewStyle>>;

interface IAvailabilityScreenProps {
  style?: CustomStyleProp;
  navigation?: any;
}

const AvailabilityScreen: React.FC<IAvailabilityScreenProps> = () => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { getAvailability, saveAvailability } = useBooking();

  /**
   * ? Redux States
   */
  const { serviceProviderId, deviceDetails } = useSelector(
    (state: RootState) => state.user
  );

  /**
   * ? States
   */
  const [dates, setDates] = useState<{}>({});
  const [isStartDate, setIsStartDate] = useState<boolean>(true);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);

  /**
   * ? On Mount
   */
  useFocusEffect(
    useCallback(() => {
      fetchAvailability();
    }, [])
  );

  /**
   * ? Functions
   */
  const handleSave = () => {
    if (!startDate || !endDate)
      return Alert.alert("Save schedule", "Please select dates");

    const payload = {
      ServiceProviderId: serviceProviderId,
      StartDate: startDate,
      EndDate: endDate,
      DeviceDetails: deviceDetails,
    };

    setIsFetching(true);
    saveAvailability(
      payload,
      (data: any) => {
        // console.log("saveAvailability data:", data);
        setIsFetching(false);
        setShowModal(true);
      },
      (err) => {
        console.log("err:", err);
        setIsFetching(false);
      }
    );
  };

  const fetchAvailability = () => {
    const payload = {
      ServiceProviderId: Number(serviceProviderId),
      DeviceDetails: deviceDetails,
    };

    getAvailability(
      payload,
      (data: any) => {
        const { StartDate, EndDate } = data[0];

        setStartDate(StartDate);
        setEndDate(EndDate);
      },
      (err) => {
        console.log("getAvailability err:", err);
      }
    );
  };

  const onDateChange = (date: any, dateType: any) => {
    if (!date) return;
    if (isStartDate) {
      setStartDate(date);
      setEndDate(undefined);
    } else {
      setEndDate(date);
    }
    setIsStartDate(!isStartDate);
  };

  /* -------------------------------------------------------------------------- */
  /*                               Render Methods                               */
  /* -------------------------------------------------------------------------- */
  const Save = memo(() => (
    <View style={styles.button}>
      <CommonButton
        text={"Save"}
        onPress={handleSave}
        style={{ borderRadius: 5, marginHorizontal: 20 }}
        isFetching={isFetching}
      />
    </View>
  ));

  const Legends = () => (
    <View style={styles.legendsContainer}>
      {/* <View style={styles.textContainer}>
        <View style={styles.orangeCircle} />
        <View style={{ width: 10 }} />
        <Text>Pending Bookings</Text>
      </View> */}
      {/* <View style={{ height: 10 }} /> */}
      <View style={styles.textContainer}>
        <View style={styles.greenCircle} />
        <View style={{ width: 10 }} />
        <Text>Available Slots</Text>
      </View>
    </View>
  );

  const Instructions = () => (
    <View style={styles.instructionsContainer}>
      <Text h3 bold>
        Booking Rules
      </Text>

      <View style={styles.rulesContentContainer}>
        {renderInstructionItem(
          <CHAT_GREEN />,
          `You can chat with the service provider to organise a time suitable for both of you on the selected date.
`
        )}
        {renderInstructionItem(
          <X_CIRCLE_GREEN />,
          `Cancel at no charge within 7 days from today.
`
        )}
        {renderInstructionItem(
          <SLASH_CIRCLE_GREEN />,
          `Inaccurate grass height details could result in booking rejection from the service provider.
`
        )}

        <TouchableOpacity>
          <Text right style={{ textDecorationLine: "underline" }}>
            See Terms
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderInstructionItem = (icon: JSX.Element, text: string) => (
    <View style={styles.instructionItemContainer}>
      {icon}
      <View style={{ width: 10 }} />
      <Text style={{ width: "90%" }}>{text}</Text>
    </View>
  );

  const Modal = () => (
    <CenterModal
      isVisible={showModal}
      setIsVisible={setShowModal}
      title="Success"
      body="You have successfully saved your schedule"
      onPress1={() => {
        setShowModal(false);
        setTimeout(() => {
          NavigationService.goBack();
        }, 300);
      }}
      buttonText1="Done"
    />
  );

  return (
    <>
      <HeaderContainer pageTitle="Availability" backDisabled />
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        <View style={{ height: 5 }} />
        <CalendarPicker
          startFromMonday
          minDate={new Date()}
          todayBackgroundColor={"transparent"}
          onDateChange={onDateChange}
          previousComponent={<CHEVRON_LEFT />}
          nextComponent={<CHEVRON_RIGHT />}
          textStyle={{
            fontFamily: fonts.lexend.extraBold,
            fontWeight: "700",
            color: v2Colors.green,
            fontSize: 15,
          }}
          monthTitleStyle={{ fontSize: 20, color: v2Colors.green }}
          yearTitleStyle={{ fontSize: 20, color: v2Colors.green }}
          restrictMonthNavigation
          selectedStartDate={startDate ? new Date(startDate) : undefined}
          selectedEndDate={endDate ? new Date(endDate) : undefined}
          allowRangeSelection
          selectedDayColor={v2Colors.highlight}
          selectedRangeStyle={{ backgroundColor: v2Colors.highlight }}
          selectedDayTextStyle={{ color: v2Colors.green }}
        />
        <Legends />
        <Instructions />

        <Save />
      </ScrollView>
      <Modal />
    </>
  );
};

export default AvailabilityScreen;
