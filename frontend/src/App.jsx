import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Verify from './pages/Verify';
import AuthModal from './components/Auth/AuthModal';
import { useAuth } from './context/AuthContext';
import './styles/index.css';

function App() {
    const [showAuthModal, setShowAuthModal] = useState(false);
    const { loading } = useAuth();

    if (loading) {
        return (
            <div className="loader-overlay">
                <div className="loader"></div>
            </div>
        );
    }

    return (
        <div className="app">
            {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
            <Navbar onAuthClick={() => setShowAuthModal(true)} />
            <main className="main-content">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/menu" element={<Menu />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/order" element={<Checkout />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/myorders" element={<Orders />} />
                    <Route path="/verify" element={<Verify />} />
                </Routes>
            </main>
            <Footer />
        </div>
    );
}

export default App;
