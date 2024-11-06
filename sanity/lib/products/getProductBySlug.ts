import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export const getProductBySlug = async (productSlug: string) => {
  const PRODUCT_QUERY = defineQuery(
    `*[_type=="product" && slug.current == $productSlug] | order(_createdAt desc)[0]`
  );

  try {
    const product = await sanityFetch({
      query: PRODUCT_QUERY,
      params: { productSlug }, // Ensure the parameter is passed correctly
    });

    return product.data || {};
  } catch (error) {
    console.log("Error Fetching Product: ", error);
    return {};
  }
};
