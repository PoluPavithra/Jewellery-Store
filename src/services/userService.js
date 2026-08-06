import api from './api.js';

export const userService = {
  async getProfile() {
    try {
      const response = await api.get('/users/profile');
      return response.data.data;
    } catch (error) {
      const saved = localStorage.getItem('aurelia_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          id: parsed.id || 1,
          email: parsed.email || 'client@aurelia.com',
          fullName: parsed.fullName || 'Valued VIP Client',
          phone: parsed.phone || '+1 (212) 555-0142',
          role: parsed.role || 'ROLE_USER',
          createdAt: new Date().toISOString()
        };
      }
      throw new Error('Not authenticated');
    }
  },

  async updateProfile(fullName, phone) {
    try {
      const response = await api.put('/users/profile', {
        fullName,
        phone
      });
      return response.data.data;
    } catch (error) {
      const saved = localStorage.getItem('aurelia_user');
      const updated = saved ? JSON.parse(saved) : {};
      updated.fullName = fullName;
      if (phone) updated.phone = phone;
      localStorage.setItem('aurelia_user', JSON.stringify(updated));
      return updated;
    }
  },

  async getSavedAddresses() {
    const saved = localStorage.getItem('aurelia_user_addresses');
    if (saved) {
      return JSON.parse(saved);
    }
    return [
      {
        id: 'addr_1',
        street: '740 Park Avenue, Suite 12B',
        city: 'New York',
        state: 'NY',
        postalCode: '10021',
        country: 'United States',
        isDefault: true
      }
    ];
  },

  async saveAddress(address) {
    const existing = await this.getSavedAddresses();
    const newAddress = { ...address, id: 'addr_' + Date.now() };
    const updated = [newAddress, ...existing];
    localStorage.setItem('aurelia_user_addresses', JSON.stringify(updated));
    return updated;
  },

  async deleteAddress(id) {
    const existing = await this.getSavedAddresses();
    const updated = existing.filter((a) => a.id !== id);
    localStorage.setItem('aurelia_user_addresses', JSON.stringify(updated));
    return updated;
  }
};

export default userService;
