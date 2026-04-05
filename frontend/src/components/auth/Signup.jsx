import React, { useState } from 'react';
import api from '../../api/api';
import Input from '../common/Input';
import Button from '../common/Button';

const Signup = ({ switchToLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/signup', { email, password });
      setSuccess('Account created! You can now log in.');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create account.');
      setSuccess('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 style={{ marginBottom: '8px' }}>Create Account</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Join Odoo POS to manage your cafe</p>
      
      {error && <div style={{ color: 'var(--danger)', marginBottom: '16px' }}>{error}</div>}
      {success && <div style={{ color: 'var(--success)', marginBottom: '16px' }}>{success}</div>}
      
      <Input label="Email Address" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
      <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
      
      <Button type="submit" style={{ width: '100%', marginTop: '16px' }}>Sign Up</Button>
      
      <p style={{ marginTop: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        Already have an account? <span onClick={switchToLogin} style={{ color: 'var(--accent-color)', cursor: 'pointer' }}>Sign in</span>
      </p>
    </form>
  );
};

export default Signup;
