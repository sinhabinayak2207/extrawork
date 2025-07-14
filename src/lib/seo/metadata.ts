import { Metadata } from 'next';
import { Product } from '../../types/product';
import { Service } from '../../types/service';

// Base URL for the website
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://yourdomain.com';

// Default metadata for the site
export const defaultMetadata: Metadata = {
  title: {
    default: 'B2B Showcase | Premium Industrial Solutions',
    template: '%s | B2B Showcase'
  },
  description: 'Leading provider of industrial solutions with premium products and expert services for businesses worldwide.',
  keywords: ['B2B', 'industrial', 'manufacturing', 'solutions', 'products', 'services'],
  authors: [{ name: 'Your Company Name' }],
  creator: 'Your Company Name',
  publisher: 'Your Company Name',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: baseUrl,
    siteName: 'B2B Showcase',
    title: 'B2B Showcase | Premium Industrial Solutions',
    description: 'Leading provider of industrial solutions with premium products and expert services for businesses worldwide.',
    images: [
      {
        url: `${baseUrl}/images/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'B2B Showcase',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'B2B Showcase | Premium Industrial Solutions',
    description: 'Leading provider of industrial solutions with premium products and expert services for businesses worldwide.',
    images: [`${baseUrl}/images/twitter-image.jpg`],
    creator: '@yourcompany',
  },
};

// Generate metadata for home page
export function getHomeMetadata(): Metadata {
  return {
    ...defaultMetadata,
    title: 'B2B Showcase | Premium Industrial Solutions',
    description: 'Leading provider of industrial solutions with premium products and expert services for businesses worldwide.',
    openGraph: {
      ...defaultMetadata.openGraph,
      title: 'B2B Showcase | Premium Industrial Solutions',
      description: 'Leading provider of industrial solutions with premium products and expert services for businesses worldwide.',
    },
    twitter: {
      ...defaultMetadata.twitter,
      title: 'B2B Showcase | Premium Industrial Solutions',
      description: 'Leading provider of industrial solutions with premium products and expert services for businesses worldwide.',
    },
  };
}

// Generate metadata for products page
export function getProductsMetadata(): Metadata {
  return {
    title: 'Our Products',
    description: 'Explore our comprehensive range of high-quality industrial products designed for performance and reliability.',
    openGraph: {
      ...defaultMetadata.openGraph,
      title: 'Our Products | B2B Showcase',
      description: 'Explore our comprehensive range of high-quality industrial products designed for performance and reliability.',
    },
    twitter: {
      ...defaultMetadata.twitter,
      title: 'Our Products | B2B Showcase',
      description: 'Explore our comprehensive range of high-quality industrial products designed for performance and reliability.',
    },
  };
}

// Generate metadata for product category page
export function getProductCategoryMetadata(categoryName: string, description: string): Metadata {
  return {
    title: categoryName,
    description: description || `Explore our range of ${categoryName} products designed for optimal performance and reliability.`,
    openGraph: {
      ...defaultMetadata.openGraph,
      title: `${categoryName} | B2B Showcase`,
      description: description || `Explore our range of ${categoryName} products designed for optimal performance and reliability.`,
    },
    twitter: {
      ...defaultMetadata.twitter,
      title: `${categoryName} | B2B Showcase`,
      description: description || `Explore our range of ${categoryName} products designed for optimal performance and reliability.`,
    },
  };
}

// Generate metadata for product detail page
export function getProductMetadata(product: Product): Metadata {
  return {
    title: product.title,
    description: product.description || `Learn more about ${product.title}, a premium product in our ${product.category} category.`,
    keywords: [...(defaultMetadata.keywords as string[]), product.title, product.category],
    openGraph: {
      ...defaultMetadata.openGraph,
      title: `${product.title} | B2B Showcase`,
      description: product.description || `Learn more about ${product.title}, a premium product in our ${product.category} category.`,
      images: product.image ? [
        {
          url: product.image.startsWith('http') ? product.image : `${baseUrl}${product.image}`,
          width: 1200,
          height: 630,
          alt: product.title,
        },
      ] : defaultMetadata.openGraph?.images,
    },
    twitter: {
      ...defaultMetadata.twitter,
      title: `${product.title} | B2B Showcase`,
      description: product.description || `Learn more about ${product.title}, a premium product in our ${product.category} category.`,
      images: product.image ? [product.image.startsWith('http') ? product.image : `${baseUrl}${product.image}`] : defaultMetadata.twitter?.images,
    },
  };
}

// Generate metadata for services page
export function getServicesMetadata(): Metadata {
  return {
    title: 'Our Services',
    description: 'Discover our comprehensive range of professional services designed to optimize your business operations and drive growth.',
    openGraph: {
      ...defaultMetadata.openGraph,
      title: 'Our Services | B2B Showcase',
      description: 'Discover our comprehensive range of professional services designed to optimize your business operations and drive growth.',
    },
    twitter: {
      ...defaultMetadata.twitter,
      title: 'Our Services | B2B Showcase',
      description: 'Discover our comprehensive range of professional services designed to optimize your business operations and drive growth.',
    },
  };
}

// Generate metadata for service detail page
export function getServiceMetadata(service: Service): Metadata {
  return {
    title: service.title,
    description: service.description || `Learn more about our ${service.title} service and how it can benefit your business.`,
    keywords: [...(defaultMetadata.keywords as string[]), service.title, 'service', 'business solution'],
    openGraph: {
      ...defaultMetadata.openGraph,
      title: `${service.title} | B2B Showcase`,
      description: service.description || `Learn more about our ${service.title} service and how it can benefit your business.`,
      images: service.image ? [
        {
          url: service.image.startsWith('http') ? service.image : `${baseUrl}${service.image}`,
          width: 1200,
          height: 630,
          alt: service.title,
        },
      ] : defaultMetadata.openGraph?.images,
    },
    twitter: {
      ...defaultMetadata.twitter,
      title: `${service.title} | B2B Showcase`,
      description: service.description || `Learn more about our ${service.title} service and how it can benefit your business.`,
      images: service.image ? [service.image.startsWith('http') ? service.image : `${baseUrl}${service.image}`] : defaultMetadata.twitter?.images,
    },
  };
}

// Generate metadata for contact page
export function getContactMetadata(): Metadata {
  return {
    title: 'Contact Us',
    description: 'Get in touch with our team for inquiries, support, or to discuss how our solutions can help your business.',
    openGraph: {
      ...defaultMetadata.openGraph,
      title: 'Contact Us | B2B Showcase',
      description: 'Get in touch with our team for inquiries, support, or to discuss how our solutions can help your business.',
    },
    twitter: {
      ...defaultMetadata.twitter,
      title: 'Contact Us | B2B Showcase',
      description: 'Get in touch with our team for inquiries, support, or to discuss how our solutions can help your business.',
    },
  };
}

// Generate metadata for about page
export function getAboutMetadata(): Metadata {
  return {
    title: 'About Us',
    description: 'Learn about our company, our mission, values, and the team behind our innovative B2B solutions.',
    openGraph: {
      ...defaultMetadata.openGraph,
      title: 'About Us | B2B Showcase',
      description: 'Learn about our company, our mission, values, and the team behind our innovative B2B solutions.',
    },
    twitter: {
      ...defaultMetadata.twitter,
      title: 'About Us | B2B Showcase',
      description: 'Learn about our company, our mission, values, and the team behind our innovative B2B solutions.',
    },
  };
}
