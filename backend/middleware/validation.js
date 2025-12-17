import Joi from 'joi';

// Validation schemas
export const schemas = {
    register: Joi.object({
        name: Joi.string().min(2).max(50).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required()
    }),

    login: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    }),

    food: Joi.object({
        name: Joi.string().min(2).max(100).required(),
        description: Joi.string().min(10).max(500).required(),
        price: Joi.number().min(0).required(),
        category: Joi.string().valid('Salad', 'Rolls', 'Deserts', 'Sandwich', 'Cake', 'Pure Veg', 'Pasta', 'Noodles').required()
    }),

    cartItem: Joi.object({
        foodId: Joi.string().required()
    }),

    order: Joi.object({
        items: Joi.array().min(1).required(),
        deliveryAddress: Joi.object({
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
            email: Joi.string().email().required(),
            street: Joi.string().required(),
            city: Joi.string().required(),
            state: Joi.string().required(),
            zipCode: Joi.string().required(),
            phone: Joi.string().required()
        }).required()
    }),

    updateOrderStatus: Joi.object({
        status: Joi.string().valid('pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled').required()
    })
};

// Validation middleware factory
export const validate = (schemaName) => {
    return (req, res, next) => {
        const schema = schemas[schemaName];
        if (!schema) {
            return next();
        }

        const { error } = schema.validate(req.body, { abortEarly: false });

        if (error) {
            const errors = error.details.map(detail => detail.message);
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors
            });
        }

        next();
    };
};
