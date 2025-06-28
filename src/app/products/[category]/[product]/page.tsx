import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import MainLayout from "../../../../components/layout/MainLayout";
import Section from "../../../../components/ui/Section";
import Button from "../../../../components/ui/Button";
import { getProduct, getRelatedProducts, products, categories } from "../../../../lib/api/mockData";

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
export async function generateMetadata({ params }: { params: { product: string } }): Promise<Metadata> {
  const product = await getProduct(params.product);
  
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
  
  const relatedProducts = await getRelatedProducts(product.id, 3);
  
  return (
    <MainLayout>
      <Section background="white" paddingY="lg">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="relative h-[400px] md:h-[500px] rounded-xl overflow-hidden">
            <Image
              src={product.image}
              alt={product.title}
              fill
              className="object-cover"
              priority
            />
          </div>
          
          {/* Product Details */}
          <div>
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
              {product.category.charAt(0).toUpperCase() + product.category.slice(1).replace('-', ' ')}
            </span>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{product.title}</h1>
            
            <p className="text-gray-600 mb-8 text-lg">
              {product.description}
            </p>
            
            {/* Specifications */}
            {product.specifications && (
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4">Specifications</h3>
                <div className="bg-gray-50 rounded-lg p-6">
                  <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex flex-col">
                        <dt className="text-sm font-medium text-gray-500">{key}</dt>
                        <dd className="mt-1 text-base font-medium text-gray-900">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            )}
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                href={`mailto:sales@b2bshowcase.com?subject=Inquiry about ${product.title}&body=I am interested in learning more about ${product.title}. Please provide additional information.`}
                size="lg"
              >
                Request Quote
              </Button>
              <Button 
                href="/contact" 
                variant="secondary"
                size="lg"
              >
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </Section>
      
      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <Section background="light">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Related <span className="bg-gradient-to-r from-blue-600 to-teal-400 bg-clip-text text-transparent">Products</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore other products that might be of interest to you
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedProducts.map((relatedProduct) => (
              <div key={relatedProduct.id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="relative h-64">
                  <Image
                    src={relatedProduct.image}
                    alt={relatedProduct.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{relatedProduct.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{relatedProduct.description}</p>
                  <Button 
                    href={`/products/${relatedProduct.category}/${relatedProduct.slug}`}
                    variant="outline"
                    size="sm"
                  >
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}
    </MainLayout>
  );
}