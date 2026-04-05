import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import Input from '../common/Input';
import Button from '../common/Button';
import { useNavigate } from 'react-router-dom';

const Login = ({ switchToSignup }) => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@cafe.com');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/pos');
    } catch (err) {
      setError('Invalid credentials. Try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 style={{ marginBottom: '8px' }}>Welcome Back</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Sign in to continue to Odoo POS</p>
      
      {error && <div style={{ color: 'var(--danger)', marginBottom: '16px' }}>{error}</div>}
      
      <Input label="Email Address" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
      <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
      
      <Button type="submit" style={{ width: '100%', marginTop: '16px' }}>Sign In</Button>
      
      <p style={{ marginTop: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        Don't have an account? <span onClick={switchToSignup} style={{ color: 'var(--accent-color)', cursor: 'pointer' }}>Sign up</span>
      </p>
    </form>
  );
};

export default Login;
