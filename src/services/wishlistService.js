import api from './api.js';

const mapWishlistProducts = (response) => {
  if (!response || !response.products) return [];
  return response.products.map((p) => String(p.id));
};

export const wishlistService = {
  async getWishlist() {
    try {
      const response = await api.get('/wishlist');
      return mapWishlistProducts(response.data.data);
    } catch (error) {
      const saved = localStorage.getItem('aurelia_wishlist');
      return saved ? JSON.parse(saved) : [];
    }
  },

  async addToWishlist(productId) {
    try {
      const numericId = typeof productId === 'string' ? parseInt(productId, 10) : productId;
      const response = await api.post(`/wishlist/add/${numericId}`);
      return mapWishlistProducts(response.data.data);
    } catch (error) {
      throw error;
    }
  },

  async removeFromWishlist(productId) {
    try {
      const numericId = typeof productId === 'string' ? parseInt(productId, 10) : productId;
      const response = await api.delete(`/wishlist/remove/${numericId}`);
      return mapWishlistProducts(response.data.data);
    } catch (error) {
      throw error;
    }
  }
};

export default wishlistService;
