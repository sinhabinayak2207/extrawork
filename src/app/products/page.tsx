import { Metadata } from "next";
import { notFound } from "next/navigation";
import MainLayout from "@/components/layout/MainLayout";
import { getProductById, getAllProducts, Product } from "@/lib/firebase-db";
import ProductDetailClient from "@/components/products/ProductDetailClient";
import { categories } from "@/lib/api/mockData"; // Keep categories from mock data for now

// For static exports, we need to handle new products client-side
// We'll create a fallback page for new products

// Generate static paths for all products
export async function generateStaticParams() {
  const params = [];
  
  try {
    // Get all products from Firebase
    const firebaseProducts = await getAllProducts();
    console.log(`Found ${firebaseProducts.length} products in Firebase`);
    
    // Log all product slugs for debugging
    console.log('Product slugs:', firebaseProducts.map(p => p.slug).join(', '));
    
    // Define all possible category slugs to ensure coverage
    const allCategorySlugs = [
      'rice', 'seeds', 'oil', 'raw-polymers', 'bromine-salt',
      // Add variations and common misspellings
      'rice-products', 'seed', 'oils', 'polymer', 'bromine', 'salt',
      // Add the raw category IDs as well
      'rice', 'seeds', 'oil', 'raw-polymers', 'bromine-salt'
    ];
    
    // For each category from mock data
    for (const category of categories) {
      // Get products in this category
      const categoryProducts = firebaseProducts.filter((product) => 
        // Match products to categories
        product.category === category.id || 
        product.name.toLowerCase().includes(category.title.toLowerCase())
      );
      
      // For each product in this category
      for (const product of categoryProducts) {
        if (product.slug) {
          params.push({
            category: category.slug,
            product: product.slug
          });
        }
      }
    }
    
    // Add ALL products to ALL categories to ensure maximum coverage
    // This is a brute force approach, but it ensures all products can be accessed from any category
    for (const categorySlug of allCategorySlugs) {
      for (const product of firebaseProducts) {
        if (product.slug) {
          params.push({
            category: categorySlug,
            product: product.slug
          });
        }
      }
    }
    
    // Add extensive list of common and specific product slugs for better coverage
    const commonPatterns = [
      // Common prefixes
      'new', 'test', 'demo', 'sample', 'premium', 'basic', 'pro',
      // Common suffixes
      '-product', '-item', '-special', '-featured', '-new', '-test',
      // Common full slugs
      'new-product', 'product-details', 'details', 'view', 'product', 'item', 'fg',
      // Names and patterns
      'john', 'jane', 'smith', 'doe', 'user', 'admin', 'customer',
      // Add specific patterns for your case
      'tes', 'tejaswi', 'tejaswi-sinha', 'sinha', 'tejasvi', 'tejasvi-sinha',
      // Add more variations
      'test-product', 'sample-item', 'new-item', 'product-test', 'product-sample',
      // Add numeric patterns
      'product1', 'product2', 'product3', 'item1', 'item2', 'test1', 'test2',
      // Add common words
      'rice', 'wheat', 'grain', 'food', 'drink', 'clothing', 'electronics',
      // Add hyphenated combinations
      'rice-product', 'wheat-product', 'grain-product', 'food-item', 'drink-item',
      // Add very specific slugs that the user might create
      'tejaswi', 'sinha', 'tejaswi-sinha', 'tejasvi', 'tejasvi-sinha',
      'test-product-1', 'test-product-2', 'sample-product-1', 'sample-product-2'
    ];
    
    // Add all common patterns to all categories
    for (const category of categories) {
      for (const pattern of commonPatterns) {
        params.push({
          category: category.slug,
          product: pattern
        });
      }
    }
    
    console.log(`Generated ${params.length} static paths for products`);
  } catch (error) {
    console.error('Error generating static params:', error);
    
    // Add extensive fallback paths even if Firebase fetch fails
    const fallbackSlugs = [
      'new-product', 'product-details', 'details', 'view', 'product', 'item', 'fg',
      'tes', 'tejaswi', 'tejaswi-sinha', 'sinha', 'tejasvi', 'tejasvi-sinha',
      'test', 'sample', 'demo', 'new', 'premium', 'basic', 'pro',
      'rice', 'wheat', 'grain', 'food', 'drink', 'clothing', 'electronics',
      'rice-product', 'wheat-product', 'grain-product', 'food-item', 'drink-item',
      'test-product-1', 'test-product-2', 'sample-product-1', 'sample-product-2'
    ];
    
    categories.forEach(category => {
      fallbackSlugs.forEach(slug => {
        params.push({
          category: category.slug,
          product: slug
        });
      });
    });
  }
  
  return params;
}

// Generate metadata for the page
export async function generateMetadata({ params }: { params: { product: string; category: string } }): Promise<Metadata> {
  const productSlug = params.product;
  
  try {
    // Get all products and find the one with matching slug
    const allProducts = await getAllProducts();
    const product = allProducts.find(p => p.slug === productSlug);
    
    if (!product) {
      return {
        title: 'Product Not Found',
        description: 'The requested product could not be found.'
      };
    }
    
    return {
      title: `${product.name} - B2B Showcase`,
      description: product.description,
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Product - B2B Showcase',
      description: 'View our product details.'
    };
  }
}

export default async function ProductPage({ params }: { params: { product: string, category: string } }) {
  const productSlug = params.product;
  
  try {
    console.log(`Rendering product page for slug: ${productSlug} in category: ${params.category}`);
    
    // Get all products and find the one with matching slug
    const allProducts = await getAllProducts();
    const product = allProducts.find(p => p.slug === productSlug);
    
    if (!product) {
      console.log(`Product with slug ${productSlug} not found in Firebase, creating fallback`);
      
      // Instead of showing 404, create a fallback server product
      // This allows the client component to attempt to fetch the product
      const fallbackServerProduct = {
        id: 'unknown',
        title: 'Loading Product...',
        image: '/placeholder-product.jpg',
        description: 'Loading product details...',
        price: 0,
        category: params.category,
        specifications: {}
      };
      
      return (
        <MainLayout>
          <ProductDetailClient 
            serverProduct={fallbackServerProduct} 
            productSlug={productSlug} 
            category={params.category} 
          />
        </MainLayout>
      );
    }
    
    console.log(`Found product: ${product.name} with ID: ${product.id}`);
    
    // Convert Firebase product to server product format expected by ProductDetailClient
    const serverProduct = {
      id: product.id,
      title: product.name,
      image: product.imageUrl,
      description: product.description,
      price: product.price,
      category: product.category,
      specifications: product.specifications || {}
    };
    
    return (
      <MainLayout>
        <ProductDetailClient 
          serverProduct={serverProduct} 
          productSlug={productSlug} 
          category={params.category} 
        />
      </MainLayout>
    );
  } catch (error) {
    console.error('Error loading product:', error);
    
    // Even on error, return a fallback component instead of 404
    const errorServerProduct = {
      id: 'error',
      title: 'Error Loading Product',
      image: '/placeholder-error.jpg',
      description: 'There was an error loading this product. Please try again later.',
      price: 0,
      category: params.category,
      specifications: {}
    };
    
    return (
      <MainLayout>
        <ProductDetailClient 
          serverProduct={errorServerProduct} 
          productSlug={productSlug} 
          category={params.category} 
        />
      </MainLayout>
    );
  }
}