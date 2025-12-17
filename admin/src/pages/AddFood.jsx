import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddFood.css';

const API_URL = 'http://localhost:4000/api';

const categories = ['Salad', 'Rolls', 'Deserts', 'Sandwich', 'Cake', 'Pure Veg', 'Pasta', 'Noodles'];

const AddFood = ({ token }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [preview, setPreview] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: 'Salad'
    });
    const [image, setImage] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        if (!image) {
            setError('Please select an image');
            setLoading(false);
            return;
        }

        const data = new FormData();
        data.append('name', formData.name);
        data.append('description', formData.description);
        data.append('price', formData.price);
        data.append('category', formData.category);
        data.append('image', image);

        try {
            const response = await fetch(`${API_URL}/food/add`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: data
            });

            const result = await response.json();

            if (result.success) {
                setSuccess('Food item added successfully!');
                setFormData({ name: '', description: '', price: '', category: 'Salad' });
                setImage(null);
                setPreview(null);

                setTimeout(() => {
                    navigate('/menu');
                }, 1500);
            } else {
                setError(result.message || 'Failed to add food item');
            }
        } catch (err) {
            setError('Connection error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-food-page">
            <div className="page-header">
                <h1>Add Food Item</h1>
                <p>Add a new item to your menu</p>
            </div>

            <div className="add-food-layout">
                <form onSubmit={handleSubmit} className="add-food-form card">
                    <div className="image-upload">
                        <label htmlFor="image" className="image-upload-label">
                            {preview ? (
                                <img src={preview} alt="Preview" />
                            ) : (
                                <div className="upload-placeholder">
                                    <span>📷</span>
                                    <p>Click to upload image</p>
                                </div>
                            )}
                        </label>
                        <input
                            type="file"
                            id="image"
                            accept="image/*"
                            onChange={handleImageChange}
                            hidden
                        />
                    </div>

                    <div className="input-group">
                        <label>Product Name</label>
                        <input
                            type="text"
                            className="input"
                            placeholder="Enter food name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Description</label>
                        <textarea
                            className="input"
                            placeholder="Describe your food item"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="input-group">
                            <label>Category</label>
                            <select
                                className="input"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            >
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        <div className="input-group">
                            <label>Price ($)</label>
                            <input
                                type="number"
                                className="input"
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    {error && <p className="error-message">{error}</p>}
                    {success && <p className="success-message">{success}</p>}

                    <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                        {loading ? (
                            <span className="loader" style={{ width: 20, height: 20 }}></span>
                        ) : (
                            '➕ Add Food Item'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddFood;
