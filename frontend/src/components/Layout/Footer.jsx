import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <Link to="/" className="footer-logo">
                            <span className="logo-icon">🍕</span>
                            <span className="logo-text">FoodMunch</span>
                        </Link>
                        <p className="footer-tagline">
                            Delivering happiness to your doorstep. Fresh, fast, and delicious!
                        </p>
                        <div className="social-links">
                            <a href="#" className="social-link">📘</a>
                            <a href="#" className="social-link">📸</a>
                            <a href="#" className="social-link">🐦</a>
                        </div>
                    </div>

                    <div className="footer-links">
                        <h4>Quick Links</h4>
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/menu">Menu</Link></li>
                            <li><Link to="/cart">Cart</Link></li>
                            <li><Link to="/orders">My Orders</Link></li>
                        </ul>
                    </div>

                    <div className="footer-links">
                        <h4>Legal</h4>
                        <ul>
                            <li><a href="#">Privacy Policy</a></li>
                            <li><a href="#">Terms of Service</a></li>
                            <li><a href="#">Refund Policy</a></li>
                        </ul>
                    </div>

                    <div className="footer-contact">
                        <h4>Contact Us</h4>
                        <p>📍 123 Food Street, Delicious City</p>
                        <p>📞 +1 234 567 8900</p>
                        <p>✉️ support@foodmunch.com</p>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; 2024 FoodMunch. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
