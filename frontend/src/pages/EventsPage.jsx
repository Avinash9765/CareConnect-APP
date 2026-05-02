import { useState, useEffect } from 'react';
import * as eventService from '../services/eventService';
import { useAuth } from '../hooks/useAuth';

const typeColors = {
    food_drive: { bg: '#f0fdf4', border: '#1D9E75', badge: '#dcfce7', badgeText: '#065f46', strip: '#1D9E75', label: 'Food Drive' },
    orphanage: { bg: '#fffbeb', border: '#d97706', badge: '#fef3c7', badgeText: '#92400e', strip: '#d97706', label: 'Orphanage' },
    fundraiser: { bg: '#eff6ff', border: '#2563eb', badge: '#dbeafe', badgeText: '#1e40af', strip: '#2563eb', label: 'Fundraiser' },
    workshop: { bg: '#f5f3ff', border: '#7c3aed', badge: '#ede9fe', badgeText: '#5b21b6', strip: '#7c3aed', label: 'Workshop' }
};

const EventsPage = () => {
    const { user } = useAuth();
    const [events, setEvents] = useState([]);
    const [activeFilter, setActiveFilter] = useState('all');
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    
    // Form State
    const [form, setForm] = useState({ 
        title: '', 
        type: 'food_drive', 
        description: '', 
        date: '', 
        location: '', 
        maxVolunteers: 10 
    });

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const res = await eventService.getEvents(activeFilter !== 'all' ? { type: activeFilter } : {});
            if (res.success) setEvents(res.events);
        } catch (err) { console.error('Fetch Events Error:', err); }
        finally { setLoading(false); }
    };

    useEffect(() => {
        fetchEvents();
    }, [activeFilter]);

    const handleRegister = async (eventId) => {
        try {
            const res = await eventService.registerForEvent(eventId);
            if (res.success) {
                alert('Successfully registered!');
                fetchEvents();
            }
        } catch (err) { 
            alert(err.response?.data?.message || err.message || 'Error registering'); 
        }
    };

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        setSubmitLoading(true);
        try {
            const payload = { 
                ...form, 
                maxVolunteers: parseInt(form.maxVolunteers),
                location: { 
                    address: form.location,
                    lat: 12.9716, // Default for demo
                    lng: 77.5946
                } 
            };
            
            const res = await eventService.createEvent(payload);
            if (res.success) {
                setFormSubmitted(true);
                fetchEvents();
                setTimeout(() => {
                    setDrawerOpen(false);
                    setFormSubmitted(false);
                    setForm({ title: '', type: 'food_drive', description: '', date: '', location: '', maxVolunteers: 10 });
                }, 2000);
            } else {
                alert(res.message || 'Error creating event');
            }
        } catch (err) { 
            console.error('Create Event Error:', err);
            alert(err.response?.data?.message || err.message || 'Error creating event. Please check all fields.'); 
        } finally {
            setSubmitLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div>
                    <p style={styles.breadcrumb}>Home → Events</p>
                    <h1 style={styles.title}>Events & Volunteering 📅</h1>
                    <p style={styles.subtitle}>Join local events, food drives, and orphanage programs</p>
                </div>
                <button onClick={() => setDrawerOpen(true)} style={styles.postBtn}>+ Post an Event</button>
            </div>

            <div style={styles.filterPills}>
                {['all', 'food_drive', 'orphanage', 'fundraiser', 'workshop'].map(f => (
                    <button key={f} onClick={() => setActiveFilter(f)} style={{ ...styles.pill, ...(activeFilter === f ? styles.activePill : {}) }}>
                        {f === 'all' ? 'All' : f.replace('_', ' ').charAt(0).toUpperCase() + f.replace('_', ' ').slice(1)}
                    </button>
                ))}
            </div>

            {loading ? <p style={styles.resultsCount}>Syncing live events...</p> : <p style={styles.resultsCount}>{events.length} events found</p>}

            <div style={styles.grid}>
                {events.map(event => {
                    const colors = typeColors[event.type] || typeColors.food_drive;
                    const isRegistered = event.registeredVolunteers?.includes(user?._id);
                    const joinedCount = event.registeredVolunteers?.length || 0;
                    
                    return (
                        <div key={event._id} style={styles.card}>
                            <div style={{ ...styles.strip, background: colors.strip }}></div>
                            <div style={styles.cardBody}>
                                <span style={{ ...styles.badge, background: colors.badge, color: colors.badgeText }}>{colors.label}</span>
                                <h3 style={styles.eventTitle}>{event.title}</h3>
                                <p style={styles.row}>📅 {new Date(event.date).toLocaleDateString()} • {new Date(event.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                                <p style={styles.row}>📍 {event.location?.address}</p>
                                
                                <div style={styles.ngoRow}>
                                    <div style={{ ...styles.ngoAvatar, background: colors.strip + '22', color: colors.strip }}>
                                        {event.organizer?.organization?.charAt(0) || 'NGO'}
                                    </div>
                                    <span style={styles.ngoName}>{event.organizer?.organization || event.organizer?.name}</span>
                                </div>

                                <div style={styles.progressLabel}>
                                    <span>{joinedCount}/{event.maxVolunteers} Volunteers</span>
                                    <span>{Math.round(joinedCount / (event.maxVolunteers || 1) * 100)}%</span>
                                </div>
                                <div style={styles.progressBar}>
                                    <div style={{ ...styles.progressFill, background: colors.strip, width: `${(joinedCount / (event.maxVolunteers || 1) * 100)}%` }}></div>
                                </div>

                                <button 
                                    onClick={() => !isRegistered && handleRegister(event._id)} 
                                    disabled={isRegistered || joinedCount >= event.maxVolunteers}
                                    style={{ ...styles.registerBtn, ...(isRegistered ? styles.registeredBtn : {}) }}>
                                    {isRegistered ? '✅ Registered' : joinedCount >= event.maxVolunteers ? 'Event Full' : 'Register to Volunteer →'}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Side Drawer */}
            {drawerOpen && <div style={styles.overlay} onClick={() => setDrawerOpen(false)}></div>}
            <div style={{ ...styles.drawer, transform: drawerOpen ? 'translateX(0)' : 'translateX(100%)' }}>
                <div style={styles.drawerHeader}>
                    <h2 style={styles.drawerTitle}>Create New Event</h2>
                    <button style={styles.closeBtn} onClick={() => setDrawerOpen(false)}>×</button>
                </div>
                {!formSubmitted ? (
                    <form style={styles.drawerForm} onSubmit={handleCreateEvent}>
                        <div style={styles.field}>
                            <label style={styles.label}>Event Title *</label>
                            <input style={styles.input} required value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g. Weekend Kitchen" />
                        </div>
                        <div style={styles.field}>
                            <label style={styles.label}>Event Type *</label>
                            <select style={styles.input} value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                                <option value="food_drive">Food Drive</option>
                                <option value="orphanage">Orphanage Program</option>
                                <option value="fundraiser">Fundraiser</option>
                                <option value="workshop">Workshop</option>
                            </select>
                        </div>
                        <div style={styles.field}>
                            <label style={styles.label}>Date & Time *</label>
                            <input type="datetime-local" style={styles.input} required value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
                        </div>
                        <div style={styles.field}>
                            <label style={styles.label}>Location Address *</label>
                            <input style={styles.input} required value={form.location} onChange={e => setForm({...form, location: e.target.value})} placeholder="Full address" />
                        </div>
                        <div style={styles.field}>
                            <label style={styles.label}>Max Volunteers *</label>
                            <input type="number" min="1" style={styles.input} required value={form.maxVolunteers} onChange={e => setForm({...form, maxVolunteers: e.target.value})} />
                        </div>
                        <div style={styles.field}>
                            <label style={styles.label}>Description *</label>
                            <textarea style={{ ...styles.input, height: '80px', paddingTop: '10px' }} required value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Describe the event..."></textarea>
                        </div>
                        <button type="submit" disabled={submitLoading} style={styles.postBtnFull}>
                            {submitLoading ? 'Publishing...' : 'Publish Event 🚀'}
                        </button>
                    </form>
                ) : (
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                        <div style={{ fontSize: '48px' }}>✅</div>
                        <p style={{ marginTop: '16px', fontWeight: 500 }}>Event published successfully!</p>
                        <p style={{ fontSize: '13px', color: '#6b7280' }}>Dashboard status will update in seconds.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: { maxWidth: '1100px', margin: '0 auto', padding: '32px 40px', fontFamily: 'DM Sans, sans-serif' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
    breadcrumb: { fontSize: '13px', color: '#6b7280', marginBottom: '8px' },
    title: { fontFamily: 'Syne, sans-serif', fontSize: '30px', fontWeight: 800 },
    subtitle: { fontSize: '15px', color: '#6b7280' },
    postBtn: { background: '#1D9E75', color: '#fff', border: 'none', padding: '12px 22px', borderRadius: '10px', fontWeight: 500, cursor: 'pointer' },
    filterPills: { display: 'flex', gap: '10px', margin: '24px 0', flexWrap: 'wrap' },
    pill: { padding: '8px 18px', borderRadius: '20px', border: '1.5px solid #e5e7eb', background: '#fff', cursor: 'pointer', fontSize: '14px', transition: '0.2s' },
    activePill: { background: '#1D9E75', color: '#fff', borderColor: '#1D9E75' },
    resultsCount: { fontSize: '13px', color: '#6b7280', marginBottom: '20px' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '22px' },
    card: { background: '#fff', borderRadius: '16px', overflow: 'hidden', border: '1.5px solid #e5e7eb', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', transition: '0.25s' },
    strip: { height: '6px' },
    cardBody: { padding: '20px' },
    badge: { fontSize: '11px', fontWeight: 'bold', padding: '4px 12px', borderRadius: '20px', marginBottom: '12px', display: 'inline-block' },
    eventTitle: { fontFamily: 'Syne, sans-serif', fontSize: '17px', fontWeight: 700, marginBottom: '10px', lineHeight: 1.4 },
    row: { fontSize: '13px', color: '#6b7280', marginBottom: '6px' },
    ngoRow: { display: 'flex', alignItems: 'center', gap: '8px', margin: '12px 0' },
    ngoAvatar: { width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700 },
    ngoName: { fontSize: '13px', color: '#374151' },
    progressLabel: { display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#6b7280', marginBottom: '6px' },
    progressBar: { height: '6px', background: '#f3f4f6', borderRadius: '3px', marginBottom: '14px' },
    progressFill: { height: '100%', borderRadius: '3px' },
    registerBtn: { width: '100%', height: '42px', borderRadius: '10px', background: '#1D9E75', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 500 },
    registeredBtn: { background: '#f0fdf4', color: '#065f46', border: '1px solid #bbf7d0', cursor: 'default' },
    overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 2000 },
    drawer: { position: 'fixed', right: 0, top: 0, height: '100vh', width: '400px', background: '#fff', zIndex: 2001, transition: '0.35s ease', boxShadow: '-5px 0 15px rgba(0,0,0,0.1)', overflowY: 'auto' },
    drawerHeader: { padding: '20px 24px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    drawerTitle: { fontFamily: 'Syne, sans-serif', fontSize: '20px', fontWeight: 700 },
    closeBtn: { background: '#f3f4f6', border: 'none', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', fontSize: '20px' },
    drawerForm: { padding: '24px' },
    field: { marginBottom: '15px' },
    label: { display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px' },
    input: { width: '100%', height: '42px', padding: '0 14px', border: '1.5px solid #e5e7eb', borderRadius: '10px', outline: 'none', fontSize: '14px' },
    postBtnFull: { width: '100%', height: '50px', background: '#1D9E75', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', marginTop: '15px', transition: '0.2s' }
};

export default EventsPage;
