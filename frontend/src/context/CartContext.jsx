import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const { token, isAuthenticated } = useAuth();
    const [cart, setCart] = useState({ items: [], subtotal: 0, deliveryFee: 0, total: 0 });
    const [loading, setLoading] = useState(false);

    // Fetch cart when authenticated
    const fetchCart = useCallback(async () => {
        if (!isAuthenticated) {
            setCart({ items: [], subtotal: 0, deliveryFee: 0, total: 0 });
            return;
        }

        try {
            setLoading(true);
            const response = await api.get('/cart');
            if (response.data.success) {
                setCart(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching cart:', error);
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const addToCart = async (foodId) => {
        if (!isAuthenticated) {
            return { success: false, message: 'Please login to add items to cart' };
        }

        try {
            const response = await api.post('/cart/add', { foodId });
            if (response.data.success) {
                setCart(response.data.data);
                return { success: true };
            }
            return { success: false, message: response.data.message };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Error adding to cart' };
        }
    };

    const removeFromCart = async (foodId) => {
        try {
            const response = await api.post('/cart/remove', { foodId });
            if (response.data.success) {
                setCart(response.data.data);
                return { success: true };
            }
            return { success: false, message: response.data.message };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Error removing from cart' };
        }
    };

    const updateQuantity = async (foodId, quantity) => {
        try {
            const response = await api.put('/cart/update', { foodId, quantity });
            if (response.data.success) {
                setCart(response.data.data);
                return { success: true };
            }
            return { success: false, message: response.data.message };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Error updating cart' };
        }
    };

    const deleteFromCart = async (foodId) => {
        try {
            const response = await api.delete(`/cart/${foodId}`);
            if (response.data.success) {
                setCart(response.data.data);
                return { success: true };
            }
            return { success: false, message: response.data.message };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Error deleting from cart' };
        }
    };

    const clearCart = async () => {
        try {
            const response = await api.delete('/cart');
            if (response.data.success) {
                setCart(response.data.data);
                return { success: true };
            }
            return { success: false, message: response.data.message };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Error clearing cart' };
        }
    };

    const getItemQuantity = (foodId) => {
        const item = cart.items.find(item => item.foodId === foodId);
        return item ? item.quantity : 0;
    };

    const value = {
        cart,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        deleteFromCart,
        clearCart,
        getItemQuantity,
        refreshCart: fetchCart,
        itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0)
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
