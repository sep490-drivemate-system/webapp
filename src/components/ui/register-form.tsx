import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import Link from "next/link";

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle registration logic here
    console.log("Registration data:", formData);
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
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              {/* Personal Information */}
              <div className="space-y-2">
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  onChange={handleInputChange}
                  value={formData.userName}
                  placeholder="User Name"
                  required
                  className="bg-white/60 text-black border border-gray-300 rounded-lg px-4 py-2"
                />
              </div>

              {/* Contact Information */}
              <div className="space-y-2">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  onChange={handleInputChange}
                  value={formData.email}
                  placeholder="Email"
                  required
                  className="bg-white/60 text-black border border-gray-300 rounded-lg px-4 py-2"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Input
                  id="password"
                  name="password"
                  type="password"
                  onChange={handleInputChange}
                  value={formData.password}
                  placeholder="Password"
                  required
                  className="bg-white/60 text-black border border-gray-300 rounded-lg px-4 py-2"
                />
              </div>

              <div className="space-y-2">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  onChange={handleInputChange}
                  value={formData.confirmPassword}
                  placeholder="Confirm password"
                  required
                  className="bg-white/60 text-black border border-gray-300 rounded-lg px-4 py-2"
                />
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
                <Button type="submit" className="w-full" variant="blue">
                  Sign Up
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
