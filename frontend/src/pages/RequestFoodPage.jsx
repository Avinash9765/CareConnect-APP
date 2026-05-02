import { useState, useEffect, useMemo } from 'react';
import './RequestFoodPage.css';

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

    const typeColors = { cooked_meal: '#1D9E75', packaged_food: '#2563eb', raw_ingredients: '#d97706', beverages: '#7c3aed', bakery: '#db2777' };

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
        <div className="request-container">
            <div className="request-header">
                <p className="request-breadcrumb">Home → Find Food</p>
                <h1 className="request-title">Find Available Food 🔍</h1>
                <p style={{ fontSize: '15px', color: '#6b7280', marginTop: '4px' }}>Browse real-time food donations near you</p>
            </div>

            <div className="request-tabs">
                <button onClick={() => setActiveTab('browse')} className={`request-tab ${activeTab === 'browse' ? 'active' : ''}`}>🔍 Donations Near Me</button>
                <button onClick={() => setActiveTab('request')} className={`request-tab ${activeTab === 'request' ? 'active' : ''}`}>📋 Submit a Request</button>
            </div>

            {activeTab === 'browse' ? (
                <div className="browse-section">
                    <div className="filter-bar">
                        <div className="filter-group">
                            <label style={{ fontSize: '13px', color: '#6b7280' }}>Type:</label>
                            <select value={filters.foodType} onChange={e => setFilters({ ...filters, foodType: e.target.value })} style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #e5e7eb', fontSize: '13px' }}>
                                <option value="all">All Types</option>
                                <option value="cooked_meal">Cooked Meal</option>
                                <option value="packaged_food">Packaged</option>
                                <option value="raw_ingredients">Raw Ingredients</option>
                            </select>
                        </div>
                        <div className="filter-group">
                            <label style={{ fontSize: '13px', color: '#6b7280' }}>Within {filters.distance}km:</label>
                            <input type="range" min="1" max="50" value={filters.distance} onChange={e => setFilters({ ...filters, distance: e.target.value })} style={{ accentColor: '#1D9E75' }} />
                        </div>
                        <div style={{ marginLeft: 'auto', fontSize: '13px', color: '#6b7280' }}>
                            {filteredDonations.length} donations found
                        </div>
                    </div>

                    <div className="donations-grid">
                        {filteredDonations.map(d => {
                            const countdown = getCountdown(d.safeUntil);
                            const isClaimed = claimedIds.includes(d.id);
                            return (
                                <div key={d.id} className="donation-card">
                                    <div style={{ height: '8px', background: typeColors[d.type] }}></div>
                                    <div style={{ padding: '18px' }}>
                                        <span style={{ fontSize: '11px', fontWeight: 'bold', padding: '3px 10px', borderRadius: '20px', display: 'inline-block', marginBottom: '10px', background: typeColors[d.type] + '22', color: typeColors[d.type] }}>
                                            {d.type.replace('_', ' ').toUpperCase()}
                                        </span>
                                        <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '17px', fontWeight: 700, color: '#0a1f14', marginBottom: '6px' }}>{d.name}</h3>
                                        <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>👤 {d.postedBy} • 📍 {d.distance}km away</p>
                                        <p style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '8px' }}>📍 {d.location}</p>
                                        <p style={{ fontSize: '13px', color: '#374151', marginBottom: '12px' }}>🍽️ {d.quantity} available</p>
                                        
                                        <div style={{ padding: '8px 12px', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', marginBottom: '16px', background: countdown.bg, color: countdown.color }}>
                                            {countdown.text}
                                        </div>

                                        <button 
                                            onClick={() => !isClaimed && handleClaim(d.id)} 
                                            style={{ 
                                                width: '100%', height: '44px', background: isClaimed ? '#f0fdf4' : '#1D9E75', 
                                                color: isClaimed ? '#065f46' : '#fff', border: isClaimed ? '1px solid #bbf7d0' : 'none', 
                                                borderRadius: '10px', fontSize: '14px', fontWeight: 500, cursor: isClaimed ? 'default' : 'pointer', transition: '0.2s' 
                                            }}
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
                <div className="request-section">
                    {!requestSubmitted ? (
                        <div className="request-form-card">
                            <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '22px', fontWeight: 700, marginBottom: '8px' }}>📋 Submit a Food Request</h2>
                            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px' }}>NGOs and individuals can request specific food needs</p>
                            
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '8px' }}>Urgency Level *</label>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    {['Low', 'Medium', 'Critical'].map(u => (
                                        <button key={u} onClick={() => setRequestForm({ ...requestForm, urgency: u.toLowerCase() })} 
                                            style={{ 
                                                flex: 1, padding: '10px', borderRadius: '50px', border: '1.5px solid #e5e7eb', 
                                                background: requestForm.urgency === u.toLowerCase() ? '#f0fdf4' : '#fff', 
                                                color: requestForm.urgency === u.toLowerCase() ? '#1D9E75' : 'inherit',
                                                borderColor: requestForm.urgency === u.toLowerCase() ? '#1D9E75' : '#e5e7eb',
                                                cursor: 'pointer', fontSize: '13px' 
                                            }}>
                                            {u === 'Low' ? '🟢' : u === 'Medium' ? '🟡' : '🔴'} {u}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '8px' }}>What do you need? *</label>
                                <textarea style={{ width: '100%', padding: '12px', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', minHeight: '100px', outline: 'none' }} placeholder="Describe items, for how many people..." value={requestForm.what} onChange={e => setRequestForm({ ...requestForm, what: e.target.value })} />
                            </div>

                            <button onClick={() => setRequestSubmitted(true)} style={{ width: '100%', height: '50px', background: '#1D9E75', color: '#fff', borderRadius: '10px', border: 'none', fontSize: '16px', fontWeight: 500, cursor: 'pointer' }}>📨 Submit Food Request</button>
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '40px' }}>
                            <div style={{ fontSize: '48px' }}>✅</div>
                            <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '24px', fontWeight: 700, marginTop: '16px' }}>Request Submitted!</h2>
                            <p style={{ color: '#6b7280', margin: '16px 0 32px' }}>We'll notify nearby donors and NGOs. You'll be contacted within the hour.</p>
                            <button onClick={() => setRequestSubmitted(false)} style={{ width: '100%', height: '50px', background: '#1D9E75', color: '#fff', borderRadius: '10px', border: 'none', fontSize: '16px', fontWeight: 500, cursor: 'pointer' }}>Submit Another Request</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default RequestFoodPage;
