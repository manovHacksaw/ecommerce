"use client";
import { useState } from "react";
import { Category } from "@/sanity.types";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface CategorySelectorProps {
  categories: Category[];
}

export function CategorySelector({ categories }: CategorySelectorProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string>("");  // For search input and selected category
  const router = useRouter();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleCategorySelect = (category: Category) => {
    setValue(category.title);  // Set the category title as the selected value
    router.push(`/categories/${category.slug?.current}`);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline">
          {value ? `Selected: ${value}` : "Select Category"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4">
        <Command>
          <CommandInput
            placeholder="Search categories..."
            value={value}
            onChange={handleSearchChange}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === "Enter") {
                const selectedCategory = categories.find((c) =>
                  c.title?.toLowerCase().includes(value.toLowerCase())
                );
                if (selectedCategory && selectedCategory.slug?.current) {
                  setValue(selectedCategory.title);  // Update the value with the selected category name
                  router.push(`/categories/${selectedCategory.slug.current}`);
                  setOpen(false);
                }
              }
            }}
          />
          <CommandList>
            <CommandEmpty>No categories found.</CommandEmpty>
            <CommandGroup heading="Categories">
              {categories
                .filter((category) =>
                  category.title?.toLowerCase().includes(value.toLowerCase())
                )
                .map((category) => (
                  <CommandItem
                    key={category._id}
                    onSelect={() => handleCategorySelect(category)}
                  >
                    <span>{category.title}</span>
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
