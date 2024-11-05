import { BasketIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const orderType = defineType({
  name: "order",
  title: "Order",
  type: "document",
  icon: BasketIcon,
  fields: [
    defineField({
      name: "orderNumber",
      title: "Order Number",
      type: "string",
      validation: (Rule) => Rule.required().error("Order Number is required"),
    }),
    defineField({
      name: "stripeSessionID",
      title: "Stripe Checkout Session ID",
      type: "string",
      validation: (Rule) => Rule.required().error("Stripe Checkout Session ID is required"),
    }),
    defineField({
      name: "stripeCustomerID",
      title: "Stripe Customer ID",
      type: "string",
      validation: (Rule) => Rule.required().error("Stripe Customer ID is required"),
    }),
    defineField({
      name: "stripePaymentIntentID",
      title: "Stripe Payment Intent ID",
      type: "string",
      validation: (Rule) => Rule.required().error("Stripe Payment Intent ID is required"),
    }),
    defineField({
      name: "customerName",
      title: "Customer Name",
      type: "string",
      validation: (Rule) => Rule.required().error("Customer Name is required"),
    }),
    defineField({
      name: "customerEmail",
      title: "Customer Email",
      type: "string",
      validation: (Rule) =>
        Rule.required().regex(
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          { name: "email", invert: false }
        ).error("A valid email is required"),
    }),
    defineField({
      name: "products",
      title: "Products",
      type: "array",
      of: [{ type: "reference", to: [{ type: "product" }] }],
      validation: (Rule) => Rule.required().error("Products are required for this order"),
    }),
    defineField({
      name: "status",
      title: "Order Status",
      type: "string",
      options: {
        list: [
          { title: "Pending", value: "pending" },
          { title: "Paid", value: "paid" },
          { title: "Delivered", value: "delivered" },
          { title: "Cancelled", value: "cancelled" },
        ],
      },
      initialValue: "pending",
      validation: (Rule) => Rule.required().error("Order status is required"),
    }),
    defineField({
      name: "orderDate",
      title: "Order Date",
      type: "datetime",
      validation: (Rule) => Rule.required().error("Order Date is required"),
    }),
  ],
  preview: {
    select: {
      title: "orderNumber",
      subtitle: "customerName",
      media: "products.0.image",
      orderDate: "orderDate",
      status: "status",
    },
    prepare(selection) {
      const { title, subtitle, media, orderDate, status } = selection;
      return {
        title: `Order #${title}`,
        subtitle: `${subtitle} - ${status.charAt(0).toUpperCase() + status.slice(1)}`,
        media,
        description: orderDate ? `Date: ${new Date(orderDate).toLocaleDateString()}` : "",
      };
    },
  },
});
