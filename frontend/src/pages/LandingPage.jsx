import { motion } from 'framer-motion';
import HeroParticles from '../components/HeroParticles';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

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
        <div className="landing-container">
            <HeroParticles />
            <div className="landing-glow"></div>
            
            <div className="landing-content">
                <motion.div 
                    variants={containerVars}
                    initial="hidden"
                    animate="visible"
                    className="landing-headline"
                >
                    {words.map((word, i) => (
                        <motion.span key={i} variants={wordVars} className="landing-word">
                            {word}&nbsp;
                        </motion.span>
                    ))}
                </motion.div>

                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.8, duration: 1 }}
                    className="landing-subheadline"
                >
                    Donate food, sponsor children, and make a real impact in your community.
                </motion.p>

                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 2.2, duration: 0.5 }}
                    className="landing-cta-group"
                >
                    <button onClick={() => navigate('/register')} className="primary-btn-hero">Get Started</button>
                    <button onClick={() => navigate('/request')} className="secondary-btn-hero">Browse Donations</button>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 3, duration: 1 }}
                    className="landing-stats-bar"
                >
                    <div className="stat-item">
                        <span className="stat-num">12k+</span>
                        <span className="stat-label">Meals Shared</span>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="stat-item">
                        <span className="stat-num">89</span>
                        <span className="stat-label">Verified NGOs</span>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="stat-item">
                        <span className="stat-num">5k+</span>
                        <span className="stat-label">Lives Impacted</span>
                    </div>
                </motion.div>
            </div>

            {/* Floating Elements for depth */}
            <div className="landing-blob" style={{ top: '20%', left: '10%', width: '300px', height: '300px', background: 'rgba(29,158,117,0.05)' }}></div>
            <div className="landing-blob" style={{ bottom: '10%', right: '5%', width: '400px', height: '400px', background: 'rgba(45,212,160,0.03)' }}></div>
        </div>
    );
};

export default LandingPage;
