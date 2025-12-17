import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { foodAPI } from '../services/api';
import FoodCard from '../components/Food/FoodCard';
import CategoryFilter from '../components/Food/CategoryFilter';
import './Home.css';

const Home = () => {
    const [foods, setFoods] = useState([]);
    const [category, setCategory] = useState('All');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFoods = async () => {
            try {
                setLoading(true);
                const response = await foodAPI.getAll(category === 'All' ? '' : category);
                if (response.data.success) {
                    setFoods(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching foods:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFoods();
    }, [category]);

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero">
                <div className="container">
                    <div className="hero-content animate-fadeInUp">
                        <span className="hero-badge">🔥 Fast Delivery</span>
                        <h1 className="hero-title">
                            Delicious Food
                            <span className="gradient-text"> Delivered</span>
                            <br />To Your Door
                        </h1>
                        <p className="hero-description">
                            Order your favorite meals from the best restaurants in your area.
                            Fresh, fast, and always delicious!
                        </p>
                        <div className="hero-actions">
                            <Link to="/menu" className="btn btn-primary btn-lg">
                                Order Now
                            </Link>
                            <a href="#explore" className="btn btn-secondary btn-lg">
                                Explore Menu
                            </a>
                        </div>

                        <div className="hero-stats">
                            <div className="stat">
                                <span className="stat-value">500+</span>
                                <span className="stat-label">Dishes</span>
                            </div>
                            <div className="stat">
                                <span className="stat-value">50k+</span>
                                <span className="stat-label">Happy Customers</span>
                            </div>
                            <div className="stat">
                                <span className="stat-value">30min</span>
                                <span className="stat-label">Avg. Delivery</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="hero-gradient"></div>
            </section>

            {/* Menu Section */}
            <section id="explore" className="menu-section">
                <div className="container">
                    <div className="section-header">
                        <h2>Explore Our Menu</h2>
                        <p>Choose from a variety of delicious categories</p>
                    </div>

                    <CategoryFilter
                        activeCategory={category}
                        onCategoryChange={setCategory}
                    />

                    {loading ? (
                        <div className="food-grid">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="card skeleton" style={{ height: '320px' }}></div>
                            ))}
                        </div>
                    ) : foods.length > 0 ? (
                        <div className="food-grid">
                            {foods.slice(0, 8).map((food) => (
                                <FoodCard key={food._id} food={food} />
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <span className="empty-icon">🍽️</span>
                            <h3>No items found</h3>
                            <p>Try selecting a different category</p>
                        </div>
                    )}

                    {foods.length > 8 && (
                        <div className="section-footer">
                            <Link to="/menu" className="btn btn-outline btn-lg">
                                View All Menu Items →
                            </Link>
                        </div>
                    )}
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="container">
                    <div className="features-grid">
                        <div className="feature-card">
                            <span className="feature-icon">🚀</span>
                            <h3>Fast Delivery</h3>
                            <p>Get your food delivered in under 30 minutes</p>
                        </div>
                        <div className="feature-card">
                            <span className="feature-icon">🍳</span>
                            <h3>Fresh Food</h3>
                            <p>Prepared fresh when you order</p>
                        </div>
                        <div className="feature-card">
                            <span className="feature-icon">💰</span>
                            <h3>Best Prices</h3>
                            <p>Affordable prices with great taste</p>
                        </div>
                        <div className="feature-card">
                            <span className="feature-icon">📱</span>
                            <h3>Live Tracking</h3>
                            <p>Track your order in real-time</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
