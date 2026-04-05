import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';

// A mock invoice page for demonstration 
const Invoice = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div style={{ padding: '48px', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
      <div className="glass-panel" style={{ padding: '48px', backgroundColor: '#fff', color: '#000' }}>
        <h1 style={{ marginBottom: '24px' }}>Invoice #{id}</h1>
        <p style={{ color: '#555', marginBottom: '32px' }}>Odoo POS Cafe - Thank you for your purchase!</p>
        
        {/* Placeholder for real invoice data fetched via API */}
        <div style={{ borderTop: '1px dashed #ccc', borderBottom: '1px dashed #ccc', padding: '24px 0', margin: '24px 0' }}>
          <p>Order details will appear here</p>
        </div>

        <Button onClick={() => window.print()} style={{ marginRight: '16px' }}>Print Invoice</Button>
        <Button variant="secondary" onClick={() => navigate('/pos')}>Back to POS</Button>
      </div>
    </div>
  );
};

export default Invoice;
