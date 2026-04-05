import React from 'react';

// A clean shimmer animation for skeleton UI
export default function Skeleton({ width = '100%', height = '20px', borderRadius = '4px', variant = 'row' }) {
  const baseStyle = {
    backgroundColor: '#333',
    backgroundImage: 'linear-gradient(90deg, #333 0px, #3a3a3a 40px, #333 80px)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite linear',
  };

  if (variant === 'card') {
    return (
      <div style={{ ...baseStyle, width, height, borderRadius, padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ width: '60%', height: '16px', backgroundColor: '#444', borderRadius: '4px' }}></div>
        <div style={{ width: '40%', height: '12px', backgroundColor: '#444', borderRadius: '4px' }}></div>
        <div style={{ marginTop: 'auto', width: '30%', height: '24px', backgroundColor: '#444', borderRadius: '4px' }}></div>
        <style>{`
          @keyframes shimmer {
            0%   { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
        `}</style>
      </div>
    );
  }

  if (variant === 'kpi') {
    return (
      <div style={{ ...baseStyle, width, height, borderRadius, padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#444' }}></div>
        <div style={{ width: '80%', height: '16px', backgroundColor: '#444', borderRadius: '4px' }}></div>
        <div style={{ width: '50%', height: '24px', backgroundColor: '#444', borderRadius: '4px' }}></div>
      </div>
    );
  }

  // Default 'row' variant
  return (
    <>
      <div style={{ ...baseStyle, width, height, borderRadius }} />
      <style>{`
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </>
  );
}
