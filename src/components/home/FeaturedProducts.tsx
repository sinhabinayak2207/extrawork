"use client";

import ProductCard from '../products/ProductCard';
import Section from '../ui/Section';
import Button from '../ui/Button';

// Mock data for products (will be replaced with CMS data later)
const products = [
  {
    id: '1',
    title: 'Premium Basmati Rice',
    slug: 'premium-basmati-rice',
    description: 'Long-grain aromatic rice known for its nutty flavor and floral aroma. Perfect for pilaf, biryani, and other rice dishes.',
    image: 'https://images.pexels.com/photos/4110251/pexels-photo-4110251.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'rice',
    featured: true
  },
  {
    id: '2',
    title: 'Organic Sunflower Seeds',
    slug: 'organic-sunflower-seeds',
    description: 'High-quality organic sunflower seeds rich in nutrients and perfect for oil production or direct consumption.',
    image: 'https://images.pexels.com/photos/54267/sunflower-blossom-bloom-flowers-54267.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'seeds',
    featured: true
  },
  {
    id: '3',
    title: 'Refined Soybean Oil',
    slug: 'refined-soybean-oil',
    description: 'Pure refined soybean oil suitable for cooking, food processing, and industrial applications.',
    image: 'https://images.pexels.com/photos/725998/pexels-photo-725998.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'oil',
    featured: true
  },
  {
    id: '4',
    title: 'High-Density Polyethylene',
    slug: 'high-density-polyethylene',
    description: 'Industrial-grade HDPE polymer with excellent impact resistance and tensile strength for manufacturing.',
    image: 'https://images.pexels.com/photos/2233416/pexels-photo-2233416.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'raw-polymers',
    featured: false
  },
  {
    id: '5',
    title: 'Calcium Bromide Solution',
    slug: 'calcium-bromide-solution',
    description: 'High-purity calcium bromide solution used in oil drilling, pharmaceuticals, and other industrial applications.',
    image: 'https://images.pexels.com/photos/6074935/pexels-photo-6074935.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'bromine-salt',
    featured: false
  },
  {
    id: '6',
    title: 'Jasmine Rice',
    slug: 'jasmine-rice',
    description: 'Fragrant, long-grain rice with a subtle floral aroma, ideal for Asian cuisine and everyday meals.',
    image: 'https://images.pexels.com/photos/7421208/pexels-photo-7421208.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'rice',
    featured: false
  }
];

const FeaturedProducts = () => {
  // Filter featured products
  const featuredProducts = products.filter(product => product.featured);

  return (
    <Section background="white" id="featured-products">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-fadeIn">
          Featured <span className="bg-gradient-to-r from-blue-600 to-teal-400 bg-clip-text text-transparent">Products</span>
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto animate-fadeIn delay-100">
          Discover our selection of premium bulk products, sourced from trusted suppliers worldwide.
          All our products meet the highest quality standards for your business needs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fadeIn delay-200">
        {featuredProducts.map((product) => (
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
      
      <div className="mt-12 text-center animate-fadeIn delay-300">
        <Button href="/products" size="lg">
          View All Products
        </Button>
      </div>
    </Section>
  );
};

export default FeaturedProducts;
