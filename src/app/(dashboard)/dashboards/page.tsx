"use client";
import { ChartAreaInteractive } from "@/components/commons/dashboard/chart-area-interactive"
import { DataTable } from "@/components/commons/dashboard/data-table"
import { SectionCards } from "@/components/commons/dashboard/section-cards"
import { useRequireAuth } from "@/hooks/auth/useRequireAuth"
import { UserRole } from "@/types/auth/user-role.enum"

import data from "../data.json"

export default function Page() {
    //useRequireAuth([UserRole.Admin])
    return (
        <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                    <SectionCards />
                    <div className="px-4 lg:px-6">
                        <ChartAreaInteractive />
                    </div>
                    <DataTable data={data} />
                </div>
            </div>
        </div>
    );
}
