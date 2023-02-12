import React, { useMemo } from "react";
import { Keyboard, StyleProp, TouchableWithoutFeedback, ViewStyle } from "react-native";
import { useTheme } from "@react-navigation/native";
import { Controller } from "react-hook-form";

/* Library */
import { OutlinedTextField } from "@freakycoder/react-native-material-textfield";

import createStyles from "./RegularInputText.style";

type CustomStyleProp = StyleProp<ViewStyle> | Array<StyleProp<ViewStyle>>;

interface IRegularInputText {
	name: string;
	label: string;
	placeholder?: string;
	maxInputLength?: number | undefined;
	autoCorrect?: boolean;
	control: any;
	ref?: any;
	style?: CustomStyleProp;
	onFocus?: (a: string) => void;
	value?: string;
	isPassword?: boolean;
	keyboardType: string;
}

const RegularInputText: React.FC<IRegularInputText> = ({ name = "", label = "", placeholder = "", maxInputLength = 500, autoCorrect = false, control, ref, style, onFocus, isPassword, keyboardType }) => {
	const theme = useTheme();
	const { colors } = theme;
	const styles = useMemo(() => createStyles(theme), [theme]);

	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
			<Controller
				control={control}
				name={name}
				render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
					<>
						<OutlinedTextField
							ref={ref}
							containerStyle={[style, styles.bottomSpacer]}
							inputContainerStyle={styles.inputContainerStyle}
							labelTextStyle={styles.labelTextStyle}
							affixTextStyle={styles.affixTextStyle}
							titleTextStyle={styles.titleTextStyle}
							style={styles.style}
							label={label}
							placeholder={placeholder}
							onChangeText={onChange}
							onFocus={onFocus}
							onBlur={onBlur}
							value={value}
							secureTextEntry={isPassword}
							tintColor={"black"}
							activeLineWidth={1}
							autoCorrect={autoCorrect}
							keyboardType={keyboardType}
							autoCapitalize='none'
							maxLength={maxInputLength}
							error={error?.message}
							errorColor={colors.textError}
							allowFontScaling={false}
							blurOnSubmit={false}
							onSubmit={() => Keyboard.dismiss}
						/>
					</>
				)}
			/>
		</TouchableWithoutFeedback>
	);
};

export default RegularInputText;
