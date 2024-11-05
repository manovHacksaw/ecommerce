import { Category } from "@/sanity.types";

interface ProductsViewProps {
  categories: Category[];
}

function Categories({ categories }: ProductsViewProps) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold mb-4">Categories</h2>
      <ul className="space-y-2 flex align-center gap-12">
        {categories.map((category) => (
          <li key={category._id} className="p-2 cursor-pointer  bg-gray-200 rounded hover:bg-gray-300 transition duration-200">
            {category.title}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Categories;
