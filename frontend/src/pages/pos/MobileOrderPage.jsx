import React, { useState, useEffect } from 'react';
import { productsAPI } from '../../api/api';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import Button from '../../components/common/Button';

const MobileOrderPage = () => {
  const [screen, setScreen] = useState('splash');
  const [cart, setCart] = useState([]);
  const [activeItem, setActiveItem] = useState(null);
  const [qty, setQty] = useState(1);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await productsAPI.getAll();
        setProducts(res.data.data.products || []);
      } catch (err) {
        console.error('Failed to load products', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  const addToCart = () => {
    const existing = cart.find(i => i.id === activeItem.id);
    if(existing) setCart(cart.map(i => i.id === activeItem.id ? {...i, qty: i.qty + qty} : i));
    else setCart([...cart, { ...activeItem, qty }]);
    setScreen('menu');
  };

  const MobileLayout = ({ children }) => (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', backgroundColor: '#000' }}>
      <div style={{ width: '100%', maxWidth: '430px', backgroundColor: 'var(--bg-primary)', position: 'relative', display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
    </div>
  );

  const Splash = () => (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }} onClick={() => setScreen('menu')}>
      <img src="/logo.png" alt="Jor Shor Logo" style={{ height: '80px', marginBottom: '16px' }} />
      <h1 style={{ marginTop: '24px' }}>Welcome!</h1>
      <p style={{ marginTop: '16px', color: 'var(--text-muted)' }}>Tap anywhere to order</p>
    </div>
  );

  const MenuScreen = () => (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>Menu</h2>
        <div onClick={() => setScreen('history')} style={{ color: 'var(--accent)', cursor: 'pointer' }}>My Orders</div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '40px' }}>Loading menu...</div>
        ) : products.map(p => (
          <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', borderBottom: '1px solid var(--border)', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{p.name}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>{p.category_name || ''}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontWeight: 600, color: 'var(--accent)' }}>₹{Number(p.price).toFixed(2)}</span>
              <button 
                onClick={() => { setActiveItem(p); setQty(1); setScreen('item'); }}
                style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent)', color: '#fff', border: 'none', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>
      {cart.length > 0 && (
        <div style={{ padding: '16px', background: 'var(--bg-elevated)', borderTop: '1px solid var(--border)' }}>
          <Button style={{ width: '100%', height: '50px', fontSize: '1.1rem' }} onClick={() => setScreen('cart')}>
            Order ₹{cartTotal.toFixed(2)} — View Cart →
          </Button>
        </div>
      )}
    </div>
  );

  const ItemDetail = () => (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <button onClick={() => setScreen('menu')} style={{ background: 'none', border: 'none', color: '#fff', padding: '16px', textAlign: 'left', cursor: 'pointer' }}><ArrowLeft/></button>
      <div style={{ flex: 1, padding: '24px' }}>
        <h1 style={{ marginBottom: '8px' }}>{activeItem.name}</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Delicious {activeItem.name} made fresh to order.</p>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', margin: '40px 0' }}>
          <button onClick={() => setQty(Math.max(1, qty-1))} style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: '#fff', fontSize: '1.5rem' }}>-</button>
          <span style={{ fontSize: '2rem', fontWeight: 600 }}>{qty}</span>
          <button onClick={() => setQty(qty+1)} style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: '#fff', fontSize: '1.5rem' }}>+</button>
        </div>
      </div>
      <div style={{ padding: '24px', paddingBottom: '40px', background: 'var(--bg-elevated)' }}>
        <Button style={{ width: '100%', height: '56px', fontSize: '1.1rem' }} onClick={addToCart}>
          Add to Cart — ₹{(activeItem.price * qty).toFixed(2)}
        </Button>
      </div>
    </div>
  );

  const CartScreen = () => (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px solid var(--border)' }}>
        <button onClick={() => setScreen('menu')} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><ArrowLeft/></button>
        <h2 style={{ margin: 0 }}>Your Cart</h2>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        {cart.map(c => (
          <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid var(--border)' }}>
            <div><div style={{ fontWeight: 600 }}>{c.qty}x {c.name}</div></div>
            <div>₹{(c.price * c.qty).toFixed(2)}</div>
          </div>
        ))}
        
        <div style={{ marginTop: '32px', marginBottom: '16px', fontWeight: 600 }}>Payment Method</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', border: '1px solid var(--accent)', borderRadius: '8px', background: 'rgba(224,123,57,0.1)' }}>
            <input type="radio" name="pay" defaultChecked style={{ accentColor: 'var(--accent)' }}/> Pay at Counter (Cash/Card)
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', border: '1px solid var(--border)', borderRadius: '8px' }}>
            <input type="radio" name="pay" style={{ accentColor: 'var(--accent)' }}/> UPI Online
          </label>
        </div>
      </div>
      <div style={{ padding: '24px', background: 'var(--bg-elevated)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 600, marginBottom: '24px' }}>
          <span>Total</span><span style={{ color: 'var(--accent)' }}>₹{cartTotal.toFixed(2)}</span>
        </div>
        <Button style={{ width: '100%', height: '56px', fontSize: '1.1rem' }} onClick={() => setScreen('confirm')}>
          Place Order
        </Button>
      </div>
    </div>
  );

  const Confirm = () => (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', textAlign: 'center' }}>
      <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
         <strong style={{ color: '#fff', fontSize: '2.5rem' }}>✓</strong>
      </div>
      <h1>Order Placed!</h1>
      <div style={{ fontSize: '1.5rem', color: 'var(--accent)', margin: '16px 0', fontWeight: 'bold' }}>#{Math.floor(1000 + Math.random()*9000)}</div>
      <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>We have received your order. Please show this screen at the counter.</p>
      
      <Button style={{ width: '100%', marginBottom: '16px' }} onClick={() => { setCart([]); setScreen('history'); }}>Track Order</Button>
      <Button variant="ghost" style={{ width: '100%' }} onClick={() => { setCart([]); setScreen('menu'); }}>Back to Menu</Button>
    </div>
  );

  const History = () => (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px solid var(--border)' }}>
        <button onClick={() => setScreen('menu')} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><ArrowLeft/></button>
        <h2 style={{ margin: 0 }}>Order History</h2>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        {[
          { id: '1234', status: 'preparing', total: 75.00 },
          { id: '1233', status: 'completed', total: 25.00 }
        ].map(o => (
          <div key={o.id} style={{ padding: '16px', border: '1px solid var(--border)', borderRadius: '8px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ fontWeight: 'bold' }}>#{o.id}</div>
              <div style={{ color: o.status === 'completed' ? 'var(--success)' : '#ffc107', textTransform: 'capitalize', fontWeight: 600 }}>{o.status}</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <div>Table 4</div>
              <div>₹{o.total.toFixed(2)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <MobileLayout>
      {screen === 'splash' && <Splash/>}
      {screen === 'menu' && <MenuScreen/>}
      {screen === 'item' && <ItemDetail/>}
      {screen === 'cart' && <CartScreen/>}
      {screen === 'confirm' && <Confirm/>}
      {screen === 'history' && <History/>}
    </MobileLayout>
  );
};

export default MobileOrderPage;
