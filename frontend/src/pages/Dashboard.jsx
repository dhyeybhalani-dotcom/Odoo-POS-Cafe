import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/api';

import Charts from '../components/charts/Charts';
import Button from '../components/common/Button';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      fetchAnalytics();
    }
  }, [user, navigate]);

  const fetchAnalytics = async () => {
    try {
      const res = await api.get('/analytics');
      setAnalytics(res.data);
    } catch (err) {
      console.error('Failed to load analytics', err);
    }
  };

  if (!analytics) return <div style={{ padding: '48px', textAlign: 'center' }}>Loading dashboard...</div>;

  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Cafe Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Welcome back, overview of your cafe performance</p>
        </div>
        <Button onClick={() => navigate('/pos')}>Back to POS</Button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        <div className="glass-panel" style={{ padding: '32px', textAlign: 'center' }}>
          <h3 style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>Total Revenue</h3>
          <p style={{ fontSize: '3rem', color: 'var(--accent-color)', fontWeight: 'bold' }}>
            ${analytics.revenue.toFixed(2)}
          </p>
        </div>
        <div className="glass-panel" style={{ padding: '32px', textAlign: 'center' }}>
          <h3 style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>Total Orders</h3>
          <p style={{ fontSize: '3rem', fontWeight: 'bold' }}>
            {analytics.orders}
          </p>
        </div>
      </div>

      <Charts topProducts={analytics.topProducts} />
    </div>
  );
};

export default Dashboard;
