export interface Signin {
  MobileNumber: string;
  CustomerPassword: string;
}

export interface Signup {
  CustomerPassword: string;
  EmailAddress: string;
  MobileNumber: string;
  Firstname: string;
  Lastname: string;
  Birthday: string;
  Address: string;
}

export interface UpdateDeviceId {
  ServiceProviderToken: string;
  ServiceProviderId: number;
  DeviceId: string;
}

export interface AuthenticationObject {
  token: string;
}
