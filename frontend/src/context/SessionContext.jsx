import React, { createContext, useContext, useState, useEffect } from 'react';
import { sessionsAPI } from '../api/api';

const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const [currentSession, setCurrentSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshSession = async () => {
    try {
      const res = await sessionsAPI.getActive();
      setCurrentSession(res.data.data.session);
    } catch (err) {
      console.error('Failed to fetch session', err);
    } finally {
      setLoading(false);
    }
  };

  const openSession = async (balance) => {
    const res = await sessionsAPI.open({ opening_balance: balance });
    await refreshSession();
    return res.data;
  };

  const closeSession = async (id, data) => {
    const res = await sessionsAPI.close(id, data);
    setCurrentSession(null);
    return res.data;
  };

  useEffect(() => {
    refreshSession();
  }, []);

  return (
    <SessionContext.Provider value={{ currentSession, loading, openSession, closeSession, refreshSession }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => useContext(SessionContext);
