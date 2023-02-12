import { AuthenticationObject } from "../models/authentication";
import { nonAuthorizedRequest } from "./client";
import { getDeviceDetails } from "../../utils/helpers";

export const onUpdateServiceProviderActiveStatus = async (payload: any) => {
  const response = await nonAuthorizedRequest<AuthenticationObject>().put(
    `ServiceProvider/UpdateServiceProviderActiveStatus`,
    payload
  );
  return response.data;
};

export const onUpdateServiceProviderLocation = async (payload: any) => {
  // console.log("onUpdateServiceProviderLocation payload2:", payload);
  const response = await nonAuthorizedRequest<AuthenticationObject>().put(
    `ServiceProvider/UpdateServiceProviderLocation`,
    payload
  );
  return response.data;
};

export const onSendNotification = async (payload: any) => {
  const response = await nonAuthorizedRequest<AuthenticationObject>().post(
    `Notification/PushNotification`,
    payload
  );
  return response.data;
};

export const onPushSPBookingStatus = async (payload: any) => {
  const response = await nonAuthorizedRequest<AuthenticationObject>().post(
    `BookingService/PushSPBookingStatus`,
    payload
  );
  return response.data;
};

export const onGetBookingHistory = async (payload: any) => {
  const { ServiceProviderId, BookingRefNo } = payload;

  const deviceDetails = getDeviceDetails(payload);

  const response = await nonAuthorizedRequest<AuthenticationObject>().get(
    `BookingService/ServiceProviderBookingHistory?ServiceProviderId=${ServiceProviderId}&BookingRefNo=${BookingRefNo}&${deviceDetails}`
  );
  return response.data;
};

export const onCancelBooking = async (payload: any) => {
  const response = await nonAuthorizedRequest<AuthenticationObject>().post(
    `BookingService/ServiceProviderCancelBooking`,
    payload
  );
  return response.data;
};

export const onCompleteBooking = async (payload: any) => {
  const response = await nonAuthorizedRequest<AuthenticationObject>().post(
    `BookingService/CompleteBookingService`,
    payload
  );
  return response.data;
};

export const onSaveAvailability = async (payload: any) => {
  const response = await nonAuthorizedRequest<AuthenticationObject>().post(
    `ServiceProvider/SetServiceProviderSchedule`,
    payload
  );
  return response.data;
};

export const onGetAvailability = async (payload: any) => {
  const { ServiceProviderId } = payload;

  const deviceDetails = getDeviceDetails(payload.DeviceDetails);
  const response = await nonAuthorizedRequest<AuthenticationObject>().get(
    `ServiceProvider/GetServiceProviderSchedule?ServiceProviderId=${ServiceProviderId}&${deviceDetails}`
  );
  return response.data;
};

export const onSaveFeedback = async (payload: any) => {
  const response = await nonAuthorizedRequest<AuthenticationObject>().post(
    `BookingService/SaveServiceProviderFeedback`,
    payload
  );
  return response.data;
};

export const onGetCustomerDeviceID = async (payload: any) => {
  const { CustomerId } = payload;

  const deviceDetails = getDeviceDetails(payload.DeviceDetails);
  const response = await nonAuthorizedRequest<AuthenticationObject>().get(
    `Customer/CustomerDeviceId?CustomerId=${CustomerId}&${deviceDetails}`
  );
  return response.data;
};

export const onGetActiveStatus = async (payload: any) => {
  const { ServiceProviderId } = payload;

  const deviceDetails = getDeviceDetails(payload.DeviceDetails);
  const response = await nonAuthorizedRequest<AuthenticationObject>().get(
    `ServiceProvider/GetServiceProviderActiveStatus?ServiceProviderId=${ServiceProviderId}&${deviceDetails}`
  );
  return response.data;
};
