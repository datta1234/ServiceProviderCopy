import * as yup from "yup";
const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

export const BasicRegistrationSchema = yup.object().shape({
  email: yup
    .string()
    .required("Email is required.")
    .email("Email is not valid."),
  firstName: yup.string().required("First Name is required."),
  lastName: yup.string().required("Last Name is required."),
  mobile: yup
    .string()
    .required("Mobile Number is required.")
    .matches(phoneRegExp, "Mobile Number is not valid")
    .min(9, "Mobile Number is not valid")
    .max(10, "Mobile Number is not valid"),
  address: yup.string().required("Address is required."),
  birthday: yup.string().required("Date of Birth is required."),
  abn: yup.string(),
});

export const SetupPasswordSchema = yup.object().shape({
  password: yup
    .string()
    .required("Password is required.")
    .min(8, "Eight (8) characters")
    .matches(RegExp("(.*[a-z].*)"), "One (1) lowercase letter")
    .matches(RegExp("(.*[A-Z].*)"), "One (1) uppercase letter")
    .matches(RegExp("(.*\\d.*)"), "One (1) number")
    .matches(RegExp('[!@#$%^&*(),.?":{}|<>]'), "One (1) special character"),
  password2: yup
    .string()
    .required("Confirm Password")
    .oneOf([yup.ref("password"), null], "Password does not match"),
});
