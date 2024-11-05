import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live"; // Ensure sanityFetch is correctly set up to call the Sanity client
import { CouponCodes } from "./couponCodes";

export const getActiveSalesByCouponCode = async (couponCode: CouponCodes) => {
  const ACTIVE_SALE_BY_COUPON_QUERY = defineQuery(
    `*[_type == "sales" && isActive == true && couponCode == $couponCode] | order(validFrom desc)[0]`
  );

  try {
    const response = await sanityFetch({
      query: ACTIVE_SALE_BY_COUPON_QUERY,
      params: { couponCode }
    });



    // Return data directly if response is available
    return response?.data || null;
  } catch (error) {
    console.error("Error fetching active sale by coupon code:", error);
    return null;
  }
};
