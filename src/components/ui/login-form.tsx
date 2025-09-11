import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { FcGoogle } from "react-icons/fc";
import Link from "next/link"
import Image from "next/image"
import bgLogin from "@/../public/bg-login.jpg"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 bg-white/10 backdrop-blur-md border-none shadow-lg rounded-2xl">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <Link href="/" className="flex items-center justify-center gap-3">
                  <Image
                    src="/logo.png"
                    alt="Logo"
                    width={48}
                    height={48}
                    priority
                    className="h-12 w-12 object-contain"
                  />
                  <h1 className="text-xl font-bold m-0">Drive Mate</h1>
                </Link>
                <p >
                  Đăng nhập vào tài khoản của bạn
                </p>
              </div>
              <div className="grid gap-3">
                <Input
                  id="email"
                  className="text-white placeholder:text-gray-400"
                  type="email"
                  placeholder="Email hoặc số điện thoại"
                  required
                />
              </div>
              <div className="grid gap-3">
                <Input id="password" type="password" placeholder="Mật khẩu" required />
                <div className="flex items-center text-white">
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Quên mật khẩu?
                  </a>
                </div>
              </div>
              <Button type="submit" className="w-full bg-[#0074c2] hover:bg-[#00598a]">
                Đăng nhập
              </Button>
              <div className="flex items-center text-sm text-muted-foreground">
                <span className="flex-grow border-t border-border"></span>
                <span className="px-3 flex items-center gap-2 text-white">
                  Hoặc tiếp tục với
                  <Button
                    variant="outline"
                    type="button"
                    className="flex items-center justify-center gap-2 px-3 py-1 h-auto"
                  >
                    <FcGoogle className="h-5 w-5" />
                  </Button>
                </span>
                <span className="flex-grow border-t border-border"></span>
              </div>

              <div className="text-center text-sm text-gray-300">
                Bạn chưa có tài khoản?{" "}
                <Link href="/signup" className="underline underline-offset-4 text-white hover:text-gray-300">
                  Đăng ký
                </Link>
              </div>
             
            </div>
          </form>
          <div className="bg-muted relative hidden md:block">
            <Image
              src={bgLogin}
              alt="Image"
              fill
              priority
              className="object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
