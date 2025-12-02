"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Check, X, Clock } from "lucide-react";

export type StepStatus = "completed" | "active" | "inactive" | "rejected";

export interface Step {
  id: number;
  title: string;
  status: StepStatus;
  description?: string;
  linkText?: string;
  linkHref?: string;
}

interface StepProgressProps {
  steps: Step[];
  className?: string;
}

export function StepProgress({ steps, className }: StepProgressProps) {
  const getStepIcon = (status: StepStatus) => {
    switch (status) {
      case "completed":
        return <Check className="w-4 h-4 text-white" />;
      case "rejected":
        return <X className="w-4 h-4 text-white" />;
      case "active":
        return <Clock className="w-4 h-4 text-white" />;
      default:
        return null;
    }
  };

  const getStepCircleClass = (status: StepStatus) => {
    switch (status) {
      case "completed":
        return "bg-[#10b981] border-[#10b981]";
      case "rejected":
        return "bg-red-500 border-red-500";
      case "active":
        return "bg-[#10b981] border-[#10b981] animate-pulse";
      default:
        return "bg-gray-400 border-gray-400";
    }
  };

  const getStepLineClass = (
    currentStatus: StepStatus,
    nextStatus: StepStatus
  ) => {
    if (currentStatus === "completed") {
      return "bg-[#10b981]";
    }
    if (currentStatus === "rejected" || nextStatus === "rejected") {
      return "bg-red-500";
    }
    return "bg-gray-400";
  };

  const getStepTitleClass = (status: StepStatus) => {
    switch (status) {
      case "completed":
        return "text-[#10b981] font-semibold";
      case "rejected":
        return "text-red-500 font-semibold";
      case "active":
        return "text-[#10b981] font-semibold";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className={cn("", className)}>
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        const nextStep = !isLast ? steps[index + 1] : null;

        return (
          <div key={step.id} className="flex gap-4 mb-6 last:mb-0">
            {/* Icon Column */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 relative z-10",
                  getStepCircleClass(step.status)
                )}
              >
                {getStepIcon(step.status)}
              </div>
              {!isLast && (
                <div
                  className={cn(
                    "w-0.5 mt-2 h-10",
                    getStepLineClass(
                      step.status,
                      nextStep?.status || "inactive"
                    )
                  )}
                />
              )}
            </div>

            {/* Text Container */}
            <div className="flex-1 pt-1">
              <h3 className={getStepTitleClass(step.status)}>{step.title}</h3>
              {step.description && (
                <p className="text-sm text-gray-300 mt-2">{step.description}</p>
              )}
              {step.linkText && step.linkHref && (
                <Link
                  href={step.linkHref}
                  className="text-[#10b981] text-sm mt-2 inline-block hover:underline"
                >
                  {step.linkText}
                </Link>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
