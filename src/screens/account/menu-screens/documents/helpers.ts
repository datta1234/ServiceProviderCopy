import { toLower } from "lodash";

export const getCardBgColor = (status: string) => {
  switch (toLower(status)) {
    case "completed":
      return "#F2FAFF";
    case "incomplete":
      return "#F8DDDA";
    case "pending":
      return "#FEF1DB";
    default:
      return "#F2FAFF";
  }
};
export const getStatusBgColor = (status: string) => {
  switch (toLower(status)) {
    case "completed":
      return "#3498DB";
    case "incomplete":
      return "#E74C";
    case "pending":
      return "#F39C12";
    default:
      return "#3498DB";
  }
};
