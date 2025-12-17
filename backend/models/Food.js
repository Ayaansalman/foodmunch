import mongoose from 'mongoose';

const foodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Food name is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },
    image: {
        type: String,
        required: [true, 'Image is required']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['Salad', 'Rolls', 'Deserts', 'Sandwich', 'Cake', 'Pure Veg', 'Pasta', 'Noodles']
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    preparationTime: {
        type: Number,
        default: 20, // in minutes
        min: 5
    }
}, {
    timestamps: true
});

// Index for category-based queries
foodSchema.index({ category: 1 });
foodSchema.index({ isAvailable: 1 });

const Food = mongoose.models.Food || mongoose.model('Food', foodSchema);
export default Food;
