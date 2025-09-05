"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
    return (
        <div>
            <main className="flex min-h-screen items-center justify-center">
                <Link href="/signup-instructor"><Button className="cursor-pointer" variant="outline">Đăng ký trở thành người hướng dẫn</Button></Link>

            </main>
        </div>
    );
}
