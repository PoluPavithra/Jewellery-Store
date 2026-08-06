import React from 'react';

export const ContactPage = () => {
  return (
    <div className="container" style={{ padding: '80px 20px', maxWidth: '800px' }}>
      <h2>Contact Us</h2>
      <p style={{ textAlign: 'center', marginBottom: '40px', color: 'var(--color-gray)' }}>
        Our concierge team is at your service for custom commissions, private viewings, and inquiries.
      </p>
      <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <input
          type="text"
          placeholder="Full Name"
          style={{ padding: '16px 20px', borderRadius: '8px', border: '1px solid #ccc', outline: 'none' }}
          required
        />
        <input
          type="email"
          placeholder="Email Address"
          style={{ padding: '16px 20px', borderRadius: '8px', border: '1px solid #ccc', outline: 'none' }}
          required
        />
        <textarea
          rows={5}
          placeholder="Your Message"
          style={{ padding: '16px 20px', borderRadius: '8px', border: '1px solid #ccc', outline: 'none' }}
          required
        />
        <button type="submit" className="btn btn-gold" style={{ alignSelf: 'center' }}>
          Send Inquiry
        </button>
      </form>
    </div>
  );
};
