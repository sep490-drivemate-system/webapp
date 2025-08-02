import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaEye, FaEyeSlash } from "react-icons/fa";
import Link from "next/link"
import { useSignIn } from "@/hooks/auth/useSignIn"
import { signinSchema, SigninSchema } from "@/schemas/auth/signin.schema"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { handleSignIn } = useSignIn()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninSchema>({
    resolver: yupResolver(signinSchema),
  })

  const onSubmit = async (data: SigninSchema) => {
    setIsLoading(true)
    try {
      await handleSignIn(data)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col", className)} {...props}>
      <Card className="bg-white/50 backdrop-blur-md border-none shadow-lg rounded-2xl p-6">
        <CardHeader className="flex flex-col justify-center items-center pb-2">
          <Link href="/">
            <h1 className="text-2xl font-bold mb-1 mt-2">Drive Mate</h1>
          </Link>

          <h2 className="text-lg font-bold mb-2">Sign in to your account</h2>
        </CardHeader>
        <CardContent className="flex flex-col">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-4">
              <div className="space-y-1">
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="Email"
                  className="rounded-lg bg-white/90 border border-gray-300 px-4 py-3 text-base shadow-sm focus:ring-2 focus:ring-blue-200"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>
              
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-sm text-gray-700">
                  <label className="flex items-center gap-1">
                    <input type="checkbox" className="rounded mr-1" />
                    Remember me
                  </label>
                  <a href="#" className="text-blue-900/70 hover:underline font-medium">Forgot password?</a>
                </div>
                <div className="relative space-y-1">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    placeholder="Password"
                    className="rounded-lg bg-white/90 border border-gray-300 px-4 py-3 pr-10 text-base shadow-sm focus:ring-2 focus:ring-blue-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-800"
                    tabIndex={-1}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                  {errors.password && (
                    <p className="text-red-500 text-sm">{errors.password.message}</p>
                  )}
                </div>
                <div className="flex items-center my-2">
                  <div className="flex-1 h-px bg-gray-300" />
                  <span className="mx-3 text-gray-500 text-sm font-medium">Or Sign in with</span>
                  <div className="flex-1 h-px bg-gray-300" />
                </div>
              </div>
              <div className="flex justify-center items-center gap-4">
                <Button
                  variant="outline"
                  type="button"
                  className="flex items-center gap-2 bg-white text-black px-6 py-2 rounded-full shadow hover:shadow-md transition border border-gray-300"
                >
                  <FcGoogle className="text-xl" />
                  <span className="text-base font-medium">Google</span>
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  className="flex items-center gap-2 bg-white text-black px-6 py-2 rounded-full shadow hover:shadow-md transition border border-gray-300"
                >
                  <FaFacebook className="text-xl text-[#1877f3]" />
                  <span className="text-base font-medium">Facebook</span>
                </Button>
              </div>
              <Button
                type="submit"
                className="w-full mt-2 bg-[#0074c2] hover:bg-[#00598a] text-white text-base rounded-lg py-3 shadow"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>

            </div>
            <div className="mt-6 text-center text-base">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="underline font-medium text-blue-900/80">Sign up</Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
