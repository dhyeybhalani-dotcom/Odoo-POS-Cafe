import React from 'react';
import Button from '../common/Button';

const PaymentPanel = ({ amount, onFinish }) => {
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'var(--bg-primary)', zIndex: 3000,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      animation: 'fadeIn 0.2s ease'
    }}>
      <div style={{ textAlign: 'center', animation: 'slideUp 0.3s ease' }}>
        <div style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '16px' }}>Amount Paid</div>
        <div style={{ fontSize: '4rem', fontWeight: 'bold', color: 'var(--accent-gold)', marginBottom: '64px' }}>
          ${Number(amount).toFixed(2)}
        </div>
        
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <Button variant="ghost" size="lg" style={{ padding: '16px 32px' }} onClick={() => onFinish()}>Email Receipt</Button>
          <Button variant="primary" size="lg" style={{ padding: '16px 48px' }} onClick={() => onFinish()}>Continue</Button>
        </div>
      </div>
      <style>{`
        @keyframes slideUp { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
    </div>
  );
};

export default PaymentPanel;
