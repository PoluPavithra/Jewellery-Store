import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useShop } from '../context/ShopContext.jsx';
import { Link } from 'react-router-dom';

export const WishlistDrawer = () => {
  const {
    products,
    wishlist,
    isWishlistOpen,
    setIsWishlistOpen,
    toggleWishlist,
    addToCart
  } = useShop();

  if (!isWishlistOpen) return null;

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="cart-drawer-overlay">
      <div className="cart-drawer">
        <div className="cart-drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Heart size={22} color="var(--color-gold)" fill="var(--color-gold)" />
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem' }}>
              Your Wishlist ({wishlistProducts.length})
            </h3>
          </div>
          <button className="close-btn" onClick={() => setIsWishlistOpen(false)} aria-label="Close wishlist">
            <X size={20} />
          </button>
        </div>

        <div className="cart-drawer-body">
          {wishlistProducts.length === 0 ? (
            <div className="empty-cart-view">
              <p style={{ fontSize: '1.1rem', color: 'var(--color-gray)', marginBottom: '20px' }}>
                Your wishlist is empty. Tap the heart icon on any piece to save it here!
              </p>
              <button
                className="btn btn-gold"
                onClick={() => setIsWishlistOpen(false)}
              >
                Discover Fine Jewellery
              </button>
            </div>
          ) : (
            <div className="cart-items-list">
              {wishlistProducts.map((product) => (
                <div key={product.id} className="cart-item-row">
                  <img src={product.image} alt={product.name} className="cart-item-img" />
                  <div className="cart-item-details">
                    <Link
                      to={`/product/${product.id}`}
                      onClick={() => setIsWishlistOpen(false)}
                      className="cart-item-title"
                    >
                      {product.name}
                    </Link>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-gray)', marginBottom: '4px' }}>
                      {product.material}
                    </div>
                    <div className="cart-item-price">${product.price.toLocaleString()}</div>
                    <button
                      onClick={() => {
                        addToCart(product, 1);
                        toggleWishlist(product.id);
                      }}
                      className="btn btn-gold"
                      style={{ padding: '6px 14px', fontSize: '0.75rem', marginTop: '8px' }}
                    >
                      <ShoppingBag size={12} style={{ display: 'inline', marginRight: '4px' }} />
                      Move to Bag
                    </button>
                  </div>
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="delete-item-btn"
                    title="Remove from wishlist"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
