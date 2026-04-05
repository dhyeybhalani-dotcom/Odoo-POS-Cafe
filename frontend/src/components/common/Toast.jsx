// Not implementing a full context-based Toast system to save files, using a simple local singleton design pattern for simplicity.
import React, { useState, useEffect } from 'react';

let toastCounter = 0;
let addToastFn = null;

export const showToast = (message, type = 'info') => {
  if (addToastFn) addToastFn(message, type);
};

export const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    addToastFn = (message, type) => {
      const id = toastCounter++;
      setToasts(prev => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 3000);
    };
  }, []);

  return (
    <div style={{ position: 'fixed', top: '80px', right: '24px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {toasts.map(toast => {
        const bgColors = { success: 'var(--success)', error: 'var(--danger)', info: 'var(--accent)' };
        return (
          <div key={toast.id} style={{
            backgroundColor: 'var(--bg-card)',
            borderLeft: `4px solid ${bgColors[toast.type] || bgColors.info}`,
            color: 'var(--text-primary)',
            padding: '16px 24px',
            borderRadius: 'var(--radius-sm)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            animation: 'slideInRight 0.3s ease-out'
          }}>
            {toast.message}
          </div>
        );
      })}
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};
