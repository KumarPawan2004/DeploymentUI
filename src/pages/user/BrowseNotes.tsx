import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Search, Download, Star, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

interface Note {
  id: string;
  title: string;
  subject: string;
  category: string;
  price: number;
  uploadedBy: string;
  rating: number;
  downloads: number;
  fileName: string;
}

export default function BrowseNotes() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceFilter, setPriceFilter] = useState<'All' | 'Free' | 'Paid'>('All');
  
  const [allNotes, setAllNotes] = useState<Note[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBrowseData = async () => {
      try {
        setLoading(true);
        const [notesRes, catsRes, wishlistRes] = await Promise.all([
          api.get('/notes'),
          api.get('/categories'),
          api.get('/notes/wishlist').catch(() => ({ data: [] }))
        ]);

        if (notesRes.data) {
          const mappedNotes = notesRes.data.map((n: any) => ({
            id: n.id.toString(),
            title: n.title,
            subject: n.subject,
            category: n.category,
            price: n.price,
            uploadedBy: n.uploaderName || "Anonymous",
            rating: 4.8, // Default decorative academic rating
            downloads: n.downloads || 0,
            fileName: n.fileName || "document.pdf"
          }));
          setAllNotes(mappedNotes);
        }

        if (catsRes.data) {
          const loadedCats = ['All', ...catsRes.data.map((c: any) => c.name)];
          setCategories(loadedCats);
        }

        if (wishlistRes.data) {
          setWishlistIds(wishlistRes.data.map((w: any) => w.id.toString()));
        }
      } catch (err: any) {
        console.error("Error fetching browse data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadBrowseData();
  }, []);

  const filteredNotes = allNotes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.subject.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || note.category === selectedCategory;

    const matchesPrice =
      priceFilter === 'All' ||
      (priceFilter === 'Free' && note.price === 0) ||
      (priceFilter === 'Paid' && note.price > 0);

    return matchesSearch && matchesCategory && matchesPrice;
  });

  const toggleWishlist = async (id: string) => {
    try {
      if (wishlistIds.includes(id)) {
        // Toggle client-side since only POST is defined in endpoint
        setWishlistIds(prev => prev.filter(noteId => noteId !== id));
        toast.success("Removed from Wishlist");
      } else {
        await api.post(`/notes/wishlist/${id}`);
        setWishlistIds(prev => [...prev, id]);
        toast.success("Added to Wishlist!");
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to update wishlist");
    }
  };

  const handleDownload = async (id: string, fileName: string) => {
    try {
      toast.loading("Initiating download...", { id: "download" });
      const response = await api.get(`/notes/download/${id}`, {
        responseType: 'blob'
      });
      
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Downloaded successfully!", { id: "download" });
    } catch (err: any) {
      console.error("Download error:", err);
      toast.error("You must purchase this premium note first to download it.", { id: "download" });
    }
  };

  const styles = `
      .browse-wrapper {
        position: relative;
        min-height: 100vh;
        overflow: visible;
        padding: 24px 0;
        font-family: 'Outfit', 'Inter', sans-serif;
      }

      .ambient-blur-1 {
        position: absolute;
        top: -10%;
        left: 5%;
        width: 400px;
        height: 400px;
        background: radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, rgba(168, 85, 247, 0) 70%);
        filter: blur(90px);
        z-index: 0;
        pointer-events: none;
        animation: pulseOrb 15s ease-in-out infinite alternate;
      }

      .ambient-blur-2 {
        position: absolute;
        bottom: 10%;
        right: 5%;
        width: 450px;
        height: 450px;
        background: radial-gradient(circle, rgba(236, 72, 153, 0.08) 0%, rgba(99, 102, 241, 0) 70%);
        filter: blur(110px);
        z-index: 0;
        pointer-events: none;
        animation: pulseOrb 18s ease-in-out infinite alternate-reverse;
      }

      @keyframes pulseOrb {
        0% { transform: translate(0, 0) scale(1); }
        100% { transform: translate(40px, -30px) scale(1.15); }
      }

      .browse-container {
        max-width: 1280px;
        margin: 0 auto;
        padding: 0 24px;
        position: relative;
        z-index: 1;
      }



      @media (min-width: 768px) {
        .browse-header {
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
        }
      }

      .browse-title-group {
        position: relative;
      }

      .browse-title {
        font-size: 40px;
        font-weight: 800;
        background: linear-gradient(135deg, #0f172a 40%, #3b82f6 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        letter-spacing: -0.8px;
        margin: 0;
      }
      .dark .browse-title {
        background: linear-gradient(135deg, #ffffff 40%, #a5b4fc 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .browse-subtitle {
        color: #475569;
        margin-top: 6px;
        font-size: 15px;
        font-weight: 500;
        margin-bottom: 0;
      }
      .dark .browse-subtitle {
        color: #94a3b8;
      }

      .filter-card {
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        padding: 12px;
        margin-bottom: 16px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
      }
      .dark .filter-card {
        background: rgba(15, 23, 42, 0.4);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.08);
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.05);
      }

      .filter-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 16px;
      }

      @media (min-width: 768px) {
        .filter-grid {
          grid-template-columns: repeat(5, 1fr);
        }
        .filter-search {
          grid-column: span 2;
        }
      }

      .search-wrapper {
        position: relative;
        display: flex;
        align-items: center;
      }

      .search-icon {
        position: absolute;
        left: 16px;
        color: #64748b;
        pointer-events: none;
        transition: color 0.3s;
      }

      .form-control {
        width: 100%;
        padding: 8px 12px;
        background: #f8fafc;
        border: 1px solid #cbd5e1;
        border-radius: 8px;
        color: #0f172a;
        font-size: 12px;
        font-weight: 500;
        outline: none;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      .dark .form-control {
        background: rgba(15, 23, 42, 0.5);
        border: 1px solid rgba(255, 255, 255, 0.08);
        color: #ffffff;
      }

      .form-control-search {
        padding-left: 46px;
      }

      .form-control:focus {
        border-color: #818cf8;
        box-shadow: 0 0 0 3px rgba(129, 140, 248, 0.15);
        background: #ffffff;
      }
      .dark .form-control:focus {
        border-color: #818cf8;
        box-shadow: 0 0 0 3px rgba(129, 140, 248, 0.15), inset 0 1px 1px rgba(255, 255, 255, 0.02);
        background: rgba(15, 23, 42, 0.8);
      }

      .search-wrapper:focus-within .search-icon {
        color: #818cf8;
      }

      .form-control::placeholder {
        color: #64748b;
      }
      .dark .form-control::placeholder {
        color: #475569;
      }
      
      .form-control option {
        background: #ffffff;
        color: #0f172a;
      }
      .dark .form-control option {
        background: #0f172a;
        color: #fff;
      }

      .results-count {
        color: #64748b;
        margin-bottom: 24px;
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 1px;
        text-transform: uppercase;
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .notes-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 12px;
      }

      @media (min-width: 768px) {
        .notes-grid {
          grid-template-columns: repeat(2, 1fr);
        }
      }

      @media (min-width: 1024px) {
        .notes-grid {
          grid-template-columns: repeat(3, 1fr);
        }
      }

      .note-card {
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        padding: 16px;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        display: flex;
        flex-direction: column;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        position: relative;
        overflow: hidden;
      }
      .dark .note-card {
        background: linear-gradient(135deg, rgba(30, 41, 59, 0.3) 0%, rgba(15, 23, 42, 0.5) 100%);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.06);
        box-shadow: 0 15px 35px -10px rgba(0, 0, 0, 0.3);
      }

      .note-card::before {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: 12px;
        padding: 1px;
        background: linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.01) 50%, rgba(99,102,241,0.04));
        -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        mask-composite: exclude;
        pointer-events: none;
        transition: opacity 0.4s;
      }

      .note-card:hover {
        transform: translateY(-6px);
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 24px 0 rgba(99, 102, 241, 0.08);
        border-color: rgba(99, 102, 241, 0.2);
      }

      .note-card:hover::before {
        background: linear-gradient(135deg, rgba(129, 140, 248, 0.35), rgba(255, 255, 255, 0.02) 50%, rgba(168, 85, 247, 0.25));
      }

      .note-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 12px;
        z-index: 1;
      }

      .badge-flex {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }

      .badge {
        padding: 5px 12px;
        border-radius: 9999px;
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.5px;
        text-transform: uppercase;
        backdrop-filter: blur(4px);
      }

      .badge-subject {
        background: rgba(99, 102, 241, 0.1);
        color: #a5b4fc;
        border: 1px solid rgba(99, 102, 241, 0.25);
      }

      .badge-free {
        background: rgba(16, 185, 129, 0.1);
        color: #34d399;
        border: 1px solid rgba(16, 185, 129, 0.25);
      }

      .badge-paid {
        background: rgba(249, 115, 22, 0.1);
        color: #fdba74;
        border: 1px solid rgba(249, 115, 22, 0.25);
      }

      .wishlist-btn {
        background: #f1f5f9;
        border: 1px solid #e2e8f0;
        border-radius: 50%;
        width: 34px;
        height: 34px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #64748b;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        z-index: 1;
      }
      .dark .wishlist-btn {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.08);
        color: #94a3b8;
      }

      .wishlist-btn:hover {
        color: #ef4444;
        background: rgba(239, 68, 68, 0.1);
        border-color: rgba(239, 68, 68, 0.2);
        transform: scale(1.1);
      }

      .wishlist-btn.active {
        color: #ef4444;
        background: rgba(239, 68, 68, 0.12);
        border-color: rgba(239, 68, 68, 0.25);
      }

      .note-title {
        font-size: 19px;
        font-weight: 700;
        color: #0f172a;
        margin-bottom: 8px;
        line-height: 1.4;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        z-index: 1;
        transition: color 0.3s;
      }
      .dark .note-title {
        color: #ffffff;
      }

      .note-card:hover .note-title {
        color: #4f46e5;
      }
      .dark .note-card:hover .note-title {
        color: #a5b4fc;
      }

      .note-author {
        font-size: 13px;
        color: #475569;
        margin-bottom: 18px;
        font-weight: 500;
        z-index: 1;
      }
      .dark .note-author {
        color: #64748b;
      }
      
      .note-author strong {
        color: #0f172a;
      }
      .dark .note-author strong {
        color: #94a3b8;
      }

      .note-meta-flex {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: auto;
        padding-top: 12px;
        border-top: 1px solid #e2e8f0;
        z-index: 1;
      }
      .dark .note-meta-flex {
        border-top: 1px solid rgba(255, 255, 255, 0.04);
      }

      .rating-badge {
        display: flex;
        align-items: center;
        gap: 4px;
        color: #eab308;
        font-weight: 600;
        font-size: 11px;
      }

      .note-downloads {
        color: #64748b;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 11px;
      }

      .card-actions {
        display: flex;
        gap: 8px;
        margin-top: 12px;
        z-index: 1;
      }

      .btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        padding: 8px 12px;
        border-radius: 8px;
        font-weight: 700;
        font-size: 12px;
        text-decoration: none;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        border: 1px solid transparent;
        cursor: pointer;
        flex: 1;
        text-align: center;
      }

      .btn-primary {
        background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
        color: #ffffff;
        box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
      }

      .btn-primary:hover {
        background: linear-gradient(135deg, #818cf8 0%, #6366f1 100%);
        box-shadow: 0 6px 16px rgba(99, 102, 241, 0.3);
        transform: translateY(-2px);
      }

      .btn-success {
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        color: #ffffff;
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
      }

      .btn-success:hover {
        background: linear-gradient(135deg, #34d399 0%, #10b981 100%);
        box-shadow: 0 6px 16px rgba(16, 185, 129, 0.3);
        transform: translateY(-2px);
      }

      .btn-secondary {
        background: #f1f5f9;
        border: 1px solid #cbd5e1;
        color: #334155;
      }
      .dark .btn-secondary {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.08);
        color: #cbd5e1;
      }

      .btn-secondary:hover {
        background: #e2e8f0;
        border-color: #94a3b8;
        transform: translateY(-2px);
        color: #0f172a;
      }
      .dark .btn-secondary:hover {
        background: rgba(255, 255, 255, 0.08);
        border-color: rgba(255, 255, 255, 0.15);
        color: #ffffff;
      }

      .empty-state {
        text-align: center;
        padding: 50px 20px;
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 16px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
      }
      .dark .empty-state {
        background: rgba(15, 23, 42, 0.25);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.05);
        box-shadow: 0 20px 45px -15px rgba(0, 0, 0, 0.35);
      }

      .empty-icon {
        font-size: 48px;
        margin-bottom: 16px;
      }

      .empty-title {
        font-size: 18px;
        font-weight: 700;
        color: #0f172a;
        margin-bottom: 8px;
      }
      .dark .empty-title {
        color: #ffffff;
      }

      .empty-desc {
        color: #64748b;
        font-size: 14px;
        max-width: 350px;
        margin: 0 auto;
      }
    `;

  return (
    <div className="browse-wrapper">
      <div className="ambient-blur-1"></div>
      <div className="ambient-blur-2"></div>
      <style>{styles}</style>
      
      <div className="browse-container">
        {/* Filters */}
        <div className="filter-card">
          <div className="filter-grid">
            <div className="filter-search">
              <div className="search-wrapper">
                <Search size={18} className="search-icon" />
                <input
                  type="text"
                  className="form-control form-control-search"
                  placeholder="Search by title, subject..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <select
              className="form-control"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <select
              className="form-control"
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value as 'All' | 'Free' | 'Paid')}
            >
              <option value="All">All Notes</option>
              <option value="Free">Free Only</option>
              <option value="Paid">Paid Only</option>
            </select>

            <Link 
              to="/upload" 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', 
                color: '#ffffff', 
                padding: '8px', 
                borderRadius: '8px', 
                fontSize: '12px', 
                fontWeight: 600, 
                textDecoration: 'none',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(99, 102, 241, 0.35)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.25)';
              }}
            >
              + Upload Note
            </Link>
          </div>
        </div>

        {/* Results Count */}
        <p className="results-count">
          <Sparkles size={14} style={{ color: '#818cf8' }} /> Showing {filteredNotes.length} matching notes
        </p>

        {/* Notes Grid */}
        <div className="notes-grid">
          {filteredNotes.map((note) => (
            <div key={note.id} className="note-card">
              <div className="note-header">
                <div className="badge-flex">
                  <div className="badge badge-subject">
                    {note.subject}
                  </div>
                  <div className={`badge ${note.price === 0 ? 'badge-free' : 'badge-paid'}`}>
                    {note.price === 0 ? 'FREE' : `₹${note.price}`}
                  </div>
                </div>
                <button 
                  className={`wishlist-btn ${wishlistIds.includes(note.id) ? 'active' : ''}`}
                  onClick={() => toggleWishlist(note.id)}
                  title="Add to Wishlist"
                >
                  <Heart 
                    size={16} 
                    fill={wishlistIds.includes(note.id) ? "#ef4444" : "none"} 
                  />
                </button>
              </div>

              <h3 className="note-title">
                {note.title}
              </h3>

              <p className="note-author">
                By <strong>{note.uploadedBy}</strong>
              </p>

              <div className="note-meta-flex">
                <div className="rating-badge">
                  <Star size={14} fill="#fbbf24" stroke="none" /> <span>{note.rating}</span>
                </div>
                <div className="note-downloads">
                  <Download size={14} /> <span>{note.downloads.toLocaleString()} downloads</span>
                </div>
              </div>

              <div className="card-actions">
                <Link to={`/browse/note/${note.id}`} className="btn btn-secondary">
                  View Details
                </Link>

                {note.price === 0 ? (
                  <button className="btn btn-success" onClick={() => handleDownload(note.id, note.fileName)}>
                    <Download size={14} /> Download
                  </button>
                ) : (
                  <Link to={`/checkout/${note.id}`} className="btn btn-primary">
                    Buy ₹{note.price}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredNotes.length === 0 && (
          <div className="empty-state">
            <p className="empty-icon">😔</p>
            <p className="empty-title">No notes found</p>
            <p className="empty-desc">Try changing your filters or checking your search spelling</p>
          </div>
        )}
      </div>
    </div>
  );
}