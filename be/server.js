const express = require('express');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const connectDB = require('./db');
const app = express();

// Kết nối MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use('/uploads', express.static('uploads'));

const cors = require('cors');
app.use(cors());

// Cấu hình multer để upload file
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Import services
const authService = require('./services/authService');
const uploadService = require('./services/uploadService');
const productService = require('./services/productService');
const userService = require('./services/userService');
const orderService = require('./services/orderService');
const cartService = require('./services/cartService');
const categoryService = require('./services/categoryService');
const reviewService = require('./services/reviewService');

// Middleware kiểm tra token
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token không hợp lệ' });

    jwt.verify(token, 'secret', (err, user) => {
        if (err) return res.status(403).json({ message: 'Token không hợp lệ' });
        req.user = user;
        next();
    });
};

// Routes cho Auth
app.post('/auth/register', (req, res) => authService.register(req, res));
app.post('/auth/login', (req, res) => authService.login(req, res));
app.get('/auth', authenticateToken, (req, res) => authService.getAll(req, res));
app.get('/auth/:id', authenticateToken, (req, res) => authService.getById(req, res));
app.put('/auth/:id', authenticateToken, (req, res) => authService.update(req, res));
app.delete('/auth/:id', authenticateToken, (req, res) => authService.delete(req, res));

// Routes cho Upload
app.post('/uploads', authenticateToken, upload.single('file'), (req, res) => uploadService.create(req, res));
app.get('/uploads', authenticateToken, (req, res) => uploadService.getAll(req, res));
app.get('/uploads/:id', authenticateToken, (req, res) => uploadService.getById(req, res));
app.put('/uploads/:id', authenticateToken, upload.single('file'), (req, res) => uploadService.update(req, res));
app.delete('/uploads/:id', authenticateToken, (req, res) => uploadService.delete(req, res));

// Routes cho Product
app.get('/products', authenticateToken, (req, res) => productService.getAll(req, res));
app.get('/products/:id', authenticateToken, (req, res) => productService.getById(req, res));
app.post('/products', authenticateToken, upload.single('image'), (req, res) => productService.create(req, res));
app.put('/products/:id', authenticateToken, upload.single('image'), (req, res) => productService.update(req, res));
app.delete('/products/:id', authenticateToken, (req, res) => productService.delete(req, res));

// Routes cho User
app.get('/users', authenticateToken, (req, res) => userService.getAll(req, res));
app.get('/users/:id', authenticateToken, (req, res) => userService.getById(req, res));
app.post('/users', authenticateToken, (req, res) => userService.create(req, res));
app.put('/users/:id', authenticateToken, (req, res) => userService.update(req, res));
app.delete('/users/:id', authenticateToken, (req, res) => userService.delete(req, res));

// Routes cho Order
app.get('/orders', authenticateToken, (req, res) => orderService.getAll(req, res));
app.get('/orders/:id', authenticateToken, (req, res) => orderService.getById(req, res));
app.post('/orders', authenticateToken, (req, res) => orderService.create(req, res));
app.put('/orders/:id', authenticateToken, (req, res) => orderService.update(req, res));
app.delete('/orders/:id', authenticateToken, (req, res) => orderService.delete(req, res));

// Routes cho Cart
app.get('/carts', authenticateToken, (req, res) => cartService.getAll(req, res));
app.get('/carts/:id', authenticateToken, (req, res) => cartService.getById(req, res));
app.post('/carts', authenticateToken, (req, res) => cartService.create(req, res));
app.put('/carts/:id', authenticateToken, (req, res) => cartService.update(req, res));
app.delete('/carts/:id', authenticateToken, (req, res) => cartService.delete(req, res));

// Routes cho Category
app.get('/categories', authenticateToken, (req, res) => categoryService.getAll(req, res));
app.get('/categories/:id', authenticateToken, (req, res) => categoryService.getById(req, res));
app.post('/categories', authenticateToken, (req, res) => categoryService.create(req, res));
app.put('/categories/:id', authenticateToken, (req, res) => categoryService.update(req, res));
app.delete('/categories/:id', authenticateToken, (req, res) => categoryService.delete(req, res));

// Routes cho Review
app.get('/reviews', authenticateToken, (req, res) => reviewService.getAll(req, res));
app.get('/reviews/:id', authenticateToken, (req, res) => reviewService.getById(req, res));
app.post('/reviews', authenticateToken, (req, res) => reviewService.create(req, res));
app.put('/reviews/:id', authenticateToken, (req, res) => reviewService.update(req, res));
app.delete('/reviews/:id', authenticateToken, (req, res) => reviewService.delete(req, res));

// Khởi động server
app.listen(3000, () => console.log('Server chạy tại http://localhost:3000'));