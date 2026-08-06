import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { Link, useNavigate } from 'react-router-dom';

export const CartDrawer = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateCartQuantity,
    removeFromCart,
    cartTotal,
  } = useShop();

  const { isAuthenticated, openAuthModal } = useAuth();
  const navigate = useNavigate();

  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

  if (!isCartOpen) return null;

  const freeShippingThreshold = 2000;
  const progressPercent = Math.min(100, (cartTotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartTotal);

  const applyPromo = (e) => {
    e.preventDefault();
    setPromoError('');
    setPromoSuccess('');
    if (promoCode.trim().toUpperCase() === 'AURELIA10') {
      setDiscount(0.1);
      setPromoSuccess('10% VIP Discount Applied!');
    } else if (promoCode.trim().toUpperCase() === 'LUXURY20') {
      setDiscount(0.2);
      setPromoSuccess('20% Emerald Discount Applied!');
    } else {
      setPromoError('Invalid promo code. Try AURELIA10 or LUXURY20.');
    }
  };

  const finalTotal = cartTotal * (1 - discount);

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    if (!isAuthenticated) {
      openAuthModal('login');
    } else {
      navigate('/checkout');
    }
  };

  return (
    <div className="cart-drawer-overlay">
      <div className="cart-drawer">
        <div className="cart-drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShoppingBag size={22} color="var(--color-gold)" />
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem' }}>
              Your Shopping Bag ({cart.reduce((s, i) => s + i.quantity, 0)})
            </h3>
          </div>
          <button className="close-btn" onClick={() => setIsCartOpen(false)} aria-label="Close cart">
            <X size={20} />
          </button>
        </div>

        <div className="shipping-meter-container">
          <p style={{ fontSize: '0.85rem', marginBottom: '6px', color: 'var(--color-dark-gray)' }}>
            {remainingForFreeShipping === 0 ? (
              <span style={{ color: 'var(--color-emerald)', fontWeight: 'bold' }}>
                ✧ You qualify for Complimentary Express Shipping!
              </span>
            ) : (
              <>Add <strong>${remainingForFreeShipping.toLocaleString()}</strong> more for Free Luxury Delivery</>
            )}
          </p>
          <div className="meter-bg">
            <div className="meter-fill" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        <div className="cart-drawer-body">
          {cart.length === 0 ? (
            <div className="empty-cart-view">
              <p style={{ fontSize: '1.1rem', color: 'var(--color-gray)', marginBottom: '20px' }}>
                Your shopping bag is currently empty.
              </p>
              <button
                className="btn btn-gold"
                onClick={() => setIsCartOpen(false)}
              >
                Explore Collections
              </button>
            </div>
          ) : (
            <div className="cart-items-list">
              {cart.map(({ product, quantity, cartItemId }) => (
                <div key={product.id} className="cart-item-row">
                  <img src={product.image} alt={product.name} className="cart-item-img" />
                  <div className="cart-item-details">
                    <Link
                      to={`/product/${product.id}`}
                      onClick={() => setIsCartOpen(false)}
                      className="cart-item-title"
                    >
                      {product.name}
                    </Link>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-gray)', marginBottom: '4px' }}>
                      {product.material}
                    </div>
                    <div className="cart-item-price">${product.price.toLocaleString()}</div>
                    <div className="quantity-controls">
                      <button
                        onClick={() => updateCartQuantity(product.id, quantity - 1, cartItemId)}
                        className="qty-btn"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="qty-val">{quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(product.id, quantity + 1, cartItemId)}
                        className="qty-btn"
                        aria-label="Increase quantity"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(product.id, cartItemId)}
                    className="delete-item-btn"
                    title="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-drawer-footer">
            <form onSubmit={applyPromo} className="promo-code-form">
              <input
                type="text"
                placeholder="Promo Code (e.g. AURELIA10)"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="promo-input"
              />
              <button type="submit" className="btn-promo-apply">Apply</button>
            </form>
            {promoError && <p className="promo-error">{promoError}</p>}
            {promoSuccess && <p className="promo-success">{promoSuccess}</p>}

            <div className="cart-summary-rows">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${cartTotal.toLocaleString()}</span>
              </div>
              {discount > 0 && (
                <div className="summary-row discount">
                  <span>VIP Discount ({discount * 100}%)</span>
                  <span>-${(cartTotal * discount).toLocaleString()}</span>
                </div>
              )}
              <div className="summary-row total">
                <span>Estimated Total</span>
                <span>${finalTotal.toLocaleString()}</span>
              </div>
            </div>

            <button
              className="btn btn-gold checkout-btn"
              onClick={handleCheckoutClick}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
