// Client-side API for Firestore updates using server API route
// This avoids direct Firebase initialization on the client

/**
 * Updates a document in Firestore via API
 */
async function updateDocument(collection: string, docId: string, data: any): Promise<boolean> {
  try {
    console.log(`[API Client] Updating ${collection}/${docId} with:`, data);
    
    // Call our API endpoint
    const response = await fetch('/api/db-update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        collection,
        docId,
        data
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error(`[API Client] Error from API:`, errorData);
      return false;
    }
    
    console.log(`[API Client] Successfully updated ${collection}/${docId}`);
    return true;
  } catch (error) {
    console.error(`[API Client] Error updating document:`, error);
    return false;
  }
}

/**
 * Updates a category image in Firestore
 */
export async function updateCategoryImage(categoryId: string, imageUrl: string): Promise<boolean> {
  console.log(`[API Client] Updating category image for ${categoryId}`);
  const success = await updateDocument('categories', categoryId, { imageUrl });
  
  if (success) {
    // Force a refresh to update the UI
    setTimeout(() => {
      window.location.reload();
    }, 500);
  }
  
  return success;
}

/**
 * Updates a product's featured status in Firestore
 */
export async function updateProductFeatured(productId: string, featured: boolean): Promise<boolean> {
  console.log(`[API Client] Updating product featured status for ${productId} to ${featured}`);
  const success = await updateDocument('products', productId, { featured });
  
  if (success) {
    // Force a refresh to update the UI
    setTimeout(() => {
      window.location.reload();
    }, 500);
  }
  
  return success;
}

/**
 * Updates a product's stock status in Firestore
 */
export async function updateProductStock(productId: string, inStock: boolean): Promise<boolean> {
  console.log(`[API Client] Updating product stock status for ${productId} to ${inStock}`);
  const success = await updateDocument('products', productId, { inStock });
  
  if (success) {
    // Force a refresh to update the UI
    setTimeout(() => {
      window.location.reload();
    }, 500);
  }
  
  return success;
}
