import HeaderContainer from "@shared-components/headers/HeaderContainer";
import { SCREENS } from "@shared-constants";
import React, { useEffect, useMemo, useState } from "react";
import {
  StyleProp,
  View,
  ViewStyle,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import createStyles from "./AddBankScreen.style";
import { useTheme } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import { SafeAreaView } from "react-native-safe-area-context";
import CommonButton from "@shared-components/buttons/CommonButton";
import { AddBankSchema } from "utils/validation-schemas/bank";
import { yupResolver } from "@hookform/resolvers/yup";
import { useBank } from "@services/hooks/useBank";
import { RootState } from "../../../store";
import { useSelector } from "react-redux";
import * as NavigationService from "react-navigation-helpers";
import { useAuth } from "@services/hooks/useAuth";
import InputText from "@shared-components/form/InputText/v2/input-text";

type CustomStyleProp = StyleProp<ViewStyle> | Array<StyleProp<ViewStyle>>;

interface IAddBankScreen {
  style?: CustomStyleProp;
  navigation?: any;
}

const AddBankScreen: React.FC<IAddBankScreen> = ({ style, navigation }) => {
  /**
   * ? Redux
   */
  const { deviceDetails, serviceProviderId, token, hasId } = useSelector(
    (state: RootState) => state.user
  );

  /**
   * ? States
   */
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  /**
   * ? Hooks
   */
  const theme = useTheme();
  const { createServiceProviderBankAccount, createServiceProviderAccount } =
    useBank();
  const { getServiceProviderId } = useAuth();

  /**
   * ? Styles
   */
  const styles = useMemo(() => createStyles(theme), [theme]);

  /**
   * ? Methods
   */
  const shouldSetResponse = () => true;
  const onRelease = () => Keyboard.dismiss();

  useEffect(() => {
    _getServiceProviderId();
  }, []);

  const _saveBankAccounts = () => {
    // -- first create bank account and get bank Id and
    // Bank token please note it will expire 5 mins if you dont attached it to created account
    const values = getValues();
    const { accountHolderName, accountNumber, routingNumber } = values;

    const request = {
      Token: token,
      UserId: serviceProviderId,
      AccountHolderName: accountHolderName,
      AccountNumber: accountNumber,
      RoutingNumber: routingNumber,
    };

    setIsSubmitting(true);
    createServiceProviderBankAccount(
      request,
      (data: any) => {
        console.log(data);

        if (data.StatusCode === "00") {
          // invoke method creation of bank after
          // data.Data.BankAccount.Id = bank Account id
          // data.Data.Id = token
          _saveAccount(data.Data.Id, data.Data.BankAccount.Id);
        } else {
          Alert.alert("Error", data.StatusMessage);
          setIsSubmitting(false);
        }
      },
      (error) => {
        console.log(error);
        setIsSubmitting(false);
      }
    );
  };

  const _saveAccount = (bankToken: string, bankId: string) => {
    const request = {
      Token: token,
      UserId: serviceProviderId,
      ExternalAccount: bankToken,
      BankAccountId: bankId,
      DeviceDetails: deviceDetails,
    };

    createServiceProviderAccount(
      request,
      (data: any) => {
        console.log(data);

        if (data.StatusCode === "00") {
          Alert.alert("Success", "Successfully Created Account", [
            {
              onPress: () => {
                NavigationService.navigate(SCREENS.HOME);
                setIsSubmitting(false);
              },
              text: "Confirm",
            },
          ]);
        } else {
          Alert.alert("Error", data.StatusMessage);
        }
        setIsSubmitting(false);
      },
      (error) => {
        console.log(error);
        setIsSubmitting(false);
        Alert.alert("Error", "Please try again");
      }
    );
  };

  const _getServiceProviderId = () => {
    const payload = {
      ServiceProviderId: serviceProviderId,
      ServiceProviderToken: token,
      DeviceDetails: deviceDetails,
    };

    getServiceProviderId(
      payload,
      (data: any) => {
        console.log(data.length);

        if (data.length == 0) {
          Alert.alert(
            "Error",
            "Please Upload ID Documents before adding bank accounts",
            [
              {
                onPress: () => {
                  NavigationService.navigate(SCREENS.UPLOAD_ID);
                  setIsSubmitting(false);
                },
                text: "Confirm",
              },
            ]
          );
        }
      },
      (error) => {
        console.log("error:", error);
      }
    );
  };

  // Forms
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    getValues,
  } = useForm({
    resolver: yupResolver(AddBankSchema),
  });

  // Local Components
  const SubmitBanksAccounts = () => (
    <View style={styles.buttonContainer}>
      <CommonButton
        text={"Submit"}
        style={{ marginVertical: 10, borderRadius: 5 }}
        onPress={handleSubmit(_saveBankAccounts)}
        isFetching={isSubmitting}
      />
    </View>
  );

  return (
    <>
      <HeaderContainer pageTitle="Add Bank" navigateTo={SCREENS.HOME} />
      <View
        onResponderRelease={onRelease}
        onStartShouldSetResponder={shouldSetResponse}
        style={styles.container}
      >
        {/* <HeaderContainer pageTitle='Add Bank' navigateTo={SCREENS.HOME} isBackVisible={true} /> */}
        <SafeAreaView>
          {/* <View style={styles.container}> */}
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <View style={{ marginTop: 10 }}>
              <InputText
                keyboardType={"default"}
                control={control}
                name="accountHolderName"
                label="Account Name"
              />
            </View>
            <View style={{ marginTop: 20 }}>
              <InputText
                keyboardType={"phone-pad"}
                control={control}
                name="accountNumber"
                label="Account Number"
              />
            </View>
            <View style={{ marginTop: 20 }}>
              <InputText
                keyboardType={"phone-pad"}
                control={control}
                name="routingNumber"
                label="BSB Number"
                maxLength={6}
              />
            </View>
          </KeyboardAvoidingView>
          {/* </View> */}
        </SafeAreaView>
        <SubmitBanksAccounts />
      </View>
    </>
  );
};

export default AddBankScreen;
