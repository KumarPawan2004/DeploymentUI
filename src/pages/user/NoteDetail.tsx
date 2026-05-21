import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Heart, Download, ShoppingCart, Star, FileText, ChevronLeft, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function NoteDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [note, setNote] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [inWishlist, setInWishlist] = useState(false);

    useEffect(() => {
        const fetchNoteData = async () => {
            try {
                setIsLoading(true);
                const [noteRes, wishlistRes, purchasedRes] = await Promise.all([
                    api.get(`/notes/${id}`),
                    api.get('/notes/wishlist').catch(() => ({ data: [] })),
                    api.get('/notes/purchased').catch(() => ({ data: [] }))
                ]);

                if (noteRes.data) {
                    const rawNote = noteRes.data;
                    const isOwner = user && rawNote.uploaderName === user.fullName;
                    const isPurchased = isOwner || (purchasedRes.data && purchasedRes.data.some((p: any) => String(p.id) === String(id)));
                    const wishlisted = wishlistRes.data && wishlistRes.data.some((w: any) => String(w.id) === String(id));

                    setNote({
                        id: rawNote.id,
                        title: rawNote.title,
                        description: rawNote.description || "No description provided.",
                        subject: rawNote.subject,
                        category: rawNote.category,
                        price: rawNote.price || 0,
                        uploadedBy: rawNote.uploaderName || "Standard Student",
                        uploadedAt: rawNote.uploadedAt ? new Date(rawNote.uploadedAt).toLocaleDateString() : "Recent",
                        rating: 4.8,
                        downloads: rawNote.downloads || 0,
                        pages: 45,
                        isFree: rawNote.isFree,
                        isPurchased: isPurchased,
                        fileName: rawNote.fileName || "document.pdf"
                    });
                    setInWishlist(wishlisted);
                }
            } catch (err: any) {
                console.error("Error loading note details:", err);
                toast.error("Failed to load note details.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchNoteData();
    }, [id, user]);

    const handleDownload = async () => {
        if (!note) return;
        try {
            toast.loading("Initiating download...", { id: "download" });
            const response = await api.get(`/notes/download/${id}`, {
                responseType: 'blob'
            });
            
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.setAttribute('download', note.fileName || "document.pdf");
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.success("Downloaded successfully!", { id: "download" });
        } catch (err: any) {
            console.error("Download error:", err);
            toast.error("You must purchase this premium note first to download it.", { id: "download" });
        }
    };

    const handlePurchase = async () => {
        if (!note) return;
        navigate(`/checkout/${note.id}`);
    };

    const handleWishlist = async () => {
        if (!note) return;
        try {
            if (inWishlist) {
                await api.delete(`/notes/wishlist/${id}`);
                setInWishlist(false);
                toast.success("Removed from Wishlist");
            } else {
                await api.post(`/notes/wishlist/${id}`);
                setInWishlist(true);
                toast.success("Added to Wishlist!");
            }
        } catch (err: any) {
            console.error("Wishlist toggle error:", err);
            toast.error("Failed to update wishlist");
        }
    };

    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', color: '#818cf8' }}>
                <div className="nd-spinner" style={{ width: '40px', height: '40px', border: '4px solid rgba(129, 140, 248, 0.2)', borderTopColor: '#818cf8', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    const isFree = note.price === 0;

    const styles = `
      .nd-detail-wrapper {
        position: relative;
        min-height: 100vh;
        overflow: visible;
        padding: 32px 0;
        font-family: 'Outfit', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      }

      .nd-ambient-blur-1 {
        position: absolute;
        top: -5%;
        right: 10%;
        width: 380px;
        height: 380px;
        background: radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, rgba(99, 102, 241, 0) 70%);
        filter: blur(80px);
        z-index: 0;
        pointer-events: none;
        animation: pulseOrb 12s ease-in-out infinite alternate;
      }

      .nd-ambient-blur-2 {
        position: absolute;
        bottom: 10%;
        left: 5%;
        width: 400px;
        height: 400px;
        background: radial-gradient(circle, rgba(236, 72, 153, 0.08) 0%, rgba(99, 102, 241, 0) 70%);
        filter: blur(100px);
        z-index: 0;
        pointer-events: none;
        animation: pulseOrb 15s ease-in-out infinite alternate-reverse;
      }

      @keyframes pulseOrb {
        0% { transform: translate(0, 0) scale(1); }
        100% { transform: translate(20px, -35px) scale(1.1); }
      }

      .nd-detail-container {
        max-width: 1100px;
        margin: 0 auto;
        padding: 0 24px;
        position: relative;
        z-index: 1;
      }

      .nd-back-link {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        color: #64748b;
        text-decoration: none;
        font-weight: 600;
        font-size: 14px;
        transition: all 0.3s ease;
        padding: 6px 12px;
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid rgba(255, 255, 255, 0.05);
        justify-self: start;
      }

      .nd-back-link:hover {
        color: #f8fafc;
        background: rgba(255, 255, 255, 0.05);
        border-color: rgba(255, 255, 255, 0.1);
        transform: translateX(-3px);
      }

      .nd-detail-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 18px;
        max-width: 950px;
        margin: 0 auto;
      }

      .nd-glass-panel {
        background: linear-gradient(145deg, rgba(30, 41, 59, 0.35) 0%, rgba(15, 23, 42, 0.55) 100%);
        backdrop-filter: blur(24px);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 20px;
        padding: 20px 24px;
        box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.05);
      }
      
      .nd-panel-small-padding {
        padding: 16px 20px;
      }

      .nd-note-title {
        font-size: 24px;
        font-weight: 800;
        color: #f8fafc;
        line-height: 1.35;
        margin-top: 8px;
        margin-bottom: 16px;
        background: linear-gradient(135deg, #ffffff 40%, #e0e7ff 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .nd-note-meta-primary {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 12px;
        flex-wrap: wrap;
      }

      .nd-author-info {
        color: #94a3b8;
        font-size: 13px;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .nd-author-info strong {
        color: #cbd5e1;
        font-weight: 600;
      }

      .nd-badge-subject {
        background: rgba(99, 102, 241, 0.1);
        color: #a5b4fc;
        border: 1px solid rgba(99, 102, 241, 0.25);
        padding: 4px 10px;
        border-radius: 9999px;
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.5px;
        text-transform: uppercase;
      }

      .nd-stats-row {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
        margin-top: 18px;
        border-top: 1px solid rgba(255, 255, 255, 0.06);
        padding-top: 16px;
      }

      .nd-stat-item {
        background: rgba(15, 23, 42, 0.35);
        border: 1px solid rgba(255, 255, 255, 0.04);
        border-radius: 12px;
        padding: 6px 14px;
        display: flex;
        align-items: center;
        gap: 8px;
        transition: all 0.3s;
      }

      .nd-stat-item:hover {
        background: rgba(15, 23, 42, 0.55);
        border-color: rgba(99, 102, 241, 0.15);
        transform: translateY(-1px);
      }

      .nd-stat-icon {
        color: #818cf8;
        display: flex;
        align-items: center;
      }

      .nd-stat-info {
        display: flex;
        flex-direction: column;
      }

      .nd-stat-value {
        font-size: 13px;
        font-weight: 700;
        color: #f8fafc;
        line-height: 1.2;
      }

      .nd-stat-label {
        font-size: 10px;
        color: #64748b;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .nd-section-title {
        font-size: 16px;
        font-weight: 800;
        color: #f8fafc;
        margin-bottom: 10px;
        letter-spacing: -0.2px;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .nd-description-text {
        color: #cbd5e1;
        line-height: 1.6;
        font-size: 14px;
        font-weight: 400;
        white-space: pre-line;
      }

      /* Stacked Panel */
      .nd-action-panel {
        max-width: 600px;
        margin: 0 auto;
        width: 100%;
        transition: all 0.3s;
      }

      .nd-price-display {
        background: rgba(15, 23, 42, 0.4);
        border: 1px solid rgba(255, 255, 255, 0.05);
        border-radius: 14px;
        padding: 12px 20px;
        text-align: center;
        margin-bottom: 16px;
        position: relative;
        overflow: hidden;
      }

      .nd-price-amount {
        font-size: 26px;
        font-weight: 800;
        color: #f8fafc;
        margin-bottom: 2px;
        letter-spacing: -0.5px;
      }
      
      .nd-price-free {
        background: linear-gradient(135deg, #34d399, #10b981);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-weight: 900;
      }

      .nd-price-label {
        color: #64748b;
        font-size: 12px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .nd-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        width: 100%;
        padding: 10px 18px;
        border-radius: 12px;
        font-weight: 700;
        font-size: 13px;
        border: none;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        margin-bottom: 10px;
      }

      .nd-btn-primary {
        background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
        color: white;
        box-shadow: 0 10px 20px -5px rgba(99, 102, 241, 0.4);
      }

      .nd-btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 15px 25px -5px rgba(99, 102, 241, 0.5);
        background: linear-gradient(135deg, #818cf8 0%, #a855f7 100%);
      }

      .nd-btn-success {
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        color: white;
        box-shadow: 0 10px 20px -5px rgba(16, 185, 129, 0.3);
      }

      .nd-btn-success:hover {
        transform: translateY(-2px);
        box-shadow: 0 15px 25px -5px rgba(16, 185, 129, 0.4);
        background: linear-gradient(135deg, #34d399 0%, #10b981 100%);
      }

      .nd-btn-outline {
        background: rgba(15, 23, 42, 0.4);
        color: #f8fafc;
        border: 1px solid rgba(148, 163, 184, 0.2);
      }

      .nd-btn-outline:hover {
        background: rgba(255,255,255,0.05);
        border-color: rgba(148, 163, 184, 0.4);
        transform: translateY(-1px);
      }

      .nd-btn-outline.active {
        color: #ef4444;
        border-color: rgba(239, 68, 68, 0.3);
        background: rgba(239, 68, 68, 0.05);
      }

      .nd-features-list {
        margin-top: 16px;
        border-top: 1px solid rgba(255,255,255,0.06);
        padding-top: 12px;
      }

      .nd-features-title {
        font-size: 11px;
        font-weight: 700;
        color: #64748b;
        margin-bottom: 10px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .nd-feature-item {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #94a3b8;
        font-size: 12px;
        margin-bottom: 8px;
        font-weight: 500;
      }

      .nd-feature-icon {
        color: #10b981;
        flex-shrink: 0;
      }

      .nd-unlocked-state {
        text-align: center;
        padding: 12px 0;
      }

      .nd-unlocked-icon {
        color: #10b981;
        margin-bottom: 12px;
        display: inline-block;
        filter: drop-shadow(0 0 20px rgba(16, 185, 129, 0.3));
        animation: pulseLock 2s infinite alternate;
      }

      @keyframes pulseLock {
        0% { transform: scale(1); }
        100% { transform: scale(1.05); }
      }
    `;

    return (
        <div className="nd-detail-wrapper">
            <div className="nd-ambient-blur-1"></div>
            <div className="nd-ambient-blur-2"></div>
            <style>{styles}</style>
            
            <div className="nd-detail-container">
                <div className="nd-detail-grid">
                    <Link to="/browse" className="nd-back-link">
                        <ChevronLeft size={16} /> Back to Browse
                    </Link>
                    {/* Panel 1 - Header Details */}
                    <div className="nd-glass-panel">
                        <div className="nd-note-meta-primary">
                            <span className="nd-badge-subject">{note.subject}</span>
                            <span className="nd-author-info">By <strong>{note.uploadedBy}</strong> • {note.uploadedAt}</span>
                        </div>

                        <h1 className="nd-note-title" style={{ marginBottom: '16px' }}>{note.title}</h1>

                        <div className="nd-stats-row">
                            <div className="nd-stat-item">
                                <Star size={16} className="nd-stat-icon" fill="#fbbf24" stroke="none" />
                                <div className="nd-stat-info">
                                    <span className="nd-stat-value">{note.rating} / 5.0</span>
                                    <span className="nd-stat-label">Rating</span>
                                </div>
                            </div>
                            <div className="nd-stat-item">
                                <Download size={16} className="nd-stat-icon" style={{ color: '#10b981' }} />
                                <div className="nd-stat-info">
                                    <span className="nd-stat-value">{note.downloads.toLocaleString()}</span>
                                    <span className="nd-stat-label">Downloads</span>
                                </div>
                            </div>
                            <div className="nd-stat-item">
                                <FileText size={16} className="nd-stat-icon" style={{ color: '#6366f1' }} />
                                <div className="nd-stat-info">
                                    <span className="nd-stat-value">{note.pages} Pages</span>
                                    <span className="nd-stat-label">Length</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Panel 2 - Action Panel */}
                    <div className="nd-glass-panel nd-panel-small-padding nd-action-panel">
                        {note.isPurchased ? (
                            <div className="nd-unlocked-state">
                                <CheckCircle size={36} className="nd-unlocked-icon" />
                                <h3 className="nd-section-title" style={{ marginBottom: '8px', justifyContent: 'center' }}>Note Unlocked!</h3>
                                <p className="nd-stat-label" style={{ marginBottom: '20px' }}>You have full access to this note.</p>
                                <button className="nd-btn nd-btn-success" onClick={handleDownload} style={{ maxWidth: '400px', margin: '0 auto' }}>
                                    <Download size={18} />
                                    Download PDF
                                </button>
                            </div>
                        ) : (
                            <div style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }}>
                                <div className="nd-price-display">
                                    <div className={`nd-price-amount ${isFree ? 'nd-price-free' : ''}`}>
                                        {isFree ? 'FREE' : `₹${note.price}`}
                                    </div>
                                    <div className="nd-price-label">One-time payment</div>
                                </div>

                                <div style={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
                                    {isFree ? (
                                        <button className="nd-btn nd-btn-success" onClick={handleDownload}>
                                            <Download size={18} />
                                            Download Free Note
                                        </button>
                                    ) : (
                                        <button className="nd-btn nd-btn-primary" onClick={handlePurchase}>
                                            <ShoppingCart size={18} />
                                            Buy Now • ₹{note.price}
                                        </button>
                                    )}

                                    <button className={`nd-btn nd-btn-outline ${inWishlist ? 'active' : ''}`} onClick={handleWishlist}>
                                        <Heart 
                                            size={18} 
                                            fill={inWishlist ? "#ef4444" : "none"} 
                                            color={inWishlist ? "#ef4444" : "currentColor"} 
                                        />
                                        {inWishlist ? "Saved to Wishlist" : "Add to Wishlist"}
                                    </button>
                                </div>

                                {!isFree && (
                                    <div className="nd-features-list">
                                        <h4 className="nd-features-title" style={{ textAlign: 'center' }}>This purchase includes:</h4>
                                        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap', marginTop: '12px' }}>
                                            <div className="nd-feature-item">
                                                <CheckCircle size={14} className="nd-feature-icon" />
                                                High-quality PDF download
                                            </div>
                                            <div className="nd-feature-item">
                                                <CheckCircle size={14} className="nd-feature-icon" />
                                                Lifetime access
                                            </div>
                                            <div className="nd-feature-item">
                                                <CheckCircle size={14} className="nd-feature-icon" />
                                                Future updates included
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Panel 3 - Description */}
                    <div className="nd-glass-panel">
                        <h2 className="nd-section-title">Description</h2>
                        <p className="nd-description-text">{note.description}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}