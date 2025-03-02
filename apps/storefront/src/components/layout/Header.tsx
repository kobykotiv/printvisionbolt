'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ShoppingCart, User, Search, Menu, X } from 'lucide-react';
import { useCart } from '@/hooks/useCart';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { items } = useCart();
  const itemCount = items.length;

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold">PrintVision</span>
            </Link>
            <nav className="hidden md:ml-6 md:flex space-x-8">
              <Link href="/products" className="hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                Products
              </Link>
              <Link href="/categories" className="hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                Categories
              </Link>
              <Link href="/about" className="hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                About
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center">
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Search className="h-5 w-5" />
            </button>
            <Link href="/account" className="p-2 rounded-full hover:bg-gray-100 ml-2">
              <User className="h-5 w-5" />
            </Link>
            <Link href="/cart" className="p-2 rounded-full hover:bg-gray-100 ml-2 relative">
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 bg-blue-600 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                  {itemCount}
                </span>
              )}
            </Link>
            <button 
              className="md:hidden ml-2 p-2 rounded-full hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1 px-2">
            <Link href="/products" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100">
              Products
            </Link>
            <Link href="/categories" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100">
              Categories
            </Link>
            <Link href="/about" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100">
              About
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
