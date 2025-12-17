// Script to update food images with real URLs
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const foodSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    image: String,
    category: String,
    isAvailable: { type: Boolean, default: true }
}, { timestamps: true });

const Food = mongoose.model('Food', foodSchema);

// Real food image URLs from Unsplash (free to use)
const imageUpdates = {
    "Greek Salad": "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400",
    "Caesar Salad": "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400",
    "Chicken Wrap": "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400",
    "Veggie Roll": "https://images.unsplash.com/photo-1569058242567-93de6f36f8e6?w=400",
    "Chocolate Cake": "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400",
    "Cheesecake": "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400",
    "Club Sandwich": "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400",
    "Spaghetti Carbonara": "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400",
    "Pad Thai": "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400",
    "Veggie Burger": "https://images.unsplash.com/photo-1520072959219-c595dc870360?w=400"
};

async function updateImages() {
    try {
        console.log('🔗 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected!\n');

        for (const [name, imageUrl] of Object.entries(imageUpdates)) {
            const result = await Food.findOneAndUpdate(
                { name },
                { image: imageUrl },
                { new: true }
            );

            if (result) {
                console.log(`✅ Updated: ${name}`);
            } else {
                console.log(`⚠️  Not found: ${name}`);
            }
        }

        console.log('\n🎉 All images updated!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

updateImages();
