import React, { useEffect, useState } from 'react';
import adminService from '../services/adminService.js';
import productService from '../services/productService.js';
import orderService from '../services/orderService.js';
import {
  LayoutDashboard,
  Package,
  ListFilter,
  Layers,
  ShoppingBag,
  Users,
  DollarSign,
  AlertTriangle,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  RefreshCw,
  Search,
  ShieldAlert,
  Loader2,
  ArrowUpRight
} from 'lucide-react';

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('stats');

  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [pName, setPName] = useState('');
  const [pPrice, setPPrice] = useState(1000);
  const [pCategory, setPCategory] = useState('Rings');
  const [pMaterial, setPMaterial] = useState('18k Yellow Gold');
  const [pStock, setPStock] = useState(10);
  const [pImage, setPImage] = useState('');
  const [pDesc, setPDesc] = useState('');

  const [categories, setCategories] = useState(['Rings', 'Necklaces', 'Earrings', 'Bracelets', 'Bangles']);
  const [newCatName, setNewCatName] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const [sData, pData, oData, cData] = await Promise.all([
        adminService.getStats(),
        productService.getAllProducts(),
        orderService.getUserOrders(),
        adminService.getAllCustomers()
      ]);
      setStats(sData);
      setProducts(pData);
      setOrders(oData);
      setCustomers(cData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      if (editingProductId) {
        await adminService.updateProduct(editingProductId, {
          name: pName,
          price: Number(pPrice),
          category: pCategory,
          material: pMaterial,
          stock: Number(pStock),
          image: pImage || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800',
          description: pDesc
        });
      } else {
        await adminService.createProduct({
          name: pName,
          price: Number(pPrice),
          category: pCategory,
          material: pMaterial,
          stock: Number(pStock),
          image: pImage || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800',
          description: pDesc
        });
      }
      setIsProductModalOpen(false);
      resetProductForm();
      await loadData();
    } catch (err) {
      alert('Error saving product');
    }
  };

  const resetProductForm = () => {
    setEditingProductId(null);
    setPName('');
    setPPrice(1000);
    setPCategory('Rings');
    setPMaterial('18k Yellow Gold');
    setPStock(10);
    setPImage('');
    setPDesc('');
  };

  const openEditModal = (p) => {
    setEditingProductId(p.id);
    setPName(p.name);
    setPPrice(p.price);
    setPCategory(p.category);
    setPMaterial(p.material);
    setPStock(p.stock);
    setPImage(p.image);
    setPDesc(p.description);
    setIsProductModalOpen(true);
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await adminService.deleteProduct(id);
      await loadData();
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    await adminService.updateOrderStatus(orderId, newStatus);
    await loadData();
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (newCatName.trim() && !categories.includes(newCatName.trim())) {
      setCategories([...categories, newCatName.trim()]);
      setNewCatName('');
    }
  };

  return (
    <div className="container" style={{ padding: '40px 20px', minHeight: '80vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-gold)', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' }}>
            Maison Management Portal
          </span>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.4rem', color: 'var(--color-emerald)', margin: '4px 0 0 0' }}>
            Aurelia Executive Dashboard
          </h1>
        </div>
        <button className="btn btn-outline" onClick={loadData} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <RefreshCw size={16} /> Refresh Metrics
        </button>
      </div>

      <div style={{
        display: 'flex',
        gap: '10px',
        borderBottom: '2px solid #E5E7EB',
        marginBottom: '30px',
        overflowX: 'auto',
        paddingBottom: '5px'
      }}>
        <button
          onClick={() => setActiveTab('stats')}
          className={`admin-tab-btn ${activeTab === 'stats' ? 'active' : ''}`}
        >
          <LayoutDashboard size={18} /> Overview
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`admin-tab-btn ${activeTab === 'products' ? 'active' : ''}`}
        >
          <Package size={18} /> Products ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('inventory')}
          className={`admin-tab-btn ${activeTab === 'inventory' ? 'active' : ''}`}
        >
          <ListFilter size={18} /> Inventory Control
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`admin-tab-btn ${activeTab === 'categories' ? 'active' : ''}`}
        >
          <Layers size={18} /> Categories
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`admin-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
        >
          <ShoppingBag size={18} /> Orders ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('customers')}
          className={`admin-tab-btn ${activeTab === 'customers' ? 'active' : ''}`}
        >
          <Users size={18} /> Customers ({customers.length})
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <Loader2 size={40} className="spinner" style={{ color: 'var(--color-gold)', margin: '0 auto 15px auto' }} />
          <p style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-emerald)' }}>Fetching Administrative Data...</p>
        </div>
      ) : (
        <>
          {activeTab === 'stats' && stats && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '35px' }}>
                <div className="admin-stat-card">
                  <div className="stat-icon-wrap" style={{ backgroundColor: 'rgba(212, 175, 55, 0.15)', color: 'var(--color-gold)' }}>
                    <DollarSign size={24} />
                  </div>
                  <div>
                    <span className="stat-label">Total Revenue</span>
                    <h3 className="stat-value">${stats.totalRevenue?.toLocaleString()}</h3>
                  </div>
                </div>

                <div className="admin-stat-card">
                  <div className="stat-icon-wrap" style={{ backgroundColor: 'rgba(1, 51, 32, 0.1)', color: 'var(--color-emerald)' }}>
                    <ShoppingBag size={24} />
                  </div>
                  <div>
                    <span className="stat-label">Total Orders</span>
                    <h3 className="stat-value">{stats.totalOrders}</h3>
                  </div>
                </div>

                <div className="admin-stat-card">
                  <div className="stat-icon-wrap" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#2563EB' }}>
                    <Package size={24} />
                  </div>
                  <div>
                    <span className="stat-label">Total Jewellery Items</span>
                    <h3 className="stat-value">{stats.totalProducts}</h3>
                  </div>
                </div>

                <div className="admin-stat-card">
                  <div className="stat-icon-wrap" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#DC2626' }}>
                    <AlertTriangle size={24} />
                  </div>
                  <div>
                    <span className="stat-label">Low Stock Alerts</span>
                    <h3 className="stat-value">{stats.lowStockCount}</h3>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }} className="admin-two-col">
                <div style={{ backgroundColor: '#FFF', padding: '25px', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
                  <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-emerald)', marginBottom: '15px' }}>
                    Recent High Value Orders
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {orders.slice(0, 4).map((o) => (
                      <div key={o.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F3F4F6', paddingBottom: '10px' }}>
                        <div>
                          <p style={{ fontWeight: 700, margin: 0 }}>{o.orderNumber}</p>
                          <span style={{ fontSize: '0.8rem', color: 'var(--color-gray)' }}>{o.items?.length || 1} Items</span>
                        </div>
                        <span style={{ fontWeight: 700, color: 'var(--color-gold)' }}>${o.totalAmount?.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ backgroundColor: '#FFF', padding: '25px', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
                  <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-emerald)', marginBottom: '15px' }}>
                    Inventory Status Summary
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--color-dark-gray)', lineHeight: '1.6' }}>
                    All items in the Aurelia catalogue are stored with automated real-time transaction stock sync. Ensure stock levels for top sellers are maintained above 5 units to guarantee high-touch VIP fulfillment.
                  </p>
                  <button onClick={() => setActiveTab('inventory')} className="btn btn-gold" style={{ marginTop: '15px', padding: '10px 18px', fontSize: '0.85rem' }}>
                    Manage Inventory Stock
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', color: 'var(--color-emerald)', margin: 0 }}>
                  Jewellery Products Catalogue
                </h3>
                <button
                  className="btn btn-gold"
                  onClick={() => {
                    resetProductForm();
                    setIsProductModalOpen(true);
                  }}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <Plus size={18} /> Add New Jewellery Piece
                </button>
              </div>

              <div style={{ overflowX: 'auto', backgroundColor: '#FFF', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'var(--color-cream)', borderBottom: '1px solid #E5E7EB' }}>
                      <th style={{ padding: '14px 18px' }}>Product</th>
                      <th style={{ padding: '14px 18px' }}>Category</th>
                      <th style={{ padding: '14px 18px' }}>Material</th>
                      <th style={{ padding: '14px 18px' }}>Price</th>
                      <th style={{ padding: '14px 18px' }}>Stock</th>
                      <th style={{ padding: '14px 18px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                        <td style={{ padding: '12px 18px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img src={p.image} alt={p.name} style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '6px' }} />
                          <span style={{ fontWeight: 600, color: 'var(--color-emerald)' }}>{p.name}</span>
                        </td>
                        <td style={{ padding: '12px 18px' }}>{p.category}</td>
                        <td style={{ padding: '12px 18px' }}>{p.material}</td>
                        <td style={{ padding: '12px 18px', fontWeight: 700, color: 'var(--color-gold)' }}>${p.price.toLocaleString()}</td>
                        <td style={{ padding: '12px 18px' }}>
                          <span style={{
                            padding: '4px 10px',
                            borderRadius: '12px',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            backgroundColor: p.stock < 5 ? '#FEE2E2' : '#D1FAE5',
                            color: p.stock < 5 ? '#991B1B' : '#065F46'
                          }}>
                            {p.stock} in stock
                          </span>
                        </td>
                        <td style={{ padding: '12px 18px', textAlign: 'right' }}>
                          <button onClick={() => openEditModal(p)} style={{ background: 'none', border: 'none', cursor: 'pointer', marginRight: '10px', color: '#2563EB' }}>
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => handleDeleteProduct(p.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#DC2626' }}>
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'inventory' && (
            <div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', color: 'var(--color-emerald)', marginBottom: '20px' }}>
                Inventory & Stock Management
              </h3>
              <div style={{ backgroundColor: '#FFF', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                  {products.map((p) => (
                    <div key={p.id} style={{ border: '1px solid #E5E7EB', borderRadius: '8px', padding: '15px', display: 'flex', gap: '15px', alignItems: 'center' }}>
                      <img src={p.image} alt={p.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '6px' }} />
                      <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: 600, margin: 0, fontSize: '0.95rem' }}>{p.name}</p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--color-gray)', margin: '2px 0 8px 0' }}>{p.category} • ${p.price}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Stock:</span>
                          <input
                            type="number"
                            defaultValue={p.stock}
                            onBlur={(e) => adminService.updateProduct(p.id, { stock: parseInt(e.target.value, 10) })}
                            style={{ width: '60px', padding: '4px 8px', border: '1px solid #D1D5DB', borderRadius: '4px', fontSize: '0.85rem' }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'categories' && (
            <div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', color: 'var(--color-emerald)', marginBottom: '20px' }}>
                Jewellery Collection Categories
              </h3>
              <div style={{ maxWidth: '500px', backgroundColor: '#FFF', padding: '25px', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
                <form onSubmit={handleAddCategory} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                  <input
                    type="text"
                    required
                    placeholder="New category name (e.g. Brooches)"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    className="form-control-input"
                    style={{ flex: 1 }}
                  />
                  <button type="submit" className="btn btn-gold" style={{ padding: '8px 16px' }}>Add</button>
                </form>

                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {categories.map((c, i) => (
                    <li key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', backgroundColor: 'var(--color-cream)', borderRadius: '8px', fontWeight: 600 }}>
                      <span>{c}</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--color-gold)' }}>Active Category</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', color: 'var(--color-emerald)', marginBottom: '20px' }}>
                Customer Orders Directory
              </h3>
              <div style={{ backgroundColor: '#FFF', borderRadius: '12px', border: '1px solid #E5E7EB', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'var(--color-cream)', borderBottom: '1px solid #E5E7EB' }}>
                      <th style={{ padding: '14px 18px' }}>Order #</th>
                      <th style={{ padding: '14px 18px' }}>Date</th>
                      <th style={{ padding: '14px 18px' }}>Amount</th>
                      <th style={{ padding: '14px 18px' }}>Status</th>
                      <th style={{ padding: '14px 18px' }}>Update Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o) => (
                      <tr key={o.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                        <td style={{ padding: '12px 18px', fontWeight: 700, color: 'var(--color-emerald)' }}>{o.orderNumber}</td>
                        <td style={{ padding: '12px 18px' }}>{new Date(o.createdAt || Date.now()).toLocaleDateString()}</td>
                        <td style={{ padding: '12px 18px', fontWeight: 700, color: 'var(--color-gold)' }}>${o.totalAmount?.toLocaleString()}</td>
                        <td style={{ padding: '12px 18px' }}>
                          <span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700, backgroundColor: '#E5E7EB' }}>
                            {o.status}
                          </span>
                        </td>
                        <td style={{ padding: '12px 18px' }}>
                          <select
                            defaultValue={o.status}
                            onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                            style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
                          >
                            <option value="PENDING">PENDING</option>
                            <option value="PROCESSING">PROCESSING</option>
                            <option value="SHIPPED">SHIPPED</option>
                            <option value="DELIVERED">DELIVERED</option>
                            <option value="CANCELLED">CANCELLED</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'customers' && (
            <div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', color: 'var(--color-emerald)', marginBottom: '20px' }}>
                Client Directory
              </h3>
              <div style={{ backgroundColor: '#FFF', borderRadius: '12px', border: '1px solid #E5E7EB', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'var(--color-cream)', borderBottom: '1px solid #E5E7EB' }}>
                      <th style={{ padding: '14px 18px' }}>Full Name</th>
                      <th style={{ padding: '14px 18px' }}>Email</th>
                      <th style={{ padding: '14px 18px' }}>Role</th>
                      <th style={{ padding: '14px 18px' }}>Registered</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((c) => (
                      <tr key={c.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                        <td style={{ padding: '12px 18px', fontWeight: 600 }}>{c.fullName}</td>
                        <td style={{ padding: '12px 18px' }}>{c.email}</td>
                        <td style={{ padding: '12px 18px' }}>
                          <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700, backgroundColor: c.role === 'ROLE_ADMIN' ? 'var(--color-emerald)' : '#E5E7EB', color: c.role === 'ROLE_ADMIN' ? '#FFF' : '#374151' }}>
                            {c.role}
                          </span>
                        </td>
                        <td style={{ padding: '12px 18px' }}>{c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'Active Member'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {isProductModalOpen && (
        <div className="auth-modal-overlay" onClick={() => setIsProductModalOpen(false)}>
          <div className="auth-modal-card" style={{ maxWidth: '550px' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', color: 'var(--color-emerald)', marginBottom: '20px' }}>
              {editingProductId ? 'Edit Jewellery Piece' : 'Add New Jewellery Piece'}
            </h3>

            <form onSubmit={handleSaveProduct} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Name</label>
                <input type="text" required value={pName} onChange={(e) => setPName(e.target.value)} className="form-control-input" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Price ($)</label>
                  <input type="number" required value={pPrice} onChange={(e) => setPPrice(Number(e.target.value))} className="form-control-input" />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Stock Quantity</label>
                  <input type="number" required value={pStock} onChange={(e) => setPStock(Number(e.target.value))} className="form-control-input" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Category</label>
                  <select value={pCategory} onChange={(e) => setPCategory(e.target.value)} className="form-control-input">
                    <option value="Rings">Rings</option>
                    <option value="Necklaces">Necklaces</option>
                    <option value="Earrings">Earrings</option>
                    <option value="Bracelets">Bracelets</option>
                    <option value="Bangles">Bangles</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Material</label>
                  <input type="text" required value={pMaterial} onChange={(e) => setPMaterial(e.target.value)} className="form-control-input" placeholder="18k Gold" />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Image URL</label>
                <input type="url" value={pImage} onChange={(e) => setPImage(e.target.value)} className="form-control-input" placeholder="https://images.unsplash.com/..." />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Description</label>
                <textarea value={pDesc} onChange={(e) => setPDesc(e.target.value)} className="form-control-input" rows={3}></textarea>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="button" className="btn btn-outline" onClick={() => setIsProductModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-gold">Save Jewellery Piece</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
