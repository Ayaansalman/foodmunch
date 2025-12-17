import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

class AuthService {
    // Generate JWT token
    generateToken(userId) {
        return jwt.sign(
            { id: userId },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
    }

    // Register new user
    async register(userData) {
        const { name, email, password } = userData;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw { status: 400, message: 'User already exists with this email' };
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = new User({
            name,
            email,
            password: hashedPassword
        });

        await user.save();

        // Generate token
        const token = this.generateToken(user._id);

        return {
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        };
    }

    // Login user
    async login(email, password) {
        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            throw { status: 401, message: 'Invalid email or password' };
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw { status: 401, message: 'Invalid email or password' };
        }

        // Check if active
        if (!user.isActive) {
            throw { status: 401, message: 'Account is deactivated' };
        }

        // Generate token
        const token = this.generateToken(user._id);

        return {
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        };
    }

    // Get user profile
    async getProfile(userId) {
        const user = await User.findById(userId).select('-password');
        if (!user) {
            throw { status: 404, message: 'User not found' };
        }
        return user;
    }

    // Update user profile
    async updateProfile(userId, updateData) {
        const user = await User.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            throw { status: 404, message: 'User not found' };
        }

        return user;
    }
}

export default new AuthService();
