import React from 'react';
import { collectionsData, productsData } from '../data/mockData.js';
import { ProductList } from '../components/ProductList.jsx';

export const CollectionsPage = () => {
  return (
    <div>
      <section className="container" style={{ paddingTop: '60px', paddingBottom: '40px' }}>
        <h2>Our Collections</h2>
        <div className="collection-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '60px' }}>
          {collectionsData.map((col) => (
            <article
              key={col.id}
              className="collection-item"
              style={col.spanTwo ? { gridColumn: 'span 2' } : {}}
            >
              <img src={col.image} alt={col.title} style={col.spanTwo ? { objectPosition: 'center 30%' } : {}} />
              <div className="collection-overlay">
                <h3>{col.title}</h3>
                <span className="btn-text">View Collection &rarr;</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <ProductList products={productsData} title="All Jewellery Pieces" />
    </div>
  );
};
