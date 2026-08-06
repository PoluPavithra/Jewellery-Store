import React, { useState } from 'react';
import { X, Lock, Mail, User, Phone, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export const AuthModal = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalTab,
    setAuthModalTab,
    login,
    register,
    isLoading,
    authError,
    setAuthError
  } = useAuth();

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({ email: loginEmail, password: loginPassword });
    } catch {
      // Handled in context
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      await register({
        fullName: regFullName,
        email: regEmail,
        password: regPassword,
        phone: regPhone || undefined
      });
    } catch {
      // Handled in context
    }
  };

  const switchTab = (tab) => {
    setAuthModalTab(tab);
    setAuthError(null);
  };

  return (
    <div className="auth-modal-overlay" onClick={() => setIsAuthModalOpen(false)}>
      <div className="auth-modal-card" onClick={(e) => e.stopPropagation()}>
        <button
          className="auth-modal-close"
          onClick={() => setIsAuthModalOpen(false)}
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        <div className="auth-modal-header">
          <span className="auth-brand-logo">AURELIA</span>
          <p className="auth-brand-tagline">Maison de Haute Joaillerie</p>
        </div>

        <div className="auth-tabs">
          <button
            className={`auth-tab-btn ${authModalTab === 'login' ? 'active' : ''}`}
            onClick={() => switchTab('login')}
          >
            Sign In
          </button>
          <button
            className={`auth-tab-btn ${authModalTab === 'signup' ? 'active' : ''}`}
            onClick={() => switchTab('signup')}
          >
            Create Account
          </button>
        </div>

        {authError && (
          <div className="auth-error-alert">
            <span>{authError}</span>
          </div>
        )}

        {authModalTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="auth-form">
            <div className="form-group">
              <label>Email Address</label>
              <div className="input-with-icon">
                <Mail size={18} className="field-icon" />
                <input
                  type="email"
                  required
                  placeholder="client@aurelia.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="auth-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="input-with-icon">
                <Lock size={18} className="field-icon" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="auth-input"
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginTop: '-5px', marginBottom: '15px' }}>
              <span style={{ color: 'var(--color-gray)' }}>Demo: client@aurelia.com / Client@123</span>
              <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Demo reset email sent!'); }} style={{ color: 'var(--color-gold)', textDecoration: 'none' }}>
                Forgot?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-gold auth-submit-btn"
            >
              {isLoading ? (
                <span className="btn-loading-flex">
                  <Loader2 size={18} className="spinner" /> Authenticating...
                </span>
              ) : (
                <span className="btn-loading-flex">
                  Sign In to Account <ArrowRight size={16} />
                </span>
              )}
            </button>
          </form>
        )}

        {authModalTab === 'signup' && (
          <form onSubmit={handleRegisterSubmit} className="auth-form">
            <div className="form-group">
              <label>Full Name</label>
              <div className="input-with-icon">
                <User size={18} className="field-icon" />
                <input
                  type="text"
                  required
                  placeholder="Lady Eleanor Vance"
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                  className="auth-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <div className="input-with-icon">
                <Mail size={18} className="field-icon" />
                <input
                  type="email"
                  required
                  placeholder="eleanor@aurelia.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="auth-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Phone Number (Optional)</label>
              <div className="input-with-icon">
                <Phone size={18} className="field-icon" />
                <input
                  type="tel"
                  placeholder="+1 (212) 555-0142"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  className="auth-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="input-with-icon">
                <Lock size={18} className="field-icon" />
                <input
                  type="password"
                  required
                  placeholder="At least 6 characters"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="auth-input"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-gold auth-submit-btn"
            >
              {isLoading ? (
                <span className="btn-loading-flex">
                  <Loader2 size={18} className="spinner" /> Creating Account...
                </span>
              ) : (
                <span className="btn-loading-flex">
                  Join Aurelia VIP Privilege <ShieldCheck size={18} />
                </span>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
