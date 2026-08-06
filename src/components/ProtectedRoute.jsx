import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { Lock, ArrowRight } from 'lucide-react';

export const ProtectedRoute = ({ children, adminOnly }) => {
  const { isAuthenticated, isLoading, user, openAuthModal } = useAuth();

  if (isLoading) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <div className="spinner-large" />
        <p style={{ marginTop: '20px', fontFamily: 'var(--font-heading)', color: 'var(--color-gold)' }}>
          Verifying Client Authentication...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container" style={{ padding: '90px 20px', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
        <div style={{
          width: '70px',
          height: '70px',
          borderRadius: '50%',
          backgroundColor: 'rgba(212, 175, 55, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px auto',
          color: 'var(--color-gold)'
        }}>
          <Lock size={32} />
        </div>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: 'var(--color-emerald)', marginBottom: '10px' }}>
          VIP Client Area
        </h2>
        <p style={{ color: 'var(--color-dark-gray)', lineHeight: '1.6', marginBottom: '30px' }}>
          Please sign in to your Aurelia account to access your personal shopping bag, complete checkout, and view your order history.
        </p>
        <button
          className="btn btn-gold"
          onClick={() => openAuthModal('login')}
          style={{ padding: '14px 28px' }}
        >
          <span>Sign In / Register</span>
          <ArrowRight size={18} />
        </button>
      </div>
    );
  }

  if (adminOnly && user?.role !== 'ROLE_ADMIN') {
    return (
      <div className="container" style={{ padding: '90px 20px', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: 'var(--color-emerald)', marginBottom: '10px' }}>
          Administrative Access Required
        </h2>
        <p style={{ color: 'var(--color-dark-gray)', marginBottom: '20px' }}>
          You need Executive Admin credentials to view this management portal.
        </p>
        <button className="btn btn-gold" onClick={() => openAuthModal('login')}>
          Sign In as Executive Admin
        </button>
      </div>
    );
  }

  return <>{children}</>;
};
