import { categories } from '../../../lib/api/mockData';

export async function generateStaticParams() {
  return categories.map(category => ({
    category: category.slug,
  }));
}
