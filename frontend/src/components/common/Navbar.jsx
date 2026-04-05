import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  ChevronDown, 
  Menu, 
  LayoutGrid, 
  ShoppingBag, 
  PieChart, 
  Settings, 
  LogOut, 
  Coffee,
  Clock,
  ClipboardList,
  Monitor,
  ChefHat,
  Search
} from 'lucide-react';

const Navbar = () => {
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [editingName, setEditingName] = useState(user?.name || '');
  const [profilePic, setProfilePic] = useState(user?.profile_pic || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/login');
  };

  const handleProfileUpdate = async () => {
    try {
      setIsSaving(true);
      await updateProfile({ name: editingName, profile_pic: profilePic });
      setProfileOpen(false);
    } catch (err) {
      console.error('Failed to update profile', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const navLinkStyle = ({ isActive }) => ({
    display: 'flex', 
    alignItems: 'center', 
    gap: '8px',
    padding: '0 16px', 
    height: '60px',
    color: isActive ? 'var(--accent-gold)' : 'var(--text-primary)',
    textDecoration: 'none', 
    fontWeight: '600',
    fontSize: '0.9rem',
    borderBottom: isActive ? '3px solid var(--accent-gold)' : '3px solid transparent',
    transition: 'all 0.2s ease',
  });

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: '60px',
        background: 'var(--bg-card)', borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 24px', zIndex: 1000,
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
      }}>
        {/* Left: Menu & Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', borderRadius: '4px', transition: 'background 0.2s' }}
            onMouseOver={(e) => e.currentTarget.style.background = 'var(--bg-elevated)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'none'}
          >
            <Menu size={20} />
          </button>
          
          <div 
            onClick={() => navigate('/reporting')}
            style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          >
            <img src="/logo.png" alt="Jor Shor Logo" style={{ height: '40px' }} />
          </div>

          <div style={{ height: '30px', width: '1px', background: 'var(--border)', margin: '0 10px' }} />

          {/* Main Links */}
          <div style={{ display: 'flex', height: '60px' }}>
            <NavLink to="/orders" style={navLinkStyle}>Orders</NavLink>
            <NavLink to="/products" style={navLinkStyle}>Products</NavLink>
            <NavLink to="/reporting" style={navLinkStyle}>Reporting</NavLink>
          </div>
        </div>

        {/* Right: Actions & User */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ position: 'relative' }}>
             <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
             <input 
              placeholder="Search..." 
              style={{ padding: '8px 12px 8px 36px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '20px', color: '#fff', fontSize: '0.85rem', width: '180px', outline: 'none' }} 
             />
          </div>

          <div style={{ height: '24px', width: '1px', background: 'var(--border)' }} />

          <div 
            onClick={() => { setProfileOpen(true); setEditingName(user?.name || ''); setProfilePic(user?.profile_pic || ''); }}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
          >
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%',
              background: user?.profile_pic ? `url(${user.profile_pic})` : 'linear-gradient(135deg, var(--accent), #3a4b63)', 
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              fontSize: '0.85rem', fontWeight: 700, color: '#fff',
              border: '1px solid var(--border-gold)'
            }}>
              {!user?.profile_pic && (user?.name?.charAt(0).toUpperCase() || 'A')}
            </div>
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              {user?.name || 'Administrator'}
            </span>
            <ChevronDown size={14} color="var(--text-muted)" />
          </div>
          
          <button 
            onClick={handleLogout}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', background: 'rgba(224,82,82,0.1)', color: 'var(--danger)', border: 'none', borderRadius: '20px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}
          >
            <LogOut size={16} /> Logout / Login
          </button>
        </div>
      </nav>

      {/* Dropdown Menu (Overlay) */}
      {menuOpen && (
        <>
          <div 
            onClick={() => setMenuOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 998 }} 
          />
          <div className="card fade-in" style={{
            position: 'fixed', top: '65px', left: '20px', width: '320px',
            zIndex: 999, padding: '16px', paddingBottom: '24px', boxWeight: 'var(--shadow-lg)',
            borderColor: 'var(--border-gold)', background: 'var(--bg-card)'
          }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '0.05em' }}>
              Applications
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <MenuItem icon={<ShoppingBag size={20}/>} label="Point of Sale" sub="Sell items" to="/pos-settings" onClick={() => setMenuOpen(false)} />
              <MenuItem icon={<Clock size={20}/>} label="Orders" sub="Live feed" to="/orders" onClick={() => setMenuOpen(false)} />
              <MenuItem icon={<LayoutGrid size={20}/>} label="Products" sub="Inventory" to="/products" onClick={() => setMenuOpen(false)} />
              <MenuItem icon={<PieChart size={20}/>} label="Reporting" sub="Analytics" to="/reporting" onClick={() => setMenuOpen(false)} />
              <MenuItem icon={<ChefHat size={20}/>} label="Kitchen" sub="Preparation" to="/kitchen" onClick={() => setMenuOpen(false)} />
              <MenuItem icon={<Monitor size={20}/>} label="Display" sub="Customer view" to="/customer-display" onClick={() => setMenuOpen(false)} />
              <MenuItem icon={<Settings size={20}/>} label="Settings" sub="System config" to="/pos-settings" onClick={() => setMenuOpen(false)} />
              <button 
                 onClick={handleLogout}
                 style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '16px', borderRadius: '12px', background: 'rgba(224,82,82,0.05)', border: '1px solid rgba(224,82,82,0.1)', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}
                 onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(224,82,82,0.1)'; e.currentTarget.style.borderColor = 'var(--danger)'; }}
                 onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(224,82,82,0.05)'; e.currentTarget.style.borderColor = 'rgba(224,82,82,0.1)'; }}
              >
                <div style={{ color: 'var(--danger)' }}><LogOut size={20}/></div>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>Logout</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>End session</div>
                </div>
              </button>
            </div>
          </div>
        </>
      )}
       {/* Profile Details Modal */}
      {profileOpen && (
        <div className="overlay-bg" style={{ zIndex: 2000 }}>
          <div className="card scale-in" style={{ width: '450px', padding: '32px', position: 'relative' }}>
            <button 
              onClick={() => setProfileOpen(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <ChevronDown size={24} style={{ transform: 'rotate(180deg)' }} />
            </button>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '24px', fontFamily: 'Outfit, sans-serif' }}>User Profile</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px' }}>
              <div style={{ position: 'relative', marginBottom: '16px' }}>
                <div style={{
                  width: '100px', height: '100px', borderRadius: '50%',
                  background: profilePic ? `url(${profilePic})` : 'linear-gradient(135deg, var(--accent-gold), #8a6d2b)',
                  backgroundSize: 'cover', backgroundPosition: 'center',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '2.5rem', fontWeight: 800, color: '#fff',
                  border: '3px solid var(--accent-gold)'
                }}>
                  {!profilePic && (editingName?.charAt(0).toUpperCase() || 'A')}
                </div>
                <label style={{
                  position: 'absolute', bottom: '0', right: '0', 
                  background: 'var(--bg-elevated)', border: '1px solid var(--border-gold)',
                  width: '32px', height: '32px', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: 'var(--accent-gold)'
                }}>
                  <Settings size={16} />
                  <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                </label>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Administrator Account</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input 
                  className="form-input" 
                  value={editingName} 
                  onChange={e => setEditingName(e.target.value)} 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input className="form-input" value={user?.email || 'admin@jorshor.com'} disabled style={{ opacity: 0.6 }} />
              </div>
              <div className="form-group">
                <label className="form-label">Role</label>
                <div style={{ padding: '10px 14px', background: 'rgba(201,168,76,0.1)', color: 'var(--accent-gold)', borderRadius: '8px', fontWeight: 700, fontSize: '0.9rem', width: 'fit-content' }}>
                  {user?.role?.toUpperCase() || 'ADMIN'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
              <button 
                className="btn btn-primary btn-full" 
                onClick={handleProfileUpdate}
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
              <button 
                className="btn btn-ghost btn-full" 
                onClick={() => setProfileOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const MenuItem = ({ icon, label, sub, to, onClick }) => (
  <NavLink to={to} onClick={onClick} style={{ textDecoration: 'none' }}>
    <div 
      style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '16px', borderRadius: '12px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', cursor: 'pointer', transition: 'all 0.2s' }}
      onMouseOver={(e) => { e.currentTarget.style.background = 'var(--bg-hover)'; e.currentTarget.style.borderColor = 'var(--accent)'; }}
      onMouseOut={(e) => { e.currentTarget.style.background = 'var(--bg-elevated)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
    >
      <div style={{ color: 'var(--accent-gold)' }}>{icon}</div>
      <div>
        <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>{label}</div>
        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{sub}</div>
      </div>
    </div>
  </NavLink>
);

export default Navbar;
