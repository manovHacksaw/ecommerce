"use client";

import { ClerkLoaded, SignInButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import Form from "next/form";
import { Button } from "./ui/button";
import { PackageIcon, TrolleyIcon } from "@sanity/icons";

function Header() {
  const { user } = useUser();

  const handleCreatePasskey = async() => {
    
    try {
      const response = await user?.createPasskey();
      console.log(response)
    } catch (error) {
      console.error("ERROR: ", JSON.stringify(error, null, 2))
    }
  };

  return (
    <header className="flex flex-col sm:flex-row items-center justify-between p-4 sm:p-6 mx-5 rounded-lg space-y-4 sm:space-y-0 bg-gray-50">
      {/* Logo */}
      <Link href="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700">
        Shopr
      </Link>

      {/* Search Form */}
      <Form action={"/search"} className="flex w-full sm:w-auto sm:flex-1 mt-2 sm:mt-0 max-w-lg">
        <label htmlFor="search-input" className="sr-only">
          Search for products
        </label>
        <input
          type="text"
          name="query"
          id="search-input"
          placeholder="Search for products"
          className="border border-gray-300 rounded-l-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
        />
        <Button
          type="submit"
          className="bg-blue-500 text-white rounded-r-md px-4 py-2 hover:bg-blue-600 transition duration-200"
        >
          Search
        </Button>
      </Form>

      {/* Basket Link */}
      <div className="flex items-center space-x-2 sm:space-x-0 mt-2 sm:mt-0">
        <Link href="/basket" className="flex items-center text-gray-600 hover:text-blue-600">
          <TrolleyIcon className="w-6 h-6" />
          <span className="ml-2 hidden sm:inline">My Basket</span>
        </Link>
      </div>

      {/* User area */}
      <div className="flex items-center space-x-4 mt-2 sm:mt-0">
        <ClerkLoaded>
          {user && (
            <Link href="/orders" className="flex items-center text-gray-600 hover:text-blue-600 mr-4">
              <PackageIcon className="w-6 h-6" />
              <span className="ml-2 hidden sm:inline">My Orders</span>
            </Link>
          )}
        </ClerkLoaded>
        {user ? (
          <div className="flex items-center">
            <UserButton />
            <div className="ml-4 hidden sm:block text-left">
              <p className="text-sm text-gray-600">Welcome back,</p>
              <p className="text-sm font-semibold text-gray-800">{user.fullName}</p>
            </div>
          </div>
        ) : (
          <SignInButton mode="modal" className="text-blue-600 hover:underline" />
        )}

        {user?.passkeys?.length === 0 && (
          <button onClick={handleCreatePasskey} className="text-blue-600 hover:text-blue-700">
            Create Passkey
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;
