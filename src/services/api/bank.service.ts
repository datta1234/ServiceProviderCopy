import {
    AuthenticationObject,
  } from "../models/authentication";
  import { MobileProps } from "../models/system";
  import { nonAuthorizedRequest, nonAuthorizedMultiPartRequest } from "./client";
  import { getDeviceDetails } from "../../utils/helpers";
  
  export const onCreateServiceProviderBankAccount = async (payload: any) => {
    const response = await nonAuthorizedRequest<AuthenticationObject>().post(
      `ServiceProvider/CreateServiceProviderBankAccount`,
      payload
    );
    return response.data;
  };

  export const onCreateServiceProviderAccount = async (payload: any) => {
    const response = await nonAuthorizedRequest<AuthenticationObject>().post(
      `ServiceProvider/CreateServiceProviderAccount`,
      payload
    );
    return response.data;
  };
  