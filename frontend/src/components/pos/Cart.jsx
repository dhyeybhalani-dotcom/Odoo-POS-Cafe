import React from 'react';
import Button from '../common/Button';
import { Trash2 } from 'lucide-react';

const Cart = ({ activeTable, cart, updateQuantity, removeFromCart, totals, onPayAction, submitting }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', backgroundColor: 'var(--bg-elevated)' }}>
        <h3 style={{ margin: 0, fontSize: '1.2rem' }}>
          {activeTable ? `Table ${activeTable.table_number} — Order` : 'Current Order'}
        </h3>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
        {cart.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '40px' }}>
            Cart is empty. Select items to add.
          </div>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {cart.map((item, index) => (
              <li key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500 }}>{item.name}</div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>₹{Number(item.price).toFixed(2)} / ea</div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button onClick={() => updateQuantity(item.product_id, -1)} style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: '#fff', cursor: 'pointer' }}>-</button>
                  <span style={{ minWidth: '24px', textAlign: 'center' }}>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.product_id, 1)} style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: '#fff', cursor: 'pointer' }}>+</button>
                  <button onClick={() => removeFromCart(item.product_id)} style={{ background: 'none', border: 'none', color: 'var(--danger)', marginLeft: '8px', cursor: 'pointer' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div style={{ padding: '24px', borderTop: '1px solid var(--border)', backgroundColor: 'var(--bg-elevated)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: 'var(--text-muted)' }}>
          <span>Subtotal</span>
          <span>₹{totals.subtotal}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', color: 'var(--text-muted)' }}>
          <span>Tax (5%)</span>
          <span>₹{totals.taxTotal}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', fontSize: '1.25rem', fontWeight: 'bold' }}>
          <span>Grand Total</span>
          <span style={{ color: 'var(--accent-gold)' }}>₹{totals.total}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '16px' }}>
          <Button variant="ghost" onClick={() => onPayAction('Cash')} disabled={cart.length === 0 || submitting}>Cash</Button>
          <Button variant="ghost" onClick={() => onPayAction('Digital')} disabled={cart.length === 0 || submitting}>Digital</Button>
          <Button variant="ghost" onClick={() => onPayAction('UPI')} disabled={cart.length === 0 || submitting}>UPI</Button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '8px' }}>
          <Button variant="primary" style={{ height: '48px', fontSize: '1.1rem' }} onClick={() => onPayAction('Validate')} disabled={cart.length === 0 || submitting}>
            {submitting ? 'Processing...' : 'Validate / Pay'}
          </Button>
          <Button variant="ghost" style={{ height: '48px', borderColor: 'var(--success)', color: 'var(--success)' }} onClick={() => onPayAction('Send')} disabled={cart.length === 0}>Send to Kit</Button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
