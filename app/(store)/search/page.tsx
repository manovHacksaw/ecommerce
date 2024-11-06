import ProductsGrid from "@/components/ProductsGrid";
import { getProductsByName } from "@/sanity/lib/products/getProductsByName";

async function SearchPage({ searchParams }: { searchParams: { query: string } }) {
  const query = searchParams.query || ""; // Get the query from searchParams

  
  if (!query) {
    return null; 
  }

  // Fetch products only if the query is not empty
  const products = await getProductsByName(query);

  return (
    <div>
      <p>Search results for - {query}</p>
      {products.length === 0 ? (
        <p>No Products found!</p>
      ) : (
        <ProductsGrid products={products} />
      )}
    </div>
  );
}

export default SearchPage;
