import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import Link from "next/link";
import { signupSchema, SignupSchema } from "@/schemas/auth/signup.schema";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupSchema>({
    resolver: yupResolver(signupSchema),
  });

  const onSubmit = async (data: SignupSchema) => {
    setIsLoading(true);
    try {
      // Handle registration logic here
      console.log("Registration data:", data);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={cn("flex flex-col gap-6 border-none", className)}
      {...props}
    >
      <Card className="bg-white/50 backdrop-blur-sm border-none">
        <CardHeader className="flex flex-col gap-2 justify-center items-center">
          <CardTitle className="text-3xl font-bold">
            <Link href="/">Drive Mate</Link>
          </CardTitle>
          <CardTitle className="text-2xl font-bold">
            Sign up to your account
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              {/* Personal Information */}
              <div className="space-y-1">
                <Input
                  id="userName"
                  type="text"
                  {...register("userName")}
                  placeholder="User Name"
                  className="bg-white/60 text-black border border-gray-300 rounded-lg px-4 py-2"
                />
                {errors.userName && (
                  <p className="text-red-500 text-sm">{errors.userName.message}</p>
                )}
              </div>

              {/* Contact Information */}
              <div className="space-y-1">
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="Email"
                  className="bg-white/60 text-black border border-gray-300 rounded-lg px-4 py-2"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1">
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                  placeholder="Password"
                  className="bg-white/60 text-black border border-gray-300 rounded-lg px-4 py-2"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <Input
                  id="confirmPassword"
                  type="password"
                  {...register("confirmPassword")}
                  placeholder="Confirm password"
                  className="bg-white/60 text-black border border-gray-300 rounded-lg px-4 py-2"
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-grow border-t border-gray-300"></div>
                <div className="text-black/35 text-sm font-medium px-2">
                  Or Sign in with
                </div>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>
              {/* Social Login Options */}
              <div className="text-center">
                <div className="flex justify-center items-center gap-2">
                  <Button
                    variant="outline"
                    type="button"
                    className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full shadow hover:shadow-md transition"
                  >
                    <FcGoogle className="text-xl" />
                    <span className="text-sm font-medium">Google</span>
                  </Button>
                  <Button
                    variant="outline"
                    type="button"
                    className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full shadow hover:shadow-md transition"
                  >
                    <FaFacebook className="text-xl text-[#1877F2]" />
                    <span className="text-sm font-medium">Facebook</span>
                  </Button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex flex-col gap-3">
                <Button 
                  type="submit" 
                  className="w-full" 
                  variant="blue"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Signing up...
                    </div>
                  ) : (
                    "Sign Up"
                  )}
                </Button>
              </div>
            </div>

            {/* Login Link */}
            <div className="mt-6 text-center text-base">
              Already have an account?{" "}
              <Link href="/signin" className="underline font-medium text-blue-900/80">
                Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
