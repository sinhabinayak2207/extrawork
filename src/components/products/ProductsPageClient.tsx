"use client";

import Section from "../../components/ui/Section";
import FeaturedCategories from "../../components/home/FeaturedCategories";
import FeaturedProducts from "../../components/home/FeaturedProducts";

export default function ProductsPageClient() {
  return (
    <>
      <Section background="gradient" paddingY="lg">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Our <span className="bg-gradient-to-r from-blue-600 to-teal-400 bg-clip-text text-transparent">Products</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Explore our extensive range of high-quality bulk products for your business needs.
          </p>
        </div>
      </Section>
      
      <FeaturedCategories />
      <FeaturedProducts />
    </>
  );
}
