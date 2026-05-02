import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const Auth = ({ mode: initialMode = 'login' }) => {
    const [mode, setMode] = useState(initialMode); // 'login' or 'register'
    const [role, setRole] = useState('donor'); // 'donor' or 'ngo'
    const [showPassword, setShowPassword] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const { login, register, loading, error: authError } = useAuth();
    const navigate = useNavigate();

    // Sync mode state if initialMode prop changes (e.g. navigating between /login and /register)
    useEffect(() => {
        setMode(initialMode);
    }, [initialMode]);

    const [form, setForm] = useState({
        name: '', email: '', password: '', confirmPassword: '',
        orgName: '', location: '', regNumber: ''
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const switchMode = (newMode) => {
        setIsAnimating(true);
        setTimeout(() => {
            setMode(newMode);
            setIsAnimating(false);
        }, 200);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (mode === 'login') {
                await login({ email: form.email, password: form.password });
            } else {
                if (form.password !== form.confirmPassword) {
                    alert("Passwords don't match");
                    return;
                }
                await register({
                    name: form.name,
                    email: form.email,
                    password: form.password,
                    role: role,
                    organization: role === 'ngo' ? form.orgName : null
                });
            }
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
        }
    };

    const getPasswordStrength = () => {
        const val = form.password;
        if (!val) return 0;
        let score = 0;
        if (val.length >= 6) score++;
        if (val.length >= 8 && /[!@#$%^&*(),.?":{}|<>]/.test(val)) score++;
        if (val.length >= 10 && /\d/.test(val)) score++;
        if (val.length >= 12) score++;
        return score;
    };

    const strength = getPasswordStrength();
    const strengthConfig = [
        { label: 'Weak', color: '#ef4444' },
        { label: 'Fair', color: '#f97316' },
        { label: 'Good', color: '#eab308' },
        { label: 'Strong', color: '#1D9E75' }
    ];

    return (
        <div className="auth-container">
            {/* Left Panel */}
            <div className="auth-left-panel">
                <div style={{ textAlign: 'center' }}>
                    <svg viewBox="0 0 300 300" style={{ width: '240px', marginBottom: '24px' }}>
                        {/* Simplified Hand Illustration */}
                        <path d="M50,150 Q80,140 100,160 L130,160 Q140,150 130,140 L100,140 Q80,120 50,130 Z" fill="#1D9E75" />
                        <path d="M250,150 Q220,140 200,160 L170,160 Q160,150 170,140 L200,140 Q220,120 250,130 Z" fill="#1D9E75" transform="rotate(180, 150, 150)" />
                        <circle cx="150" cy="150" r="30" fill="#2dd4a0" />
                        <path d="M140,120 Q150,100 160,120" stroke="white" fill="none" strokeWidth="2" />
                        <path d="M145,125 Q150,110 155,125" stroke="white" fill="none" strokeWidth="2" />
                    </svg>
                    <p style={{ color: 'rgba(255,255,255,0.8)', fontStyle: 'italic', fontSize: '18px', maxWidth: '240px', margin: '0 auto 20px' }}>"Every meal shared is a life touched"</p>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#1D9E75', opacity: 0.3 }}></div>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#1D9E75', opacity: 0.3 }}></div>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#1D9E75', opacity: 0.3 }}></div>
                    </div>
                </div>
            </div>

            {/* Right Panel */}
            <div className="auth-right-panel">
                <div className="auth-form-wrapper" style={{ opacity: isAnimating ? 0 : 1, transform: isAnimating ? 'translateY(10px)' : 'translateY(0)', transition: 'all 0.2s ease' }}>
                    <div style={{ marginBottom: '32px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="#1D9E75"><path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z"/></svg>
                            <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '18px', color: '#0a1f14' }}>CareConnect</span>
                        </div>
                    </div>

                    <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '32px', fontWeight: 800, color: '#0a1f14', marginBottom: '8px' }}>{mode === 'login' ? 'Welcome Back' : 'Create Your Account'}</h1>
                    <p style={{ fontSize: '15px', color: '#6b7280', marginBottom: '28px' }}>{mode === 'login' ? 'Login to continue your impact' : 'Join thousands making a difference'}</p>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {mode === 'register' && (
                            <div style={{ marginBottom: '10px' }}>
                                <label style={{ fontSize: '13px', fontWeight: 500, color: '#374151' }}>I am a...</label>
                                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                                    <button type="button" onClick={() => setRole('donor')} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1.5px solid #e5e7eb', background: role === 'donor' ? '#1D9E75' : '#fff', color: role === 'donor' ? '#fff' : 'inherit', cursor: 'pointer', fontSize: '14px', transition: '0.2s', borderColor: role === 'donor' ? '#1D9E75' : '#e5e7eb' }}>🙋 I'm a Donor</button>
                                    <button type="button" onClick={() => setRole('ngo')} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1.5px solid #e5e7eb', background: role === 'ngo' ? '#1D9E75' : '#fff', color: role === 'ngo' ? '#fff' : 'inherit', cursor: 'pointer', fontSize: '14px', transition: '0.2s', borderColor: role === 'ngo' ? '#1D9E75' : '#e5e7eb' }}>🏢 I'm an NGO</button>
                                </div>
                            </div>
                        )}

                        {mode === 'register' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <label style={{ fontSize: '13px', fontWeight: 500, color: '#374151' }}>Full Name</label>
                                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                    <span style={{ position: 'absolute', left: '14px', fontSize: '14px', color: '#9ca3af' }}>👤</span>
                                    <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="John Doe" style={{ width: '100%', height: '48px', padding: '0 44px', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', transition: '0.2s' }} required />
                                </div>
                            </div>
                        )}

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <label style={{ fontSize: '13px', fontWeight: 500, color: '#374151' }}>Email Address</label>
                            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                <span style={{ position: 'absolute', left: '14px', fontSize: '14px', color: '#9ca3af' }}>✉️</span>
                                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="name@example.com" style={{ width: '100%', height: '48px', padding: '0 44px', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', transition: '0.2s' }} required />
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <label style={{ fontSize: '13px', fontWeight: 500, color: '#374151' }}>Password</label>
                            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                <span style={{ position: 'absolute', left: '14px', fontSize: '14px', color: '#9ca3af' }}>🔒</span>
                                <input type={showPassword ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} placeholder="••••••••" style={{ width: '100%', height: '48px', padding: '0 44px', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', transition: '0.2s' }} required />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '14px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}>
                                    {showPassword ? '🙈' : '👁️'}
                                </button>
                            </div>
                            {mode === 'register' && strength > 0 && (
                                <div style={{ marginTop: '8px' }}>
                                    <div style={{ display: 'flex', gap: '4px', height: '4px' }}>
                                        {[1, 2, 3, 4].map(i => (
                                            <div key={i} style={{ flex: 1, borderRadius: '2px', background: i <= strength ? strengthConfig[strength - 1].color : '#e5e7eb' }}></div>
                                        ))}
                                    </div>
                                    <span style={{ fontSize: '11px', marginTop: '4px', display: 'block', color: strengthConfig[strength - 1].color }}>{strengthConfig[strength - 1].label}</span>
                                </div>
                            )}
                        </div>

                        {mode === 'register' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <label style={{ fontSize: '13px', fontWeight: 500, color: '#374151' }}>Confirm Password</label>
                                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                    <span style={{ position: 'absolute', left: '14px', fontSize: '14px', color: '#9ca3af' }}>🔒</span>
                                    <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="••••••••" style={{ width: '100%', height: '48px', padding: '0 44px', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', transition: '0.2s' }} required />
                                </div>
                            </div>
                        )}

                        {mode === 'register' && role === 'ngo' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', transition: '0.3s' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label style={{ fontSize: '13px', fontWeight: 500, color: '#374151' }}>Organization Name</label>
                                    <input type="text" name="orgName" value={form.orgName} onChange={handleChange} placeholder="Hope Foundation" style={{ width: '100%', height: '48px', padding: '0 16px', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '14px' }} required />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label style={{ fontSize: '13px', fontWeight: 500, color: '#374151' }}>Registration Number</label>
                                    <input type="text" name="regNumber" value={form.regNumber} onChange={handleChange} placeholder="NGO-123456" style={{ width: '100%', height: '48px', padding: '0 16px', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '14px' }} required />
                                </div>
                            </div>
                        )}

                        <button type="submit" disabled={loading} style={{ width: '100%', height: '50px', background: '#1D9E75', color: '#fff', borderRadius: '10px', border: 'none', fontSize: '16px', fontWeight: 500, cursor: 'pointer', marginTop: '10px', transition: '0.2s' }}>
                            {loading ? 'Processing...' : (mode === 'login' ? 'Login to CareConnect' : 'Create My Account')}
                        </button>

                        {authError && <p style={{ color: '#ef4444', fontSize: '13px', textAlign: 'center', marginTop: '8px' }}>{authError}</p>}

                        <div style={{ textAlign: 'center', fontSize: '14px', color: '#6b7280', marginTop: '20px' }}>
                            {mode === 'login' ? (
                                <>Don't have an account? <span onClick={() => switchMode('register')} style={{ color: '#1D9E75', cursor: 'pointer', fontWeight: 500 }}>Register →</span></>
                            ) : (
                                <>Already have an account? <span onClick={() => switchMode('login')} style={{ color: '#1D9E75', cursor: 'pointer', fontWeight: 500 }}>Login →</span></>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Auth;
