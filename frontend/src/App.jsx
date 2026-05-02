import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';

import Auth from './pages/Auth';
import DonateFoodPage from './pages/DonateFoodPage';
import RequestFoodPage from './pages/RequestFoodPage';
import OrphanageSupportPage from './pages/OrphanageSupportPage';
import EventsPage from './pages/EventsPage';
import ImpactDashboard from './pages/ImpactDashboard';
import LandingPage from './pages/LandingPage';
import Navbar from './components/Navbar';


const PrivateRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const MainLayout = ({ children }) => (
    <>
        <Navbar />
        <main style={{ paddingTop: '70px', minHeight: 'calc(100vh - 70px)' }}>
            {children}
        </main>
    </>
);

function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<Auth mode="login" />} />
                    <Route path="/register" element={<Auth mode="register" />} />
                    <Route path="/donate" element={<MainLayout><PrivateRoute><DonateFoodPage /></PrivateRoute></MainLayout>} />
                    <Route path="/request" element={<MainLayout><RequestFoodPage /></MainLayout>} />
                    <Route path="/orphanage" element={<MainLayout><OrphanageSupportPage /></MainLayout>} />
                    <Route path="/events" element={<MainLayout><EventsPage /></MainLayout>} />
                    <Route path="/dashboard" element={<MainLayout><PrivateRoute><ImpactDashboard /></PrivateRoute></MainLayout>} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;
