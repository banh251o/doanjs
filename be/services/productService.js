const Product = require('../models/product');

module.exports = {
    async getAll(req, res) {
        try {
            const { categoryId } = req.query;
            console.log('Category ID from query:', categoryId); // Debug
            const query = categoryId ? { categoryId } : {};
            console.log('Query:', query); // Debug
            const products = await Product.find(query).populate('categoryId');
            console.log('Products found:', products); // Debug
            res.json(products);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách sản phẩm:', error);
            res.status(500).json({ message: 'Lỗi server', error });
        }
    },
    // Read (Get by ID)
    async getById(req, res) {
        try {
            const product = await Product.findById(req.params.id).populate('categoryId');
            if (!product) return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
            res.json(product);
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server', error });
        }
    },

    // Create
    async create(req, res) {
        try {
            const { name, price, categoryId } = req.body;
            const image = req.file ? `/uploads/${req.file.filename}` : '';
            const product = new Product({ name, price, image, categoryId });
            await product.save();
            res.status(201).json(product);
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server', error });
        }
    },

    // Update
    async update(req, res) {
        try {
            const { name, price, categoryId } = req.body;
            const image = req.file ? `/uploads/${req.file.filename}` : req.body.image;
            const product = await Product.findByIdAndUpdate(
                req.params.id,
                { name, price, image, categoryId },
                { new: true }
            );
            if (!product) return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
            res.json(product);
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server', error });
        }
    },

    // Delete
    async delete(req, res) {
        try {
            const product = await Product.findByIdAndDelete(req.params.id);
            if (!product) return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
            res.json({ message: 'Xóa sản phẩm thành công' });
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server', error });
        }
    }
};