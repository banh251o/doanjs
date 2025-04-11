const Category = require('../models/category');

module.exports = {
    // Read (Get all)
    async getAll(req, res) {
        try {
            const categories = await Category.find();
            res.json(categories);
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server', error });
        }
    },

    // Read (Get by ID)
    async getById(req, res) {
        try {
            const category = await Category.findById(req.params.id);
            if (!category) return res.status(404).json({ message: 'Danh mục không tồn tại' });
            res.json(category);
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server', error });
        }
    },

    // Create
    async create(req, res) {
        try {
            const { name, description } = req.body;
            const category = new Category({ name, description });
            await category.save();
            res.status(201).json(category);
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server', error });
        }
    },

    // Update
    async update(req, res) {
        try {
            const { name, description } = req.body;
            const category = await Category.findByIdAndUpdate(
                req.params.id,
                { name, description },
                { new: true }
            );
            if (!category) return res.status(404).json({ message: 'Danh mục không tồn tại' });
            res.json(category);
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server', error });
        }
    },

    // Delete
    async delete(req, res) {
        try {
            const category = await Category.findByIdAndDelete(req.params.id);
            if (!category) return res.status(404).json({ message: 'Danh mục không tồn tại' });
            res.json({ message: 'Xóa danh mục thành công' });
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server', error });
        }
    }
};