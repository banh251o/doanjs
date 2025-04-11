const Order = require('../models/order');

module.exports = {
    // Read (Get all)
    async getAll(req, res) {
        try {
            const orders = await Order.find().populate('userId').populate('products.productId');
            res.json(orders);
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server', error });
        }
    },

    // Read (Get by ID)
    async getById(req, res) {
        try {
            const order = await Order.findById(req.params.id).populate('userId').populate('products.productId');
            if (!order) return res.status(404).json({ message: 'Đơn hàng không tồn tại' });
            res.json(order);
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server', error });
        }
    },

    // Create
    async create(req, res) {
        try {
            const { products, total, status } = req.body;
            const order = new Order({ userId: req.user.id, products, total, status });
            await order.save();
            res.status(201).json(order);
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server', error });
        }
    },

    // Update
    async update(req, res) {
        try {
            const { products, total, status } = req.body;
            const order = await Order.findByIdAndUpdate(
                req.params.id,
                { products, total, status },
                { new: true }
            );
            if (!order) return res.status(404).json({ message: 'Đơn hàng không tồn tại' });
            res.json(order);
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server', error });
        }
    },

    // Delete
    async delete(req, res) {
        try {
            const order = await Order.findByIdAndDelete(req.params.id);
            if (!order) return res.status(404).json({ message: 'Đơn hàng không tồn tại' });
            res.json({ message: 'Xóa đơn hàng thành công' });
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server', error });
        }
    }
};