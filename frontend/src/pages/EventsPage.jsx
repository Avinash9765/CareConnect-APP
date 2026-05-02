import { useState, useEffect } from 'react';
import * as eventService from '../services/eventService';
import { useAuth } from '../hooks/useAuth';
import './EventsPage.css';

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
        <div className="events-container">
            <div className="events-header">
                <div>
                    <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '8px' }}>Home → Events</p>
                    <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '30px', fontWeight: 800 }}>Events & Volunteering 📅</h1>
                    <p style={{ fontSize: '15px', color: '#6b7280' }}>Join local events, food drives, and orphanage programs</p>
                </div>
                <button onClick={() => setDrawerOpen(true)} style={{ background: '#1D9E75', color: '#fff', border: 'none', padding: '12px 22px', borderRadius: '10px', fontWeight: 500, cursor: 'pointer' }}>+ Post an Event</button>
            </div>

            <div style={{ display: 'flex', gap: '10px', margin: '24px 0', flexWrap: 'wrap' }}>
                {['all', 'food_drive', 'orphanage', 'fundraiser', 'workshop'].map(f => (
                    <button key={f} onClick={() => setActiveFilter(f)} style={{ 
                        padding: '8px 18px', borderRadius: '20px', border: '1.5px solid #e5e7eb', 
                        background: activeFilter === f ? '#1D9E75' : '#fff', color: activeFilter === f ? '#fff' : 'inherit',
                        cursor: 'pointer', fontSize: '14px', transition: '0.2s', borderColor: activeFilter === f ? '#1D9E75' : '#e5e7eb'
                    }}>
                        {f === 'all' ? 'All' : f.replace('_', ' ').charAt(0).toUpperCase() + f.replace('_', ' ').slice(1)}
                    </button>
                ))}
            </div>

            {loading ? <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '20px' }}>Syncing live events...</p> : <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '20px' }}>{events.length} events found</p>}

            <div className="events-grid">
                {events.map(event => {
                    const colors = typeColors[event.type] || typeColors.food_drive;
                    const isRegistered = event.registeredVolunteers?.includes(user?._id);
                    const joinedCount = event.registeredVolunteers?.length || 0;
                    
                    return (
                        <div key={event._id} style={{ background: '#fff', borderRadius: '16px', overflow: 'hidden', border: '1.5px solid #e5e7eb', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', transition: '0.25s' }}>
                            <div style={{ height: '6px', background: colors.strip }}></div>
                            <div style={{ padding: '20px' }}>
                                <span style={{ fontSize: '11px', fontWeight: 'bold', padding: '4px 12px', borderRadius: '20px', marginBottom: '12px', display: 'inline-block', background: colors.badge, color: colors.badgeText }}>{colors.label}</span>
                                <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '17px', fontWeight: 700, marginBottom: '10px', lineHeight: 1.4 }}>{event.title}</h3>
                                <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '6px' }}>📅 {new Date(event.date).toLocaleDateString()} • {new Date(event.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                                <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '6px' }}>📍 {event.location?.address}</p>
                                
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '12px 0' }}>
                                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, background: colors.strip + '22', color: colors.strip }}>
                                        {event.organizer?.organization?.charAt(0) || 'NGO'}
                                    </div>
                                    <span style={{ fontSize: '13px', color: '#374151' }}>{event.organizer?.organization || event.organizer?.name}</span>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#6b7280', marginBottom: '6px' }}>
                                    <span>{joinedCount}/{event.maxVolunteers} Volunteers</span>
                                    <span>{Math.round(joinedCount / (event.maxVolunteers || 1) * 100)}%</span>
                                </div>
                                <div style={{ height: '6px', background: '#f3f4f6', borderRadius: '3px', marginBottom: '14px' }}>
                                    <div style={{ height: '100%', borderRadius: '3px', background: colors.strip, width: `${(joinedCount / (event.maxVolunteers || 1) * 100)}%` }}></div>
                                </div>

                                <button 
                                    onClick={() => !isRegistered && handleRegister(event._id)} 
                                    disabled={isRegistered || joinedCount >= event.maxVolunteers}
                                    style={{ 
                                        width: '100%', height: '42px', borderRadius: '10px', background: isRegistered ? '#f0fdf4' : '#1D9E75', 
                                        color: isRegistered ? '#065f46' : '#fff', border: isRegistered ? '1px solid #bbf7d0' : 'none', 
                                        cursor: isRegistered ? 'default' : 'pointer', fontWeight: 500 
                                    }}>
                                    {isRegistered ? '✅ Registered' : joinedCount >= event.maxVolunteers ? 'Event Full' : 'Register to Volunteer →'}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Side Drawer */}
            {drawerOpen && <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 2000 }} onClick={() => setDrawerOpen(false)}></div>}
            <div className="event-drawer" style={{ transform: drawerOpen ? 'translateX(0)' : 'translateX(100%)' }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '20px', fontWeight: 700 }}>Create New Event</h2>
                    <button style={{ background: '#f3f4f6', border: 'none', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', fontSize: '20px' }} onClick={() => setDrawerOpen(false)}>×</button>
                </div>
                {!formSubmitted ? (
                    <form style={{ padding: '24px' }} onSubmit={handleCreateEvent}>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>Event Title *</label>
                            <input style={{ width: '100%', height: '42px', padding: '0 14px', border: '1.5px solid #e5e7eb', borderRadius: '10px', outline: 'none', fontSize: '14px' }} required value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g. Weekend Kitchen" />
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>Event Type *</label>
                            <select style={{ width: '100%', height: '42px', padding: '0 14px', border: '1.5px solid #e5e7eb', borderRadius: '10px', outline: 'none', fontSize: '14px' }} value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                                <option value="food_drive">Food Drive</option>
                                <option value="orphanage">Orphanage Program</option>
                                <option value="fundraiser">Fundraiser</option>
                                <option value="workshop">Workshop</option>
                            </select>
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>Date & Time *</label>
                            <input type="datetime-local" style={{ width: '100%', height: '42px', padding: '0 14px', border: '1.5px solid #e5e7eb', borderRadius: '10px', outline: 'none', fontSize: '14px' }} required value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>Location Address *</label>
                            <input style={{ width: '100%', height: '42px', padding: '0 14px', border: '1.5px solid #e5e7eb', borderRadius: '10px', outline: 'none', fontSize: '14px' }} required value={form.location} onChange={e => setForm({...form, location: e.target.value})} placeholder="Full address" />
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>Max Volunteers *</label>
                            <input type="number" min="1" style={{ width: '100%', height: '42px', padding: '0 14px', border: '1.5px solid #e5e7eb', borderRadius: '10px', outline: 'none', fontSize: '14px' }} required value={form.maxVolunteers} onChange={e => setForm({...form, maxVolunteers: e.target.value})} />
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>Description *</label>
                            <textarea style={{ width: '100%', height: '80px', padding: '10px 14px', border: '1.5px solid #e5e7eb', borderRadius: '10px', outline: 'none', fontSize: '14px' }} required value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Describe the event..."></textarea>
                        </div>
                        <button type="submit" disabled={submitLoading} style={{ width: '100%', height: '50px', background: '#1D9E75', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', marginTop: '15px', transition: '0.2s' }}>
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

export default EventsPage;
