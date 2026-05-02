import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './Navbar.css';

const Navbar = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 70);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close menu when route changes
    useEffect(() => {
        setMenuOpen(false);
    }, [navigate]);

    return (
        <>
            <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
                <div className="nav-logo" onClick={() => navigate('/')}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="#1D9E75">
                        <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z"/>
                    </svg>
                    <span className="nav-logo-text" style={{ color: scrolled ? '#0a1f14' : '#fff' }}>CareConnect</span>
                </div>

                <div className="nav-links">
                    <Link to="/" className="nav-link" style={{ color: scrolled ? '#374151' : '#fff' }}>Home</Link>
                    <Link to="/request" className="nav-link" style={{ color: scrolled ? '#374151' : '#fff' }}>Browse Food</Link>
                    <Link to="/orphanage" className="nav-link" style={{ color: scrolled ? '#374151' : '#fff' }}>Orphanage</Link>
                    <Link to="/events" className="nav-link" style={{ color: scrolled ? '#374151' : '#fff' }}>Events</Link>
                    
                    {isAuthenticated ? (
                        <>
                            <Link to="/donate" className="nav-link" style={{ color: scrolled ? '#374151' : '#fff' }}>Donate Food</Link>
                            <Link to="/dashboard" className="nav-link" style={{ color: scrolled ? '#374151' : '#fff' }}>Dashboard</Link>
                            <div className="nav-user-profile">
                                <span className="nav-user-name">{user?.name || 'User'}</span>
                                <button onClick={logout} className="nav-logout-btn">Logout</button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-link" style={{ color: scrolled ? '#374151' : '#fff' }}>Login</Link>
                            <Link to="/register" className="nav-cta">Get Involved</Link>
                        </>
                    )}
                </div>

                <button className="nav-hamburger" onClick={() => setMenuOpen(!menuOpen)}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill={scrolled ? '#0a1f14' : '#fff'}>
                        <path d={menuOpen ? "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" : "M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"}/>
                    </svg>
                </button>

                <div className={`mobile-overlay ${menuOpen ? 'visible' : ''}`} onClick={() => setMenuOpen(false)}></div>
                
                <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
                    <Link to="/" className="nav-link" onClick={() => setMenuOpen(false)}>Home</Link>
                    <Link to="/request" className="nav-link" onClick={() => setMenuOpen(false)}>Browse Food</Link>
                    <Link to="/orphanage" className="nav-link" onClick={() => setMenuOpen(false)}>Orphanage</Link>
                    <Link to="/events" className="nav-link" onClick={() => setMenuOpen(false)}>Events</Link>
                    {isAuthenticated ? (
                        <>
                            <Link to="/donate" className="nav-link" onClick={() => setMenuOpen(false)}>Donate Food</Link>
                            <Link to="/dashboard" className="nav-link" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                            <button onClick={logout} className="nav-logout-btn" style={{ width: '100%', marginTop: 'auto' }}>Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-link" onClick={() => setMenuOpen(false)}>Login</Link>
                            <Link to="/register" className="nav-cta" style={{ textAlign: 'center' }} onClick={() => setMenuOpen(false)}>Get Involved</Link>
                        </>
                    )}
                </div>
            </nav>
        </>
    );
};

export default Navbar;
