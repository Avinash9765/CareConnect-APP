import { useState } from 'react';
import './OrphanageSupportPage.css';

const children = [
    { id: 'A12', age: 8, grade: 'Grade 3', interests: ['Drawing', 'Football'], dream: 'Wants to be a teacher', need: 'School fees', avatarColor: '#1D9E75' },
    { id: 'B07', age: 11, grade: 'Grade 6', interests: ['Reading', 'Cricket'], dream: 'Wants to be a doctor', need: 'Books and stationery', avatarColor: '#2563eb' },
    { id: 'C19', age: 9, grade: 'Grade 4', interests: ['Dancing', 'Cooking'], dream: 'Wants to open a restaurant', need: 'Full support', avatarColor: '#d97706' },
    { id: 'D03', age: 13, grade: 'Grade 8', interests: ['Coding', 'Chess'], dream: 'Wants to be a software engineer', need: 'School fees', avatarColor: '#7c3aed' },
    { id: 'E14', age: 7, grade: 'Grade 2', interests: ['Painting', 'Singing'], dream: 'Wants to be an artist', need: 'Books and stationery', avatarColor: '#db2777' },
    { id: 'F22', age: 15, grade: 'Grade 10', interests: ['Science', 'Basketball'], dream: 'Wants to be a scientist', need: 'Full support', avatarColor: '#0F6E56' }
];

