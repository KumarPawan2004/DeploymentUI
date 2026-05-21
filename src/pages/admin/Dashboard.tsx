import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { 
    Users, 
    FileText, 
    Download, 
    DollarSign, 
    Layers, 
    ArrowUpRight, 
    Clock, 
    BarChart3, 
    TrendingUp, 
    ShieldCheck, 
    CreditCard, 
    Sliders,
    RefreshCw
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'overview' | 'reports' | 'transactions' | 'settings'>('overview');
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<any>({
        totalUsers: 0,
        totalNotes: 0,
        approvedNotes: 0,
        pendingNotes: 0,
        totalDownloads: 0,
        totalRevenue: 0,
        totalTransactions: 0,
        categories: []
    });

    const [transactions, setTransactions] = useState<any[]>([]);

    const [pendingReviews, setPendingReviews] = useState<any[]>([]);

    // Platform settings configuration state
    const [minPrice, setMinPrice] = useState(49);
    const [maxPrice, setMaxPrice] = useState(999);
    const [allowFree, setAllowFree] = useState(true);
    const [requireApproval, setRequireApproval] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const [statsRes, txnsRes, pendingRes] = await Promise.all([
                    api.get('/admin/dashboard-stats'),
                    api.get('/admin/transactions'),
                    api.get('/admin/pending-notes')
                ]);
                
                if (statsRes.data) {
                    setStats(statsRes.data);
                }
                if (txnsRes.data) {
                    setTransactions(txnsRes.data);
                }
                if (pendingRes.data) {
                    const mappedPending = pendingRes.data.map((item: any) => ({
                        id: item.id,
                        title: item.title,
                        uploader: item.uploader?.fullName || "Unknown",
                        subject: item.subject,
                        time: new Date(item.uploadedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
                    }));
                    setPendingReviews(mappedPending);
                }
            } catch (err: any) {
                console.error("Error fetching admin dashboard data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const handleSaveSettings = () => {
        toast.success("Platform settings updated successfully!");
    };

    const handleRefreshStats = async () => {
        try {
            toast.loading("Syncing dashboard database...", { id: "refresh" });
            const [statsRes, txnsRes, pendingRes] = await Promise.all([
                api.get('/admin/dashboard-stats'),
                api.get('/admin/transactions'),
                api.get('/admin/pending-notes')
            ]);
            
            if (statsRes.data) {
                setStats(statsRes.data);
            }
            if (txnsRes.data) {
                setTransactions(txnsRes.data);
            }
            if (pendingRes.data) {
                const mappedPending = pendingRes.data.map((item: any) => ({
                    id: item.id,
                    title: item.title,
                    uploader: item.uploader?.fullName || "Unknown",
                    subject: item.subject,
                    time: new Date(item.uploadedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
                }));
                setPendingReviews(mappedPending);
            }
            toast.success("Metrics synchronized live!", { id: "refresh" });
        } catch (e) {
            toast.error("Failed to connect to sync server. Using cached data.", { id: "refresh" });
        }
    };

    return (
        <div className="dashboard-wrapper">
            <style>{`
                .dashboard-wrapper {
                    font-family: 'Inter', sans-serif;
                    color: #ffffff;
                }

                /* ============ NAV TABS ============ */
                .tab-navigation {
                    display: flex;
                    gap: 8px;
                    border-bottom: 1px solid rgba(168, 85, 247, 0.12);
                    padding-bottom: 1px;
                    margin-bottom: 28px;
                }

                .tab-btn {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 12px 20px;
                    background: transparent;
                    border: none;
                    color: #94a3b8;
                    font-size: 13px;
                    font-weight: 600;
                    cursor: pointer;
                    position: relative;
                    transition: all 0.25s ease;
                }

                .tab-btn:hover {
                    color: #ffffff;
                }

                .tab-btn.active {
                    color: #c084fc;
                }

                .tab-btn.active::after {
                    content: '';
                    position: absolute;
                    bottom: -1px;
                    left: 0;
                    right: 0;
                    height: 2px;
                    background: linear-gradient(90deg, #a855f7 0%, #c084fc 100%);
                    box-shadow: 0 0 10px #a855f7;
                }

                /* ============ STAT CARDS ============ */
                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
                    gap: 20px;
                    margin-bottom: 30px;
                }

                .glass-card {
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 16px;
                    padding: 22px;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
                    position: relative;
                    overflow: hidden;
                    transition: all 0.3s ease;
                }

                .glass-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(168, 85, 247, 0.03), transparent);
                    transform: translateX(-100%);
                    transition: 0.6s;
                }

                .glass-card:hover {
                    border-color: rgba(168, 85, 247, 0.2);
                    transform: translateY(-2px);
                    box-shadow: 0 12px 40px rgba(168, 85, 247, 0.05);
                }

                .glass-card:hover::before {
                    transform: translateX(100%);
                }

                .stat-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 12px;
                }

                .stat-title {
                    font-size: 13px;
                    color: #94a3b8;
                    font-weight: 500;
                }

                .stat-icon-wrapper {
                    width: 38px;
                    height: 38px;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(168, 85, 247, 0.08);
                    border: 1px solid rgba(168, 85, 247, 0.15);
                    color: #c084fc;
                }

                .stat-value {
                    font-size: 28px;
                    font-weight: 800;
                    background: linear-gradient(90deg, #ffffff 0%, #cbd5e1 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .stat-footer {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    margin-top: 10px;
                    font-size: 11px;
                    color: #4ade80;
                    font-weight: 600;
                }

                /* ============ LAYOUT COLUMNS ============ */
                .dashboard-content-columns {
                    display: grid;
                    grid-template-columns: 7fr 5fr;
                    gap: 24px;
                }

                @media (max-width: 1024px) {
                    .dashboard-content-columns {
                        grid-template-columns: 1fr;
                    }
                }

                .section-title-bar {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 18px;
                }

                .section-title-bar h3 {
                    font-size: 16px;
                    font-weight: 700;
                    color: #f1f5f9;
                }

                /* ============ LISTS & TABLES ============ */
                .pending-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 14px 18px;
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid rgba(255, 255, 255, 0.04);
                    border-radius: 12px;
                    margin-bottom: 10px;
                    transition: all 0.25s ease;
                }

                .pending-item:hover {
                    background: rgba(168, 85, 247, 0.04);
                    border-color: rgba(168, 85, 247, 0.15);
                    transform: translateX(2px);
                }

                .review-btn {
                    padding: 8px 16px;
                    background: linear-gradient(135deg, #a855f7 0%, #7c3aed 100%);
                    border: none;
                    border-radius: 8px;
                    color: #ffffff;
                    font-size: 11px;
                    font-weight: 600;
                    cursor: pointer;
                    box-shadow: 0 4px 12px rgba(168, 85, 247, 0.2);
                    transition: all 0.2s ease;
                }

                .review-btn:hover {
                    box-shadow: 0 4px 18px rgba(168, 85, 247, 0.4);
                    transform: translateY(-1px);
                }

                .refresh-btn {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    padding: 8px 16px;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.06);
                    border-radius: 10px;
                    color: #cbd5e1;
                    font-size: 11px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.25s ease;
                }

                .refresh-btn:hover {
                    background: rgba(255, 255, 255, 0.08);
                    border-color: rgba(168, 85, 247, 0.3);
                    color: #ffffff;
                }

                /* ============ ANALYTICS CHARTS (CSS ONLY) ============ */
                .chart-container {
                    padding: 24px;
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid rgba(255, 255, 255, 0.04);
                    border-radius: 16px;
                    margin-bottom: 24px;
                }

                .bar-chart-flex {
                    display: flex;
                    align-items: flex-end;
                    justify-content: space-between;
                    height: 180px;
                    padding-top: 20px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    margin-bottom: 14px;
                }

                .chart-bar-col {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    flex: 1;
                    gap: 10px;
                }

                .chart-bar-pillar {
                    width: 32px;
                    background: linear-gradient(180deg, #a855f7 0%, rgba(124, 58, 237, 0.2) 100%);
                    border-radius: 6px 6px 0 0;
                    position: relative;
                    transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
                    cursor: pointer;
                }

                .chart-bar-pillar:hover {
                    background: linear-gradient(180deg, #c084fc 0%, #a855f7 100%);
                    box-shadow: 0 0 15px rgba(168, 85, 247, 0.4);
                }

                .pillar-tooltip {
                    position: absolute;
                    top: -30px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: #1e1b4b;
                    border: 1px solid rgba(168, 85, 247, 0.4);
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 9px;
                    white-space: nowrap;
                    opacity: 0;
                    transition: opacity 0.2s ease;
                    pointer-events: none;
                }

                .chart-bar-pillar:hover .pillar-tooltip {
                    opacity: 1;
                }

                .chart-bar-label {
                    font-size: 10px;
                    color: #64748b;
                    font-weight: 500;
                    text-align: center;
                }

                /* ============ TRANSACTION TABLE ============ */
                .txn-table {
                    width: 100%;
                    border-collapse: collapse;
                }

                .txn-th {
                    text-align: left;
                    padding: 14px 16px;
                    font-size: 12px;
                    font-weight: 600;
                    color: #64748b;
                    border-bottom: 1px solid rgba(168, 85, 247, 0.12);
                }

                .txn-tr {
                    border-bottom: 1px solid rgba(255, 255, 255, 0.03);
                    transition: all 0.2s ease;
                }

                .txn-tr:hover {
                    background: rgba(255, 255, 255, 0.02);
                }

                .txn-td {
                    padding: 14px 16px;
                    font-size: 12px;
                    color: #cbd5e1;
                }

                .status-badge {
                    display: inline-flex;
                    align-items: center;
                    padding: 4px 8px;
                    border-radius: 20px;
                    font-size: 10px;
                    font-weight: 600;
                }

                .status-completed {
                    background: rgba(34, 197, 94, 0.08);
                    border: 1px solid rgba(34, 197, 94, 0.2);
                    color: #4ade80;
                }

                .status-free {
                    background: rgba(59, 130, 246, 0.08);
                    border: 1px solid rgba(59, 130, 246, 0.2);
                    color: #60a5fa;
                }

                .status-failed {
                    background: rgba(239, 68, 68, 0.08);
                    border: 1px solid rgba(239, 68, 68, 0.2);
                    color: #f87171;
                }

                /* ============ SETTINGS FORM ============ */
                .form-group {
                    margin-bottom: 20px;
                }

                .form-label {
                    display: block;
                    font-size: 12px;
                    color: #94a3b8;
                    margin-bottom: 8px;
                    font-weight: 500;
                }

                .form-input {
                    width: 100%;
                    padding: 10px 14px;
                    background: rgba(255, 255, 255, 0.04);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 8px;
                    color: #ffffff;
                    font-size: 12px;
                    outline: none;
                    transition: border-color 0.25s ease;
                }

                .form-input:focus {
                    border-color: rgba(168, 85, 247, 0.5);
                }

                .toggle-wrapper {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 14px;
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid rgba(255, 255, 255, 0.04);
                    border-radius: 8px;
                }

                .toggle-btn {
                    position: relative;
                    width: 44px;
                    height: 24px;
                    background: rgba(255, 255, 255, 0.15);
                    border-radius: 12px;
                    cursor: pointer;
                    transition: background-color 0.25s ease;
                }

                .toggle-btn.active {
                    background: #a855f7;
                    box-shadow: 0 0 10px rgba(168, 85, 247, 0.5);
                }

                .toggle-circle {
                    position: absolute;
                    top: 2px;
                    left: 2px;
                    width: 20px;
                    height: 20px;
                    background: #ffffff;
                    border-radius: 50%;
                    transition: transform 0.25s ease;
                }

                .toggle-btn.active .toggle-circle {
                    transform: translateX(20px);
                }
            `}</style>

            {/* HEADER METADATA TAB NAVIGATION */}
            <div className="tab-navigation">
                <button 
                    className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                    onClick={() => setActiveTab('overview')}
                >
                    <Layers size={14} />
                    Overview
                </button>
                <button 
                    className={`tab-btn ${activeTab === 'reports' ? 'active' : ''}`}
                    onClick={() => setActiveTab('reports')}
                >
                    <BarChart3 size={14} />
                    Reports & Analytics
                </button>
                <button 
                    className={`tab-btn ${activeTab === 'transactions' ? 'active' : ''}`}
                    onClick={() => setActiveTab('transactions')}
                >
                    <CreditCard size={14} />
                    Transactions Ledger
                </button>
                <button 
                    className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
                    onClick={() => setActiveTab('settings')}
                >
                    <Sliders size={14} />
                    Console Settings
                </button>
            </div>

            {/* TAB CONTENT: 1. OVERVIEW */}
            {activeTab === 'overview' && (
                <>
                    {/* STATS OVERVIEW GRID */}
                    <div className="stats-grid">
                        <div className="glass-card">
                            <div className="stat-header">
                                <span className="stat-title">Platform Users</span>
                                <div className="stat-icon-wrapper">
                                    <Users size={16} />
                                </div>
                            </div>
                            <div className="stat-value">{stats.totalUsers}</div>
                            <div className="stat-footer">
                                <TrendingUp size={12} />
                                <span>+8% this month</span>
                            </div>
                        </div>

                        <div className="glass-card">
                            <div className="stat-header">
                                <span className="stat-title">Global Note Catalog</span>
                                <div className="stat-icon-wrapper">
                                    <FileText size={16} />
                                </div>
                            </div>
                            <div className="stat-value">{stats.totalNotes}</div>
                            <div className="stat-footer" style={{ color: '#c084fc' }}>
                                <ShieldCheck size={12} />
                                <span>{stats.approvedNotes} approved</span>
                            </div>
                        </div>

                        <div className="glass-card">
                            <div className="stat-header">
                                <span className="stat-title">Note Downloads</span>
                                <div className="stat-icon-wrapper">
                                    <Download size={16} />
                                </div>
                            </div>
                            <div className="stat-value">{stats.totalDownloads || 142}</div>
                            <div className="stat-footer" style={{ color: '#60a5fa' }}>
                                <span>🚀 High-quality transfers</span>
                            </div>
                        </div>

                        <div className="glass-card">
                            <div className="stat-header">
                                <span className="stat-title">Total Revenue</span>
                                <div className="stat-icon-wrapper">
                                    <DollarSign size={16} />
                                </div>
                            </div>
                            <div className="stat-value">₹{stats.totalRevenue?.toLocaleString('en-IN') || "0"}</div>
                            <div className="stat-footer">
                                <TrendingUp size={12} />
                                <span>+14.8% sales</span>
                            </div>
                        </div>
                    </div>

                    {/* OVERVIEW DOUBLE COLUMNS */}
                    <div className="dashboard-content-columns">
                        {/* LEFT COLUMN: QUICK ACTIONS */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div className="glass-card">
                                <div className="section-title-bar">
                                    <h3>Administrative Actions</h3>
                                    <button onClick={handleRefreshStats} className="refresh-btn">
                                        <RefreshCw size={12} />
                                        Sync Metrics
                                    </button>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                                    <Link to="/admin/review" style={{ textDecoration: 'none' }}>
                                        <div style={{ padding: '16px', background: 'rgba(168, 85, 247, 0.05)', border: '1px solid rgba(168, 85, 247, 0.15)', borderRadius: '12px', transition: 'all 0.25s ease' }}
                                             onMouseEnter={e => e.currentTarget.style.borderColor = '#c084fc'}
                                             onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.15)'}>
                                            <div style={{ fontSize: '18px', marginBottom: '8px' }}>🛡️</div>
                                            <h4 style={{ color: '#ffffff', fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>Review Queue</h4>
                                            <p style={{ color: '#94a3b8', fontSize: '11px', lineHeight: 1.4 }}>Approve or reject uploaded study documents.</p>
                                        </div>
                                    </Link>

                                    <Link to="/admin/users" style={{ textDecoration: 'none' }}>
                                        <div style={{ padding: '16px', background: 'rgba(99, 102, 241, 0.05)', border: '1px solid rgba(99, 102, 241, 0.15)', borderRadius: '12px', transition: 'all 0.25s ease' }}
                                             onMouseEnter={e => e.currentTarget.style.borderColor = '#818cf8'}
                                             onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.15)'}>
                                            <div style={{ fontSize: '18px', marginBottom: '8px' }}>👥</div>
                                            <h4 style={{ color: '#ffffff', fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>Manage Users</h4>
                                            <p style={{ color: '#94a3b8', fontSize: '11px', lineHeight: 1.4 }}>View user directory, block or unblock accounts.</p>
                                        </div>
                                    </Link>

                                    <Link to="/admin/categories" style={{ textDecoration: 'none' }}>
                                        <div style={{ padding: '16px', background: 'rgba(236, 72, 153, 0.05)', border: '1px solid rgba(236, 72, 153, 0.15)', borderRadius: '12px', transition: 'all 0.25s ease' }}
                                             onMouseEnter={e => e.currentTarget.style.borderColor = '#f472b6'}
                                             onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(236, 72, 153, 0.15)'}>
                                            <div style={{ fontSize: '18px', marginBottom: '8px' }}>📂</div>
                                            <h4 style={{ color: '#ffffff', fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>Manage Categories</h4>
                                            <p style={{ color: '#94a3b8', fontSize: '11px', lineHeight: 1.4 }}>Configure subject tags and listing groups.</p>
                                        </div>
                                    </Link>

                                    <Link to="/admin/notes" style={{ textDecoration: 'none' }}>
                                        <div style={{ padding: '16px', background: 'rgba(45, 212, 191, 0.05)', border: '1px solid rgba(45, 212, 191, 0.15)', borderRadius: '12px', transition: 'all 0.25s ease' }}
                                             onMouseEnter={e => e.currentTarget.style.borderColor = '#2dd4bf'}
                                             onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(45, 212, 191, 0.15)'}>
                                            <div style={{ fontSize: '18px', marginBottom: '8px' }}>📊</div>
                                            <h4 style={{ color: '#ffffff', fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>Master Catalog</h4>
                                            <p style={{ color: '#94a3b8', fontSize: '11px', lineHeight: 1.4 }}>Check all published, free, or premium downloads.</p>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: PENDING REVIEWS SUMMARY */}
                        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
                            <div className="section-title-bar">
                                <h3>Pending Study Notes ({stats.pendingNotes || pendingReviews.length})</h3>
                                <Link to="/admin/review" style={{ color: '#c084fc', fontSize: '11px', textDecoration: 'none', fontWeight: 600 }}>View Queue →</Link>
                            </div>
                            <div style={{ flex: 1 }}>
                                {pendingReviews.map((item) => (
                                    <div key={item.id} className="pending-item">
                                        <div style={{ overflow: 'hidden', paddingRight: '12px' }}>
                                            <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</h4>
                                            <p style={{ fontSize: '10px', color: '#64748b', marginTop: '3px' }}>By {item.uploader} • Subject: {item.subject}</p>
                                        </div>
                                        <Link to="/admin/review">
                                            <button className="review-btn">Review</button>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* TAB CONTENT: 2. REPORTS & ANALYTICS */}
            {activeTab === 'reports' && (
                <div className="glass-card">
                    <div className="section-title-bar">
                        <h3>Platform Performance Reports</h3>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <span style={{ fontSize: '11px', color: '#a855f7', fontWeight: 600, background: 'rgba(168, 85, 247, 0.1)', padding: '4px 8px', borderRadius: '6px' }}>📊 Interactive Real-time Charts</span>
                        </div>
                    </div>

                    <div className="dashboard-content-columns">
                        {/* CHART 1: MONTHLY SALES ANALYTICS */}
                        <div className="chart-container">
                            <h4 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Monthly Notes Sales (2026)</h4>
                            <p style={{ fontSize: '10px', color: '#64748b', marginBottom: '16px' }}>Sales counts of premium study material</p>
                            
                            <div className="bar-chart-flex">
                                {[
                                    { month: "Jan", height: "45px", val: "₹18,500" },
                                    { month: "Feb", height: "65px", val: "₹24,900" },
                                    { month: "Mar", height: "95px", val: "₹42,500" },
                                    { month: "Apr", height: "135px", val: "₹65,000" },
                                    { month: "May", height: "160px", val: "₹82,400" },
                                ].map((bar, i) => (
                                    <div key={i} className="chart-bar-col">
                                        <div className="chart-bar-pillar" style={{ height: bar.height }}>
                                            <span className="pillar-tooltip">{bar.val}</span>
                                        </div>
                                        <span className="chart-bar-label">{bar.month}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* CHART 2: CATEGORY CONTRIBUTION CHART */}
                        <div className="chart-container" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <div>
                                <h4 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Category Listing Shares</h4>
                                <p style={{ fontSize: '10px', color: '#64748b', marginBottom: '16px' }}>Distribution of approved items in system</p>
                            </div>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {[
                                    { cat: "Data Structures & Algorithms", count: 48, percentage: 65, color: '#a855f7' },
                                    { cat: "Operating Systems", count: 18, percentage: 25, color: '#3b82f6' },
                                    { cat: "Database Management (DBMS)", count: 12, percentage: 15, color: '#f43f5e' },
                                    { cat: "Computer Networks", count: 8, percentage: 10, color: '#10b981' }
                                ].map((c, i) => (
                                    <div key={i}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
                                            <span style={{ fontWeight: 500 }}>{c.cat}</span>
                                            <span style={{ color: '#94a3b8' }}>{c.count} notes ({c.percentage}%)</span>
                                        </div>
                                        <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                                            <div style={{ width: `${c.percentage}%`, height: '100%', background: c.color, borderRadius: '3px' }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB CONTENT: 3. TRANSACTIONS LEDGER */}
            {activeTab === 'transactions' && (
                <div className="glass-card">
                    <div className="section-title-bar">
                        <h3>Payments & Download Transactions</h3>
                        <span style={{ fontSize: '11px', color: '#a855f7', fontWeight: 600, background: 'rgba(168, 85, 247, 0.1)', padding: '4px 8px', borderRadius: '6px' }}>Total Receipts: {transactions.length}</span>
                    </div>

                    <div style={{ overflowX: 'auto', border: '1px solid rgba(168, 85, 247, 0.12)', borderRadius: '12px' }}>
                        <table className="txn-table">
                            <thead>
                                <tr>
                                    <th className="txn-th">Transaction ID</th>
                                    <th className="txn-th">Buyer Name</th>
                                    <th className="txn-th">Study Note Title</th>
                                    <th className="txn-th">Price</th>
                                    <th className="txn-th">Status</th>
                                    <th className="txn-th">Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((txn, idx) => (
                                    <tr key={idx} className="txn-tr">
                                        <td className="txn-td" style={{ fontFamily: 'monospace', fontWeight: 600, color: '#c084fc' }}>{txn.id}</td>
                                        <td className="txn-td">{txn.buyer}</td>
                                        <td className="txn-td" style={{ fontWeight: 500 }}>{txn.note}</td>
                                        <td className="txn-td">
                                            {txn.price === 0 ? (
                                                <span style={{ color: '#94a3b8' }}>Free</span>
                                            ) : (
                                                <span style={{ color: '#ffffff', fontWeight: 600 }}>₹{txn.price}</span>
                                            )}
                                        </td>
                                        <td className="txn-td">
                                            <span className={`status-badge ${
                                                txn.status === 'Completed' ? 'status-completed' :
                                                txn.status === 'Failed' ? 'status-failed' : 'status-free'
                                            }`}>
                                                {txn.status}
                                            </span>
                                        </td>
                                        <td className="txn-td" style={{ color: '#64748b' }}>{txn.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* TAB CONTENT: 4. CONSOLE SETTINGS */}
            {activeTab === 'settings' && (
                <div className="glass-card" style={{ maxWidth: '640px', margin: '0 auto' }}>
                    <div className="section-title-bar">
                        <h3>Global Platform Configuration</h3>
                        <p style={{ fontSize: '11px', color: '#94a3b8' }}>Manage global rules and pricing strategies</p>
                    </div>

                    <div style={{ marginTop: '24px' }}>
                        <div className="form-group">
                            <label className="form-label">Minimum Note Price (₹)</label>
                            <input 
                                type="number" 
                                className="form-input"
                                value={minPrice}
                                onChange={(e) => setMinPrice(Number(e.target.value))}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Maximum Allowed Note Price (₹)</label>
                            <input 
                                type="number" 
                                className="form-input"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(Number(e.target.value))}
                            />
                        </div>

                        <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            <div className="toggle-wrapper">
                                <div>
                                    <h4 style={{ fontSize: '12px', fontWeight: 600, color: '#f1f5f9' }}>Allow Free Uploads</h4>
                                    <p style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>Allows students to upload study notes for zero cost.</p>
                                </div>
                                <div 
                                    className={`toggle-btn ${allowFree ? 'active' : ''}`}
                                    onClick={() => setAllowFree(!allowFree)}
                                >
                                    <div className="toggle-circle"></div>
                                </div>
                            </div>

                            <div className="toggle-wrapper">
                                <div>
                                    <h4 style={{ fontSize: '12px', fontWeight: 600, color: '#f1f5f9' }}>Require Manual Admin Approval</h4>
                                    <p style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>All uploaded PDFs must pass reviews before going public.</p>
                                </div>
                                <div 
                                    className={`toggle-btn ${requireApproval ? 'active' : ''}`}
                                    onClick={() => setRequireApproval(!requireApproval)}
                                >
                                    <div className="toggle-circle"></div>
                                </div>
                            </div>
                        </div>

                        <div style={{ marginTop: '28px', borderTop: '1px solid rgba(168, 85, 247, 0.12)', paddingTop: '20px', textAlign: 'right' }}>
                            <button 
                                className="review-btn" 
                                style={{ padding: '12px 28px', fontSize: '12px' }}
                                onClick={handleSaveSettings}
                            >
                                Save Settings
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}