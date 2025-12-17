import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
    foodId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Food',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity must be at least 1'],
        default: 1
    }
}, { _id: false });

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    items: [cartItemSchema],
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for user cart lookups
cartSchema.index({ userId: 1 });

// Method to calculate cart total
cartSchema.methods.calculateTotal = async function () {
    await this.populate('items.foodId');
    return this.items.reduce((total, item) => {
        return total + (item.foodId.price * item.quantity);
    }, 0);
};

const Cart = mongoose.models.Cart || mongoose.model('Cart', cartSchema);
export default Cart;
