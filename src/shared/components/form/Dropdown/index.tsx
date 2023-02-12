import React, { useMemo } from "react";
import { useTheme } from "@react-navigation/native";

/* Framework */
import { Modal, Platform, View, Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

/* Local */
import Text from "@shared-components/text-wrapper/TextWrapper";
import createStyles from "./FormDropdown.style";
import fonts from "@fonts";
import CommonButton from "@shared-components/buttons/CommonButton";

// ../../assets/icons/gray/close.png
/* Icon */
const CLOSE = "../../../../assets/icons/gray/close.png";
const DOWN_ARROW = "../../../../assets/icons/gray/dropdown-arrow.png";

/* Library */
import { Picker } from "@react-native-picker/picker";
// import AndroidDialogPicker from "react-native-android-dialog-picker";
import { OutlinedTextField } from "@freakycoder/react-native-material-textfield";
import { Controller } from "react-hook-form";
import FastImage from "react-native-fast-image";

interface IFormDropdownProps {
	name: string;
	label: string;
	placeholder?: string;
	control: any;
	ref?: any;
	style?: CustomStyleProp;
	leftIcon?: JSX.Element;
	rightIcon?: JSX.Element;
	onFocus?: (a: string) => void;
	data?: Array;
}

const FormDropdown: React.FC<IFormDropdownProps> = ({ name = "", label = "", control, ref, style, onFocus, leftIcon, rightIcon, data }) => {
	const theme = useTheme();
	const { colors } = theme;
	const styles = useMemo(() => createStyles(theme), [theme]);

	const [selectedPicker, setSelectedPicker] = React.useState<String>();
	const [selectedIndexPicker, setSelectedIndexPicker] = React.useState<number>(0);
	const [selected, setSelected] = React.useState<String>();
	const [selectedIndex, setSelectedIndex] = React.useState<number>(0);
	const [open, setOpen] = React.useState(false);

	/* NOTE */
	// Change data to data1 to test dropdown
	const data1 = [
		{
			label: "Javascript",
			value: "Value1",
		},
		{
			label: "Java",
			value: "Value2",
		},
		{
			label: "Swift",
			value: "Value3",
		},
		{
			label: "Objective-C",
			value: "Value4",
		},
		{
			label: "PHP",
			value: "Value5",
		},
		{
			label: "HTML",
			value: "Value6",
		},
		{
			label: "Python",
			value: "Value7",
		},
	];

	return (
		<>
			<Controller
				control={control}
				name={name}
				render={({ field: { onChange, onBlur }, fieldState: { error } }) => (
					<>
						<TouchableOpacity
							onPress={() => {
								// if (Platform.OS === "android") {
								//   let item: string[] = [];
								//   data1?.map((value) => {
								//     item.push(value.label);
								//   });
								//   AndroidDialogPicker.show(
								//     {
								//       title: label,
								//       items: item,
								//       cancelText: "Cancel",
								//     },
								//     (buttonIndex) => {
								//       setSelected(data1[buttonIndex].value);
								//       setSelectedIndex(buttonIndex);
								//       onChange(data1[buttonIndex].value);
								//     },
								//   );
								// } else {
								setOpen(true);
								// }
							}}
						>
							<View style={styles.textInputStyle} pointerEvents='none'>
								<OutlinedTextField
									ref={ref}
									containerStyle={style}
									label={label}
									placeholder={selected ? " " : null}
									onFocus={onFocus}
									onBlur={onBlur}
									renderLeftAccessory={() => {
										return leftIcon;
									}}
									renderRightAccessory={() => {
										return <FastImage source={require(DOWN_ARROW)} style={styles.dropdownIcon} />;
									}}
									labelOffset={leftIcon ? { x1: -45 } : { x1: 0 }}
									tintColor={"black"}
								/>
							</View>
							<View style={[styles.textInInputStyle, { left: leftIcon ? 45 : 13 }]}>
								<Text color={colors.text} fontFamily={fonts.montserrat.medium}>
									{selected && data[selectedIndex].label}
								</Text>
							</View>
						</TouchableOpacity>

						{error ? (
							<Text h5 color={colors.textError} style={{ marginBottom: 20 }}>
								{error.message}
							</Text>
						) : (
							<View style={{ marginBottom: 35 }} />
						)}
						{Platform.OS === "ios" ? (
							<Modal
								visible={open}
								animationType='slide'
								transparent={true}
								statusBarTranslucent={true}
								onRequestClose={() => {
									setOpen(false);
								}}
							>
								<View style={styles.modalMainContainerStyle}>
									<View style={styles.modalInnerContainerStyle}>
										<View style={styles.modalHeaderStyle}>
											<View style={styles.modalHeaderTextStyle}>
												<Text h2 style={{ marginTop: 4 }} color={colors.text}>
													{label}
												</Text>
											</View>

											<View style={styles.modalHeaderButtonStyle}>
												<TouchableOpacity
													onPress={() => {
														setSelectedPicker(selected);
														setSelectedIndexPicker(selectedIndex);
														setOpen(false);
													}}
												>
													<FastImage source={require(CLOSE)} style={styles.icon} resizeMode={"contain"} />
												</TouchableOpacity>
											</View>
										</View>

										<Picker
											selectedValue={selectedPicker}
											onValueChange={(itemValue, itemPosition) => {
												setSelectedPicker(itemValue);
												setSelectedIndexPicker(itemPosition);
											}}
										>
											{data1?.map((value, index) => {
												return <Picker.Item key={index} label={value.label} value={value.value} />;
											})}
										</Picker>
										<CommonButton
											text={"Select"}
											style={{ marginVertical: 16 }}
											onPress={() => {
												setSelected(selectedPicker);
												setSelectedIndex(selectedIndexPicker);
												setOpen(false);
												onChange(selectedPicker);
											}}
										/>
									</View>
								</View>
							</Modal>
						) : null}
					</>
				)}
			/>
		</>
	);
};

export default FormDropdown;
