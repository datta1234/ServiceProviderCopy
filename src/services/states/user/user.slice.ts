import AsyncStorage from "@react-native-community/async-storage";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AUTHENTICATION } from "@shared-constants";

const { TOKEN } = AUTHENTICATION;

interface UserState {
  token: string;
  isLoggedin: boolean;
  serviceProviderId: string;
  deviceId: string;
  appState: string;
  hasId: boolean;
  info: {
    Firstname: string;
    Lastname: string;
    MobileNumber: string;
    Birthday: Date;
    EmailAddress: string;
    Address: string;
    IsSuspended: string;
    IsSPOnline: string;
  };
  basicSignupDetails: {
    Firstname: string;
    Lastname: string;
    MobileNumber: string;
    EmailAddress: string;
    Birthday: string;
    ABN: string;
    BussinessName:string;
  };
  Address: {
    Alias: string;
    Country: string;
    Province: string;
    City: string;
    Address1: string;
    Address2: string;
    StreetNumber: string;
    StreetName: string;
    StreetType: string;
    PostalCode: string;
  };
  CustomerPassword: string;
  otpCode: string;
  readableBirthday: string;
  password1: string;
  password2: string;
  deviceDetails: {
    AppVersion: string;
    Platform: string;
    PlatformOs: string;
    DeviceVersion: string;
    DeviceModel: string;
    MacAddress: string;
    IpAddress: string;
  };
  serviceProviderInfo: {
    Firstname: string;
    Lastname: string;
    MobileNumber: string;
    EmailAddress: string;
    Birthday: string;
    Age: number;
    IsSuspended: boolean;
    CustomerId: number;
  };
  geometry: { Latitude: string; Longitude: string };
}

const initialState: UserState = {
  token: "",
  isLoggedin: false,
  serviceProviderId: "",
  deviceId: "",
  appState: "",
  hasId: false,
  info: {
    Firstname: "",
    Lastname: "",
    MobileNumber: "",
    Birthday: "",
    EmailAddress: "",
    Address: "",
    IsSuspended: "",
    IsSPOnline: "",
  },
  basicSignupDetails: {
    Firstname: "",
    Lastname: "",
    MobileNumber: "",
    EmailAddress: "",
    Birthday: "",
    ABN: "",
  },
  Address: {
    Alias: "",
    Country: "",
    Province: "",
    City: "",
    Address1: "Empty",
    Address2: "Empty",
    StreetNumber: "",
    StreetName: "",
    StreetType: "Empty",
    PostalCode: "",
  },
  CustomerPassword: "",
  otpCode: "",
  readableBirthday: "",
  password1: "",
  password2: "",
  deviceDetails: {
    AppVersion: "error",
    Platform: "error",
    PlatformOs: "error",
    DeviceVersion: "error",
    DeviceModel: "error",
    MacAddress: "22:22:22:22",
    IpAddress: "192.168.1.1",
  },
  serviceProviderInfo: {
    Firstname: "",
    Lastname: "",
    MobileNumber: "",
    EmailAddress: "",
    Birthday: "",
    Age: 0,
    IsSuspended: false,
    CustomerId: 0,
  },
  geometry: { Latitude: "", Longitude: "" },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    onUserLogin(state, action: PayloadAction<any>) {
      state.serviceProviderId = action.payload;
    },
    onUserHasId(state, action: PayloadAction<any>) {
      state.hasId = action.payload;
    },
    onSetToken(state, action: PayloadAction<any>) {
      state.token = action.payload;
    },
    onSetDeviceDetails(state, action: PayloadAction<any>) {
      state.deviceDetails = action.payload;
    },
    onSetDeviceId(state, action: PayloadAction<any>) {
      state.deviceId = action.payload;
    },
    onSetAppState(state, action: PayloadAction<any>) {
      state.appState = action.payload;
    },
    onSetInfo(state, action: PayloadAction<any>) {
      state.info = action.payload;
    },
    userLoggedOut(state) {
      state.isLoggedin = false;
      AsyncStorage.removeItem(TOKEN);
      state = initialState;
    },
    onSaveBasicSignupDetails(state, action: PayloadAction<any>) {
      state.basicSignupDetails = action.payload;
    },
    onSetAddress(state, action: PayloadAction<any>) {
      state.Address = action.payload;
    },
    onSetAddressAlias(state, action: PayloadAction<any>) {
      state.Address.Alias = action.payload;
    },
    onSetBirthday(state, action: PayloadAction<any>) {
      state.basicSignupDetails.Birthday = action.payload;
    },
    onSetReadableBirthday(state, action: PayloadAction<any>) {
      state.readableBirthday = action.payload;
    },
    onSetPasswords(state, action: PayloadAction<any>) {
      state.password1 = action.payload.password1;
      state.password2 = action.payload.password2;
    },
    onSetServiceProviderInfo(state, action: PayloadAction<any>) {
      state.serviceProviderInfo = action.payload;
    },
    onSetGeometry(state, action: PayloadAction<any>) {
      state.geometry = action.payload;
    },

    onClearSignupState(state) {
      state.basicSignupDetails = {
        Firstname: "",
        Lastname: "",
        MobileNumber: "",
        EmailAddress: "",
        Birthday: "",
        ABN: "",
      };
      state.Address = {
        Alias: "",
        Country: "",
        Province: "",
        City: "",
        Address1: "Empty",
        Address2: "Empty",
        StreetNumber: "",
        StreetName: "",
        StreetType: "Empty",
        PostalCode: "",
      };
      state.CustomerPassword = "";
      state.otpCode = "";
      state.readableBirthday = "";
      state.password1 = "";
      state.password2 = "";
      state.geometry = { Latitude: "", Longitude: "" };
    },
  },
});

export const userActions = userSlice.actions;
export default userSlice.reducer;
