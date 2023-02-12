import * as yup from "yup";
const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

export const LoginSchema = yup
  .object({
    mobile: yup
      .string()
      .required("Mobile Number is required.")
      .matches(phoneRegExp, "Mobile Number is not valid")
      .min(9, "Mobile Number is not valid")
      .max(11, "Mobile Number is not valid"),
    password: yup.string().required("Password is required"),
  })
  .required();
