import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { userCreate } from "../../data/user/user-create";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {

    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {

    return NextResponse.json("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new SVIX instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    return NextResponse.json({
      status: 400,
      err,
    });
  }

  // Get the ID and type
  const eventType = evt.type;

  if (eventType === "user.created") {
    try {
      const response = await userCreate({
        email: payload?.data?.email_addresses?.[0]?.email_address,
        first_name: payload?.data?.first_name,
        last_name: payload?.data?.last_name,
        profile_image_url: payload?.data?.profile_image_url,
        user_id: payload?.data?.id,
      });

    } catch (error) {
      return NextResponse.json({
        status: 400,
        error,
      });
    }
  }

  return new Response("Done", { status: 201 });
}
