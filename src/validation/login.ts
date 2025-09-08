import * as yup from "yup";

export const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,16}$/;
export const usernameRegex = /^[a-z0-9_]+$/;

export const loginSchema = yup
  .object({
    email: yup
      .string()
      .email("Invalid email format")
      .required("Email is required"),
    password: yup
      .string()
      .matches(
        passwordRegex,
        "Password must contain at least one lowercase letter, one uppercase letter, one number, one special character, and be 8-16 characters long"
      )
      .required("Password is required"),
  })
  .required();

export type LoginFormValues = yup.InferType<typeof loginSchema>;
