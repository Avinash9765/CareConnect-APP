import { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useNavigate } from 'react-router-dom';
import * as impactService from '../services/impactService';
import * as donationService from '../services/donationService';

// Fix Leaflet icon issue
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom icons
const getVehicleIcon = () => {
    try {
        return L.icon({
            iconUrl: 'https://cdn-icons-png.flaticon.com/512/2769/2769212.png',
            iconSize: [40, 40],
            iconAnchor: [20, 20]
        });
    } catch (e) { return DefaultIcon; }
};

const MovingVehicle = () => {
    const [pos, setPos] = useState([12.9716, 77.5946]);
    const route = [[12.9716, 77.5946], [12.9816, 77.6046], [12.9916, 77.6146], [12.9716, 77.6246], [12.9616, 77.6146]];
    const [index, setIndex] = useState(0);
    
    useEffect(() => {
        const timer = setInterval(() => setIndex(i => (i + 1) % route.length), 3000);
        return () => clearInterval(timer);
    }, []);
    
    useEffect(() => {
        if (route[index]) setPos(route[index]);
    }, [index]);

    return <Marker position={pos} icon={getVehicleIcon()}><Popup>🚗 Food delivery in progress...</Popup></Marker>;
};

const ImpactDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [counts, setCounts] = useState({ meals: 0, people: 0, ngos: 0, volunteers: 0, events: 0 });
    
    const barRef = useRef(null);
    const doughnutRef = useRef(null);
    const charts = useRef({ bar: null, doughnut: null });

    const fetchData = async () => {
        try {
            const [statsData, donationsData] = await Promise.all([
                impactService.getImpactStats().catch(() => ({ success: false })),
                donationService.getDonations({ limit: 50 }).catch(() => ({ success: false }))
            ]);
            
            if (statsData?.success && statsData?.stats) {
                const s = statsData.stats;
                setStats(s);
                setCounts({
                    meals: (s.totalDonations || 0) * 10,
                    people: s.estimatedPeopleHelped || 0,
                    ngos: s.totalNGOs || 0,
                    volunteers: s.totalVolunteers || 0,
                    events: s.activeEvents || 0
                });
            }
            if (donationsData?.success && donationsData?.donations) {
                setDonations(donationsData.donations);
            }
        } catch (err) { console.error('Dashboard Fetch Error:', err); }
        finally { setLoading(false); }
    };

    useEffect(() => {
        fetchData();
        const poll = setInterval(fetchData, 8000); // Slower polling for stability
        return () => clearInterval(poll);
    }, []);

    useEffect(() => {
        if (!stats || !barRef.current || !stats.monthlyDonations) return;
        
        try {
            if (charts.current.bar) charts.current.bar.destroy();
            charts.current.bar = new Chart(barRef.current, {
                type: 'bar',
                data: {
                    labels: stats.monthlyDonations.map(d => d.month || ''),
                    datasets: [{ label: 'Donations', data: stats.monthlyDonations.map(d => d.count || 0), backgroundColor: '#1D9E75', borderRadius: 6 }]
                },
                options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
            });

            if (doughnutRef.current) {
                if (charts.current.doughnut) charts.current.doughnut.destroy();
                charts.current.doughnut = new Chart(doughnutRef.current, {
                    type: 'doughnut',
                    data: {
                        labels: ['Cooked', 'Raw', 'Packaged'],
                        datasets: [{ data: [45, 30, 25], backgroundColor: ['#1D9E75', '#0F6E56', '#9FE1CB'], borderWidth: 0 }]
                    },
                    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
                });
            }
        } catch (e) { console.error('Chart Error:', e); }
    }, [stats]);

    if (loading && !stats) {
        return (
            <div style={styles.loadingContainer}>
                <div style={styles.spinner}></div>
                <p>Initializing your impact data...</p>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.sidebar}>
                <div style={styles.logo} onClick={() => navigate('/')}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#1D9E75"><path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z"/></svg>
                    <span style={styles.logoText}>CareConnect</span>
                </div>
                <div style={styles.nav}>
                    <div style={{ ...styles.navItem, ...styles.navActive }}>📊 Dashboard</div>
                    <div style={styles.navItem} onClick={() => navigate('/request')}>🍱 Food Donations</div>
                    <div style={styles.navItem} onClick={() => navigate('/orphanage')}>🏢 NGO Portal</div>
                    <div style={styles.navItem} onClick={() => navigate('/events')}>📅 Events</div>
                    <div style={styles.navItem} onClick={() => navigate('/orphanage')}>👶 Sponsorships</div>
                </div>
            </div>

            <div style={styles.main}>
                <header style={styles.header}>
                    <div>
                        <h1 style={styles.title}>Impact Dashboard</h1>
                        <p style={styles.subtitle}>Live Tracking Active 📡</p>
                    </div>
                    <div style={styles.date}>{new Date().toDateString()}</div>
                </header>

                <div style={styles.statsRow}>
                    {[
                        { label: 'Total Meals Donated', count: counts.meals, icon: '🍱', color: '#f0fdf4' },
                        { label: 'People Helped', count: counts.people, icon: '👥', color: '#eff6ff' },
                        { label: 'Active NGOs', count: counts.ngos, icon: '🏢', color: '#f5f3ff' },
                        { label: 'Active Events', count: counts.events, icon: '📅', color: '#fff7ed' },
                        { label: 'Total Volunteers', count: counts.volunteers, icon: '🙋', color: '#fdf2f8' }
                    ].map((stat, i) => (
                        <div key={i} style={styles.statCard}>
                            <div style={styles.statTop}>
                                <span style={styles.statLabel}>{stat.label}</span>
                                <div style={{ ...styles.statIconCircle, background: stat.color }}>{stat.icon}</div>
                            </div>
                            <div style={styles.statNum}>{stat.count?.toLocaleString() || 0}</div>
                        </div>
                    ))}
                </div>

                <div style={styles.chartsRow}>
                    <div style={{ ...styles.chartCard, flex: 1.5 }}>
                        <h3 style={styles.chartTitle}>Monthly Food Donations</h3>
                        <div style={styles.canvasContainer}><canvas ref={barRef}></canvas></div>
                    </div>
                    <div style={{ ...styles.chartCard, flex: 1 }}>
                        <h3 style={styles.chartTitle}>Donation Types</h3>
                        <div style={styles.canvasContainer}><canvas ref={doughnutRef}></canvas></div>
                    </div>
                </div>

                <div style={styles.bottomRow}>
                    <div style={styles.feedCard}>
                        <div style={styles.feedHeader}><h3 style={styles.chartTitle}>Live Activity</h3><div style={styles.pulseDot}></div></div>
                        <div style={styles.feedList}>
                            {donations && donations.length > 0 ? donations.slice(0, 5).map(d => (
                                <div key={d._id} style={styles.feedItem}>
                                    <div style={styles.feedDot}></div>
                                    <div>
                                        <p style={styles.feedText}><strong>{d.donor?.name || 'User'}</strong> donated {d.foodName}</p>
                                        <p style={styles.feedTime}>{new Date(d.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                                    </div>
                                </div>
                            )) : <p style={styles.smallText}>Waiting for live activity...</p>}
                        </div>
                    </div>
                    <div style={styles.mapCard}>
                        <h3 style={styles.chartTitle}>📍 Live Donation & Delivery Map</h3>
                        <div style={styles.mapContainer}>
                            <MapContainer center={[12.9716, 77.5946]} zoom={12} scrollWheelZoom={false}>
                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                {donations && donations.map(d => (
                                    <Marker key={d._id} position={[d.pickupLocation?.coordinates[1] || 12.9716, d.pickupLocation?.coordinates[0] || 77.5946]}>
                                        <Popup><strong>{d.foodName}</strong><br/>{d.quantity?.amount} {d.quantity?.unit} available</Popup>
                                    </Marker>
                                ))}
                                <MovingVehicle />
                            </MapContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: { display: 'flex', minHeight: '100vh', background: '#f8fafc', fontFamily: 'DM Sans, sans-serif' },
    loadingContainer: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: '20px', color: '#1D9E75' },
    spinner: { width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #1D9E75', borderRadius: '50%', animation: 'spin 1s linear infinite' },
    sidebar: { width: '220px', background: '#0a1f14', height: '100vh', position: 'sticky', top: 0, padding: '24px 0', color: '#fff' },
    logo: { display: 'flex', alignItems: 'center', gap: '8px', padding: '0 20px 24px', borderBottom: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' },
    logoText: { fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '16px' },
    nav: { marginTop: '16px' },
    navItem: { padding: '12px 20px', cursor: 'pointer', color: 'rgba(255,255,255,0.6)', fontSize: '14px', transition: '0.2s' },
    navActive: { background: 'rgba(29,158,117,0.2)', color: '#1D9E75', borderRight: '3px solid #1D9E75' },
    main: { flex: 1, padding: '32px 36px' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' },
    title: { fontFamily: 'Syne, sans-serif', fontSize: '26px', fontWeight: 800, color: '#0a1f14', margin: 0 },
    subtitle: { fontSize: '12px', color: '#1D9E75', fontWeight: 600, margin: '4px 0 0' },
    date: { fontSize: '13px', color: '#6b7280' },
    statsRow: { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', marginBottom: '28px' },
    statCard: { background: '#fff', borderRadius: '14px', border: '1.5px solid #e5e7eb', padding: '18px', boxShadow: '0 1px 6px rgba(0,0,0,0.06)' },
    statTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    statLabel: { fontSize: '11px', color: '#6b7280', fontWeight: 600 },
    statIconCircle: { width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' },
    statNum: { fontFamily: 'Syne, sans-serif', fontSize: '26px', fontWeight: 800, color: '#0a1f14', marginTop: '8px' },
    chartsRow: { display: 'flex', gap: '20px', marginBottom: '28px' },
    chartCard: { background: '#fff', borderRadius: '14px', border: '1.5px solid #e5e7eb', padding: '22px', minWidth: 0 },
    chartTitle: { fontFamily: 'Syne, sans-serif', fontSize: '16px', fontWeight: 700, marginBottom: '16px' },
    canvasContainer: { height: '220px', position: 'relative' },
    bottomRow: { display: 'flex', gap: '20px', marginBottom: '28px' },
    feedCard: { width: '320px', background: '#fff', borderRadius: '14px', border: '1.5px solid #e5e7eb', padding: '22px' },
    feedHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    pulseDot: { width: '8px', height: '8px', background: '#1D9E75', borderRadius: '50%', animation: 'pulse 1.5s infinite' },
    feedList: { marginTop: '16px' },
    feedItem: { display: 'flex', gap: '10px', padding: '10px 0', borderBottom: '1px solid #f3f4f6' },
    feedDot: { width: '8px', height: '8px', background: '#1D9E75', borderRadius: '50%', marginTop: '4px' },
    feedText: { fontSize: '12px', color: '#374151', margin: 0, lineHeight: 1.5 },
    feedTime: { fontSize: '10px', color: '#9ca3af', marginTop: '2px' },
    smallText: { fontSize: '12px', color: '#9ca3af', textAlign: 'center', marginTop: '20px' },
    mapCard: { flex: 1, background: '#fff', borderRadius: '14px', border: '1.5px solid #e5e7eb', padding: '22px' },
    mapContainer: { height: '300px', width: '100%', borderRadius: '12px', overflow: 'hidden' }
};

export default ImpactDashboard;
