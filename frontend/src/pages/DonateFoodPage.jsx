import { useState, useEffect } from 'react';
import { createDonation, getMyDonations, deleteDonation } from '../services/donationService';
import './DonateFoodPage.css';

const DonateFoodPage = () => {
    const [form, setForm] = useState({
        foodName: '', foodType: '', quantity: '', unit: 'kg',
        cookedAt: '', safeUntil: '', pickupAddress: '', notes: ''
    });
    const [coords, setCoords] = useState([77.5946, 12.9716]); // Default: Bangalore
    const [photos, setPhotos] = useState([]);
    const [locationLoading, setLocationLoading] = useState(false);
    const [safeUntilAuto, setSafeUntilAuto] = useState(null);
    const [countdown, setCountdown] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [myHistory, setMyHistory] = useState([]);

    const fetchHistory = async () => {
        try {
            const res = await getMyDonations();
            if (res.success) setMyHistory(res.donations.slice(0, 5));
        } catch (err) { console.error('Error fetching history:', err); }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    useEffect(() => {
        if (form.cookedAt && form.foodType === 'cooked_meal') {
            const date = new Date(form.cookedAt);
            const safe = new Date(date.getTime() + 4 * 60 * 60 * 1000);
            setSafeUntilAuto(safe.toISOString());
        } else {
            setSafeUntilAuto(null);
        }
    }, [form.cookedAt, form.foodType]);

    useEffect(() => {
        if (safeUntilAuto) {
            const timer = setInterval(() => {
                const diff = new Date(safeUntilAuto) - new Date();
                if (diff <= 0) {
                    setCountdown('Expired');
                    clearInterval(timer);
                } else {
                    const h = Math.floor(diff / 3600000);
                    const m = Math.floor((diff % 3600000) / 60000);
                    const s = Math.floor((diff % 60000) / 1000);
                    setCountdown(`${h}h ${m}m ${s}s remaining`);
                }
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [safeUntilAuto]);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleLocation = () => {
        setLocationLoading(true);
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                try {
                    const { latitude, longitude } = pos.coords;
                    setCoords([longitude, latitude]);
                    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
                    const data = await res.json();
                    setForm({ ...form, pickupAddress: data.display_name });
                } catch (err) { alert('Could not fetch address'); }
                finally { setLocationLoading(false); }
            },
            () => { alert('Location permission denied'); setLocationLoading(false); }
        );
    };

    const handlePhotoUpload = (e) => {
        const files = Array.from(e.target.files).slice(0, 3);
        const newPhotos = files.map(file => ({ file, preview: URL.createObjectURL(file) }));
        setPhotos([...photos, ...newPhotos]);
    };

    const removePhoto = (idx) => setPhotos(photos.filter((_, i) => i !== idx));

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { 
                ...form, 
                quantity: { amount: parseFloat(form.quantity), unit: form.unit },
                pickupLocation: { type: 'Point', coordinates: coords },
                safeUntil: safeUntilAuto ? new Date(safeUntilAuto) : form.safeUntil 
            };
            await createDonation(payload);
            setSubmitted(true);
            fetchHistory();
        } catch (err) { alert(err.response?.data?.message || err.message); }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this donation?')) {
            try {
                await deleteDonation(id);
                fetchHistory();
            } catch (err) { alert('Error deleting donation'); }
        }
    };

    if (submitted) {
        return (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
                <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '24px', fontWeight: 700 }}>Your donation is live!</h1>
                <p style={{ color: '#6b7280', margin: '16px 0 32px' }}>We've notified nearby NGOs. You'll receive a confirmation when someone claims it.</p>
                <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button onClick={() => setSubmitted(false)} style={{ padding: '16px 32px', background: '#1D9E75', color: '#fff', borderRadius: '12px', border: 'none', fontSize: '16px', fontWeight: 700, cursor: 'pointer' }}>Post Another</button>
                    <button onClick={() => window.location.href='/dashboard'} style={{ padding: '16px 32px', background: '#0a1f14', color: '#fff', borderRadius: '12px', border: 'none', fontSize: '16px', fontWeight: 700, cursor: 'pointer' }}>Go to Dashboard</button>
                </div>
            </div>
        );
    }

    return (
        <div className="donate-container">
            <div className="donate-header">
                <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '8px' }}>Home → Donate Food</p>
                <h1 className="donate-title">Share Your Extra Food 🍱</h1>
                <p style={{ fontSize: '15px', color: '#6b7280', marginTop: '4px' }}>Your surplus can be someone's lifeline today</p>
                <div style={{ width: '60px', height: '3px', background: '#1D9E75', marginTop: '8px' }}></div>
            </div>

            <div className="donate-content">
                <div className="donate-form-card">
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Food Name *</label>
                            <input type="text" name="foodName" value={form.foodName} onChange={handleChange} placeholder="e.g. Chicken Biryani, Bread Loaves..." style={{ width: '100%', height: '48px', padding: '0 14px', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', outline: 'none' }} required />
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Food Type *</label>
                            <select name="foodType" value={form.foodType} onChange={handleChange} style={{ width: '100%', height: '48px', padding: '0 14px', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', outline: 'none' }} required>
                                <option value="">Select type</option>
                                <option value="cooked_meal">Cooked Meal</option>
                                <option value="raw_ingredients">Raw Ingredients</option>
                                <option value="packaged_food">Packaged Food</option>
                                <option value="beverages">Beverages</option>
                                <option value="bakery">Bakery Items</option>
                            </select>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Quantity *</label>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <input type="number" name="quantity" value={form.quantity} onChange={handleChange} placeholder="Amount" style={{ flex: 1, height: '48px', padding: '0 14px', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', outline: 'none' }} required />
                                <select name="unit" value={form.unit} onChange={handleChange} style={{ width: '100px', height: '48px', padding: '0 14px', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', outline: 'none' }}>
                                    <option value="kg">kg</option>
                                    <option value="portions">portions</option>
                                    <option value="boxes">boxes</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>When was this prepared? *</label>
                            <input type="datetime-local" name="cookedAt" value={form.cookedAt} onChange={handleChange} style={{ width: '100%', height: '48px', padding: '0 14px', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', outline: 'none' }} required />
                            <p style={{ fontSize: '11px', color: '#6b7280', fontStyle: 'italic', marginTop: '4px' }}>We calculate safe-to-eat time automatically for cooked meals</p>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Safe To Eat Until</label>
                            {safeUntilAuto ? (
                                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '12px' }}>
                                    <p>✅ Auto-calculated: Safe until {new Date(safeUntilAuto).toLocaleString()}</p>
                                    <p style={{ fontSize: '13px', fontWeight: 'bold', marginTop: '4px', color: countdown.includes('Expired') ? 'red' : '#1D9E75' }}>{countdown}</p>
                                </div>
                            ) : (
                                <input type="datetime-local" name="safeUntil" value={form.safeUntil} onChange={handleChange} style={{ width: '100%', height: '48px', padding: '0 14px', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', outline: 'none' }} />
                            )}
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Pickup Address *</label>
                            <textarea name="pickupAddress" value={form.pickupAddress} onChange={handleChange} style={{ width: '100%', padding: '12px 14px', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', minHeight: '80px', outline: 'none' }} placeholder="Full address..." required />
                            <button type="button" onClick={handleLocation} style={{ background: 'none', border: 'none', color: '#1D9E75', fontSize: '13px', cursor: 'pointer', padding: '4px 0' }}>
                                {locationLoading ? '📍 Fetching...' : '📍 Use My Current Location'}
                            </button>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Add Photos (optional)</label>
                            <div style={{ border: '2px dashed #d1d5db', borderRadius: '12px', padding: '28px', textAlign: 'center', background: '#fafafa', cursor: 'pointer' }} onClick={() => document.getElementById('photoInput').click()}>
                                📷 <span>Click to upload photos (Max 3)</span>
                                <input id="photoInput" type="file" multiple accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
                            </div>
                            <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                                {photos.map((p, i) => (
                                    <div key={i} style={{ position: 'relative', width: '80px', height: '80px' }}>
                                        <img src={p.preview} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} alt="preview" />
                                        <button type="button" onClick={() => removePhoto(i)} style={{ position: 'absolute', top: '-5px', right: '-5px', width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(0,0,0,0.5)', color: '#fff', border: 'none', cursor: 'pointer' }}>×</button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button type="submit" style={{ width: '100%', height: '54px', background: '#1D9E75', color: '#fff', borderRadius: '12px', border: 'none', fontSize: '17px', fontWeight: 700, cursor: 'pointer' }}>🚀 Post My Donation</button>
                    </form>
                </div>

                <div className="donate-sidebar">
                    <div className="side-card">
                        <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '15px', fontWeight: 700, marginBottom: '14px' }}>📋 My Recent Donations</h3>
                        {myHistory.length > 0 ? myHistory.map(d => (
                            <div key={d._id} style={{ background: '#f9fafb', borderRadius: '10px', padding: '12px', marginBottom: '8px', borderLeft: '3px solid #1D9E75', position: 'relative' }}>
                                <p><strong>{d.foodName}</strong> <span style={{ fontSize: '10px', padding: '2px 6px', background: '#e5e7eb', borderRadius: '10px', marginLeft: '6px', textTransform: 'capitalize' }}>{d.status}</span></p>
                                <p style={{ fontSize: '12px', color: '#6b7280' }}>{d.quantity.amount} {d.quantity.unit} • {new Date(d.createdAt).toLocaleDateString()}</p>
                                <button onClick={() => handleDelete(d._id)} style={{ border: 'none', background: 'none', color: '#ef4444', fontSize: '11px', cursor: 'pointer', padding: 0, marginTop: '8px' }}>Delete</button>
                            </div>
                        )) : (
                            <p style={{ fontSize: '12px', color: '#6b7280' }}>No donations yet. Start by filling the form!</p>
                        )}
                    </div>
                    
                    <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '14px', padding: '20px' }}>
                        <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '15px', fontWeight: 700, marginBottom: '14px' }}>💡 Tips for Safe Donation</h3>
                        <ul style={{ listStyle: 'none', fontSize: '13px', padding: 0 }}>
                            <li>✓ Always mention exact cooking time</li>
                            <li>✓ Cooked food is safe for 4 hours</li>
                            <li>✓ Use sealed containers if possible</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DonateFoodPage;
