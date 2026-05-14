import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import connectToDatabase from '@/lib/db'
import User from '@/models/User'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the endpoint
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error('Missing svix headers:', { svix_id, svix_timestamp, svix_signature });
    return new Response(`Error: Missing svix headers`, {
      status: 400
    })
  }

  // Get the raw body text for Svix verification
  const body = await req.text();

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch (err: any) {
    console.error('Error verifying webhook signature:', err.message);
    return new Response(`Error verifying webhook: ${err.message}`, {
      status: 400
    })
  }

  const eventType = evt.type;

  if (eventType === 'user.created') {
    const { id, email_addresses } = evt.data;

    if (!id || !email_addresses || email_addresses.length === 0) {
      console.error('Missing user data in payload:', evt.data);
      return new Response('Error: Missing user ID or email in payload', {
        status: 400
      })
    }

    try {
      await connectToDatabase();
      
      const email = email_addresses[0].email_address;
      
      // Create a new user in MongoDB
      const newUser = new User({
        clerkId: id,
        email: email,
        planType: 'FREE', // Defaults to FREE
        monthlyGenerations: 0,
      });

      await newUser.save();
      console.log(`User created in MongoDB: ${email}`);
      
      return NextResponse.json({ message: 'User created' }, { status: 201 });
    } catch (error) {
      console.error('Error saving user to DB:', error);
      return new Response('Error saving user', { status: 500 });
    }
  }

  return NextResponse.json({ message: 'Webhook received' }, { status: 200 });
}
