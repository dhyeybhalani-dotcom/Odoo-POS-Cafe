import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Layers, 
  Layout, 
  Maximize, 
  Grid,
  Save,
  ChevronRight,
  Move
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import Button from '../../components/common/Button';

const FloorPlanPage = () => {
  const { addToast } = useToast();
  const [floors, setFloors] = useState([
    { id: 1, name: 'Main Floor', tables: [
      { id: 1, name: '1', capacity: 2, x: 100, y: 100, shape: 'square' },
      { id: 2, name: '2', capacity: 4, x: 300, y: 100, shape: 'square' },
      { id: 3, name: '3', capacity: 4, x: 500, y: 100, shape: 'round' },
    ]},
    { id: 2, name: 'Terrace', tables: [] }
  ]);
  const [activeFloorId, setActiveFloorId] = useState(1);
  const activeFloor = floors.find(f => f.id === activeFloorId);

  const addTable = () => {
    const newTable = {
      id: Date.now(),
      name: (activeFloor.tables.length + 1).toString(),
      capacity: 2,
      x: 100 + (activeFloor.tables.length * 50),
      y: 150,
      shape: 'square'
    };
    setFloors(floors.map(f => f.id === activeFloorId ? { ...f, tables: [...f.tables, newTable] } : f));
    addToast('Table added to floor', 'success');
  };

  const deleteTable = (id) => {
    setFloors(floors.map(f => f.id === activeFloorId ? { ...f, tables: f.tables.filter(t => t.id !== id) } : f));
  };

  return (
    <div className="page-wrapper fade-in" style={{ height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Floor Plans</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Design the seating layout for your terminal</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
           <button className="btn btn-secondary" onClick={() => addToast('Not implemented in demo', 'info')}>
             <Plus size={18} /> New Floor
           </button>
           <button className="btn btn-primary" onClick={addTable}>
             <Plus size={18} /> Add Table
           </button>
        </div>
      </div>

      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '260px 1fr', gap: '24px', overflow: 'hidden' }}>
        
        {/* Left: Floor Selector */}
        <div className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
           <h3 style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Floors</h3>
           {floors.map(f => (
             <div 
              key={f.id} 
              onClick={() => setActiveFloorId(f.id)}
              style={{ padding: '12px 16px', borderRadius: '8px', cursor: 'pointer', background: activeFloorId === f.id ? 'rgba(201,168,76,0.1)' : 'transparent', border: '1px solid', borderColor: activeFloorId === f.id ? 'var(--accent-gold)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
             >
               <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                 <Layers size={18} color={activeFloorId === f.id ? 'var(--accent-gold)' : 'var(--text-dim)'} />
                 <span style={{ fontWeight: 600 }}>{f.name}</span>
               </div>
               {activeFloorId === f.id && <div style={{ width: '6px', height: '6px', background: 'var(--accent-gold)', borderRadius: '50%' }} />}
             </div>
           ))}
        </div>

        {/* Right: Floor Grid Editor */}
        <div className="card" style={{ 
          position: 'relative', 
          background: 'var(--bg-elevated)', 
          backgroundImage: 'radial-gradient(rgba(108,142,191,0.1) 1px, transparent 1px)', 
          backgroundSize: '30px 30px',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
           {activeFloor.tables.length === 0 ? (
             <div style={{ textAlign: 'center', color: 'var(--text-dim)' }}>
               <Layout size={48} strokeWidth={1} style={{ marginBottom: '16px' }} />
               <p>No tables on this floor. Click "Add Table" to start.</p>
             </div>
           ) : (
             <div style={{ position: 'relative', width: '100%', height: '100%' }}>
               {activeFloor.tables.map(t => (
                 <div 
                   key={t.id} 
                   className="scale-in"
                   style={{
                    position: 'absolute',
                    left: t.x,
                    top: t.y,
                    width: '80px',
                    height: '80px',
                    background: 'var(--bg-card)',
                    border: '2px solid var(--border)',
                    borderRadius: t.shape === 'round' ? '50%' : '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'grab',
                    boxShadow: 'var(--shadow-md)',
                    transition: 'border-color 0.2s',
                    zIndex: 10
                   }}
                   onMouseOver={e => e.currentTarget.style.borderColor = 'var(--accent-gold)'}
                   onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border)'}
                 >
                   <span style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--accent-gold)' }}>{t.name}</span>
                   <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Cap: {t.capacity}</span>
                   <button 
                    onClick={() => deleteTable(t.id)}
                    style={{ position: 'absolute', top: '-10px', right: '-10px', width: '24px', height: '24px', borderRadius: '50%', background: 'var(--danger)', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                   >
                     <Trash2 size={12} />
                   </button>
                 </div>
               ))}

               {/* Toolbar Bottom */}
               <div className="glass" style={{ position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)', padding: '12px 24px', borderRadius: '40px', display: 'flex', gap: '24px', alignItems: 'center' }}>
                  <ToolbarItem icon={<Move size={18}/>} label="Move" active />
                  <ToolbarItem icon={<Maximize size={18}/>} label="Resize" />
                  <ToolbarItem icon={<Edit3 size={18}/>} label="Rename" />
                  <ToolbarItem icon={<Grid size={18}/>} label="Snap to Grid" />
                  <div style={{ height: '24px', width: '1px', background: 'var(--border)' }} />
                  <button className="btn btn-primary btn-sm" onClick={() => addToast('Floor plan saved', 'success')}>
                    <Save size={14} /> Save Changes
                  </button>
               </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

const ToolbarItem = ({ icon, label, active }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: active ? 'var(--accent-gold)' : 'var(--text-muted)', transition: 'color 0.2s' }}>
    {icon}
    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{label}</span>
  </div>
);

export default FloorPlanPage;
