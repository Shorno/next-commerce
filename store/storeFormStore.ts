import {create} from "zustand";
import {
   PartialStoreSubmissionData
} from "@/zodSchema/store";
import {persist} from "zustand/middleware";
import {immer} from "zustand/middleware/immer"

interface StoreFormState {
    step: 1 | 2 | 3 | 4,
    data: PartialStoreSubmissionData
    setStep: (step: 1 | 2 | 3 | 4) => void


    nextStep: () => void,
    prevStep: () => void,
    setFormData: (data: Partial<PartialStoreSubmissionData>) => void,
    resetForm: () => void,
}


export const useStoreForm = create<StoreFormState>()(
    persist(
        immer((set) => ({
            step: 1,
            data: {},


            setStep: (step) => set((state) => {
                state.step = step
            }),

            nextStep: () => set((state) => {
                if (state.step < 4) state.step++
            }),
            prevStep: () => set((state) => {
                if (state.step > 1) state.step--
            }),

            setFormData: (values) =>
                set((state) => {
                    Object.assign(state.data, values)
                }),

            resetForm: () =>
                set((state) => {
                    state.step = 1
                    state.data = {}
                }),
        })),
        {
            name: "store-form",
            partialize: (state) => ({
                step: state.step,
                data: state.data,
            }),

        },
    )
)