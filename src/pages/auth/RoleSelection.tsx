import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, Shield, LogOut, ArrowRight } from 'lucide-react';
import { useEffect } from 'react';

const styles = `
  .role-page {
    height: 100vh;
    width: 100vw;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #0b071e 0%, #0f0c29 40%, #020208 100%);
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    position: relative;
    overflow: hidden;
  }

  .role-orb1 {
    position: absolute;
    top: -100px;
    left: -100px;
    width: 500px;
    height: 500px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%);
    pointer-events: none;
  }

  .role-orb2 {
    position: absolute;
    bottom: -150px;
    right: -100px;
    width: 600px;
    height: 600px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, transparent 70%);
    pointer-events: none;
  }

  .role-wrapper {
    position: relative;
    z-index: 10;
    width: 90%;
    max-width: 800px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 32px;
  }

  .role-header {
    text-align: center;
  }

  .role-header h1 {
    font-size: 32px;
    font-weight: 800;
    color: #ffffff;
    letter-spacing: -1px;
    margin-bottom: 8px;
  }

  .role-header h1 span {
    background: linear-gradient(90deg, #a855f7 0%, #818cf8 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .role-header p {
    font-size: 15px;
    color: #94a3b8;
  }

  .role-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    width: 100%;
  }

  @media (max-width: 640px) {
    .role-grid {
      grid-template-columns: 1fr;
    }
  }

  .role-card {
    background: rgba(255, 255, 255, 0.03);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 20px;
    padding: 36px 28px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
  }

  .role-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(180deg, rgba(255,255,255,0.02) 0%, transparent 100%);
    pointer-events: none;
  }

  .role-card-user:hover {
    border-color: rgba(99, 102, 241, 0.4);
    box-shadow: 0 15px 40px rgba(99, 102, 241, 0.15);
    transform: translateY(-4px);
    background: rgba(99, 102, 241, 0.04);
  }

  .role-card-admin:hover {
    border-color: rgba(168, 85, 247, 0.4);
    box-shadow: 0 15px 40px rgba(168, 85, 247, 0.15);
    transform: translateY(-4px);
    background: rgba(168, 85, 247, 0.04);
  }

  .role-icon-box {
    width: 64px;
    height: 64px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 24px;
    transition: all 0.3s;
  }

  .role-card-user .role-icon-box {
    background: rgba(99, 102, 241, 0.1);
    border: 1px solid rgba(99, 102, 241, 0.2);
    color: #818cf8;
  }

  .role-card-admin .role-icon-box {
    background: rgba(168, 85, 247, 0.1);
    border: 1px solid rgba(168, 85, 247, 0.2);
    color: #c084fc;
  }

  .role-card-user:hover .role-icon-box {
    background: #6366f1;
    color: #ffffff;
    box-shadow: 0 0 20px rgba(99, 102, 241, 0.4);
  }

  .role-card-admin:hover .role-icon-box {
    background: #a855f7;
    color: #ffffff;
    box-shadow: 0 0 20px rgba(168, 85, 247, 0.4);
  }

  .role-card h2 {
    font-size: 20px;
    font-weight: 700;
    color: #ffffff;
    margin-bottom: 8px;
  }

  .role-card-tag {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: 600;
    margin-bottom: 16px;
  }

  .role-card-user .role-card-tag {
    color: #818cf8;
  }

  .role-card-admin .role-card-tag {
    color: #c084fc;
  }

  .role-card p {
    font-size: 13px;
    color: #64748b;
    line-height: 1.6;
    margin-bottom: 24px;
  }

  .role-arrow {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    font-weight: 600;
    transition: all 0.3s;
  }

  .role-card-user .role-arrow {
    color: #818cf8;
  }

  .role-card-admin .role-arrow {
    color: #c084fc;
  }

  .role-card:hover .role-arrow {
    gap: 12px;
  }

  .role-logout {
    display: flex;
    align-items: center;
    gap: 8px;
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.08);
    color: #64748b;
    padding: 10px 20px;
    border-radius: 12px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  .role-logout:hover {
    background: rgba(239, 68, 68, 0.08);
    border-color: rgba(239, 68, 68, 0.2);
    color: #f87171;
  }
`;

export default function RoleSelection() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // Double check auth state
    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        if (user.role !== 'Admin') {
            navigate('/');
        }
    }, [user, navigate]);

    if (!user || user.role !== 'Admin') return null;

    return (
        <>
            <style>{styles}</style>
            <div className="role-page">
                <div className="role-orb1" />
                <div className="role-orb2" />

                <div className="role-wrapper">
                    <div className="role-header">
                        <h1>Welcome, <span>{user.fullName}</span></h1>
                        <p>Please select your workspace console below to continue</p>
                    </div>

                    <div className="role-grid">
                        {/* Student / User Role Card */}
                        <div 
                            className="role-card role-card-user"
                            onClick={() => navigate('/')}
                        >
                            <div className="role-icon-box">
                                <BookOpen size={28} />
                            </div>
                            <h2>Student Portal</h2>
                            <div className="role-card-tag">User Workspace</div>
                            <p>
                                Browse study notes, upload standard or premium academic resources, purchase review sets, manage wishlists, and learn.
                            </p>
                            <div className="role-arrow">
                                Enter Student Portal <ArrowRight size={15} />
                            </div>
                        </div>

                        {/* Admin Role Card */}
                        <div 
                            className="role-card role-card-admin"
                            onClick={() => navigate('/admin/dashboard')}
                        >
                            <div className="role-icon-box">
                                <Shield size={28} />
                            </div>
                            <h2>Admin Console</h2>
                            <div className="role-card-tag">Control Workspace</div>
                            <p>
                                Audit notes submissions, block/unblock accounts, regulate note categories, check system metrics, and audit transaction records.
                            </p>
                            <div className="role-arrow">
                                Enter Control Panel <ArrowRight size={15} />
                            </div>
                        </div>
                    </div>

                    <button className="role-logout" onClick={() => { logout(); navigate('/login'); }}>
                        <LogOut size={15} />
                        Exit Session
                    </button>
                </div>
            </div>
        </>
    );
}
