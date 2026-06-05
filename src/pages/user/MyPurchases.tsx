import { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { Download, Eye, Book, CreditCard, Calendar, Library, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

interface PurchasedNote {
    id: string;
    title: string;
    subject: string;
    price: number;
    purchasedAt: string;
    downloaded: number;
    fileName: string;
}

export default function MyPurchases() {
    const [purchasedNotes, setPurchasedNotes] = useState<PurchasedNote[]>([]);
    const [loading, setLoading] = useState(true);

    const { globalSearch } = useOutletContext<{ globalSearch: string }>();

    useEffect(() => {
        const fetchPurchases = async () => {
            try {
                setLoading(true);
                const res = await api.get('/notes/purchased');
                if (res.data) {
                    const mapped = res.data.map((n: any) => ({
                        id: n.id.toString(),
                        title: n.title,
                        subject: n.subject,
                        price: n.price,
                        purchasedAt: new Date(n.uploadedAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                        }),
                        downloaded: n.downloads || 0,
                        fileName: n.fileName || `${n.title.replace(/\s+/g, '_')}.pdf`
                    }));
                    setPurchasedNotes(mapped);
                }
            } catch (err: any) {
                console.error("Error loading purchases:", err);
                toast.error("Failed to load purchased library.");
            } finally {
                setLoading(false);
            }
        };
        fetchPurchases();
    }, []);

    const filteredNotes = purchasedNotes.filter(note =>
        note.title.toLowerCase().includes(globalSearch.toLowerCase()) ||
        note.subject.toLowerCase().includes(globalSearch.toLowerCase())
    );

    const handleDownload = async (note: PurchasedNote) => {
        try {
            toast.loading(`Downloading ${note.title}...`, { id: "download" });
            const response = await api.get(`/notes/download/${note.id}`, {
                responseType: 'blob'
            });
            
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.setAttribute('download', note.fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.success("PDF Downloaded successfully!", { id: "download" });
            
            // Increment local counter for responsive UX
            setPurchasedNotes(prev => prev.map(n => n.id === note.id ? { ...n, downloaded: n.downloaded + 1 } : n));
        } catch (err: any) {
            console.error("Download error:", err);
            toast.error("Failed to download PDF. Please check backend connection.", { id: "download" });
        }
    };

    const styles = `
      .purchases-container {
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
        background: linear-gradient(to right, #6d28d9, #9333ea);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-bottom: 8px;
        letter-spacing: -0.5px;
      }
      .dark .page-title {
        background: linear-gradient(to right, #818cf8, #c084fc);
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
        background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
        color: white;
        padding: 8px 16px;
        border-radius: 8px;
        font-size: 13px;
        font-weight: 600;
        text-decoration: none;
        transition: all 0.3s ease;
        box-shadow: 0 10px 20px -5px rgba(99, 102, 241, 0.4);
      }

      .browse-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 15px 25px -5px rgba(99, 102, 241, 0.5);
      }

      .purchases-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .purchase-card {
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
      .dark .purchase-card {
        background: linear-gradient(145deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.8) 100%);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(99, 102, 241, 0.15);
        box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.3);
      }

      .purchase-card:hover {
        transform: translateY(-4px);
        border-color: #818cf8;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      }
      .dark .purchase-card:hover {
        border-color: rgba(99, 102, 241, 0.4);
        box-shadow: 0 20px 40px -10px rgba(99, 102, 241, 0.2);
      }

      @media (min-width: 1024px) {
        .purchase-card {
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
        color: #818cf8;
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
        border: none;
        white-space: nowrap;
      }

      .btn-download {
        background: rgba(16, 185, 129, 0.15);
        color: #34d399;
        border: 1px solid rgba(16, 185, 129, 0.3);
      }

      .btn-download:hover {
        background: rgba(16, 185, 129, 0.25);
        transform: translateY(-2px);
      }

      .btn-view {
        background: #f1f5f9;
        color: #334155;
        border: 1px solid #cbd5e1;
      }
      .dark .btn-view {
        background: rgba(30, 41, 59, 0.8);
        color: #e2e8f0;
        border: 1px solid rgba(148, 163, 184, 0.3);
      }

      .btn-view:hover {
        background: #e2e8f0;
        border-color: #94a3b8;
        transform: translateY(-2px);
      }
      .dark .btn-view:hover {
        background: rgba(51, 65, 85, 0.8);
        border-color: rgba(148, 163, 184, 0.5);
      }

      .download-count {
        font-size: 11px;
        color: #64748b;
        text-align: right;
        margin-top: 4px;
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
        border: 2px dashed rgba(99, 102, 241, 0.2);
      }

      .empty-icon-wrap {
        width: 72px;
        height: 72px;
        background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1));
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #818cf8;
        margin-bottom: 16px;
        box-shadow: 0 0 30px rgba(99,102,241,0.1);
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
                        border: '3px solid rgba(129, 140, 248, 0.1)',
                        borderTop: '3px solid #818cf8',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                    }}></div>
                    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                    <p style={{ color: '#94a3b8', fontSize: '14px', fontWeight: 500 }}>Syncing your purchased library...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <style>{styles}</style>
            <div className="purchases-container">
                <div className="header-section" style={{ justifyContent: 'flex-end', marginBottom: '16px' }}>
                    <Link to="/browse" className="browse-btn">
                        Browse More Notes
                        <ArrowRight size={16} />
                    </Link>
                </div>

                {filteredNotes.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon-wrap">
                            <Library size={48} />
                        </div>
                        <h3 className="empty-title">No Notes Found</h3>
                        <p className="empty-desc">
                            {globalSearch 
                                ? "We couldn't find any purchased notes matching your search criteria." 
                                : "You haven't added any notes to your library yet. Start exploring our collection!"}
                        </p>
                        <Link to="/browse" className="browse-btn">
                            Explore Collection
                        </Link>
                    </div>
                ) : (
                    <div className="purchases-grid">
                        {filteredNotes.map((note) => (
                            <div key={note.id} className="purchase-card">
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
                                            <CreditCard size={16} className="meta-icon success" />
                                            Paid ₹{note.price}
                                        </div>
                                        <div className="meta-item">
                                            <Calendar size={16} className="meta-icon" />
                                            {note.purchasedAt}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div className="card-actions">
                                        <button 
                                            className="action-btn btn-download"
                                            onClick={() => handleDownload(note)}
                                        >
                                            <Download size={18} />
                                            Download PDF
                                        </button>
                                        <Link 
                                            to={`/browse/note/${note.id}`}
                                            className="action-btn btn-view"
                                        >
                                            <Eye size={18} />
                                            View Details
                                        </Link>
                                    </div>
                                    <div className="download-count">
                                        Downloaded {note.downloaded} time{note.downloaded !== 1 ? 's' : ''}
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