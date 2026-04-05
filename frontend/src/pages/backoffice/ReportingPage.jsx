import React, { useState } from 'react';
import { 
  Loader,
  RefreshCw
} from 'lucide-react';
import { analyticsAPI } from '../../api/api';
import { useToast } from '../../context/ToastContext';
import { useCallback, useEffect } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart, 
  Pie, 
  Cell
} from 'recharts';

const ReportingPage = () => {
  const { addToast } = useToast();
  const [period, setPeriod] = useState('Today');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    revenue: 0,
    pending: 0,
    orderCount: 0,
    salesOverTime: [],
    categoryShare: [],
    topProducts: [],
    topOrders: [],
    topCategories: []
  });

  const getDates = (p) => {
    const today = new Date();
    const formatDate = (d) => d.toISOString().split('T')[0];
    
    if (p === 'Today') return { from: formatDate(today), to: formatDate(today) };
    
    if (p === 'Weekly') {
      const lastWeek = new Date();
      lastWeek.setDate(today.getDate() - 7);
      return { from: formatDate(lastWeek), to: formatDate(today) };
    }
    
    if (p === 'Monthly') {
      const lastMonth = new Date();
      lastMonth.setMonth(today.getMonth() - 1);
      return { from: formatDate(lastMonth), to: formatDate(today) };
    }
    
    if (p === '365 Days') {
      const lastYear = new Date();
      lastYear.setFullYear(today.getFullYear() - 1);
      return { from: formatDate(lastYear), to: formatDate(today) };
    }
    
    return { from: formatDate(today), to: formatDate(today) };
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const { from, to } = getDates(period);
      const res = await analyticsAPI.getDashboard({ from, to });
      setData(res.data.data);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      const msg = err.response?.data?.message || err.message || 'Failed to load reporting data';
      addToast(`Error: ${msg}`, 'error');
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const salesData = data.salesOverTime || [];
  const categoryData = data.categoryShare || [];
  const topOrders = data.topOrders || [];
  const topProducts = data.topProducts || [];
  const topCategories = data.topCategories || [];

  const avgOrder = data.orderCount > 0 ? (data.revenue / data.orderCount).toFixed(2) : '0';

  return (
    <div className="page-wrapper fade-in">
      
      {/* 1. Header Logic: Breadcrumbs & Chips */}


      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '32px' }}>
         <div style={{ display: 'flex', gap: '16px' }}>
            <button className="btn btn-ghost btn-sm" onClick={fetchData} disabled={loading}>
              <RefreshCw size={14} style={{ animation: loading ? 'spin 1.5s linear infinite' : 'none' }} />
            </button>
         </div>
      </div>

      {loading && data.revenue === 0 ? (
        <div style={{ padding: '100px', textAlign: 'center' }}>
          <Loader size={48} style={{ animation: 'spin 1s linear infinite', color: 'var(--accent-gold)' }} />
          <p style={{ marginTop: '16px', color: 'var(--text-muted)' }}>Analyzing database records...</p>
        </div>
      ) : (
        <>
          {/* 2. Key Metrics Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '40px' }}>
             <MetricCard label="Total order" value={data.orderCount} trend="+10%" desc="Vs previous" up />
             <MetricCard label="Revenue" value={`$${data.revenue.toLocaleString()}`} trend="+20%" desc="Vs previous" up isPrimary />
             <MetricCard label="Average Order" value={`$${avgOrder}`} trend="+5%" desc="Vs previous" up />
          </div>

      {/* 3. Charts Area */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '32px', marginBottom: '40px' }}>
         
         {/* Sales Area Chart */}
         <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '24px' }}>Sales</h3>
            <div style={{ height: '300px', width: '100%' }}>
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={salesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--accent-gold)" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="var(--accent-gold)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="time" stroke="var(--text-dim)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--text-dim)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                    <Tooltip 
                      contentStyle={{ background: '#111', border: '1px solid var(--border)', borderRadius: '8px' }}
                      itemStyle={{ color: 'var(--accent-gold)' }}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="var(--accent-gold)" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Category Pie Chart */}
         <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '24px' }}>Top selling Category</h3>
            <div style={{ display: 'flex', alignItems: 'center', height: '300px' }}>
               <div style={{ flex: 1, height: '100%' }}>
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                 </ResponsiveContainer>
               </div>
               <div style={{ width: '120px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {categoryData.map(c => (
                    <div key={c.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: c.color }} />
                          <span style={{ color: 'var(--text-muted)' }}>{c.name}</span>
                       </div>
                       <span style={{ fontWeight: 700 }}>{c.value}%</span>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </div>

      {/* 4. Top Orders Table */}
      <h3 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '16px', color: 'var(--accent-gold)' }}>Top Orders</h3>
      <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: '40px' }}>
         <table className="data-table" style={{ fontSize: '0.85rem' }}>
            <thead>
               <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <th>Order</th>
                  <th>Sessions</th>
                  <th>Point of Sale</th>
                  <th>Date</th>
                  <th>Customer</th>
                  <th>Employee</th>
                  <th style={{ textAlign: 'right' }}>Total</th>
               </tr>
            </thead>
            <tbody>
               {topOrders.map(o => (
                 <tr key={o.id}>
                    <td style={{ color: 'var(--accent-gold)', fontWeight: 700 }}>{o.id}</td>
                    <td>{o.session}</td>
                    <td>{o.pos}</td>
                    <td style={{ fontWeight: 600 }}>{new Date(o.date).toLocaleDateString()}</td>
                    <td>{o.customer}</td>
                    <td><span className="badge badge-blue">{o.employee}</span></td>
                    <td style={{ textAlign: 'right', fontWeight: 900, color: 'var(--accent-gold)' }}>${parseFloat(o.total || 0).toFixed(2)}</td>
                 </tr>
               ))}
               {topOrders.length === 0 && (
                 <tr>
                   <td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-dim)' }}>No orders found for this period</td>
                 </tr>
               )}
            </tbody>
         </table>
      </div>

      {/* 5. Bottom Grit Analytics */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
         <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 900, marginBottom: '16px' }}>Top Product</h3>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
               <table className="data-table" style={{ fontSize: '0.85rem' }}>
                  <thead>
                     <tr>
                        <th>Product</th>
                        <th>Qty</th>
                        <th style={{ textAlign: 'right' }}>Revenue</th>
                     </tr>
                  </thead>
                  <tbody>
                     {topProducts.map(p => (
                       <tr key={p.name}>
                          <td style={{ fontWeight: 600 }}>{p.name}</td>
                          <td>{p.qty}</td>
                          <td style={{ textAlign: 'right', fontWeight: 700 }}>${p.revenue.toLocaleString()}</td>
                       </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>

         <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 900, marginBottom: '16px' }}>Top Category</h3>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
               <table className="data-table" style={{ fontSize: '0.85rem' }}>
                  <thead>
                     <tr>
                        <th>category</th>
                        <th style={{ textAlign: 'right' }}>Revenue</th>
                     </tr>
                  </thead>
                  <tbody>
                     {topCategories.map(c => (
                       <tr key={c.name}>
                          <td style={{ fontWeight: 600 }}>{c.name}</td>
                          <td style={{ textAlign: 'right', fontWeight: 700 }}>${c.revenue.toLocaleString()}</td>
                       </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      </div>
    </>
    )}
    </div>
  );
};

const MetricCard = ({ label, value, trend, desc, up, isPrimary }) => (
  <div className="card" style={{ 
    padding: '32px', 
    textAlign: 'center', 
    borderTop: isPrimary ? '4px solid var(--accent-gold)' : 'none',
    boxShadow: isPrimary ? '0 10px 40px -10px rgba(201,168,76,0.1)' : 'none'
  }}>
    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>{label}</div>
    <div style={{ fontSize: '2.8rem', fontWeight: 900, fontFamily: 'Outfit, sans-serif', color: isPrimary ? 'var(--accent-gold)' : '#fff', marginBottom: '16px' }}>{value}</div>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
       <span style={{ 
         fontSize: '0.85rem', 
         fontWeight: 800, 
         color: up ? 'var(--success)' : 'var(--danger)',
         display: 'flex',
         alignItems: 'center',
         gap: '2px'
       }}>
         {up ? '↑' : '↓'} {trend}
       </span>
       <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 600 }}>{desc}</span>
    </div>
  </div>
);

export default ReportingPage;
