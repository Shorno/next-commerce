import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex items-center justify-center min-h-[60vh] p-6">
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-destructive">
                        Store Not Found
                    </CardTitle>s
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                        The store you&apos;re looking for doesn&apos;t exist or you don&apos;t have permission to access it.
                    </p>
                    <div className="flex flex-col gap-2">
                        <Button asChild>
                            <Link href="/dashboard/seller/stores">
                                View My Stores
                            </Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/dashboard/seller/stores/new">
                                Create New Store
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
