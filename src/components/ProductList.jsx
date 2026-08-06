import React from 'react';
import { ProductCard } from './ProductCard.jsx';

export const ProductList = ({ products, title }) => {
  return (
    <section className="signature-pieces container">
      {title && <h2>{title}</h2>}
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};
