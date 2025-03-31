"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signup } from "@/actions/auth/authentication.actions";
import { signupSchema } from "@/schemas/auth/signup.schemas";
import { useRouter } from "next/navigation";

const SignupPage = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      full_name: "",
      email: "",
      password: "",
      username: "",
    },
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      await signup(data);
      router.push("/");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = async () => {
    let fields: ("full_name" | "email" | "password" | "username" | "terms")[] =
      [];

    if (currentStep === 1) {
      fields = ["full_name", "email"];
    } else if (currentStep === 2) {
      fields = ["password"];
    }

    const isValid = await trigger(fields);
    if (isValid) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const renderStepFields = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            {/* Full Name */}
            <div>
              <label
                htmlFor="full_name"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <input
                id="full_name"
                {...register("full_name")}
                placeholder="John Doe"
                className="w-full rounded-2xl border border-gray-300 p-3 focus:border-[#00A35B] focus:outline-none"
              />
              {errors.full_name && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.full_name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="mt-4">
              <label
                htmlFor="email"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                {...register("email")}
                placeholder="john@example.com"
                className="w-full rounded-2xl border border-gray-300 p-3 focus:border-[#00A35B] focus:outline-none"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>
          </>
        );
      case 2:
        return (
          <>
            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                {...register("password")}
                placeholder="••••••••"
                className="w-full rounded-2xl border border-gray-300 p-3 focus:border-[#00A35B] focus:outline-none"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>
          </>
        );
      case 3:
        return (
          <>
            <div className="mt-4">
              <label
                htmlFor="username"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <input
                id="username"
                {...register("username")}
                placeholder="john_doe"
                className="w-full rounded-2xl border border-gray-300 p-3 focus:border-[#00A35B] focus:outline-none"
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.username.message}
                </p>
              )}
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <main className="flex min-h-screen">
      <section className="hidden md:flex w-1/2 relative pl-5 py-5">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="h-full w-full object-cover rounded-3xl"
        >
          <source
            src="/assets/videos/lilia-auth-background.mov"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
      </section>

      <section className="flex w-full flex-col justify-center bg-white p-8 md:w-1/2">
        <h2 className="text-center text-3xl font-bold text-gray-800">
          Create <br /> Lilia Account
        </h2>

        <div className="mx-auto w-full max-w-md rounded-2xl p-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            {renderStepFields()}

            {currentStep === 3 && (
              <div className="mt-4 flex items-center">
                <input
                  type="checkbox"
                  id="terms"
                  {...register("terms")}
                  className="mr-2 h-4 w-4 rounded border-gray-300 text-[#00A35B] focus:ring-[#00A35B]"
                />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  I agree to the{" "}
                  <a href="#" className="text-[#00A35B] hover:underline">
                    terms of service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-[#00A35B] hover:underline">
                    privacy policy
                  </a>
                </label>
                {errors.terms && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.terms.message}
                  </p>
                )}
              </div>
            )}

            <div className="mt-6 flex items-center justify-between">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep((prev) => prev - 1)}
                  disabled={isLoading}
                  className="rounded-full border border-gray-300 bg-white px-4 py-2 text-gray-600 hover:bg-gray-100"
                >
                  Back
                </button>
              )}
              {currentStep < 3 && (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={isLoading}
                  className="rounded-full bg-[#00A35B] px-4 py-2 font-semibold text-white hover:bg-[#00A35B]"
                >
                  Next
                </button>
              )}
              {currentStep === 3 && (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="rounded-full bg-[#00A35B] px-4 py-2 font-semibold text-white hover:bg-[#00A35B]"
                >
                  {isLoading ? "Signing up..." : "Sign Up"}
                </button>
              )}
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <a href="/auth/login" className="text-[#00A35B] hover:underline">
              Log In
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}

export default SignupPage;
