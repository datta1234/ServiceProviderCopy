import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  StyleProp,
  ViewStyle,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { useFocusEffect, useTheme } from "@react-navigation/native";
import * as NavigationService from "react-navigation-helpers";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import FastImage from "react-native-fast-image";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-community/async-storage";
import publicIP from "react-native-public-ip";
import messaging from "@react-native-firebase/messaging";
import Icon from "react-native-dynamic-vector-icons";
import { size } from "lodash";

/**
 * ? Local Imports
 */
import createStyles from "./LoginScreen.style";
import Text from "@shared-components/text-wrapper/TextWrapper";
// import { InputText } from "@shared-components/form";
import InputText from "@shared-components/form/InputText/v2/input-text";
import CommonButton from "@shared-components/buttons/CommonButton";
import { SCREENS } from "@shared-constants";
import BottomModal from "@shared-components/modals/BottomModal";

import { LoginSchema } from "../../utils/validation-schemas/login";
import { useAuth } from "@services/hooks/useAuth";
import { userActions } from "@services/states/user/user.slice";
import { AUTHENTICATION } from "@shared-constants";
import { onFacebookButtonPress } from "@shared-components/socials-auth/fb";
import { SystemInfo } from "../../utils/system/SystemGetters";
import { RootState } from "../../../store";
import KeyboardHandler from "@shared-components/containers/KeyboardHandler";
import AndroidBackButtonHandler from "shared/functions/AndroidBackButtonHandler";

/**
 * ? SVGs
 */
import PHONE from "@assets/v2/auth/icons/phone.svg";
import LAWNQ from "@assets/v2/auth/images/lawnq.svg";
import { v2Colors } from "@theme/themes";

/**
 * ? Icon Imports
 */
const LOOK = "../../assets/icons/gray/look.png";
const UNSEE = "../../assets/icons/gray/unsee.png";

const IMAGE_BG = "../../assets/v2/auth/images/image-bg.png";
const FACEBOOK = "../../assets/v2/auth/images/fb.png";
const TWITTER = "../../assets/v2/auth/images/twitter.png";
const GOOGLE = "../../assets/v2/auth/images/google.png";

type CustomStyleProp = StyleProp<ViewStyle> | Array<StyleProp<ViewStyle>>;

interface ILoginScreenProps {
  style?: CustomStyleProp;
  navigation?: any;
}

