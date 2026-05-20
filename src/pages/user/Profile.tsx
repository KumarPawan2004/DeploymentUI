import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Lock, Shield, BookOpen, Download, Save, Camera } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Profile() {
    const { user, login } = useAuth(); // Destructuring login just as a mock way to update local storage if needed

    const [formData, setFormData] = useState({
        fullName: user?.fullName || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [isSaving, setIsSaving] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleUpdateProfile = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        
        // Simulate API update
        setTimeout(() => {
            setIsSaving(false);
            toast.success("Profile updated successfully!");
        }, 1000);
    };

    const handleUpdatePassword = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (formData.newPassword !== formData.confirmPassword) {
            toast.error("New passwords do not match!");
            return;
        }

        setIsSaving(true);
        
        // Simulate API update
        setTimeout(() => {
            setIsSaving(false);
            setFormData(prev => ({
                ...prev,
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            }));
            toast.success("Password changed successfully!");
        }, 1000);
    };

    const styles = `
      .profile-container {
        max-width: 1000px;
        margin: 0 auto;
        padding: 40px 24px;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      }

      .header-section {
        margin-bottom: 40px;
      }

      .page-title {
        font-size: 36px;
        font-weight: 800;
        background: linear-gradient(to right, #60a5fa, #a78bfa);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-bottom: 8px;
        letter-spacing: -0.5px;
      }

      .page-subtitle {
        color: #94a3b8;
        font-size: 16px;
      }

      .profile-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 32px;
      }

      @media (min-width: 1024px) {
        .profile-grid {
            grid-template-columns: 350px 1fr;
        }
      }

      .glass-card {
        background: linear-gradient(145deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.8) 100%);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(148, 163, 184, 0.1);
        border-radius: 24px;
        padding: 32px;
        box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.5);
      }

      .avatar-section {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        padding-bottom: 32px;
        border-bottom: 1px solid rgba(255,255,255,0.05);
        margin-bottom: 32px;
      }

      .avatar-wrapper {
        position: relative;
        width: 120px;
        height: 120px;
        margin-bottom: 20px;
      }

      .avatar-circle {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: linear-gradient(135deg, #60a5fa 0%, #8b5cf6 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 48px;
        font-weight: 800;
        color: white;
        box-shadow: 0 10px 25px rgba(99, 102, 241, 0.3);
      }

      .avatar-upload-btn {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 36px;
        height: 36px;
        background: #1e293b;
        border: 2px solid #0f172a;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #e2e8f0;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .avatar-upload-btn:hover {
        background: #3b82f6;
        color: white;
        transform: scale(1.1);
      }

      .user-name {
        font-size: 24px;
        font-weight: 700;
        color: #f8fafc;
        margin-bottom: 8px;
      }

      .user-role {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 4px 12px;
        background: rgba(139, 92, 246, 0.15);
        color: #c084fc;
        border-radius: 20px;
        font-size: 13px;
        font-weight: 600;
        letter-spacing: 0.5px;
        border: 1px solid rgba(139, 92, 246, 0.3);
      }

      .stats-container {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
      }

      .stat-box {
        background: rgba(15, 23, 42, 0.5);
        border: 1px solid rgba(255,255,255,0.05);
        border-radius: 16px;
        padding: 20px;
        text-align: center;
        transition: all 0.3s ease;
      }

      .stat-box:hover {
        background: rgba(30, 41, 59, 0.8);
        border-color: rgba(99, 102, 241, 0.3);
        transform: translateY(-2px);
      }

      .stat-icon {
        color: #818cf8;
        margin-bottom: 12px;
        display: inline-block;
      }

      .stat-value {
        font-size: 28px;
        font-weight: 800;
        color: #f8fafc;
        margin-bottom: 4px;
      }

      .stat-label {
        font-size: 13px;
        color: #94a3b8;
        font-weight: 500;
      }

      .section-title {
        font-size: 20px;
        font-weight: 700;
        color: #f8fafc;
        margin-bottom: 24px;
        display: flex;
        align-items: center;
        gap: 12px;
      }
      
      .section-icon {
        color: #818cf8;
        background: rgba(99, 102, 241, 0.15);
        padding: 8px;
        border-radius: 10px;
      }

      .form-group {
        margin-bottom: 24px;
      }

      .form-label {
        display: block;
        font-size: 14px;
        font-weight: 500;
        color: #cbd5e1;
        margin-bottom: 8px;
      }

      .input-with-icon {
        position: relative;
      }

      .input-icon {
        position: absolute;
        left: 16px;
        top: 50%;
        transform: translateY(-50%);
        color: #64748b;
      }

      .form-control {
        width: 100%;
        padding: 14px 16px 14px 48px;
        background: rgba(15, 23, 42, 0.6);
        border: 1px solid rgba(71, 85, 105, 0.4);
        border-radius: 12px;
        color: #f8fafc;
        font-size: 15px;
        outline: none;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
      }

      .form-control:focus {
        border-color: #818cf8;
        background: rgba(15, 23, 42, 0.8);
        box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15), inset 0 2px 4px rgba(0,0,0,0.1);
      }

      .form-control:disabled {
        background: rgba(15, 23, 42, 0.4);
        color: #94a3b8;
        cursor: not-allowed;
      }

      .btn-primary {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        width: 100%;
        padding: 16px;
        background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
        color: white;
        border-radius: 12px;
        font-weight: 600;
        font-size: 16px;
        border: none;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 10px 20px -5px rgba(99, 102, 241, 0.4);
      }

      .btn-primary:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 15px 25px -5px rgba(99, 102, 241, 0.5);
      }

      .btn-primary:disabled {
        opacity: 0.7;
        cursor: not-allowed;
      }

      .divider {
        height: 1px;
        background: rgba(255,255,255,0.05);
        margin: 40px 0;
      }
    `;

    return (
        <>
            <style>{styles}</style>
            <div className="profile-container">
                <div className="header-section">
                    <h1 className="page-title">Profile Overview</h1>
                    <p className="page-subtitle">Manage your personal information and security settings.</p>
                </div>

                <div className="profile-grid">
                    {/* Left Column - User Info & Stats */}
                    <div className="glass-card" style={{ alignSelf: 'start' }}>
                        <div className="avatar-section">
                            <div className="avatar-wrapper">
                                <div className="avatar-circle">
                                    {user?.fullName?.charAt(0) || 'U'}
                                </div>
                                <button className="avatar-upload-btn" title="Change Avatar">
                                    <Camera size={16} />
                                </button>
                            </div>
                            <h2 className="user-name">{user?.fullName}</h2>
                            <div className="user-role">
                                <Shield size={14} />
                                {user?.role || 'User'} Account
                            </div>
                        </div>

                        <div className="stats-container">
                            <div className="stat-box">
                                <BookOpen size={24} className="stat-icon" />
                                <div className="stat-value">12</div>
                                <div className="stat-label">Notes Uploaded</div>
                            </div>
                            <div className="stat-box">
                                <Download size={24} className="stat-icon" style={{ color: '#34d399' }} />
                                <div className="stat-value">28</div>
                                <div className="stat-label">Notes Downloaded</div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Forms */}
                    <div className="glass-card">
                        {/* Personal Information Form */}
                        <h2 className="section-title">
                            <div className="section-icon"><User size={20} /></div>
                            Personal Information
                        </h2>
                        
                        <form onSubmit={handleUpdateProfile}>
                            <div className="form-group">
                                <label className="form-label">Full Name</label>
                                <div className="input-with-icon">
                                    <User size={18} className="input-icon" />
                                    <input 
                                        type="text" 
                                        name="fullName"
                                        className="form-control" 
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        placeholder="Enter your full name"
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div className="form-group">
                                <label className="form-label">Email Address</label>
                                <div className="input-with-icon">
                                    <Mail size={18} className="input-icon" />
                                    <input 
                                        type="email" 
                                        className="form-control" 
                                        value={user?.email}
                                        disabled
                                        title="Email address cannot be changed"
                                    />
                                </div>
                            </div>

                            <button type="submit" className="btn-primary" disabled={isSaving}>
                                <Save size={18} />
                                {isSaving ? 'Saving Changes...' : 'Save Profile Changes'}
                            </button>
                        </form>

                        <div className="divider"></div>

                        {/* Password Update Form */}
                        <h2 className="section-title">
                            <div className="section-icon"><Lock size={20} /></div>
                            Security & Password
                        </h2>
                        
                        <form onSubmit={handleUpdatePassword}>
                            <div className="form-group">
                                <label className="form-label">Current Password</label>
                                <div className="input-with-icon">
                                    <Lock size={18} className="input-icon" />
                                    <input 
                                        type="password" 
                                        name="currentPassword"
                                        className="form-control" 
                                        value={formData.currentPassword}
                                        onChange={handleChange}
                                        placeholder="Enter current password"
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div className="form-group">
                                <label className="form-label">New Password</label>
                                <div className="input-with-icon">
                                    <Shield size={18} className="input-icon" />
                                    <input 
                                        type="password" 
                                        name="newPassword"
                                        className="form-control" 
                                        value={formData.newPassword}
                                        onChange={handleChange}
                                        placeholder="Enter new password"
                                        required
                                        minLength={6}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Confirm New Password</label>
                                <div className="input-with-icon">
                                    <Shield size={18} className="input-icon" />
                                    <input 
                                        type="password" 
                                        name="confirmPassword"
                                        className="form-control" 
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="Confirm new password"
                                        required
                                        minLength={6}
                                    />
                                </div>
                            </div>

                            <button type="submit" className="btn-primary" disabled={isSaving} style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', boxShadow: '0 10px 20px -5px rgba(16, 185, 129, 0.4)' }}>
                                <Lock size={18} />
                                Update Password
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
