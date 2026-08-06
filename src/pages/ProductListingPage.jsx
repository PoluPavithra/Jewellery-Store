import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useShop } from '../context/ShopContext.jsx';
import { CATEGORIES } from '../types.js';
import { ProductCard } from '../components/ProductCard.jsx';
import { Search, SlidersHorizontal, RotateCcw } from 'lucide-react';

export const ProductListingPage = () => {
  const { products, selectedCategory, setSelectedCategory, searchQuery, setSearchQuery } = useShop();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const query = searchParams.get('search');
    if (query) {
      setSearchQuery(query);
    }
  }, [searchParams, setSearchQuery]);

  const categories = CATEGORIES || ['All', 'Rings', 'Necklaces', 'Earrings', 'Bracelets', 'Bangles'];

  const [maxPrice, setMaxPrice] = useState(3000);
  const [sortBy, setSortBy] = useState('featured');

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchCategory =
        selectedCategory === 'All' || product.category === selectedCategory;

      const matchPrice = product.price <= maxPrice;

      const matchSearch =
        !searchQuery.trim() ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.material.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase());

      return matchCategory && matchPrice && matchSearch;
    }).sort((a, b) => {
      if (sortBy === 'price-low-high') return a.price - b.price;
      if (sortBy === 'price-high-low') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [products, selectedCategory, maxPrice, searchQuery, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('All');
    setMaxPrice(3000);
    setSearchQuery('');
    setSortBy('featured');
  };

  return (
    <div className="container" style={{ padding: '40px 20px 80px 20px' }}>
      <h2>Jewellery Catalogue</h2>
      <p style={{ textAlign: 'center', color: 'var(--color-gray)', marginTop: '-20px', marginBottom: '40px' }}>
        Discover timeless elegance with precision filters
      </p>

      <div className="listing-filter-toolbar">
        <div className="filter-search-box">
          <Search size={18} color="var(--color-emerald)" />
          <input
            type="text"
            placeholder="Search by ring, diamond, emerald..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-search-btn" onClick={() => setSearchQuery('')}>
              ×
            </button>
          )}
        </div>

        <div className="filter-sort-box">
          <label htmlFor="sort-select">
            <SlidersHorizontal size={16} /> Sort By:
          </label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-dropdown"
          >
            <option value="featured">Featured First</option>
            <option value="price-low-high">Price: Low to High</option>
            <option value="price-high-low">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="name">Name (A-Z)</option>
          </select>
        </div>
      </div>

      <div className="listing-layout">
        <aside className="filter-sidebar">
          <div className="filter-group">
            <h3>Categories</h3>
            <div className="category-pills">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`category-pill-btn ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group" style={{ marginTop: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>Price Filter</h3>
              <span style={{ fontWeight: 'bold', color: 'var(--color-emerald)' }}>
                Up to ${maxPrice.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min={300}
              max={3000}
              step={100}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="price-range-slider"
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--color-gray)' }}>
              <span>$300</span>
              <span>$3,000</span>
            </div>
          </div>

          <button className="reset-filter-btn" onClick={resetFilters}>
            <RotateCcw size={14} /> Reset All Filters
          </button>
        </aside>

        <main className="product-listing-main">
          <div className="result-meta-bar">
            <span>
              Showing <strong>{filteredProducts.length}</strong> {filteredProducts.length === 1 ? 'piece' : 'pieces'}
            </span>
            {(selectedCategory !== 'All' || searchQuery || maxPrice < 3000) && (
              <span className="active-filter-badge">
                Filtered Results
              </span>
            )}
          </div>

          {filteredProducts.length === 0 ? (
            <div className="no-products-found">
              <h3>No Jewellery Found</h3>
              <p>Try adjusting your search criteria or price range filter.</p>
              <button className="btn btn-gold" onClick={resetFilters} style={{ marginTop: '15px' }}>
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="product-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
