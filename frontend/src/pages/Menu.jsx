import { useState, useEffect } from 'react';
import { foodAPI } from '../services/api';
import FoodCard from '../components/Food/FoodCard';
import CategoryFilter from '../components/Food/CategoryFilter';
import './Menu.css';

const Menu = () => {
    const [foods, setFoods] = useState([]);
    const [category, setCategory] = useState('All');
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

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

    const filteredFoods = foods.filter(food =>
        food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        food.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="menu-page">
            <div className="container">
                <div className="page-header">
                    <h1>Our Menu</h1>
                    <p>Explore our wide variety of delicious dishes</p>
                </div>

                <div className="menu-controls">
                    <div className="search-box">
                        <span className="search-icon">🔍</span>
                        <input
                            type="text"
                            className="input"
                            placeholder="Search for dishes..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <CategoryFilter
                    activeCategory={category}
                    onCategoryChange={setCategory}
                />

                <div className="menu-results">
                    <p className="results-count">
                        Showing {filteredFoods.length} {filteredFoods.length === 1 ? 'item' : 'items'}
                    </p>
                </div>

                {loading ? (
                    <div className="food-grid">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="card skeleton" style={{ height: '320px' }}></div>
                        ))}
                    </div>
                ) : filteredFoods.length > 0 ? (
                    <div className="food-grid">
                        {filteredFoods.map((food) => (
                            <FoodCard key={food._id} food={food} />
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <span className="empty-icon">🔍</span>
                        <h3>No items found</h3>
                        <p>Try a different search term or category</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Menu;
