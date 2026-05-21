import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
    LayoutDashboard, 
    ShieldCheck, 
    FileSpreadsheet, 
    Users, 
    FolderKanban, 
    LogOut,
    Shield,
    Bell,
    ChevronRight
} from 'lucide-react';

const adminNav = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { path: '/admin/review', label: 'Review Notes', icon: <ShieldCheck size={18} /> },
    { path: '/admin/notes', label: 'Manage Notes', icon: <FileSpreadsheet size={18} /> },
    { path: '/admin/users', label: 'Manage Users', icon: <Users size={18} /> },
    { path: '/admin/categories', label: 'Categories', icon: <FolderKanban size={18} /> },
];

const styles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .adminhub-container {
    display: flex;
    height: 100vh;
    width: 100vw;
    background: linear-gradient(135deg, #0b071e 0%, #0f0c29 50%, #050510 100%);
    color: #ffffff;
    overflow: hidden;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }

  /* ============ SIDEBAR ============ */
  .adminhub-sidebar {
    width: 280px;
    background: linear-gradient(180deg, rgba(15, 12, 41, 0.8) 0%, rgba(26, 16, 64, 0.6) 50%, rgba(5, 5, 16, 0.8) 100%);
    backdrop-filter: blur(40px);
    -webkit-backdrop-filter: blur(40px);
    border-right: 1px solid rgba(168, 85, 247, 0.12);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;
    transition: all 0.3s ease;
  }

  .adminhub-sidebar::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(168, 85, 247, 0.12) 0%, transparent 70%);
    filter: blur(60px);
    transform: translate(30%, -30%);
    pointer-events: none;
  }

  .adminhub-sidebar::after {
    content: '';
    position: absolute;
    bottom: 100px;
    left: 0;
    width: 250px;
    height: 250px;
    background: radial-gradient(circle, rgba(124, 58, 237, 0.1) 0%, transparent 70%);
    filter: blur(60px);
    transform: translate(-30%, 30%);
    pointer-events: none;
  }

  /* Logo */
  .sidebar-logo {
    padding: 24px 20px 20px 24px;
    border-bottom: 1px solid rgba(168, 85, 247, 0.12);
    display: flex;
    align-items: center;
    gap: 12px;
    position: relative;
    z-index: 10;
  }

  .logo-icon-wrapper {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    background: linear-gradient(135deg, rgba(168, 85, 247, 0.25) 0%, rgba(124, 58, 237, 0.25) 100%);
    border: 1px solid rgba(168, 85, 247, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 15px rgba(168, 85, 247, 0.25);
  }

  .logo-text-wrapper h1 {
    font-size: 19px;
    font-weight: 800;
    letter-spacing: -0.5px;
    color: #ffffff;
    margin: 0;
    line-height: 1.1;
  }

  .logo-text-wrapper h1 span {
    background: linear-gradient(90deg, #a855f7 0%, #c084fc 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .logo-text-wrapper p {
    color: #64748b;
    margin-top: 3px;
    font-size: 9px;
    font-weight: 600;
    letter-spacing: 1.5px;
    text-transform: uppercase;
  }

  /* Navigation */
  .sidebar-nav {
    flex: 1;
    padding: 24px 14px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    position: relative;
    z-index: 10;
    overflow-y: auto;
  }

  .sidebar-nav-label {
    color: #64748b;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 1.25px;
    text-transform: uppercase;
    padding: 0 12px;
    margin-bottom: 8px;
  }

  .nav-link {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 11px 16px;
    border-radius: 10px;
    text-decoration: none;
    font-size: 13px;
    font-weight: 500;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    color: #94a3b8;
    border: 1px solid transparent;
    position: relative;
  }

  .nav-link:hover {
    background-color: rgba(255, 255, 255, 0.03);
    color: #ffffff;
    transform: translateX(2px);
  }

  .nav-link.active {
    background: linear-gradient(90deg, rgba(168, 85, 247, 0.2) 0%, rgba(124, 58, 237, 0.15) 100%);
    color: #e9d5ff;
    border: 1px solid rgba(168, 85, 247, 0.2);
    box-shadow: 0 4px 15px rgba(168, 85, 247, 0.08);
    font-weight: 600;
  }

  .nav-link-icon {
    width: 18px;
    height: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #64748b;
    transition: color 0.25s ease;
  }

  .nav-link:hover .nav-link-icon {
    color: #c084fc;
  }

  .nav-link.active .nav-link-icon {
    color: #a855f7;
  }

  .nav-link-label {
    flex: 1;
  }

  .nav-link-chevron {
    width: 16px;
    height: 16px;
    color: #c084fc;
    opacity: 0;
    transition: all 0.25s ease;
    transform: translateX(-4px);
  }

  .nav-link:hover .nav-link-chevron,
  .nav-link.active .nav-link-chevron {
    opacity: 1;
    transform: translateX(0);
  }

  /* Admin Role display */
  .sidebar-stats {
    padding: 16px;
    margin: 0 14px 14px 14px;
    background: rgba(168, 85, 247, 0.04);
    border: 1px solid rgba(168, 85, 247, 0.08);
    border-radius: 12px;
    position: relative;
    z-index: 10;
  }

  .stats-header {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 11px;
    color: #c084fc;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 8px;
  }

  .stats-desc {
    font-size: 11px;
    color: #94a3b8;
    line-height: 1.4;
  }

  /* User Profile Card */
  .sidebar-user {
    padding: 14px;
    border-top: 1px solid rgba(168, 85, 247, 0.12);
    position: relative;
    z-index: 10;
  }

  .user-card {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.01) 100%);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 12px;
    padding: 10px 12px;
    transition: all 0.3s ease;
  }

  .user-card:hover {
    border-color: rgba(168, 85, 247, 0.2);
    background: rgba(255, 255, 255, 0.03);
  }

  .user-card-header {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .user-avatar {
    width: 36px;
    height: 36px;
    flex-shrink: 0;
    border-radius: 10px;
    background: linear-gradient(135deg, #a855f7 0%, #7c3aed 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    font-weight: 700;
    font-size: 14px;
    box-shadow: 0 4px 15px rgba(168, 85, 247, 0.35);
    transition: all 0.3s ease;
  }

  .user-card:hover .user-avatar {
    box-shadow: 0 4px 20px rgba(168, 85, 247, 0.5);
    transform: scale(1.02);
  }

  .user-info {
    flex: 1;
    overflow: hidden;
  }

  .user-info h3 {
    font-size: 13px;
    font-weight: 600;
    color: #f8fafc;
    line-height: 1.3;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .user-info p {
    color: #64748b;
    font-size: 11px;
    margin-top: 1px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .logout-btn {
    width: 32px;
    height: 32px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    border-radius: 8px;
    background: transparent;
    color: #94a3b8;
    cursor: pointer;
    transition: all 0.25s ease;
  }

  .logout-btn:hover {
    background: rgba(239, 68, 68, 0.12);
    color: #f87171;
    transform: scale(1.05);
  }

  /* ============ MAIN CONTENT AREA ============ */
  .adminhub-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;
  }

  /* Navbar */
  .adminhub-navbar {
    height: 70px;
    border-bottom: 1px solid rgba(168, 85, 247, 0.12);
    background: rgba(11, 7, 30, 0.4);
    backdrop-filter: blur(30px);
    -webkit-backdrop-filter: blur(30px);
    padding: 0 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    z-index: 100;
  }

  .navbar-left {
    display: flex;
    flex-direction: column;
  }

  .navbar-left h2 {
    font-size: 18px;
    font-weight: 700;
    letter-spacing: -0.3px;
    color: #f8fafc;
    margin: 0;
  }

  .navbar-left p {
    color: #c084fc;
    font-size: 11px;
    font-weight: 600;
    margin-top: 2px;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .navbar-right {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .status-badge {
    display: flex;
    align-items: center;
    gap: 6px;
    background: rgba(34, 197, 94, 0.08);
    border: 1px solid rgba(34, 197, 94, 0.2);
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 11px;
    color: #4ade80;
    font-weight: 600;
  }

  .status-dot {
    width: 6px;
    height: 6px;
    background: #22c55e;
    border-radius: 50%;
    box-shadow: 0 0 8px #22c55e;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); }
    70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(34, 197, 94, 0); }
    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
  }

  .icon-btn {
    padding: 8px;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.06);
    cursor: pointer;
    transition: all 0.25s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #94a3b8;
  }

  .icon-btn:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(168, 85, 247, 0.3);
    color: #c084fc;
    transform: translateY(-1px);
  }

  /* Main View Container */
  .adminhub-content {
    flex: 1;
    overflow: auto;
    padding: 32px;
    background: rgba(11, 7, 30, 0.1);
  }

  /* Scrollbar Customization */
  .adminhub-content::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  .adminhub-content::-webkit-scrollbar-track {
    background: transparent;
  }

  .adminhub-content::-webkit-scrollbar-thumb {
    background: rgba(168, 85, 247, 0.12);
    border-radius: 3px;
  }

  .adminhub-content::-webkit-scrollbar-thumb:hover {
    background: rgba(168, 85, 247, 0.25);
  }
`;

export default function AdminLayout() {
    const { user, logout } = useAuth();
    const location = useLocation();

    return (
        <>
            <style>{styles}</style>
            <div className="adminhub-container">
                {/* SIDEBAR */}
                <aside className="adminhub-sidebar">
                    {/* LOGO */}
                    <div className="sidebar-logo">
                        <div className="logo-icon-wrapper">
                            <Shield size={20} color="#a855f7" />
                        </div>
                        <div className="logo-text-wrapper">
                            <h1>Notes<span>Hub</span></h1>
                            <p>Admin Portal</p>
                        </div>
                    </div>

                    {/* NAVIGATION */}
                    <nav className="sidebar-nav">
                        <div className="sidebar-nav-label">Management Console</div>
                        {adminNav.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`nav-link ${isActive ? 'active' : ''}`}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                                        <div className="nav-link-icon">{item.icon}</div>
                                        <span className="nav-link-label">{item.label}</span>
                                    </div>
                                    {isActive && <ChevronRight size={14} className="nav-link-chevron" />}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* PORTAL ACCESS BADGE */}
                    <div className="sidebar-stats">
                        <div className="stats-header">
                            <span>🛡️ Security Level 1</span>
                        </div>
                        <p className="stats-desc">
                            Authenticated administrative account. Action logging active. Keep master key secured.
                        </p>
                    </div>

                    {/* SWITCH TO STUDENT VIEW */}
                    <div style={{ padding: '0 14px 14px 14px' }}>
                        <Link 
                            to="/" 
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '12px',
                                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(79, 70, 229, 0.15) 100%)',
                                border: '1px solid rgba(99, 102, 241, 0.3)',
                                borderRadius: '12px',
                                color: '#ffffff',
                                textDecoration: 'none',
                                fontSize: '11px',
                                fontWeight: 600,
                                transition: 'all 0.3s ease',
                                boxShadow: '0 4px 15px rgba(99, 102, 241, 0.1)',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 6px 20px rgba(99, 102, 241, 0.2)';
                                e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.5)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 15px rgba(99, 102, 241, 0.1)';
                                e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.3)';
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '8px', background: '#6366f1', color: '#ffffff' }}>
                                📚
                            </div>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                <span>Student Portal</span>
                               <span style={{ fontSize: '9px', color: '#818cf8', fontWeight: 500, marginTop: '2px' }}>Switch to Student View</span>
                            </div>
                        </Link>
                    </div>

                    {/* USER CARD */}
                    <div className="sidebar-user">
                        <div className="user-card">
                            <div className="user-card-header">
                                <div className="user-avatar">
                                    {user?.fullName?.charAt(0) || 'A'}
                                </div>
                                <div className="user-info">
                                    <h3>{user?.fullName || 'Administrator'}</h3>
                                    <p>{user?.email || 'admin@noteshub.com'}</p>
                                </div>
                                <button onClick={logout} className="logout-btn" title="Logout Session">
                                    <LogOut size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* MAIN */}
                <div className="adminhub-main">
                    {/* NAVBAR */}
                    <header className="adminhub-navbar">
                        {/* LEFT SECTION */}
                        <div className="navbar-left">
                            <h2>Welcome, System Admin</h2>
                            <p>⚙️ Console Status: Active & Operational</p>
                        </div>

                        {/* RIGHT SECTION */}
                        <div className="navbar-right">
                            {/* STATUS BADGE */}
                            <div className="status-badge">
                                <span className="status-dot"></span>
                                Live Sync Connected
                            </div>

                            {/* NOTIFICATION ICON */}
                            <button className="icon-btn" title="Notifications">
                                <Bell size={14} />
                            </button>
                        </div>
                    </header>

                    {/* PAGE CONTENT CONTAINER */}
                    <main className="adminhub-content">
                        <Outlet />
                    </main>
                </div>
            </div>
        </>
    );
}