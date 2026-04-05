import React, { useState } from 'react';
import { 
  ChefHat, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  Filter,
  Monitor,
  Printer,
  ChevronRight,
  User,
  Coffee,
  MoreVertical
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const KitchenPage = () => {
  const { addToast } = useToast();
  const [filter, setFilter] = useState('To Cook');
  
  const [orders, setOrders] = useState([
    { id: 1, number: 'ORD-001', table: '3', items: [
      { name: 'Cheese Burger', qty: 1, note: 'No onions' },
      { name: 'Coffee', qty: 2, note: 'Extra hot' }
    ], time: '12 mins ago', status: 'To Cook' },
    { id: 2, number: 'ORD-002', table: '1', items: [
      { name: 'Pepperoni Pizza', qty: 1, note: '' }
    ], time: '5 mins ago', status: 'Preparing' },
    { id: 3, number: 'ORD-003', table: '5', items: [
      { name: 'Water', qty: 1, note: '' }
    ], time: '1 min ago', status: 'To Cook' },
  ]);

  const stats = {
    'To Cook': orders.filter(o => o.status === 'To Cook').length,
    'Preparing': orders.filter(o => o.status === 'Preparing').length,
    'Ready': orders.filter(o => o.status === 'Ready').length,
  };

  const advanceStatus = (id) => {
    setOrders(orders.map(o => {
      if (o.id !== id) return o;
      if (o.status === 'To Cook') return { ...o, status: 'Preparing' };
      if (o.status === 'Preparing') return { ...o, status: 'Ready' };
      return o;
    }));
    addToast('Order status updated', 'success');
  };

  return (
    <div className="page-wrapper-fullscreen fade-in" style={{ padding: '24px 32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '8px', background: 'var(--accent-gold)', borderRadius: '10px' }}>
             <ChefHat size={24} color="#0f1923" />
          </div>
          <h1 className="page-title">Kitchen Display System</h1>
        </div>
        
        {/* Status Filter Tabs */}
        <div style={{ display: 'flex', gap: '8px', background: 'var(--bg-elevated)', padding: '6px', borderRadius: '40px' }}>
           {['To Cook', 'Preparing', 'Ready'].map(s => (
             <button 
              key={s} 
              onClick={() => setFilter(s)}
              style={{ padding: '10px 24px', borderRadius: '30px', border: 'none', background: filter === s ? 'var(--accent-gold)' : 'transparent', color: filter === s ? '#0f1923' : 'var(--text-muted)', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', display: 'flex', gap: '8px', alignItems: 'center' }}
             >
                {s} <span style={{ fontSize: '0.8rem', opacity: 0.8, letterSpacing: '0.05em' }}>{stats[s]}</span>
             </button>
           ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px', padding: '10px', alignContent: 'start' }}>
        {orders.filter(o => o.status === filter).map(o => (
          <div key={o.id} className="card scale-in" style={{ padding: 0, overflow: 'hidden', borderLeft: `6px solid ${filter==='To Cook' ? 'var(--danger)' : (filter==='Preparing' ? 'var(--accent-gold)' : 'var(--success)')}` }}>
             
             <div style={{ padding: '24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                   <h2 style={{ fontSize: '1.4rem', fontWeight: 900, fontFamily: 'Outfit' }}>{o.number}</h2>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>
                      <Monitor size={14}/> Table {o.table}
                   </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--danger)', fontWeight: 700, fontSize: '0.85rem' }}>
                   <Clock size={16}/> {o.time}
                </div>
             </div>

             <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {o.items.map((it, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '16px' }}>
                     <div style={{ width: '32px', height: '32px', borderRadius: '4px', background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1rem', color: 'var(--accent-gold)' }}>
                       {it.qty}
                     </div>
                     <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{it.name}</div>
                        {it.note && <div style={{ fontSize: '0.85rem', color: 'var(--accent-gold)', marginTop: '4px', fontWeight: 600 }}>Note: {it.note}</div>}
                     </div>
                  </div>
                ))}
             </div>

             <div style={{ padding: '20px 24px', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid var(--border)', display: 'flex', gap: '12px' }}>
                <button 
                  className="btn btn-primary btn-full" 
                  onClick={() => advanceStatus(o.id)}
                  style={{ borderRadius: 'var(--radius-sm)', background: filter === 'To Cook' ? '#ee8e44' : 'var(--success)', height: '48px', fontWeight: 800 }}
                >
                  {filter === 'To Cook' ? 'Start Cooking' : (filter === 'Preparing' ? 'Ready for Pickup' : 'Done')}
                  <ChevronRight size={18} />
                </button>
                <button className="btn btn-ghost" style={{ width: '56px', padding: 0 }}><Printer size={18}/></button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KitchenPage;
