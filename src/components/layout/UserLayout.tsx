import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard,
  BookOpen,
  Upload,
  ShoppingBag,
  LogOut,
  Search,
  Settings,
  Bell,
  ChevronRight,
  Heart,
  History
} from "lucide-react";
import { useState, useEffect } from "react";
import api from "../../services/api";

const userNav = [
  {
    path: "/",
    label: "Dashboard",
    icon: <LayoutDashboard size={20} />
  },
  {
    path: "/browse",
    label: "Browse Notes",
    icon: <BookOpen size={20} />
  },
  {
    path: "/upload",
    label: "Upload Notes",
    icon: <Upload size={20} />
  },
  {
    path: "/my-uploads",
    label: "My Uploads",
    icon: <History size={20} />
  },
  {
    path: "/my-purchases",
    label: "My Purchases",
    icon: <ShoppingBag size={20} />
  },
  {
    path: "/wishlist",
    label: "Wishlist",
    icon: <Heart size={20} />
  }
];

const styles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  /* LIGHT MODE (Default) */
  .noteshub-container {
    display: flex;
    height: 100vh;
    background: #f1f5f9;
    color: #0f172a;
    overflow: hidden;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
  }

  .noteshub-sidebar {
    width: 240px;
    background: #ffffff;
    border-right: 1px solid #e2e8f0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;
    transition: all 0.3s ease;
  }

  /* DARK MODE OVERRIDES */
  .dark .noteshub-container {
    background: linear-gradient(135deg, #0f172a 0%, #111827 50%, #020617 100%);
    color: #ffffff;
  }

  .dark .noteshub-sidebar {
    background: linear-gradient(180deg, rgba(15, 23, 42, 0.8) 0%, rgba(17, 24, 39, 0.6) 50%, rgba(2, 6, 23, 0.8) 100%);
    backdrop-filter: blur(40px);
    border-right: 1px solid rgba(255, 255, 255, 0.05);
  }

  .noteshub-sidebar::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 384px;
    height: 384px;
    background: radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%);
    filter: blur(80px);
    transform: translate(50%, -50%);
    pointer-events: none;
  }

  .noteshub-sidebar::after {
    content: '';
    position: absolute;
    bottom: 128px;
    left: 0;
    width: 288px;
    height: 288px;
    background: radial-gradient(circle, rgba(79, 70, 229, 0.1) 0%, transparent 70%);
    filter: blur(80px);
    transform: translate(-33%, 0);
    pointer-events: none;
  }

  /* Logo */
  .sidebar-logo {
    padding: 0 0 12px 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    position: relative;
    z-index: 10;
  }

  .sidebar-logo h1 {
    font-size: 24px;
    font-weight: 900;
    letter-spacing: -1px;
    background: linear-gradient(90deg, #6d28d9 0%, #4f46e5 50%, #2563eb 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    display: inline;
  }
  .dark .sidebar-logo h1 {
    background: linear-gradient(90deg, #a78bfa 0%, #818cf8 50%, #60a5fa 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .sidebar-logo h1 span {
    color: #0f172a;
  }
  .dark .sidebar-logo h1 span {
    color: #ffffff;
  }

  .sidebar-logo p {
    color: #64748b;
    margin-top: 8px;
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 1.5px;
    text-transform: uppercase;
  }

  /* Navigation */
  .sidebar-nav {
    flex: 1;
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    position: relative;
    z-index: 10;
  }

  .sidebar-nav-label {
    color: #64748b;
    font-size: 12px;
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
    padding: 8px 14px;
    border-radius: 12px;
    text-decoration: none;
    font-size: 12px;
    font-weight: 500;
    transition: all 0.3s ease;
    color: #475569;
    border: 1px solid transparent;
    position: relative;
    overflow: hidden;
  }
  .dark .nav-link {
    color: #cbd5e1;
  }

  .nav-link:hover {
    background-color: rgba(0, 0, 0, 0.05);
    color: #0f172a;
  }
  .dark .nav-link:hover {
    background-color: rgba(255, 255, 255, 0.05);
    color: #ffffff;
  }

  .nav-link.active {
    background: linear-gradient(90deg, rgba(139, 92, 246, 0.4) 0%, rgba(79, 70, 229, 0.4) 100%);
    color: #ffffff;
    border: 1px solid rgba(79, 70, 229, 0.3);
    box-shadow: 0 8px 24px rgba(79, 70, 229, 0.1);
  }

  .nav-link-icon {
    width: 18px;
    height: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #64748b;
    transition: color 0.3s ease;
  }

  .nav-link:hover .nav-link-icon {
    color: #818cf8;
  }

  .nav-link.active .nav-link-icon {
    color: #a78bfa;
  }

  .nav-link-label {
    flex: 1;
  }

  .nav-link-chevron {
    width: 18px;
    height: 18px;
    color: #a78bfa;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .nav-link:hover .nav-link-chevron,
  .nav-link.active .nav-link-chevron {
    opacity: 1;
  }

  /* Quick Stats */
  .sidebar-stats {
    padding: 16px;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    position: relative;
    z-index: 10;
  }

  .sidebar-stats-label {
    color: #64748b;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 1.25px;
    text-transform: uppercase;
    padding: 0 12px;
    margin-bottom: 16px;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .stat-card {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 6px;
    transition: all 0.3s ease;
  }
  .dark .stat-card {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
  }

  .stat-card:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
  }

  .stat-label {
    color: #94a3b8;
    font-size: 12px;
    font-weight: 500;
    text-align: center;
  }

  .stat-value {
    font-size: 20px;
    font-weight: 700;
    margin-top: 8px;
    text-align: center;
  }

  .stat-card:first-child .stat-value {
    color: #818cf8;
  }

  .stat-card:last-child .stat-value {
    color: #c084fc;
  }

  /* User Profile */
  .sidebar-user {
    padding: 10px;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    position: relative;
    z-index: 10;
  }

  .user-card {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: 12px;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
  }

  .user-card:hover {
    border-color: rgba(255, 255, 255, 0.2);
  }

  .user-card-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 0px;
  }

  .user-avatar {
    width: 34px;
    height: 34px;
    flex-shrink: 0;
    border-radius: 12px;
    background: linear-gradient(135deg, #8b5cf6 0%, #4f46e5 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 14px;
    box-shadow: 0 8px 20px rgba(79, 70, 229, 0.3);
    transition: box-shadow 0.3s ease;
  }

  .user-card:hover .user-avatar {
    box-shadow: 0 8px 30px rgba(79, 70, 229, 0.5);
  }

  .user-info {
    flex: 1;
    overflow: hidden;
  }

  .user-info h3 {
    font-size: 12px;
    font-weight: 600;
    line-height: 1.4;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .user-info p {
    color: #94a3b8;
    font-size: 10px;
    margin-top: 2px;
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
    transition: all 0.3s ease;
  }

  .logout-btn:hover {
    background: rgba(239, 68, 68, 0.1);
    color: #ef4444;
  }

  /* ============ MAIN CONTENT ============ */
  .noteshub-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  /* Navbar */
  .noteshub-navbar {
    height: 54px;
    border-bottom: 1px solid #e2e8f0;
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(40px);
    padding: 0 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
  }
  .dark .noteshub-navbar {
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    background: linear-gradient(90deg, rgba(15, 23, 42, 0.5) 0%, rgba(17, 24, 39, 0.3) 50%, rgba(15, 23, 42, 0.5) 100%);
  }

  .navbar-left h2 {
    font-size: 15px;
    font-weight: 700;
    letter-spacing: -0.5px;
    background: linear-gradient(90deg, #0f172a 0%, #334155 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .emoji-reset {
    -webkit-text-fill-color: initial;
    background: none;
    -webkit-background-clip: initial;
    background-clip: initial;
  }
  .dark .navbar-left h2 {
    background: linear-gradient(90deg, #ffffff 0%, #cbd5e1 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .navbar-left p {
    color: #64748b;
    font-size: 10px;
    margin-top: 4px;
  }

  .navbar-right {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  /* Search Bar */
  .search-wrapper {
    position: relative;
    transition: all 0.3s ease;
  }

  .search-wrapper.focused {
    width: 384px;
  }

  .search-wrapper:not(.focused) {
    width: 288px;
  }

  .search-icon {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    color: #64748b;
    transition: color 0.3s ease;
  }

  .search-wrapper.focused .search-icon {
    color: #818cf8;
  }

  .search-input {
    width: 100%;
    background: #f1f5f9;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 10px 11px 10px 36px;
    font-size: 9px;
    color: #0f172a;
    outline: none;
    transition: all 0.3s ease;
    font-family: inherit;
  }
  .dark .search-input {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #ffffff;
  }

  .search-input::placeholder {
    color: #64748b;
  }

  .search-input:hover {
    border-color: #cbd5e1;
  }
  .dark .search-input:hover {
    border-color: rgba(255, 255, 255, 0.2);
  }

  .search-wrapper.focused .search-input {
    background: #ffffff;
    border-color: #818cf8;
    box-shadow: 0 4px 12px rgba(129, 140, 248, 0.15);
  }
  .dark .search-wrapper.focused .search-input {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(129, 140, 248, 0.5);
    box-shadow: 0 8px 24px rgba(129, 140, 248, 0.1);
  }

  .icon-btn {
    position: relative;
    padding: 6px;
    border-radius: 10px;
    background: #f1f5f9;
    border: 1px solid #e2e8f0;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #64748b;
  }
  .dark .icon-btn {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #94a3b8;
  }

  .icon-btn:hover {
    background: #ffffff;
    border-color: #cbd5e1;
    color: #818cf8;
  }
  .dark .icon-btn:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
    color: #818cf8;
  }

  .notification-dot {
    position: absolute;
    top: 4px;
    right: 4px;
    width: 7px;
    height: 7px;
    background: #ef4444;
    border-radius: 50%;
    box-shadow: 0 0 8px rgba(239, 68, 68, 0.5);
  }

  /* Profile Section */
  .navbar-profile {
    display: flex;
    align-items: center;
    gap: 12px;
    padding-left: 16px;
    border-left: 1px solid #e2e8f0;
  }
  .dark .navbar-profile {
    border-left: 1px solid rgba(255, 255, 255, 0.1);
  }

  .profile-info {
    text-align: right;
    display: none;
  }

  @media (min-width: 640px) {
    .profile-info {
      display: block;
    }
  }

  .profile-info-name {
    font-size: 12px;
    font-weight: 500;
    color: #0f172a;
  }
  .dark .profile-info-name {
    color: #ffffff;
  }

  .profile-info-status {
    font-size: 11px;
    color: #14ca54ff;
    margin-top: 1px;
  }

  .profile-avatar {
    width: 34px;
    height: 34px;
    border-radius: 10px;
    background: linear-gradient(135deg, #8b5cf6 0%, #4f46e5 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 14px;
    box-shadow: 0 8px 20px rgba(79, 70, 229, 0.3);
    transition: all 0.3s ease;
    cursor: pointer;
  }

  .profile-avatar:hover {
    box-shadow: 0 8px 30px rgba(79, 70, 229, 0.5);
  }

  .noteshub-content {
    flex: 1;
    overflow: auto;
    padding: 20px 24px 24px 24px;
  }

  /* Scrollbar Styling */
  .noteshub-content::-webkit-scrollbar {
    width: 8px;
  }

  .noteshub-content::-webkit-scrollbar-track {
    background: transparent;
  }

  .noteshub-content::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }

  .noteshub-content::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

export default function UserLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [searchFocused, setSearchFocused] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");
  const [stats, setStats] = useState({ libraryCount: 0, uploadsCount: 0 });

  useEffect(() => {
    if (!user) return;
    const fetchSidebarStats = async () => {
      try {
        const [purchasedRes, uploadsRes] = await Promise.all([
          api.get('/notes/purchased').catch(() => ({ data: [] })),
          api.get('/notes/my-uploads').catch(() => ({ data: [] }))
        ]);
        setStats({
          libraryCount: purchasedRes.data?.length || 0,
          uploadsCount: uploadsRes.data?.length || 0
        });
      } catch (err) {
        console.error("Error loading sidebar stats:", err);
      }
    };
    fetchSidebarStats();
  }, [user, location.pathname]);

  return (
    <>
      <style>{styles}</style>
      <div className="noteshub-container">
        {/* SIDEBAR */}
        <aside className="noteshub-sidebar">
          {/* LOGO */}
          <div className="sidebar-logo">
            <h1>
              Notes<span>Hub</span>
            </h1>
            <p>Learning Platform</p>
          </div>

          {/* NAVIGATION */}
          <nav className="sidebar-nav">
            <div className="sidebar-nav-label">Main Menu</div>
            {userNav.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-link ${isActive ? "active" : ""}`}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "16px", flex: 1 }}>
                    <div className="nav-link-icon">{item.icon}</div>
                    <span className="nav-link-label">{item.label}</span>
                  </div>
                  {isActive && <ChevronRight size={18} className="nav-link-chevron" />}
                </Link>
              );
            })}
          </nav>

          {/* QUICK STATS */}
          <div className="sidebar-stats">
            <div className="sidebar-stats-label">Your Progress</div>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-label">Library</div>
                <div className="stat-value">{stats.libraryCount}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">My Uploads</div>
                <div className="stat-value">{stats.uploadsCount}</div>
              </div>
            </div>
          </div>

          {/* ADMIN PANEL TOGGLE */}
          {user?.role === 'Admin' && (
            <div style={{ padding: '0 12px 16px 12px', width: '100%', boxSizing: 'border-box' }}>
              <Link 
                to="/admin/dashboard" 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 12px',
                  background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(124, 58, 237, 0.15) 100%)',
                  border: '1px solid rgba(168, 85, 247, 0.3)',
                  borderRadius: '12px',
                  color: '#ffffff',
                  textDecoration: 'none',
                  fontSize: '11px',
                  fontWeight: 600,
                  transition: 'all 0.25s ease',
                  boxShadow: '0 4px 15px rgba(168, 85, 247, 0.1)',
                  boxSizing: 'border-box',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 6px 18px rgba(168, 85, 247, 0.2)';
                  e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(168, 85, 247, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.3)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '26px', height: '26px', borderRadius: '8px', background: '#a855f7', color: '#ffffff', fontSize: '12px', flexShrink: 0 }}>
                  🛡️
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                  <span style={{ color: '#ffffff' }}>Admin Panel</span>
                  <span style={{ fontSize: '9px', color: '#c084fc', fontWeight: 500, marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Switch to Control Console</span>
                </div>
              </Link>
            </div>
          )}

          {/* USER PROFILE */}
          <div className="sidebar-user">
            <div className="user-card">
              <div className="user-card-header">
                <div className="user-avatar">{user?.fullName?.charAt(0)}</div>
                <div className="user-info">
                  <h3>{user?.fullName}</h3>
                  <p>{user?.email}</p>
                </div>
                <button onClick={logout} className="logout-btn">
                  <LogOut size={16} />

                </button>
              </div>

            </div>
          </div>
        </aside>

        {/* MAIN */}
        <div className="noteshub-main">
          {/* NAVBAR */}
          <header className="noteshub-navbar">
            {/* LEFT SECTION */}
            <div className="navbar-left">
              <h2>Welcome back, {user?.fullName?.split(' ')[0] || 'User'} <span className="emoji-reset">👋</span></h2>
              <p>Ready to continue learning today?</p>
            </div>

            {/* RIGHT SECTION */}
            <div className="navbar-right">


              {/* NOTIFICATION ICON */}
              <button className="icon-btn">
                <Bell size={14} />
                <span className="notification-dot"></span>
              </button>

              {/* SETTINGS ICON */}
              <Link to="/settings" className="icon-btn">
                <Settings size={14} />
              </Link>

              {/* PROFILE AVATAR */}
              <Link to="/profile" style={{ textDecoration: 'none' }}>
                <div className="navbar-profile">
                  <div className="profile-info">
                    <p className="profile-info-name">{user?.fullName}</p>
                    <p className="profile-info-status">Active now</p>
                  </div>
                  <div className="profile-avatar">{user?.fullName?.charAt(0)}</div>
                </div>
              </Link>
            </div>
          </header>

          {/* PAGE */}
          <main className="noteshub-content">
            <Outlet context={{ globalSearch }} />
          </main>
        </div>
      </div>
    </>
  );
}