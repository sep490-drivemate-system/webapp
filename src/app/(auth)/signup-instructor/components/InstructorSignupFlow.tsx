"use client"

import { useState } from "react"
import { InstructorStep1Requirements } from "./InstructorStep1Requirements"
import { InstructorStep2Vehicle } from "./InstructorStep2Vehicle"
import { InstructorStep3Judicial } from "./InstructorStep3Judicial"
import { InstructorStep4Cooperative } from "./InstructorStep4Cooperative"
import { InstructorStep5Documents } from "./InstructorStep5Documents"
import { InstructorSignupRequest } from "../../../../types/auth/signup-instructor.types"
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
            setLoading(true)
            console.log('Completing instructor registration...')
            setTimeout(() => {
                setLoading(false)
                console.log('Instructor registration completed successfully!')
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
                        const result = await dispatch(signUpInstructor(dto)).unwrap()
                        console.log('Instructor registration successful:', result)
                        handleNext()
                    } catch (error) {
                        console.error('Instructor registration failed:', error)
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
            {renderStep()}
        </div>
    )
}
