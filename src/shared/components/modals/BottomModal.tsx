import React, { useMemo } from "react";
import { View, StyleProp, ViewStyle } from "react-native";
import { useTheme } from "@react-navigation/native";
import Modal from "react-native-modal";
import GestureRecognizer from "react-native-swipe-gestures";

/**
 * ? Local imports
 */
import createStyles from "./BottomModal.style";

import Text from "@shared-components/text-wrapper/TextWrapper";

type CustomStyleProp = StyleProp<ViewStyle> | Array<StyleProp<ViewStyle>>;

interface IBottomModalScreenProps {
  style?: CustomStyleProp;
  isVisible: boolean;
  setIsVisible: Function;
  setQueue?: any;
  title?: string;
  body?: Array<string> | undefined;
}

const BottomModal: React.FC<IBottomModalScreenProps> = ({
  isVisible,
  setIsVisible,
  setQueue,
  title,
  body,
}) => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  /* -------------------------------------------------------------------------- */
  /*                               Render Methods                               */
  /* -------------------------------------------------------------------------- */
  const Content = () => (
    <View style={styles.content}>
      <Header />
      <View style={styles.body}>
        {body?.map((b: string, index: number) => {
          return <Text h4 color="black" key={index}>{`* ${b}`}</Text>;
        })}
      </View>
    </View>
  );

  const Header = () => (
    <View style={styles.header}>
      <Text h4 bold color={colors.primary}>
        {title}
      </Text>
    </View>
  );

  return (
    <GestureRecognizer
      onSwipeDown={() => {
        setIsVisible(false);
        !!setQueue && setQueue("0");
      }}
    >
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
        <Content />
      </Modal>
    </GestureRecognizer>
  );
};

export default BottomModal;
