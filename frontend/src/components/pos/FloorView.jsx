import React from 'react';
import Skeleton from '../common/Skeleton';

const FloorView = ({ tables = [], loading, onSelectTable }) => {
  if (loading) {
    return (
      <div style={{ padding: '24px' }}>
        <h2 style={{ marginBottom: '24px', fontSize: '1.5rem' }}>Select a Table</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '24px' }}>
          {[1,2,3,4,5,6,7].map(i => <Skeleton key={i} variant="card" height="140px" />)}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <h2 style={{ marginBottom: '24px', fontSize: '1.5rem' }}>Select a Table</h2>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', 
        gap: '24px' 
      }}>
        {tables.map(table => (
          <div 
            key={table.id}
            onClick={() => onSelectTable(table)}
            style={{
              height: '140px',
              backgroundColor: 'var(--bg-card)',
              border: `2px solid ${table.status === 'occupied' ? 'var(--danger)' : table.status === 'reserved' ? 'var(--accent-gold)' : 'var(--border)'}`,
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseOver={e => {
              e.currentTarget.style.borderColor = 'var(--accent-gold)';
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.3)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.borderColor = table.status === 'occupied' ? 'var(--danger)' : 'var(--border)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>Table {table.table_number}</h3>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Seats: {table.seats}</span>
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, height: '4px',
              backgroundColor: table.status === 'occupied' ? 'var(--danger)' : table.status === 'reserved' ? 'var(--accent-gold)' : 'var(--success)'
            }} />
          </div>
        ))}
        {tables.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-muted)', marginTop: '40px' }}>
            No tables found. Create tables from the Floor Plan page.
          </div>
        )}
      </div>
    </div>
  );
};

export default FloorView;
