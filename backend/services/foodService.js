import Food from '../models/Food.js';
import fs from 'fs';
import path from 'path';

class FoodService {
    // Get all food items
    async getAllFood(filters = {}) {
        const query = { isAvailable: true };

        if (filters.category && filters.category !== 'All') {
            query.category = filters.category;
        }

        const foods = await Food.find(query).sort({ createdAt: -1 });
        return foods;
    }

    // Get food by ID
    async getFoodById(foodId) {
        const food = await Food.findById(foodId);
        if (!food) {
            throw { status: 404, message: 'Food item not found' };
        }
        return food;
    }

    // Get food by category
    async getFoodByCategory(category) {
        const foods = await Food.find({
            category,
            isAvailable: true
        }).sort({ createdAt: -1 });
        return foods;
    }

    // Add new food item (admin)
    async addFood(foodData, imageFile) {
        if (!imageFile) {
            throw { status: 400, message: 'Image is required' };
        }

        const food = new Food({
            name: foodData.name,
            description: foodData.description,
            price: Number(foodData.price),
            category: foodData.category,
            image: imageFile.filename,
            preparationTime: foodData.preparationTime || 20
        });

        await food.save();
        return food;
    }

    // Update food item (admin)
    async updateFood(foodId, updateData, imageFile) {
        const food = await Food.findById(foodId);
        if (!food) {
            throw { status: 404, message: 'Food item not found' };
        }

        // If new image, delete old one
        if (imageFile) {
            const oldImagePath = path.join('uploads', food.image);
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
            updateData.image = imageFile.filename;
        }

        const updatedFood = await Food.findByIdAndUpdate(
            foodId,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        return updatedFood;
    }

    // Delete food item (admin)
    async deleteFood(foodId) {
        const food = await Food.findById(foodId);
        if (!food) {
            throw { status: 404, message: 'Food item not found' };
        }

        // Delete image file
        const imagePath = path.join('uploads', food.image);
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

        await Food.findByIdAndDelete(foodId);
        return { message: 'Food item deleted successfully' };
    }

    // Toggle availability (admin)
    async toggleAvailability(foodId) {
        const food = await Food.findById(foodId);
        if (!food) {
            throw { status: 404, message: 'Food item not found' };
        }

        food.isAvailable = !food.isAvailable;
        await food.save();
        return food;
    }

    // Get categories
    getCategories() {
        return ['All', 'Salad', 'Rolls', 'Deserts', 'Sandwich', 'Cake', 'Pure Veg', 'Pasta', 'Noodles'];
    }
}

export default new FoodService();
