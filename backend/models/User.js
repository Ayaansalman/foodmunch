import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters']
    },
    phone: {
        type: String,
        default: ''
    },
    address: {
        street: { type: String, default: '' },
        city: { type: String, default: '' },
        state: { type: String, default: '' },
        zipCode: { type: String, default: '' }
    },
    role: {
        type: String,
        enum: ['customer', 'admin'],
        default: 'customer'
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    minimize: false
});

// Index for faster email lookups
userSchema.index({ email: 1 });

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
