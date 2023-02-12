export const getStatusColor = (status: string, colors: any) => {
  switch (status) {
    case "ACCEPTED":
      return colors.neonGreen;
    case "COMPLETED":
      return colors.calpyse;
    case "CANCELLED":
      return colors.danger;
    default:
      return colors.darkerGray;
  }
};

export const getTextStatusColor = (status: string, colors: any) => {
  switch (status) {
    case "COMPLETED":
    case "CANCELLED":
      return colors.white;
    case "ACCEPTED":
      return colors.darkerGray;
    default:
      return colors.darkerGray;
  }
};
