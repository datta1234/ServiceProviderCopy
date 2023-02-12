import React, { memo, useCallback, useMemo, useRef } from "react";
import { View, StyleProp, ViewStyle } from "react-native";
import { useTheme } from "@react-navigation/native";
import BottomSheet from "@gorhom/bottom-sheet";
import { isAndroid } from "@freakycoder/react-native-helpers";

/**
 * ? Local imports
 */
import createStyles from "./BottomSheetModal.style";
import Text from "@shared-components/text-wrapper/TextWrapper";

type CustomStyleProp = StyleProp<ViewStyle> | Array<StyleProp<ViewStyle>>;

interface IBottomModalScreenProps {
  style?: CustomStyleProp;
  title: string;
  body: any;
  // show: boolean;
  handleClose: any;
}

const BottomContentModal: React.FC<IBottomModalScreenProps> = ({
  title,
  body,
  // show,
  handleClose,
}) => {
  const theme = useTheme();
  //   const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  /**
   * ? References
   */
  const bottomSheetRef = useRef<BottomSheet>(null);

  /**
   * ? Variables
   */
  const snapPoints = useMemo(() => ["99.7%", "99.7%"], []);

  /**
   * ? Callbacks
   */
  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      handleClose();
    }
  }, []);

  /* -------------------------------------------------------------------------- */
  /*                               Render Methods                               */
  /* -------------------------------------------------------------------------- */
  const Content = () => (
    <View style={styles.content}>
      {/* <Header /> */}

      {body}
    </View>
  );

  const Header = () => (
    <View style={styles.header}>
      <Text h2 bold color={"black"}>
        {title}
      </Text>
    </View>
  );

  const Sheet = memo(() => (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      enablePanDownToClose
      backgroundStyle={styles.contentContainer}
      android_keyboardInputMode="adjustResize"
      // sets scrolling for android
      activeOffsetY={isAndroid ? 50 : 0}
    >
      <Content />
    </BottomSheet>
  ));

  return <Sheet />;
};

export default BottomContentModal;
