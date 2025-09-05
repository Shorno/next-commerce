"use client"
import Link from 'next/link'
import {useRouter} from 'next/navigation'
import {Button} from "@/components/ui/button";

export default function NotFound() {
    const router = useRouter();

    return (
        <div className="flex flex-col w-full justify-center items-center min-h-screen p-4">
            <div className="text-center max-w-md">
                <h1 className="text-6xl font-bold mb-4">🏪</h1>
                <h2 className="text-2xl font-semibold mb-2">Store Not Found</h2>
                <p className="mb-8">
                    The store you&apos;re looking for doesn&apos;t exist or you don&apos;t have permission to access it.
                    It might have been moved or you entered the wrong URL.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                        onClick={() => router.back()}
                        className="px-6 py-3 rounded-lg font-medium"
                    >
                        ← Go Back
                    </Button>
                    <Button asChild variant="outline">
                        <Link href="/dashboard/seller/stores" className="px-6 py-3 rounded-lg font-medium text-center">
                            📋 View My Stores
                        </Link>
                    </Button>
                    <Button asChild>
                        <Link href="/dashboard/seller/new-store"
                              className="px-6 py-3 rounded-lg font-medium text-center">
                            ➕ Create New Store
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
