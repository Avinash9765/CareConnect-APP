import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
    const { user, isAuthenticated, logout, isNGO } = useAuth();
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 70);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav style={{ ...styles.nav, ...(scrolled ? styles.navScrolled : {}) }}>
            <div style={styles.logo} onClick={() => navigate('/')}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="#1D9E75"><path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z"/></svg>
                <span style={styles.logoText}>CareConnect</span>
            </div>

            <div style={styles.links}>
                <Link to="/" style={styles.link}>Home</Link>
                <Link to="/request" style={styles.link}>Browse Food</Link>
                <Link to="/orphanage" style={styles.link}>Orphanage</Link>
                <Link to="/events" style={styles.link}>Events</Link>
                
                {isAuthenticated ? (
                    <>
                        <Link to="/donate" style={styles.link}>Donate Food</Link>
                        <Link to="/dashboard" style={styles.link}>Dashboard</Link>
                        <div style={styles.userProfile}>
                            <span style={styles.userName}>{user?.name || 'User'}</span>
                            <button onClick={logout} style={styles.logoutBtn}>Logout</button>
                        </div>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={styles.link}>Login</Link>
                        <Link to="/register" style={styles.cta}>Get Involved</Link>
                    </>
                )}
            </div>

            <div style={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill={scrolled ? '#0a1f14' : '#fff'}><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>
            </div>

            {menuOpen && (
                <div style={styles.mobileMenu}>
                    <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
                    <Link to="/request" onClick={() => setMenuOpen(false)}>Browse Food</Link>
                    <Link to="/donate" onClick={() => setMenuOpen(false)}>Donate</Link>
                    <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
                </div>
            )}
        </nav>
    );
};

const styles = {
    nav: { position: 'fixed', top: 0, width: '100%', height: '70px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 40px', zIndex: 1000, transition: '0.3s ease', background: 'transparent' },
    navScrolled: { background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' },
    logo: { display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' },
    logoText: { fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '20px', color: '#0a1f14' },
    links: { display: 'flex', alignItems: 'center', gap: '24px' },
    link: { color: '#374151', fontSize: '14px', fontWeight: 500, textDecoration: 'none', transition: '0.2s' },
    cta: { background: '#1D9E75', color: '#fff', padding: '10px 20px', borderRadius: '50px', fontSize: '14px', fontWeight: 500, textDecoration: 'none' },
    userProfile: { display: 'flex', alignItems: 'center', gap: '12px', marginLeft: '12px' },
    userName: { fontSize: '14px', fontWeight: 600, color: '#1D9E75' },
    logoutBtn: { background: '#f3f4f6', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' },
    hamburger: { display: 'none', cursor: 'pointer' },
    mobileMenu: { position: 'absolute', top: '70px', left: 0, width: '100%', background: '#fff', padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px', boxShadow: '0 5px 10px rgba(0,0,0,0.1)' }
};

export default Navbar;
