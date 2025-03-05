'use client';

import React from 'react';
import { GlassCard } from '@printvisionbolt/shared-ui/components/glass';
import Image from 'next/image';
import Link from 'next/link';
import FeaturedProducts from '@/components/product/FeaturedProducts';

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/80 to-purple-600/80 z-10" />
        <div className="relative h-[500px] overflow-hidden">
          <Image
            src="/images/hero-background.jpg"
            alt="PrintVision Hero"
            fill
            style={{ objectFit: "cover" }}
            priority
          />
        </div>
        <div className="absolute inset-0 z-20 flex items-center justify-center text-center px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Print Products for Every Occasion
            </h1>
            <p className="text-white text-lg md:text-xl mb-8">
              High-quality printing services for businesses and individuals
            </p>
            <Link
              href="/products"
              className="bg-white text-blue-600 px-8 py-3 rounded-md font-medium text-lg hover:bg-gray-100 transition"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Featured Products</h2>
        <FeaturedProducts />
      </section>

      {/* Categories */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Product Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Category Cards */}
            {['Business Cards', 'Flyers', 'Posters', 'Promotional Items'].map((category) => (
              <Link
                href={`/categories/${category.toLowerCase().replace(' ', '-')}`}
                key={category}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
              >
                <div className="h-40 bg-gray-200"></div>
                <div className="p-4">
                  <h3 className="font-bold text-lg">{category}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto bg-blue-600 text-white rounded-lg p-8 lg:p-12 text-center">
          <h2 className="text-2xl lg:text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="mb-6 max-w-2xl mx-auto">
            Transform your ideas into high-quality print products today with PrintVision.
          </p>
          <Link
            href="/products"
            className="bg-white text-blue-600 px-6 py-3 rounded-md font-medium inline-block hover:bg-gray-100 transition"
          >
            Browse Products
          </Link>
        </div>
      </section>
    </div>
  );
}