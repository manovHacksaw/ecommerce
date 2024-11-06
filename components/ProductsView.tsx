import React from "react";
import { Category, Product } from "@/sanity.types";
import Categories from "./Categories";
import ProductsGrid from "./ProductsGrid";
import { CategorySelector } from "./ui/category-selector";

interface ProductsViewProps {
  products: Product[];
  categories: Category[];
}

function ProductsView({ products, categories }: ProductsViewProps) {
  return (
    <div>
        <CategorySelector categories={categories} />
      <div></div>

      <div className="flex-1">
        <ProductsGrid products={products} />
      </div>
    </div>
  );
}

export default ProductsView;
