import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "../hooks/useAuth";
import { loginSchema, LoginFormValues } from "../validation/login";
import SocialButton from "../components/auth/SocialButton";
import FormInput from "../components/auth/FormInput";
import PasswordInput from "../components/auth/PasswordInput";

const LoginPage = () => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { login, isLoading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setError(null);
      setSuccess(null);
      await login(data.email, data.password);
      setSuccess("Login successful! Redirecting...");
      reset();
      setTimeout(() => {
        // window.location.href = "/dashboard";
      }, 1500);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Login failed. Please try again.");
      }
    }
  };

  return (
    <section className="relative flex min-h-svh w-full items-center justify-evenly bg-[#101720] p-2 sm:p-3">
      {/* Backgrounds */}
      <div className="pointer-events-none absolute inset-0 bg-[url('/login/login-image.png')] bg-cover bg-center opacity-25 sm:opacity-30 lg:hidden" />

      {/* Form Card */}
      <div className="relative z-10 w-full max-w-[420px] rounded-2xl bg-black/50 p-3 sm:p-4 backdrop-blur-md shadow-2xl shadow-black/40 lg:bg-[#282e36] lg:backdrop-blur-0">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-3 text-white"
          noValidate
        >
          {/* Close */}
          <div className="flex w-full justify-end">
            <IoMdClose
              className="h-8 w-8 cursor-pointer rounded-lg bg-white text-black transition-all duration-300 hover:scale-105 hover:bg-gray-100"
              size={22}
              onClick={() => window.history.back()}
            />
          </div>

          {/* Logo */}
          <div className="mx-auto flex flex-col items-center gap-1.5">
            <img
              src="/login/login-logo.png"
              alt="Login Logo"
              className="h-8 w-auto sm:h-10"
            />
            <h1 className="text-lg sm:text-xl font-bold">
              Log in to Soundflow
            </h1>
            <p className="text-center text-[10px] sm:text-[11px] opacity-90">
              Enter your personal data to sign in
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="w-full rounded-lg border border-red-400 bg-red-100 p-3 text-xs sm:text-sm text-red-700">
              {error}
            </div>
          )}
          {/* Success */}
          {success && (
            <div className="w-full rounded-lg border border-green-400 bg-green-100 p-3 text-xs sm:text-sm text-green-700">
              {success}
            </div>
          )}

          {/* Social login */}
          <div className="flex w-full flex-col items-center gap-2">
            {[{ img: "/login/google.png", text: "Google" }].map(
              ({ img, text }) => (
                <SocialButton key={text} iconSrc={img} text={text} />
              )
            )}
          </div>

          <div className="h-px w-full bg-[#676b70]/60"></div>

          {/* Inputs */}
          <div className="flex w-full flex-col gap-3">
            <FormInput
              label="Email"
              id="email"
              type="email"
              placeholder="Email address"
              {...register("email")}
              error={errors.email?.message as string | undefined}
            />
            <PasswordInput
              label="Password"
              id="password"
              placeholder="Password"
              {...register("password")}
              error={errors.password?.message as string | undefined}
            />
            <label className="flex select-none items-center gap-2 text-sm sm:text-base">
              <input type="checkbox" className="h-4 w-4 rounded" />
              <span>Remember me</span>
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!isValid || isLoading}
            className={`mt-1.5 flex h-10 w-full items-center justify-center gap-2 rounded-2xl font-semibold transition-all duration-300 ${
              isValid && !isLoading
                ? "bg-[#1574f5] hover:scale-[1.02] hover:bg-[#1565c0]"
                : "cursor-not-allowed bg-gray-600"
            }`}
          >
            {isLoading ? (
              <>
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                <span className="animate-pulse">Logging in...</span>
              </>
            ) : (
              "Login"
            )}
          </button>

          <a
            href="#"
            className="text-xs sm:text-sm hover:underline text-center"
          >
            Forgot your password?
          </a>
        </form>
      </div>

      {/* Desktop Image */}
      <div className="hidden lg:block">
        <img
          src="/login/login-image.png"
          alt="Login Illustration"
          className="h-[540px] w-[560px] object-contain"
        />
      </div>
    </section>
  );
};

export default LoginPage;
