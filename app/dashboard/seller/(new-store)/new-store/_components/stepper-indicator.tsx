"use client"

import React from "react"
import {
    Stepper,
    StepperIndicator,
    StepperItem,
    StepperSeparator,
    StepperTrigger,
    StepperTitle,
    StepperDescription
} from '@/components/ui/stepper'

interface Step {
    number: number;
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
}

interface NewStepperIndicatorProps {
    steps: Step[];
    currentStep: number;
    completedSteps: number[];
    isStepCompleted: (stepIndex: number) => boolean;
    isStepLoading: (stepIndex: number) => boolean;
}

export default function NewStepperIndicator({
                                                steps,
                                                currentStep,
                                                isStepCompleted,
                                                isStepLoading
                                            }: NewStepperIndicatorProps) {
    return (
        <div className="mx-auto  max-w-4xl space-y-8 mb-8">
            <Stepper value={currentStep} >
                {steps.map((step, index) => {
                    const Icon = step.icon;
                    return (
                        <StepperItem
                            key={step.number}
                            step={step.number}
                            completed={isStepCompleted(index)}
                            loading={isStepLoading(index)}
                            className="flex-1"
                        >
                            <StepperTrigger className="flex flex-col items-center gap-2 p-4">
                                <StepperIndicator asChild>
                                    <div className="flex items-center justify-center">
                                        <Icon className="w-4 h-4" />
                                    </div>
                                </StepperIndicator>
                                <div className="text-center">
                                    <StepperTitle className={"hidden sm:block"}>{step.title}</StepperTitle>
                                    <StepperDescription className="hidden sm:block">
                                        {step.description}
                                    </StepperDescription>
                                </div>
                            </StepperTrigger>
                            {index < steps.length - 1 && <StepperSeparator />}
                        </StepperItem>
                    );
                })}
            </Stepper>
        </div>
    )
}
