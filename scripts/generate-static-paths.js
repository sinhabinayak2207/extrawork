// This script generates static paths for all dynamic routes in the Next.js app
// It's used during the build process to ensure all product pages are pre-rendered

const fs = require('fs');
const path = require('path');

// Import mock data directly
const mockDataPath = path.join(__dirname, '../src/lib/api/mockData.ts');
const mockDataContent = fs.readFileSync(mockDataPath, 'utf8');

// Extract categories and products data using regex
const categoriesMatch = mockDataContent.match(/export const categories: ProductCategory\[\] = \[([\s\S]*?)\];/);
const productsMatch = mockDataContent.match(/export const products: Product\[\] = \[([\s\S]*?)\];/);

if (!categoriesMatch || !productsMatch) {
  console.error('Failed to extract categories or products data from mockData.ts');
  process.exit(1);
}

// Parse categories and products
const categoriesData = categoriesMatch[1];
const productsData = productsMatch[1];

// Extract category slugs
const categorySlugRegex = /slug: ['"]([^'"]+)['"]/g;
const categorySlugMatches = [...categoriesData.matchAll(categorySlugRegex)];
const categorySlugList = categorySlugMatches.map(match => match[1]);

// Extract product data (category and slug pairs)
const productRegex = /{\s*id: ['"]([^'"]+)['"],\s*title: ['"]([^'"]+)['"],\s*slug: ['"]([^'"]+)['"],\s*category: ['"]([^'"]+)['"],/g;
const productMatches = [...productsData.matchAll(productRegex)];
const productList = productMatches.map(match => ({
  id: match[1],
  title: match[2],
  slug: match[3],
  category: match[4]
}));

// Create the necessary directories for static generation
const appDir = path.join(__dirname, '../src/app');

// Generate static params for [category] pages
const categoryPagesDir = path.join(appDir, 'products/[category]');
if (!fs.existsSync(categoryPagesDir)) {
  fs.mkdirSync(categoryPagesDir, { recursive: true });
}

// Create or update the generateStaticParams function for category pages
const categoryStaticParamsContent = `
export async function generateStaticParams() {
  return [
    ${categorySlugList.map(slug => `{ category: '${slug}' }`).join(',\n    ')}
  ];
}
`;

const categoryStaticParamsPath = path.join(categoryPagesDir, 'generateStaticParams.js');
fs.writeFileSync(categoryStaticParamsPath, categoryStaticParamsContent);
console.log(`Generated static params for category pages at ${categoryStaticParamsPath}`);

// Generate static params for [product] pages
const productPagesDir = path.join(appDir, 'products/[category]/[product]');
if (!fs.existsSync(productPagesDir)) {
  fs.mkdirSync(productPagesDir, { recursive: true });
}

// Create or update the generateStaticParams function for product pages
const productStaticParamsContent = `
export async function generateStaticParams() {
  return [
    ${productList.map(product => `{ category: '${product.category}', product: '${product.slug}' }`).join(',\n    ')}
  ];
}
`;

const productStaticParamsPath = path.join(productPagesDir, 'generateStaticParams.js');
fs.writeFileSync(productStaticParamsPath, productStaticParamsContent);
console.log(`Generated static params for product pages at ${productStaticParamsPath}`);

console.log('Static path generation complete!');
