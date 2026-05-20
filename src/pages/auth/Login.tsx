import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    const [rememberMe, setRememberMe] = useState(false);

    const { login, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            if (user.role === 'Admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/');
            }
        }
    }, [user, navigate]);

    // Load remembered credentials on mount
    useEffect(() => {
        const savedEmail = localStorage.getItem('rememberedEmail');
        const savedPassword = localStorage.getItem('rememberedPassword');
        if (savedEmail && savedPassword) {
            setEmail(savedEmail);
            setPassword(savedPassword);
            setRememberMe(true);
        }
    }, []);

    const validateForm = () => {
        const newErrors: { email?: string; password?: string } = {};
        if (!email) newErrors.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Please enter a valid email';
        if (!password) newErrors.password = 'Password is required';
        else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            setIsLoading(true);

            // Handle Remember Me credentials
            if (rememberMe) {
                localStorage.setItem('rememberedEmail', email);
                localStorage.setItem('rememberedPassword', password);
            } else {
                localStorage.removeItem('rememberedEmail');
                localStorage.removeItem('rememberedPassword');
            }

            await login(email.trim().toLowerCase(), password);

        } catch (error: any) {
            toast.error(
                error.response?.data?.message ||
                (error as Error).message ||
                'Login failed. Please try again.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    const s = {
        page: {
            minHeight: '100vh',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            background: 'linear-gradient(135deg, #0f0c29 0%, #1a1040 40%, #0d1117 100%)',
            position: 'relative' as const,
            overflow: 'hidden',
            padding: '24px 16px',
        },
        orb1: {
            position: 'absolute' as const,
            top: '-80px', left: '-80px',
            width: '400px', height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)',
            pointerEvents: 'none' as const,
        },
        orb2: {
            position: 'absolute' as const,
            bottom: '-100px', right: '-80px',
            width: '500px', height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)',
            pointerEvents: 'none' as const,
        },
        orb3: {
            position: 'absolute' as const,
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '600px', height: '300px',
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(59,130,246,0.08) 0%, transparent 70%)',
            pointerEvents: 'none' as const,
        },
        wrapper: {
            position: 'relative' as const,
            zIndex: 10,
            width: '100%',
            maxWidth: '440px',
            display: 'flex',
            flexDirection: 'column' as const,
            alignItems: 'center',
            gap: '25px',
        },
        logo: {
            display: 'flex',
            flexDirection: 'row' as const,
            alignItems: 'center',
            gap: '16px',
        },
        logoIcon: {
            width: '64px', height: '64px',
            borderRadius: '18px',
            background: 'linear-gradient(135deg, rgba(99,102,241,0.3) 0%, rgba(139,92,246,0.3) 100%)',
            border: '1px solid rgba(99,102,241,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '28px',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 0 30px rgba(99,102,241,0.2)',
        },
        appName: {
            fontSize: '28px', fontWeight: 700,
            color: '#ffffff',
            letterSpacing: '-0.5px',
            margin: 0,
        },
        tagline: {
            fontSize: '13px', color: 'rgba(148,163,184,0.8)',
            letterSpacing: '2px', textTransform: 'uppercase' as const,
            fontWeight: 500,
        },
        card: {
            width: '100%',
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '20px',
            padding: '24px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05) inset',
        },
        cardHeader: {
            marginBottom: '18px',
        },
        cardTitle: {
            fontSize: '22px', fontWeight: 700,
            color: '#f8fafc', margin: '0 0 4px 0',
            letterSpacing: '-0.3px',
        },
        cardSubtitle: {
            fontSize: '14px', color: '#64748b', margin: 0,
        },
        form: {
            display: 'flex', flexDirection: 'column' as const, gap: '16px',
        },
        fieldGroup: {
            display: 'flex', flexDirection: 'column' as const, gap: '6px',
        },
        label: {
            fontSize: '13px', fontWeight: 500,
            color: '#94a3b8',
            letterSpacing: '0.2px',
        },
        inputWrapper: {
            position: 'relative' as const, display: 'flex', alignItems: 'center',
        },
        iconLeft: {
            position: 'absolute' as const, left: '14px',
            color: '#4e5d73',
            display: 'flex', alignItems: 'center',
            pointerEvents: 'none' as const,
            zIndex: 1,
        },
        iconRight: {
            position: 'absolute' as const, right: '14px',
            color: '#4e5d73',
            display: 'flex', alignItems: 'center',
            cursor: 'pointer',
            background: 'transparent', border: 'none', padding: 0,
            transition: 'color 0.2s',
            zIndex: 1,
        },
        input: {
            width: '100%',
            padding: '12px 14px 12px 44px',
            background: 'rgba(8,15,32,0.7)',
            border: '1px solid rgba(99,102,241,0.15)',
            borderRadius: '10px',
            color: '#e2e8f0',
            fontSize: '14px',
            fontFamily: 'inherit',
            outline: 'none',
            transition: 'all 0.2s',
            boxSizing: 'border-box' as const,
        },
        inputError: {
            border: '1px solid rgba(239,68,68,0.5)',
        },
        errorText: {
            fontSize: '12px', color: '#f87171', marginTop: '4px',
        },
        rowBetween: {
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginTop: '4px',
        },
        checkboxLabel: {
            display: 'flex', alignItems: 'center', gap: '8px',
            fontSize: '13px', color: '#94a3b8', cursor: 'pointer',
            lineHeight: '1',
            userSelect: 'none' as const,
        },
        checkbox: {
            width: '15px', height: '15px',
            accentColor: '#6366f1', cursor: 'pointer',
            flexShrink: 0,
            margin: 0,
        },
        forgotLink: {
            fontSize: '13px', fontWeight: 500,
            color: '#818cf8',
            textDecoration: 'none',
            transition: 'color 0.2s',
        },
        submitBtn: {
            width: '100%',
            padding: '12px',
            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            border: 'none',
            borderRadius: '10px',
            color: '#ffffff',
            fontSize: '14px',
            fontWeight: 600,
            fontFamily: 'inherit',
            cursor: 'pointer',
            marginTop: '8px',
            transition: 'all 0.2s',
            letterSpacing: '0.2px',
            boxShadow: '0 2px 12px rgba(99,102,241,0.2)',
        },
        dividerRow: {
            display: 'flex', alignItems: 'center', gap: '14px',
            margin: '24px 0 20px',
        },
        dividerLine: {
            flex: 1, height: '1px',
            background: 'rgba(255,255,255,0.08)',
        },
        dividerText: {
            fontSize: '12px', color: '#64748b', whiteSpace: 'nowrap' as const,
            fontWeight: 500,
            letterSpacing: '0.3px',
        },
        socialGrid: {
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px',
        },
        socialBtn: {
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            padding: '10px 16px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '10px',
            color: '#cbd5e1',
            fontSize: '13px',
            fontWeight: 500,
            fontFamily: 'inherit',
            cursor: 'pointer',
            transition: 'all 0.2s',
        },
        cardFooter: {
            textAlign: 'center' as const,
            fontSize: '13px',
            color: '#475569',
            marginTop: '24px',
            paddingTop: '20px',
            borderTop: '1px solid rgba(255,255,255,0.06)',
        },
        signupLink: {
            color: '#818cf8',
            fontWeight: 600,
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
        },
        copyright: {
            fontSize: '12px',
            color: 'rgba(71,85,105,0.6)',
            textAlign: 'center' as const,
        }
    };

    return (
        <div style={s.page}>
            {/* Background orbs */}
            <div style={s.orb1} />
            <div style={s.orb2} />
            <div style={s.orb3} />

            <div style={s.wrapper}>
                {/* Logo */}
                <div style={s.logo}>
                    <div style={s.logoIcon}>📚</div>
                    <div style={{ textAlign: 'center' }}>
                        <h1 style={s.appName}>NotesHub</h1>
                        <p style={s.tagline}>Share · Sell · Learn</p>
                    </div>
                </div>

                {/* Card */}
                <div style={s.card}>
                    <div style={s.cardHeader}>
                        <h2 style={s.cardTitle}>Welcome back</h2>
                        <p style={s.cardSubtitle}>Sign in to your account to continue</p>
                    </div>

                    <form onSubmit={handleSubmit} style={s.form}>
                        {/* Email Field */}
                        <div style={s.fieldGroup}>
                            <label style={s.label}>Email address</label>
                            <div style={s.inputWrapper}>
                                <span style={s.iconLeft}><Mail size={16} /></span>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        if (errors.email) setErrors({ ...errors, email: '' });
                                    }}
                                    placeholder="you@example.com"
                                    style={{ ...s.input, ...(errors.email ? s.inputError : {}) }}
                                />
                            </div>
                            {errors.email && <span style={s.errorText}>{errors.email}</span>}
                        </div>

                        {/* Password Field */}
                        <div style={s.fieldGroup}>
                            <label style={s.label}>Password</label>
                            <div style={s.inputWrapper}>
                                <span style={s.iconLeft}><Lock size={16} /></span>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        if (errors.password) setErrors({ ...errors, password: '' });
                                    }}
                                    placeholder="••••••••"
                                    style={{
                                        ...s.input,
                                        paddingRight: '44px',
                                        ...(errors.password ? s.inputError : {})
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={s.iconRight}
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            {errors.password && <span style={s.errorText}>{errors.password}</span>}
                        </div>

                        {/* Remember & Forgot */}
                        <div style={s.rowBetween}>
                            <label style={s.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    style={s.checkbox}
                                />
                                Remember for 30 days
                            </label>
                            <Link to="/forgot-password" style={s.forgotLink}>
                                Forgot password?
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            style={{
                                ...s.submitBtn,
                                opacity: isLoading ? 0.8 : 1,
                                cursor: isLoading ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {isLoading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </form>

                    {/* Divider */}
                    <div style={s.dividerRow}>
                        <div style={s.dividerLine} />
                        <span style={s.dividerText}>or continue with</span>
                        <div style={s.dividerLine} />
                    </div>

                    {/* Social Buttons with Logos */}
                    <div style={s.socialGrid}>
                        <button
                            type="button"
                            style={s.socialBtn}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                            }}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Google
                        </button>

                        <button
                            type="button"
                            style={s.socialBtn}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                            }}
                        >
                            <svg width="18" height="18" fill="#e2e8f0" viewBox="0 0 24 24">
                                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                            </svg>
                            GitHub
                        </button>
                    </div>

                    {/* Footer */}
                    <div style={s.cardFooter}>
                        <span>Don't have an account?{' '}</span>
                        <Link to="/register" style={s.signupLink}>
                            Sign up <ArrowRight size={13} />
                        </Link>
                    </div>
                </div>

                <p style={s.copyright}>
                    © {new Date().getFullYear()} NotesHub Inc. All rights reserved.
                </p>
            </div>
        </div>
    );
}