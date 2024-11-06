import ProductsView from '@/components/ProductsView';
import { getAllCategories } from '@/sanity/lib/products/getAllCategories';
import { getProductsByCategory } from '@/sanity/lib/products/getProductsByCategory';
import React from 'react'

async function CategoryPage({params}: {params: Promise<{slug: string}>} )  {

  const {slug} = await params;

  const products = await getProductsByCategory(slug);
  const categories = await getAllCategories();
  return (
    <div>
      <ProductsView categories={categories} products={products}/></div>
  )
}

export default CategoryPage