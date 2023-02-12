import React from "react";
import { Keyboard, View } from "react-native";

interface IAndroidKeyboardHandlerProps {
  children: any;
}

const KeyboardHandler: React.FC<IAndroidKeyboardHandlerProps> = ({
  children,
}) => {
  const shouldSetResponse = () => true;
  const onRelease = () => Keyboard.dismiss();

  return (
    <>
      <View
        onResponderRelease={onRelease}
        onStartShouldSetResponder={shouldSetResponse}
        style={{ flex: 1, zIndex: 2 }}
      >
        {children}
      </View>
    </>
  );
};
export default KeyboardHandler;
