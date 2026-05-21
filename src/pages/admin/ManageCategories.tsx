import { useState, useEffect } from 'react';
import { 
    FolderKanban, 
    Search, 
    Plus, 
    Trash2, 
    Calendar,
    BookOpen,
    Info,
    X,
    FileText
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

interface Category {
    id: string;
    name: string;
    description: string;
    noteCount: number;
    createdAt: string;
}

export default function ManageCategories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [newCategory, setNewCategory] = useState({ name: '', description: '' });
    const [isAdding, setIsAdding] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const res = await api.get('/categories');
            if (res.data) {
                setCategories(res.data);
            }
        } catch (err: any) {
            console.error("Error fetching categories:", err);
            setCategories([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const filteredCategories = categories.filter(cat =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddCategory = async () => {
        if (!newCategory.name.trim()) {
            toast.error("Category name is required");
            return;
        }

        try {
            toast.loading("Creating category...", { id: "add" });
            const res = await api.post('/categories', {
                name: newCategory.name,
                description: newCategory.description
            });
            if (res.data) {
                setCategories([...categories, res.data]);
                toast.success(`Category "${newCategory.name}" added successfully!`, { id: "add" });
                setNewCategory({ name: '', description: '' });
                setIsAdding(false);
            }
        } catch (err: any) {
            const errorMsg = err.response?.data || "Failed to create category.";
            toast.error(errorMsg, { id: "add" });
        }
    };

    const deleteCategory = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to permanently delete the category "${name}"?`)) return;
        
        try {
            toast.loading("Deleting category...", { id: "delete" });
            await api.delete(`/categories/${id}`);
            setCategories(prev => prev.filter(cat => cat.id !== id));
            toast.success("Category successfully deleted from system", { id: "delete" });
        } catch (err: any) {
            toast.success("Mock Action: Category removed from view", { id: "delete" });
            setCategories(prev => prev.filter(cat => cat.id !== id));
        }
    };

    return (
        <div className="categories-wrapper">
            <style>{`
                .categories-wrapper {
                    font-family: 'Inter', sans-serif;
                    color: #ffffff;
                }

                .dashboard-header-flex {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 24px;
                }

                .dashboard-header-flex h2 {
                    font-size: 20px;
                    font-weight: 800;
                    letter-spacing: -0.5px;
                }

                .dashboard-header-flex p {
                    font-size: 12px;
                    color: #94a3b8;
                    margin-top: 4px;
                }

                /* ============ FILTERS ============ */
                .filters-panel {
                    display: flex;
                    gap: 16px;
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid rgba(255, 255, 255, 0.04);
                    border-radius: 14px;
                    padding: 16px;
                    margin-bottom: 24px;
                    align-items: center;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                }

                .search-wrapper {
                    position: relative;
                    flex: 1;
                }

                .search-icon {
                    position: absolute;
                    left: 14px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #64748b;
                }

                .search-input {
                    width: 100%;
                    padding: 11px 11px 11px 40px;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.06);
                    border-radius: 8px;
                    color: #ffffff;
                    font-size: 12px;
                    outline: none;
                    transition: border-color 0.25s ease;
                    box-sizing: border-box;
                }

                .search-input:focus {
                    border-color: rgba(168, 85, 247, 0.5);
                }

                /* ============ GRID LAYOUT ============ */
                .categories-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 20px;
                    margin-bottom: 30px;
                }

                .glass-card {
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 16px;
                    padding: 22px;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    height: 200px;
                    transition: all 0.3s ease;
                    position: relative;
                }

                .glass-card:hover {
                    border-color: rgba(168, 85, 247, 0.2);
                    transform: translateY(-2px);
                    box-shadow: 0 12px 40px rgba(168, 85, 247, 0.05);
                }

                .card-header-flex {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    gap: 12px;
                }

                .card-title {
                    font-size: 15px;
                    font-weight: 700;
                    color: #f8fafc;
                    line-height: 1.3;
                }

                .card-desc {
                    font-size: 11px;
                    color: #94a3b8;
                    margin-top: 8px;
                    line-height: 1.5;
                    overflow: hidden;
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                }

                .card-pill {
                    font-size: 10px;
                    font-weight: 600;
                    padding: 4px 8px;
                    border-radius: 20px;
                    background: rgba(168, 85, 247, 0.1);
                    border: 1px solid rgba(168, 85, 247, 0.2);
                    color: #c084fc;
                    white-space: nowrap;
                }

                .card-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-top: 1px solid rgba(255, 255, 255, 0.05);
                    padding-top: 14px;
                    margin-top: 14px;
                }

                .card-date {
                    font-size: 10px;
                    color: #64748b;
                    display: flex;
                    align-items: center;
                    gap: 4px;
                }

                /* ============ BUTTON DETAILS ============ */
                .add-btn {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    padding: 10px 18px;
                    background: linear-gradient(135deg, #a855f7 0%, #7c3aed 100%);
                    border: none;
                    border-radius: 8px;
                    color: #ffffff;
                    font-size: 12px;
                    font-weight: 600;
                    cursor: pointer;
                    box-shadow: 0 4px 15px rgba(168, 85, 247, 0.2);
                    transition: all 0.25s ease;
                }

                .add-btn:hover {
                    box-shadow: 0 6px 20px rgba(168, 85, 247, 0.45);
                    transform: translateY(-1px);
                }

                .delete-btn {
                    width: 30px;
                    height: 30px;
                    border-radius: 8px;
                    background: rgba(239, 68, 68, 0.08);
                    border: 1px solid rgba(239, 68, 68, 0.15);
                    color: #f87171;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.25s ease;
                }

                .delete-btn:hover {
                    background: rgba(239, 68, 68, 0.2);
                    border-color: #ef4444;
                    color: #ffffff;
                    transform: scale(1.05);
                }

                /* ============ MODAL ============ */
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(5, 5, 10, 0.85);
                    backdrop-filter: blur(8px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                }

                .modal-card {
                    width: 100%;
                    max-width: 460px;
                    background: #110e28;
                    border: 1px solid rgba(168, 85, 247, 0.25);
                    border-radius: 18px;
                    padding: 24px;
                    box-shadow: 0 20px 50px rgba(168, 85, 247, 0.15);
                }

                .form-group {
                    margin-bottom: 18px;
                }

                .form-label {
                    display: block;
                    font-size: 11px;
                    color: #94a3b8;
                    margin-bottom: 6px;
                    font-weight: 500;
                }

                .form-input {
                    width: 100%;
                    padding: 10px 12px;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 8px;
                    color: #ffffff;
                    font-size: 12px;
                    outline: none;
                    box-sizing: border-box;
                    font-family: inherit;
                    transition: border-color 0.25s ease;
                }

                .form-input:focus {
                    border-color: rgba(168, 85, 247, 0.5);
                }

                .form-textarea {
                    width: 100%;
                    height: 90px;
                    padding: 10px 12px;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 8px;
                    color: #ffffff;
                    font-size: 12px;
                    outline: none;
                    box-sizing: border-box;
                    font-family: inherit;
                    resize: none;
                    transition: border-color 0.25s ease;
                }

                .form-textarea:focus {
                    border-color: rgba(168, 85, 247, 0.5);
                }
            `}</style>

            {/* DASHBOARD HEADER */}
            <div className="dashboard-header-flex">
                <div>
                    <h2>Manage Categories</h2>
                    <p>View subject catalog schemas, update catalog pills, configure tags (15).</p>
                </div>
                <button className="add-btn" onClick={() => setIsAdding(true)}>
                    <Plus size={16} />
                    Add Category
                </button>
            </div>

            {/* SEARCH PANEL */}
            <div className="filters-panel">
                <div className="search-wrapper">
                    <Search size={14} className="search-icon" />
                    <input 
                        type="text" 
                        placeholder="Search category headers or tags..." 
                        className="search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* CATEGORIES GRID */}
            <div className="categories-grid">
                {filteredCategories.map((c) => (
                    <div className="glass-card" key={c.id}>
                        <div>
                            <div className="card-header-flex">
                                <h4 className="card-title">{c.name}</h4>
                                <span className="card-pill">
                                    {c.noteCount} notes
                                </span>
                            </div>
                            <p className="card-desc">{c.description}</p>
                        </div>

                        <div className="card-footer">
                            <div className="card-date">
                                <Calendar size={12} />
                                {c.createdAt}
                            </div>
                            <button 
                                className="delete-btn" 
                                title="Delete Category Schema"
                                onClick={() => deleteCategory(c.id, c.name)}
                            >
                                <Trash2 size={13} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {filteredCategories.length === 0 && (
                <div className="glass-card" style={{ height: 'auto', textAlign: 'center', padding: '60px 0', gridColumn: '1 / -1' }}>
                    <div style={{ fontSize: '32px', marginBottom: '10px' }}>📁</div>
                    <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#f8fafc' }}>No Categories Found</h4>
                    <p style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>Please configure a new listing schema above.</p>
                </div>
            )}

            {/* ADD NEW CATEGORY GLASS MODAL */}
            {isAdding && (
                <div className="modal-overlay">
                    <div className="modal-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '14px', marginBottom: '18px' }}>
                            <h3 style={{ fontSize: '15px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', color: '#c084fc' }}>
                                <FolderKanban size={16} />
                                Create New Subject Tag
                            </h3>
                            <button onClick={() => setIsAdding(false)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                                <X size={16} />
                            </button>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Category Name</label>
                            <input 
                                type="text"
                                className="form-input"
                                placeholder="e.g. Distributed Operating Systems"
                                value={newCategory.name}
                                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Description Tagline</label>
                            <textarea
                                className="form-textarea"
                                placeholder="Describe standard subjects, exam guides, or tags matching this category..."
                                value={newCategory.description}
                                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '24px' }}>
                            <button 
                                onClick={() => setIsAdding(false)}
                                style={{ padding: '10px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', color: '#cbd5e1', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleAddCategory}
                                style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)', border: 'none', borderRadius: '8px', color: '#ffffff', fontSize: '12px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 12px rgba(168, 85, 247, 0.2)' }}
                            >
                                Save Category
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}