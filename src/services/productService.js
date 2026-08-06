import api from './api.js';
import { productsData as initialProducts } from '../data/mockData.js';

const mapBackendToFrontendProduct = (bp) => {
  const categoryName = bp.categoryName || 'Rings';
  return {
    id: String(bp.id),
    name: bp.name,
    price: Number(bp.price),
    image: bp.primaryImageUrl || (bp.images && bp.images[0]) || '',
    images: bp.images && bp.images.length > 0 ? bp.images : [bp.primaryImageUrl],
    category: categoryName,
    isNew: bp.isNew ?? false,
    isFeatured: bp.isFeatured ?? false,
    isNewArrival: bp.isNewArrival ?? false,
    description: bp.description || '',
    material: bp.material || 'Solid Gold',
    gemstone: bp.gemstone || '',
    weight: bp.weight || '5.0g',
    rating: Number(bp.rating || 5.0),
    reviewCount: bp.reviewCount || 0,
    stock: bp.stock ?? 10,
    reviews: [
      {
        id: 'rev_' + bp.id + '_1',
        user: 'Aurelia VIP Client',
        rating: 5,
        date: new Date().toISOString().split('T')[0],
        comment: 'Absolutely spectacular craftsmanship and brilliant finish!'
      }
    ]
  };
};

export const productService = {
  async getAllProducts() {
    try {
      const response = await api.get('/products');
      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        return response.data.data.map(mapBackendToFrontendProduct);
      }
      return initialProducts;
    } catch (error) {
      console.warn('Backend unavailable, utilizing local product catalogue');
      return initialProducts;
    }
  },

  async getProductById(id) {
    try {
      const numericId = parseInt(id, 10);
      if (!isNaN(numericId)) {
        const response = await api.get(`/products/${numericId}`);
        if (response.data && response.data.data) {
          return mapBackendToFrontendProduct(response.data.data);
        }
      }
      const found = initialProducts.find((p) => p.id === id);
      if (found) return found;
      throw new Error('Product not found');
    } catch (error) {
      const found = initialProducts.find((p) => p.id === id);
      if (found) return found;
      throw error;
    }
  },

  async getProductsByCategory(categorySlug) {
    try {
      const response = await api.get(`/products/category/${categorySlug}`);
      if (response.data && response.data.data) {
        return response.data.data.map(mapBackendToFrontendProduct);
      }
      return initialProducts.filter((p) => p.category.toLowerCase() === categorySlug.toLowerCase());
    } catch (error) {
      return initialProducts.filter((p) => p.category.toLowerCase() === categorySlug.toLowerCase());
    }
  },

  async getFeaturedProducts() {
    try {
      const response = await api.get('/products/featured');
      if (response.data && response.data.data) {
        return response.data.data.map(mapBackendToFrontendProduct);
      }
      return initialProducts.filter((p) => p.isFeatured);
    } catch (error) {
      return initialProducts.filter((p) => p.isFeatured);
    }
  },

  async getNewArrivals() {
    try {
      const response = await api.get('/products/new-arrivals');
      if (response.data && response.data.data) {
        return response.data.data.map(mapBackendToFrontendProduct);
      }
      return initialProducts.filter((p) => p.isNewArrival);
    } catch (error) {
      return initialProducts.filter((p) => p.isNewArrival);
    }
  },

  async filterProducts(keyword, categoryId, minPrice, maxPrice) {
    try {
      const params = {};
      if (keyword) params.keyword = keyword;
      if (categoryId) params.categoryId = categoryId;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;

      const response = await api.get('/products/search', { params });
      if (response.data && response.data.data) {
        return response.data.data.map(mapBackendToFrontendProduct);
      }
      return initialProducts;
    } catch (error) {
      return initialProducts;
    }
  }
};

export default productService;
