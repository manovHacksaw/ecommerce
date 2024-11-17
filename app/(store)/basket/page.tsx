"use client";
import useBasketStore from "@/store";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { imageUrl } from "@/lib/imageUrl";
import { useEffect, useState } from "react";
import Loader from "@/components/Loader";
import { createCheckoutSession } from "@/actions/createCheckoutSession";

function BasketPage() {
  const [isClient, setIsClient] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  const groupedItems = useBasketStore((state) => state.getGroupedItems());
  const removeItem = useBasketStore((state) => state.removeItem);
  const addItem = useBasketStore((state) => state.addItem);
  const removeItemCompletely = useBasketStore((state) => state.removeItemCompletely);
  const getTotalPrice = useBasketStore((state) => state.getTotalPrice);
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  console.log(groupedItems)

  const handleCheckOut = async () => {
    if (!isSignedIn) return router.push("/sign-in");
    setLoading(true);

    try {
      const metaData = {
        orderNumber: crypto.randomUUID(),
        customerName: user?.fullName ?? "Unknown",
        customerEmail: user?.emailAddresses[0].emailAddress ?? "Unknown",
        clerkUserId: user?.id,
      };

      const { url: checkOutUrl } = await createCheckoutSession(groupedItems, metaData);
      if (checkOutUrl) window.location.href = checkOutUrl;
    } catch (error) {
      console.error("Checkout error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return <Loader /> ;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Your Shopping Basket</h1>
      {groupedItems.length === 0 ? (
        <Card className="p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
          {/* Empty Basket State */}
        </Card>
      ) : (
        <div className="flex flex-col lg:flex-row lg:space-x-8">
          {/* Basket Items Section */}
          <div className="flex-grow space-y-4 lg:w-1/2">
            {groupedItems.map((item, index)=>(
               <Card key={index} className="p-4 flex items-center space-x-4 shadow-md">
               {/* Item Image */}
               <Image
                 src={imageUrl(item?.product?.image).url()}
                 alt={item?.product?.name}
                 width={80}
                 height={80}
                 className="rounded-md"
               />
                {/* Item Details */}
      <div className="flex-grow">
        <h2 className="text-lg font-semibold text-gray-800">{item.product.name}</h2>
        <p className="text-gray-600">${item.product.price.toFixed(2)}</p>
        <div className="flex items-center mt-2 space-x-2">
          <button onClick={() => removeItem(item.product._id)} className="p-1 rounded-full bg-gray-200">
            <Minus className="w-4 h-4" />
          </button>
          <span className="text-gray-800 font-medium">{item.quantity}</span>
          <button onClick={() => addItem(item.product)} className="p-1 rounded-full bg-gray-200">
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Remove Item Button */}
      <button
        onClick={() => removeItemCompletely(item.product.id)}
        className="text-red-500 hover:text-red-700"
      >
        <Trash2 className="w-5 h-5" />
      </button>
               </Card>
            ))}
          </div>

          {/* Order Summary Section */}
          <div className="lg:w-1/3 lg:sticky lg:top-24 mt-8 lg:mt-0">
            <Card className="p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-6 text-gray-800">Order Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-lg font-semibold">${getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-lg font-semibold">Free</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-2xl font-bold text-blue-600">
                    ${getTotalPrice().toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={handleCheckOut}
                  disabled={isLoading}
                  className={`w-full py-4 ${
                    isLoading ? "bg-blue-300" : "bg-blue-500 hover:bg-blue-600"
                  } text-white rounded-lg transition-all duration-200 font-semibold shadow-md mt-6`}
                >
                  {isLoading ? "Processing..." : "Proceed to Checkout"}
                </button>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

export default BasketPage;
