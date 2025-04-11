const Upload = require('../models/upload');

module.exports = {
    // Create
    async create(req, res) {
        try {
            const filePath = req.file ? `/uploads/${req.file.filename}` : '';
            const upload = new Upload({
                filePath,
                fileType: req.file.mimetype,
                uploadedBy: req.user.id
            });
            await upload.save();
            res.status(201).json(upload);
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server', error });
        }
    },

    // Read (Get all)
    async getAll(req, res) {
        try {
            const uploads = await Upload.find().populate('uploadedBy');
            res.json(uploads);
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server', error });
        }
    },

    // Read (Get by ID)
    async getById(req, res) {
        try {
            const upload = await Upload.findById(req.params.id).populate('uploadedBy');
            if (!upload) return res.status(404).json({ message: 'Không tìm thấy file' });
            res.json(upload);
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server', error });
        }
    },

    // Update
    async update(req, res) {
        try {
            const filePath = req.file ? `/uploads/${req.file.filename}` : req.body.filePath;
            const upload = await Upload.findByIdAndUpdate(
                req.params.id,
                { filePath, fileType: req.file ? req.file.mimetype : req.body.fileType },
                { new: true }
            );
            if (!upload) return res.status(404).json({ message: 'Không tìm thấy file' });
            res.json(upload);
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server', error });
        }
    },

    // Delete
    async delete(req, res) {
        try {
            const upload = await Upload.findByIdAndDelete(req.params.id);
            if (!upload) return res.status(404).json({ message: 'Không tìm thấy file' });
            res.json({ message: 'Xóa file thành công' });
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server', error });
        }
    }
};