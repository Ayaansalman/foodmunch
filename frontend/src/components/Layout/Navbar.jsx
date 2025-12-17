import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import './Navbar.css';

const Navbar = ({ onAuthClick }) => {
    const { user, isAuthenticated, logout } = useAuth();
    const { itemCount } = useCart();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="navbar">
            <div className="container navbar-container">
                <Link to="/" className="navbar-logo">
                    <span className="logo-icon">🍕</span>
                    <span className="logo-text">FoodMunch</span>
                </Link>

                <ul className="navbar-menu">
                    <li>
                        <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link to="/menu" className={`nav-link ${isActive('/menu') ? 'active' : ''}`}>
                            Menu
                        </Link>
                    </li>
                    {isAuthenticated && (
                        <li>
                            <Link to="/orders" className={`nav-link ${isActive('/orders') ? 'active' : ''}`}>
                                My Orders
                            </Link>
                        </li>
                    )}
                </ul>

                <div className="navbar-actions">
                    <Link to="/cart" className="cart-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="9" cy="21" r="1"></circle>
                            <circle cx="20" cy="21" r="1"></circle>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                        </svg>
                        {itemCount > 0 && <span className="cart-count">{itemCount}</span>}
                    </Link>

                    {isAuthenticated ? (
                        <div className="user-menu">
                            <span className="user-name">Hi, {user?.name?.split(' ')[0]}</span>
                            <button onClick={logout} className="btn btn-outline btn-sm">
                                Logout
                            </button>
                        </div>
                    ) : (
                        <button onClick={onAuthClick} className="btn btn-primary">
                            Sign In
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
