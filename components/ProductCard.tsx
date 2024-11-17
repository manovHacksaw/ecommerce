import { imageUrl } from "@/lib/imageUrl";
import Image from "next/image";
import Link from "next/link";
import React from "react";

function ProductCard({ product }) {
  const { name, price, description, slug, stock, image } = product;
  const isOutOfStock = stock != null && stock <= 0;

  return (
    <Link
      href={`/product/${slug.current}`}
      key={product._id}
      className={`border rounded-lg p-4 transform transition duration-200 h-[200px] w-[150px] ${
        isOutOfStock ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
      }`}
    >
      <div className="h-48 overflow-hidden rounded-md">
        {image && image.asset && (
          <Image
            src={imageUrl(product.image).url()}
            alt={name}
            height={192}
            width={150}
            className="object-contain h-full w-full"
          />
        )}
      </div>

      <div className="mt-4 text-center">
        <h2 className="text-lg font-semibold">{name}</h2>
        <p className="text-gray-600 mt-2">${price}</p>
        <p className="text-gray-700 mt-2 line-clamp-3">{description}</p>
      </div>
    </Link>
  );
}

export default ProductCard;