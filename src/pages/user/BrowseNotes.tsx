import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import toast from 'react-hot-toast';

interface Note {
  id: string;
  title: string;
  subject: string;
  category: string;
  price: number;
  uploadedBy: string;
  rating: number;
  downloads: number;
}

export default function BrowseNotes() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceFilter, setPriceFilter] = useState<'All' | 'Free' | 'Paid'>('All');
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);

  // Mock Data
  const allNotes: Note[] = [
    {
      id: "1",
      title: "Complete Data Structures & Algorithms Handwritten Notes",
      subject: "DSA",
      category: "Computer Science",
      price: 0,
      uploadedBy: "Rahul Sharma",
      rating: 4.8,
      downloads: 1240
    },
    {
      id: "2",
      title: "Operating System Full Notes with PYQs",
      subject: "OS",
      category: "Computer Science",
      price: 149,
      uploadedBy: "Priya Singh",
      rating: 4.9,
      downloads: 890
    },
    {
      id: "3",
      title: "DBMS Complete Revision Notes",
      subject: "DBMS",
      category: "Computer Science",
      price: 99,
      uploadedBy: "Amit Kumar",
      rating: 4.7,
      downloads: 650
    },
    {
      id: "4",
      title: "Mathematics Engineering Notes",
      subject: "Maths",
      category: "Mathematics",
      price: 0,
      uploadedBy: "Sneha Patel",
      rating: 4.5,
      downloads: 420
    },
    {
      id: "5",
      title: "Computer Networks Complete Guide",
      subject: "CN",
      category: "Computer Science",
      price: 199,
      uploadedBy: "Vikas Sharma",
      rating: 4.6,
      downloads: 310
    },
  ];

  const categories = ['All', 'Computer Science', 'DSA', 'Mathematics', 'Others'];

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

  const toggleWishlist = (id: string) => {
    setWishlistIds(prev => {
      if (prev.includes(id)) {
        toast.success("Removed from Wishlist");
        return prev.filter(noteId => noteId !== id);
      } else {
        toast.success("Added to Wishlist!");
        return [...prev, id];
      }
    });
  };

  const styles = `
      .browse-container {
        max-width: 1280px;
        margin: 0 auto;
      }

      .browse-header {
        display: flex;
        flex-direction: column;
        margin-bottom: 10px;
        gap: 10px;
      }

      @media (min-width: 768px) {
        .browse-header {
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
        }
      }

      .browse-title {
        font-size: 36px;
        font-weight: 700;
        color: #ffffff;
      }

      .browse-subtitle {
        color: #94a3b8;
        margin-top: 4px;
        font-size: 16px;
      }

      .filter-card {
        background: rgba(15, 23, 42, 0.8);
        backdrop-filter: blur(12px);
        border: 1px solid rgba(30, 41, 59, 1);
        border-radius: 16px;
        padding: 20px;
        margin-bottom: 32px;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
      }

      .filter-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 16px;
      }

      @media (min-width: 768px) {
        .filter-grid {
          grid-template-columns: repeat(4, 1fr);
        }
        .filter-search {
          grid-column: span 2;
        }
      }

      .form-control {
        width: 100%;
        padding: 12px 16px;
        background: rgba(30, 41, 59, 0.6);
        border: 1px solid rgba(51, 65, 85, 0.8);
        border-radius: 12px;
        color: #ffffff;
        font-size: 14px;
        outline: none;
        transition: all 0.3s ease;
      }

      .form-control:focus {
        border-color: #6366f1;
        box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
      }

      .form-control::placeholder {
        color: #64748b;
      }
      
      .form-control option {
        background: #0f172a;
        color: #fff;
      }

      .results-count {
        color: #94a3b8;
        margin-bottom: 24px;
        font-size: 14px;
      }

      .notes-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 24px;
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
        background: rgba(15, 23, 42, 0.8);
        backdrop-filter: blur(12px);
        border: 1px solid rgba(30, 41, 59, 1);
        border-radius: 16px;
        padding: 24px;
        transition: all 0.3s ease;
        display: flex;
        flex-direction: column;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      }

      .note-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2);
        border-color: rgba(99, 102, 241, 0.5);
      }

      .note-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 16px;
      }

      .badge {
        padding: 4px 12px;
        border-radius: 9999px;
        font-size: 12px;
        font-weight: 600;
      }

      .badge-subject {
        background: rgba(59, 130, 246, 0.1);
        color: #60a5fa;
        border: 1px solid rgba(59, 130, 246, 0.2);
      }

      .badge-free {
        background: rgba(16, 185, 129, 0.1);
        color: #34d399;
        border: 1px solid rgba(16, 185, 129, 0.2);
      }

      .badge-paid {
        background: rgba(249, 115, 22, 0.1);
        color: #fb923c;
        border: 1px solid rgba(249, 115, 22, 0.2);
      }

      .wishlist-btn {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 50%;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #94a3b8;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .wishlist-btn:hover {
        color: #ef4444;
        background: rgba(239, 68, 68, 0.1);
        border-color: rgba(239, 68, 68, 0.2);
        transform: scale(1.1);
      }

      .wishlist-btn.active {
        color: #ef4444;
        background: rgba(239, 68, 68, 0.1);
        border-color: rgba(239, 68, 68, 0.2);
      }

      .note-title {
        font-size: 18px;
        font-weight: 700;
        color: #ffffff;
        margin-bottom: 12px;
        line-height: 1.4;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .note-author {
        font-size: 14px;
        color: #94a3b8;
        margin-bottom: 16px;
      }

      .note-meta-flex {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 14px;
        margin-bottom: 24px;
        flex: 1;
      }

      .note-rating {
        display: flex;
        align-items: center;
        gap: 4px;
        color: #fbbf24;
        font-weight: 500;
      }

      .note-downloads {
        color: #64748b;
      }

      .note-actions {
        display: flex;
        gap: 12px;
        margin-top: auto;
      }

      .btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 10px 16px;
        border-radius: 12px;
        font-weight: 600;
        font-size: 14px;
        text-decoration: none;
        transition: all 0.3s ease;
        border: 1px solid transparent;
        cursor: pointer;
        flex: 1;
        text-align: center;
      }

      .btn-primary {
        background: #4f46e5;
        color: #ffffff;
        box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2);
      }

      .btn-primary:hover {
        background: #6366f1;
      }

      .btn-success {
        background: #10b981;
        color: #022c22;
        box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.2);
      }

      .btn-success:hover {
        background: #34d399;
      }

      .btn-secondary {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: #ffffff;
      }

      .btn-secondary:hover {
        background: rgba(255, 255, 255, 0.1);
      }

      .empty-state {
        text-align: center;
        padding: 64px 24px;
        background: rgba(15, 23, 42, 0.8);
        backdrop-filter: blur(12px);
        border: 1px solid rgba(30, 41, 59, 1);
        border-radius: 16px;
      }

      .empty-icon {
        font-size: 48px;
        margin-bottom: 16px;
      }

      .empty-title {
        font-size: 20px;
        font-weight: 600;
        color: #ffffff;
        margin-bottom: 8px;
      }

      .empty-desc {
        color: #94a3b8;
      }
    `;

  return (
    <>
      <style>{styles}</style>
      <div className="browse-container">
        <div className="browse-header">
          <div>
            <h1 className="browse-title">Browse Notes</h1>
            <p className="browse-subtitle">Discover high-quality study materials</p>
          </div>
          <Link to="/upload" className="btn btn-primary" style={{ flex: 'none', padding: '12px 24px' }}>
            + Upload Your Notes
          </Link>
        </div>

        {/* Filters */}
        <div className="filter-card">
          <div className="filter-grid">
            <div className="filter-search">
              <input
                type="text"
                className="form-control"
                placeholder="Search by title, subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
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
          </div>
        </div>

        {/* Results Count */}
        <p className="results-count">
          Showing {filteredNotes.length} notes
        </p>

        {/* Notes Grid */}
        <div className="notes-grid">
          {filteredNotes.map((note) => (
            <div key={note.id} className="note-card">
              <div className="note-header">
                <div style={{ display: 'flex', gap: '8px' }}>
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
                By {note.uploadedBy}
              </p>

              <div className="note-meta-flex">
                <div className="note-rating">
                  ⭐ <span>{note.rating}</span>
                </div>
                <div className="note-downloads">
                  {note.downloads.toLocaleString()} downloads
                </div>
              </div>

              <div className="note-actions">
                <Link to={`/browse/note/${note.id}`} className="btn btn-secondary">
                  View Details
                </Link>

                {note.price === 0 ? (
                  <button className="btn btn-success" onClick={() => toast.success("Downloading...")}>
                    Download
                  </button>
                ) : (
                  <Link to={`/checkout/${note.id}`} className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
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
            <p className="empty-desc">Try changing your filters</p>
          </div>
        )}
      </div>
    </>
  );
}