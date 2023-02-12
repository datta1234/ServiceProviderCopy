export const getDeviceDetails = (payload: any) => {
  const {
    AppVersion,
    Platform,
    PlatformOs,
    DeviceVersion,
    DeviceModel,
    IpAddress,
    MacAddress,
  } = payload;

  const devicedetails = `DeviceDetails.AppVersion=${
    AppVersion || "error"
  }&DeviceDetails.Platform=${Platform || "error"}&DeviceDetails.PlatformOs=${
    PlatformOs || "error"
  }&DeviceDetails.DeviceVersion=${
    DeviceVersion || "error"
  }&DeviceDetails.DeviceModel=${
    DeviceModel || "error"
  }&DeviceDetails.IpAddress=${IpAddress || "error"}&DeviceDetails.MacAddress=${
    MacAddress || "error"
  }`;

  return devicedetails;
};
