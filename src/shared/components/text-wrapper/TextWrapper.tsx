import React from "react";
import RNText, { IRNTextProps } from "@freakycoder/react-native-custom-text";
/**
 * ? Local Imports
 */
import fonts from "@fonts";
import { v2Colors } from "@theme/themes";

interface ITextWrapperProps extends IRNTextProps {
  color?: string;
  fontFamily?: string;
  children?: React.ReactNode;
}

const TextWrapper: React.FC<ITextWrapperProps> = ({
  fontFamily = fonts.lexend.regular,
  color = v2Colors.green,
  children,
  ...rest
}) => {
  return (
    <RNText fontFamily={fontFamily} color={color} {...rest}>
      {children}
    </RNText>
  );
};

export default TextWrapper;
