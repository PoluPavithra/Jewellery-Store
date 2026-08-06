import api from './api.js';

export const orderService = {
  async createOrder(orderRequest) {
    try {
      const response = await api.post('/orders', orderRequest);
      return response.data.data;
    } catch (error) {
      if (!error.response) {
        const mockOrder = {
          id: Date.now(),
          orderNumber: 'AUR-' + Date.now() + '-' + Math.floor(1000 + Math.random() * 9000),
          items: [],
          totalAmount: 3450,
          status: 'PENDING',
          shippingAddress: orderRequest.shippingAddress,
          createdAt: new Date().toISOString(),
        };
        const existing = JSON.parse(localStorage.getItem('aurelia_mock_orders') || '[]');
        localStorage.setItem('aurelia_mock_orders', JSON.stringify([mockOrder, ...existing]));
        return mockOrder;
      }
      throw new Error(error.response?.data?.message || 'Failed to place order. Please try again.');
    }
  },

  async getUserOrders() {
    try {
      const response = await api.get('/orders');
      return response.data.data;
    } catch (error) {
      const saved = localStorage.getItem('aurelia_mock_orders');
      return saved ? JSON.parse(saved) : [];
    }
  },

  async getOrderById(id) {
    try {
      const response = await api.get(`/orders/${id}`);
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Order not found');
    }
  },

  async getOrderByOrderNumber(orderNumber) {
    try {
      const response = await api.get(`/orders/number/${orderNumber}`);
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Order not found');
    }
  }
};

export default orderService;
