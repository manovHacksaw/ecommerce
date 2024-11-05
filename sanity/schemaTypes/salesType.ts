import { TagIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const salesType = defineType({
  name: "sales",
  title: "Sales",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({
      name: "title",
      title: "Sale Title",
      type: "string",
      validation: (Rule) => Rule.required().error("Sale title is required"),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      validation: (Rule) =>
        Rule.required()
          .min(10)
          .max(300)
          .warning("Description should be between 10 and 300 characters"),
    }),
    defineField({
      name: "couponCode",
      title: "Coupon Code",
      type: "string",
      validation: (Rule) =>
        Rule.required()
          .min(5)
          .max(20)
          .error("Coupon code should be between 5 and 20 characters"),
    }),
    defineField({
      name: "discountAmount",
      title: "Discount Amount (%)",
      type: "number",
      validation: (Rule) =>
        Rule.required()
          .min(0)
          .max(100)
          .error("Discount must be a percentage between 0 and 100"),
    }),
    defineField({
      name: "validFrom",
      title: "Valid From",
      type: "datetime",
      validation: (Rule) =>
        Rule.required().error("Valid From date is required"),
    }),
    defineField({
      name: "validUntil",
      title: "Valid Until",
      type: "datetime",
      validation: (Rule) =>
        Rule.required()
          .min(Rule.valueOfField("validFrom"))
          .error("Valid Until date must be after the Valid From date"),
    }),
    defineField({
      name: "isActive",
      title: "Is Active",
      type: "boolean",
      description: "Set to true if this sale is currently active",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "discountAmount",
      couponCode: "couponCode",
      isActive: "isActive",
      validFrom: "validFrom",
      validUntil: "validUntil",
    },
    prepare(selection) {
      const { title, subtitle, couponCode, isActive, validFrom, validUntil } =
        selection;
      return {
        title,
        subtitle: `${subtitle}% off - Code: ${couponCode} - ${isActive ? "Active" : "Inactive"}`,
        description: `Valid from ${new Date(validFrom).toLocaleDateString()} to ${new Date(validUntil).toLocaleDateString()}`,
      };
    },
  },
});
