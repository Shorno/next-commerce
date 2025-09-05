"use client"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {Button} from "@/components/ui/button";

export default function NotFound() {
    const router = useRouter();

    return (
        <div className="flex flex-col w-full justify-center items-center min-h-screen  p-4">
            <div className="text-center max-w-md">
                <h1 className="text-6xl font-bold  mb-4">404</h1>
                <h2 className="text-2xl font-semibold  mb-2">Page Not Found</h2>
                <p className=" mb-8">
                    Sorry, we couldn&apos;t find the page you&apos;re looking for.
                    It might have been moved, deleted, or you entered the wrong URL.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                        onClick={() => router.back()}
                        className="px-6 py-3 rounded-lg0 font-medium"
                    >
                        ← Go Back
                    </Button>
                    <Button asChild>
                        <Link href="/" className="px-6 py-3   rounded-lg  font-medium text-center">
                            🏠 Return Home
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
