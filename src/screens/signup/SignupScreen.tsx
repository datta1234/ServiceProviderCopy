import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  StyleProp,
  ViewStyle,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  ImageBackground,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import * as NavigationService from "react-navigation-helpers";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import FastImage from "react-native-fast-image";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { size } from "lodash";
import Icon from "react-native-dynamic-vector-icons";

/**
 * ? Local Imports
 */
import createStyles from "./SignupScreen.style";
import Text from "@shared-components/text-wrapper/TextWrapper";
import { DatePicker } from "@shared-components/form";
import InputText from "@shared-components/form/InputText/v2/input-text";
import CommonButton from "@shared-components/buttons/CommonButton";
import { SCREENS } from "@shared-constants";

import { BasicRegistrationSchema } from "../../utils/validation-schemas/registration";
import { userActions } from "../../services/states/user/user.slice";
import { RootState } from "../../../store";

/**
 * ? SVGs
 */
import USER from "@assets/v2/auth/icons/user.svg";
import PHONE from "@assets/v2/auth/icons/phone.svg";
import MAIL from "@assets/v2/auth/icons/mail.svg";
import CALENDAR from "@assets/v2/auth/icons/calendar.svg";
import LAWNQ from "@assets/v2/auth/images/lawnq.svg";
import { v2Colors } from "@theme/themes";

/**
 * ? Icon Imports
 */
const IMAGE_BG = "../../assets/v2/auth/images/image-bg.png";
const FB = "../../assets/v2/auth/images/fb.png";
const TWITTER = "../../assets/v2/auth/images/twitter.png";
const GOOGLE = "../../assets/v2/auth/images/google.png";

type CustomStyleProp = StyleProp<ViewStyle> | Array<StyleProp<ViewStyle>>;

interface ISignupScreenProps {
  style?: CustomStyleProp;
  navigation?: any;
}

