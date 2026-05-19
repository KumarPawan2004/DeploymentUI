import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { User, Mail, Lock, Eye, EyeOff, ArrowLeft, CheckCircle } from 'lucide-react';

export default function Register() {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [agreed, setAgreed] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { fullName, email, password, confirmPassword } = formData;

        if (!fullName || !email || !password || !confirmPassword) {
            toast.error('Please fill all fields');
            return;
        }
        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        if (password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }
        if (!agreed) {
            toast.error('Please accept the terms and conditions');
            return;
        }

        try {
            setIsLoading(true);
            const response = await fetch('http://localhost:5001/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fullName, email, password }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Registration failed');

            toast.success('Account created! Please sign in.');
            navigate('/login');
        } catch (error: unknown) {
            toast.error((error as Error).message || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    const passwordStrength = () => {
        const p = formData.password;
        if (!p) return null;
        if (p.length < 6) return { label: 'Weak', color: '#ef4444', width: '30%' };
        if (p.length < 10) return { label: 'Medium', color: '#f59e0b', width: '60%' };
        return { label: 'Strong', color: '#22c55e', width: '100%' };
    };
    const strength = passwordStrength();

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
            width: '400px', height: '400px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)',
            pointerEvents: 'none' as const,
        },
        orb2: {
            position: 'absolute' as const,
            bottom: '-100px', right: '-80px',
            width: '500px', height: '500px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)',
            pointerEvents: 'none' as const,
        },
        wrapper: {
            position: 'relative' as const, zIndex: 10,
            width: '100%', maxWidth: '460px',
            display: 'flex', flexDirection: 'column' as const,
            alignItems: 'center', gap: '25px',
        },
        logo: {
            display: 'flex', flexDirection: 'row' as const,
            alignItems: 'center', gap: '12px',
        },
        logoIcon: {
            width: '58px', height: '58px', borderRadius: '16px',
            background: 'linear-gradient(135deg, rgba(99,102,241,0.3) 0%, rgba(139,92,246,0.3) 100%)',
            border: '1px solid rgba(99,102,241,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '26px',
            boxShadow: '0 0 30px rgba(99,102,241,0.2)',
        },
        appName: {
            fontSize: '26px', fontWeight: 700, color: '#ffffff',
            letterSpacing: '-0.5px', margin: 0,
        },
        tagline: {
            fontSize: '12px', color: 'rgba(148,163,184,0.8)',
            letterSpacing: '2px', textTransform: 'uppercase' as const, fontWeight: 500,
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
        cardHeader: { marginBottom: '10px' },
        cardTitle: {
            fontSize: '22px', fontWeight: 700, color: '#f8fafc',
            margin: '0 0 2px 0', letterSpacing: '-0.3px',
        },
        cardSubtitle: { fontSize: '14px', color: '#64748b', margin: 0 },
        form: { display: 'flex', flexDirection: 'column' as const, gap: '10px' },
        fieldGroup: { display: 'flex', flexDirection: 'column' as const, gap: '4px' },
        label: {
            fontSize: '13px', fontWeight: 500,
            color: '#94a3b8', letterSpacing: '0.2px',
        },
        inputWrapper: { position: 'relative' as const, display: 'flex', alignItems: 'center' },
        iconLeft: {
            position: 'absolute' as const, left: '14px', color: '#4e5d73',
            display: 'flex', alignItems: 'center',
            pointerEvents: 'none' as const, zIndex: 1,
        },
        iconRight: {
            position: 'absolute' as const, right: '14px', color: '#4e5d73',
            display: 'flex', alignItems: 'center', cursor: 'pointer',
            background: 'transparent', border: 'none', padding: 0,
            transition: 'color 0.2s', zIndex: 1,
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
        strengthBar: {
            marginTop: '4px',
            display: 'flex',
            flexDirection: 'column' as const,
            gap: '2px',
        },
        strengthTrack: {
            width: '100%', height: '3px',
            background: 'rgba(255,255,255,0.06)',
            borderRadius: '2px', overflow: 'hidden',
        },
        checkboxRow: {
            display: 'flex', alignItems: 'flex-start', gap: '10px',
            marginTop: '2px',
        },
        checkbox: {
            width: '16px', height: '16px',
            accentColor: '#6366f1', cursor: 'pointer',
            flexShrink: 0, marginTop: '2px',
        },
        checkboxText: {
            fontSize: '13px', color: '#94a3b8', lineHeight: '1.5',
        },
        termsLink: {
            color: '#818cf8', fontWeight: 500, textDecoration: 'none',
        },
        submitBtn: {
            width: '100%', padding: '12px',
            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            border: 'none', borderRadius: '10px',
            color: '#ffffff', fontSize: '14px', fontWeight: 600,
            fontFamily: 'inherit', cursor: 'pointer', marginTop: '4px',
            transition: 'all 0.2s', letterSpacing: '0.2px',
            boxShadow: '0 2px 12px rgba(99,102,241,0.2)',
        },
        divider: {
            display: 'flex', alignItems: 'center', gap: '4px',
            margin: '12px 0',
        },
        dividerLine: { flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' },
        dividerText: {
            fontSize: '12px', color: '#64748b', whiteSpace: 'nowrap' as const, fontWeight: 500,
        },
        cardFooter: {
            textAlign: 'center' as const, fontSize: '13px', color: '#475569',
            marginTop: '12px', paddingTop: '6px',
            borderTop: '1px solid rgba(255,255,255,0.06)',
        },
        loginLink: {
            color: '#818cf8', fontWeight: 600,
            textDecoration: 'none',
            display: 'inline-flex', alignItems: 'center', gap: '4px',
        },
        infoBox: {
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '4px 8px',
            background: 'rgba(99,102,241,0.08)',
            border: '1px solid rgba(99,102,241,0.2)',
            borderRadius: '8px',
            marginTop: '2px',
        },
        infoText: { fontSize: '12px', color: '#94a3b8', lineHeight: '1.5' },
        copyright: {
            fontSize: '12px', color: 'rgba(71,85,105,0.6)',
            textAlign: 'center' as const,
        },
    };

    return (
        <div style={s.page}>
            <div style={s.orb1} />
            <div style={s.orb2} />

            <div style={s.wrapper}>
                {/* Card */}
                <div style={s.card}>
                    <div style={s.cardHeader}>
                        <h2 style={s.cardTitle}>Create your account</h2>
                        <p style={s.cardSubtitle}>Join thousands of students sharing knowledge</p>
                    </div>

                    <form onSubmit={handleSubmit} style={s.form}>
                        {/* Full Name */}
                        <div style={s.fieldGroup}>
                            <label style={s.label}>Full name</label>
                            <div style={s.inputWrapper}>
                                <span style={s.iconLeft}><User size={16} /></span>
                                <input
                                    name="fullName"
                                    type="text"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                    style={s.input}
                                    onFocus={(e) => { e.target.style.borderColor = 'rgba(99,102,241,0.7)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)'; }}
                                    onBlur={(e) => { e.target.style.borderColor = 'rgba(99,102,241,0.15)'; e.target.style.boxShadow = 'none'; }}
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div style={s.fieldGroup}>
                            <label style={s.label}>Email address</label>
                            <div style={s.inputWrapper}>
                                <span style={s.iconLeft}><Mail size={16} /></span>
                                <input
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    style={s.input}
                                    onFocus={(e) => { e.target.style.borderColor = 'rgba(99,102,241,0.7)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)'; }}
                                    onBlur={(e) => { e.target.style.borderColor = 'rgba(99,102,241,0.15)'; e.target.style.boxShadow = 'none'; }}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div style={s.fieldGroup}>
                            <label style={s.label}>Password</label>
                            <div style={s.inputWrapper}>
                                <span style={s.iconLeft}><Lock size={16} /></span>
                                <input
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Min. 6 characters"
                                    style={{ ...s.input, paddingRight: '44px' }}
                                    onFocus={(e) => { e.target.style.borderColor = 'rgba(99,102,241,0.7)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)'; }}
                                    onBlur={(e) => { e.target.style.borderColor = 'rgba(99,102,241,0.15)'; e.target.style.boxShadow = 'none'; }}
                                />
                                <button type="button" style={s.iconRight} onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            {/* Password strength */}
                            {strength && (
                                <div style={s.strengthBar}>
                                    <div style={s.strengthTrack}>
                                        <div style={{ height: '100%', width: strength.width, background: strength.color, borderRadius: '2px', transition: 'all 0.3s' }} />
                                    </div>
                                    <span style={{ fontSize: '11px', color: strength.color, fontWeight: 500 }}>{strength.label} password</span>
                                </div>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div style={s.fieldGroup}>
                            <label style={s.label}>Confirm password</label>
                            <div style={s.inputWrapper}>
                                <span style={s.iconLeft}><Lock size={16} /></span>
                                <input
                                    name="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    style={{
                                        ...s.input, paddingRight: '44px',
                                        ...(formData.confirmPassword && formData.confirmPassword !== formData.password
                                            ? { borderColor: 'rgba(239,68,68,0.5)' }
                                            : formData.confirmPassword && formData.confirmPassword === formData.password
                                                ? { borderColor: 'rgba(34,197,94,0.5)' }
                                                : {}
                                        )
                                    }}
                                    onFocus={(e) => { e.target.style.borderColor = 'rgba(99,102,241,0.7)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)'; }}
                                    onBlur={(e) => {
                                        e.target.style.boxShadow = 'none';
                                        if (formData.confirmPassword && formData.confirmPassword !== formData.password) {
                                            e.target.style.borderColor = 'rgba(239,68,68,0.5)';
                                        } else {
                                            e.target.style.borderColor = 'rgba(99,102,241,0.15)';
                                        }
                                    }}
                                />
                                <button type="button" style={s.iconRight} onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            {formData.confirmPassword && formData.confirmPassword === formData.password && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                                    <CheckCircle size={12} color="#22c55e" />
                                    <span style={{ fontSize: '11px', color: '#22c55e', fontWeight: 500 }}>Passwords match</span>
                                </div>
                            )}
                        </div>

                        {/* Terms */}
                        <div style={s.checkboxRow}>
                            <input
                                type="checkbox"
                                checked={agreed}
                                onChange={(e) => setAgreed(e.target.checked)}
                                style={s.checkbox}
                                id="terms"
                            />
                            <label htmlFor="terms" style={s.checkboxText}>
                                I agree to the{' '}
                                <a href="#" style={s.termsLink}>Terms of Service</a>
                                {' '}and{' '}
                                <a href="#" style={s.termsLink}>Privacy Policy</a>
                            </label>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            style={{ ...s.submitBtn, opacity: isLoading ? 0.8 : 1 }}
                            onMouseEnter={(e) => { if (!isLoading) { (e.target as HTMLButtonElement).style.background = 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)'; (e.target as HTMLButtonElement).style.transform = 'translateY(-1px)'; (e.target as HTMLButtonElement).style.boxShadow = '0 6px 24px rgba(99,102,241,0.4)'; } }}
                            onMouseLeave={(e) => { (e.target as HTMLButtonElement).style.background = 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)'; (e.target as HTMLButtonElement).style.transform = 'translateY(0)'; (e.target as HTMLButtonElement).style.boxShadow = '0 2px 12px rgba(99,102,241,0.2)'; }}
                        >
                            {isLoading ? 'Creating account...' : 'Create account'}
                        </button>
                    </form>

                    {/* Divider */}
                    <div style={s.divider}>
                        <div style={s.dividerLine} />
                        <span style={s.dividerText}>Note</span>
                        <div style={s.dividerLine} />
                    </div>

                    {/* Info box */}
                    <div style={s.infoBox}>
                        <CheckCircle size={14} color="#818cf8" style={{ flexShrink: 0 }} />
                        <p style={s.infoText}>Admin accounts are created by a Super Admin only. This form creates a standard User account.</p>
                    </div>

                    {/* Footer */}
                    <div style={s.cardFooter}>
                        <span>Already have an account?{' '}</span>
                        <Link
                            to="/login"
                            style={s.loginLink}
                            onMouseEnter={(e) => ((e.currentTarget).style.color = '#a5b4fc')}
                            onMouseLeave={(e) => ((e.currentTarget).style.color = '#818cf8')}
                        >
                            <ArrowLeft size={13} /> Sign in
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