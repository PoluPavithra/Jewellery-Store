import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, Heart, Menu, X, User as UserIcon, LogOut, Package, ShieldCheck } from 'lucide-react';
import { useShop } from '../context/ShopContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export const Navbar = () => {
  const {
    cartCount,
    wishlist,
    setIsCartOpen,
    setIsWishlistOpen,
    searchQuery,
    setSearchQuery
  } = useShop();

  const { user, isAuthenticated, logout, openAuthModal } = useAuth();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  return (
    <header className="header">
      <div className="container nav-container">
        <button
          className="mobile-menu-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <Link to="/" className="logo">
          AURELIA
        </Link>

        <nav className={`main-nav ${isMobileMenuOpen ? 'mobile-active' : ''}`}>
          <ul className="nav-links">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) => (isActive ? 'active' : '')}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/collections"
                className={({ isActive }) => (isActive ? 'active' : '')}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Collections
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/products"
                className={({ isActive }) => (isActive ? 'active' : '')}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                All Catalogue
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/about"
                className={({ isActive }) => (isActive ? 'active' : '')}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/contact"
                className={({ isActive }) => (isActive ? 'active' : '')}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </NavLink>
            </li>
          </ul>
        </nav>

        <div className="nav-icons">
          {isSearchOpen ? (
            <form onSubmit={handleSearchSubmit} className="inline-search-form">
              <input
                type="text"
                placeholder="Search jewellery..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="search-input"
              />
              <button type="submit" aria-label="Submit search">
                <Search size={16} />
              </button>
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                aria-label="Close search input"
              >
                <X size={16} />
              </button>
            </form>
          ) : (
            <button
              onClick={() => setIsSearchOpen(true)}
              title="Search catalogue"
              aria-label="Search"
              className="icon-nav-btn"
            >
              <Search size={18} />
              <span className="icon-label">Search</span>
            </button>
          )}

          <button
            onClick={() => setIsWishlistOpen(true)}
            title="Wishlist"
            aria-label="Wishlist"
            className="icon-nav-btn relative-badge-btn"
          >
            <Heart size={18} />
            <span className="icon-label">Wishlist</span>
            {wishlist.length > 0 && <span className="nav-badge">{wishlist.length}</span>}
          </button>

          <button
            onClick={() => setIsCartOpen(true)}
            title="Cart"
            aria-label="Cart"
            className="icon-nav-btn relative-badge-btn"
          >
            <ShoppingBag size={18} />
            <span className="icon-label">Bag</span>
            {cartCount > 0 && <span className="nav-badge">{cartCount}</span>}
          </button>

          <div style={{ position: 'relative' }}>
            {isAuthenticated ? (
              <div>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="icon-nav-btn"
                  title={user?.fullName || 'My Account'}
                  aria-label="User Account Menu"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-gold)',
                    color: '#FFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.85rem'
                  }}>
                    {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="icon-label" style={{ fontWeight: 600 }}>
                    {user?.fullName?.split(' ')[0] || 'Client'}
                  </span>
                </button>

                {isUserMenuOpen && (
                  <div style={{
                    position: 'absolute',
                    right: 0,
                    top: '120%',
                    backgroundColor: '#FFF',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                    width: '200px',
                    zIndex: 100,
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid #F3F4F6', backgroundColor: 'var(--color-cream)' }}>
                      <p style={{ fontWeight: 700, fontSize: '0.9rem', margin: 0, color: 'var(--color-emerald)' }}>
                        {user?.fullName}
                      </p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--color-gray)', margin: '2px 0 0 0', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                        {user?.email}
                      </p>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setIsUserMenuOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '12px 16px',
                        fontSize: '0.9rem',
                        color: 'var(--color-dark-gray)',
                        textDecoration: 'none'
                      }}
                      className="nav-dropdown-item"
                    >
                      <UserIcon size={16} color="var(--color-gold)" /> VIP Profile
                    </Link>

                    <Link
                      to="/orders"
                      onClick={() => setIsUserMenuOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '12px 16px',
                        fontSize: '0.9rem',
                        color: 'var(--color-dark-gray)',
                        textDecoration: 'none'
                      }}
                      className="nav-dropdown-item"
                    >
                      <Package size={16} color="var(--color-gold)" /> My Orders
                    </Link>

                    {user?.role === 'ROLE_ADMIN' && (
                      <Link
                        to="/admin"
                        onClick={() => setIsUserMenuOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '12px 16px',
                          fontSize: '0.9rem',
                          color: 'var(--color-emerald)',
                          fontWeight: 700,
                          backgroundColor: 'rgba(1, 51, 32, 0.05)',
                          textDecoration: 'none'
                        }}
                        className="nav-dropdown-item"
                      >
                        <ShieldCheck size={16} color="var(--color-gold)" /> Admin Dashboard
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '12px 16px',
                        fontSize: '0.9rem',
                        color: '#DC2626',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        borderTop: '1px solid #F3F4F6'
                      }}
                      className="nav-dropdown-item"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => openAuthModal('login')}
                className="icon-nav-btn"
                title="Sign In"
                aria-label="Sign In"
              >
                <UserIcon size={18} />
                <span className="icon-label">Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
