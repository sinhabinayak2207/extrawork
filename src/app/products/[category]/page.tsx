import { Metadata } from "next";
import { notFound } from "next/navigation";
import MainLayout from "../../../components/layout/MainLayout";
import { categories } from "../../../lib/api/mockData";
import CategoryPageClient from "@/components/products/CategoryPageClient";

// Helper function to get category by slug
const getCategory = async (slug: string) => {
  return categories.find(cat => cat.slug === slug) || null;
};

// Generate static paths for all categories
export async function generateStaticParams() {
  return categories.map(category => ({
    category: category.slug
  }));
}

// Generate metadata for the page
export async function generateMetadata({ params }: { params: { category: string } }): Promise<Metadata> {
  const categorySlug = params.category;
  const category = await getCategory(categorySlug);
  
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
  
  if (!category) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Category Not Found</h2>
          <p className="text-gray-600 mb-8">The category you're looking for doesn't exist.</p>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <CategoryPageClient category={category} categorySlug={categorySlug} />
    </MainLayout>
  );
}
