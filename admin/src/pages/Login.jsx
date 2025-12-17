import { useState } from 'react';
import './Login.css';

const API_URL = 'http://localhost:4000/api';

const Login = ({ onLogin }) => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                // Check if user is admin
                if (data.user.role === 'admin') {
                    onLogin(data.token);
                } else {
                    setError('Access denied. Admin only.');
                }
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError('Connection error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-header">
                    <span className="login-logo">🍕</span>
                    <h1>Admin Panel</h1>
                    <p>Sign in to manage your restaurant</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Email</label>
                        <input
                            type="email"
                            className="input"
                            placeholder="admin@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Password</label>
                        <input
                            type="password"
                            className="input"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                    </div>

                    {error && <p className="error-message">{error}</p>}

                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? <span className="loader" style={{ width: 20, height: 20 }}></span> : 'Sign In'}
                    </button>
                </form>

                <p className="login-note">
                    Default admin: admin@fooddel.com / admin123
                </p>
            </div>
        </div>
    );
};

export default Login;
