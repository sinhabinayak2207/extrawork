"use client";

import { useState } from 'react';
import Image from 'next/image';
import { useProducts } from '@/context/ProductContext';
import { logToSystem } from '@/components/SystemLog';
import { useAuth } from '@/context/AuthContext';
import { uploadImage } from '@/lib/cloudinary';
import { Switch } from '@/components/ui/Switch';

interface Category {
  id: string;
  name: string;
}

const productCategories: Category[] = [
  { id: 'rice', name: 'Rice' },
  { id: 'seeds', name: 'Seeds' },
  { id: 'oil', name: 'Oil' },
  { id: 'raw-polymers', name: 'Raw Polymers' },
  { id: 'bromine-salt', name: 'Bromine Salt' },
];

interface AddProductFormProps {
  onClose: () => void;
}

export default function AddProductForm({ onClose }: AddProductFormProps) {
  const { user, isMasterAdmin } = useAuth();
  const productContext = useProducts();
  const [productImageFile, setProductImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSpecifications, setShowSpecifications] = useState(false);
  const [specifications, setSpecifications] = useState<{key: string, value: string}[]>([{key: '', value: ''}]);
  const [newProductForm, setNewProductForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'rice',
    imageUrl: '',
    featured: false,
    inStock: true
  });

  if (!productContext) {
    return <div className="p-4 text-red-500">Error: Product context not available</div>;
  }

  const { addProduct } = productContext;

  // Handle product form changes
  const handleProductFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewProductForm(prev => ({
      ...prev,
      [name]: name === 'price' ? value.replace(/[^0-9.]/g, '') : value
    }));
  };

  // Handle product image upload for new product
  const handleProductFormFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProductImageFile(e.target.files[0]);
    }
  };

  // Handle add product form submission
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      if (!newProductForm.name || !newProductForm.description || !newProductForm.price || !newProductForm.category) {
        logToSystem('Please fill all required fields', 'error');
        return;
      }
      
      // Validate specifications if they are being added
      if (isMasterAdmin && showSpecifications) {
        // Filter out empty specifications
        const validSpecs = specifications.filter(spec => spec.key.trim() !== '' && spec.value.trim() !== '');
        if (validSpecs.length === 0 && specifications.length > 1) {
          logToSystem('Please add at least one valid specification or disable specifications', 'error');
        }
      }
      
      let imageUrl = newProductForm.imageUrl;
      
      // Upload image to Cloudinary if provided
      if (productImageFile) {
        try {
          logToSystem(`Uploading image for product ${newProductForm.name}...`, 'info');
          imageUrl = await uploadImage(productImageFile, 'products');
          logToSystem(`Image uploaded successfully: ${imageUrl}`, 'success');
        } catch (error) {
          logToSystem(`Error uploading image: ${error instanceof Error ? error.message : String(error)}`, 'error');
          // Continue with default image if upload fails
          imageUrl = 'https://via.placeholder.com/300x300?text=Product+Image';
        }
      } else {
        // Set a default image if none provided
        imageUrl = 'https://via.placeholder.com/300x300?text=Product+Image';
      }
      
      // Process specifications if master admin and specifications are enabled
      let productSpecifications: Record<string, string> | undefined;
      if (isMasterAdmin && showSpecifications) {
        productSpecifications = {};
        specifications.forEach(spec => {
          if (spec.key.trim() !== '' && spec.value.trim() !== '') {
            productSpecifications![spec.key.trim()] = spec.value.trim();
          }
        });
        
        // If no valid specifications, set to undefined
        if (Object.keys(productSpecifications).length === 0) {
          productSpecifications = undefined;
        } else {
          logToSystem(`Added ${Object.keys(productSpecifications).length} specifications to product`, 'info');
        }
      }
      
      // Create product object with the image URL and specifications
      const newProduct = {
        ...newProductForm,
        imageUrl: imageUrl, // Use the uploaded image URL or default
        price: parseFloat(newProductForm.price),
        createdAt: new Date(),
        updatedAt: new Date(),
        updatedBy: user?.email || 'admin',
        specifications: productSpecifications
      };
      
      // Add product to database
      const productId = await addProduct(newProduct);
      logToSystem(`Product ${newProductForm.name} added with ID: ${productId}`, 'success');
      
      // Reset form and close modal
      setNewProductForm({
        name: '',
        description: '',
        price: '',
        category: 'rice',
        imageUrl: '',
        featured: false,
        inStock: true
      });
      setProductImageFile(null);
      setSpecifications([{key: '', value: ''}]);
      onClose();
    } catch (error) {
      logToSystem(`Error adding product: ${error instanceof Error ? error.message : String(error)}`, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl overflow-hidden">
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-xl font-bold text-gray-900">Add New Product</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleAddProduct} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Image Upload */}
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center h-80">
                {productImageFile ? (
                  <div className="relative w-full h-full">
                    <Image 
                      src={URL.createObjectURL(productImageFile)} 
                      alt="Product preview" 
                      fill
                      className="object-contain" 
                    />
                    <button 
                      type="button"
                      onClick={() => setProductImageFile(null)}
                      className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="mt-1 text-sm text-gray-600">Upload product image</p>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                )}
                <input 
                  type="file" 
                  id="product-image" 
                  accept="image/*" 
                  onChange={handleProductFormFileChange}
                  className="hidden" 
                />
                <label 
                  htmlFor="product-image"
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
                >
                  {productImageFile ? 'Change Image' : 'Select Image'}
                </label>
              </div>
            </div>
            
            {/* Right Column - Product Details */}
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  value={newProductForm.name}
                  onChange={handleProductFormChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                <select 
                  id="category" 
                  name="category" 
                  value={newProductForm.category}
                  onChange={handleProductFormChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  {productCategories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">₹</span>
                  </div>
                  <input 
                    type="text" 
                    id="price" 
                    name="price" 
                    value={newProductForm.price}
                    onChange={handleProductFormChange}
                    className="block w-full pl-7 pr-12 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea 
                  id="description" 
                  name="description" 
                  rows={4} 
                  value={newProductForm.description}
                  onChange={handleProductFormChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                ></textarea>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <input 
                    id="featured" 
                    name="featured" 
                    type="checkbox" 
                    checked={newProductForm.featured}
                    onChange={(e) => setNewProductForm(prev => ({ ...prev, featured: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">Featured Product</label>
                </div>
                
                <div className="flex items-center">
                  <input 
                    id="inStock" 
                    name="inStock" 
                    type="checkbox" 
                    checked={newProductForm.inStock}
                    onChange={(e) => setNewProductForm(prev => ({ ...prev, inStock: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="inStock" className="ml-2 block text-sm text-gray-700">In Stock</label>
                </div>
              </div>
              
              {/* Master Admin Specifications Toggle - Only visible to master admins */}
              {isMasterAdmin && (
                <div className="mt-4 border-t pt-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-medium text-gray-900">Advanced Product Details</h3>
                    <Switch 
                      id="specifications-toggle" 
                      checked={showSpecifications} 
                      onChange={setShowSpecifications}
                      label={showSpecifications ? "Specifications Mode" : "Basic Mode"}
                      description={showSpecifications ? "Add detailed specifications" : "Standard product information"}
                    />
                  </div>
                  
                  {showSpecifications && (
                    <div className="space-y-3 bg-gray-50 p-3 rounded-md">
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-medium text-gray-700">Product Specifications</h4>
                        <button
                          type="button"
                          onClick={() => setSpecifications([...specifications, {key: '', value: ''}])}
                          className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Add Spec
                        </button>
                      </div>
                      
                      {specifications.map((spec, index) => (
                        <div key={index} className="flex space-x-2">
                          <div className="flex-1">
                            <input
                              type="text"
                              placeholder="Specification Key"
                              value={spec.key}
                              onChange={(e) => {
                                const newSpecs = [...specifications];
                                newSpecs[index].key = e.target.value;
                                setSpecifications(newSpecs);
                              }}
                              className="w-full text-sm border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <div className="flex-1">
                            <input
                              type="text"
                              placeholder="Specification Value"
                              value={spec.value}
                              onChange={(e) => {
                                const newSpecs = [...specifications];
                                newSpecs[index].value = e.target.value;
                                setSpecifications(newSpecs);
                              }}
                              className="w-full text-sm border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          {specifications.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                const newSpecs = [...specifications];
                                newSpecs.splice(index, 1);
                                setSpecifications(newSpecs);
                              }}
                              className="inline-flex items-center p-1 border border-transparent rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Adding...' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
