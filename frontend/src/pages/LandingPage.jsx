import { motion } from 'framer-motion';
import HeroParticles from '../components/HeroParticles';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const navigate = useNavigate();
    const words = "Bridging Kindness with Need".split(" ");

    const containerVars = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2, delayChildren: 0.5 }
        }
    };

    const wordVars = {
        hidden: { y: 40, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.6, 0.01, -0.05, 0.95] } }
    };

    return (
        <div style={styles.container}>
            <HeroParticles />
            <div style={styles.glow}></div>
            
            <div style={styles.content}>
                <motion.div 
                    variants={containerVars}
                    initial="hidden"
                    animate="visible"
                    style={styles.headline}
                >
                    {words.map((word, i) => (
                        <motion.span key={i} variants={wordVars} style={styles.word}>
                            {word}&nbsp;
                        </motion.span>
                    ))}
                </motion.div>

                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.8, duration: 1 }}
                    style={styles.subheadline}
                >
                    Donate food, sponsor children, and make a real impact in your community.
                </motion.p>

                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 2.2, duration: 0.5 }}
                    style={styles.ctaGroup}
                >
                    <button onClick={() => navigate('/register')} style={styles.primaryBtn}>Get Started</button>
                    <button onClick={() => navigate('/request')} style={styles.secondaryBtn}>Browse Donations</button>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 3, duration: 1 }}
                    style={styles.statsBar}
                >
                    <div style={styles.statItem}>
                        <span style={styles.statNum}>12k+</span>
                        <span style={styles.statLabel}>Meals Shared</span>
                    </div>
                    <div style={styles.statDivider}></div>
                    <div style={styles.statItem}>
                        <span style={styles.statNum}>89</span>
                        <span style={styles.statLabel}>Verified NGOs</span>
                    </div>
                    <div style={styles.statDivider}></div>
                    <div style={styles.statItem}>
                        <span style={styles.statNum}>5k+</span>
                        <span style={styles.statLabel}>Lives Impacted</span>
                    </div>
                </motion.div>
            </div>

            {/* Floating Elements for depth */}
            <div style={{ ...styles.blob, top: '20%', left: '10%', width: '300px', height: '300px', background: 'rgba(29,158,117,0.05)' }}></div>
            <div style={{ ...styles.blob, bottom: '10%', right: '5%', width: '400px', height: '400px', background: 'rgba(45,212,160,0.03)' }}></div>
        </div>
    );
};

const styles = {
    container: { position: 'relative', height: '100vh', width: '100vw', background: '#0a1f14', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' },
    glow: { position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, rgba(29,158,117,0.1) 0%, transparent 70%)', pointerEvents: 'none' },
    content: { position: 'relative', zIndex: 10, textAlign: 'center', maxWidth: '900px', padding: '0 20px' },
    headline: { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '24px' },
    word: { display: 'inline-block', fontFamily: 'Syne, sans-serif', fontSize: 'clamp(2.5rem, 8vw, 5.5rem)', fontWeight: 800, letterSpacing: '-2px' },
    subheadline: { fontSize: 'clamp(1rem, 2vw, 1.25rem)', color: 'rgba(255,255,255,0.7)', maxWidth: '600px', margin: '0 auto 40px', lineHeight: 1.6 },
    ctaGroup: { display: 'flex', gap: '20px', justifyContent: 'center', marginBottom: '80px' },
    primaryBtn: { padding: '16px 40px', background: '#1D9E75', color: '#fff', border: 'none', borderRadius: '50px', fontSize: '16px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 10px 25px rgba(29,158,117,0.3)', transition: '0.3s' },
    secondaryBtn: { padding: '16px 40px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50px', fontSize: '16px', fontWeight: 600, cursor: 'pointer', transition: '0.3s', backdropFilter: 'blur(10px)' },
    statsBar: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '40px', background: 'rgba(255,255,255,0.03)', padding: '24px 48px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(5px)' },
    statItem: { textAlign: 'center' },
    statNum: { display: 'block', fontSize: '24px', fontWeight: 800, fontFamily: 'Syne, sans-serif', color: '#1D9E75' },
    statLabel: { fontSize: '12px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '4px' },
    statDivider: { width: '1px', height: '40px', background: 'rgba(255,255,255,0.1)' },
    blob: { position: 'absolute', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 1 }
};

export default LandingPage;
