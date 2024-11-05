"use client";
import React from "react";
import { Product } from "@/sanity.types";
import ProductCard from "./ProductCard";
import { AnimatePresence, motion } from "framer-motion";

interface ProductsViewProps {
  products: Product[];
}

function ProductsGrid({ products }: ProductsViewProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
      {products.map((product) => (
        <AnimatePresence key={product._id}>
          <motion.div
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ProductCard product={product} />
          </motion.div>
        </AnimatePresence>
      ))}
    </div>
  );
}

export default ProductsGrid;
