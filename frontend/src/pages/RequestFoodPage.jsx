import { useState, useEffect, useMemo } from 'react';

const donationsData = [
    { id: 1, name: 'Chicken Biryani', type: 'cooked_meal', quantity: '5 portions', distance: 1.4, location: 'Koramangala, Bangalore', postedBy: 'Rahul K.', safeUntil: Date.now() + 3 * 60 * 60 * 1000 + 22 * 60 * 1000 },
    { id: 2, name: 'Bread and Butter Packs', type: 'packaged_food', quantity: '3 packs', distance: 0.7, location: 'HSR Layout, Bangalore', postedBy: 'Meera S.', safeUntil: Date.now() + 8 * 60 * 60 * 1000 },
    { id: 3, name: 'Dal Rice (8 portions)', type: 'cooked_meal', quantity: '8 portions', distance: 2.1, location: 'Indiranagar, Bangalore', postedBy: 'Arun T.', safeUntil: Date.now() + 42 * 60 * 1000 },
    { id: 4, name: 'Mixed Fruit Basket', type: 'raw_ingredients', quantity: '2kg', distance: 3.4, location: 'Whitefield, Bangalore', postedBy: 'Divya R.', safeUntil: Date.now() + 26 * 60 * 60 * 1000 },
    { id: 5, name: 'Idli Sambar', type: 'cooked_meal', quantity: '10 portions', distance: 0.9, location: 'Jayanagar, Bangalore', postedBy: 'Priya M.', safeUntil: Date.now() + 1 * 60 * 60 * 1000 + 50 * 60 * 1000 },
    { id: 6, name: 'Biscuit Packets (10)', type: 'packaged_food', quantity: '10 packets', distance: 5.0, location: 'Electronic City', postedBy: 'Vijay P.', safeUntil: Date.now() + 48 * 60 * 60 * 1000 }
];

function getCountdown(safeUntil) {
    const diff = safeUntil - Date.now();
    if (diff <= 0) return { text: 'Expired', color: '#6b7280', bg: '#f3f4f6', urgent: true };
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    if (diff < 30 * 60 * 1000) return { text: `🚨 ${m}m left — Urgent!`, color: '#991b1b', bg: '#fef2f2', urgent: true };
    if (diff < 2 * 60 * 60 * 1000) return { text: `⚠️ ${h}h ${m}m left`, color: '#92400e', bg: '#fffbeb', urgent: false };
    return { text: `✅ ${h}h ${m}m left`, color: '#065f46', bg: '#f0fdf4', urgent: false };
}

