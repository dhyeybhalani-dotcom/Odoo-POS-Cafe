import React, { useState, useEffect } from 'react';
import { 
  Coffee, 
  CheckCircle2, 
  ShoppingBag, 
  QrCode, 
  Heart,
  Star,
  Monitor
} from 'lucide-react';

const CustomerDisplayPage = () => {
  const [orderStatus, setOrderStatus] = useState('Welcome'); // 'Welcome' | 'Ordering' | 'Payment' | 'ThankYou'
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('customer_display_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'customer_display_cart') {
        const newCart = e.newValue ? JSON.parse(e.newValue) : [];
        setCart(newCart);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  const total = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);

  return (
    <div className="page-container" style={{ background: 'var(--bg-primary)', height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px', background: 'var(--border)' }}>
        
        {/* Left: Promotional / Welcome Panel */}
        <div style={{ background: 'var(--bg-primary)', padding: '64px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', position: 'relative' }}>
           <div className="fade-in" style={{ maxWidth: '400px' }}>
              <div style={{ fontSize: '10rem', marginBottom: '24px' }}>☕</div>
              <h2 style={{ fontSize: '3rem', fontWeight: 900, fontFamily: 'Outfit', lineHeight: 1.1, marginBottom: '24px' }}>
                Taste the <span style={{ color: 'var(--accent-gold)' }}>Art of Brewing</span>
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', lineHeight: 1.6, marginBottom: '40px' }}>
                Hand-picked beans, roasted with love, served with a smile.
              </p>
              <div className="badge badge-yellow" style={{ fontSize: '1.2rem', padding: '12px 24px' }}>Special: Buy 1 Get 1 Free!</div>
           </div>
           
           {/* Decorative elements */}
           <div style={{ position: 'absolute', bottom: '10%', opacity: 0.1 }}>
              <Monitor size={300} strokeWidth={1} />
           </div>
        </div>

        {/* Right: Order Summary Panel */}
        <div style={{ background: 'var(--bg-card)', padding: '64px', display: 'flex', flexDirection: 'column' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '48px' }}>
              <ShoppingBag size={32} color="var(--accent-gold)" />
              <h2 style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'Outfit' }}>Current Order</h2>
           </div>

           <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {cart.map((item, idx) => (
                <div key={idx} className="scale-in" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', animationDelay: `${idx*0.1}s` }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                      <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-gold)', background: 'rgba(201,168,76,0.1)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         {item.qty}
                      </div>
                      <div style={{ fontSize: '1.4rem', fontWeight: 600 }}>{item.name}</div>
                   </div>
                   <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>${(item.price * item.qty).toFixed(2)}</div>
                </div>
              ))}
           </div>

           <div style={{ marginTop: '48px', padding: '40px', background: 'var(--bg-elevated)', borderRadius: '24px', border: '2px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '1.2rem', marginBottom: '12px' }}>
                 <span>Subtotal</span>
                 <span>${total.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '1.2rem', marginBottom: '24px' }}>
                 <span>Tax (GST 5%)</span>
                 <span>$0.00</span>
              </div>
              <div className="divider" style={{ borderColor: 'rgba(108,142,191,0.2)', margin: '24px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '2.5rem', fontWeight: 900, fontFamily: 'Outfit' }}>
                 <span>Total</span>
                 <span style={{ color: 'var(--accent-gold)' }}>${total.toFixed(2)}</span>
              </div>
           </div>

           <div style={{ marginTop: '40px', display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--success)', fontSize: '1.1rem', fontWeight: 700 }}>
              <CheckCircle2 size={24}/>
              Waiting for payment configuration...
           </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="glass" style={{ padding: '16px 64px', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-dim)', letterSpacing: '0.1em' }}>
         POWERED BY JOR SHOR POS - SECURE & FAST
      </div>
    </div>
  );
};

export default CustomerDisplayPage;
