import { Platform } from "react-native";
import {
  getReadableVersion,
  getSystemVersion,
  getModel,
} from "react-native-device-info";

export const SystemInfo = {
  AppVersion: getReadableVersion() || "incomplete",
  Platform: Platform.OS || "incomplete",
  PlatformOs: Platform.OS || "incomplete",
  DeviceVersion: getSystemVersion() || "incomplete",
  DeviceModel: getModel() || "incomplete",
  MacAddress: "22:22:22:22:22:22",
};
