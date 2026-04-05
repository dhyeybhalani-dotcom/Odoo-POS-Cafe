import React from 'react';

const Input = ({ label, type = 'text', value, onChange, error, placeholder, icon, rightElement, ...props }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
      {label && <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{label}</label>}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {icon && <div style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }}>{icon}</div>}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          style={{
            width: '100%',
            padding: `12px 16px 12px ${icon ? '40px' : '16px'}`,
            paddingRight: rightElement ? '40px' : '16px',
            backgroundColor: 'var(--bg-elevated)',
            border: `1px solid ${error ? 'var(--danger)' : 'var(--border)'}`,
            borderRadius: 'var(--radius-sm)',
            color: 'var(--text-primary)',
            fontSize: '1rem',
            outline: 'none',
            transition: 'border-color 0.2s',
          }}
          onFocus={(e) => { if(!error) e.target.style.borderColor = 'var(--accent)' }}
          onBlur={(e) => { if(!error) e.target.style.borderColor = 'var(--border)' }}
          {...props}
        />
        {rightElement && <div style={{ position: 'absolute', right: '12px' }}>{rightElement}</div>}
      </div>
      {error && <span style={{ fontSize: '0.8rem', color: 'var(--danger)' }}>{error}</span>}
    </div>
  );
};

export default Input;
