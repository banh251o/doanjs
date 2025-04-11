const Auth = require('../models/auth');
const jwt = require('jsonwebtoken');

module.exports = {
    async register(req, res) {
        const { username, password } = req.body;
        try {
            const existingUser = await Auth.findOne({ username });
            if (existingUser) {
                return res.status(400).json({ message: 'Tên đăng nhập đã tồn tại' });
            }
            const user = new Auth({ username, password });
            await user.save();
            res.status(201).json({ message: 'Đăng ký thành công' });
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server', error });
        }
    },

    async login(req, res) {
        const { username, password } = req.body;
        try {
            const user = await Auth.findOne({ username, password });
            if (!user) {
                return res.status(401).json({ message: 'Tên đăng nhập hoặc mật khẩu không đúng' });
            }
            // Bỏ tùy chọn expiresIn để token không hết hạn
            const token = jwt.sign({ username: user.username, id: user._id }, 'secret');
            res.json({ token, role: user.role });
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server', error });
        }
    },

    async getAll(req, res) {
        try {
            const users = await Auth.find();
            res.json(users);
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server', error });
        }
    },

    async getById(req, res) {
        try {
            const user = await Auth.findById(req.params.id);
            if (!user) return res.status(404).json({ message: 'Người dùng không tồn tại' });
            res.json(user);
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server', error });
        }
    },

    async update(req, res) {
        try {
            const { username, password, role } = req.body;
            const user = await Auth.findByIdAndUpdate(
                req.params.id,
                { username, password, role },
                { new: true }
            );
            if (!user) return res.status(404).json({ message: 'Người dùng không tồn tại' });
            res.json(user);
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server', error });
        }
    },

    async delete(req, res) {
        try {
            const user = await Auth.findByIdAndDelete(req.params.id);
            if (!user) return res.status(404).json({ message: 'Người dùng không tồn tại' });
            res.json({ message: 'Xóa người dùng thành công' });
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server', error });
        }
    }
};