"use client"
import { LoginForm } from "@/components/ui/login-form"
import bgLogin from "@/../public/bg-auth.jpg"

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10" style={{ backgroundImage: `url(${bgLogin.src})`, backgroundSize: "cover", backgroundPosition: "center" }}>
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  )
}
