"use client"

import bgAuth from "@/../public/bg-auth.avif"
import Image from "next/image"
import Link from "next/link"
import { InstructorSignupFlow } from "./components/InstructorSignupFlow"
import { Card, CardContent } from "@/components/ui/card"

export default function Page() {
    return (
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10" style={{ backgroundImage: `url(${bgAuth.src})`, backgroundSize: "cover", backgroundPosition: "center" }}>
            <div className="w-full max-w-4xl mx-auto">
                <Card className="overflow-hidden p-0 bg-white/10 backdrop-blur-sm border-none shadow-2xl rounded-2xl">
                    <CardContent className="p-8">
                        <div className="w-full max-w-2xl mx-auto">
                            {/* Header with logo */}
                            <div className="flex justify-center mb-8">
                                <Link href="/" className="flex items-center justify-center gap-3">
                                    <Image
                                        src="/logo.png"
                                        alt="Logo"
                                        width={48}
                                        height={48}
                                        priority
                                        className="h-12 w-12 object-contain"
                                    />
                                    <h1 className="text-2xl font-bold text-white">Drive Mate</h1>
                                </Link>
                            </div>
                            <InstructorSignupFlow />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
