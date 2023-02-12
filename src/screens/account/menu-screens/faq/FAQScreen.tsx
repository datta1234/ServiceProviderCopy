import React, { useMemo } from "react";
import { View, StyleProp, ViewStyle, Alert } from "react-native";
import { useTheme } from "@react-navigation/native";
import Clipboard from "@react-native-clipboard/clipboard";
import FastImage from "react-native-fast-image";

/**
 * ? Local Imports
 */
import createStyles from "./FAQScreen.style";
import { SCREENS } from "@shared-constants";
import Text from "@shared-components/text-wrapper/TextWrapper";
import HeaderContainer from "@shared-components/headers/HeaderContainer";
import { ScrollView } from "react-native-gesture-handler";
import Header from "@shared-components/typography/header/Header";
import SubHeader from "@shared-components/typography/sub-header/SubHeader";
import Body from "@shared-components/typography/body/Body";

/**
 * ? Constants
 */
const SERVICE = "../../../../assets/images/others/service.png";

type CustomStyleProp = StyleProp<ViewStyle> | Array<StyleProp<ViewStyle>>;

interface IFAQScreenProps {
  style?: CustomStyleProp;
}

const FAQScreen: React.FC<IFAQScreenProps> = () => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  /**
   * ? Functions
   */
  const onPressEmail = (url: string) => {
    Clipboard.setString(url);
    Alert.alert("Clipboard", `Copied to clipboard: ${url}`);
  };

  /* -------------------------------------------------------------------------- */
  /*                               Render Methods                               */
  /* -------------------------------------------------------------------------- */
  const Separator = () => <View style={styles.separatorContainer} />;

  const BodyWithURL = (props: {
    text1: string;
    url: string;
    text2: string;
  }) => (
    <Text style={styles.bodyWithURLContainer}>
      <Text h4 color={colors.fontDarkGray}>
        {props.text1}
      </Text>
      <Text
        h4
        color={"blue"}
        style={styles.url}
        onPress={() => onPressEmail(props.url)}
      >
        {props.url}
      </Text>
      <Text h4 color={colors.fontDarkGray}>
        {props.text2}
      </Text>
    </Text>
  );

  return (
    <>
      <HeaderContainer pageTitle={"FAQ"} navigateTo={SCREENS.HOME} />
      <ScrollView style={styles.container}>
        {/** 1st */}
        <Header text={"LawnQ SP Booking Related Questions"} />
        <Separator />
        <SubHeader text="How do I validate/calculate the size of the lawn area?" />
        <Body text="An easy way to remember the formula for area is A (area) = L (length) x W (width). If you have more than one area then you will calculate Area A + Area B to calculate the total size of the lawn." />
        <Separator />

        <SubHeader text="How long do I have before I start mowing for a “book today” service?" />
        <Body
          text={`“Book Today” Service should be completed within approximately 23 hours to avoid having customers canceling. If you do not finish the Book today service within 23 hours and the customer cancels, you will pay the cancellation fees which is a 3rd party surcharge to handle the transaction.`}
        />

        <FastImage
          source={require(SERVICE)}
          style={{ height: 60, width: "100%", marginTop: 10 }}
          resizeMode="contain"
        />
        <Separator />

        <SubHeader text="How can I reach out to the Customer?" />
        <Body text="Navigate to Reservations → Select the outstanding bookings → select the booking → click on the call icon or chat with the service provider in the box at the bottom of the screen." />
        <Separator />

        <SubHeader text="The Customer is not answering my calls or replying to my chat. What should I do?" />
        <Body text="Give the customer a 24 hours period to get back to you, however you can alway request to reschedule the booking if the customer does not answer the call or messages. You can reschedule by navigating to Reservations → Select the outstanding bookings → select the booking → choose reschedule." />
        <Separator />

        <SubHeader text="How is the completion rate calculated? How does it affect my profile?" />
        <Body text="Your completion rate is calculated by the total number of requests sent to you, and the number of requests you complete. In this way, your Acceptance rate absolutely matters and can count against you." />
        <Separator />

        <SubHeader text="What do I do if it’s raining and I can’t mow a customer’s lawn today?" />
        <Body text="You need to communicate with the customer and aim to reschedule your booking. You can reschedule your booking by going to reservations → Select the outstanding booking that you want to reschedule → click on reschedule to pick a new booking date that you had a mutual agreement on with the customer." />
        <Separator />

        <SubHeader text="What should I do if the lawn size of the property I am mowing is not accurate?" />
        <Body text="Under the booking, you can send a request to LawnQ to correct the lawn area with the size that you measured on the customer’s property." />
        <Separator />

        <SubHeader text="How can I reach out to LawnQ support team?" />
        <BodyWithURL
          text1="Please email "
          url="support@lawnQ.com.au"
          text2=" and one of our customer service team members will tend to your inquiry."
        />

        <Separator />
        <Separator />
      </ScrollView>
    </>
  );
};

export default FAQScreen;
