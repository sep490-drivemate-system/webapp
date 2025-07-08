import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaMap } from "react-icons/fa";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="bg-white/50 backdrop-blur-sm border-none">
        <CardHeader className="flex flex-col gap-2 justify-center items-center">
          <CardTitle className="text-2xl font-bold">Login to your account</CardTitle>
          <CardDescription className="text-sm text-gray-500">
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Input
                  id="email"
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-3">
                <div className="flex justify-between text-sm text-black/35 mb-4">
                  <label>
                    <input type="checkbox" className="mr-1" />
                    Lưu mật khẩu
                  </label>
                  <a href="#" className="underline">
                    Quên mật khẩu?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  placeholder="********"
                  required
                />
              </div>
              <div className="text-black/35 text-sm font-medium">Đăng nhập với</div>
              <div className="flex justify-center items-center gap-2 ">
                <Button
                  variant="outline"
                  type="button"
                  //  onClick={() => handleGoogleLogin()}
                  className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full shadow hover:shadow-md transition"
                >
                  <FcGoogle className="text-xl" />
                  <span className="text-sm font-medium">Google</span>
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  //  onClick={() => handleGoogleLogin()}
                  className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full shadow hover:shadow-md transition"
                >
                  <FaFacebook className="text-xl" />
                  <span className="text-sm font-medium">Facebook</span>
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  //  onClick={() => handleGoogleLogin()}
                  className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full shadow hover:shadow-md transition"
                >
                  <FaMap className="text-xl" />
                  <span className="text-sm font-medium">ZaLo</span>
                </Button>
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <a href="#" className="underline underline-offset-4">
                Sign up
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
