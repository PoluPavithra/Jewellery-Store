import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext.jsx';
import orderService from '../services/orderService.js';
import { CheckCircle2, ShieldCheck, Truck, Lock, ArrowLeft, Loader2, PackageCheck } from 'lucide-react';

export const CheckoutPage = () => {
  const { cart, cartTotal, clearCart } = useShop();
  const navigate = useNavigate();

  const [street, setStreet] = useState('740 Park Avenue, Suite 12B');
  const [city, setCity] = useState('New York');
  const [state, setState] = useState('NY');
  const [postalCode, setPostalCode] = useState('10021');
  const [country, setCountry] = useState('United States');

  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoMsg, setPromoMsg] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [completedOrder, setCompletedOrder] = useState(null);

  const applyPromo = (e) => {
    e.preventDefault();
    const code = promoCode.trim().toUpperCase();
    if (code === 'AURELIA10') {
      setDiscountPercent(10);
      setPromoMsg('10% VIP Privilege Discount Applied!');
    } else if (code === 'LUXURY20') {
      setDiscountPercent(20);
      setPromoMsg('20% Grand Emerald Discount Applied!');
    } else {
      setPromoMsg('Invalid promo code');
    }
  };

  const discountAmount = (cartTotal * discountPercent) / 100;
  const shippingCost = cartTotal >= 2000 ? 0 : 50;
  const estimatedTax = (cartTotal - discountAmount) * 0.08;
  const finalTotal = cartTotal - discountAmount + shippingCost + estimatedTax;

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    try {
      setIsSubmitting(true);
      setErrorMessage('');

      const created = await orderService.createOrder({
        shippingAddress: {
          street,
          city,
          state,
          postalCode,
          country
        }
      });

      setCompletedOrder(created);
      await clearCart();
    } catch (err) {
      setErrorMessage(err.message || 'Failed to process order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (completedOrder) {
    return (
      <div className="container" style={{ padding: '80px 20px', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{
          backgroundColor: '#FFF',
          border: '1px solid var(--color-light-gold)',
          borderRadius: '12px',
          padding: '40px 30px',
          textAlign: 'center',
          boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
        }}>
          <CheckCircle2 size={64} color="var(--color-emerald)" style={{ margin: '0 auto 20px auto' }} />
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.4rem', color: 'var(--color-emerald)', marginBottom: '10px' }}>
            Thank You for Your Order
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--color-dark-gray)', marginBottom: '25px' }}>
            Your order has been placed successfully and is now being crafted for dispatch.
          </p>

          <div style={{
            backgroundColor: 'var(--color-cream)',
            padding: '20px',
            borderRadius: '8px',
            textAlign: 'left',
            marginBottom: '30px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <strong>Order Reference Number:</strong>
              <span style={{ color: 'var(--color-gold)', fontWeight: 700 }}>{completedOrder.orderNumber}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <strong>Total Amount Paid:</strong>
              <span>${completedOrder.totalAmount?.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <strong>Shipping Address:</strong>
              <span>{completedOrder.shippingAddress.street}, {completedOrder.shippingAddress.city}, {completedOrder.shippingAddress.state}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong>Estimated Delivery:</strong>
              <span>3-5 Business Days (Insured Courier)</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/orders" className="btn btn-gold">
              <PackageCheck size={18} />
              <span>View Order History</span>
            </Link>
            <Link to="/products" className="btn btn-outline">
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="container" style={{ padding: '90px 20px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: 'var(--color-emerald)', marginBottom: '15px' }}>
          Your Shopping Bag is Empty
        </h2>
        <p style={{ color: 'var(--color-gray)', marginBottom: '25px' }}>
          Please add fine jewellery items to your bag before proceeding to checkout.
        </p>
        <Link to="/products" className="btn btn-gold">
          Explore Jewellery Catalogue
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '50px 20px' }}>
      <div style={{ marginBottom: '30px' }}>
        <Link to="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--color-gold)', textDecoration: 'none', fontWeight: 600 }}>
          <ArrowLeft size={18} /> Back to Products
        </Link>
      </div>

      <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', color: 'var(--color-emerald)', marginBottom: '30px' }}>
        Aurelia Express Checkout
      </h1>

      {errorMessage && (
        <div style={{
          backgroundColor: '#FDE8E8',
          color: '#9B1C1C',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '25px',
          fontSize: '0.95rem'
        }}>
          {errorMessage}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '40px' }} className="checkout-grid-layout">
        <form onSubmit={handleSubmitOrder} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          <div style={{ backgroundColor: '#FFF', padding: '30px', borderRadius: '10px', border: '1px solid #E5E7EB' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--color-emerald)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Truck size={20} color="var(--color-gold)" /> Shipping Address
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '5px' }}>Street Address</label>
                <input
                  type="text"
                  required
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="form-control-input"
                  placeholder="740 Park Avenue"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '5px' }}>City</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="form-control-input"
                    placeholder="New York"
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '5px' }}>State / Region</label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="form-control-input"
                    placeholder="NY"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '5px' }}>Postal Code</label>
                  <input
                    type="text"
                    required
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="form-control-input"
                    placeholder="10021"
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '5px' }}>Country</label>
                  <input
                    type="text"
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="form-control-input"
                    placeholder="United States"
                  />
                </div>
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: '#FFF', padding: '25px', borderRadius: '10px', border: '1px solid #E5E7EB' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', color: 'var(--color-emerald)', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShieldCheck size={20} color="var(--color-gold)" /> Complimentary White Glove Services
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', color: 'var(--color-dark-gray)' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} color="var(--color-emerald)" /> Fully Insured Express Air Delivery
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} color="var(--color-emerald)" /> Signature Aurelia Velvet Jewelry Presentation Box
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} color="var(--color-emerald)" /> Certificate of Gemological Authenticity
              </li>
            </ul>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-gold"
            style={{ width: '100%', padding: '16px', fontSize: '1.1rem' }}
          >
            {isSubmitting ? (
              <span className="btn-loading-flex">
                <Loader2 size={20} className="spinner" /> Processing Order...
              </span>
            ) : (
              <span className="btn-loading-flex">
                <Lock size={18} /> Confirm Order (${finalTotal.toLocaleString()})
              </span>
            )}
          </button>
        </form>

        <div style={{ backgroundColor: '#FFF', padding: '30px', borderRadius: '10px', border: '1px solid #E5E7EB', height: 'fit-content' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--color-emerald)', marginBottom: '20px' }}>
            Order Summary ({cart.reduce((s, i) => s + i.quantity, 0)} items)
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '25px', maxHeight: '300px', overflowY: 'auto', paddingRight: '5px' }}>
            {cart.map(({ product, quantity }) => (
              <div key={product.id} style={{ display: 'flex', gap: '15px', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid #F3F4F6' }}>
                <img src={product.image} alt={product.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '6px' }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, fontSize: '0.95rem', margin: 0 }}>{product.name}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-gray)', margin: '2px 0 0 0' }}>Qty: {quantity} • {product.material}</p>
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                  ${(product.price * quantity).toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={applyPromo} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <input
              type="text"
              placeholder="Promo code (AURELIA10)"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="form-control-input"
              style={{ flex: 1 }}
            />
            <button type="submit" className="btn btn-outline" style={{ padding: '8px 16px' }}>Apply</button>
          </form>
          {promoMsg && <p style={{ fontSize: '0.85rem', color: discountPercent > 0 ? 'var(--color-emerald)' : '#DC2626', marginBottom: '15px' }}>{promoMsg}</p>}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.95rem', borderTop: '1px solid #E5E7EB', paddingTop: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Subtotal</span>
              <span>${cartTotal.toLocaleString()}</span>
            </div>
            {discountPercent > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-emerald)' }}>
                <span>Discount ({discountPercent}%)</span>
                <span>-${discountAmount.toLocaleString()}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Insured Shipping</span>
              <span>{shippingCost === 0 ? 'COMPLIMENTARY' : `$${shippingCost}`}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Estimated Tax (8%)</span>
              <span>${estimatedTax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-emerald)', borderTop: '2px solid var(--color-gold)', paddingTop: '12px', marginTop: '5px' }}>
              <span>Total</span>
              <span>${finalTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
