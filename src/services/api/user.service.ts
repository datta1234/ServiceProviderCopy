import {
  AuthenticationObject,
  Signin,
  Signup,
  UpdateDeviceId,
} from "../models/authentication";
import { MobileProps } from "../models/system";
import { nonAuthorizedRequest, nonAuthorizedMultiPartRequest } from "./client";
import { getDeviceDetails } from "../../utils/helpers";

export const onLogin = async (payload: Signin | MobileProps) => {
  const response = await nonAuthorizedRequest<AuthenticationObject>().post(
    `ServiceProviderLogin/ServiceProviderLogin`,
    payload
  );
  return response.data;
};

export const onSignup = async (payload: Signup | MobileProps) => {
  const response = await nonAuthorizedRequest<AuthenticationObject>().post(
    `ServiceProviderRegistration/SaveServiceProviderRegistration`,
    payload
  );
  return response.data;
};

export const onUpdateDeviceId = async (
  payload: UpdateDeviceId | MobileProps
) => {
  const response = await nonAuthorizedRequest<AuthenticationObject>().put(
    `ServiceProvider/UpdateServiceProviderDeviceId`,
    payload
  );
  return response.data;
};

export const onGetInfo = async (payload: any) => {
  const { ServiceProviderToken, ServiceProviderId } = payload;

  const deviceDetails = getDeviceDetails(payload.DeviceDetails);

  const response = await nonAuthorizedRequest<AuthenticationObject>().get(
    `ServiceProvider/ServiceProviderInfo?ServiceProviderToken=${ServiceProviderToken}&ServiceProviderId=${ServiceProviderId}&${deviceDetails}`
  );
  return response.data;
};

export const onSendOTP = async (payload: any) => {
  const response = await nonAuthorizedRequest<AuthenticationObject>().post(
    `Otp/SendOtp`,
    payload
  );
  return response.data;
};

export const onValidateOTP = async (payload: any) => {
  const response = await nonAuthorizedRequest<AuthenticationObject>().post(
    `Otp/ValidateOtp`,
    payload
  );
  return response.data;
};

export const onGetIdTypes = async () => {
  const response = await nonAuthorizedRequest<AuthenticationObject>().get(
    `ServiceProviderRegistration/IdTypes`
  );
  return response.data;
};

export const onCreateServiceProviderId = async (payload: any) => {
  const response =
    await nonAuthorizedMultiPartRequest<AuthenticationObject>().post(
      `ServiceProvider/CreateServiceProviderId`,
      payload
    );
  return response.data;
};

export const onGetServiceProviderId = async (payload: any) => {
  const { ServiceProviderToken, ServiceProviderId } = payload;

  const deviceDetails = getDeviceDetails(payload.DeviceDetails);

  const response = await nonAuthorizedRequest<AuthenticationObject>().get(
    `ServiceProvider/ServiceProviderId?ServiceProviderToken=${ServiceProviderToken}&ServiceProviderId=${ServiceProviderId}&${deviceDetails}`
  );
  return response.data;
};