const RequestFoodPage = () => {
    const [activeTab, setActiveTab] = useState('browse');
    const [filters, setFilters] = useState({ foodType: 'all', distance: 20, time: 'all' });
    const [claimedIds, setClaimedIds] = useState([]);
    const [requestForm, setRequestForm] = useState({ what: '', quantity: '', unit: 'kg', location: '', urgency: 'medium', contact: '', orgName: '' });
    const [requestSubmitted, setRequestSubmitted] = useState(false);
    const [, setTick] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => setTick(t => t + 1), 60000);
        return () => clearInterval(timer);
    }, []);

    const filteredDonations = useMemo(() => {
        return donationsData.filter(d => {
            if (filters.foodType !== 'all' && d.type !== filters.foodType) return false;
            if (d.distance > filters.distance) return false;
            return true;
        });
    }, [filters]);

    const handleClaim = (id) => setClaimedIds([...claimedIds, id]);

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <p style={styles.breadcrumb}>Home → Find Food</p>
                <h1 style={styles.title}>Find Available Food 🔍</h1>
                <p style={styles.subtitle}>Browse real-time food donations near you</p>
            </div>

            <div style={styles.tabs}>
                <button onClick={() => setActiveTab('browse')} style={{ ...styles.tab, ...(activeTab === 'browse' ? styles.activeTab : {}) }}>🔍 Donations Near Me</button>
                <button onClick={() => setActiveTab('request')} style={{ ...styles.tab, ...(activeTab === 'request' ? styles.activeTab : {}) }}>📋 Submit a Request</button>
            </div>

            {activeTab === 'browse' ? (
                <div style={styles.browseSection}>
                    <div style={styles.filterBar}>
                        <div style={styles.filterGroup}>
                            <label style={styles.filterLabel}>Type:</label>
                            <select value={filters.foodType} onChange={e => setFilters({ ...filters, foodType: e.target.value })} style={styles.select}>
                                <option value="all">All Types</option>
                                <option value="cooked_meal">Cooked Meal</option>
                                <option value="packaged_food">Packaged</option>
                                <option value="raw_ingredients">Raw Ingredients</option>
                            </select>
                        </div>
                        <div style={styles.filterGroup}>
                            <label style={styles.filterLabel}>Within {filters.distance}km:</label>
                            <input type="range" min="1" max="50" value={filters.distance} onChange={e => setFilters({ ...filters, distance: e.target.value })} style={styles.range} />
                        </div>
                        <div style={{ marginLeft: 'auto', fontSize: '13px', color: '#6b7280' }}>
                            {filteredDonations.length} donations found
                        </div>
                    </div>

                    <div style={styles.grid}>
                        {filteredDonations.map(d => {
                            const countdown = getCountdown(d.safeUntil);
                            const isClaimed = claimedIds.includes(d.id);
                            return (
                                <div key={d.id} style={styles.card}>
                                    <div style={{ ...styles.cardStrip, background: styles.typeColors[d.type] }}></div>
                                    <div style={styles.cardBody}>
                                        <span style={{ ...styles.badge, background: styles.typeColors[d.type] + '22', color: styles.typeColors[d.type] }}>
                                            {d.type.replace('_', ' ').toUpperCase()}
                                        </span>
                                        <h3 style={styles.foodName}>{d.name}</h3>
                                        <p style={styles.postedBy}>👤 {d.postedBy} • 📍 {d.distance}km away</p>
                                        <p style={styles.location}>📍 {d.location}</p>
                                        <p style={styles.quantity}>🍽️ {d.quantity} available</p>
                                        
                                        <div style={{ ...styles.countdownBadge, background: countdown.bg, color: countdown.color }}>
                                            {countdown.text}
                                        </div>

                                        <button 
                                            onClick={() => !isClaimed && handleClaim(d.id)} 
                                            style={{ ...styles.claimBtn, ...(isClaimed ? styles.claimedBtn : {}) }}
                                        >
                                            {isClaimed ? '✅ Claimed! NGO Notified' : 'Claim This Donation →'}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <div style={styles.requestSection}>
                    {!requestSubmitted ? (
                        <div style={styles.requestCard}>
                            <h2 style={styles.requestTitle}>📋 Submit a Food Request</h2>
                            <p style={styles.requestSubtitle}>NGOs and individuals can request specific food needs</p>
                            
                            <div style={styles.fieldGroup}>
                                <label style={styles.label}>Urgency Level *</label>
                                <div style={styles.pillGroup}>
                                    {['Low', 'Medium', 'Critical'].map(u => (
                                        <button key={u} onClick={() => setRequestForm({ ...requestForm, urgency: u.toLowerCase() })} 
                                            style={{ ...styles.pill, ...(requestForm.urgency === u.toLowerCase() ? styles.activePill : {}) }}>
                                            {u === 'Low' ? '🟢' : u === 'Medium' ? '🟡' : '🔴'} {u}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div style={styles.fieldGroup}>
                                <label style={styles.label}>What do you need? *</label>
                                <textarea style={styles.textarea} placeholder="Describe items, for how many people..." value={requestForm.what} onChange={e => setRequestForm({ ...requestForm, what: e.target.value })} />
                            </div>

                            <button onClick={() => setRequestSubmitted(true)} style={styles.submitBtn}>📨 Submit Food Request</button>
                        </div>
                    ) : (
                        <div style={styles.successCard}>
                            <div style={{ fontSize: '48px' }}>✅</div>
                            <h2 style={styles.successTitle}>Request Submitted!</h2>
                            <p style={styles.successText}>We'll notify nearby donors and NGOs. You'll be contacted within the hour.</p>
                            <button onClick={() => setRequestSubmitted(false)} style={styles.submitBtn}>Submit Another Request</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const styles = {
    container: { maxWidth: '1100px', margin: '0 auto', padding: '32px 40px' },
    header: { marginBottom: '24px' },
    breadcrumb: { fontSize: '13px', color: '#6b7280', marginBottom: '8px' },
    title: { fontFamily: 'Syne, sans-serif', fontSize: '30px', fontWeight: 800, color: '#0a1f14' },
    subtitle: { fontSize: '15px', color: '#6b7280', marginTop: '4px' },
    tabs: { display: 'flex', borderBottom: '2px solid #e5e7eb', marginBottom: '32px' },
    tab: { padding: '12px 24px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '15px', color: '#6b7280', transition: '0.2s' },
    activeTab: { color: '#1D9E75', borderBottom: '2px solid #1D9E75', fontWeight: 500 },
    filterBar: { background: '#f9fafb', borderRadius: '12px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px', flexWrap: 'wrap' },
    filterGroup: { display: 'flex', alignItems: 'center', gap: '8px' },
    filterLabel: { fontSize: '13px', color: '#6b7280' },
    select: { padding: '6px 10px', borderRadius: '6px', border: '1px solid #e5e7eb', fontSize: '13px' },
    range: { accentColor: '#1D9E75' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' },
    card: { background: '#fff', borderRadius: '14px', border: '1.5px solid #e5e7eb', overflow: 'hidden', transition: '0.25s' },
    cardStrip: { height: '8px' },
    cardBody: { padding: '18px' },
    typeColors: { cooked_meal: '#1D9E75', packaged_food: '#2563eb', raw_ingredients: '#d97706', beverages: '#7c3aed', bakery: '#db2777' },
    badge: { fontSize: '11px', fontWeight: 'bold', padding: '3px 10px', borderRadius: '20px', display: 'inline-block', marginBottom: '10px' },
    foodName: { fontFamily: 'Syne, sans-serif', fontSize: '17px', fontWeight: 700, color: '#0a1f14', marginBottom: '6px' },
    postedBy: { fontSize: '13px', color: '#6b7280', marginBottom: '4px' },
    location: { fontSize: '12px', color: '#9ca3af', marginBottom: '8px' },
    quantity: { fontSize: '13px', color: '#374151', marginBottom: '12px' },
    countdownBadge: { padding: '8px 12px', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', marginBottom: '16px' },
    claimBtn: { width: '100%', height: '44px', background: '#1D9E75', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 500, cursor: 'pointer', transition: '0.2s' },
    claimedBtn: { background: '#f0fdf4', color: '#065f46', border: '1px solid #bbf7d0', cursor: 'default' },
    requestCard: { background: '#fff', borderRadius: '16px', border: '1.5px solid #e5e7eb', padding: '32px', maxWidth: '600px', margin: '0 auto' },
    requestTitle: { fontFamily: 'Syne, sans-serif', fontSize: '22px', fontWeight: 700, marginBottom: '8px' },
    requestSubtitle: { fontSize: '14px', color: '#6b7280', marginBottom: '24px' },
    fieldGroup: { marginBottom: '20px' },
    label: { display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '8px' },
    pillGroup: { display: 'flex', gap: '10px' },
    pill: { flex: 1, padding: '10px', borderRadius: '50px', border: '1.5px solid #e5e7eb', background: '#fff', cursor: 'pointer', fontSize: '13px' },
    activePill: { borderColor: '#1D9E75', background: '#f0fdf4', color: '#1D9E75' },
    textarea: { width: '100%', padding: '12px', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', minHeight: '100px', outline: 'none' },
    submitBtn: { width: '100%', height: '50px', background: '#1D9E75', color: '#fff', borderRadius: '10px', border: 'none', fontSize: '16px', fontWeight: 500, cursor: 'pointer' },
    successCard: { textAlign: 'center', padding: '40px' },
    successTitle: { fontFamily: 'Syne, sans-serif', fontSize: '24px', fontWeight: 700, marginTop: '16px' },
    successText: { color: '#6b7280', margin: '16px 0 32px' }
};

export default RequestFoodPage;
