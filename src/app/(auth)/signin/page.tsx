"use client";

import { LoginForm } from "@/components/ui/login-form";

export default function Page() {
  return (
    <div className="gradient-background w-full h-screen max-h-screen flex justify-center items-center">
      <div className="w-full max-w-4xl">
        <LoginForm />
      </div>
    </div>
  );
}
