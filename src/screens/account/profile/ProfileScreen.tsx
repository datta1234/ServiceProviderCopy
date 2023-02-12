import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  StyleProp,
  ViewStyle,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import * as NavigationService from "react-navigation-helpers";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";

/**
 * ? Local Imports
 */
import createStyles from "./ProfileScreen.style";
import Text from "@shared-components/text-wrapper/TextWrapper";
import CommonButton from "@shared-components/buttons/CommonButton";
import InputTextWithTitle from "@shared-components/form/InputText/v2/input-text-with-title";

import { udpateProfileSchema } from "utils/validation-schemas/profile";
import { useAuth } from "@services/hooks/useAuth";
import { RootState } from "../../../../store";
import { cutMobile } from "./helpers";

/**
 * ? Constants
 */
// ? SVGs
import SampleProfile from "@assets/v2/account/images/sample-profile.svg";
import { SCREENS } from "@shared-constants";
import HeaderContainer from "@shared-components/headers/HeaderContainer";

type CustomStyleProp = StyleProp<ViewStyle> | Array<StyleProp<ViewStyle>>;

interface IProfileScreenProps {
  style?: CustomStyleProp;
  navigation?: any;
}

const ProfileScreen: React.FC<IProfileScreenProps> = ({ navigation }) => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);
  const dispatch = useDispatch();
  const { getInfo } = useAuth();

  /**
   * ? Redux States
   */
  const { token, serviceProviderId, deviceDetails, info } = useSelector(
    (state: RootState) => state.user
  );

  /**
   * ? States
   */
  const [isFetching, setIsFetching] = useState<boolean>(false);

  /**
   * ? Form States
   */
  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({
    defaultValues: {
      firstName: info.Firstname,
      lastName: info.Lastname,
      mobile: cutMobile(info.MobileNumber),
      email: info.EmailAddress,
      birthday: info.Birthday,
    },
    resolver: yupResolver(udpateProfileSchema),
  });

  /**
   * ? On Mount
   */
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchCustomerInfo();
    });

    return unsubscribe;
  }, [navigation]);

  /**
   * ? Functions
   */
  const fetchCustomerInfo = () => {
    const payload = {
      CustomerToken: token,
      CustomerId: serviceProviderId,
      ...deviceDetails,
    };

    setIsFetching(true);
    getInfo(
      payload,
      () => {
        setIsFetching(false);
      },
      () => {
        setIsFetching(false);
      }
    );
  };

  const saveCustomerInfo = () => {
    const values = getValues();
    console.log("values:", values);
    const { firstName, lastName, mobile, email, birthday } = values;

    const payload = {
      CustomerToken: token,
      CustomerId: serviceProviderId,
      Firstname: firstName,
      Lastname: lastName,
      MobileNumber: `61${mobile.substring(1)}`,
      EmailAddress: email,
      Birthday: birthday,
      Address: "null-this-time",
      DeviceDetails: deviceDetails,
    };

    console.log("saveCustomerInfo payload:", payload);
    // setIsFetching(true);
    // updateCustomerInfo(
    //   payload,
    //   () => {
    //     setIsFetching(false);
    //     Alert.alert("Update Profile", "Successfuly updated your profile", [
    //       {
    //         onPress: () => {
    //           NavigationService.goBack();
    //         },
    //       },
    //     ]);
    //   },
    //   () => {
    //     setIsFetching(false);
    //   }
    // );
  };

  /* -------------------------------------------------------------------------- */
  /*                               Render Methods                               */
  /* -------------------------------------------------------------------------- */
  const ProfileImage = () => (
    <View style={styles.imageHeaderContainer}>
      {/* <FastImage
        source={require(PROFILE)}
        style={styles.profilePicImageStyle}
        resizeMode={"contain"}
      /> */}
      <SampleProfile />
      <TouchableOpacity
        style={styles.subProfilePicImageStyle}
        onPress={() => console.log("change picture")}
      >
        <Text h5 color={"black"}>
          Change Photo
        </Text>
      </TouchableOpacity>
    </View>
  );

  const Separator = () => <View style={{ height: 15 }} />;

  const Form = () => {
    return (
      <View style={styles.formContainer}>
        <InputTextWithTitle
          control={control}
          name="firstName"
          label="First Name"
        />
        <Separator />

        <InputTextWithTitle
          control={control}
          name="lastName"
          label="Last Name"
        />
        <Separator />

        <InputTextWithTitle
          control={control}
          name="mobile"
          label="Mobile Number"
        />
        <Separator />

        <InputTextWithTitle control={control} name="email" label="Email" />
      </View>
    );
  };

  const Save = () => (
    <View style={styles.button}>
      <CommonButton
        text={"Update Profile"}
        onPress={handleSubmit(saveCustomerInfo)}
        style={{ borderRadius: 5 }}
        isFetching={isFetching}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <HeaderContainer
        pageTitle="Edit Profile"
        navigateTo={SCREENS.HOME}
        hasCancel
        onCancel={() => NavigationService.goBack()}
      />
      <ScrollView>
        <View style={styles.profileContainer}>
          <ProfileImage />
        </View>
        <View style={styles.subContainer}>
          <Form />
          <Save />
        </View>
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;
