import React from 'react';

export const AboutPage = () => {
  return (
    <div className="container" style={{ padding: '80px 20px' }}>
      <h2>Our Story</h2>
      <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', color: 'var(--color-gray)', fontSize: '1.15rem', lineHeight: '1.8' }}>
        <p style={{ marginBottom: '20px' }}>
          Founded with a vision for timeless beauty, Aurelia Jewellery combines traditional artisanal craftsmanship with contemporary design philosophy.
        </p>
        <p style={{ marginBottom: '20px' }}>
          Every diamond, emerald, sapphire, and gold setting in our studio is individually selected for luster, ethical integrity, and perfection.
        </p>
      </div>
    </div>
  );
};
