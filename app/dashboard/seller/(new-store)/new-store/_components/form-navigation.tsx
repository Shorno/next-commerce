import React from 'react';
import {ChevronLeft, ChevronRight, Loader, Save} from 'lucide-react';
import {Button} from "@/components/ui/button";

interface FormNavigationProps {
    currentStep: number;
    totalSteps: number;
    onPrevious: () => void;
    onNext: () => void;
    onSubmit: () => void;
    isValidating?: boolean;
    isSubmitting?: boolean;
}

export default function FormNavigation({
                                           currentStep,
                                           totalSteps,
                                           onPrevious,
                                           onNext,
                                           onSubmit,
                                           isValidating = false,
                                           isSubmitting = false
                                       }: FormNavigationProps) {
    const isFirstStep = currentStep === 1;
    const isLastStep = currentStep === totalSteps;
    const isLoading = isValidating || isSubmitting;

    return (
        <div className="flex mx-auto max-w-4xl items-center justify-between pt-8">
            <Button
                size={"lg"}
                type="button"
                variant="outline"
                onClick={onPrevious}
                disabled={isFirstStep || isLoading}
            >
                <ChevronLeft className="w-4 h-4"/>
                Previous
            </Button>

            {isLastStep ? (
                <Button
                    size={"lg"}
                    type="button"
                    onClick={onSubmit}
                    disabled={isLoading}
                >
                    <Save className="w-4 h-4"/>
                    {isSubmitting ? 'Submitting...' : 'Complete Setup'}
                </Button>
            ) : (
                <Button
                    size={"lg"}
                    className={"w-20"}
                    type="button"
                    onClick={onNext}
                    disabled={isLoading}
                >
                    {isValidating ? <Loader className={"animate-spin"}/> :
                        <>
                            Next<ChevronRight className="w-4 h-4"/>
                        </>
                    }
                </Button>
            )}
        </div>
    );
}
