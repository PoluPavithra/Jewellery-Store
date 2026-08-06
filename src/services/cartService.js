import api from './api.js';

const mapBackendCartToFrontend = (cartResponse) => {
  if (!cartResponse || !cartResponse.items) return [];
  return cartResponse.items.map((item) => {
    const bp = item.product;
    const categoryName = bp.categoryName || 'Rings';
    const product = {
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
      material: bp.material || '18k Gold',
      gemstone: bp.gemstone || '',
      weight: bp.weight || '4.0g',
      rating: Number(bp.rating || 5.0),
      reviewCount: bp.reviewCount || 0,
      stock: bp.stock ?? 10,
      reviews: []
    };
    return {
      product,
      quantity: item.quantity,
      cartItemId: item.id
    };
  });
};

export const cartService = {
  async getCart() {
    try {
      const response = await api.get('/cart');
      return mapBackendCartToFrontend(response.data.data);
    } catch (error) {
      const saved = localStorage.getItem('aurelia_cart');
      return saved ? JSON.parse(saved) : [];
    }
  },

  async addToCart(productId, quantity = 1, selectedSize) {
    try {
      const numericProductId = typeof productId === 'string' ? parseInt(productId, 10) : productId;
      if (isNaN(numericProductId)) {
        throw new Error('Invalid product ID for backend API');
      }
      const response = await api.post('/cart/add', {
        productId: numericProductId,
        quantity,
        selectedSize: selectedSize || 'Standard'
      });
      return mapBackendCartToFrontend(response.data.data);
    } catch (error) {
      throw error;
    }
  },

  async updateCartItem(itemId, quantity) {
    try {
      const response = await api.put(`/cart/items/${itemId}`, {
        quantity
      });
      return mapBackendCartToFrontend(response.data.data);
    } catch (error) {
      throw error;
    }
  },

  async removeFromCart(itemId) {
    try {
      const response = await api.delete(`/cart/items/${itemId}`);
      return mapBackendCartToFrontend(response.data.data);
    } catch (error) {
      throw error;
    }
  },

  async clearCart() {
    try {
      await api.delete('/cart/clear');
    } catch (error) {
      localStorage.removeItem('aurelia_cart');
    }
  }
};

export default cartService;
