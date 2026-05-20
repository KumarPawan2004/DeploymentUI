import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Heart, Download, ShoppingCart, Star, FileText, ChevronLeft, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function NoteDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [note, setNote] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [inWishlist, setInWishlist] = useState(false);

    // Mock Note Data
    useEffect(() => {
        // In real app, fetch from API using id
        setTimeout(() => {
            const mockNote = {
                id: id,
                title: "Complete Data Structures & Algorithms Handwritten Notes",
                description: "Comprehensive handwritten notes covering all important topics of DSA including Arrays, Linked Lists, Trees, Graphs, Dynamic Programming, and more. \n\nIncludes diagrams, code examples, and previous year questions. Perfect for university exams and placement preparation.",
                subject: "DSA",
                category: "Computer Science",
                price: 199,
                uploadedBy: "Rahul Sharma",
                uploadedAt: "2 days ago",
                rating: 4.9,
                downloads: 1240,
                filePath: "#",
                pages: 87,
                isFree: false,
                isPurchased: false
            };
            setNote(mockNote);
            setIsLoading(false);
        }, 500);
    }, [id]);

    const handleDownload = () => {
        if (note.price === 0 || note.isPurchased) {
            toast.success("Downloading your note...");
            setTimeout(() => {
                toast.success("Download started!");
            }, 800);
        } else {
            toast.error("Please purchase this note first");
        }
    };

    const handlePurchase = async () => {
        if (!note) return;
        navigate(`/checkout/${note.id}`);
    };

    const handleWishlist = () => {
        setInWishlist(!inWishlist);
        if (!inWishlist) {
            toast.success("Added to Wishlist!");
        } else {
            toast.success("Removed from Wishlist");
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
      .nd-detail-container {
        max-width: 1000px;
        margin: 0 auto;
        padding: 16px 16px;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      }

      .nd-back-link {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        color: #94a3b8;
        text-decoration: none;
        font-weight: 500;
        font-size: 14px;
        margin-bottom: 12px;
        transition: color 0.3s ease;
      }

      .nd-back-link:hover {
        color: #f8fafc;
      }

      .nd-detail-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 16px;
      }

      @media (min-width: 992px) {
        .nd-detail-grid {
            grid-template-columns: 1fr 300px;
        }
      }

      .nd-glass-panel {
        background: linear-gradient(145deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.8) 100%);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(148, 163, 184, 0.15);
        border-radius: 12px;
        padding: 20px;
        box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.5);
      }
      
      .nd-panel-small-padding {
        padding: 16px;
      }

      .nd-note-title {
        font-size: 24px;
        font-weight: 800;
        color: #f8fafc;
        line-height: 1.3;
        margin-bottom: 12px;
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
      }

      .nd-author-info strong {
        color: #e2e8f0;
      }

      .nd-badge-subject {
        background: rgba(99, 102, 241, 0.15);
        color: #818cf8;
        border: 1px solid rgba(99, 102, 241, 0.3);
        padding: 4px 10px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 0.5px;
      }

      .nd-stats-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 8px;
        margin-bottom: 20px;
        border-top: 1px solid rgba(255,255,255,0.05);
        border-bottom: 1px solid rgba(255,255,255,0.05);
        padding: 12px 0;
      }

      .nd-stat-item {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .nd-stat-icon {
        color: #818cf8;
      }

      .nd-stat-value {
        font-size: 16px;
        font-weight: 700;
        color: #f8fafc;
      }

      .nd-stat-label {
        font-size: 12px;
        color: #94a3b8;
        font-weight: 500;
      }

      .nd-section-title {
        font-size: 16px;
        font-weight: 700;
        color: #f8fafc;
        margin-bottom: 12px;
      }

      .nd-description-text {
        color: #cbd5e1;
        line-height: 1.6;
        font-size: 14px;
        white-space: pre-line;
      }

      /* Sticky Right Panel */
      .nd-action-panel {
        position: sticky;
        top: 16px;
      }

      .nd-price-display {
        background: rgba(15, 23, 42, 0.6);
        border: 1px solid rgba(255,255,255,0.05);
        border-radius: 12px;
        padding: 16px;
        text-align: center;
        margin-bottom: 16px;
      }

      .nd-price-amount {
        font-size: 36px;
        font-weight: 800;
        color: #f8fafc;
        margin-bottom: 4px;
      }
      
      .nd-price-free {
        background: linear-gradient(to right, #34d399, #10b981);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .nd-price-label {
        color: #94a3b8;
        font-size: 13px;
      }

      .nd-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        width: 100%;
        padding: 12px;
        border-radius: 12px;
        font-weight: 600;
        font-size: 14px;
        border: none;
        cursor: pointer;
        transition: all 0.3s ease;
        margin-bottom: 12px;
      }

      .nd-btn-primary {
        background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
        color: white;
        box-shadow: 0 10px 20px -5px rgba(99, 102, 241, 0.4);
      }

      .nd-btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 15px 30px -5px rgba(99, 102, 241, 0.5);
      }

      .nd-btn-success {
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        color: white;
        box-shadow: 0 10px 20px -5px rgba(16, 185, 129, 0.4);
      }

      .nd-btn-success:hover {
        transform: translateY(-2px);
        box-shadow: 0 15px 30px -5px rgba(16, 185, 129, 0.5);
      }

      .nd-btn-outline {
        background: rgba(15, 23, 42, 0.6);
        color: #f8fafc;
        border: 1px solid rgba(148, 163, 184, 0.3);
      }

      .nd-btn-outline:hover {
        background: rgba(255,255,255,0.05);
        border-color: rgba(148, 163, 184, 0.5);
      }

      .nd-features-list {
        margin-top: 16px;
        border-top: 1px solid rgba(255,255,255,0.05);
        padding-top: 16px;
      }

      .nd-features-title {
        font-size: 13px;
        font-weight: 600;
        color: #e2e8f0;
        margin-bottom: 12px;
      }

      .nd-feature-item {
        display: flex;
        align-items: center;
        gap: 10px;
        color: #94a3b8;
        font-size: 13px;
        margin-bottom: 10px;
      }

      .nd-feature-icon {
        color: #34d399;
      }

      .nd-unlocked-state {
        text-align: center;
        padding: 20px 0;
      }

      .nd-unlocked-icon {
        color: #34d399;
        margin-bottom: 12px;
        display: inline-block;
        filter: drop-shadow(0 0 20px rgba(52, 211, 153, 0.4));
      }
    `;

    return (
        <>
            <style>{styles}</style>
            <div className="nd-detail-container">
                <Link to="/browse" className="nd-back-link">
                    <ChevronLeft size={16} /> Back to Browse
                </Link>

                <div className="nd-detail-grid">
                    {/* Left Column - Note Details */}
                    <div>
                        <div className="nd-glass-panel" style={{ marginBottom: '20px' }}>
                            <div className="nd-note-meta-primary">
                                <span className="nd-badge-subject">{note.subject}</span>
                                <span className="nd-author-info">By <strong>{note.uploadedBy}</strong> • {note.uploadedAt}</span>
                            </div>

                            <h1 className="nd-note-title">{note.title}</h1>

                            <div className="nd-stats-grid">
                                <div className="nd-stat-item">
                                    <Star size={20} className="nd-stat-icon" style={{ color: '#fbbf24' }} />
                                    <div>
                                        <div className="nd-stat-value">{note.rating} / 5.0</div>
                                        <div className="nd-stat-label">Rating</div>
                                    </div>
                                </div>
                                <div className="nd-stat-item">
                                    <Download size={20} className="nd-stat-icon" style={{ color: '#34d399' }} />
                                    <div>
                                        <div className="nd-stat-value">{note.downloads.toLocaleString()}</div>
                                        <div className="nd-stat-label">Downloads</div>
                                    </div>
                                </div>
                                <div className="nd-stat-item">
                                    <FileText size={20} className="nd-stat-icon" />
                                    <div>
                                        <div className="nd-stat-value">{note.pages}</div>
                                        <div className="nd-stat-label">Pages</div>
                                    </div>
                                </div>
                            </div>

                            <h2 className="nd-section-title">Description</h2>
                            <p className="nd-description-text">{note.description}</p>
                        </div>
                    </div>

                    {/* Right Column - Action Panel */}
                    <div>
                        <div className="nd-glass-panel nd-panel-small-padding nd-action-panel">
                            {note.isPurchased ? (
                                <div className="nd-unlocked-state">
                                    <CheckCircle size={48} className="nd-unlocked-icon" />
                                    <h3 className="nd-section-title" style={{ marginBottom: '8px' }}>Note Unlocked!</h3>
                                    <p className="nd-stat-label" style={{ marginBottom: '20px' }}>You have full access to this note.</p>
                                    <button className="nd-btn nd-btn-success" onClick={handleDownload}>
                                        <Download size={18} />
                                        Download PDF
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="nd-price-display">
                                        <div className={`nd-price-amount ${isFree ? 'nd-price-free' : ''}`}>
                                            {isFree ? 'FREE' : `₹${note.price}`}
                                        </div>
                                        <div className="nd-price-label">One-time payment</div>
                                    </div>

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

                                    <button className="nd-btn nd-btn-outline" onClick={handleWishlist}>
                                        <Heart 
                                            size={18} 
                                            fill={inWishlist ? "#ef4444" : "none"} 
                                            color={inWishlist ? "#ef4444" : "currentColor"} 
                                        />
                                        {inWishlist ? "Saved to Wishlist" : "Add to Wishlist"}
                                    </button>

                                    {!isFree && (
                                        <div className="nd-features-list">
                                            <h4 className="nd-features-title">This purchase includes:</h4>
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
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}