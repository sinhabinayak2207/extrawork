/**
 * Strapi API client for fetching data from the Strapi CMS
 * This will replace the mock data when the CMS is set up
 */

const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337';
const API_TOKEN = process.env.STRAPI_API_TOKEN;

/**
 * Fetch data from Strapi API with proper error handling
 */
async function fetchAPI(endpoint: string, options = {}) {
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(API_TOKEN ? { Authorization: `Bearer ${API_TOKEN}` } : {}),
    },
  };

  const mergedOptions = {
    ...defaultOptions,
    ...options,
  };

  try {
    const res = await fetch(`${API_URL}/api${endpoint}`, mergedOptions);
    
    if (!res.ok) {
      console.error(`API error: ${res.status} ${res.statusText}`);
      throw new Error(`API error: ${res.status}`);
    }
    
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching from Strapi:', error);
    throw error;
  }
}

/**
 * Get all product categories
 */
export async function getCategories() {
  const data = await fetchAPI('/categories?populate=*');
  return data.data;
}

/**
 * Get a specific category by slug
 */
export async function getCategory(slug: string) {
  const data = await fetchAPI(`/categories?filters[slug][$eq]=${slug}&populate=*`);
  return data.data[0];
}

/**
 * Get all products or filter by category
 */
export async function getProducts(categorySlug?: string) {
  const filters = categorySlug 
    ? `?filters[category][slug][$eq]=${categorySlug}&populate=*` 
    : '?populate=*';
  
  const data = await fetchAPI(`/products${filters}`);
  return data.data;
}

/**
 * Get featured products
 */
export async function getFeaturedProducts() {
  const data = await fetchAPI('/products?filters[featured][$eq]=true&populate=*');
  return data.data;
}

/**
 * Get a specific product by slug
 */
export async function getProduct(slug: string) {
  const data = await fetchAPI(`/products?filters[slug][$eq]=${slug}&populate=*`);
  return data.data[0];
}

/**
 * Get related products
 */
export async function getRelatedProducts(productId: string, limit: number = 3) {
  // First get the current product to find its category
  const product = await fetchAPI(`/products/${productId}?populate=category`);
  const categoryId = product.data.attributes.category.data.id;
  
  // Then get other products in the same category
  const data = await fetchAPI(
    `/products?filters[id][$ne]=${productId}&filters[category][id][$eq]=${categoryId}&pagination[limit]=${limit}&populate=*`
  );
  
  return data.data;
}

/**
 * Get all services
 */
export async function getServices() {
  const data = await fetchAPI('/services?populate=*');
  return data.data;
}

/**
 * Get a specific service by slug
 */
export async function getService(slug: string) {
  const data = await fetchAPI(`/services?filters[slug][$eq]=${slug}&populate=*`);
  return data.data[0];
}

/**
 * Submit contact form
 */
export async function submitContactForm(formData: any) {
  const response = await fetchAPI('/contact-submissions', {
    method: 'POST',
    body: JSON.stringify({ data: formData }),
  });
  
  return response;
}
