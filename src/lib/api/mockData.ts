import { Product, ProductCategory } from "../../types/product";
import { Service } from "../../types/service";

// Mock categories data
export const categories: ProductCategory[] = [
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

// Mock products data
export const products: Product[] = [
  {
    id: '1',
    title: 'Premium Basmati Rice',
    slug: 'premium-basmati-rice',
    description: 'Long-grain aromatic rice known for its nutty flavor and floral aroma. Perfect for pilaf, biryani, and other rice dishes.',
    image: 'https://images.pexels.com/photos/4110251/pexels-photo-4110251.jpeg?auto=compress&cs=tinysrgb&w=600',
    category: 'rice',
    featured: true,
    specifications: {
      'Origin': 'India',
      'Grain Length': 'Extra Long',
      'Aging': '2 Years',
      'Packaging': 'Bulk 25kg bags',
      'Certification': 'ISO 22000, HACCP'
    }
  },
  {
    id: '2',
    title: 'Organic Sunflower Seeds',
    slug: 'organic-sunflower-seeds',
    description: 'High-quality organic sunflower seeds rich in nutrients and perfect for oil production or direct consumption.',
    image: 'https://images.pexels.com/photos/1537169/pexels-photo-1537169.jpeg?auto=compress&cs=tinysrgb&w=600',
    category: 'seeds',
    featured: true,
    specifications: {
      'Origin': 'Ukraine',
      'Type': 'Black Oil',
      'Certification': 'USDA Organic',
      'Oil Content': '40-45%',
      'Packaging': 'Bulk 50kg bags'
    }
  },
  {
    id: '3',
    title: 'Refined Soybean Oil',
    slug: 'refined-soybean-oil',
    description: 'Pure refined soybean oil suitable for cooking, food processing, and industrial applications.',
    image: 'https://images.pexels.com/photos/1458694/pexels-photo-1458694.jpeg?auto=compress&cs=tinysrgb&w=600',
    category: 'oil',
    featured: true,
    specifications: {
      'Origin': 'Brazil',
      'Acid Value': '≤0.2 mg KOH/g',
      'Peroxide Value': '≤5.0 meq/kg',
      'Free Fatty Acids': '≤0.05%',
      'Packaging': 'Flexi-tanks, ISO tanks'
    }
  },
  {
    id: '4',
    title: 'High-Density Polyethylene',
    slug: 'high-density-polyethylene',
    description: 'Industrial-grade HDPE polymer with excellent impact resistance and tensile strength for manufacturing.',
    image: 'https://images.pexels.com/photos/3825527/pexels-photo-3825527.jpeg?auto=compress&cs=tinysrgb&w=600',
    category: 'raw-polymers',
    featured: false,
    specifications: {
      'Density': '0.941-0.965 g/cm³',
      'Melt Index': '0.25-10 g/10 min',
      'Tensile Strength': '22-38 MPa',
      'Form': 'Pellets',
      'Packaging': '25kg bags on pallets'
    }
  },
  {
    id: '5',
    title: 'Calcium Bromide Solution',
    slug: 'calcium-bromide-solution',
    description: 'High-purity calcium bromide solution used in oil drilling, pharmaceuticals, and other industrial applications.',
    image: 'https://images.pexels.com/photos/6195085/pexels-photo-6195085.jpeg?auto=compress&cs=tinysrgb&w=600',
    category: 'bromine-salt',
    featured: false,
    specifications: {
      'Concentration': '52-54%',
      'Density': '1.70-1.80 g/cm³',
      'pH': '6.5-8.0',
      'Appearance': 'Clear liquid',
      'Packaging': 'IBC tanks, drums'
    }
  },
  {
    id: '6',
    title: 'Jasmine Rice',
    slug: 'jasmine-rice',
    description: 'Fragrant, long-grain rice with a subtle floral aroma, ideal for Asian cuisine and everyday meals.',
    image: 'https://images.pexels.com/photos/4110251/pexels-photo-4110251.jpeg?auto=compress&cs=tinysrgb&w=600',
    category: 'rice',
    featured: false,
    specifications: {
      'Origin': 'Thailand',
      'Grain Type': 'Long',
      'Aroma': 'Fragrant',
      'Packaging': 'Bulk 20kg bags',
      'Certification': 'ISO 22000'
    }
  },
  {
    id: '7',
    title: 'Brown Rice',
    slug: 'brown-rice',
    description: 'Whole grain rice with the bran layer intact, offering more fiber and nutrients than white rice varieties.',
    image: 'https://images.pexels.com/photos/4110251/pexels-photo-4110251.jpeg?auto=compress&cs=tinysrgb&w=600',
    category: 'rice',
    featured: false,
    specifications: {
      'Origin': 'USA',
      'Grain Type': 'Medium',
      'Processing': 'Hulled only',
      'Packaging': 'Bulk 25kg bags',
      'Shelf Life': '6 months'
    }
  },
  {
    id: '8',
    title: 'Canola Seeds',
    slug: 'canola-seeds',
    description: 'High-quality canola seeds with excellent oil content, ideal for oil production and agricultural use.',
    image: 'https://images.pexels.com/photos/1537169/pexels-photo-1537169.jpeg?auto=compress&cs=tinysrgb&w=600',
    category: 'seeds',
    featured: false,
    specifications: {
      'Origin': 'Canada',
      'Oil Content': '40-44%',
      'Moisture': '≤8%',
      'Purity': '≥99.5%',
      'Packaging': 'Bulk bags'
    }
  },
  {
    id: '9',
    title: 'Palm Oil',
    slug: 'palm-oil',
    description: 'Versatile vegetable oil derived from palm fruit, used in food products, cosmetics, and biofuel.',
    image: 'https://images.pexels.com/photos/1458694/pexels-photo-1458694.jpeg?auto=compress&cs=tinysrgb&w=600',
    category: 'oil',
    featured: false,
    specifications: {
      'Origin': 'Malaysia',
      'FFA': '≤5%',
      'Moisture': '≤0.25%',
      'Iodine Value': '50-55',
      'Packaging': 'Flexi-tanks, drums'
    }
  },
  {
    id: '10',
    title: 'Polypropylene',
    slug: 'polypropylene',
    description: 'Versatile thermoplastic polymer used in packaging, textiles, automotive components, and more.',
    image: 'https://images.pexels.com/photos/3825527/pexels-photo-3825527.jpeg?auto=compress&cs=tinysrgb&w=600',
    category: 'raw-polymers',
    featured: false,
    specifications: {
      'Density': '0.90-0.91 g/cm³',
      'Melt Flow Rate': '1-25 g/10 min',
      'Form': 'Pellets',
      'Color': 'Natural/White',
      'Packaging': '25kg bags'
    }
  }
];

// API functions to simulate backend calls
export const getCategories = async (): Promise<ProductCategory[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return categories;
};

export const getCategory = async (slug: string): Promise<ProductCategory | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return categories.find(category => category.slug === slug) || null;
};

