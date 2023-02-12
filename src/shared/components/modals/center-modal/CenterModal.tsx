import React, { useEffect, useMemo, useState } from "react";
import { View, StyleProp, ViewStyle, TouchableOpacity } from "react-native";
import { useTheme } from "@react-navigation/native";
import Modal from "react-native-modal";
import * as _ from "lodash";
import moment from "moment";
import Icon from "react-native-dynamic-vector-icons";

/**
 * ? Local imports
 */
import createStyles from "./CenterModal.style";

import Text from "@shared-components/text-wrapper/TextWrapper";

/**
 * ? Constants
 */
const INITIAL_TIMER = 1000 * 30; // 30 seconds

type CustomStyleProp = StyleProp<ViewStyle> | Array<StyleProp<ViewStyle>>;

interface ICenterModalScreenProps {
  style?: CustomStyleProp;
  isVisible: boolean;
  setIsVisible: Function;
  title?: string;
  body?: string;
  showButton?: boolean;
  onPress1?: () => any;
  onPress2?: () => any;
  buttonText1?: string;
  buttonText2?: string;
  isTimerEnabled?: boolean;
  withActionCancel?: boolean;
  time?: number;
  onCancel?: any;
}

const CenterModal: React.FC<ICenterModalScreenProps> = ({
  isVisible,
  setIsVisible,
  title,
  body = "Sample content",
  showButton = true,
  onPress1,
  onPress2,
  buttonText1 = "Accept",
  buttonText2 = "Decline",
  isTimerEnabled = false,
  withActionCancel = false,
  time = INITIAL_TIMER,
  onCancel,
}) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  /**
   * ? States
   */
  const [timer, setTimer] = useState<number>(time);

  /**
   * ? On Mount
   */
  useEffect(() => {
    if (!isVisible && timer) return;
    setTimer(INITIAL_TIMER);
  }, [isVisible]);

  /**
   * ? Watchers
   */
  useEffect(() => {
    if (!isVisible) return;
    if (timer <= 0) {
      onCancel();
      setTimer(0);
      return;
    }
    const timeout = setTimeout(() => {
      setTimer((previous) => previous - 1000);
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [timer, isVisible]);

  useEffect(() => {
    if (!timer) setIsVisible(false);
  }, [timer]);

  /**
   * ? Functions
   */

  /* -------------------------------------------------------------------------- */
  /*                               Render Methods                               */
  /* -------------------------------------------------------------------------- */
  const Content = () => (
    <View style={styles.content}>
      <Header />
      <Body />
      {showButton && withActionCancel ? <Buttons1 /> : <Buttons2 />}
    </View>
  );

  const Header = () => (
    <View style={styles.header}>
      <Text h2 bold>
        {_.upperFirst(title)}
      </Text>
    </View>
  );

  const Body = () => (
    <View style={styles.body}>
      <Text h3 color="black" style={{ textAlign: "center" }}>
        {body}
      </Text>
      {isTimerEnabled && (
        <>
          <Text
            h4
            color="black"
            style={{
              marginTop: 40,
              textAlign: "center",
            }}
          >
            Accept booking in:
          </Text>
          <Text
            h2
            color="black"
            bold
            style={{
              marginTop: 4,
              textAlign: "center",
            }}
          >
            {moment(timer).format("ss")}
          </Text>
        </>
      )}
    </View>
  );

  const Buttons1 = () => (
    <View style={styles.buttonContainer}>
      <TouchableOpacity onPress={onPress1} style={styles.button1}>
        <Icon
          name="check"
          type="Entypo"
          color={"white"}
          size={18}
          style={{ marginRight: 5 }}
        />
        <Text h4 bold color="white">
          {buttonText1 || ""}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onPress2} style={styles.button2}>
        <Icon
          name="cross"
          type="Entypo"
          color={"red"}
          size={25}
          style={{ marginRight: 5 }}
        />
        <Text h4 bold color="red">
          {buttonText2 || ""}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const Buttons2 = () => (
    <View style={styles.buttonContainer}>
      <TouchableOpacity onPress={onPress1} style={styles.singleBtn}>
        <Icon
          name="check"
          type="Entypo"
          color={"white"}
          size={20}
          style={{ marginRight: 5 }}
        />
        <Text h4 bold color="white">
          {buttonText1 || ""}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Modal
      testID={"modal"}
      isVisible={isVisible}
      backdropColor="rgba(0,0,0,0.5)"
      backdropOpacity={0.8}
      animationIn="zoomInDown"
      animationOut="zoomOutUp"
      animationInTiming={600}
      animationOutTiming={600}
      backdropTransitionInTiming={600}
      backdropTransitionOutTiming={600}
    >
      <Content />
    </Modal>
  );
};

export default CenterModal;
