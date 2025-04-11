const User = require('../models/user');

module.exports = {
    // Read (Get all)
    async getAll(req, res) {
        try {
            const users = await User.find();
            res.json(users);
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server', error });
        }
    },

    // Read (Get by ID)
    async getById(req, res) {
        try {
            const user = await User.findById(req.params.id);
            if (!user) return res.status(404).json({ message: 'Người dùng không tồn tại' });
            res.json(user);
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server', error });
        }
    },

    // Create
    async create(req, res) {
        try {
            const { username, password, email, role } = req.body;
            const user = new User({ username, password, email, role });
            await user.save();
            res.status(201).json(user);
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server', error });
        }
    },

    // Update
    async update(req, res) {
        try {
            const { username, email, role } = req.body;
            const user = await User.findByIdAndUpdate(
                req.params.id,
                { username, email, role },
                { new: true }
            );
            if (!user) return res.status(404).json({ message: 'Người dùng không tồn tại' });
            res.json(user);
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server', error });
        }
    },

    // Delete
    async delete(req, res) {
        try {
            const user = await User.findByIdAndDelete(req.params.id);
            if (!user) return res.status(404).json({ message: 'Người dùng không tồn tại' });
            res.json({ message: 'Xóa người dùng thành công' });
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server', error });
        }
    }
};