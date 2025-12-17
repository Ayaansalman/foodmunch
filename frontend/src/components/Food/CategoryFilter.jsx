import './CategoryFilter.css';

const categories = [
    { id: 'All', name: 'All', icon: '🍽️' },
    { id: 'Salad', name: 'Salads', icon: '🥗' },
    { id: 'Rolls', name: 'Rolls', icon: '🌯' },
    { id: 'Deserts', name: 'Desserts', icon: '🍰' },
    { id: 'Sandwich', name: 'Sandwich', icon: '🥪' },
    { id: 'Cake', name: 'Cakes', icon: '🎂' },
    { id: 'Pure Veg', name: 'Pure Veg', icon: '🥬' },
    { id: 'Pasta', name: 'Pasta', icon: '🍝' },
    { id: 'Noodles', name: 'Noodles', icon: '🍜' }
];

const CategoryFilter = ({ activeCategory, onCategoryChange }) => {
    return (
        <div className="category-filter">
            <div className="category-scroll">
                {categories.map((category) => (
                    <button
                        key={category.id}
                        className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
                        onClick={() => onCategoryChange(category.id)}
                    >
                        <span className="category-icon">{category.icon}</span>
                        <span className="category-name">{category.name}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CategoryFilter;
