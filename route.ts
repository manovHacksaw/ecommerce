import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@sanity/client";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-10-28.acacia" });
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// Initialize Sanity client
const backendClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: "production",
  apiVersion: "2023-01-01",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

// Define metadata interface
interface MetaData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  clerkUserId: string;
}

async function createOrderInSanity(session: Stripe.Checkout.Session) {
  const { id, amount_total, currency, metadata, payment_intent, customer, total_details } = session;
  const { orderNumber, customerName, customerEmail, clerkUserId } = metadata as MetaData;

  const lineItemsWithProduct = await stripe.checkout.sessions.listLineItems(id, { expand: ["data.price.product"] });

  const items = lineItemsWithProduct.data.map((item) => ({
    _key: crypto.randomUUID(),
    product: {
      _type: "reference",
      _ref: (item.price?.product as Stripe.Product)?.metadata?.id,
    },
    quantity: item.quantity || 0,
  }));

  const order = await backendClient.create({
    _type: "order",
    orderNumber,
    stripeCheckoutSessionId: id,
    stripePaymentIntentId: payment_intent,
    customerName,
    stripeCustomerId: customer,
    clerkUserId: clerkUserId,
    email: customerEmail,
    currency,
    amountDiscount: total_details?.amount_discount ? total_details.amount_discount / 100 : 0,
    status: "paid",
    orderDate: new Date().toISOString(),
  });

  return order;
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const headersList = await headers();
  const sig = headersList.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Signature Missing!" }, { status: 400 });
  }

  if (!endpointSecret) {
    console.log("Webhook Secret is Missing!");
    return NextResponse.json({ error: "Stripe webhook secret is not set" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return NextResponse.json({ error: "Webhook Error " + error }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      const order = await createOrderInSanity(session);
      console.log("Order created in Sanity:", order);
    } catch (error) {
      console.error("Failed to create order in Sanity:", error);
    }
  }

  return NextResponse.json({ received: true });
}
