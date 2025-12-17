import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import './FoodCard.css';

const FoodCard = ({ food, onAuthRequired }) => {
    const { addToCart, removeFromCart, getItemQuantity } = useCart();
    const { isAuthenticated } = useAuth();
    const quantity = getItemQuantity(food._id);

    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            onAuthRequired?.();
            return;
        }
        await addToCart(food._id);
    };

    const handleRemoveFromCart = async () => {
        await removeFromCart(food._id);
    };

    return (
        <div className="food-card card">
            <div className="food-image-wrapper">
                <img
                    src={food.image?.startsWith('http') ? food.image : `http://localhost:4000/images/${food.image}`}
                    alt={food.name}
                    className="food-image"
                    loading="lazy"
                />
                {food.preparationTime && (
                    <span className="prep-time">🕐 {food.preparationTime} min</span>
                )}
            </div>

            <div className="food-content">
                <div className="food-header">
                    <h3 className="food-name">{food.name}</h3>
                    <span className="badge badge-primary">{food.category}</span>
                </div>

                <p className="food-description">{food.description}</p>

                <div className="food-footer">
                    <span className="food-price">${food.price.toFixed(2)}</span>

                    {quantity === 0 ? (
                        <button className="btn btn-primary btn-sm" onClick={handleAddToCart}>
                            Add to Cart
                        </button>
                    ) : (
                        <div className="quantity-controls">
                            <button className="qty-btn" onClick={handleRemoveFromCart}>−</button>
                            <span className="quantity">{quantity}</span>
                            <button className="qty-btn" onClick={handleAddToCart}>+</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FoodCard;
