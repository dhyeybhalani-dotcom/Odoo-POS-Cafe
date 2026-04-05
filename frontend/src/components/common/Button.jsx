import React from 'react';

const Button = ({ label, children, onClick, variant = 'primary', size = 'md', disabled = false, loading = false, style = {}, className = '' }) => {
  
  const baseStyle = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
    border: 'none', borderRadius: 'var(--radius-sm)', cursor: disabled || loading ? 'not-allowed' : 'pointer',
    fontWeight: '500', transition: 'all 0.2s ease', opacity: disabled ? 0.6 : 1, position: 'relative',
    ...style
  };

  const sizes = {
    sm: { padding: '6px 12px', fontSize: '0.875rem' },
    md: { padding: '10px 16px', fontSize: '1rem' },
    lg: { padding: '14px 24px', fontSize: '1.125rem' }
  };

  const variants = {
    primary: { backgroundColor: 'var(--accent)', color: '#fff' },
    gold: { backgroundColor: 'var(--accent-gold)', color: '#fff' },
    danger: { backgroundColor: 'var(--danger)', color: '#fff' },
    ghost: { backgroundColor: 'transparent', border: '1px solid var(--border)', color: 'var(--text-primary)' }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={className}
      style={{ ...baseStyle, ...sizes[size], ...variants[variant] }}
      onMouseOver={(e) => {
        if(!disabled && !loading && variant === 'primary') e.currentTarget.style.backgroundColor = 'var(--accent-hover)';
        if(!disabled && !loading && variant === 'ghost') e.currentTarget.style.backgroundColor = 'var(--bg-elevated)';
      }}
      onMouseOut={(e) => {
        if(!disabled && !loading && variant === 'primary') e.currentTarget.style.backgroundColor = 'var(--accent)';
        if(!disabled && !loading && variant === 'ghost') e.currentTarget.style.backgroundColor = 'transparent';
      }}
    >
      {loading ? <span className="spinner"></span> : null}
      {label || children}
    </button>
  );
};

export default Button;
