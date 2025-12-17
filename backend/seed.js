// Seed script to create admin user and sample food items
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

// Models
const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, default: 'customer' },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

const foodSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    image: String,
    category: String,
    isAvailable: { type: Boolean, default: true }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
const Food = mongoose.model('Food', foodSchema);

// Sample food items
const sampleFoods = [
    {
        name: "Greek Salad",
        description: "Fresh salad with crisp vegetables, feta cheese, olives, and tangy Greek dressing.",
        price: 12.99,
        image: "greek_salad.jpg",
        category: "Salad"
    },
    {
        name: "Caesar Salad",
        description: "Classic Caesar with romaine lettuce, parmesan, croutons, and creamy dressing.",
        price: 11.99,
        image: "caesar_salad.jpg",
        category: "Salad"
    },
    {
        name: "Chicken Wrap",
        description: "Grilled chicken with fresh vegetables wrapped in a soft tortilla.",
        price: 9.99,
        image: "chicken_wrap.jpg",
        category: "Rolls"
    },
    {
        name: "Veggie Roll",
        description: "Crispy spring roll filled with mixed vegetables and herbs.",
        price: 7.99,
        image: "veggie_roll.jpg",
        category: "Rolls"
    },
    {
        name: "Chocolate Cake",
        description: "Rich, moist chocolate cake with chocolate ganache frosting.",
        price: 8.99,
        image: "chocolate_cake.jpg",
        category: "Cake"
    },
    {
        name: "Cheesecake",
        description: "Creamy New York style cheesecake with graham cracker crust.",
        price: 7.99,
        image: "cheesecake.jpg",
        category: "Deserts"
    },
    {
        name: "Club Sandwich",
        description: "Triple-decker sandwich with turkey, bacon, lettuce, and tomato.",
        price: 13.99,
        image: "club_sandwich.jpg",
        category: "Sandwich"
    },
    {
        name: "Spaghetti Carbonara",
        description: "Classic Italian pasta with creamy egg sauce, pancetta, and parmesan.",
        price: 14.99,
        image: "carbonara.jpg",
        category: "Pasta"
    },
    {
        name: "Pad Thai",
        description: "Stir-fried rice noodles with shrimp, peanuts, lime, and sweet tamarind sauce.",
        price: 13.99,
        image: "pad_thai.jpg",
        category: "Noodles"
    },
    {
        name: "Veggie Burger",
        description: "Plant-based patty with fresh vegetables and special sauce.",
        price: 11.99,
        image: "veggie_burger.jpg",
        category: "Pure Veg"
    }
];

async function seed() {
    try {
        console.log('🌱 Starting seed...');

        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Create admin user
        const adminPassword = await bcrypt.hash('admin123', 10);
        const admin = await User.findOneAndUpdate(
            { email: 'admin@fooddel.com' },
            {
                name: 'Admin User',
                email: 'admin@fooddel.com',
                password: adminPassword,
                role: 'admin',
                isActive: true
            },
            { upsert: true, new: true }
        );
        console.log('✅ Admin user created/updated:', admin.email);

        // Create sample foods (only if collection is empty)
        const existingFoods = await Food.countDocuments();
        if (existingFoods === 0) {
            await Food.insertMany(sampleFoods);
            console.log('✅ Sample food items created:', sampleFoods.length);
        } else {
            console.log('ℹ️  Food items already exist, skipping...');
        }

        console.log('');
        console.log('🎉 Seed completed successfully!');
        console.log('');
        console.log('📧 Admin Login:');
        console.log('   Email: admin@fooddel.com');
        console.log('   Password: admin123');
        console.log('');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seed error:', error);
        process.exit(1);
    }
}

seed();
