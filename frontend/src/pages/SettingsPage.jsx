import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  MoreVertical, 
  Settings, 
  Monitor, 
  ChefHat, 
  Calendar, 
  DollarSign, 
  Search,
  CheckCircle2,
  XCircle,
  QrCode,
  CreditCard,
  Banknote
} from 'lucide-react';
import { sessionsAPI, settingsAPI } from '../api/api';
import { useToast } from '../context/ToastContext';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';

const SettingsPage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [terminals, setTerminals] = useState([
    { id: 1, name: 'Odoo Cafe', lastOpen: '01/01/2026', lastSell: '$5000', status: 'closed' }
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTermName, setNewTermName] = useState('');
  
  const [activeConfig, setActiveConfig] = useState(null); // When a terminal's setting is clicked

  // For the Settings configuration view
  const [payments, setPayments] = useState({ cash: true, digital: true, upi: true });
  const [upiId, setUpiId] = useState('cafe@upi');

  const handleCreateTerminal = () => {
    if (!newTermName) return;
    const newTerm = {
      id: Date.now(),
      name: newTermName,
      lastOpen: 'Never',
      lastSell: '$0',
      status: 'closed'
    };
    setTerminals([...terminals, newTerm]);
    setNewTermName('');
    setIsModalOpen(false);
    addToast('New terminal created', 'success');
  };

  if (activeConfig) {
    return (
      <div className="page-wrapper fade-in">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
          <button 
            onClick={() => setActiveConfig(null)}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="page-title">{activeConfig.name} / Settings</h1>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '32px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {/* Payment Methods Section */}
            <section className="card" style={{ padding: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <CreditCard size={20} color="var(--accent-gold)" />
                <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Payment Methods</h2>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <PaymentToggle 
                  icon={<Banknote size={20}/>} 
                  label="Cash" 
                  checked={payments.cash} 
                  onChange={v => setPayments({...payments, cash: v})} 
                />
                <PaymentToggle 
                  icon={<CreditCard size={20}/>} 
                  label="Digital (Bank, Card)" 
                  checked={payments.digital} 
                  onChange={v => setPayments({...payments, digital: v})} 
                />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <PaymentToggle 
                    icon={<QrCode size={20}/>} 
                    label="QR Payment (UPI)" 
                    checked={payments.upi} 
                    onChange={v => setPayments({...payments, upi: v})} 
                  />
                  {payments.upi && (
                    <div style={{ marginLeft: '48px', padding: '16px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border-gold)', animation: 'slideInUp 0.3s ease' }}>
                       <label className="form-label" style={{ marginBottom: '8px', display: 'block' }}>UPI ID for QR Generation</label>
                       <input 
                        className="form-input" 
                        style={{ width: '100%', borderColor: 'var(--border-gold)' }} 
                        value={upiId} 
                        onChange={e => setUpiId(e.target.value)} 
                        placeholder="yourname@upi"
                       />
                       <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                         This ID will be used to generate the dynamic payment QR in the terminal.
                       </p>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Other Config Placeholder */}
            <section className="card" style={{ padding: '32px', opacity: 0.6 }}>
               <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px' }}>Terminal UI Configuration</h2>
               <p style={{ color: 'var(--text-muted)' }}>Additional layout settings for this terminal.</p>
            </section>
          </div>

          {/* Sidebar Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="card" style={{ padding: '24px', position: 'sticky', top: '100px' }}>
              <button 
                className="btn btn-primary btn-full btn-lg" 
                style={{ marginBottom: '16px' }}
                onClick={() => { addToast('Settings saved', 'success'); setActiveConfig(null); }}
              >
                Save Configuration
              </button>
              <button className="btn btn-ghost btn-full" onClick={() => setActiveConfig(null)}>Discard</button>
              
              <div className="divider" />
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                   <div style={{ color: 'var(--accent)' }}><Monitor size={18}/></div>
                   <div>
                     <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>Main Register</div>
                     <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Device: iPad Pro 12.9</div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Point of Sale settings</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Manage your registers and payment routing</p>
        </div>
        <button className="btn btn-primary btn-lg" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> New Terminal
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '24px' }}>
        {terminals.map(t => (
          <div key={t.id} className="card scale-in" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '28px', borderBottom: '1px solid var(--border)', flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                <div>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 700, fontFamily: 'Outfit, sans-serif', marginBottom: '4px' }}>{t.name}</h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: t.status === 'open' ? 'var(--success)' : 'var(--text-dim)' }} />
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{t.status}</span>
                  </div>
                </div>
                <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><MoreVertical size={20} /></button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase' }}>Last Session</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}>
                    <Calendar size={14} color="var(--accent)" />
                    <span>{t.lastOpen}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase' }}>Sales Revenue</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', fontWeight: 700 }}>
                    <DollarSign size={14} color="var(--success)" />
                    <span>{t.lastSell}</span>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ padding: '16px 28px', background: 'var(--bg-elevated)', display: 'flex', gap: '12px' }}>
              <button 
                className="btn btn-primary" 
                style={{ flex: 2, borderRadius: 'var(--radius-md)' }}
                onClick={() => navigate('/pos')}
              >
                Open Session
              </button>
              <button 
                className="btn btn-ghost" 
                style={{ width: '48px', padding: 0, borderRadius: 'var(--radius-md)' }}
                title="Settings"
                onClick={() => setActiveConfig(t)}
              >
                <Settings size={20} />
              </button>
              <button 
                className="btn btn-ghost" 
                style={{ width: '48px', padding: 0, borderRadius: 'var(--radius-md)' }}
                title="Kitchen Display"
                onClick={() => navigate('/kitchen')}
              >
                <ChefHat size={20} />
              </button>
              <button 
                className="btn btn-ghost" 
                style={{ width: '48px', padding: 0, borderRadius: 'var(--radius-md)' }}
                title="Customer Display"
                onClick={() => navigate('/customer-display')}
              >
                <Monitor size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Register">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="form-group">
            <label className="form-label">Register Name</label>
            <input 
              className="form-input" 
              placeholder="e.g. Main Bar, Fast Food Counter" 
              value={newTermName}
              onChange={e => setNewTermName(e.target.value)}
              autoFocus
            />
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Each register can have its own payment configuration and floor plan.
          </p>
          <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
            <button className="btn btn-primary btn-full" onClick={handleCreateTerminal}>Create Terminal</button>
            <button className="btn btn-ghost btn-full" onClick={() => setIsModalOpen(false)}>Discard</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

const PaymentToggle = ({ icon, label, checked, onChange }) => (
  <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', cursor: 'pointer', transition: 'all 0.2s' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <div style={{ color: checked ? 'var(--accent-gold)' : 'var(--text-dim)', transition: 'color 0.2s' }}>{icon}</div>
      <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{label}</span>
    </div>
    <input 
      type="checkbox" 
      checked={checked} 
      onChange={e => onChange(e.target.checked)}
      style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: 'var(--accent-gold)' }}
    />
  </label>
);

const ChevronLeft = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
);

export default SettingsPage;
