"use client";
import { Product } from "@/sanity.types";
import useBasketStore from "@/store";
import { useEffect, useState } from "react";

interface AddToBasketButtonProps {
  product: Product;
  disabled?: boolean;
}

function AddToBasketButton({ product, disabled }: AddToBasketButtonProps) {
  const { addItem, removeItem, getItemCount } = useBasketStore();
  
  const itemCount = getItemCount(product._id);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Avoid rendering the component server-side
  if (!isClient) return null;

  const handleAdd = () => {
    if (!disabled) {
      addItem(product);
    }
  };

  const handleRemove = () => {
    if (itemCount > 0 && !disabled) {
      removeItem(product._id); // This will reduce quantity, even to 0
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <button
        onClick={handleRemove} // Pass the function as a handler
        disabled={disabled || itemCount === 0} // Allow removal even when quantity is 0
        className={`px-4 py-2 bg-red-500 text-white rounded-md ${disabled || itemCount === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-red-600"}`}
      >
        -
      </button>
      <span className="text-xl">{itemCount}</span>
      <button
        onClick={handleAdd}
        disabled={disabled}
        className={`px-4 py-2 bg-blue-500 text-white rounded-md ${disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"}`}
      >
        +
      </button>
    </div>
  );
}

export default AddToBasketButton;
