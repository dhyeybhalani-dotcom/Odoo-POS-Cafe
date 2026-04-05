import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  FileText, 
  CreditCard, 
  Users, 
  Calendar, 
  ChevronRight,
  MoreVertical,
  Download,
  Printer,
  RefreshCw,
  Banknote,
  QrCode,
  Loader
} from 'lucide-react';
import { ordersAPI, paymentsAPI, customersAPI } from '../../api/api';
import { useToast } from '../../context/ToastContext';
import Modal from '../../components/common/Modal';

const OrdersPage = () => {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('Orders');
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailTab, setDetailTab] = useState('Product');
  const [activePaymentOrder, setActivePaymentOrder] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [showQR, setShowQR] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', email: '', phone: '', city: '' });
  const [savingMember, setSavingMember] = useState(false);
  
  // Data State — from backend
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [payments, setPayments] = useState([]);

  // ── Fetch from backend ──────────────────────────────
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter !== 'All') params.status = statusFilter.toLowerCase();
      const res = await ordersAPI.getAll(params);
      setOrders(res.data.data.orders || []);
    } catch (err) {
      addToast('Failed to load orders', 'error');
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  const fetchCustomers = useCallback(async () => {
    try {
      const res = await customersAPI.getAll();
      setCustomers(res.data.data.customers || []);
    } catch (err) {
      addToast('Failed to load customers', 'error');
    }
  }, []);

  const fetchPayments = useCallback(async () => {
    try {
      const res = await paymentsAPI.getAll();
      setPayments(res.data.data.payments || []);
    } catch (err) {
      addToast('Failed to load payments', 'error');
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    if (activeTab === 'Customers') fetchCustomers();
    if (activeTab === 'Payments') fetchPayments();
  }, [activeTab]);

  // ── Handlers ─────────────────────────────────────────
  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await ordersAPI.updateStatus(orderId, status);
      await fetchOrders();
      addToast(`Order status updated to ${status}`, 'success');
    } catch (err) {
      addToast('Failed to update order status', 'error');
    }
  };

  const handlePaymentSuccess = async (methodName) => {
    if (!activePaymentOrder) return;
    try {
      // Create a payment record
      await paymentsAPI.create({
        order_id: activePaymentOrder.id,
        method: methodName === 'UPI QR' ? 'UPI' : methodName,
        amount: activePaymentOrder.total,
        status: 'completed'
      });
      // Mark order as paid
      await ordersAPI.updateStatus(activePaymentOrder.id, 'paid');
      await fetchOrders();
      if (activeTab === 'Payments') await fetchPayments();

      setTimeout(() => {
        setActivePaymentOrder(null);
        setPaymentMethod(null);
        setShowQR(false);
        addToast('Payment successfully recorded', 'success');
      }, 500);
    } catch (err) {
      addToast('Failed to record payment', 'error');
    }
  };

  const handleAddMember = async () => {
    if (!newMember.name) return addToast('Please enter a name', 'error');
    try {
      setSavingMember(true);
      await customersAPI.create(newMember);
      await fetchCustomers();
      setNewMember({ name: '', email: '', phone: '', city: '' });
      setIsAddMemberModalOpen(false);
      addToast('New member added successfully', 'success');
    } catch (err) {
      addToast('Failed to add member', 'error');
    } finally {
      setSavingMember(false);
    }
  };

  const getStatusBadge = (order) => {
    const { status } = order;
    if (status === 'paid') return <span className="badge badge-green">Paid</span>;
    if (status === 'draft') return (
      <span 
        className="badge badge-yellow" 
        style={{ cursor: 'pointer', border: '1px solid var(--accent-gold)' }}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedOrder(order);
        }}
      >
        Draft
      </span>
    );
    if (status === 'cancelled') return <span className="badge badge-red">Cancelled</span>;
    return <span className="badge badge-blue">{status}</span>;
  };

  const filteredOrders = orders.filter(o => {
    const searchMatch = (
      (o.order_number || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.customer_name || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
    return searchMatch;
  });

  const filteredCustomers = customers.filter(c =>
    (c.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.phone || '').includes(searchQuery)
  );

  return (
    <div className="page-wrapper fade-in">
      <div className="page-header" style={{ marginBottom: '20px' }}>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '24px', borderBottom: '1px solid var(--border)', marginBottom: '32px' }}>
        <TabItem icon={<FileText size={18}/>} label="Orders" active={activeTab === 'Orders'} onClick={() => setActiveTab('Orders')} />
        <TabItem icon={<CreditCard size={18}/>} label="Payments" active={activeTab === 'Payments'} onClick={() => setActiveTab('Payments')} />
        <TabItem icon={<Users size={18}/>} label="Customers" active={activeTab === 'Customers'} onClick={() => setActiveTab('Customers')} />
      </div>

      {/* Content */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        
        {/* Table Header / Filters */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)' }}>
           <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                <input 
                  placeholder={`Search ${activeTab.toLowerCase()}...`} 
                  className="form-input" 
                  style={{ width: '260px', paddingLeft: '36px', height: '38px', fontSize: '0.85rem' }} 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              {activeTab === 'Orders' && (
                <button 
                  className="btn btn-ghost btn-sm"
                  onClick={() => {
                    const nextStatus = statusFilter === 'All' ? 'paid' : (statusFilter === 'paid' ? 'draft' : 'All');
                    setStatusFilter(nextStatus);
                  }}
                >
                  <Filter size={14}/> {statusFilter === 'All' ? 'All Status' : statusFilter}
                </button>
              )}
              {activeTab === 'Customers' && (
                <button 
                  className="btn btn-primary btn-sm" 
                  style={{ gap: '8px' }}
                  onClick={() => setIsAddMemberModalOpen(true)}
                >
                  <Plus size={16}/> Add Member
                </button>
              )}
           </div>
           <button className="btn btn-ghost btn-sm" onClick={() => { 
             setSearchQuery(''); 
             setStatusFilter('All');
             fetchOrders();
             addToast('Refreshed', 'success'); 
           }}>
             <RefreshCw size={14}/>
           </button>
        </div>

        {/* Orders Tab */}
        {activeTab === 'Orders' && (
          loading ? (
            <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <Loader size={24} style={{ animation: 'spin 1s linear infinite' }} />
              <p style={{ marginTop: '12px' }}>Loading orders...</p>
            </div>
          ) : (
            <table className="data-table fade-in">
              <thead>
                <tr>
                  <th>Order Number</th>
                  <th>Customer</th>
                  <th>Table</th>
                  <th>Total Amount</th>
                  <th>Status</th>
                  <th>Created Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '32px' }}>
                      No orders found.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map(o => (
                    <tr key={o.id}>
                      <td style={{ fontWeight: 700, color: 'var(--accent-gold)' }}>{o.order_number}</td>
                      <td>{o.customer_name || 'Walking Customer'}</td>
                      <td><span className="badge badge-blue">Table {o.table_number || '-'}</span></td>
                      <td style={{ fontWeight: 800 }}>${parseFloat(o.total || 0).toFixed(2)}</td>
                      <td>{getStatusBadge(o)}</td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        {new Date(o.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )
        )}

        {/* Payments Tab */}
        {activeTab === 'Payments' && (
          <div className="fade-in">
            {payments.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', borderBottom: '1px solid var(--border)' }}>
                {['Cash', 'Digital', 'UPI'].map(method => {
                  const methodPayments = payments.filter(p => p.method === method && p.status === 'completed');
                  const total = methodPayments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
                  return (
                    <div key={method} style={{ padding: '32px', textAlign: 'center', background: 'rgba(255,255,255,0.01)' }}>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>{method}</div>
                      <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--accent-gold)' }}>${total.toFixed(2)}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px' }}>{methodPayments.length} transactions</div>
                    </div>
                  );
                })}
              </div>
            )}
            <table className="data-table">
              <thead>
                <tr>
                  <th>Payment ID</th>
                  <th>Order Reference</th>
                  <th>Payment Mode</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '32px' }}>
                      No payment records found.
                    </td>
                  </tr>
                ) : (
                  payments.map(p => (
                    <tr key={p.id}>
                      <td style={{ color: 'var(--text-dim)' }}>#{p.id}</td>
                      <td style={{ fontWeight: 600 }}>Order #{p.order_id}</td>
                      <td><span className="badge badge-blue">{p.method}</span></td>
                      <td style={{ fontWeight: 800, color: p.status === 'completed' ? 'var(--success)' : 'var(--text-primary)' }}>
                        ${parseFloat(p.amount || 0).toFixed(2)}
                      </td>
                      <td>
                        {p.status === 'completed' 
                          ? <span className="badge badge-green">Completed</span>
                          : <span className="badge badge-yellow">Pending</span>
                        }
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        {new Date(p.paid_at).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Customers Tab */}
        {activeTab === 'Customers' && (
          loading ? (
            <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <Loader size={24} />
              <p style={{ marginTop: '12px' }}>Loading customers...</p>
            </div>
          ) : (
            <table className="data-table fade-in">
              <thead>
                <tr>
                  <th>Customer Name</th>
                  <th>Contact Info</th>
                  <th>City</th>
                  <th>Total Sales</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '32px' }}>
                      No customers found. Click "Add Member" to add one.
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map(c => (
                    <tr key={c.id}>
                      <td style={{ fontWeight: 700 }}>{c.name}</td>
                      <td>
                        <div style={{ fontSize: '0.85rem' }}>{c.email || '--'}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.phone || '--'}</div>
                      </td>
                      <td>{c.city || '--'}</td>
                      <td style={{ fontWeight: 800, color: 'var(--accent-gold)' }}>
                        ${parseFloat(c.total_sales || 0).toFixed(2)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )
        )}
      </div>

      {/* Order Detail Modal */}
      <Modal 
        isOpen={!!selectedOrder} 
        onClose={() => setSelectedOrder(null)} 
        title="Order Details" 
        size="lg"
      >
        {selectedOrder && (
          <div className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 40px' }}>
                  <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '4px' }}>Order number</div>
                    <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{selectedOrder.order_number}</div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '4px' }}>Date</div>
                    <div style={{ fontWeight: 600 }}>{new Date(selectedOrder.created_at).toLocaleString()}</div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '4px' }}>Customer</div>
                    <div style={{ fontWeight: 600 }}>{selectedOrder.customer_name || 'Walking Customer'}</div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '4px' }}>Total</div>
                    <div style={{ fontWeight: 700, color: 'var(--accent-gold)', fontSize: '1.1rem' }}>
                      ${parseFloat(selectedOrder.total || 0).toFixed(2)}
                    </div>
                  </div>
               </div>
               <div style={{ display: 'flex', gap: '8px' }}>
                  <span className="badge badge-yellow">Draft</span>
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      setActivePaymentOrder(selectedOrder);
                      setSelectedOrder(null);
                    }}
                  >
                    Process Payment
                  </button>
               </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Payment Selection Modal */}
      <Modal 
        isOpen={!!activePaymentOrder} 
        onClose={() => setActivePaymentOrder(null)} 
        title="Payment Methods" 
        size="lg"
      >
        {activePaymentOrder && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '16px', fontFamily: 'Outfit, sans-serif' }}>Select Method</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '40px' }}>
              Order #{activePaymentOrder.order_number || activePaymentOrder.id} — Total: <strong style={{ color: 'var(--accent-gold)' }}>${parseFloat(activePaymentOrder.total || 0).toFixed(2)}</strong>
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '48px' }}>
              <PaymentChoice 
                icon={<Banknote size={40}/>} 
                label="Cash" 
                active={paymentMethod === 'Cash'} 
                onClick={() => setPaymentMethod('Cash')} 
              />
              <PaymentChoice 
                icon={<CreditCard size={40}/>} 
                label="Digital (Bank, Card)" 
                active={paymentMethod === 'Digital'} 
                onClick={() => setPaymentMethod('Digital')} 
              />
              <PaymentChoice 
                icon={<QrCode size={40}/>} 
                label="UPI" 
                active={paymentMethod === 'UPI'} 
                onClick={() => setPaymentMethod('UPI')} 
              />
            </div>

            {paymentMethod && (
              <button 
                className="btn btn-primary btn-lg fade-in" 
                style={{ width: '100%', maxWidth: '300px', fontSize: '1.1rem', height: '56px', borderRadius: '12px' }}
                onClick={() => {
                  if (paymentMethod === 'UPI') {
                    setShowQR(true);
                  } else {
                    handlePaymentSuccess(paymentMethod);
                  }
                }}
              >
                Validate Payment
              </button>
            )}
          </div>
        )}
      </Modal>

      {/* UPI QR Modal */}
      <Modal 
        isOpen={showQR} 
        onClose={() => setShowQR(false)} 
        title="UPI QR Code"
      >
        <div style={{ textAlign: 'center', padding: '10px' }}>
          <div style={{ background: '#fff', padding: '20px', borderRadius: '16px', display: 'inline-block', marginBottom: '24px' }}>
            <div style={{ color: '#000', fontWeight: 900, marginBottom: '12px' }}>Jor Shor POS</div>
            <div style={{ width: '200px', height: '200px', border: '10px solid #000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <QrCode size={160} color="#000" />
            </div>
            <div style={{ color: '#000', fontWeight: 900, fontSize: '1rem', marginTop: '16px' }}>SCAN TO PAY</div>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '24px' }}>
            Amount: <span style={{ color: 'var(--accent-gold)' }}>${parseFloat(activePaymentOrder?.total || 0).toFixed(2)}</span>
          </div>
          <button className="btn btn-primary btn-full" onClick={() => handlePaymentSuccess('UPI')}>
            Confirm & Complete
          </button>
        </div>
      </Modal>

      {/* Add Member Modal */}
      <Modal 
        isOpen={isAddMemberModalOpen} 
        onClose={() => setIsAddMemberModalOpen(false)} 
        title="Add New Member"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Full Name</label>
            <input 
              className="form-input" 
              placeholder="e.g. Jane Smith" 
              value={newMember.name}
              onChange={e => setNewMember({ ...newMember, name: e.target.value })}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Email</label>
              <input 
                className="form-input" 
                placeholder="jane@example.com" 
                value={newMember.email}
                onChange={e => setNewMember({ ...newMember, email: e.target.value })}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Phone</label>
              <input 
                className="form-input" 
                placeholder="+91 98XXX XXXX" 
                value={newMember.phone}
                onChange={e => setNewMember({ ...newMember, phone: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>City</label>
            <input 
              className="form-input" 
              placeholder="e.g. Ahmedabad" 
              value={newMember.city}
              onChange={e => setNewMember({ ...newMember, city: e.target.value })}
            />
          </div>
          <button 
            className="btn btn-primary btn-full btn-lg" 
            style={{ marginTop: '12px' }}
            disabled={savingMember}
            onClick={handleAddMember}
          >
            {savingMember ? 'Saving...' : 'Save Member'}
          </button>
        </div>
      </Modal>

    </div>
  );
};

const PaymentChoice = ({ icon, label, active, onClick }) => (
  <div 
    onClick={onClick}
    className="card"
    style={{ 
      padding: '32px 20px', 
      textAlign: 'center', 
      cursor: 'pointer', 
      borderColor: active ? 'var(--accent-gold)' : 'var(--border)', 
      background: active ? 'rgba(201,168,76,0.05)' : 'var(--bg-card)',
      transition: 'all 0.2s',
      transform: active ? 'scale(1.05)' : 'scale(1)'
    }}
  >
    <div style={{ color: active ? 'var(--accent-gold)' : 'var(--text-dim)', marginBottom: '12px' }}>{icon}</div>
    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: active ? 'var(--accent-gold)' : 'var(--text-primary)' }}>{label}</div>
  </div>
);

const TabItem = ({ icon, label, active, onClick }) => (
  <div 
    onClick={onClick}
    style={{ 
      display: 'flex', alignItems: 'center', gap: '10px', padding: '16px 0', 
      cursor: 'pointer', color: active ? 'var(--accent-gold)' : 'var(--text-muted)',
      fontWeight: 700, fontSize: '0.95rem',
      borderBottom: active ? '3px solid var(--accent-gold)' : '3px solid transparent',
      transition: 'all 0.2s',
      marginBottom: '-1px'
    }}
  >
    {icon}
    {label}
  </div>
);

const Plus = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
);

export default OrdersPage;
