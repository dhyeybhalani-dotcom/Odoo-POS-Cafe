import React from 'react';

const Charts = ({ topProducts }) => {
  if (!topProducts || topProducts.length === 0) return <p>No data available for charts.</p>;

  // simple custom bar chart for aesthetic consistency
  const maxSold = Math.max(...topProducts.map(p => p.sold));

  return (
    <div className="glass-panel" style={{ padding: '24px', marginTop: '32px' }}>
      <h3 style={{ marginBottom: '24px' }}>Top Selling Products</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {topProducts.map((p, index) => {
          const percentage = (p.sold / maxSold) * 100;
          return (
            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '120px', fontSize: '0.9rem', textAlign: 'right' }}>{p.name}</div>
              <div style={{ flex: 1, background: 'rgba(255,255,255,0.1)', height: '24px', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ 
                  width: `${percentage}%`, 
                  height: '100%', 
                  background: 'var(--accent-color)', 
                  transition: 'width 1s ease-out' 
                }} />
              </div>
              <div style={{ width: '60px', color: 'var(--accent-color)', fontWeight: 'bold' }}>{p.sold}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Charts;
