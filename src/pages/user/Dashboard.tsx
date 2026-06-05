import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../services/api';

export default function UserDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalNotes: 0,
    myPurchases: 0,
    uploadedNotes: 0,
    pendingReviews: 0
  });

  const [recentNotes, setRecentNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const [notesRes, purchasedRes, uploadsRes] = await Promise.all([
          api.get('/notes').catch(() => ({ data: [] })),
          api.get('/notes/purchased').catch(() => ({ data: [] })),
          api.get('/notes/my-uploads').catch(() => ({ data: [] }))
        ]);

        const platformNotesCount = notesRes.data?.length || 0;
        const myPurchasesCount = purchasedRes.data?.length || 0;
        const myUploads = uploadsRes.data || [];
        const myUploadsCount = myUploads.length;
        const pendingCount = myUploads.filter((n: any) => n.status === 'Pending').length;

        setStats({
          totalNotes: platformNotesCount,
          myPurchases: myPurchasesCount,
          uploadedNotes: myUploadsCount,
          pendingReviews: pendingCount
        });

        // Show latest 3 uploads as recent notes
        setRecentNotes(myUploads.slice(0, 3));
      } catch (err: any) {
        console.error("Error loading dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const styles = `
  .dashboard-container {
    max-width: 1280px;
    margin: 0 auto;
  }

  .dashboard-header {
    margin-bottom: 40px;
  }

  .dashboard-header h1 {
    font-size: 36px;
    font-weight: 700;
    color: #0f172a;
  }
  .dark .dashboard-header h1 {
    color: #ffffff;
  }

  .dashboard-header p {
    color: #475569;
    margin-top: 8px;
    font-size: 16px;
  }
  .dark .dashboard-header p {
    color: #94a3b8;
  }

  .dash-stats-grid {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 16px;
    margin-bottom: 24px;
  }

  @media (min-width: 768px) {
    .dash-stats-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (min-width: 1024px) {
    .dash-stats-grid {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  .dash-stat-card {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 16px;
    text-align: center;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  }
  .dark .dash-stat-card {
    background: rgba(15, 23, 42, 0.8);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(30, 41, 59, 1);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  }

  .dash-stat-value {
    font-size: 28px;
    font-weight: 700;
  }

  .dash-stat-label {
    color: #94a3b8;
    margin-top: 8px;
    font-weight: 500;
  }

  .text-indigo { color: #818cf8; }
  .text-emerald { color: #34d399; }
  .text-purple { color: #c084fc; }
  .text-orange { color: #fb923c; }

  /* Main Grid */
  .main-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
  }

  @media (min-width: 1024px) {
    .main-grid {
      grid-template-columns: repeat(12, 1fr);
    }
  }

  .quick-actions-col {
    grid-column: span 4;
  }

  .recent-notes-col {
    grid-column: span 8;
  }

  .dashboard-card {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .dark .dashboard-card {
    background: rgba(15, 23, 42, 0.8);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(30, 41, 59, 1);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  }

  .card-title {
    font-size: 18px;
    font-weight: 700;
    color: #0f172a;
    margin-bottom: 16px;
  }
  .dark .card-title {
    color: #ffffff;
  }

  /* Buttons */
  .action-btn {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 10px 14px;
    border-radius: 10px;
    font-weight: 500;
    text-decoration: none;
    transition: all 0.3s ease;
    margin-bottom: 8px;
  }

  .action-btn:last-child {
    margin-bottom: 0;
  }

  .btn-primary {
    background: #4f46e5;
    color: #ffffff;
    box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.2);
    border: 1px solid transparent;
  }

  .btn-primary:hover {
    background: #6366f1;
  }

  .btn-secondary {
    background: #f1f5f9;
    border: 1px solid #cbd5e1;
    color: #334155;
  }
  .dark .btn-secondary {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #ffffff;
  }

  .btn-secondary:hover {
    background: #e2e8f0;
  }
  .dark .btn-secondary:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  .btn-icon {
    font-size: 18px;
  }

  /* Recent Notes List */
  .notes-list {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .note-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 16px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    transition: all 0.3s ease;
  }
  .dark .note-item {
    background: rgba(30, 41, 59, 0.4);
    border: 1px solid rgba(51, 65, 85, 0.5);
  }

  .note-item:hover {
    background: #f1f5f9;
  }
  .dark .note-item:hover {
    background: rgba(30, 41, 59, 0.8);
  }

  .note-title {
    font-weight: 600;
    color: #0f172a;
    font-size: 16px;
  }
  .dark .note-title {
    color: #ffffff;
  }

  .note-meta {
    font-size: 14px;
    color: #94a3b8;
    margin-top: 4px;
  }

  .status-badge {
    padding: 6px 16px;
    border-radius: 9999px;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.5px;
  }

  .status-approved {
    background: rgba(16, 185, 129, 0.1);
    color: #34d399;
    border: 1px solid rgba(16, 185, 129, 0.2);
  }

  .status-pending {
    background: rgba(234, 179, 8, 0.1);
    color: #facc15;
    border: 1px solid rgba(234, 179, 8, 0.2);
  }

  .view-all-container {
    margin-top: 32px;
    text-align: center;
  }

  .btn-outline {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: #ffffff;
    border: 1px solid #cbd5e1;
    color: #0f172a;
    padding: 10px 24px;
    border-radius: 9999px;
    font-weight: 500;
    font-size: 14px;
    text-decoration: none;
    transition: all 0.3s ease;
  }
  .dark .btn-outline {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #ffffff;
  }

  .btn-outline:hover {
    background: #f1f5f9;
  }
  .dark .btn-outline:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  /* Teaser Cards */
  .teaser-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 24px;
    margin-top: 32px;
  }

  @media (min-width: 768px) {
    .teaser-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  .teaser-card {
    border-radius: 16px;
    padding: 32px;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(4px);
  }

  .teaser-free {
    background: linear-gradient(135deg, rgba(6, 78, 59, 0.6) 0%, rgba(19, 78, 74, 0.4) 100%);
    border: 1px solid rgba(16, 185, 129, 0.3);
  }

  .teaser-premium {
    background: linear-gradient(135deg, rgba(49, 46, 129, 0.6) 0%, rgba(88, 28, 135, 0.4) 100%);
    border: 1px solid rgba(99, 102, 241, 0.3);
  }

  .teaser-title {
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 8px;
  }

  .teaser-free .teaser-title { color: #34d399; }
  .teaser-premium .teaser-title { color: #818cf8; }

  .teaser-desc {
    font-weight: 500;
    margin-bottom: 32px;
  }

  .teaser-free .teaser-desc { color: rgba(209, 250, 229, 0.7); }
  .teaser-premium .teaser-desc { color: rgba(224, 231, 255, 0.7); }

  .btn-success {
    display: inline-block;
    background: #10b981;
    color: #022c22;
    padding: 12px 24px;
    border-radius: 12px;
    font-weight: 700;
    text-decoration: none;
    box-shadow: 0 10px 15px -3px rgba(16, 185, 129, 0.2);
    transition: all 0.3s ease;
    border: 1px solid transparent;
  }

  .btn-success:hover {
    background: #34d399;
  }

  .btn-premium {
    display: inline-block;
    background: #6366f1;
    color: #ffffff;
    padding: 12px 24px;
    border-radius: 12px;
    font-weight: 700;
    text-decoration: none;
    box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.2);
    transition: all 0.3s ease;
    border: 1px solid transparent;
  }

  .btn-premium:hover {
    background: #818cf8;
  }
`;

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', fontFamily: 'Inter, sans-serif' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '3px solid rgba(168, 85, 247, 0.1)',
            borderTop: '3px solid #a855f7',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          <p style={{ color: '#94a3b8', fontSize: '14px', fontWeight: 500 }}>Syncing your academic profile...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="dashboard-container">
        
        {/* Stats Cards */}
        <div className="dash-stats-grid">
          <div className="dash-stat-card">
            <p className="dash-stat-value text-indigo">{stats.totalNotes}</p>
            <p className="dash-stat-label">Total Notes</p>
          </div>

          <div className="dash-stat-card">
            <p className="dash-stat-value text-emerald">{stats.myPurchases}</p>
            <p className="dash-stat-label">My Purchases</p>
          </div>

          <div className="dash-stat-card">
            <p className="dash-stat-value text-purple">{stats.uploadedNotes}</p>
            <p className="dash-stat-label">My Uploads</p>
          </div>

          <div className="dash-stat-card">
            <p className="dash-stat-value text-orange">{stats.pendingReviews}</p>
            <p className="dash-stat-label">Pending Review</p>
          </div>
        </div>

        <div className="main-grid">
          {/* Quick Actions */}
          <div className="quick-actions-col">
            <div className="dashboard-card">
              <h3 className="card-title">Quick Actions</h3>
              <div>
                <Link to="/browse" className="action-btn btn-primary">
                  <span className="btn-icon">🔍</span> Browse All Notes
                </Link>

                <Link to="/upload" className="action-btn btn-secondary">
                  <span className="btn-icon">📤</span> Upload New Notes
                </Link>

                <Link to="/my-purchases" className="action-btn btn-secondary">
                  <span className="btn-icon">📚</span> My Purchased Notes
                </Link>

                <Link to="/my-uploads" className="action-btn btn-secondary">
                  <span className="btn-icon">📝</span> Track My Uploads
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="recent-notes-col">
            <div className="dashboard-card">
              <h3 className="card-title">Recent Uploads</h3>
              <div className="notes-list">
                {recentNotes.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '36px 0', color: '#64748b' }}>
                    <p style={{ fontSize: '32px', marginBottom: '8px' }}>📂</p>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: '#f8fafc' }}>No uploads yet</p>
                    <p style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>Your uploaded files will appear here.</p>
                  </div>
                ) : (
                  recentNotes.map((note) => (
                    <div key={note.id} className="note-item">
                      <div>
                        <h4 className="note-title">{note.title}</h4>
                        <p className="note-meta">{note.subject} • {note.price === 0 ? "Free" : `₹${note.price}`}</p>
                      </div>
                      <div className={`status-badge ${note.status === 'Approved' ? 'status-approved' : 'status-pending'}`}>
                        {note.status}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="view-all-container">
                <Link to="/my-uploads" className="btn-outline">
                  View All Uploads →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Free vs Paid Section Teaser */}
        <div className="teaser-grid">
          <div className="teaser-card teaser-free">
            <h3 className="teaser-title">Free Notes</h3>
            <p className="teaser-desc">High quality free study materials</p>
            <Link to="/browse?type=free" className="btn-success">
              Explore Free Notes
            </Link>
          </div>

          <div className="teaser-card teaser-premium">
            <h3 className="teaser-title">Premium Notes</h3>
            <p className="teaser-desc">Expert curated paid notes</p>
            <Link to="/browse?type=paid" className="btn-premium">
              Browse Premium Notes
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}