"use client";

import { Policy } from "@/types/policy";

interface PolicyPreviewProps {
    policy: Policy;
}

export function PolicyPreview({ policy }: PolicyPreviewProps) {
    return (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-sm">
            <h1 className="text-3xl font-bold text-blue-600 text-center mb-8">
                {policy.title}
            </h1>
            
            {policy.sections.map((section, sectionIndex) => (
                <div key={section.id} className="mb-8">
                    <h2 className="text-xl font-semibold text-blue-600 mb-4">
                        {section.title}
                    </h2>
                    
                    {/* Hiển thị các giá trị có thể điều chỉnh */}
                    {section.values.length > 0 && (
                        <div className="mb-4">
                            {section.values.map((value) => (
                                <div key={value.id} className="mb-2">
                                    <span className="font-medium">• {value.label}: </span>
                                    <span className="font-bold text-green-600">
                                        {value.value}{value.unit}
                                    </span>
                                    {value.description && (
                                        <span className="text-gray-600 ml-2">
                                            ({value.description})
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                    
                    {/* Hiển thị các quy tắc */}
                    {section.rules.length > 0 && (
                        <ul className="list-disc ml-6 space-y-1">
                            {section.rules.map((rule, ruleIndex) => (
                                <li key={ruleIndex} className="text-gray-700 leading-relaxed">
                                    {rule}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            ))}
            
            <div className="mt-8 pt-4 border-t text-sm text-gray-500 text-center">
                Phiên bản {policy.version} • 
                Cập nhật lần cuối: {new Date(policy.updatedAt).toLocaleDateString('vi-VN')}
            </div>
        </div>
    );
}
