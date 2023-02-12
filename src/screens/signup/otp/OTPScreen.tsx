import React, {
  useMemo,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import {
  View,
  StyleProp,
  ViewStyle,
  Alert,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { useFocusEffect, useTheme } from "@react-navigation/native";
import * as NavigationService from "react-navigation-helpers";
import { useSelector } from "react-redux";
import moment, { Moment } from "moment";
import { v2Colors } from "@theme/themes";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { size } from "lodash";
import Icon from "react-native-dynamic-vector-icons";

/**
 * ? Local imports
 */
import createStyles from "./OTPScreen.style";
import Text from "@shared-components/text-wrapper/TextWrapper";
import CommonButton from "@shared-components/buttons/CommonButton";
import KeyboardHandler from "@shared-components/containers/KeyboardHandler";

import { AUTHENTICATION, SCREENS } from "@shared-constants";
import type { RootState } from "../../../../store";
import { useAuth } from "@services/hooks/useAuth";
import AsyncStorage from "@react-native-community/async-storage";

/**
 * ? SVGs
 */
import ARROW_LEFT from "@assets/v2/headers/arrow-left.svg";
import InputText from "@shared-components/form/InputText/v2/input-text";

/**
 * ? Constants
 */
const IMAGE_BG = "../../../assets/v2/auth/images/image-bg.png";
const INITIAL_OTP_TIMER = moment().set("minutes", 0).set("second", 5); //0:05

type CustomStyleProp = StyleProp<ViewStyle> | Array<StyleProp<ViewStyle>>;

interface IOTPScreenProps {
  style?: CustomStyleProp;
}

const OTPScreen: React.FC<IOTPScreenProps> = ({}) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const codeRef = useRef<any>();
  const { MOBILE_NO } = AUTHENTICATION;

  /**
   * ? Redux States
   */
  const { basicSignupDetails, Address, password1, geometry, deviceDetails } =
    useSelector((state: RootState) => state.user);
  console.log("basicSignupDetails:", basicSignupDetails);
  const { MobileNumber } = basicSignupDetails;

  /**
   * ? States
   */
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>(
    "The OTP you have entered is incorrect"
  );
  const [showResend, setShowResend] = useState<boolean>(false);
  const [timer, setTimer] = useState<Moment>(INITIAL_OTP_TIMER);

  /**
   * ? Hooks
   */
  const { register, sendOTP, validateOTP } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({
    defaultValues: {
      code: "",
    },
    resolver: yupResolver(
      yup.object().shape({
        code: yup.string().required("Password is required.").min(6),
      })
    ),
  });

  /**
   * ? On Mount
   */
  useFocusEffect(
    useCallback(() => {
      onSendOTP();
    }, [])
  );

  /**
   * ? Watchers
   */
  //? Watches OTP resend timer
  useEffect(() => {
    if (!showResend) return setTimer(INITIAL_OTP_TIMER);

    setTimeout(() => {
      setTimer(moment(timer).subtract(1, "seconds"));
    }, 1000);

    if (moment(timer).format("m:ss") === "0:00") setShowResend(false);
  }, [showResend, timer]);

  // Checks if error sets in to view ErrorMessage
  useEffect(() => {
    if (size(errors) > 0) {
      setErrorMessage("The OTP you have entered is incorrect");
      setIsError(true);
    } else setIsError(false);
  }, [errors]);

  /**
   * ? Functions
   */
  const onSubmit = () => {
    const values = getValues();
    const { code } = values;

    onValidateOTP(code);
  };

  const onRegister = () => {
    const payload = {
      ...basicSignupDetails,
      ...Address,
      ...geometry,
      ServiceProviderPassword: password1,
      DeviceDetails: deviceDetails,
    };
    console.log("onRegister payload:", payload);

    setIsFetching(true);
    register(
      payload,
      (data: any) => {
        console.log("onRegister data:", data);
        if (data.length > 0) {
          Alert.alert("Registration Unsuccessful", JSON.stringify(data));
          setIsError(true);
          setIsFetching(false);
          return;
        }
        setIsError(false);
        setIsFetching(false);
        AsyncStorage.setItem(MOBILE_NO, MobileNumber.substring(2));

        Alert.alert("Registration", "Successfully signed up!", [
          {
            text: "Confirm",
            onPress: () => {
              NavigationService.navigate(SCREENS.LOGIN);
            },
          },
        ]);
      },
      (err: any) => {
        console.log("onRegister err:", err);
        Alert.alert("Register", "Something went wrong. Please try again.");
        setIsError(false);
        setIsFetching(false);
      }
    );
  };

  const onResend = () => {
    setShowResend(true);
    onSendOTP();
  };

  const onSendOTP = () => {
    const payload = {
      MobileNumber,
      Type: "S",
      DeviceDetails: deviceDetails,
    };

    console.log("onSendOTP payload:", payload);
    sendOTP(
      payload,
      (data: any) => {
        console.log("onSendOTP data:", data);
      },
      (err: any) => {
        console.log("onSendOTP err:", err);
        Alert.alert("S-OTP", "Something went wrong. Please try again");
      }
    );
  };

  const onValidateOTP = (Otp: string) => {
    const payload = {
      MobileNumber,
      Otp,
      Type: "S",
      DeviceDetails: deviceDetails,
    };

    console.log("onValidateOTP payload:", payload);
    validateOTP(
      payload,
      (data: any) => {
        console.log("onValidateOTP data:", data);
        const { StatusCode } = data[0];
        if (StatusCode === "01") {
          setIsError(true);
          Alert.alert("V-OTP", "OTP does not match. Please try again.");
        }
        if (StatusCode === "00") onRegister();
      },
      (err: any) => {
        console.log("onValidateOTP err:", err);
        setIsError(true);
        Alert.alert("V-OTP", "Something went wrong. Please try again.");
      }
    );
  };

  /* -------------------------------------------------------------------------- */
  /*                               Render Methods                               */
  /* -------------------------------------------------------------------------- */
  const Header = (props: { pageTitle: string }) => (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={() => NavigationService.goBack()}>
        <ARROW_LEFT style={{ marginTop: 4, marginRight: 10 }} />
      </TouchableOpacity>
      <Text h2 bold color={v2Colors.green}>
        {props.pageTitle}
      </Text>
    </View>
  );

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
          {errorMessage}
        </Text>
      </View>
    );
  };

  const Subheader = () => (
    <View style={styles.subHeader}>
      <Text h4 color={v2Colors.greenShade2}>
        {`We have sent the code to `}
        <Text h4 bold color={v2Colors.greenShade2}>
          {`+${basicSignupDetails.MobileNumber}`}
        </Text>
      </Text>
    </View>
  );

  const ResendOTP = () => (
    <View style={styles.resendOTP}>
      <Text h5>
        {`Didn't receive the code? `}
        {showResend ? (
          <>
            <Text h5>{`Resend in `}</Text>
            <Text h5 bold>
              {`${moment(timer).format("m:ss")}`}
            </Text>
          </>
        ) : (
          <>
            <Text h5 bold onPress={onResend}>{`Resend`}</Text>
          </>
        )}
      </Text>
    </View>
  );

  const Submit = () => (
    <View style={styles.submit}>
      <CommonButton
        text={"Confirm"}
        onPress={handleSubmit(onSubmit)}
        isFetching={isFetching}
        style={{ borderRadius: 5 }}
      />
    </View>
  );

  return (
    <>
      <Header pageTitle="Account Verification" />
      <KeyboardHandler>
        <ImageBackground style={styles.container} source={require(IMAGE_BG)}>
          <Subheader />

          {isError && <ErrorMessage />}

          <InputText
            control={control}
            name={"code"}
            label={"Enter 6 digit code"}
            maxLength={6}
            keyboardType={"phone-pad"}
            isError={errors.code}
            textStyle={{
              letterSpacing: 1,
              fontSize: 18,
              fontWeight: "bold",
            }}
          />
          <View style={{ height: 20 }} />
          <ResendOTP />
          <Submit />
        </ImageBackground>
      </KeyboardHandler>
    </>
  );
};

export default OTPScreen;
