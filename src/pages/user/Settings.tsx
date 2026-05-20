import { useState } from 'react';
import { Bell, Moon, Sun, Monitor, Shield, Mail, Smartphone, Globe, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Settings() {
    const [isSaving, setIsSaving] = useState(false);

    const [settings, setSettings] = useState({
        emailNotifications: true,
        pushNotifications: false,
        marketingEmails: false,
        theme: 'dark', // 'dark', 'light', 'system'
        profileVisibility: 'public', // 'public', 'private'
        twoFactorAuth: false
    });

    const handleToggle = (key: keyof typeof settings) => {
        setSettings(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const handleChange = (key: keyof typeof settings, value: string) => {
        setSettings(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleSave = () => {
        setIsSaving(true);
        // Simulate API call
        setTimeout(() => {
            setIsSaving(false);
            toast.success("Settings saved successfully!");
        }, 1000);
    };

    const styles = `
      .settings-container {
        max-width: 900px;
        margin: 0 auto;
        padding: 40px 24px;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      }

      .header-section {
        margin-bottom: 40px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 20px;
      }

      .page-title {
        font-size: 36px;
        font-weight: 800;
        background: linear-gradient(to right, #a78bfa, #c084fc);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-bottom: 8px;
        letter-spacing: -0.5px;
      }

      .page-subtitle {
        color: #94a3b8;
        font-size: 16px;
      }

      .btn-save {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
        color: white;
        padding: 12px 24px;
        border-radius: 12px;
        font-weight: 600;
        border: none;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 10px 20px -5px rgba(99, 102, 241, 0.4);
      }

      .btn-save:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 15px 25px -5px rgba(99, 102, 241, 0.5);
      }

      .btn-save:disabled {
        opacity: 0.7;
        cursor: not-allowed;
      }

      .settings-section {
        background: linear-gradient(145deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.8) 100%);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(148, 163, 184, 0.1);
        border-radius: 24px;
        padding: 32px;
        margin-bottom: 32px;
        box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.3);
      }

      .section-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 24px;
        padding-bottom: 16px;
        border-bottom: 1px solid rgba(255,255,255,0.05);
      }

      .section-icon {
        color: #c084fc;
        background: rgba(192, 132, 252, 0.15);
        padding: 10px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .section-title {
        font-size: 20px;
        font-weight: 700;
        color: #f8fafc;
      }

      .setting-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px 0;
        border-bottom: 1px solid rgba(255,255,255,0.03);
      }

      .setting-item:last-child {
        border-bottom: none;
        padding-bottom: 0;
      }

      .setting-info {
        display: flex;
        align-items: flex-start;
        gap: 16px;
        max-width: 70%;
      }

      .setting-info-icon {
        color: #94a3b8;
        margin-top: 2px;
      }

      .setting-text h4 {
        font-size: 16px;
        font-weight: 600;
        color: #e2e8f0;
        margin-bottom: 4px;
      }

      .setting-text p {
        font-size: 14px;
        color: #64748b;
        line-height: 1.4;
      }

      /* Toggle Switch CSS */
      .toggle-switch {
        position: relative;
        width: 52px;
        height: 28px;
        background-color: rgba(30, 41, 59, 0.8);
        border: 1px solid rgba(148, 163, 184, 0.2);
        border-radius: 34px;
        cursor: pointer;
        transition: background-color 0.3s ease;
      }

      .toggle-switch.active {
        background-color: #8b5cf6;
        border-color: #a78bfa;
        box-shadow: 0 0 12px rgba(139, 92, 246, 0.4);
      }

      .toggle-knob {
        position: absolute;
        top: 2px;
        left: 2px;
        width: 22px;
        height: 22px;
        background-color: #fff;
        border-radius: 50%;
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      }

      .toggle-switch.active .toggle-knob {
        transform: translateX(24px);
      }

      /* Radio Group / Select CSS */
      .radio-group {
        display: flex;
        gap: 12px;
        background: rgba(15, 23, 42, 0.6);
        padding: 6px;
        border-radius: 12px;
        border: 1px solid rgba(148, 163, 184, 0.1);
      }

      .radio-option {
        padding: 8px 16px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        color: #94a3b8;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .radio-option:hover {
        color: #e2e8f0;
        background: rgba(255,255,255,0.05);
      }

      .radio-option.active {
        background: rgba(139, 92, 246, 0.15);
        color: #c084fc;
        border: 1px solid rgba(139, 92, 246, 0.3);
      }

      .select-control {
        background: rgba(15, 23, 42, 0.6);
        border: 1px solid rgba(71, 85, 105, 0.4);
        color: #f8fafc;
        padding: 10px 16px;
        border-radius: 10px;
        font-size: 14px;
        outline: none;
        cursor: pointer;
      }

      .select-control option {
        background: #0f172a;
      }
    `;

    return (
        <>
            <style>{styles}</style>
            <div className="settings-container">
                <div className="header-section">
                    <div>
                        <h1 className="page-title">Settings</h1>
                        <p className="page-subtitle">Manage your account preferences and platform experience.</p>
                    </div>
                    <button className="btn-save" onClick={handleSave} disabled={isSaving}>
                        <Save size={18} />
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>

                {/* Notifications Section */}
                <div className="settings-section">
                    <div className="section-header">
                        <div className="section-icon">
                            <Bell size={22} />
                        </div>
                        <h2 className="section-title">Notifications</h2>
                    </div>

                    <div className="setting-item">
                        <div className="setting-info">
                            <Mail className="setting-info-icon" size={20} />
                            <div className="setting-text">
                                <h4>Email Notifications</h4>
                                <p>Receive emails about your account activity and note purchases.</p>
                            </div>
                        </div>
                        <div 
                            className={`toggle-switch ${settings.emailNotifications ? 'active' : ''}`}
                            onClick={() => handleToggle('emailNotifications')}
                        >
                            <div className="toggle-knob"></div>
                        </div>
                    </div>

                    <div className="setting-item">
                        <div className="setting-info">
                            <Smartphone className="setting-info-icon" size={20} />
                            <div className="setting-text">
                                <h4>Push Notifications</h4>
                                <p>Get real-time push notifications when your uploaded notes are reviewed.</p>
                            </div>
                        </div>
                        <div 
                            className={`toggle-switch ${settings.pushNotifications ? 'active' : ''}`}
                            onClick={() => handleToggle('pushNotifications')}
                        >
                            <div className="toggle-knob"></div>
                        </div>
                    </div>
                </div>

                {/* Appearance Section */}
                <div className="settings-section">
                    <div className="section-header">
                        <div className="section-icon" style={{ color: '#60a5fa', background: 'rgba(96, 165, 250, 0.15)' }}>
                            <Monitor size={22} />
                        </div>
                        <h2 className="section-title">Appearance</h2>
                    </div>

                    <div className="setting-item">
                        <div className="setting-info">
                            <Monitor className="setting-info-icon" size={20} />
                            <div className="setting-text">
                                <h4>Theme Preference</h4>
                                <p>Select your preferred color theme for the platform.</p>
                            </div>
                        </div>
                        <div className="radio-group">
                            <div 
                                className={`radio-option ${settings.theme === 'light' ? 'active' : ''}`}
                                onClick={() => handleChange('theme', 'light')}
                            >
                                <Sun size={16} /> Light
                            </div>
                            <div 
                                className={`radio-option ${settings.theme === 'dark' ? 'active' : ''}`}
                                onClick={() => handleChange('theme', 'dark')}
                            >
                                <Moon size={16} /> Dark
                            </div>
                            <div 
                                className={`radio-option ${settings.theme === 'system' ? 'active' : ''}`}
                                onClick={() => handleChange('theme', 'system')}
                            >
                                <Monitor size={16} /> System
                            </div>
                        </div>
                    </div>
                </div>

                {/* Privacy & Security Section */}
                <div className="settings-section">
                    <div className="section-header">
                        <div className="section-icon" style={{ color: '#10b981', background: 'rgba(16, 185, 129, 0.15)' }}>
                            <Shield size={22} />
                        </div>
                        <h2 className="section-title">Privacy & Security</h2>
                    </div>

                    <div className="setting-item">
                        <div className="setting-info">
                            <Globe className="setting-info-icon" size={20} />
                            <div className="setting-text">
                                <h4>Profile Visibility</h4>
                                <p>Choose who can see your profile and your uploaded notes.</p>
                            </div>
                        </div>
                        <select 
                            className="select-control"
                            value={settings.profileVisibility}
                            onChange={(e) => handleChange('profileVisibility', e.target.value)}
                        >
                            <option value="public">Public (Everyone)</option>
                            <option value="private">Private (Only Me)</option>
                        </select>
                    </div>

                    <div className="setting-item">
                        <div className="setting-info">
                            <Shield className="setting-info-icon" size={20} />
                            <div className="setting-text">
                                <h4>Two-Factor Authentication</h4>
                                <p>Add an extra layer of security to your account.</p>
                            </div>
                        </div>
                        <div 
                            className={`toggle-switch ${settings.twoFactorAuth ? 'active' : ''}`}
                            onClick={() => handleToggle('twoFactorAuth')}
                        >
                            <div className="toggle-knob"></div>
                        </div>
                    </div>
                </div>

            </div>
        </>
    );
}
