"use client"
import { RegisterForm } from "@/components/ui/register-form"
import bgAuth from "@/../public/bg-auth.avif"

export default function Page() {
    return (
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10" style={{ backgroundImage: `url(${bgAuth.src})`, backgroundSize: "cover", backgroundPosition: "center" }}>
            <div className="w-full max-w-sm md:max-w-3xl">
                <RegisterForm />
            </div>
        </div>
    )
}
