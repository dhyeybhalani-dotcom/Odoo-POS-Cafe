import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { tablesAPI } from '../../api/api';
import Button from '../../components/common/Button';
import Skeleton from '../../components/common/Skeleton';

const QRPdfPage = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const res = await tablesAPI.getAll();
        setTables(res.data.data.tables || []);
      } catch (err) {
        console.error('Failed to load tables', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTables();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ marginBottom: '8px' }}>QR PDF Generator</h1>
          <p style={{ color: 'var(--text-muted)' }}>Each QR has a unique token identifying the table. Print and place on tables for Mobile Ordering.</p>
        </div>
        <Button onClick={handlePrint} size="lg">Download QR Code →</Button>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '32px' }}>
          {[1,2,3,4].map(i => <Skeleton key={i} variant="card" height="300px" />)}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '32px' }}>
          {tables.map(t => (
            <div key={t.id} className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', backgroundColor: '#fff', color: '#000' }}>
              <QRCodeSVG value={`${window.location.origin}/order?table=${t.table_number}`} size={180} style={{ marginBottom: '24px' }} />
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Table {t.table_number}</h2>
              <div style={{ fontSize: '1rem', color: '#555', marginTop: '8px' }}>Scan to Order</div>
            </div>
          ))}
        </div>
      )}
      
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .card, .card * { visibility: visible; }
          .card { border: 1px solid #ccc; box-shadow: none; break-inside: avoid; }
          @page { size: auto; margin: 20mm; }
        }
      `}</style>
    </div>
  );
};

export default QRPdfPage;
