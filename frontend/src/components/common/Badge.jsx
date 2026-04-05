import React from 'react';

const VARIANT_COLORS = {
  success: 'var(--success)',
  danger: 'var(--danger)',
  warning: '#ff9800',
  info: '#2196f3',
  default: '#555'
};

const Badge = ({ children, label, color, variant }) => {
  const text = children || label || '';
  
  let badgeColor = color;

  // Use variant if provided
  if (!badgeColor && variant) {
    badgeColor = VARIANT_COLORS[variant] || VARIANT_COLORS.default;
  }

  // Auto-detect from common status labels
  if (!badgeColor) {
    const lower = text.toString().toLowerCase();
    if (lower === 'paid' || lower === 'completed' || lower === 'available') badgeColor = 'var(--success)';
    else if (lower === 'draft' || lower === 'preparing' || lower === 'reserved') badgeColor = '#ff9800';
    else if (lower === 'cancelled' || lower === 'failed' || lower === 'tocook' || lower === 'occupied') badgeColor = 'var(--danger)';
    else if (lower === 'refunded' || lower === 'pending') badgeColor = '#2196f3';
    else badgeColor = '#555';
  }

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '4px 10px',
      borderRadius: '999px',
      fontSize: '0.75rem',
      fontWeight: '600',
      color: '#fff',
      backgroundColor: badgeColor,
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    }}>
      {text}
    </span>
  );
};

export default Badge;
