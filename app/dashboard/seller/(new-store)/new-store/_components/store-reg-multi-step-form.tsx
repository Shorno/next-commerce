"use client"
import {useStoreForm} from "@/store/storeFormStore";
import React, {useState, useTransition} from "react";
import {
    basicInfoSchema,
    getMissingStoreFields,
    storeContactSchema,
    storePolicySchema,
    validateCompleteStoreForm
} from "@/zodSchema/store";
import {toast} from "sonner";
import {createStore} from "@/actions/storeActions";
import NewStepperIndicator from "@/app/dashboard/seller/(new-store)/new-store/_components/stepper-indicator";
import FormNavigation from "@/app/dashboard/seller/(new-store)/new-store/_components/form-navigation";
import {Eye, Mail, Shield, Store} from "lucide-react";
import BasicInfoForm from "@/app/dashboard/seller/(new-store)/new-store/_components/basic-info-form";
import StoreContactForm from "@/app/dashboard/seller/(new-store)/new-store/_components/store-contact-form";
import StorePolicyForm from "@/app/dashboard/seller/(new-store)/new-store/_components/store-policy-form";
import StoreReviewForm from "@/app/dashboard/seller/(new-store)/new-store/_components/store-review-form";

const steps = [
    {
        number: 1,
        title: 'Basic Info',
        description: 'Enter your store information',
        icon: Store,
        component: BasicInfoForm,
        schema: basicInfoSchema
    },
    {
        number: 2,
        title: 'Contact & Cover',
        description: 'Add contact details and cover image',
        icon: Mail,
        component: StoreContactForm,
        schema: storeContactSchema
    },
    {
        number: 3,
        title: 'Policies',
        description: 'Set up your store policies',
        icon: Shield,
        component: StorePolicyForm,
        schema: storePolicySchema
    },
    {
        number: 4,
        title: 'Review',
        description: 'Review your information',
        icon: Eye,
        component: StoreReviewForm,
        schema: null
    }
];

export default function StoreRegMultiStepForm(){
    const {step, data, nextStep, prevStep} = useStoreForm();
    const [completedSteps, setCompletedSteps] = useState<number[]>([]);
    const [isValidating, setIsValidating] = useState(false);
    const [isSubmitting, startTransition] = useTransition();

    const currentStepData = steps.find(s => s.number === step);
    const CurrentStepComponent = currentStepData?.component;

    const validateCurrentStep = async () => {
        if (step === 4) return true;

        const currentSchema = currentStepData?.schema;
        if (!currentSchema) return true;

        setIsValidating(true);

        await new Promise((resolve) => setTimeout(resolve, 1000));

        try {
            currentSchema.parse(data);
            setIsValidating(false);
            return true;
        } catch  {
            setIsValidating(false);
            return false;
        }
    };

    const handleNext = async () => {
        const isValid = await validateCurrentStep();

        if (isValid) {
            setCompletedSteps((prev) => [...prev, step - 1]);
            nextStep();
        }
    };

    const handlePrevious = () => {
        prevStep();
    };

    const handleSubmit = () => {
        startTransition(async () => {
            if (!validateCompleteStoreForm(data)) {
                const missingFields = getMissingStoreFields(data);
                toast.error(`Please complete all required fields: ${missingFields.join(', ')}`);
                return;
            }

            const response = await createStore(data);
            if (response.success) {
                toast.success(response.message);
                setCompletedSteps((prev) => [...prev, step - 1]);
            } else {
                toast.error(response.message);
                return;
            }
        });
    }

    const isStepCompleted = (stepIndex: number) => {
        return completedSteps.includes(stepIndex);
    };

    const isStepLoading = (stepIndex: number) => {
        return stepIndex === (step - 1) && (isValidating || isSubmitting);
    };

    return (
        <>
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-foreground mb-4">
                    Set Up Your Store
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Complete these steps to get your store ready for customers.
                    Your progress is automatically saved.
                </p>
            </div>

            <NewStepperIndicator
                steps={steps}
                currentStep={step}
                completedSteps={completedSteps}
                isStepCompleted={isStepCompleted}
                isStepLoading={isStepLoading}
            />


            <div className="transition-all duration-300 ease-in-out">
                {CurrentStepComponent && <CurrentStepComponent/>}
            </div>

            <div className="mt-8">
                <FormNavigation
                    currentStep={step}
                    totalSteps={steps.length}
                    onPrevious={handlePrevious}
                    onNext={handleNext}
                    onSubmit={handleSubmit}
                    isValidating={isValidating}
                    isSubmitting={isSubmitting}
                />
            </div>

        </>
    )
}