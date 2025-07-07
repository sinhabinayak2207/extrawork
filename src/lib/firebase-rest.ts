// Firebase REST API implementation for direct database access
// This bypasses the Firebase SDK completely to avoid initialization issues

/**
 * Updates a category image in Firestore using REST API
 */
export async function updateCategoryImage(categoryId: string, imageUrl: string): Promise<boolean> {
  try {
    console.log(`[REST] Updating category image for ${categoryId} to ${imageUrl}`);
    
    // Firebase REST API endpoint for this document
    const endpoint = `https://firestore.googleapis.com/v1/projects/b2bshowcase-199a8/databases/(default)/documents/categories/${categoryId}`;
    
    // Current timestamp in Firebase format
    const timestamp = new Date().toISOString();
    
    // Prepare the request body in Firebase REST format
    const requestBody = {
      fields: {
        imageUrl: {
          stringValue: imageUrl
        },
        updatedAt: {
          timestampValue: timestamp
        }
      }
    };
    
    // Make the PATCH request with merge=true
    const response = await fetch(`${endpoint}?updateMask.fieldPaths=imageUrl&updateMask.fieldPaths=updatedAt`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error(`[REST] Firebase REST API error:`, errorData);
      return false;
    }
    
    console.log(`[REST] Successfully updated category image for ${categoryId}`);
    
    // Force a refresh to update the UI
    setTimeout(() => {
      window.location.reload();
    }, 500);
    
    return true;
  } catch (error) {
    console.error(`[REST] Error updating category image:`, error);
    return false;
  }
}

/**
 * Updates a product's featured status in Firestore using REST API
 */
export async function updateProductFeatured(productId: string, featured: boolean): Promise<boolean> {
  try {
    console.log(`[REST] Updating product featured status for ${productId} to ${featured}`);
    
    // Firebase REST API endpoint for this document
    const endpoint = `https://firestore.googleapis.com/v1/projects/b2bshowcase-199a8/databases/(default)/documents/products/${productId}`;
    
    // Current timestamp in Firebase format
    const timestamp = new Date().toISOString();
    
    // Prepare the request body in Firebase REST format
    const requestBody = {
      fields: {
        featured: {
          booleanValue: featured
        },
        updatedAt: {
          timestampValue: timestamp
        }
      }
    };
    
    // Make the PATCH request with merge=true
    const response = await fetch(`${endpoint}?updateMask.fieldPaths=featured&updateMask.fieldPaths=updatedAt`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error(`[REST] Firebase REST API error:`, errorData);
      return false;
    }
    
    console.log(`[REST] Successfully updated product featured status for ${productId}`);
    
    // Force a refresh to update the UI
    setTimeout(() => {
      window.location.reload();
    }, 500);
    
    return true;
  } catch (error) {
    console.error(`[REST] Error updating product featured status:`, error);
    return false;
  }
}

/**
 * Updates a product's stock status in Firestore using REST API
 */
export async function updateProductStock(productId: string, inStock: boolean): Promise<boolean> {
  try {
    console.log(`[REST] Updating product stock status for ${productId} to ${inStock}`);
    
    // Firebase REST API endpoint for this document
    const endpoint = `https://firestore.googleapis.com/v1/projects/b2bshowcase-199a8/databases/(default)/documents/products/${productId}`;
    
    // Current timestamp in Firebase format
    const timestamp = new Date().toISOString();
    
    // Prepare the request body in Firebase REST format
    const requestBody = {
      fields: {
        inStock: {
          booleanValue: inStock
        },
        updatedAt: {
          timestampValue: timestamp
        }
      }
    };
    
    // Make the PATCH request with merge=true
    const response = await fetch(`${endpoint}?updateMask.fieldPaths=inStock&updateMask.fieldPaths=updatedAt`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error(`[REST] Firebase REST API error:`, errorData);
      return false;
    }
    
    console.log(`[REST] Successfully updated product stock status for ${productId}`);
    
    // Force a refresh to update the UI
    setTimeout(() => {
      window.location.reload();
    }, 500);
    
    return true;
  } catch (error) {
    console.error(`[REST] Error updating product stock status:`, error);
    return false;
  }
}
