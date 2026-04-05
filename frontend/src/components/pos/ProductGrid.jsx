import React from 'react';
import Skeleton from '../common/Skeleton';

const ProductGrid = ({ products = [], loading, categoryFilter, onAddToCart }) => {
  const filteredProducts = categoryFilter === 'All' 
    ? products 
    : products.filter(p => p.category_name === categoryFilter);

  if (loading) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '16px', padding: '24px 0' }}>
        {[1,2,3,4,5,6,7,8].map(i => <Skeleton key={i} variant="card" height="140px" />)}
      </div>
    );
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
      gap: '16px',
      padding: '24px 0'
    }}>
      {filteredProducts.map(product => (
        <div
          key={product.id}
          className="card"
          onClick={() => onAddToCart(product)}
          style={{
            cursor: 'pointer',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '140px',
            padding: '16px 12px'
          }}
        >
          <div style={{ fontSize: '1.1rem', fontWeight: 500 }}>{product.name}</div>
          <div style={{ color: 'var(--accent-gold)', fontWeight: 600, fontSize: '1.2rem' }}>
            ₹{Number(product.price).toFixed(2)}
          </div>
        </div>
      ))}
      {filteredProducts.length === 0 && (
        <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-muted)', marginTop: '40px' }}>
          No products found in this category.
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