export const getProducts = async (categorySlug?: string): Promise<Product[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (categorySlug) {
    return products.filter(product => product.category === categorySlug);
  }
  
  return products;
};

export const getFeaturedProducts = async (): Promise<Product[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return products.filter(product => product.featured);
};

export const getProduct = async (slug: string): Promise<Product | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return products.find(product => product.slug === slug) || null;
};

export const getRelatedProducts = async (productId: string, limit: number = 3): Promise<Product[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const currentProduct = products.find(p => p.id === productId);
  if (!currentProduct) return [];
  
  // Get products from the same category, excluding the current product
  const sameCategory = products.filter(p => 
    p.category === currentProduct.category && p.id !== productId
  );
  
  // If we have enough products in the same category, return those
  if (sameCategory.length >= limit) {
    return sameCategory.slice(0, limit);
  }
  
  // Otherwise, add some featured products to fill the gap
  const featuredProducts = products.filter(p => 
    p.featured && p.id !== productId && p.category !== currentProduct.category
  );
  
  return [...sameCategory, ...featuredProducts].slice(0, limit);
};

// Mock services data
export const services: Service[] = [
  {
    id: '1',
    title: 'Bulk Commodity Sourcing',
    slug: 'bulk-commodity-sourcing',
    description: 'Expert sourcing of high-quality bulk commodities from trusted global suppliers.',
    icon: 'search',
    longDescription: 'Our bulk commodity sourcing service connects you with premium suppliers worldwide. We leverage our extensive network and industry expertise to source the exact commodities you need at competitive prices, ensuring consistent quality and reliable delivery schedules.',
    benefits: [
      'Access to our global network of verified suppliers',
      'Competitive pricing through volume negotiations',
      'Quality assurance and product verification',
      'Streamlined procurement process',
      'Market intelligence and pricing trends'
    ],
    process: [
      {
        title: 'Requirements Analysis',
        description: 'We work with you to understand your specific commodity needs, quality requirements, volume, and timeline.'
      },
      {
        title: 'Supplier Selection',
        description: 'Our team identifies and evaluates potential suppliers based on your criteria, ensuring they meet our strict quality and reliability standards.'
      },
      {
        title: 'Negotiation & Contracting',
        description: 'We negotiate favorable terms and establish clear contracts that protect your interests and ensure transparency.'
      },
      {
        title: 'Quality Control',
        description: 'Our quality assurance team conducts thorough inspections and testing to verify that all commodities meet your specifications.'
      },
      {
        title: 'Logistics Coordination',
        description: 'We arrange efficient transportation and delivery, managing all logistics details from origin to destination.'
      }
    ],
    faqs: [
      {
        question: 'What types of commodities do you source?',
        answer: 'We specialize in agricultural commodities (grains, seeds, oils), industrial raw materials (polymers, chemicals), and specialty ingredients. Our network allows us to source a wide range of products based on client needs.'
      },
      {
        question: 'How do you ensure quality control?',
        answer: 'We implement a multi-stage quality assurance process including supplier verification, pre-shipment inspections, sample testing, and certification verification to ensure all commodities meet specified standards.'
      },
      {
        question: 'What is your minimum order quantity?',
        answer: 'Minimum order quantities vary by commodity type. We typically work with medium to large volume orders, but we can accommodate smaller orders in certain cases. Contact us for specific MOQ information for your product of interest.'
      }
    ]
  },
  {
    id: '2',
    title: 'Supply Chain Management',
    slug: 'supply-chain-management',
    description: 'End-to-end supply chain solutions optimized for efficiency, transparency, and cost-effectiveness.',
    icon: 'truck',
    longDescription: 'Our comprehensive supply chain management service streamlines your entire commodity procurement process. From initial sourcing to final delivery, we optimize each step to reduce costs, minimize delays, and provide complete visibility throughout the journey.',
    benefits: [
      'Reduced operational complexity and overhead',
      'Enhanced visibility and traceability',
      'Optimized inventory management',
      'Risk mitigation strategies',
      'Cost savings through efficient processes'
    ],
    process: [
      {
        title: 'Supply Chain Assessment',
        description: 'We analyze your current supply chain to identify inefficiencies, bottlenecks, and opportunities for improvement.'
      },
      {
        title: 'Strategy Development',
        description: 'Our team creates a customized supply chain strategy aligned with your business objectives and market requirements.'
      },
      {
        title: 'Implementation',
        description: 'We deploy the optimized supply chain solution, integrating with your existing systems and processes.'
      },
      {
        title: 'Monitoring & Analytics',
        description: 'Advanced tracking and analytics provide real-time visibility and actionable insights into your supply chain performance.'
      },
      {
        title: 'Continuous Improvement',
        description: 'We regularly review and refine your supply chain processes to adapt to changing market conditions and business needs.'
      }
    ]
  },
  {
    id: '3',
    title: 'Quality Assurance',
    slug: 'quality-assurance',
    description: 'Rigorous testing and verification processes to ensure all commodities meet the highest quality standards.',
    icon: 'shield-check',
    longDescription: 'Our quality assurance service provides comprehensive testing and verification to ensure your commodities consistently meet or exceed industry standards and your specific requirements. We implement rigorous protocols at every stage of the supply chain to prevent quality issues before they occur.',
    benefits: [
      'Consistent product quality and performance',
      'Reduced risk of substandard materials',
      'Compliance with international standards',
      'Detailed quality documentation and certification',
      'Early detection of potential issues'
    ],
    process: [
      {
        title: 'Standards Definition',
        description: 'We work with you to define clear quality specifications and acceptance criteria based on your needs and industry standards.'
      },
      {
        title: 'Supplier Qualification',
        description: 'Our team evaluates and qualifies suppliers based on their ability to consistently deliver products meeting your quality requirements.'
      },
      {
        title: 'Inspection & Testing',
        description: 'We conduct thorough inspections and laboratory testing at critical points in the supply chain to verify quality compliance.'
      },
      {
        title: 'Documentation & Certification',
        description: 'Comprehensive quality documentation and certification is provided for each shipment, ensuring traceability and compliance.'
      },
      {
        title: 'Continuous Monitoring',
        description: 'Ongoing quality monitoring and supplier performance tracking helps maintain consistent quality over time.'
      }
    ]
  },
  {
    id: '4',
    title: 'Logistics & Distribution',
    slug: 'logistics-distribution',
    description: 'Efficient transportation, warehousing, and distribution services for seamless delivery of your commodities.',
    icon: 'globe',
    longDescription: 'Our logistics and distribution service provides seamless transportation, warehousing, and delivery solutions tailored to your specific commodity requirements. We manage the entire process from origin to destination, ensuring timely and cost-effective movement of your goods.',
    benefits: [
      'Optimized transportation routes and modes',
      'Reduced shipping costs and transit times',
      'Strategic warehousing and inventory management',
      'Real-time tracking and status updates',
      'Customs clearance and documentation support'
    ],
    process: [
      {
        title: 'Logistics Planning',
        description: 'We develop a comprehensive logistics plan considering product characteristics, volume, timeline, and budget constraints.'
      },
      {
        title: 'Carrier Selection',
        description: 'Our team selects the optimal transportation providers and routes based on your specific requirements and priorities.'
      },
      {
        title: 'Documentation & Compliance',
        description: 'We handle all necessary shipping documentation and ensure compliance with international trade regulations and customs requirements.'
      },
      {
        title: 'Shipment Execution',
        description: 'Our logistics specialists coordinate loading, transportation, and delivery, resolving any issues that arise during transit.'
      },
      {
        title: 'Performance Analysis',
        description: 'We track key performance indicators and provide detailed reports to continuously improve logistics efficiency.'
      }
    ]
  },
  {
    id: '5',
    title: 'Market Intelligence',
    slug: 'market-intelligence',
    description: 'Actionable insights on market trends, pricing forecasts, and strategic opportunities in the commodity sector.',
    icon: 'chart-bar',
    longDescription: 'Our market intelligence service provides you with timely, accurate information and analysis on commodity markets worldwide. We help you understand price trends, supply-demand dynamics, regulatory changes, and emerging opportunities to make informed business decisions.',
    benefits: [
      'Data-driven procurement strategies',
      'Improved timing on buying decisions',
      'Early identification of market opportunities',
      'Risk management through market foresight',
      'Competitive advantage through superior market knowledge'
    ],
    process: [
      {
        title: 'Information Gathering',
        description: 'We collect data from multiple sources including industry reports, supplier networks, trade publications, and proprietary databases.'
      },
      {
        title: 'Analysis & Interpretation',
        description: 'Our analysts evaluate market data to identify meaningful patterns, trends, and implications specific to your business needs.'
      },
      {
        title: 'Customized Reporting',
        description: 'We deliver tailored intelligence reports focusing on the commodities, regions, and market factors most relevant to your operations.'
      },
      {
        title: 'Strategic Recommendations',
        description: 'Based on our analysis, we provide actionable recommendations to capitalize on market opportunities and mitigate risks.'
      },
      {
        title: 'Ongoing Monitoring',
        description: 'We continuously track market developments and provide updates on significant changes that could impact your business.'
      }
    ]
  }
];

// Service API functions
export const getServices = async (): Promise<Service[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return services;
};

export const getService = async (slug: string): Promise<Service | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return services.find(service => service.slug === slug) || null;
};