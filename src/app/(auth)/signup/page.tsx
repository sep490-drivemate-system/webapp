"use client"
import bgLogin from "@/../public/bg-auth.jpg"
import { RegisterForm } from "@/components/ui/register-form"

export default function Page() {
    return (
        <div className="flex min-h-svh w-full items-center justify-center" style={{ backgroundImage: `url(${bgLogin.src})`, backgroundSize: "cover", backgroundPosition: "center" }}>
            <div className="w-[40%]">
                <RegisterForm />
            </div>
        </div>
    )
}
