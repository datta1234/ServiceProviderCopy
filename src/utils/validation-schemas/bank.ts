import * as yup from "yup";
export const AddBankSchema = yup
  .object({
    accountHolderName: yup.string().required("Account Name is required"),
    accountNumber: yup.string().required("Account Number is required"),
    routingNumber: yup.string().required("Routing Number is required")    
    .min(6, 'Must be exactly 6 digits')
    .max(6, 'Must be exactly 6 digits'),
  })
  .required();