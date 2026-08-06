import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ProductList } from '../components/ProductList.jsx';
import { collectionsData } from '../data/mockData.js';
import { useShop } from '../context/ShopContext.jsx';
import { Sparkles, ShieldCheck, Award, Gem } from 'lucide-react';

export const Home = () => {
  const { products, setSelectedCategory } = useShop();
  const navigate = useNavigate();

  const featuredProducts = products.filter((p) => p.isFeatured);
  const newArrivals = products.filter((p) => p.isNewArrival);

  const handleCategoryClick = (categoryKey) => {
    setSelectedCategory(categoryKey);
    navigate('/products');
  };

  return (
    <div>
      <section className="hero" id="home">
        <div className="hero-content">
          <h1>Elegance is an Attitude</h1>
          <p>Discover our exclusive collections of handcrafted gold, diamond, and gemstone jewellery.</p>
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/products" className="btn btn-gold">
              Explore Catalogue
            </Link>
            <Link to="/collections" className="btn" style={{ borderColor: 'var(--color-ivory)', color: 'var(--color-ivory)' }}>
              Curated Collections
            </Link>
          </div>
        </div>
      </section>

      <section className="featured-collections container">
        <h2>Explore By Category</h2>
        <p style={{ textAlign: 'center', color: 'var(--color-gray)', marginTop: '-20px', marginBottom: '40px' }}>
          Select a category to view bespoke handcrafted creations
        </p>
        <div className="collection-grid">
          {collectionsData.map((col) => (
            <article
              key={col.id}
              className="collection-item"
              onClick={() => handleCategoryClick(col.categoryKey)}
              style={col.spanTwo ? { gridColumn: 'span 2' } : {}}
            >
              <img src={col.image} alt={col.title} />
              <div className="collection-overlay">
                <h3>{col.title}</h3>
                <span className="btn-text">Shop Collection &rarr;</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <ProductList
        products={featuredProducts.length > 0 ? featuredProducts : products.slice(0, 4)}
        title="Featured Masterpieces"
      />

      <section style={{ backgroundColor: 'var(--color-ivory)' }}>
        <ProductList
          products={newArrivals.length > 0 ? newArrivals : products.slice(2, 6)}
          title="New Arrivals"
        />
      </section>

      <section className="features">
        <div className="container features-grid">
          <div className="feature-item">
            <Gem size={32} color="var(--color-gold)" style={{ margin: '0 auto 12px auto' }} />
            <h4>Ethical Sourcing</h4>
            <p>We ensure all gemstones and precious metals are sourced 100% responsibly and ethically.</p>
          </div>
          <div className="feature-item">
            <ShieldCheck size={32} color="var(--color-gold)" style={{ margin: '0 auto 12px auto' }} />
            <h4>Lifetime Warranty</h4>
            <p>Every creation comes backed with a lifetime craftsmanship warranty and complimentary cleaning.</p>
          </div>
          <div className="feature-item">
            <Award size={32} color="var(--color-gold)" style={{ margin: '0 auto 12px auto' }} />
            <h4>Custom Artisanship</h4>
            <p>Collaborate with our master atelier designers to engineer your bespoke dream piece.</p>
          </div>
        </div>
      </section>

      <section className="newsletter container">
        <div className="newsletter-content">
          <Sparkles size={36} color="var(--color-gold)" style={{ margin: '0 auto 15px auto' }} />
          <h2>Join Aurelia World</h2>
          <p>Subscribe to receive personal invitations, access to secret drops, and 10% off your first purchase.</p>
          <form onSubmit={(e) => e.preventDefault()} className="newsletter-form">
            <input type="email" placeholder="Enter Your Email Address" required />
            <button type="submit" className="btn btn-gold">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};
