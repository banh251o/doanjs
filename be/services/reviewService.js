const Review = require('../models/review');

module.exports = {
    // Read (Get all)
    async getAll(req, res) {
        try {
            const reviews = await Review.find().populate('productId').populate('userId');
            res.json(reviews);
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server', error });
        }
    },

    // Read (Get by ID)
    async getById(req, res) {
        try {
            const review = await Review.findById(req.params.id).populate('productId').populate('userId');
            if (!review) return res.status(404).json({ message: 'Đánh giá không tồn tại' });
            res.json(review);
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server', error });
        }
    },

    // Create
    async create(req, res) {
        try {
            const { productId, rating, comment } = req.body;
            const review = new Review({ productId, userId: req.user.id, rating, comment });
            await review.save();
            res.status(201).json(review);
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server', error });
        }
    },

    // Update
    async update(req, res) {
        try {
            const { rating, comment } = req.body;
            const review = await Review.findByIdAndUpdate(
                req.params.id,
                { rating, comment },
                { new: true }
            );
            if (!review) return res.status(404).json({ message: 'Đánh giá không tồn tại' });
            res.json(review);
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server', error });
        }
    },

    // Delete
    async delete(req, res) {
        try {
            const review = await Review.findByIdAndDelete(req.params.id);
            if (!review) return res.status(404).json({ message: 'Đánh giá không tồn tại' });
            res.json({ message: 'Xóa đánh giá thành công' });
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server', error });
        }
    }
};