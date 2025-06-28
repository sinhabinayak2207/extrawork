export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  image: string;
  category: string;
  featured: boolean;
  specifications?: {
    [key: string]: string;
  };
  relatedProducts?: string[];
}

export interface ProductCategory {
  id: string;
  title: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
}
