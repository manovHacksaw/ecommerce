"use server";

import { imageUrl } from "@/lib/imageUrl";
import stripe from "@/lib/stripe";
import { BasketItem } from "@/store";

export type MetaData = {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  clerkUserId: string;
};

export type GroupedBasketItem = {
  product: BasketItem["product"];
  quantity: number;
};

export async function createCheckoutSession(
  items: GroupedBasketItem[],
  metaData: MetaData
) {
  try {
    // Check if all items have prices
    const itemsWithoutPrice = items.filter((item) => !item.product.price);
    if (itemsWithoutPrice.length > 0) {
      throw new Error("Some items do not have a price");
    }

    // Retrieve or create customer
    const customers = await stripe.customers.list({
      email: metaData.customerEmail,
      limit: 1,
    });

    let customerId: string | undefined;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    }

    // Map items to Stripe line items
    const lineItems = items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.product.name,
          description: item.product.description,
          images: item.product.image
            ? [imageUrl(item.product.image).url()]
            : undefined,
        },
        unit_amount: Math.round(item?.product?.price * 100), // Amount in cents
      },
      quantity: item.quantity,
    }));

    const successUrl = `${(process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`) || process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}&orderNumber=${metaData.orderNumber}`;

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_creation: customerId ? undefined : "always",
      customer_email: !customerId ? metaData.customerEmail : undefined,
      mode: "payment",
      allow_promotion_codes: true,
      line_items: lineItems,
      success_url: successUrl,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || `https://${process.env.VERCEL_URL}`}/basket`,
      metadata: {
        orderNumber: metaData.orderNumber,
        customerName: metaData.customerName,
        clerkUserId: metaData.clerkUserId,
      },
    });

    return { url: session.url };
  } catch (error) {
    console.error("Error creating a checkout session: ", error);
    throw error;
  }
}
