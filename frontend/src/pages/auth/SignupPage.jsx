import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Eye, EyeOff, UserPlus } from 'lucide-react';

const SignupPage = () => {
  const { signup } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) { 
      addToast('Please fill in all fields', 'error'); 
      return; 
    }
    setLoading(true);
    try {
      await signup(form.name, form.email, form.password);
      addToast('Account created successfully', 'success');
      navigate('/pos');
    } catch (err) {
      addToast(err?.message || 'Signup failed', 'error');
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
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.8rem', fontWeight: 700, marginBottom: '4px' }}>Create Account</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Join the Jor Shor POS platform</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input 
              className="form-input" 
              type="text" 
              placeholder="e.g. John Doe"
              value={form.name} 
              onChange={e => setForm({...form, name: e.target.value})} 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email / Username</label>
            <input 
              className="form-input" 
              type="text" 
              placeholder="you@email.com"
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
                placeholder="Secure password"
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
            {loading ? 'Creating...' : <><UserPlus size={18} /> Sign Up</>}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent-gold)', fontWeight: 600, textDecoration: 'none' }}>
            Log in
          </Link>
        </div>

      </div>
    </div>
  );
};

export default SignupPage;
