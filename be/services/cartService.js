const Cart = require('../models/cart');

module.exports = {
    // Read (Get all)
    async getAll(req, res) {
        try {
            const carts = await Cart.find().populate('userId').populate('products.productId');
            res.json(carts);
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server', error });
        }
    },

    // Read (Get by ID)
    async getById(req, res) {
        try {
            const cart = await Cart.findById(req.params.id).populate('userId').populate('products.productId');
            if (!cart) return res.status(404).json({ message: 'Giỏ hàng không tồn tại' });
            res.json(cart);
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server', error });
        }
    },

    // Create
    async create(req, res) {
        try {
            const { products, total } = req.body;
            const cart = new Cart({ userId: req.user.id, products, total });
            await cart.save();
            res.status(201).json(cart);
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server', error });
        }
    },

    // Update
    async update(req, res) {
        try {
            const { products, total } = req.body;
            const cart = await Cart.findByIdAndUpdate(
                req.params.id,
                { products, total },
                { new: true }
            );
            if (!cart) return res.status(404).json({ message: 'Giỏ hàng không tồn tại' });
            res.json(cart);
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server', error });
        }
    },

    // Delete
    async delete(req, res) {
        try {
            const cart = await Cart.findByIdAndDelete(req.params.id);
            if (!cart) return res.status(404).json({ message: 'Giỏ hàng không tồn tại' });
            res.json({ message: 'Xóa giỏ hàng thành công' });
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server', error });
        }
    }
};