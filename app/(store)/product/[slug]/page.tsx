import { getProductBySlug } from "@/sanity/lib/products/getProductBySlug";
import { imageUrl } from "@/lib/imageUrl";
import Image from "next/image";
import React from "react";
import AddToBasketButton from "@/components/AddToBasketButton";

export const dynamic = "force-static";
export const revalidate = 120


async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const product = await getProductBySlug(slug);

  if (!product?._id) {
    return <div>Product not found</div>;
  }

  const { name, price, description, slug: productSlug, stock, image } = product;
  const isOutOfStock = stock != null && stock <= 0;

  // Assuming useBasketStore is a Zustand store for managing the basket
  // const addItemToBasket = useBasketStore((state) => state.addItem);

  const handleAddToBasket = () => {
    if (!isOutOfStock) {
      // addItemToBasket(product);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="relative h-[300px] w-[300px]">
          {image && image.asset && (
            <Image
              src={imageUrl(product.image).url()}
              alt={name}
              height={300}
              width={300}
              className="object-cover rounded-lg"
            />
          )}
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-3xl font-semibold">{name}</h1>
          <p className="text-gray-600 mt-2">{description}</p>
          <p className="text-xl font-semibold mt-4">${price}</p>
          {isOutOfStock ? (
            <p className="text-red-500 mt-2">Out of stock</p>
          ) : (
            <p className="text-green-500 mt-2">In Stock</p>
          )}

          <div className="mt-6">
            <AddToBasketButton product={product} disabled={isOutOfStock}/>
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
