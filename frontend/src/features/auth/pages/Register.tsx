import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate,Link  } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import heroImg from "@/assets/login_jpg.jpg";

// services
import { authService } from "@/services/auth.service";
import type { SignupRequest } from "@/models/auth.model";

// toast
import { toastService } from "@/utils/toast.service";

// ================= SCHEMA =================
const signupSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Min 6 characters"),
});

type SignupForm = z.infer<typeof signupSchema>;

export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  });

  // ================= SIGNUP =================
  const onSubmit = async (data: SignupForm) => {
    const loadingId = toastService.loading("Creating account...");

    try {
      const payload: SignupRequest = {
        name: data.name,   // ✅ FIXED (capital N as per model)
        email: data.email,
        password: data.password,
      };

      await authService.signup(payload);

      toastService.dismiss(loadingId);
      toastService.success("Account created successfully");

      navigate("/login");
    } catch (error: any) {
      toastService.dismiss(loadingId);
      toastService.error(error?.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f7f3ee] to-[#f1ece4] px-6">

      <div className="w-full max-w-6xl grid md:grid-cols-2 items-center gap-10">

        {/* LEFT - FORM */}
        <div className="flex justify-center">
          <Card className="w-full max-w-md rounded-3xl border-0 shadow-2xl bg-white/90 backdrop-blur-md">

            <CardHeader className="text-center space-y-2 pt-10">
              <CardTitle className="text-3xl font-bold text-gray-900">
                Create Account
              </CardTitle>
              <p className="text-sm text-gray-500">
                Sign up to get started
              </p>
            </CardHeader>

            <CardContent className="px-8 pb-10">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                {/* NAME */}
                <div>
                  <Input
                    placeholder="Full Name"
                    className="h-11 rounded-xl"
                    {...register("name")}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* EMAIL */}
                <div>
                  <Input
                    placeholder="Email Address"
                    className="h-11 rounded-xl"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* PASSWORD */}
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="h-11 rounded-xl pr-10"
                    {...register("password")}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-xs text-gray-500 hover:text-black"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>

                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* BUTTON */}
                <Button
                  className="w-full h-11 rounded-xl text-base font-medium bg-black hover:bg-black/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating..." : "Sign up"}
                </Button>
                {/* LOGIN LINK */}
                <p className="text-center text-sm text-gray-600 mt-4">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-blue-600 font-medium hover:underline"
                  >
                    Login
                  </Link>
                </p>

              </form>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT IMAGE */}
        <div className="hidden md:flex justify-center">
          <div className="relative">
            <img
              src={heroImg}
              alt="signup"
              className="w-[90%] rounded-2xl shadow-2xl"
            />
            <div className="absolute inset-0 bg-black/10 rounded-2xl" />
          </div>
        </div>

      </div>
    </div>
  );
}