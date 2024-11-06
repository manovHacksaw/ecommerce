import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export const getProductsByCategory = async (categorySlug: string) => {
  const CATEGORY_PRODUCTS_QUERY = defineQuery(
    `*[_type == "product" && references(*[_type == "category" && slug.current == $categorySlug]._id)] | order(name asc)`
  );

  try {
    const products = await sanityFetch({
      query: CATEGORY_PRODUCTS_QUERY,
      params: { categorySlug },
    });

    console.log(products.data);

    return products.data || [];
  } catch (error) {
    console.log("Error fetching products of the required category: ", error);
    return [];
  }
};
