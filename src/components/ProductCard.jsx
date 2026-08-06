import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, ShoppingBag } from 'lucide-react';
import { useShop } from '../context/ShopContext.jsx';

export const ProductCard = ({ product }) => {
  const { isInWishlist, toggleWishlist, addToCart } = useShop();
  const isSaved = isInWishlist(product.id);

  return (
    <article className="product-card">
      <div className="product-image">
        <img src={product.image} alt={product.name} />
        {product.isNew && <span className="badge">New</span>}
        
        <button
          className={`wishlist-toggle-btn ${isSaved ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product.id);
          }}
          title={isSaved ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart
            size={18}
            fill={isSaved ? 'var(--color-gold)' : 'none'}
            color={isSaved ? 'var(--color-gold)' : 'var(--color-emerald-dark)'}
          />
        </button>
      </div>

      <div className="product-info">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginBottom: '6px' }}>
          <Star size={14} fill="var(--color-gold)" color="var(--color-gold)" />
          <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--color-dark-gray)' }}>
            {product.rating}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-gray)' }}>
            ({product.reviewCount})
          </span>
        </div>

        <h3>{product.name}</h3>
        <p className="price">${product.price.toLocaleString()}</p>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '12px' }}>
          <Link to={`/product/${product.id}`} className="btn" style={{ padding: '10px 20px', fontSize: '0.75rem' }}>
            Details
          </Link>
          <button
            onClick={() => addToCart(product, 1)}
            className="btn btn-gold"
            style={{ padding: '10px 16px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
            title="Quick Add to Cart"
          >
            <ShoppingBag size={14} />
            Add
          </button>
        </div>
      </div>
    </article>
  );
};
