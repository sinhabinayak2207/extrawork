"use client";


import CategoryCard from '../products/CategoryCard';
import Section from '../ui/Section';

// Mock data for categories (will be replaced with CMS data later)
const categories = [
  {
    id: '1',
    title: 'Rice',
    slug: 'rice',
    description: 'Premium quality rice varieties sourced from the finest farms worldwide.',
    image: 'https://images.pexels.com/photos/4110251/pexels-photo-4110251.jpeg?auto=compress&cs=tinysrgb&w=600',
    productCount: 8
  },
  {
    id: '2',
    title: 'Seeds',
    slug: 'seeds',
    description: 'High-yield agricultural seeds for various crops and growing conditions.',
    image: 'https://images.pexels.com/photos/1537169/pexels-photo-1537169.jpeg?auto=compress&cs=tinysrgb&w=600',
    productCount: 12
  },
  {
    id: '3',
    title: 'Oil',
    slug: 'oil',
    description: 'Refined and crude oils for industrial and commercial applications.',
    image: 'https://images.pexels.com/photos/1458694/pexels-photo-1458694.jpeg?auto=compress&cs=tinysrgb&w=600',
    productCount: 6
  },
  {
    id: '4',
    title: 'Raw Polymers',
    slug: 'raw-polymers',
    description: 'Industrial-grade polymers for manufacturing and production needs.',
    image: 'https://images.pexels.com/photos/3825527/pexels-photo-3825527.jpeg?auto=compress&cs=tinysrgb&w=600',
    productCount: 9
  },
  {
    id: '5',
    title: 'Bromine Salt',
    slug: 'bromine-salt',
    description: 'High-purity bromine salt compounds for chemical and industrial use.',
    image: 'https://images.pexels.com/photos/6195085/pexels-photo-6195085.jpeg?auto=compress&cs=tinysrgb&w=600',
    productCount: 4
  }
];

const FeaturedCategories = () => {
  return (
    <Section background="light" id="categories">
      <div className="text-center mb-12">
        <h2 
          className="text-3xl md:text-4xl font-bold mb-4 animate-fadeIn"
        >
          Our Product <span className="bg-gradient-to-r from-blue-600 to-teal-400 bg-clip-text text-transparent">Categories</span>
        </h2>
        <p 
          className="text-gray-600 max-w-2xl mx-auto animate-fadeIn animation-delay-200"
        >
          Explore our extensive range of high-quality bulk products for your business needs.
          We source the finest materials from trusted suppliers worldwide.
        </p>
      </div>

      <div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn animation-delay-300"
      >
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            title={category.title}
            description={category.description}
            image={category.image}
            slug={category.slug}
            productCount={category.productCount}
          />
        ))}
      </div>
    </Section>
  );
};

export default FeaturedCategories;
