import { Metadata } from "next";
import { notFound } from "next/navigation";
import MainLayout from "../../../../components/layout/MainLayout";
import { getProduct, products, categories } from "../../../../lib/api/mockData";
import ProductDetailClient from "@/components/products/ProductDetailClient";

// Generate static paths for all products
export async function generateStaticParams() {
  const params = [];
  
  // For each category
  for (const category of categories) {
    // Get products in this category
    const categoryProducts = products.filter(product => 
      // This is a simplified way to match products to categories
      // In a real app, you'd have a proper relationship between products and categories
      product.category === category.id || 
      product.title.toLowerCase().includes(category.title.toLowerCase())
    );
    
    // For each product in this category
    for (const product of categoryProducts) {
      params.push({
        category: category.slug,
        product: product.slug
      });
    }
  }
  
  // Fallback: Add all products to all categories to ensure we don't miss any
  for (const category of categories) {
    for (const product of products) {
      params.push({
        category: category.slug,
        product: product.slug
      });
    }
  }
  
  return params;
}

// Generate metadata for the page
export async function generateMetadata({ params }: { params: { product: string; category: string } }): Promise<Metadata> {
  const productSlug = params.product;
  const product = await getProduct(productSlug);
  
  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'The requested product could not be found.'
    };
  }
  
  return {
    title: `${product.title} - B2B Showcase`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: { params: { product: string, category: string } }) {
  const productSlug = params.product;
  const product = await getProduct(productSlug);
  
  if (!product) {
    notFound();
  }
  
  return (
    <MainLayout>
      <ProductDetailClient serverProduct={product} productSlug={productSlug} category={params.category} />
    </MainLayout>
  );
}