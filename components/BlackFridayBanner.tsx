import { getActiveSalesByCouponCode } from '@/sanity/lib/sales/getActiveSaleByCouponCode';
import React from 'react';

async function BlackFridayBanner() {
  const sale = await getActiveSalesByCouponCode('BFRIDAY'); // Fetching the sale data
  console.log(sale); 

  // Return null if there is no sale
  if (!sale) {
    return null; 
  }

  return (
    <div className="bg-gray-700 text-white p-6 rounded-lg shadow-lg my-4">
      <div className="flex flex-col items-start">
        <h2 className="text-2xl font-bold mb-2">{sale.title}</h2>
        <p className="text-lg mb-4">{sale.description}</p>
        <div className="flex items-center space-x-4">
          <span className="bg-red-500 text-white py-1 px-3 rounded-full text-sm font-semibold">
            {sale.discountAmount}% OFF
          </span>
          <span className="text-sm text-gray-300">
            Valid from: {new Date(sale.validFrom).toLocaleDateString()} to {new Date(sale.validUntil).toLocaleDateString()}
          </span>
        </div>
        <div className="mt-4">
          <span className="text-sm text-gray-400">Coupon Code: </span>
          <span className="font-semibold">{sale.couponCode}</span>
        </div>
      </div>
    </div>
  );
}

export default BlackFridayBanner;
