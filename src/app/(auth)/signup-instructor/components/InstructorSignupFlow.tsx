"use client"

import { useState } from "react"
import { InstructorStep1Requirements } from "./InstructorStep1Requirements"
import { InstructorStep2Vehicle } from "./InstructorStep2Vehicle"
import { InstructorStep3Judicial } from "./InstructorStep3Judicial"
import { InstructorStep4Cooperative } from "./InstructorStep4Cooperative"
import { InstructorStep5Documents } from "./InstructorStep5Documents"
import { InstructorRegistrationData, InstructorSignupRequest } from "../../../../types/auth/signup-instructor.types"
import { useAppDispatch } from "@/lib/redux/useAppDispatch"
import { signUpInstructor } from "@/features/auth/authThunk"

type InstructorStep = 1 | 2 | 3 | 4 | 5

export function InstructorSignupFlow() {
    const [currentStep, setCurrentStep] = useState<InstructorStep>(1)
    const [loading, setLoading] = useState(false)
    const dispatch = useAppDispatch()

    const handleNext = () => {
        if (currentStep < 5) {
            setCurrentStep((prev) => (prev + 1) as InstructorStep)
        } else {
            // Complete registration
            setLoading(true)
            console.log('Completing instructor registration...')

            // Simulate API call
            setTimeout(() => {
                setLoading(false)
                console.log('Instructor registration completed successfully!')
                // Redirect to success page or dashboard
            }, 2000)
        }
    }

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep((prev) => (prev - 1) as InstructorStep)
        }
    }

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return <InstructorStep1Requirements onNext={handleNext} onBack={handleBack} />

            case 2:
                return <InstructorStep2Vehicle onNext={handleNext} onBack={handleBack} />

            case 3:
                return <InstructorStep3Judicial onNext={handleNext} onBack={handleBack} />

            case 4:
                return <InstructorStep4Cooperative onNext={handleNext} onBack={handleBack} />

            case 5:
                return <InstructorStep5Documents onNext={async (dto: InstructorSignupRequest) => {
                    setLoading(true)
                    try {
                        // DTO is converted to FormData inside the thunk
                        const result = await dispatch(signUpInstructor(dto)).unwrap()
                        console.log('Instructor registration successful:', result)
                        // Redirect to success page or show success message
                        handleNext()
                    } catch (error) {
                        console.error('Instructor registration failed:', error)
                        // Handle error (show error message, etc.)
                    } finally {
                        setLoading(false)
                    }
                }} onBack={handleBack} loading={loading} />

            default:
                return <InstructorStep1Requirements onNext={handleNext} onBack={handleBack} />
        }
    }

    return (
        <div className="w-full max-w-2xl mx-auto">
            {/* Progress indicator */}
            {/* <div className="mb-6">
                <div className="flex items-center justify-center space-x-2">
                    {[1, 2, 3, 4, 5].map((step) => (
                        <div
                            key={step}
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step <= currentStep
                                ? 'bg-green-600 text-white'
                                : 'bg-white/20 text-gray-400'
                                }`}
                        >
                            {step}
                        </div>
                    ))}
                </div>
                <div className="mt-2 text-center">
                    <p className="text-sm text-gray-300">
                        Bước {currentStep} / 5
                    </p>
                </div>
            </div> */}

            {renderStep()}
        </div>
    )
}
