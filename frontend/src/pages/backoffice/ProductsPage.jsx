import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  RefreshCw,
  Package,
  Layers,
  Archive,
  Trash,
  Loader
} from 'lucide-react';
import { productsAPI, categoriesAPI } from '../../api/api';
import { useToast } from '../../context/ToastContext';
import Modal from '../../components/common/Modal';

const ProductsPage = () => {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('Products');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [prodTab, setProdTab] = useState('General');
  const [newProduct, setNewProduct] = useState({ name: '', price: '25', tax: '5', uom: 'Unit', category_id: '', description: '' });
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [newCategoryData, setNewCategoryData] = useState({ name: '', color: '#3498db' });
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Data State — now from backend
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  // ── Fetch from backend ──────────────────────────────
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await productsAPI.getAll({ archived: 'false' });
      setProducts(res.data.data.products || []);
    } catch (err) {
      addToast('Failed to load products', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await categoriesAPI.getAll();
      setCategories(res.data.data.categories || []);
    } catch (err) {
      addToast('Failed to load categories', 'error');
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  // ── Handlers ─────────────────────────────────────────
  const handleCreateProduct = async () => {
    if (!newProduct.name) return addToast('Product name is required', 'error');
    try {
      setSaving(true);
      await productsAPI.create({
        name: newProduct.name,
        description: newProduct.description || '',
        price: parseFloat(newProduct.price) || 0,
        tax: parseFloat(newProduct.tax) || 5,
        uom: newProduct.uom,
        category_id: newProduct.category_id || null,
        stock: 100,
      });
      await fetchProducts();
      setIsAddProductModalOpen(false);
      setNewProduct({ name: '', price: '25', tax: '5', uom: 'Unit', category_id: '', description: '' });
      addToast('Product created successfully', 'success');
    } catch (err) {
      addToast(err?.message || 'Failed to create product', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await productsAPI.delete(id);
      await fetchProducts();
      setSelectedProducts(prev => prev.filter(sid => sid !== id));
      addToast('Product deleted', 'success');
    } catch (err) {
      addToast('Failed to delete product', 'error');
    }
  };

  const handleArchiveSelected = async () => {
    try {
      await Promise.all(selectedProducts.map(id => productsAPI.archive(id)));
      await fetchProducts();
      setSelectedProducts([]);
      addToast(`${selectedProducts.length} product(s) archived`, 'success');
    } catch (err) {
      addToast('Failed to archive products', 'error');
    }
  };

  const handleDeleteSelected = async () => {
    try {
      await Promise.all(selectedProducts.map(id => productsAPI.delete(id)));
      await fetchProducts();
      setSelectedProducts([]);
      addToast(`${selectedProducts.length} product(s) deleted`, 'success');
    } catch (err) {
      addToast('Failed to delete products', 'error');
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategoryData.name) return addToast('Category name is required', 'error');
    try {
      setSaving(true);
      await categoriesAPI.create(newCategoryData);
      await fetchCategories();
      setNewCategoryData({ name: '', color: '#3498db' });
      setIsAddCategoryModalOpen(false);
      addToast('Category created successfully', 'success');
    } catch (err) {
      addToast('Failed to create category', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateCategoryColor = async (cat, color) => {
    try {
      await categoriesAPI.update(cat.id, { name: cat.name, color, sequence: cat.sequence || 0 });
      await fetchCategories();
      addToast(`Color updated for ${cat.name}`, 'success');
    } catch (err) {
      addToast('Failed to update color', 'error');
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await categoriesAPI.delete(id);
      await fetchCategories();
      addToast('Category deleted', 'success');
    } catch (err) {
      addToast('Failed to delete category', 'error');
    }
  };

  const filteredProducts = products.filter(p =>
    !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="page-wrapper fade-in">
      <div className="page-header" style={{ marginBottom: '20px' }}>
        <h1 className="page-title">Product Management</h1>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '24px', borderBottom: '1px solid var(--border)', marginBottom: '32px' }}>
        <TabItem icon={<Package size={18}/>} label="Products" active={activeTab === 'Products'} onClick={() => setActiveTab('Products')} />
        <TabItem icon={<Layers size={18}/>} label="Categories" active={activeTab === 'Categories'} onClick={() => setActiveTab('Categories')} />
      </div>

      {/* Content */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        
        {/* Table Header / Filters */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)' }}>
           <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                <input 
                  placeholder={`Search ${activeTab.toLowerCase()}...`} 
                  className="form-input" 
                  style={{ width: '260px', paddingLeft: '36px', height: '38px', fontSize: '0.85rem' }} 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              {activeTab === 'Products' && (
                <button 
                  className="btn btn-primary btn-sm" 
                  style={{ gap: '8px' }}
                  onClick={() => setIsAddProductModalOpen(true)}
                >
                  <PlusCustom size={16}/> New Product
                </button>
              )}
           </div>
           {activeTab === 'Products' && selectedProducts.length > 0 && (
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                 <span style={{ fontSize: '0.8rem', color: 'var(--accent-gold)' }}>{selectedProducts.length} Selected</span>
                 <button className="btn btn-ghost btn-sm" style={{ gap: '6px' }} onClick={handleArchiveSelected}><Archive size={14}/> Archive</button>
                 <button className="btn btn-ghost btn-sm" style={{ gap: '6px', color: 'var(--danger)' }} onClick={handleDeleteSelected}><Trash size={14}/> Delete</button>
              </div>
           )}
           <button className="btn btn-ghost btn-sm" onClick={() => { fetchProducts(); fetchCategories(); setSearchQuery(''); addToast('Data refreshed', 'success'); }}><RefreshCw size={14}/></button>
        </div>

        {activeTab === 'Products' && (
          loading ? (
            <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <Loader size={24} style={{ animation: 'spin 1s linear infinite' }} />
              <p style={{ marginTop: '12px' }}>Loading products...</p>
            </div>
          ) : (
            <table className="data-table fade-in">
              <thead>
                <tr>
                  <th style={{ width: '40px' }}>
                    <input 
                      type="checkbox" 
                      onChange={(e) => setSelectedProducts(e.target.checked ? products.map(p => p.id) : [])} 
                      checked={products.length > 0 && selectedProducts.length === products.length}
                    />
                  </th>
                  <th>Product</th>
                  <th>Sale Price</th>
                  <th>Tax</th>
                  <th>UOM</th>
                  <th>Category</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '32px' }}>
                      No products found. Click "New Product" to add one.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map(p => (
                    <tr key={p.id}>
                      <td>
                        <input 
                          type="checkbox" 
                          checked={selectedProducts.includes(p.id)} 
                          onChange={() => {
                            const next = selectedProducts.includes(p.id) 
                              ? selectedProducts.filter(id => id !== p.id) 
                              : [...selectedProducts, p.id];
                            setSelectedProducts(next);
                          }} 
                        />
                      </td>
                      <td style={{ fontWeight: 700 }}>{p.name}</td>
                      <td style={{ color: 'var(--accent-gold)', fontWeight: 800 }}>${parseFloat(p.price).toFixed(2)}</td>
                      <td>{p.tax}%</td>
                      <td><span className="badge badge-secondary">{p.uom}</span></td>
                      <td>
                        <span 
                          className="badge" 
                          style={{ 
                            background: categories.find(cat => cat.id === p.category_id)?.color || '#333', 
                            color: '#fff', 
                            fontSize: '0.75rem' 
                          }}
                        >
                          {p.category_name || 'Uncategorized'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button 
                          className="btn btn-ghost btn-sm" 
                          style={{ color: 'var(--danger)' }}
                          onClick={() => handleDeleteProduct(p.id)}
                        >
                          <Trash size={14}/>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )
        )}

        {activeTab === 'Categories' && (
          <div className="fade-in">
             <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>Product Categories</h3>
                <button className="btn btn-primary btn-sm" onClick={() => setIsAddCategoryModalOpen(true)}>New Category</button>
             </div>
             <table className="data-table">
               <thead>
                 <tr>
                    <th style={{ width: '40px' }}></th>
                    <th>Product Category</th>
                    <th>Color Palette</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                 </tr>
               </thead>
               <tbody>
                 {categories.length === 0 ? (
                   <tr>
                     <td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '32px' }}>
                       No categories yet. Click "New Category" to add one.
                     </td>
                   </tr>
                 ) : (
                   categories.map(cat => (
                     <tr key={cat.id}>
                       <td><MoreVertical size={16} color="var(--text-dim)" style={{ cursor: 'grab' }} /></td>
                       <td style={{ fontWeight: 700 }}>{cat.name}</td>
                       <td>
                          <div style={{ display: 'flex', gap: '8px' }}>
                             {['#3498db', '#e67e22', '#e05252', '#2ecc71', '#9b59b6', '#34495e'].map(c => (
                               <div 
                                key={c}
                                onClick={() => handleUpdateCategoryColor(cat, c)}
                                style={{ 
                                  width: '20px', height: '20px', borderRadius: '50%', background: c, cursor: 'pointer',
                                  border: cat.color === c ? '2px solid #fff' : 'none',
                                  transform: cat.color === c ? 'scale(1.2)' : 'none'
                                }}
                               />
                             ))}
                          </div>
                       </td>
                       <td style={{ textAlign: 'right' }}>
                          <button 
                            className="btn btn-ghost btn-sm" 
                            style={{ color: 'var(--danger)' }}
                            onClick={() => handleDeleteCategory(cat.id)}
                          >
                            <Trash size={14}/>
                          </button>
                       </td>
                     </tr>
                   ))
                 )}
               </tbody>
             </table>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      <Modal 
        isOpen={isAddProductModalOpen} 
        onClose={() => setIsAddProductModalOpen(false)} 
        title="Product Creation"
        size="lg"
      >
        <div className="fade-in">
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Product Name</label>
            <input 
              className="form-input" 
              placeholder="e.g Burger with cheese" 
              style={{ fontSize: '1.2rem', fontWeight: 700 }}
              value={newProduct.name}
              onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: '24px' }}>
             <TabMini label="General Info" active={prodTab === 'General'} onClick={() => setProdTab('General')} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Category</label>
                  <select 
                    className="form-input" 
                    value={newProduct.category_id}
                    onChange={e => setNewProduct({ ...newProduct, category_id: e.target.value })}
                  >
                    <option value="">-- No Category --</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Product Description</label>
                  <textarea 
                    className="form-input" 
                    rows={3} 
                    placeholder="Enter details..."
                    value={newProduct.description}
                    onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                  />
                </div>
             </div>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Price (₹)</label>
                    <input className="form-input" placeholder="25.00" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} />
                  </div>
                  <div style={{ width: '100px' }}>
                     <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>UOM</label>
                     <select className="form-input" value={newProduct.uom} onChange={e => setNewProduct({ ...newProduct, uom: e.target.value })}>
                        <option>Unit</option>
                        <option>KG</option>
                        <option>Liter</option>
                     </select>
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Tax %</label>
                  <div style={{ display: 'flex', gap: '12px' }}>
                     {['5', '15', '18', '28'].map(t => (
                       <button 
                        key={t}
                        className="btn btn-ghost btn-sm"
                        style={{ 
                          background: newProduct.tax === t ? 'var(--accent-gold)' : 'rgba(255,255,255,0.05)',
                          color: newProduct.tax === t ? '#000' : 'var(--text-primary)',
                          borderColor: newProduct.tax === t ? 'var(--accent-gold)' : 'var(--border)'
                        }}
                        onClick={() => setNewProduct({ ...newProduct, tax: t })}
                       >
                         {t}%
                       </button>
                     ))}
                  </div>
                </div>
             </div>
          </div>

          <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
             <button className="btn btn-ghost" onClick={() => setIsAddProductModalOpen(false)}>Discard</button>
             <button 
              className="btn btn-primary" 
              disabled={saving}
              onClick={handleCreateProduct}
             >
               {saving ? 'Saving...' : 'Confirm & Save'}
             </button>
          </div>
        </div>
      </Modal>

      {/* Add Category Modal */}
      <Modal 
        isOpen={isAddCategoryModalOpen} 
        onClose={() => setIsAddCategoryModalOpen(false)} 
        title="Create New Category"
      >
        <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Category Name</label>
            <input 
              className="form-input" 
              placeholder="e.g. Snacks" 
              value={newCategoryData.name}
              onChange={e => setNewCategoryData({ ...newCategoryData, name: e.target.value })}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Theme Color</label>
            <div style={{ display: 'flex', gap: '12px' }}>
               {['#3498db', '#e67e22', '#e05252', '#2ecc71', '#9b59b6', '#34495e'].map(c => (
                 <div 
                  key={c}
                  onClick={() => setNewCategoryData({ ...newCategoryData, color: c })}
                  style={{ 
                    width: '32px', height: '32px', borderRadius: '50%', background: c, cursor: 'pointer',
                    border: newCategoryData.color === c ? '2px solid #fff' : 'none',
                    transform: newCategoryData.color === c ? 'scale(1.1)' : 'none',
                    transition: 'all 0.2s'
                  }}
                 />
               ))}
            </div>
          </div>
          <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
             <button 
              className="btn btn-primary btn-full" 
              disabled={saving}
              onClick={handleCreateCategory}
             >
               {saving ? 'Saving...' : 'Save Category'}
             </button>
             <button className="btn btn-ghost" onClick={() => setIsAddCategoryModalOpen(false)}>Discard</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

const TabMini = ({ label, active, onClick }) => (
  <div 
    onClick={onClick}
    style={{ 
      padding: '12px 24px', cursor: 'pointer', fontSize: '0.9rem',
      borderBottom: active ? '2px solid var(--accent-gold)' : 'none',
      color: active ? 'var(--accent-gold)' : 'var(--text-muted)',
      fontWeight: 700
    }}
  >
    {label}
  </div>
);

const TabItem = ({ icon, label, active, onClick }) => (
  <div 
    onClick={onClick}
    style={{ 
      display: 'flex', alignItems: 'center', gap: '10px', padding: '16px 0', 
      cursor: 'pointer', color: active ? 'var(--accent-gold)' : 'var(--text-muted)',
      fontWeight: 700, fontSize: '0.95rem',
      borderBottom: active ? '3px solid var(--accent-gold)' : '3px solid transparent',
      transition: 'all 0.2s',
      marginBottom: '-1px'
    }}
  >
    {icon}
    {label}
  </div>
);

const PlusCustom = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
);

export default ProductsPage;
