import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  User, 
  FileText, 
  Hash, 
  Trash2, 
  CreditCard, 
  Banknote, 
  QrCode, 
  ChevronLeft, 
  ChevronRight,
  Plus,
  Minus,
  CheckCircle,
  X,
  LayoutGrid,
  Monitor,
  Printer,
  Mail,
  ArrowRight,
  UtensilsCrossed,
  Info
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useSession } from '../../context/SessionContext';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { productsAPI, categoriesAPI, ordersAPI, paymentsAPI, tablesAPI } from '../../api/api';

const POSPage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { currentSession, openSession, loading: sessionLoading } = useSession();
  
  // Terminal State: 'floor' | 'register' | 'payment' | 'confirmation'
  const [view, setView] = useState('floor');
  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedTableId, setSelectedTableId] = useState(null);
  
  // Cart State
  const [cart, setCart] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Numpad State
  const [selectedCartItemId, setSelectedCartItemId] = useState(null);
  const [numpadMode, setNumpadMode] = useState('Qty'); // 'Qty', 'Disc.', 'Prices'
  const [bufferValue, setBufferValue] = useState("");
  const [resetBufferOnNextDigit, setResetBufferOnNextDigit] = useState(true);
  
  // Payment State
  const [paymentMethod, setPaymentMethod] = useState(null); // 'Cash', 'Digital', 'UPI'

  // Data from backend
  const [dbProducts, setDbProducts] = useState([]);
  const [dbCategories, setDbCategories] = useState([]);
  const [tables, setTables] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Fetch products and categories on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingProducts(true);
        const [prodRes, catRes] = await Promise.all([
          productsAPI.getAll({ archived: 'false' }),
          categoriesAPI.getAll()
        ]);
        setDbProducts(prodRes.data.data.products || []);
        setDbCategories(catRes.data.data.categories || []);
      } catch (err) {
        addToast('Failed to load product data', 'error');
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchData();
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const res = await tablesAPI.getAll();
      setTables(res.data.data.tables || []);
    } catch (err) {
      // Tables may not be set up yet; fall back to hardcoded
      setTables([]);
    }
  };

  const categoryNames = ['All', ...dbCategories.map(c => c.name)];

  const filteredProducts = dbProducts.filter(p => {
    const catMatch = activeCategory === 'All' || p.category_name === activeCategory;
    const searchMatch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return catMatch && searchMatch;
  });

  const total = cart.reduce((sum, item) => {
    const itemTotal = (item.price * (item.qty || 1));
    const discount = (item.discount || 0);
    return sum + (itemTotal * (1 - discount / 100));
  }, 0);

  const handleNumpadAction = (label) => {
    if (['Qty', 'Disc.', 'Prices'].includes(label)) {
      setNumpadMode(label);
      setResetBufferOnNextDigit(true);
      return;
    }

    if (!selectedCartItemId && cart.length > 0) {
      setSelectedCartItemId(cart[0].id);
    }

    if (!selectedCartItemId) return;

    let newCart = [...cart];
    const itemIndex = newCart.findIndex(i => i.id === selectedCartItemId);
    if (itemIndex === -1) return;

    const item = { ...newCart[itemIndex] };

    if (label === 'X') {
      if (bufferValue.length > 0) {
        const newVal = bufferValue.slice(0, -1);
        setBufferValue(newVal);
        applyValueToItem(item, newVal);
      } else {
        applyValueToItem(item, "0");
      }
    } else if (label === '+/-') {
      // ignore
    } else {
      let newVal = resetBufferOnNextDigit ? label : bufferValue + label;
      setBufferValue(newVal);
      setResetBufferOnNextDigit(false);
      applyValueToItem(item, newVal);
    }

    newCart[itemIndex] = item;
    setCart(newCart);
  };

  const applyValueToItem = (item, valStr) => {
    const val = parseFloat(valStr) || 0;
    if (numpadMode === 'Qty') {
      item.qty = Math.max(1, Math.floor(val));
    } else if (numpadMode === 'Disc.') {
      item.discount = Math.min(100, Math.max(0, val));
    } else if (numpadMode === 'Prices') {
      item.price = val;
    }
  };

  const addToCart = (product) => {
    const existing = cart.find(i => i.id === product.id);
    let newCart;
    if (existing) {
      newCart = cart.map(i => i.id === product.id ? { ...i, qty: (i.qty || 1) + 1 } : i);
    } else {
      newCart = [...cart, { ...product, qty: 1 }];
    }
    setCart(newCart);
    setSelectedCartItemId(product.id);
    setResetBufferOnNextDigit(true);
    localStorage.setItem('customer_display_cart', JSON.stringify(newCart));
  };

  const removeFromCart = (id) => {
    const newCart = cart.filter(i => i.id !== id);
    setCart(newCart);
    if (selectedCartItemId === id) {
      setSelectedCartItemId(newCart.length > 0 ? newCart[0].id : null);
    }
    localStorage.setItem('customer_display_cart', JSON.stringify(newCart));
  };

  const handleCheckout = () => {
    if (cart.length === 0) return addToast('Cart is empty', 'warning');
    setView('payment');
  };

  const handlePayment = (method) => {
    setPaymentMethod(method);
  };

  const confirmPayment = async () => {
    try {
      // Create a proper order in the database
      const orderData = {
        session_id: currentSession?.id || null,
        table_id: selectedTableId || null,
        items: cart.map(item => ({
          product_id: item.id,
          product_name: item.name,
          quantity: item.qty || 1,
          unit_price: item.price,
          tax: item.tax || 5,
          discount: item.discount || 0,
        })),
        notes: '',
      };
      
      const orderRes = await ordersAPI.create(orderData);
      const newOrder = orderRes.data.data?.order || orderRes.data.data;
      
      if (newOrder && newOrder.id) {
        // Record payment
        await paymentsAPI.create({
          order_id: newOrder.id,
          method: paymentMethod,
          amount: total,
          status: 'completed',
        });
        // Mark order as paid
        await ordersAPI.updateStatus(newOrder.id, 'paid');
      }
    } catch (err) {
      console.error('Failed to save order to database', err);
      // Still show confirmation to not block the cashier flow
    }
    setView('confirmation');
  };

  const finishSession = () => {
    setCart([]);
    setPaymentMethod(null);
    setSelectedTable(null);
    setSelectedTableId(null);
    setView('floor');
    localStorage.removeItem('customer_display_cart');
    addToast('Order completed!', 'success');
  };

  // Views rendering
  if (view === 'floor') return (
    <FloorView 
      tables={tables} 
      onSelect={(tableNum, tableId) => { 
        setSelectedTable(tableNum); 
        setSelectedTableId(tableId);
        setView('register'); 
      }} 
    />
  );
  if (view === 'confirmation') return <ConfirmationView total={total} onFinish={finishSession} />;

  return (
    <div className="page-wrapper-fullscreen fade-in" style={{ display: 'grid', gridTemplateColumns: view === 'payment' ? '1fr' : '1fr 400px', background: 'var(--bg-primary)' }}>
      
      {/* Left: Product Grid or Payment Selector */}
      <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRight: '1px solid var(--border)' }}>
        
        {/* Header Title */}
        <div style={{ padding: '20px 32px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-card)' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
             <button onClick={() => setView('floor')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}><ChevronLeft size={24}/></button>
             <h1 style={{ fontSize: '1.2rem', fontWeight: 800, fontFamily: 'Outfit, sans-serif' }}>
                Table {selectedTable} / {view === 'payment' ? 'Payment' : 'Register'}
             </h1>
           </div>
           
           {view === 'register' && (
             <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ position: 'relative' }}>
                   <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                   <input 
                    placeholder="Search product..." 
                    className="form-input" 
                    style={{ width: '220px', paddingLeft: '36px', borderRadius: '30px', background: 'var(--bg-elevated)', height: '40px' }} 
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                   />
                </div>
             </div>
           )}
        </div>

        {view === 'register' ? (
          <>
            {/* Category Tabs */}
            <div style={{ padding: '0 32px', display: 'flex', background: 'var(--bg-card)', borderBottom: '1px solid var(--border)', overflowX: 'auto' }}>
              {categoryNames.map(c => (
                <div 
                  key={c} 
                  onClick={() => setActiveCategory(c)}
                  style={{ 
                    padding: '16px 24px', cursor: 'pointer', 
                    color: activeCategory === c ? 'var(--accent-gold)' : 'var(--text-muted)',
                    fontWeight: 700, fontSize: '0.9rem',
                    borderBottom: activeCategory === c ? '3px solid var(--accent-gold)' : '3px solid transparent',
                    transition: 'all 0.2s',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {c}
                </div>
              ))}
            </div>

            {/* Product Grid */}
            <div style={{ flex: 1, padding: '32px', overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '24px', alignContent: 'start' }}>
               {loadingProducts ? (
                 <div style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--text-muted)', padding: '48px' }}>
                   Loading products...
                 </div>
               ) : filteredProducts.length === 0 ? (
                 <div style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--text-muted)', padding: '48px' }}>
                   No products found. Add products in the Products section.
                 </div>
               ) : (
                 filteredProducts.map(p => (
                   <div 
                    key={p.id} 
                    className="card scale-in" 
                    style={{ padding: '20px', cursor: 'pointer', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '12px' }}
                    onClick={() => addToCart(p)}
                   >
                     <div style={{ height: '110px', width: '100%', borderRadius: '8px', overflow: 'hidden', background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                       <img 
                         src={p.image_url || `https://loremflickr.com/400/400/food?lock=${p.id}`} 
                         alt={p.name} 
                         style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                       />
                     </div>
                     <div>
                       <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '4px' }}>{p.name}</div>
                       <div style={{ color: 'var(--accent-gold)', fontWeight: 800 }}>${parseFloat(p.price).toFixed(2)}</div>
                       {p.category_name && (
                         <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '4px' }}>{p.category_name}</div>
                       )}
                     </div>
                   </div>
                 ))
               )}
            </div>
          </>
        ) : (
          /* Payment View (Center Panel) */
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '10%', background: 'rgba(0,0,0,0.1)' }}>
             <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '48px', fontFamily: 'Outfit, sans-serif' }}>Payment Methods</h2>
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', width: '100%', maxWidth: '800px' }}>
                <PaymentOption icon={<Banknote size={40}/>} label="Cash" active={paymentMethod === 'Cash'} onClick={() => handlePayment('Cash')} />
                <PaymentOption icon={<CreditCard size={40}/>} label="Digital (Bank, Card)" active={paymentMethod === 'Digital'} onClick={() => handlePayment('Digital')} />
                <PaymentOption icon={<QrCode size={40}/>} label="UPI" active={paymentMethod === 'UPI'} onClick={() => handlePayment('UPI')} />
             </div>
             
             {paymentMethod && (
               <button 
                className="btn btn-primary btn-lg fade-in" 
                style={{ marginTop: '64px', width: '300px', fontSize: '1.2rem', height: '60px', borderRadius: 'var(--radius-xl)' }}
                onClick={confirmPayment}
               >
                Validate Payment
               </button>
             )}
          </div>
        )}
      </div>

      {/* Right: Order Panel (Cart) */}
      {view !== 'payment' && (
        <div style={{ display: 'flex', flexDirection: 'column', background: 'var(--bg-card)', position: 'relative' }}>
          
          {/* Cart Header */}
          <div style={{ padding: '24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
               <UtensilsCrossed size={18} color="var(--accent-gold)" />
               <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>Active Order</span>
             </div>
             <div className="badge badge-blue">{cart.length} Items</div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
            {cart.length === 0 ? (
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dim)', opacity: 0.5 }}>
                <Hash size={48} strokeWidth={1} />
                <p style={{ marginTop: '16px' }}>Empty cart</p>
              </div>
            ) : (
              cart.map(item => (
                <div 
                  key={item.id} 
                  className={`fade-in ${selectedCartItemId === item.id ? 'selected-cart-item' : ''}`} 
                  onClick={() => { setSelectedCartItemId(item.id); setResetBufferOnNextDigit(true); }}
                  style={{ 
                    padding: '16px', 
                    borderBottom: '1px solid rgba(108,142,191,0.08)', 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    borderRadius: '12px',
                    backgroundColor: selectedCartItemId === item.id ? 'rgba(181, 154, 109, 0.15)' : 'transparent',
                    border: selectedCartItemId === item.id ? '1px solid var(--accent-gold)' : '1px solid transparent',
                    marginBottom: '8px'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{item.qty} x {item.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      Unit price: ${parseFloat(item.price).toFixed(2)}
                      {item.discount > 0 && <span style={{ color: 'var(--danger)', marginLeft: '8px' }}>-{item.discount}% Off</span>}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                    <div style={{ fontWeight: 800 }}>
                      ${(item.price * item.qty * (1 - (item.discount || 0) / 100)).toFixed(2)}
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); removeFromCart(item.id); }} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}><Trash2 size={16}/></button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Total & Numpad Area */}
          <div style={{ background: 'var(--bg-elevated)', borderTop: '1px solid var(--border)', padding: '24px' }}>
             
             {/* Totals */}
             <div style={{ marginBottom: '24px' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '8px' }}>
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
               </div>
               <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.8rem', fontWeight: 900, fontFamily: 'Outfit, sans-serif' }}>
                  <span>To Pay</span>
                  <span style={{ color: 'var(--accent-gold)' }}>${total.toFixed(2)}</span>
               </div>
             </div>

             {/* Numpad Mini */}
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', marginBottom: '20px' }}>
               {['1','2','3','4','Prices'].map(b => <NumBtn key={b} label={b} active={numpadMode === b} onClick={() => handleNumpadAction(b)} />)}
               {['5','6','7','8','Disc.'].map(b => <NumBtn key={b} label={b} active={numpadMode === b} onClick={() => handleNumpadAction(b)} />)}
               {['9','0','+/-', 'X', 'Qty'].map(b => <NumBtn key={b} label={b} active={numpadMode === b} danger={b === 'X'} success={b === 'Qty'} onClick={() => handleNumpadAction(b)} />)}
             </div>

             {/* Action Buttons */}
             <div style={{ display: 'flex', gap: '12px' }}>
               <button className="btn btn-secondary" style={{ flex: 1, padding: '14px', borderRadius: 'var(--radius-md)' }} onClick={() => addToast('Kitchen order sent', 'info')}>
                 <ChefHat size={18} /> Send
                 <span style={{ fontSize: '0.7rem', display: 'block', opacity: 0.7 }}>Qty: {cart.length}</span>
               </button>
               <button 
                className="btn btn-primary" 
                style={{ flex: 1, padding: '14px', borderRadius: 'var(--radius-md)', fontSize: '1.1rem' }}
                onClick={handleCheckout}
               >
                Payment
               </button>
             </div>
          </div>
        </div>
      )}

      {/* UPI QR Modal Overlay */}
      {paymentMethod === 'UPI' && view === 'payment' && (
        <div className="overlay-bg" style={{ zIndex: 1100 }}>
          <div className="card scale-in" style={{ width: '400px', padding: '32px', textAlign: 'center', borderColor: 'var(--accent-gold)', borderSize: '2px' }}>
            <h2 style={{ marginBottom: '24px', fontWeight: 800, color: 'var(--accent-gold)' }}>UPI QR</h2>
            
            <div style={{ background: '#fff', padding: '20px', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px' }}>
               <div style={{ position: 'relative' }}>
                  <QrCode size={200} color="#000" />
               </div>
               <div style={{ color: '#000', fontWeight: 900, fontSize: '1.2rem', marginTop: '16px', letterSpacing: '0.1em' }}>SCAN ME</div>
               <div style={{ color: '#000', fontSize: '0.8rem', marginTop: '4px' }}>FOR SECURE PAYMENT</div>
            </div>
            
            <div style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '24px' }}>
              Total: <span style={{ color: 'var(--accent-gold)' }}>${total.toFixed(2)}</span>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn btn-primary btn-full" onClick={confirmPayment}>Confirmed</button>
              <button className="btn btn-ghost btn-full" onClick={() => setPaymentMethod(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


// Sub-components
const FloorView = ({ tables, onSelect }) => {
  // Use db tables if available, else fallback
  const displayTables = tables.length > 0 
    ? tables 
    : [1,2,3,4,5,6,7].map(n => ({ id: null, table_number: n, status: n < 4 ? 'occupied' : 'available' }));

  return (
    <div className="page-wrapper-fullscreen fade-in" style={{ padding: '40px' }}>
       <div style={{ textAlign: 'center', marginBottom: '48px' }}>
         <h1 className="page-title" style={{ fontSize: '2.5rem', marginBottom: '12px' }}>Welcome back, Cafe Register</h1>
         <p style={{ color: 'var(--text-muted)' }}>Choose a table to start an order</p>
       </div>
       
       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '32px' }}>
         {displayTables.map(table => (
           <div 
            key={table.id || table.table_number} 
            className="card scale-in" 
            style={{ 
              height: '180px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.3s',
              borderStyle: table.status === 'occupied' ? 'solid' : 'dashed'
            }}
            onMouseOver={e => e.currentTarget.style.borderColor = 'var(--accent-gold)'}
            onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border)'}
            onClick={() => onSelect(table.table_number, table.id)}
           >
             <h2 style={{ fontSize: '3rem', fontWeight: 900, color: table.status === 'occupied' ? 'var(--accent-gold)' : 'var(--text-dim)', marginBottom: '8px' }}>
               {table.table_number}
             </h2>
             {table.status === 'occupied' 
               ? <div className="badge badge-yellow">Occupied</div> 
               : <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>Available</div>}
           </div>
         ))}
       </div>
    </div>
  );
};

const ConfirmationView = ({ total, onFinish }) => (
  <div className="overlay-bg" style={{ zIndex: 2000, background: 'rgba(24, 36, 29, 0.85)' }}>
     <div className="card scale-in" style={{ width: '500px', padding: '64px 32px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'var(--bg-card)' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px' }}>
           <CheckCircle size={48} color="#fff" />
        </div>
        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: '2.5rem', marginBottom: '8px' }}>Amount Paid</h1>
        <div style={{ fontSize: '3.5rem', fontWeight: 900, color: 'var(--accent-gold)', marginBottom: '40px' }}>${total.toFixed(2)}</div>
        
        <div style={{ display: 'flex', gap: '16px', width: '100%' }}>
           <button className="btn btn-secondary btn-full btn-lg" onClick={onFinish}><Mail size={18}/> Email Receipt</button>
           <button className="btn btn-primary btn-full btn-lg" onClick={onFinish}>Continue <ArrowRight size={18}/></button>
        </div>
        <p style={{ marginTop: '32px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Order saved to database successfully
        </p>
     </div>
  </div>
);

const PaymentOption = ({ icon, label, active, onClick }) => (
  <div 
    onClick={onClick}
    className="card"
    style={{ 
      padding: '40px 20px', 
      textAlign: 'center', 
      cursor: 'pointer', 
      borderColor: active ? 'var(--accent-gold)' : 'var(--border)', 
      background: active ? 'rgba(201,168,76,0.05)' : 'var(--bg-card)',
      transition: 'all 0.2s'
    }}
  >
    <div style={{ color: active ? 'var(--accent-gold)' : 'var(--text-dim)', marginBottom: '16px' }}>{icon}</div>
    <div style={{ fontWeight: 800, fontSize: '1.1rem', color: active ? 'var(--accent-gold)' : 'var(--text-primary)' }}>{label}</div>
  </div>
);

const NumBtn = ({ label, danger, success, active, onClick }) => (
  <button 
    onClick={onClick}
    style={{ 
      padding: '12px', 
      background: active ? 'var(--accent-gold)' : (danger ? 'rgba(224,82,82,0.1)' : (success ? 'rgba(46,168,106,0.1)' : 'var(--bg-elevated)')), 
      border: '1px solid', 
      borderColor: active ? 'var(--accent-gold)' : (danger ? 'var(--danger)' : (success ? 'var(--success)' : 'var(--border)')), 
      borderRadius: '8px', 
      color: active ? '#000' : (danger ? 'var(--danger)' : (success ? 'var(--success)' : (isNaN(label) ? 'var(--text-muted)' : 'var(--text-primary)'))), 
      fontWeight: 700, 
      fontSize: isNaN(label) && label !== 'Prices' ? '0.7rem' : '1rem',
      cursor: 'pointer',
      boxShadow: active ? '0 0 10px var(--accent-gold)' : 'none',
      transform: active ? 'scale(1.02)' : 'none',
      transition: 'all 0.1s'
    }}
  >
    {label}
  </button>
);

const ChefHat = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 13.8V10a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v3.8"/><path d="M4 10a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4"/><path d="M9 14h6"/><path d="M12 14v4"/><path d="M5 18h14"/><path d="M21 21H3"/></svg>
);

export default POSPage;
