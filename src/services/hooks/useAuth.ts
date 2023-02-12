import AsyncStorage from "@react-native-community/async-storage";
import { useRef } from "react";
import { Alert } from "react-native";
import { AxiosError } from "axios";
import { useMutation } from "react-query";
import { Signin, Signup, UpdateDeviceId } from "../models/authentication";
import { MobileProps } from "../models/system";

import { AUTHENTICATION } from "@shared-constants";
const { TOKEN } = AUTHENTICATION;
import {
  onCreateServiceProviderId,
  onGetIdTypes,
  onGetInfo,
  onGetServiceProviderId,
  onLogin,
  onSendOTP,
  onSignup,
  onUpdateDeviceId,
  onValidateOTP,
} from "../api/user.service";
import { useDispatch } from "react-redux";
import { userActions } from "../states/user/user.slice";

export const useAuth = () => {
  const dispatch = useDispatch();

  const successCallbackRef = useRef<(a: object) => void>();
  const errorCallbackRef = useRef<(a: any) => void>();

  const loginMutation = useMutation(onLogin, {
    onSuccess: (data: any) => {
      return successCallbackRef.current?.(data);
    },
    onError: (err: any) => {
      errorCallbackRef.current?.(err);
      Alert.alert("Sign In Error", err.response?.data?.Message);
    },
  });
  const login = (
    payload: Signin | MobileProps,
    succesCallback?: (p: object) => void,
    errorCallback?: (p: object) => void
  ) => {
    successCallbackRef.current = succesCallback;
    errorCallbackRef.current = errorCallback;
    loginMutation.mutate(payload);
  };

  const registerMutation = useMutation(onSignup, {
    onSuccess: (data: any) => {
      if (data[0].StatusCode !== "00") {
        let errorArray: any = [];

        data.map((d: any) => {
          if (d.StatusCode !== "00") {
            errorArray.push(d.StatusMessage);
          }
        });
        return successCallbackRef.current?.(errorArray);
      }

      Alert.alert("Success", "Sign Up Successful", [
        {
          text: "Confirm",
          onPress: () => {
            successCallbackRef.current?.(data[0]);
          },
        },
      ]);
    },
    onError: (err: any) => {
      console.log("error", err.response?.data);
      errorCallbackRef.current?.(err);
      Alert.alert("Sign Up Error", err.response?.data?.Message);
    },
  });
  const register = (
    payload: Signup | MobileProps,
    succesCallback?: (p: object) => void,
    errorCallback?: (p: object) => void
  ) => {
    successCallbackRef.current = succesCallback;
    errorCallbackRef.current = errorCallback;
    registerMutation.mutate(payload);
  };

  const updateDeviceIdMutation = useMutation(onUpdateDeviceId, {
    onSuccess: (data: any) => {
      return successCallbackRef.current?.(data);
    },
    onError: (err: AxiosError) => {
      console.log("err:", err);
      errorCallbackRef.current?.(err);
    },
  });
  const updateDeviceId = (
    payload: UpdateDeviceId | MobileProps,
    succesCallback?: (p: object) => void,
    errorCallback?: (p: object) => void
  ) => {
    successCallbackRef.current = succesCallback;
    errorCallbackRef.current = errorCallback;
    updateDeviceIdMutation.mutate(payload);
  };

  // get device informations
  const getInfoMutation = useMutation(onGetInfo, {
    onSuccess: (data: any) => {
      const {
        Firstname,
        Lastname,
        MobileNumber,
        Birthday,
        EmailAddress,
        Address,
        IsSuspended,
        IsSPOnline,
      } = data[0];

      dispatch(
        userActions.onSetInfo({
          Firstname,
          Lastname,
          MobileNumber,
          Birthday,
          EmailAddress,
          Address,
          IsSuspended,
          IsSPOnline,
        })
      );

      return successCallbackRef.current?.(data);
    },
    onError: (err: AxiosError) => {
      errorCallbackRef.current?.(err);
    },
  });
  const getInfo = (
    payload: any,
    succesCallback?: (p: object) => void,
    errorCallback?: (p: object) => void
  ) => {
    successCallbackRef.current = succesCallback;
    errorCallbackRef.current = errorCallback;
    getInfoMutation.mutate(payload);
  };

  const sendOTPmutation = useMutation(onSendOTP, {
    onSuccess: (data: any) => {
      return successCallbackRef.current?.(data);
    },
    onError: (err: AxiosError) => {
      errorCallbackRef.current?.(err);
    },
  });
  const sendOTP = (
    payload: UpdateDeviceId | MobileProps,
    succesCallback?: (p: object) => void,
    errorCallback?: (p: object) => void
  ) => {
    successCallbackRef.current = succesCallback;
    errorCallbackRef.current = errorCallback;
    sendOTPmutation.mutate(payload);
  };

  const validateOTPmutation = useMutation(onValidateOTP, {
    onSuccess: (data: any) => {
      return successCallbackRef.current?.(data);
    },
    onError: (err: AxiosError) => {
      errorCallbackRef.current?.(err);
    },
  });
  const validateOTP = (
    payload: UpdateDeviceId | MobileProps,
    succesCallback?: (p: object) => void,
    errorCallback?: (p: object) => void
  ) => {
    successCallbackRef.current = succesCallback;
    errorCallbackRef.current = errorCallback;
    validateOTPmutation.mutate(payload);
  };

  // upload service provider id mutation
  const UploadIdMutation = useMutation(onCreateServiceProviderId, {
    onSuccess: (data: any) => {
      return successCallbackRef.current?.(data);
    },
    onError: (err: AxiosError) => {
      return errorCallbackRef.current?.(err);
    },
  });

  // upload id
  const uploadServiceProviderId = (
    payload: any,
    succesCallback?: (p: object) => void,
    errorCallback?: (p: object) => void
  ) => {
    successCallbackRef.current = succesCallback;
    errorCallbackRef.current = errorCallback;
    UploadIdMutation.mutate(payload);
  };

  // get Id types mutations
  const getIdTypeMutation = useMutation(onGetIdTypes, {
    onSuccess: (data: any) => {
      return successCallbackRef.current?.(data);
    },
    onError: (err: AxiosError) => {
      errorCallbackRef.current?.(err);
    },
  });

  const getIdtypes = (
    succesCallback?: (p: object) => void,
    errorCallback?: (p: object) => void
  ) => {
    successCallbackRef.current = succesCallback;
    errorCallbackRef.current = errorCallback;
    getIdTypeMutation.mutate();
  };

  // get device informations
  const getServiceProviderIdMutation = useMutation(onGetServiceProviderId, {
    onSuccess: (data: any) => {
      return successCallbackRef.current?.(data);
    },
    onError: (err: AxiosError) => {
      errorCallbackRef.current?.(err);
    },
  });
  const getServiceProviderId = (
    payload: any,
    succesCallback?: (p: object) => void,
    errorCallback?: (p: object) => void
  ) => {
    successCallbackRef.current = succesCallback;
    errorCallbackRef.current = errorCallback;
    getServiceProviderIdMutation.mutate(payload);
  };

  // last
  const logout = () => {
    AsyncStorage.removeItem(TOKEN);
    dispatch(userActions.userLoggedOut());
  };

  return {
    login,
    register,
    updateDeviceId,
    getInfo,
    sendOTP,
    validateOTP,
    getIdtypes,
    uploadServiceProviderId,
    getServiceProviderId,
    //
    logout,
  };
};
