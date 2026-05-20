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
import { useState } from "react";

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

  .noteshub-container {
    display: flex;
    height: 100vh;
    background: linear-gradient(135deg, #0f172a 0%, #111827 50%, #020617 100%);
    color: #ffffff;
    overflow: hidden;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
  }

  /* ============ SIDEBAR ============ */
  .noteshub-sidebar {
    width: 270px;
    background: linear-gradient(180deg, rgba(15, 23, 42, 0.8) 0%, rgba(17, 24, 39, 0.6) 50%, rgba(2, 6, 23, 0.8) 100%);
    backdrop-filter: blur(40px);
    border-right: 1px solid rgba(255, 255, 255, 0.05);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;
    transition: all 0.3s ease;
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
    padding: 0 0 1rem 2rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    position: relative;
    z-index: 10;
  }

  .sidebar-logo h1 {
    font-size: 32px;
    font-weight: 900;
    letter-spacing: -1px;
    background: linear-gradient(90deg, #a78bfa 0%, #818cf8 50%, #60a5fa 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    display: inline;
  }

  .sidebar-logo h1 span {
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
    padding: 10px 18px;
    border-radius: 12px;
    text-decoration: none;
    font-size: 12px;
    font-weight: 500;
    transition: all 0.3s ease;
    color: #cbd5e1;
    border: 1px solid transparent;
    position: relative;
    overflow: hidden;
  }

  .nav-link:hover {
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
    width: 20px;
    height: 20px;
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
    padding: 20px;
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
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 6px;
    transition: all 0.3s ease;
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
    font-size: 24px;
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
    width: 40px;
    height: 40px;
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
    height: 60px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    background: linear-gradient(90deg, rgba(15, 23, 42, 0.5) 0%, rgba(17, 24, 39, 0.3) 50%, rgba(15, 23, 42, 0.5) 100%);
    backdrop-filter: blur(40px);
    padding: 0 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
  }

  .navbar-left h2 {
    font-size: 16px;
    font-weight: 700;
    letter-spacing: -0.5px;
    background: linear-gradient(90deg, #ffffff 0%, #cbd5e1 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
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
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 10px 11px 10px 36px;
    font-size: 9px;
    color: #ffffff;
    outline: none;
    transition: all 0.3s ease;
    font-family: inherit;
  }

  .search-input::placeholder {
    color: #64748b;
  }

  .search-input:hover {
    border-color: rgba(255, 255, 255, 0.2);
  }

  .search-wrapper.focused .search-input {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(129, 140, 248, 0.5);
    box-shadow: 0 8px 24px rgba(129, 140, 248, 0.1);
  }

  /* Icon Buttons */
  .icon-btn {
    position: relative;
    padding: 8px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #94a3b8;
  }

  .icon-btn:hover {
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
    color: #ffffff;
  }

  .profile-info-status {
    font-size: 11px;
    color: #14ca54ff;
    margin-top: 1px;
  }

  .profile-avatar {
    width: 38px;
    height: 38px;
    border-radius: 12px;
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

  /* Main Content Area */
  .noteshub-content {
    flex: 1;
    overflow: auto;
    padding: 32px;
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
                <div className="stat-label">Notes Read</div>
                <div className="stat-value">24</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">This Week</div>
                <div className="stat-value">8</div>
              </div>
            </div>
          </div>

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
              <h2>Welcome back 👋</h2>
              <p>Ready to continue learning today?</p>
            </div>

            {/* RIGHT SECTION */}
            <div className="navbar-right">
              {/* SEARCH BAR */}
              <div className={`search-wrapper ${searchFocused ? "focused" : ""}`}>
                <div className="search-icon">
                  <Search size={14} />
                </div>
                <input
                  type="text"
                  placeholder="Search notes, topics..."
                  value={globalSearch}
                  onChange={(e) => setGlobalSearch(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  className="search-input"
                />
              </div>

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