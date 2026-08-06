import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useShop } from '../context/ShopContext.jsx';
import { ProductCard } from '../components/ProductCard.jsx';
import { Star, Heart, ShoppingBag, ShieldCheck, Truck, RefreshCw, MessageSquarePlus } from 'lucide-react';

export const ProductDetails = () => {
  const { id } = useParams();
  const { products, addToCart, toggleWishlist, isInWishlist, addReview } = useShop();

  const product = products.find((p) => p.id === id) || products[0];
  const relatedProducts = products.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 4);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewerName, setReviewerName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmittedMsg, setReviewSubmittedMsg] = useState(false);

  const galleryImages = product.images && product.images.length > 0 ? product.images : [product.image];
  const isSaved = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewComment.trim()) return;

    addReview(product.id, {
      user: reviewerName.trim(),
      rating: reviewRating,
      comment: reviewComment.trim()
    });

    setReviewSubmittedMsg(true);
    setReviewerName('');
    setReviewComment('');
    setTimeout(() => {
      setReviewSubmittedMsg(false);
      setShowReviewForm(false);
    }, 2000);
  };

  return (
    <div>
      <section className="container product-detail-container">
        <div className="product-gallery-section">
          <div className="main-gallery-preview">
            <img src={galleryImages[selectedImageIndex]} alt={product.name} />
          </div>
          {galleryImages.length > 1 && (
            <div className="gallery-thumbnails">
              {galleryImages.map((imgUrl, index) => (
                <button
                  key={index}
                  className={`thumbnail-btn ${selectedImageIndex === index ? 'active' : ''}`}
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <img src={imgUrl} alt={`${product.name} view ${index + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="product-details">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span className="category-tag">{product.category}</span>
            <span className={`stock-badge ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
              {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
            </span>
          </div>

          <h1>{product.name}</h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
            <div style={{ display: 'flex', gap: '2px' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={16}
                  fill={star <= Math.round(product.rating) ? 'var(--color-gold)' : 'none'}
                  color="var(--color-gold)"
                />
              ))}
            </div>
            <span style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>{product.rating}</span>
            <span style={{ color: 'var(--color-gray)', fontSize: '0.85rem' }}>
              ({product.reviewCount} customer reviews)
            </span>
          </div>

          <span className="product-price">${product.price.toLocaleString()}.00</span>

          <p className="product-description">{product.description}</p>

          <div className="product-meta">
            <span><strong>Material:</strong> {product.material}</span>
            {product.gemstone && <span><strong>Gemstone:</strong> {product.gemstone}</span>}
            <span><strong>Metal Weight:</strong> {product.weight}</span>
          </div>

          <div className="add-to-cart-form">
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              min="1"
              max={product.stock}
              className="quantity-input"
            />
            <button
              className="btn btn-gold"
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
            >
              <ShoppingBag size={16} style={{ display: 'inline', marginRight: '6px' }} />
              {added ? '✓ Added to Shopping Bag' : 'Add to Shopping Bag'}
            </button>
            <button
              className={`btn ${isSaved ? 'btn-gold' : ''}`}
              onClick={() => toggleWishlist(product.id)}
              style={{ borderRadius: '50px', padding: '12px 18px' }}
              title={isSaved ? 'In Wishlist' : 'Add to Wishlist'}
            >
              <Heart size={18} fill={isSaved ? 'var(--color-gold)' : 'none'} />
            </button>
          </div>

          <div className="product-extras">
            <p><Truck size={16} color="var(--color-emerald)" /> Free Express Insured Shipping</p>
            <p><ShieldCheck size={16} color="var(--color-emerald)" /> Lifetime Authenticity Guarantee</p>
            <p><RefreshCw size={16} color="var(--color-emerald)" /> 30-Day Hassle-Free Returns</p>
          </div>
        </div>
      </section>

      <section className="container reviews-section" style={{ paddingTop: '40px', paddingBottom: '60px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
          <h2>Customer Reviews ({product.reviews.length})</h2>
          <button
            className="btn btn-gold"
            style={{ fontSize: '0.8rem', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '6px' }}
            onClick={() => setShowReviewForm(!showReviewForm)}
          >
            <MessageSquarePlus size={16} /> Write a Review
          </button>
        </div>

        {showReviewForm && (
          <form onSubmit={handleReviewSubmit} className="review-form-card">
            <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-emerald)', marginBottom: '15px' }}>
              Write Your Review for {product.name}
            </h3>

            {reviewSubmittedMsg ? (
              <p style={{ color: 'var(--color-emerald)', fontWeight: 'bold' }}>
                ✧ Thank you! Your review has been successfully submitted.
              </p>
            ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Lady Genevieve"
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      className="form-control-input"
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                      Star Rating
                    </label>
                    <select
                      value={reviewRating}
                      onChange={(e) => setReviewRating(Number(e.target.value))}
                      className="form-control-input"
                    >
                      <option value={5}>5 Stars - Exceptional</option>
                      <option value={4}>4 Stars - Very Good</option>
                      <option value={3}>3 Stars - Average</option>
                      <option value={2}>2 Stars - Below Expectations</option>
                      <option value={1}>1 Star - Poor</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                    Review Comment
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe your impression of the piece, shine, weight, and delivery..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="form-control-input"
                  />
                </div>

                <button type="submit" className="btn btn-gold">
                  Submit Review
                </button>
              </>
            )}
          </form>
        )}

        <div className="reviews-list">
          {product.reviews.length === 0 ? (
            <p style={{ color: 'var(--color-gray)' }}>No reviews yet. Be the first to review this piece!</p>
          ) : (
            product.reviews.map((rev) => (
              <div key={rev.id} className="review-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <strong style={{ fontSize: '1rem', color: 'var(--color-emerald-dark)' }}>{rev.user}</strong>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-gray)' }}>{rev.date}</span>
                </div>
                <div style={{ display: 'flex', gap: '2px', marginBottom: '8px' }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={14}
                      fill={s <= rev.rating ? 'var(--color-gold)' : 'none'}
                      color="var(--color-gold)"
                    />
                  ))}
                </div>
                <p style={{ color: 'var(--color-dark-gray)', fontSize: '0.95rem' }}>{rev.comment}</p>
              </div>
            ))
          )}
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className="container" style={{ paddingBottom: '80px' }}>
          <h2 style={{ textAlign: 'left', fontSize: '2rem' }}>You May Also Like</h2>
          <div className="product-grid">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
