import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  // variants: 'success' | 'error' | 'warning' | 'info'
  const addToast = useCallback((message, variant = 'info', duration = 3000) => {
    const id = Date.now().toString();
    const safeMessage = typeof message === 'string' ? message : 
                        (message instanceof Error ? message.message : JSON.stringify(message));
    setToasts((prev) => [...prev, { id, message: safeMessage, variant }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div 
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          zIndex: 9999
        }}
      >
        {toasts.map((t) => {
          const bgColors = { success: 'var(--success)', error: 'var(--danger)', warning: '#ff9800', info: 'var(--accent)' };
          return (
            <div key={t.id} style={{
              backgroundColor: 'var(--bg-card)',
              borderLeft: `4px solid ${bgColors[t.variant] || bgColors.info}`,
              color: 'var(--text-primary)',
              padding: '14px 20px',
              borderRadius: '6px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.35)',
              display: 'flex', alignItems: 'center', gap: '12px',
              minWidth: '260px', maxWidth: '360px',
              animation: 'slideInRight 0.3s ease-out',
              cursor: 'pointer'
            }} onClick={() => removeToast(t.id)}>
              {t.message}
              <style>{`@keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
