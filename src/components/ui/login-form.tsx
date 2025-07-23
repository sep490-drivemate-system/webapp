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
import { FaFacebook } from "react-icons/fa";
import Link from "next/link"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  return (
    <div className={cn("flex flex-col", className)} {...props}>
      <Card className="bg-white/50 backdrop-blur-md border-none shadow-lg rounded-2xl p-6">
        <CardHeader className="flex flex-col gap-2 justify-center items-center pb-2">
          <Link href="/">
            <h1 className="text-3xl font-bold mb-1 mt-2">Drive Mate</h1>
          </Link>

          <h2 className="text-2xl font-bold mb-2">Sign in to your account</h2>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <form>
            <div className="flex flex-col gap-4">
              <Input
                id="email"
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                placeholder="Email"
                required
                className="rounded-lg bg-white/90 border border-gray-300 px-4 py-3 text-base shadow-sm focus:ring-2 focus:ring-blue-200"
              />
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-sm text-gray-700">
                  <label className="flex items-center gap-1">
                    <input type="checkbox" className="rounded mr-1" />
                    Remember me
                  </label>
                  <a href="#" className="text-blue-900/70 hover:underline font-medium">Forgot password?</a>
                </div>
                <Input
                  id="password"
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  placeholder="Password"
                  required
                  className="rounded-lg bg-white/90 border border-gray-300 px-4 py-3 text-base shadow-sm focus:ring-2 focus:ring-blue-200"
                />
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
              <Button type="submit" className="w-full mt-2 bg-[#0074c2] hover:bg-[#00598a] text-white text-base rounded-lg py-3 shadow">
                Sign In
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
