import * as yup from "yup";

export const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,16}$/;
export const usernameRegex = /^[a-z0-9_]+$/;

export const registerSchema = yup
  .object({
    name: yup
      .string()
      .min(3, "Name must be at least 3 characters")
      .max(30, "Name cannot exceed 30 characters")
      .required("Name is required"),
    username: yup
      .string()
      .matches(
        usernameRegex,
        "Username can only contain lowercase letters, numbers, and underscores"
      )
      .required("Username is required"),
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

export type RegisterFormValues = yup.InferType<typeof registerSchema>;
