"use client";

import { OtpForm } from "@/components/ui/otp-form";

export default function Page() {
  return (
    <div className="gradient-background w-full h-screen max-h-screen flex justify-center items-center">
      <div className="w-full max-w-4xl">
        <OtpForm />
      </div>
    </div>
  );
}