const LoginScreen: React.FC<ILoginScreenProps> = () => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const dispatch = useDispatch();
  const { TOKEN, SPID, MOBILE_NO } = AUTHENTICATION;
  const { onUserLogin, onSetDeviceDetails } = userActions;

  /**
   * ? Hooks
   */
  const { login } = useAuth();

  /**
   * ? Redux States
   */
  const { deviceDetails } = useSelector((state: RootState) => state.user);

  /**
   * ? States
   */
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [errs, setErrors] = useState<Array<string>>([]);
  const [isError, setIsError] = useState<boolean>(false);
  const [isPassVisible, setIsPassVisible] = useState<boolean>(false);
  const [cachedMobile, setCachedMobile] = useState<string | undefined>("");

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
        mobile: cachedMobile,
        password: "",
      };
    }, [cachedMobile]),
    resolver: yupResolver(LoginSchema),
  });
  useEffect(() => {
    reset({ mobile: cachedMobile, password: "" });
  }, [cachedMobile]);

  /**
   * ? On Mount
   */
  useFocusEffect(
    useCallback(() => {
      dispatch(userActions.onClearSignupState());
      setDeviceDetails();
      onGetMobileNumber();
    }, [])
  );

  /**
   * ? Watchers
   */
  useEffect(() => {
    if (size(errors) > 0) setIsError(true);
    else setIsError(false);
  }, [errors]);

  /**
   * ? Functions
   */
  const onLogin = () => {
    const values: any = getValues();
    const { mobile, password } = values;

    const payload = {
      MobileNumber: `61${mobile}`,
      ServiceProviderPassword: password,
      DeviceDetails: deviceDetails,
    };

    setIsFetching(true);
    login(
      payload,
      (data: any) => {
        let errorArray: any = [];
        if (data.StatusCode !== "00") {
          data.map((d: any) => {
            if (d.StatusCode !== "00") {
              errorArray.push(d.StatusMessage);
            }
          });
        }

        if (errorArray.length > 0) {
          setErrors(errorArray);
          setIsError(true);
          setIsFetching(false);
          return;
        }
        setIsError(false);
        setErrors([]);
        setIsFetching(false);

        const { ServiceProviderToken, ServiceProviderId } = data[0].Data[0];
        AsyncStorage.setItem(TOKEN, ServiceProviderToken);
        AsyncStorage.setItem(SPID, ServiceProviderId);
        AsyncStorage.setItem(MOBILE_NO, mobile);
        dispatch(onUserLogin(ServiceProviderId));
        requestUserPermission();
        NavigationService.navigate(SCREENS.WELCOME);
      },
      () => {
        setIsError(false);
        setErrors([]);
        setIsFetching(false);
      }
    );
  };

  const setDeviceDetails = () => {
    const dispatchDeviceDetails = (ip: string) => {
      const deviceDetails = {
        ...SystemInfo,
        IpAddress: ip,
      };
      dispatch(onSetDeviceDetails(deviceDetails));
    };

    publicIP()
      .then((ip) => {
        dispatchDeviceDetails(ip);
      })
      .catch((error) => {
        console.log("error:", error);
        dispatchDeviceDetails("000.000.0.0");
      });
  };

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      // console.log("Authorization status:", authStatus);
    }
  };

  const onRegister = () => {
    NavigationService.push(SCREENS.SIGNUP);
  };

  const onGetMobileNumber = async () => {
    const number = (await AsyncStorage.getItem(MOBILE_NO)) || "";
    setCachedMobile(number);
  };

  /* -------------------------------------------------------------------------- */
  /*                               Render Methods                               */
  /* -------------------------------------------------------------------------- */
  const Separator = () => <View style={{ height: 15 }} />;

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
          Incorrect mobile number or password
        </Text>
      </View>
    );
  };

  const SignIn = () => (
    <View style={{ flexGrow: 1 }}>
      <CommonButton
        text={"Sign In"}
        style={{ marginTop: 50, borderRadius: 5 }}
        onPress={handleSubmit(onLogin)}
        isFetching={isFetching}
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
      <Text h5 bold style={{ paddingHorizontal: 20 }}>{` OR `}</Text>
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
      {/* <TouchableOpacity
        onPress={async () =>
          onFacebookButtonPress().then(() =>
            console.log("Signed in with Facebook!"),
          )
        }
      > */}
      <FastImage source={require(FACEBOOK)} style={styles.socialIcon} />
      {/* </TouchableOpacity> */}
      <FastImage source={require(TWITTER)} style={styles.socialIcon} />
    </View>
  );

  const SignUp = () => (
    <View style={styles.registerContainer}>
      <Text h4 color={v2Colors.greenShade2}>{`Don't have an account? `}</Text>
      <TouchableOpacity onPress={onRegister}>
        <Text h3 bold color={v2Colors.green}>
          Sign Up
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardHandler>
      <AndroidBackButtonHandler />
      <ImageBackground style={styles.container} source={require(IMAGE_BG)}>
        <View style={{ flex: 1, alignSelf: "center" }}>
          <LAWNQ />
        </View>
        {isError && <ErrorMessage />}

        <View style={{ flex: 5 }}>
          <View style={{ minHeight: 100 }}>
            <InputText
              control={control}
              name="mobile"
              label="Enter Mobile Number"
              rightIcon={<PHONE />}
              prefix={"+61"}
              maxLength={9}
              keyboardType={"phone-pad"}
              isError={errors.mobile}
            />
            <Separator />

            <InputText
              control={control}
              name="password"
              label="Enter Password"
              rightIcon={
                <TouchableOpacity
                  onPress={() => {
                    setIsPassVisible(!isPassVisible);
                  }}
                >
                  {!isPassVisible ? (
                    <FastImage
                      key={"look"}
                      source={require(LOOK)}
                      style={styles.rightIcon}
                    />
                  ) : (
                    <FastImage
                      key={"unsee"}
                      source={require(UNSEE)}
                      style={styles.rightIcon}
                    />
                  )}
                </TouchableOpacity>
              }
              isPassword={!isPassVisible}
              isError={errors.password}
            />
          </View>

          <View>
            <SignIn />
            <Or />
            <Socials />
          </View>
        </View>
        <SignUp />
      </ImageBackground>
    </KeyboardHandler>
  );
};

export default LoginScreen;
