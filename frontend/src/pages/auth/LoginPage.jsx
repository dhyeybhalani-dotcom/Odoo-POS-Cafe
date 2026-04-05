import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Eye, EyeOff, LogIn } from 'lucide-react';

const LoginPage = () => {
  const { login, googleLogin } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { 
      addToast('Please fill in all fields', 'error'); 
      return; 
    }
    setLoading(true);
    try {
      await login(form.email, form.password);
      addToast('Logged in successfully', 'success');
      navigate('/pos');
    } catch (err) {
      addToast(err?.message || 'Login failed', 'error');
    } finally { setLoading(false); }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-primary)', padding: '24px',
      backgroundImage: 'radial-gradient(ellipse at 50% 0%, rgba(201,168,76,0.08) 0%, transparent 60%)'
    }}>
      <div className="card fade-in" style={{ width: '100%', maxWidth: '420px', padding: '40px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <img src="/logo.png" alt="Jor Shor Logo" style={{ height: '64px', marginBottom: '16px' }} />
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.8rem', fontWeight: 700, marginBottom: '4px' }}>Welcome Back</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Sign in to continue to POS Terminal</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="form-group">
            <label className="form-label">Email / Username</label>
            <input 
              className="form-input" 
              type="text" 
              placeholder="admin@jorshor.com"
              value={form.email} 
              onChange={e => setForm({...form, email: e.target.value})} 
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input 
                className="form-input" 
                type={showPwd ? 'text' : 'password'} 
                placeholder="Enter your password"
                style={{ width: '100%', paddingRight: '44px' }}
                value={form.password} 
                onChange={e => setForm({...form, password: e.target.value})} 
              />
              <button 
                type="button" 
                onClick={() => setShowPwd(!showPwd)}
                style={{ position:'absolute', right:'12px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:'var(--text-muted)', cursor:'pointer', display:'flex' }}
              >
                {showPwd ? <EyeOff size={18}/> : <Eye size={18}/>}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading} style={{ marginTop: '8px' }}>
            {loading ? 'Logging in...' : <><LogIn size={18} /> Sign In</>}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '24px 0' }}>
           <div className="divider" style={{ flex: 1, margin: 0 }} />
           <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 600 }}>OR</span>
           <div className="divider" style={{ flex: 1, margin: 0 }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <GoogleLogin 
            onSuccess={(response) => {
              googleLogin(response.credential);
              addToast('Logged in with Google successfully', 'success');
              navigate('/pos');
            }}
            onError={() => addToast('Google Login Failed', 'error')}
            useOneTap
          />
        </div>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <Link to="/signup" style={{ color: 'var(--accent-gold)', fontWeight: 600, textDecoration: 'none' }}>
            Sign Up
          </Link>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
