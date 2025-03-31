"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/schemas/auth/login.schemas";
import { emailLogin } from "@/actions/auth/authentication.actions";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      await emailLogin(data);
      router.push("/");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen font-serif">
      {/* Left Panel with Video Background */}
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

      {/* Right Panel: Login Form */}
      <section className="flex w-full flex-col justify-center bg-white p-8 md:w-1/2">
        <h2 className="text-center text-3xl font-bold text-gray-800">
          Welcome Back
        </h2>
        <div className="mx-auto w-full max-w-md rounded-[1.25rem] p-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Email Field */}
            <div>
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
                placeholder="Email Address"
                className="w-full rounded-[1.25rem] border border-gray-300 p-3 focus:border-[#00A35B] focus:outline-none"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="mt-4">
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
                placeholder="Password"
                className="w-full rounded-[1.25rem] border border-gray-300 p-3 focus:border-[#00A35B] focus:outline-none"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="mt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-full bg-[#00A35B] px-4 py-2 font-semibold text-white hover:bg-[#00A35B]"
              >
                {isLoading ? "Logging in..." : "Log In"}
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <a
              href="/auth/signup"
              className="text-[#00A35B] hover:underline"
            >
              Sign Up
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}

export default LoginPage;
