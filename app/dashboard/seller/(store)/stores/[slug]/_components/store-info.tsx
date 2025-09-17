import {db} from "@/db";
import {currentUser} from "@clerk/nextjs/server";

export default async function StoreInfo() {
    const user = await currentUser();
    if (!user?.id) {
        return null;
    }
    const stores = await db.query.stores.findMany({
        where :  (store, {eq}) => eq(store.ownerId, user.id),
    })
    return (
        <div className="rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Your Stores</h2>
            {stores.length === 0 ? (
                <p className="text-gray-600">You have no stores. Create one to get started!</p>
            ) : (
                <ul className="space-y-4">
                    {stores.map((store) => (
                        <li key={store.id} className="border p-4 rounded-lg">
                            <h3 className="text-xl font-semibold">{store.name}</h3>
                            <p className="text-gray-600">Slug: {store.slug}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}