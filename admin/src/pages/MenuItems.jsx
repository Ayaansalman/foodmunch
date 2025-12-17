import { useState, useEffect } from 'react';
import './MenuItems.css';

const API_URL = 'http://localhost:4000/api';

const MenuItems = ({ token }) => {
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchFoods = async () => {
        try {
            const response = await fetch(`${API_URL}/food/list`);
            const data = await response.json();
            if (data.success) {
                setFoods(data.data);
            }
        } catch (error) {
            console.error('Error fetching foods:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFoods();
    }, []);

    const deleteFood = async (foodId) => {
        if (!confirm('Are you sure you want to delete this item?')) return;

        try {
            const response = await fetch(`${API_URL}/food/${foodId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setFoods(foods.filter(food => food._id !== foodId));
            }
        } catch (error) {
            console.error('Error deleting food:', error);
        }
    };

    const toggleAvailability = async (foodId) => {
        try {
            const response = await fetch(`${API_URL}/food/${foodId}/toggle`, {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setFoods(foods.map(food =>
                    food._id === foodId ? { ...food, isAvailable: data.data.isAvailable } : food
                ));
            }
        } catch (error) {
            console.error('Error toggling availability:', error);
        }
    };

    if (loading) {
        return (
            <div className="menu-items-page">
                <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
                    <div className="loader"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="menu-items-page">
            <div className="page-header">
                <h1>Menu Items</h1>
                <p>Manage your restaurant menu</p>
            </div>

            {foods.length === 0 ? (
                <div className="card">
                    <div className="empty-state">
                        <span className="empty-icon">🍽️</span>
                        <h3>No Menu Items</h3>
                        <p>Add some food items to get started</p>
                    </div>
                </div>
            ) : (
                <div className="menu-grid">
                    {foods.map((food) => (
                        <div key={food._id} className={`menu-card card ${!food.isAvailable ? 'unavailable' : ''}`}>
                            <img
                                src={food.image?.startsWith('http') ? food.image : `http://localhost:4000/images/${food.image}`}
                                alt={food.name}
                                className="menu-card-image"
                            />
                            <div className="menu-card-content">
                                <div className="menu-card-header">
                                    <h3>{food.name}</h3>
                                    <span className="badge badge-primary">{food.category}</span>
                                </div>
                                <p className="menu-card-desc">{food.description}</p>
                                <div className="menu-card-footer">
                                    <span className="menu-price">${food.price.toFixed(2)}</span>
                                    <div className="menu-actions">
                                        <button
                                            className={`btn btn-sm ${food.isAvailable ? 'btn-secondary' : 'btn-primary'}`}
                                            onClick={() => toggleAvailability(food._id)}
                                        >
                                            {food.isAvailable ? '🔴 Disable' : '🟢 Enable'}
                                        </button>
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => deleteFood(food._id)}
                                        >
                                            🗑️ Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MenuItems;
