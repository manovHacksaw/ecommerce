import { Button } from "@/components/ui/button";
import { getAllProducts } from "@/sanity/lib/products/getAllProducts";
import ProductsView from "@/components/ProductsView";
import React from "react";
import { getAllCategories } from "@/sanity/lib/products/getAllCategories";
import BlackFridayBanner from "@/components/BlackFridayBanner";

export const dynamic = "force-static";
export const revalidate = 120;

const Home = async () => {
  const products = await getAllProducts();
  console.log(products);
  const categories = await getAllCategories();

  return (
    <div>
      <BlackFridayBanner />
      <div>
        <ProductsView products={products} categories={categories} />
      </div>
    </div>
  );
};

export default Home;
