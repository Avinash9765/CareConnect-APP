import { useState } from 'react';

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
        <div style={styles.page}>
            {/* Hero Banner */}
            <section style={styles.hero}>
                <div style={{ ...styles.floatingEmoji, left: '15%', animationDelay: '0s' }}>👶</div>
                <div style={{ ...styles.floatingEmoji, right: '20%', animationDelay: '1s' }}>❤️</div>
                <div style={{ ...styles.floatingEmoji, left: '60%', animationDelay: '0.5s' }}>📚</div>
                <h1 style={styles.heroTitle}>Be a Ray of Hope</h1>
                <p style={styles.heroSubtitle}>Every child deserves love, education, and a bright future. You can make that possible.</p>
            </section>

            {/* Support Types */}
            <section style={styles.section}>
                <h2 style={styles.sectionTitle}>How Would You Like to Help?</h2>
                <div style={styles.supportGrid}>
                    {[
                        { id: 'sponsor', icon: '📚', title: 'Sponsor Education', desc: 'Cover books, fees, and school supplies', accent: '#d97706' },
                        { id: 'donate', icon: '📦', title: 'Donate Essentials', desc: 'Send clothes, toys, and daily needs', accent: '#1D9E75' },
                        { id: 'volunteer', icon: '🙋', title: 'Volunteer Your Time', desc: 'Teach skills or mentor children', accent: '#2563eb' },
                        { id: 'event', icon: '🎉', title: 'Host an Event', desc: 'Organize birthdays or workshops', accent: '#7c3aed' }
                    ].map(card => (
                        <div key={card.id} onClick={() => setActiveSupport(activeSupport === card.id ? null : card.id)} 
                            style={{ ...styles.supportCard, borderColor: activeSupport === card.id ? card.accent : '#e5e7eb', boxShadow: activeSupport === card.id ? `0 0 0 3px ${card.accent}22` : 'none' }}>
                            <span style={styles.supportIcon}>{card.icon}</span>
                            <h3 style={styles.supportTitle}>{card.title}</h3>
                            <p style={styles.supportDesc}>{card.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Expanded Content */}
                <div style={{ ...styles.expandedContent, maxHeight: activeSupport ? '800px' : '0' }}>
                    {activeSupport === 'sponsor' && (
                        <div style={styles.sponsorTiers}>
                            <div style={styles.tierGrid}>
                                {[{ id: 'A', price: '500', label: 'Books & Stationery' }, { id: 'B', price: '1,000', label: 'Fees + Supplies' }, { id: 'C', price: '2,000', label: 'Full Support' }].map(tier => (
                                    <div key={tier.id} onClick={() => setSponsorTier(tier.id)} style={{ ...styles.tierCard, background: sponsorTier === tier.id ? '#1D9E75' : '#fff', color: sponsorTier === tier.id ? '#fff' : '#0a1f14' }}>
                                        <h4>₹{tier.price}/mo</h4>
                                        <p>{tier.label}</p>
                                    </div>
                                ))}
                            </div>
                            <button onClick={() => document.getElementById('children-section').scrollIntoView()} style={styles.browseBtn}>Browse Children Profiles ↓</button>
                        </div>
                    )}
                    {activeSupport === 'volunteer' && (
                        <div style={styles.formSection}>
                            <input style={styles.input} placeholder="Your Name" />
                            <input style={styles.input} placeholder="Email Address" />
                            <textarea style={styles.textarea} placeholder="What can you do? (Teach, Mentor, etc.)"></textarea>
                            <button style={styles.submitBtn}>Register as Volunteer</button>
                        </div>
                    )}
                </div>
            </section>

            {/* Children Profiles */}
            <section id="children-section" style={{ ...styles.section, background: '#0a1f14' }}>
                <div style={styles.disclaimer}>⚠️ All profiles are anonymized simulations. No real child data is used. For demonstration only.</div>
                <h2 style={{ ...styles.sectionTitle, color: '#fff' }}>Meet the Children</h2>
                <div style={styles.childrenGrid}>
                    {children.map(child => (
                        <div key={child.id} style={styles.flipContainer}>
                            <div style={styles.flipInner}>
                                <div style={{ ...styles.flipFront, background: `${child.avatarColor}11`, borderColor: `${child.avatarColor}44` }}>
                                    <div style={{ ...styles.avatarCircle, background: child.avatarColor }}>
                                        <svg width="40" height="40" viewBox="0 0 24 24" fill="white"><path d="M12 4a4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4z"/></svg>
                                    </div>
                                    <h3 style={styles.childId}>Child #{child.id}</h3>
                                    <p style={styles.childAge}>Age {child.age}</p>
                                    <p style={styles.childGrade}>{child.grade}</p>
                                    <button style={styles.cardBtn}>Sponsor Now</button>
                                </div>
                                <div style={{ ...styles.flipBack, background: `${child.avatarColor}22`, borderColor: `${child.avatarColor}44` }}>
                                    <p><strong>❤️ Loves:</strong> {child.interests.join(', ')}</p>
                                    <p><strong>🎓 Dream:</strong> {child.dream}</p>
                                    <p><strong>📌 Needs:</strong> {child.need}</p>
                                    <button onClick={() => handleSponsorClick(child)} style={{ ...styles.submitBtn, background: child.avatarColor }}>Sponsor This Child</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Modal */}
            {showModal && selectedChild && (
                <div style={styles.overlay} onClick={() => setShowModal(false)}>
                    <div style={styles.modal} onClick={e => e.stopPropagation()}>
                        <button style={styles.closeBtn} onClick={() => setShowModal(false)}>×</button>
                        <h2 style={styles.modalTitle}>{sponsorConfirmed ? 'Sponsorship Activated!' : 'Choose Your Support Level'}</h2>
                        <p style={styles.modalSubtitle}>For Child #{selectedChild.id}, Age {selectedChild.age}</p>
                        
                        {!sponsorConfirmed ? (
                            <>
                                {['500', '1,000', '2,000'].map((p, i) => (
                                    <div key={i} onClick={() => setSponsorTier(i)} style={{ ...styles.modalTier, borderColor: sponsorTier === i ? '#d97706' : '#e5e7eb', background: sponsorTier === i ? '#fffbeb' : '#fff' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <strong>₹{p} / month</strong>
                                            <span>{['Books', 'Fees', 'Full'][i]}</span>
                                        </div>
                                        <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>Covers basic needs and education support.</p>
                                    </div>
                                ))}
                                <button onClick={() => setSponsorConfirmed(true)} style={{ ...styles.submitBtn, background: '#d97706', marginTop: '20px' }}>Confirm Sponsorship</button>
                            </>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '20px' }}>
                                <div style={{ fontSize: '48px' }}>✅</div>
                                <p style={{ color: '#6b7280', margin: '16px 0' }}>Thank you! You'll receive monthly updates on Child #{selectedChild.id}'s progress.</p>
                                <button onClick={() => setShowModal(false)} style={styles.submitBtn}>Close</button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    page: { fontFamily: 'DM Sans, sans-serif', color: '#0a1f14' },
    hero: { position: 'relative', padding: '80px 40px', textAlign: 'center', background: 'linear-gradient(135deg, #1a0a00 0%, #2d1200 50%, #1a0a00 100%)', overflow: 'hidden' },
    heroTitle: { fontFamily: 'Syne, sans-serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, color: '#fff', position: 'relative', zIndex: 1 },
    heroSubtitle: { color: 'rgba(255,255,255,0.75)', maxWidth: '500px', margin: '16px auto 0', position: 'relative', zIndex: 1 },
    floatingEmoji: { position: 'absolute', fontSize: '3rem', opacity: 0.3, animation: 'float 4s infinite ease-in-out' },
    section: { padding: '80px 40px' },
    sectionTitle: { fontFamily: 'Syne, sans-serif', fontSize: '32px', textAlign: 'center', marginBottom: '48px' },
    supportGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', maxWidth: '800px', margin: '0 auto' },
    supportCard: { background: '#fff', borderRadius: '16px', border: '1.5px solid #e5e7eb', padding: '32px 28px', cursor: 'pointer', transition: '0.3s' },
    supportIcon: { fontSize: '3rem', display: 'block', marginBottom: '16px' },
    supportTitle: { fontFamily: 'Syne, sans-serif', fontSize: '20px', marginBottom: '8px' },
    supportDesc: { color: '#6b7280', fontSize: '14px' },
    expandedContent: { overflow: 'hidden', transition: 'max-height 0.4s ease', maxWidth: '800px', margin: '0 auto' },
    sponsorTiers: { padding: '24px 0', textAlign: 'center' },
    tierGrid: { display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '24px' },
    tierCard: { border: '1.5px solid #e5e7eb', borderRadius: '12px', padding: '16px', cursor: 'pointer', flex: 1, transition: '0.2s' },
    browseBtn: { background: 'none', border: 'none', color: '#d97706', cursor: 'pointer', fontWeight: 500 },
    formSection: { display: 'flex', flexDirection: 'column', gap: '16px', padding: '24px 0' },
    input: { width: '100%', height: '48px', padding: '0 16px', border: '1.5px solid #e5e7eb', borderRadius: '10px' },
    textarea: { width: '100%', minHeight: '100px', padding: '16px', border: '1.5px solid #e5e7eb', borderRadius: '10px' },
    submitBtn: { width: '100%', height: '50px', background: '#1D9E75', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 500, cursor: 'pointer' },
    childrenGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', maxWidth: '1000px', margin: '0 auto' },
    flipContainer: { perspective: '1000px', width: '280px', height: '320px', cursor: 'pointer', margin: '0 auto' },
    flipInner: { position: 'relative', width: '100%', height: '100%', textAlign: 'center', transition: 'transform 0.6s', transformStyle: 'preserve-3d' },
    flipFront: { position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden', borderRadius: '16px', border: '1px solid', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '28px' },
    flipBack: { position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden', borderRadius: '16px', border: '1px solid', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '24px', transform: 'rotateY(180deg)' },
    avatarCircle: { width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' },
    childId: { fontFamily: 'Syne, sans-serif', fontSize: '18px', color: '#fff' },
    childAge: { color: 'rgba(255,255,255,0.7)', fontSize: '14px' },
    cardBtn: { background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '8px', padding: '8px 20px', marginTop: '16px' },
    disclaimer: { background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', padding: '10px 20px', textAlign: 'center', color: 'rgba(255,255,255,0.6)', fontSize: '12px', marginBottom: '40px' },
    overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' },
    modal: { background: '#fff', borderRadius: '20px', padding: '36px', maxWidth: '460px', width: '90%', position: 'relative' },
    closeBtn: { position: 'absolute', top: '16px', right: '16px', background: '#f3f4f6', border: 'none', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer' },
    modalTitle: { fontFamily: 'Syne, sans-serif', fontSize: '24px', textAlign: 'center' },
    modalSubtitle: { fontSize: '14px', color: '#6b7280', textAlign: 'center', marginBottom: '24px' },
    modalTier: { border: '2px solid #e5e7eb', borderRadius: '12px', padding: '18px 20px', cursor: 'pointer', marginBottom: '12px', transition: '0.2s' }
};

export default OrphanageSupportPage;