const SignupScreen: React.FC<ISignupScreenProps> = ({ navigation }) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const dispatch = useDispatch();

  const { onSaveBasicSignupDetails } = userActions;

  /**
   * ? Redux States
   */
  const { basicSignupDetails, Address, readableBirthday } = useSelector(
    (state: RootState) => state.user
  );
  const { Firstname, Lastname, MobileNumber, EmailAddress, Birthday, BussinessName } =
    basicSignupDetails;
  console.log("basicSignupDetails:", basicSignupDetails);

  /**
   * ? Form States
   */
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    getValues,
  } = useForm({
    defaultValues: useMemo(() => {
      return {
        firstName: Firstname,
        lastName: Lastname,
        mobile: MobileNumber,
        email: EmailAddress,
        address: Address.Alias,
        birthday: readableBirthday,
        abn: "",
        bussiness:BussinessName,
      };
    }, [Address.Alias]),
    resolver: yupResolver(BasicRegistrationSchema),
    shouldUnregister: false,
  });

  /**
   * ? States
   */
  const [isError, setIsError] = useState<boolean>(false);

  /**
   * ? Functions
   */
  const onDispatchBasicDetails = () => {
    const values = getValues();
    const { email, mobile, firstName, lastName, abn, bussiness } = values;

    dispatch(
      onSaveBasicSignupDetails({
        EmailAddress: email,
        MobileNumber: `61${mobile}`,
        Firstname: firstName,
        Lastname: lastName,
        Birthday,
        ABN: !abn ? "" : abn,
        BussinessName: bussiness,
      })
    );
  };

  const onNext = () => {
    // onDispatchBasicDetails();
    // NavigationService.navigate(SCREENS.SET_PASS);
    // NavigationService.navigate(SCREENS.SERVICE_TYPE);
    NavigationService.navigate(SCREENS.SERVICE_TYPE);
  };

  const onLogin = () => {
    NavigationService.goBack();
  };

  const locateProperty = () => {
    onDispatchBasicDetails();

    // dispatch(onSetAddressAlias(""));
    NavigationService.navigate(SCREENS.SET_LOCATION);
  };

  /**
   * ? Watchers
   */
  useEffect(() => {
    reset({
      firstName: Firstname,
      lastName: Lastname,
      mobile: MobileNumber?.substring(2),
      email: EmailAddress,
      address: Address.Alias,
      birthday: readableBirthday,
      bussiness: BussinessName,
    });
  }, [Address]);

  /**
   * ? Watchers
   */
  useEffect(() => {
    /**
     * Checks if error sets in to view ErrorMessage
     */
    size(errors) === 0 ? setIsError(false) : setIsError(true);
  }, [errors]);
  useEffect(() => {}, []);

  /* -------------------------------------------------------------------------- */
  /*                               Render Methods                               */
  /* -------------------------------------------------------------------------- */
  const Separator = () => <View style={{ height: 20 }} />;

  const ErrorMessage = () => {
    return (
      <View style={styles.errorContainer}>
        <Icon
          style={{ marginRight: 10 }}
          name="warning"
          type="AntDesign"
          color={"white"}
          size={20}
        />
        <Text color={"white"} bold>
          Required Fields must be filled in
        </Text>
      </View>
    );
  };

  const Next = () => (
    <View style={{ flexGrow: 1 }}>
      <CommonButton
        text={"Next"}
        // onPress={handleSubmit(onNext)}
        onPress={onNext}
        style={{ borderRadius: 5 }}
      />
    </View>
  );

  const Or = () => (
    <View style={styles.OrContainer}>
      <View
        style={[
          styles.lineSeparator,
          {
            alignItems: "flex-start",
          },
        ]}
      />
      <Text
        h5
        bold
        style={{ paddingHorizontal: 20 }}
      >{` Or sign up with `}</Text>
      <View
        style={[
          styles.lineSeparator,
          {
            alignItems: "flex-end",
          },
        ]}
      />
    </View>
  );

  const Socials = () => (
    <View style={styles.socialsContainer}>
      <FastImage source={require(GOOGLE)} style={styles.socialIcon} />
      <FastImage source={require(FB)} style={styles.socialIcon} />
      <FastImage source={require(TWITTER)} style={styles.socialIcon} />
    </View>
  );

  const SignIn = () => (
    <View style={styles.registerContainer}>
      <Text h4 color={v2Colors.greenShade2}>{`Already have an account? `}</Text>
      <TouchableOpacity onPress={onLogin}>
        <Text h3 bold style={{ paddingVertical: 16 }} color={v2Colors.green}>
          Sign In
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps={"never"}
    >
      <ImageBackground style={styles.container} source={require(IMAGE_BG)}>
        <View style={{ alignSelf: "center", marginVertical: 50 }}>
          <LAWNQ />
        </View>

        {isError && <ErrorMessage />}
        {isError && <View style={{ height: 32 }} />}

        <View style={{ flexGrow: 1 }}>
          <InputText
            control={control}
            name="abn"
            label="ABN (Optional)"
            rightIcon={<CALENDAR />}
            isError={errors.abn}
          />
          <Separator />

          <InputText
            control={control}
            name="email"
            label="Email"
            rightIcon={<MAIL />}
            isError={errors.email}
          />
          <Separator />

          <InputText
            control={control}
            name="mobile"
            label="Mobile Number"
            rightIcon={<PHONE />}
            prefix={"+61"}
            maxLength={9}
            isError={errors.mobile}
          />
          <Separator />

          <InputText
            control={control}
            name="firstName"
            label="First Name"
            rightIcon={<USER />}
            isError={errors?.firstName}
          />
          <Separator />

          <InputText
            control={control}
            name="lastName"
            label="Last Name"
            rightIcon={<USER />}
            isError={errors.lastName}
          />
          <Separator />


          <InputText
            control={control}
            name="address"
            label="Address"
            rightIcon={<USER />}
            onFocus={locateProperty}
            isError={errors.address}
          />
          <Separator />

          <DatePicker
            control={control}
            name="birthday"
            label="Date of Birth"
            maximumDate={new Date(moment().subtract(18, "years").toDate())}
            rightIcon={<CALENDAR />}
            isError={errors.birthday}
          />

          <Separator />

          <InputText
            control={control}
            name="bussiness"
            label="Bussiness Name"
            rightIcon={<USER />}
            isError={errors.bussiness}
          />
          <Separator />
          <Separator />
        </View>
        <Next />
        <Or />
        <Socials />
        <SignIn />
      </ImageBackground>
    </ScrollView>
  );
};

export default SignupScreen;
