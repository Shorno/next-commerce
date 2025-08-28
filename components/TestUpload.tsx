import { CldUploadWidget } from "next-cloudinary"

export default function TestUpload() {
    return (
        <CldUploadWidget
            uploadPreset="next_ecommerce"
            options={{
                cloudName: "doxn3qvm3",
                sources: ["local"],
            }}
            onSuccess={(result) => console.log('Success:', result)}
            onError={(error) => console.log('Error:', error)}
        >
            {({ open }) => (
                <button onClick={() => open()}>
                    Test Upload
                </button>
            )}
        </CldUploadWidget>
    )
}
