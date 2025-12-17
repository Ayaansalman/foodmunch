import Cart from '../models/Cart.js';
import Food from '../models/Food.js';

class CartService {
    // Get user's cart
    async getCart(userId) {
        let cart = await Cart.findOne({ userId }).populate('items.foodId');

        if (!cart) {
            cart = new Cart({ userId, items: [] });
            await cart.save();
        }

        // Calculate totals
        const items = cart.items.filter(item => item.foodId); // Filter out deleted items
        const subtotal = items.reduce((total, item) => {
            return total + (item.foodId.price * item.quantity);
        }, 0);

        return {
            items: items.map(item => ({
                foodId: item.foodId._id,
                name: item.foodId.name,
                price: item.foodId.price,
                image: item.foodId.image,
                quantity: item.quantity,
                total: item.foodId.price * item.quantity
            })),
            subtotal,
            deliveryFee: items.length > 0 ? 2 : 0,
            total: items.length > 0 ? subtotal + 2 : 0
        };
    }

    // Add item to cart
    async addToCart(userId, foodId) {
        // Verify food exists
        const food = await Food.findById(foodId);
        if (!food) {
            throw { status: 404, message: 'Food item not found' };
        }

        if (!food.isAvailable) {
            throw { status: 400, message: 'Food item is not available' };
        }

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        // Check if item already in cart
        const existingItem = cart.items.find(
            item => item.foodId.toString() === foodId
        );

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.items.push({ foodId, quantity: 1 });
        }

        await cart.save();
        return this.getCart(userId);
    }

    // Remove item from cart (decrease quantity)
    async removeFromCart(userId, foodId) {
        const cart = await Cart.findOne({ userId });

        if (!cart) {
            throw { status: 404, message: 'Cart not found' };
        }

        const itemIndex = cart.items.findIndex(
            item => item.foodId.toString() === foodId
        );

        if (itemIndex === -1) {
            throw { status: 404, message: 'Item not in cart' };
        }

        if (cart.items[itemIndex].quantity > 1) {
            cart.items[itemIndex].quantity -= 1;
        } else {
            cart.items.splice(itemIndex, 1);
        }

        await cart.save();
        return this.getCart(userId);
    }

    // Update item quantity
    async updateQuantity(userId, foodId, quantity) {
        const cart = await Cart.findOne({ userId });

        if (!cart) {
            throw { status: 404, message: 'Cart not found' };
        }

        const item = cart.items.find(
            item => item.foodId.toString() === foodId
        );

        if (!item) {
            throw { status: 404, message: 'Item not in cart' };
        }

        if (quantity <= 0) {
            cart.items = cart.items.filter(
                item => item.foodId.toString() !== foodId
            );
        } else {
            item.quantity = quantity;
        }

        await cart.save();
        return this.getCart(userId);
    }

    // Delete item from cart completely
    async deleteFromCart(userId, foodId) {
        const cart = await Cart.findOne({ userId });

        if (!cart) {
            throw { status: 404, message: 'Cart not found' };
        }

        cart.items = cart.items.filter(
            item => item.foodId.toString() !== foodId
        );

        await cart.save();
        return this.getCart(userId);
    }

    // Clear cart
    async clearCart(userId) {
        await Cart.findOneAndUpdate(
            { userId },
            { items: [] }
        );
        return { items: [], subtotal: 0, deliveryFee: 0, total: 0 };
    }
}

export default new CartService();
