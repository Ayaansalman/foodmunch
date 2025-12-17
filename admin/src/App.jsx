import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import MenuItems from './pages/MenuItems';
import AddFood from './pages/AddFood';
import Login from './pages/Login';
import './styles/index.css';

function App() {
    const [token, setToken] = useState(localStorage.getItem('adminToken') || '');
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const handleLogin = (newToken) => {
        localStorage.setItem('adminToken', newToken);
        setToken(newToken);
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        setToken('');
    };

    if (!token) {
        return <Login onLogin={handleLogin} />;
    }

    return (
        <div className="admin-app">
            <Sidebar
                isOpen={sidebarOpen}
                onToggle={() => setSidebarOpen(!sidebarOpen)}
                onLogout={handleLogout}
            />
            <main className={`admin-main ${sidebarOpen ? '' : 'expanded'}`}>
                <Routes>
                    <Route path="/" element={<Dashboard token={token} />} />
                    <Route path="/orders" element={<Orders token={token} />} />
                    <Route path="/menu" element={<MenuItems token={token} />} />
                    <Route path="/add" element={<AddFood token={token} />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </main>
        </div>
    );
}

export default App;
