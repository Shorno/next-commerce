import {verifyWebhook, WebhookEvent} from '@clerk/nextjs/webhooks'
import {NextRequest} from 'next/server'
import {NewUser, users, roleEnum, UserRole} from "@/db/schema";
import {db} from "@/db";
import {clerkClient} from "@clerk/nextjs/server";
import {eq} from "drizzle-orm";

export async function POST(req: NextRequest) {
    try {
        const evt = await verifyWebhook(req)
        const {id} = evt.data
        const eventType : WebhookEvent["type"] = evt.type

        console.log(`Received webhook with ID ${id} and event type of ${eventType}`)

        if (evt.type === 'user.created' || evt.type === "user.updated") {
            const clerkRole = evt.data.private_metadata?.role as string;
            const validRoles = roleEnum.enumValues;
            const role = validRoles.includes(clerkRole as UserRole) ? clerkRole as UserRole : "USER";

            const user: NewUser = {
                id: evt.data.id,
                name: `${evt.data.first_name || ''} ${evt.data.last_name || ''}`.trim(),
                email: evt.data.email_addresses[0].email_address,
                image: evt.data.image_url,
                role: role,
            }

            const dbUser = await db.insert(users).values(user).onConflictDoUpdate({
                target: users.id,
                set: {
                    name: user.name,
                    email: user.email,
                    image: user.image,
                    role: user.role,
                    updatedAt: new Date(),
                }
            }).returning();

            const client = await clerkClient();
            await client.users.updateUserMetadata(dbUser[0].id, {
                privateMetadata: {
                    role: dbUser[0].role
                }
            });
        }

        if (evt.type === "user.deleted"){
            await db.delete(users).where(eq(users.id, evt.data.id!));
        }

        return new Response('Webhook received', {status: 200})
    } catch (err) {
        console.error('Error processing webhook:', err)
        return new Response(`Error processing webhook`, {status: 500})
    }
}
