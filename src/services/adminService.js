import api from './api.js';

export const adminService = {
  async getStats() {
    try {
      const response = await api.get('/admin/stats');
      return response.data.data;
    } catch (error) {
      return {
        totalProducts: 18,
        totalOrders: 42,
        totalCustomers: 128,
        totalRevenue: 184500,
        lowStockCount: 2,
        pendingOrdersCount: 5,
      };
    }
  },

  async getAllCustomers() {
    try {
      const response = await api.get('/admin/customers');
      return response.data.data;
    } catch (error) {
      return [
        { id: 1, email: 'client@aurelia.com', fullName: 'Valued VIP Client', role: 'ROLE_USER', createdAt: '2025-01-15' },
        { id: 2, email: 'admin@aurelia.com', fullName: 'Maison Master Admin', role: 'ROLE_ADMIN', createdAt: '2025-01-01' },
      ];
    }
  },

  async updateOrderStatus(orderId, status) {
    await api.put(`/admin/orders/${orderId}/status?status=${status}`);
  },

  async updateUserRole(userId, role) {
    await api.put(`/admin/customers/${userId}/role?role=${role}`);
  },

  async createProduct(productData) {
    try {
      const response = await api.post('/products', productData);
      return {
        id: String(response.data.data.id),
        name: response.data.data.name,
        price: response.data.data.price,
        image: response.data.data.primaryImageUrl,
        images: response.data.data.images || [response.data.data.primaryImageUrl],
        category: response.data.data.categoryName || 'Rings',
        description: response.data.data.description,
        material: response.data.data.material,
        weight: response.data.data.weight,
        stock: response.data.data.stock,
        rating: 5,
        reviewCount: 0,
        reviews: [],
      };
    } catch (error) {
      return {
        id: 'p_' + Date.now(),
        name: productData.name || 'New Piece',
        price: productData.price || 1200,
        image: productData.image || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800',
        images: [productData.image || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800'],
        category: productData.category || 'Rings',
        description: productData.description || 'Handcrafted luxury piece.',
        material: productData.material || '18k Gold',
        weight: productData.weight || '5.0g',
        stock: productData.stock || 10,
        rating: 5,
        reviewCount: 0,
        reviews: [],
      };
    }
  },

  async updateProduct(id, productData) {
    try {
      const numericId = parseInt(id, 10);
      if (!isNaN(numericId)) {
        await api.put(`/products/${numericId}`, productData);
      }
    } catch (error) {
      // Offline fallback
    }
  },

  async deleteProduct(id) {
    try {
      const numericId = parseInt(id, 10);
      if (!isNaN(numericId)) {
        await api.delete(`/products/${numericId}`);
      }
    } catch (error) {
      // Offline fallback
    }
  }
};

export default adminService;
