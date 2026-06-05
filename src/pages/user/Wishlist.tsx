import { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { Trash2, ShoppingCart, Book, CreditCard, Heart, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

interface WishlistNote {
    id: string;
    title: string;
    subject: string;
    price: number;
    isFree: boolean;
    addedAt: string;
}

export default function Wishlist() {
    const [wishlistNotes, setWishlistNotes] = useState<WishlistNote[]>([]);
    const [loading, setLoading] = useState(true);

    const { globalSearch } = useOutletContext<{ globalSearch: string }>();

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                setLoading(true);
                const res = await api.get('/notes/wishlist');
                if (res.data) {
                    const mapped = res.data.map((w: any) => ({
                        id: w.id.toString(),
                        title: w.title,
                        subject: w.subject,
                        price: w.price,
                        isFree: w.isFree,
                        addedAt: new Date(w.uploadedAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                        })
                    }));
                    setWishlistNotes(mapped);
                }
            } catch (err: any) {
                console.error("Error loading wishlist:", err);
                toast.error("Failed to load wishlist.");
            } finally {
                setLoading(false);
            }
        };
        fetchWishlist();
    }, []);

    const filteredNotes = wishlistNotes.filter(note =>
        note.title.toLowerCase().includes(globalSearch.toLowerCase()) ||
        note.subject.toLowerCase().includes(globalSearch.toLowerCase())
    );

    const handleRemove = async (id: string, title: string) => {
        try {
            await api.delete(`/notes/wishlist/${id}`);
            setWishlistNotes(prev => prev.filter(note => note.id !== id));
            toast.success(`Removed "${title}" from wishlist`);
        } catch (err: any) {
            console.error("Remove wishlist error:", err);
            toast.error("Failed to remove note from wishlist.");
        }
    };

    const styles = `
      .wishlist-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 16px 24px;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      }

      .header-section {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 40px;
        flex-wrap: wrap;
        gap: 20px;
      }

      .page-title {
        font-size: 36px;
        font-weight: 800;
        background: linear-gradient(to right, #e11d48, #f43f5e);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-bottom: 8px;
        letter-spacing: -0.5px;
      }
      .dark .page-title {
        background: linear-gradient(to right, #f43f5e, #fb7185);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .page-subtitle {
        color: #475569;
        font-size: 16px;
      }
      .dark .page-subtitle {
        color: #94a3b8;
      }

      .browse-btn {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background: linear-gradient(135deg, #e11d48 0%, #f43f5e 100%);
        color: white;
        padding: 8px 16px;
        border-radius: 8px;
        font-size: 13px;
        font-weight: 600;
        text-decoration: none;
        transition: all 0.3s ease;
        box-shadow: 0 10px 20px -5px rgba(244, 63, 94, 0.4);
      }

      .browse-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 15px 25px -5px rgba(244, 63, 94, 0.5);
      }

      .wishlist-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .wishlist-card {
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 16px;
        transition: all 0.3s ease;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
      }
      .dark .wishlist-card {
        background: linear-gradient(145deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.8) 100%);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(244, 63, 94, 0.15);
        box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.3);
      }

      .wishlist-card:hover {
        transform: translateY(-4px);
        border-color: #f43f5e;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      }
      .dark .wishlist-card:hover {
        border-color: rgba(244, 63, 94, 0.4);
        box-shadow: 0 20px 40px -10px rgba(244, 63, 94, 0.2);
      }

      @media (min-width: 1024px) {
        .wishlist-card {
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
        }
      }

      .note-info {
        flex: 1;
      }

      .note-title {
        font-size: 16px;
        font-weight: 700;
        color: #0f172a;
        margin-bottom: 12px;
        line-height: 1.3;
      }
      .dark .note-title {
        color: #f8fafc;
      }

      .note-meta-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }

      .meta-item {
        display: flex;
        align-items: center;
        gap: 4px;
        background: #f8fafc;
        padding: 4px 8px;
        border-radius: 6px;
        border: 1px solid #e2e8f0;
        font-size: 11px;
        color: #334155;
      }
      .dark .meta-item {
        background: rgba(15, 23, 42, 0.5);
        border: 1px solid rgba(255,255,255,0.05);
        color: #cbd5e1;
      }

      .meta-icon {
        color: #fb7185;
      }

      .meta-icon.success {
        color: #10b981;
      }

      .card-actions {
        display: flex;
        flex-direction: row;
        gap: 8px;
      }

      .action-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
        padding: 6px 12px;
        border-radius: 6px;
        font-weight: 600;
        font-size: 12px;
        cursor: pointer;
        transition: all 0.2s ease;
        border: none;
        text-decoration: none;
        white-space: nowrap;
      }

      .btn-buy {
        background: rgba(16, 185, 129, 0.15);
        color: #34d399;
        border: 1px solid rgba(16, 185, 129, 0.3);
      }

      .btn-buy:hover {
        background: rgba(16, 185, 129, 0.25);
        transform: translateY(-2px);
      }

      .btn-remove {
        background: rgba(239, 68, 68, 0.1);
        color: #f87171;
        border: 1px solid rgba(239, 68, 68, 0.2);
      }

      .btn-remove:hover {
        background: rgba(239, 68, 68, 0.2);
        border-color: rgba(239, 68, 68, 0.4);
        transform: translateY(-2px);
      }

      .empty-state {
        background: #ffffff;
        border: 2px dashed #cbd5e1;
        border-radius: 12px;
        padding: 40px 20px;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .dark .empty-state {
        background: linear-gradient(145deg, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.6) 100%);
        border: 2px dashed rgba(244, 63, 94, 0.2);
      }

      .empty-icon-wrap {
        width: 72px;
        height: 72px;
        background: linear-gradient(135deg, rgba(244, 63, 94, 0.1), rgba(225, 29, 72, 0.1));
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fb7185;
        margin-bottom: 16px;
        box-shadow: 0 0 30px rgba(244,63,94,0.1);
      }

      .empty-title {
        font-size: 20px;
        font-weight: 700;
        color: #0f172a;
        margin-bottom: 8px;
      }
      .dark .empty-title {
        color: #f8fafc;
      }

      .empty-desc {
        color: #64748b;
        font-size: 14px;
        margin-bottom: 24px;
        max-width: 400px;
      }
      .dark .empty-desc {
        color: #94a3b8;
      }
    `;

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', fontFamily: 'Inter, sans-serif' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                        width: '48px',
                        height: '48px',
                        border: '3px solid rgba(244, 63, 94, 0.1)',
                        borderTop: '3px solid #fb7185',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                    }}></div>
                    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                    <p style={{ color: '#94a3b8', fontSize: '14px', fontWeight: 500 }}>Syncing your wishlist...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <style>{styles}</style>
            <div className="wishlist-container">
                <div className="header-section" style={{ justifyContent: 'flex-end', marginBottom: '16px' }}>
                    <Link to="/browse" className="browse-btn">
                        Explore Collection
                        <ArrowRight size={16} />
                    </Link>
                </div>

                {filteredNotes.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon-wrap">
                            <Heart size={48} />
                        </div>
                        <h3 className="empty-title">Your Wishlist is Empty</h3>
                        <p className="empty-desc">
                            {globalSearch 
                                ? "We couldn't find any saved notes matching your search criteria." 
                                : "You haven't saved any notes yet. Browse the collection and click the heart icon to save notes for later!"}
                        </p>
                        <Link to="/browse" className="browse-btn">
                            Browse Notes
                        </Link>
                    </div>
                ) : (
                    <div className="wishlist-grid">
                        {filteredNotes.map((note) => (
                            <div key={note.id} className="wishlist-card">
                                <div className="note-info">
                                    <h3 className="note-title">
                                        {note.title}
                                    </h3>
                                    <div className="note-meta-grid">
                                        <div className="meta-item">
                                            <Book size={16} className="meta-icon" />
                                            {note.subject}
                                        </div>
                                        <div className="meta-item">
                                            <CreditCard size={16} className={note.isFree ? "meta-icon success" : "meta-icon"} />
                                            {note.isFree ? 'Free' : `₹${note.price}`}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div className="card-actions">
                                        <Link 
                                            to={note.isFree ? `/browse/note/${note.id}` : `/checkout/${note.id}`}
                                            className="action-btn btn-buy"
                                        >
                                            <ShoppingCart size={18} />
                                            {note.isFree ? 'View Note' : 'Buy Now'}
                                        </Link>
                                        <button 
                                            className="action-btn btn-remove"
                                            onClick={() => handleRemove(note.id, note.title)}
                                        >
                                            <Trash2 size={18} />
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
