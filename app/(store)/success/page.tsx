"use client";

import useBasketStore from "@/store";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";


const SuccessPage = () => {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber");
  const clearBasket = useBasketStore((state) => state.clearBasket);

  useEffect(() => {
    if (orderNumber) {
      clearBasket();
    }
  }, [orderNumber, clearBasket]);

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4 text-center">
    
      <h1 className="text-2xl font-semibold">Your Order has been Confirmed!</h1>
      <p className="text-lg">
        Order Number <strong>{orderNumber}</strong> has been successfully
        placed. Your items will be shipped within the next 3-5 business days.
      </p>
    </div>
  );
};

export default SuccessPage;
