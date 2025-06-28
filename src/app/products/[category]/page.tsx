import { Metadata } from "next";
import { notFound } from "next/navigation";
import MainLayout from "../../../components/layout/MainLayout";
import Section from "../../../components/ui/Section";
import ProductCard from "../../../components/products/ProductCard";
import { getCategory, getProducts } from "../../../lib/api/mockData";

// Generate metadata for the page
export async function generateMetadata({ params }: { params: { category: string } }): Promise<Metadata> {
  const category = await getCategory(params.category);
  
  if (!category) {
    return {
      title: 'Category Not Found',
      description: 'The requested product category could not be found.'
    };
  }
  
  return {
    title: `${category.title} Products - B2B Showcase`,
    description: category.description,
  };
}

export default async function CategoryPage({ params }: { params: { category: string } }) {
  const categorySlug = params.category;
  const category = await getCategory(categorySlug);
  const products = await getProducts(categorySlug);
  
  if (!category) {
    notFound();
  }
  
  return (
    <MainLayout>
      <Section background="gradient" paddingY="lg">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {category.title} <span className="bg-gradient-to-r from-blue-600 to-teal-400 bg-clip-text text-transparent">Products</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            {category.description}
          </p>
        </div>
      </Section>
      
      <Section background="white">
        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                title={product.title}
                description={product.description}
                image={product.image}
                category={product.category}
                slug={product.slug}
                featured={product.featured}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-2xl font-bold text-gray-700 mb-4">No products found</h3>
            <p className="text-gray-600">
              There are currently no products available in this category.
              Please check back later or explore our other product categories.
            </p>
          </div>
        )}
      </Section>
    </MainLayout>
  );
}