const OrphanageSupportPage = () => {
    const [activeSupport, setActiveSupport] = useState(null);
    const [selectedChild, setSelectedChild] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [sponsorTier, setSponsorTier] = useState(null);
    const [sponsorConfirmed, setSponsorConfirmed] = useState(false);

    const handleSponsorClick = (child) => {
        setSelectedChild(child);
        setShowModal(true);
        setSponsorConfirmed(false);
        setSponsorTier(null);
    };

    return (
        <div className="orphanage-container">
            {/* Hero Banner */}
            <section className="orphanage-hero">
                <div style={{ position: 'absolute', fontSize: '3rem', opacity: 0.3, left: '15%', top: '20%' }}>👶</div>
                <div style={{ position: 'absolute', fontSize: '3rem', opacity: 0.3, right: '20%', top: '30%' }}>❤️</div>
                <div style={{ position: 'absolute', fontSize: '3rem', opacity: 0.3, left: '60%', bottom: '20%' }}>📚</div>
                <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, color: '#fff', position: 'relative', zIndex: 1 }}>Be a Ray of Hope</h1>
                <p style={{ color: 'rgba(255,255,255,0.75)', maxWidth: '500px', margin: '16px auto 0', position: 'relative', zIndex: 1 }}>Every child deserves love, education, and a bright future. You can make that possible.</p>
            </section>

            {/* Support Types */}
            <section className="orphanage-section">
                <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '32px', textAlign: 'center', marginBottom: '48px' }}>How Would You Like to Help?</h2>
                <div className="orphanage-support-grid">
                    {[
                        { id: 'sponsor', icon: '📚', title: 'Sponsor Education', desc: 'Cover books, fees, and school supplies', accent: '#d97706' },
                        { id: 'donate', icon: '📦', title: 'Donate Essentials', desc: 'Send clothes, toys, and daily needs', accent: '#1D9E75' },
                        { id: 'volunteer', icon: '🙋', title: 'Volunteer Your Time', desc: 'Teach skills or mentor children', accent: '#2563eb' },
                        { id: 'event', icon: '🎉', title: 'Host an Event', desc: 'Organize birthdays or workshops', accent: '#7c3aed' }
                    ].map(card => (
                        <div key={card.id} onClick={() => setActiveSupport(activeSupport === card.id ? null : card.id)} 
                            style={{ background: '#fff', borderRadius: '16px', border: '1.5px solid', borderColor: activeSupport === card.id ? card.accent : '#e5e7eb', padding: '32px 28px', cursor: 'pointer', transition: '0.3s', boxShadow: activeSupport === card.id ? `0 0 0 3px ${card.accent}22` : 'none' }}>
                            <span style={{ fontSize: '3rem', display: 'block', marginBottom: '16px' }}>{card.icon}</span>
                            <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '20px', marginBottom: '8px' }}>{card.title}</h3>
                            <p style={{ color: '#6b7280', fontSize: '14px' }}>{card.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Expanded Content */}
                <div style={{ overflow: 'hidden', transition: 'max-height 0.4s ease', maxWidth: '800px', margin: '0 auto', maxHeight: activeSupport ? '800px' : '0' }}>
                    {activeSupport === 'sponsor' && (
                        <div style={{ padding: '24px 0', textAlign: 'center' }}>
                            <div className="tier-grid" style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '24px' }}>
                                {[{ id: 'A', price: '500', label: 'Books & Stationery' }, { id: 'B', price: '1,000', label: 'Fees + Supplies' }, { id: 'C', price: '2,000', label: 'Full Support' }].map(tier => (
                                    <div key={tier.id} onClick={() => setSponsorTier(tier.id)} style={{ border: '1.5px solid #e5e7eb', borderRadius: '12px', padding: '16px', cursor: 'pointer', flex: 1, transition: '0.2s', background: sponsorTier === tier.id ? '#1D9E75' : '#fff', color: sponsorTier === tier.id ? '#fff' : '#0a1f14' }}>
                                        <h4>₹{tier.price}/mo</h4>
                                        <p>{tier.label}</p>
                                    </div>
                                ))}
                            </div>
                            <button onClick={() => document.getElementById('children-section').scrollIntoView()} style={{ background: 'none', border: 'none', color: '#d97706', cursor: 'pointer', fontWeight: 500 }}>Browse Children Profiles ↓</button>
                        </div>
                    )}
                    {activeSupport === 'volunteer' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '24px 0' }}>
                            <input style={{ width: '100%', height: '48px', padding: '0 16px', border: '1.5px solid #e5e7eb', borderRadius: '10px' }} placeholder="Your Name" />
                            <input style={{ width: '100%', height: '48px', padding: '0 16px', border: '1.5px solid #e5e7eb', borderRadius: '10px' }} placeholder="Email Address" />
                            <textarea style={{ width: '100%', minHeight: '100px', padding: '16px', border: '1.5px solid #e5e7eb', borderRadius: '10px' }} placeholder="What can you do? (Teach, Mentor, etc.)"></textarea>
                            <button style={{ width: '100%', height: '50px', background: '#1D9E75', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 500, cursor: 'pointer' }}>Register as Volunteer</button>
                        </div>
                    )}
                </div>
            </section>

            {/* Children Profiles */}
            <section id="children-section" style={{ padding: '80px 40px', background: '#0a1f14' }}>
                <div style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', padding: '10px 20px', textAlign: 'center', color: 'rgba(255,255,255,0.6)', fontSize: '12px', marginBottom: '40px' }}>⚠️ All profiles are anonymized simulations. No real child data is used. For demonstration only.</div>
                <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '32px', textAlign: 'center', marginBottom: '48px', color: '#fff' }}>Meet the Children</h2>
                <div className="orphanage-children-grid">
                    {children.map(child => (
                        <div key={child.id} className="flip-container">
                            <div className="flip-inner">
                                <div className="flip-front" style={{ background: `${child.avatarColor}11`, borderColor: `${child.avatarColor}44` }}>
                                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', background: child.avatarColor }}>
                                        <svg width="40" height="40" viewBox="0 0 24 24" fill="white"><path d="M12 4a4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4z"/></svg>
                                    </div>
                                    <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '18px', color: '#fff' }}>Child #{child.id}</h3>
                                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>Age {child.age}</p>
                                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>{child.grade}</p>
                                    <button style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '8px', padding: '8px 20px', marginTop: '16px' }}>Sponsor Now</button>
                                </div>
                                <div className="flip-back" style={{ background: `${child.avatarColor}22`, borderColor: `${child.avatarColor}44`, color: '#fff' }}>
                                    <p><strong>❤️ Loves:</strong> {child.interests.join(', ')}</p>
                                    <p><strong>🎓 Dream:</strong> {child.dream}</p>
                                    <p><strong>📌 Needs:</strong> {child.need}</p>
                                    <button onClick={() => handleSponsorClick(child)} style={{ width: '100%', height: '50px', border: 'none', borderRadius: '10px', fontWeight: 500, cursor: 'pointer', background: child.avatarColor, color: '#fff' }}>Sponsor This Child</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Modal */}
            {showModal && selectedChild && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowModal(false)}>
                    <div style={{ background: '#fff', borderRadius: '20px', padding: '36px', maxWidth: '460px', width: '90%', position: 'relative' }} onClick={e => e.stopPropagation()}>
                        <button style={{ position: 'absolute', top: '16px', right: '16px', background: '#f3f4f6', border: 'none', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer' }} onClick={() => setShowModal(false)}>×</button>
                        <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '24px', textAlign: 'center' }}>{sponsorConfirmed ? 'Sponsorship Activated!' : 'Choose Your Support Level'}</h2>
                        <p style={{ fontSize: '14px', color: '#6b7280', textAlign: 'center', marginBottom: '24px' }}>For Child #{selectedChild.id}, Age {selectedChild.age}</p>
                        
                        {!sponsorConfirmed ? (
                            <>
                                {['500', '1,000', '2,000'].map((p, i) => (
                                    <div key={i} onClick={() => setSponsorTier(i)} style={{ border: '2px solid #e5e7eb', borderRadius: '12px', padding: '18px 20px', cursor: 'pointer', marginBottom: '12px', transition: '0.2s', borderColor: sponsorTier === i ? '#d97706' : '#e5e7eb', background: sponsorTier === i ? '#fffbeb' : '#fff' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <strong>₹{p} / month</strong>
                                            <span>{['Books', 'Fees', 'Full'][i]}</span>
                                        </div>
                                        <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>Covers basic needs and education support.</p>
                                    </div>
                                ))}
                                <button onClick={() => setSponsorConfirmed(true)} style={{ width: '100%', height: '50px', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 500, cursor: 'pointer', background: '#d97706', marginTop: '20px' }}>Confirm Sponsorship</button>
                            </>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '20px' }}>
                                <div style={{ fontSize: '48px' }}>✅</div>
                                <p style={{ color: '#6b7280', margin: '16px 0' }}>Thank you! You'll receive monthly updates on Child #{selectedChild.id}'s progress.</p>
                                <button onClick={() => setShowModal(false)} style={{ width: '100%', height: '50px', background: '#1D9E75', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 500, cursor: 'pointer' }}>Close</button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrphanageSupportPage;
