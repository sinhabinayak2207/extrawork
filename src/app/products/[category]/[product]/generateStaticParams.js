import { products } from '../../../../lib/api/mockData';

export async function generateStaticParams() {
  return products.map(product => ({
    category: product.category,
    product: product.slug,
  }));
}
