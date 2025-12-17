import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ isOpen, onToggle, onLogout }) => {
    const menuItems = [
        { path: '/', label: 'Dashboard', icon: '📊' },
        { path: '/orders', label: 'Orders', icon: '📦' },
        { path: '/menu', label: 'Menu Items', icon: '🍕' },
        { path: '/add', label: 'Add Food', icon: '➕' }
    ];

    return (
        <aside className={`sidebar ${isOpen ? '' : 'collapsed'}`}>
            <div className="sidebar-header">
                <span className="sidebar-logo">🍕</span>
                {isOpen && <span className="sidebar-title">Admin</span>}
                <button className="sidebar-toggle" onClick={onToggle}>
                    {isOpen ? '◀' : '▶'}
                </button>
            </div>

            <nav className="sidebar-nav">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                        end={item.path === '/'}
                    >
                        <span className="nav-icon">{item.icon}</span>
                        {isOpen && <span className="nav-label">{item.label}</span>}
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer">
                <button className="logout-btn" onClick={onLogout}>
                    <span className="nav-icon">🚪</span>
                    {isOpen && <span className="nav-label">Logout</span>}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
