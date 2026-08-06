import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import orderService from '../services/orderService.js';
import { Package, Calendar, Clock, MapPin, ArrowRight, Loader2, RefreshCw } from 'lucide-react';

export const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const userOrders = await orderService.getUserOrders();
      setOrders(userOrders);
    } catch (err) {
      setError(err.message || 'Failed to fetch order history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'DELIVERED':
        return { backgroundColor: '#D1FAE5', color: '#065F46' };
      case 'SHIPPED':
        return { backgroundColor: '#DBEAFE', color: '#1E40AF' };
      case 'PROCESSING':
        return { backgroundColor: '#FEF3C7', color: '#92400E' };
      case 'CANCELLED':
        return { backgroundColor: '#FEE2E2', color: '#991B1B' };
      default:
        return { backgroundColor: '#ECE9D8', color: '#554A2B' };
    }
  };

  return (
    <div className="container" style={{ padding: '60px 20px', minHeight: '70vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '35px', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.4rem', color: 'var(--color-emerald)', margin: 0 }}>
            Order History & Acquisitions
          </h1>
          <p style={{ color: 'var(--color-gray)', marginTop: '5px' }}>
            Track and review your handcrafted fine jewellery orders.
          </p>
        </div>
        <button
          onClick={fetchOrders}
          className="btn btn-outline"
          style={{ padding: '10px 18px', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <Loader2 size={40} className="spinner" style={{ color: 'var(--color-gold)', margin: '0 auto 15px auto' }} />
          <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', color: 'var(--color-emerald)' }}>
            Retrieving Your Orders...
          </p>
        </div>
      ) : error ? (
        <div style={{ backgroundColor: '#FDE8E8', color: '#9B1C1C', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
          <p>{error}</p>
          <button className="btn btn-gold" onClick={fetchOrders} style={{ marginTop: '10px' }}>
            Try Again
          </button>
        </div>
      ) : orders.length === 0 ? (
        <div style={{
          backgroundColor: '#FFF',
          border: '1px solid #E5E7EB',
          borderRadius: '12px',
          padding: '60px 20px',
          textAlign: 'center',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          <Package size={56} color="var(--color-gold)" style={{ margin: '0 auto 15px auto' }} />
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', color: 'var(--color-emerald)', marginBottom: '10px' }}>
            No Past Orders Found
          </h3>
          <p style={{ color: 'var(--color-gray)', marginBottom: '25px' }}>
            You haven't placed any jewellery orders yet. Explore our bespoke collections to place your first order.
          </p>
          <Link to="/products" className="btn btn-gold">
            <span>Explore Collections</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          {orders.map((order) => (
            <div key={order.id} style={{
              backgroundColor: '#FFF',
              border: '1px solid #E5E7EB',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 4px 15px rgba(0,0,0,0.03)'
            }}>
              <div style={{
                backgroundColor: 'var(--color-cream)',
                padding: '18px 25px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '15px',
                borderBottom: '1px solid #E5E7EB'
              }}>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-gray)', display: 'block' }}>ORDER NUMBER</span>
                    <span style={{ fontWeight: 700, color: 'var(--color-emerald)', fontSize: '1.05rem' }}>{order.orderNumber}</span>
                  </div>
                  {order.createdAt && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--color-dark-gray)' }}>
                      <Calendar size={15} color="var(--color-gold)" />
                      {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <Link
                    to={`/invoice/${order.id}`}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      border: '1px solid var(--color-gold)',
                      color: 'var(--color-emerald)',
                      textDecoration: 'none',
                      fontSize: '0.8rem',
                      fontWeight: 600
                    }}
                  >
                    View Invoice
                  </Link>
                  <span style={{
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    letterSpacing: '0.5px',
                    ...getStatusBadgeStyle(order.status)
                  }}>
                    {order.status}
                  </span>
                  <span style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--color-gold)' }}>
                    ${order.totalAmount?.toLocaleString()}
                  </span>
                </div>
              </div>

              <div style={{ padding: '25px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px' }}>
                  {order.items && order.items.map((item) => (
                    <div key={item.id} style={{ display: 'flex', gap: '20px', alignItems: 'center', borderBottom: '1px solid #F3F4F6', paddingBottom: '15px' }}>
                      {item.product?.primaryImageUrl && (
                        <img
                          src={item.product.primaryImageUrl}
                          alt={item.product.name}
                          style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '8px' }}
                        />
                      )}
                      <div style={{ flex: 1 }}>
                        <Link to={`/product/${item.product?.id}`} style={{ fontWeight: 600, fontSize: '1.05rem', color: 'var(--color-emerald)', textDecoration: 'none' }}>
                          {item.product?.name || 'Aurelia Fine Piece'}
                        </Link>
                        <p style={{ fontSize: '0.85rem', color: 'var(--color-gray)', margin: '4px 0 0 0' }}>
                          Quantity: {item.quantity} {item.selectedSize ? `• Size: ${item.selectedSize}` : ''}
                        </p>
                      </div>
                      <div style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--color-black)' }}>
                        ${(item.priceAtPurchase * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>

                {order.shippingAddress && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--color-gray)', backgroundColor: '#F9FAFB', padding: '12px 16px', borderRadius: '8px' }}>
                    <MapPin size={16} color="var(--color-gold)" />
                    <span><strong>Delivery Destination:</strong> {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
