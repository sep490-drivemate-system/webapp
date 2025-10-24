"use client";

import { PolicyPreview } from "@/components/policy/PolicyPreview";
import { mockPolicies } from "@/data/mock-policies";

export default function TermsPage() {
    // Lấy policy đầu tiên (Điều Khoản) từ mock data
    const policy = mockPolicies[0];

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <PolicyPreview policy={policy} />
            </div>
        </div>
    );
}
