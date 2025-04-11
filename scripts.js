let token = localStorage.getItem('token');
let role = localStorage.getItem('role') || 'user';
let cart = JSON.parse(localStorage.getItem('cart')) || [];
const API_URL = 'http://localhost:3000';

// Kiểm tra trạng thái đăng nhập
if (token) {
    document.getElementById('login-link').style.display = 'none';
    document.getElementById('register-link').style.display = 'none';
    document.getElementById('logout-link').style.display = 'inline';
    if (role === 'admin') {
        document.getElementById('manage-product-form').style.display = 'block';
    }
}

// Thêm hàm loadCategories() để tải danh mục
async function loadCategories() {
    try {
        const response = await fetch(`${API_URL}/categories`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
            console.error('Lỗi khi tải danh mục:', response.status);
            return;
        }

        const categories = await response.json();
        const categoryFilter = document.getElementById('category-filter');
        categoryFilter.innerHTML = '<option value="">Tất cả danh mục</option>'; // Reset dropdown
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category._id;
            option.textContent = category.name;
            categoryFilter.appendChild(option);
        });
    } catch (error) {
        console.error('Lỗi khi tải danh mục:', error);
    }
}

// Thêm hàm filterProducts() để lọc sản phẩm theo danh mục
async function filterProducts() {
    const categoryId = document.getElementById('category-filter').value;
    console.log('Category ID:', categoryId);
    const productList = document.getElementById('product-list');
    if (!productList) {
        console.error('Phần tử product-list không tồn tại trong HTML');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/products${categoryId ? `?categoryId=${categoryId}` : ''}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
            productList.innerHTML = '<p>Lỗi khi lọc sản phẩm.</p>';
            return;
        }

        const products = await response.json();
        productList.innerHTML = '';
        if (products.length === 0) {
            productList.innerHTML = '<p>Không có sản phẩm trong danh mục này.</p>';
            return;
        }
        products.forEach(product => {
            const div = document.createElement('div');
            div.className = 'product-card';
            div.innerHTML = `
                <img src="${API_URL}${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>${product.price.toLocaleString()} VNĐ</p>
                <button onclick="addToCart('${product._id}', '${product.name}', ${product.price}, '${API_URL}${product.image}')">Thêm vào giỏ</button>
                ${role === 'admin' ? `
                    <button onclick="editProduct('${product._id}', '${product.name}', ${product.price}, '${product.categoryId || ''}')">Sửa</button>
                    <button class="delete-btn" onclick="deleteProduct('${product._id}')">Xóa</button>
                ` : ''}
            `;
            productList.appendChild(div);
        });
    } catch (error) {
        console.error('Lỗi khi lọc sản phẩm:', error);
        productList.innerHTML = '<p>Lỗi khi lọc sản phẩm.</p>';
    }
}

// Xem chi tiết sản phẩm
async function viewProduct(id) {
    try {
        const response = await fetch(`${API_URL}/products/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
            alert('Lỗi khi tải chi tiết sản phẩm.');
            return;
        }

        const product = await response.json();
        document.getElementById('products-section').style.display = 'none';
        document.getElementById('cart-section').style.display = 'none';
        document.getElementById('product-detail-section').style.display = 'block';

        const detail = document.getElementById('product-detail');
        detail.innerHTML = `
            <img src="${product.image}" alt="${product.name}" style="max-width: 300px;">
            <h3>${product.name}</h3>
            <p>Giá: ${product.price.toLocaleString()} VNĐ</p>
            <button onclick="addToCart('${product._id}', '${product.name}', ${product.price}, '${product.image}')">Thêm vào giỏ</button>
        `;
    } catch (error) {
        console.error('Lỗi khi xem chi tiết sản phẩm:', error);
        alert('Lỗi khi xem chi tiết sản phẩm.');
    }
}

// Quay lại danh sách sản phẩm
function backToProducts() {
    document.getElementById('products-section').style.display = 'block';
    document.getElementById('cart-section').style.display = 'block';
    document.getElementById('product-detail-section').style.display = 'none';
}



// Đăng xuất
document.getElementById('logout-link').onclick = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('cart');
    location.reload();
};

// Hiển thị form đăng nhập/đăng ký
document.getElementById('login-link').onclick = () => {
    document.getElementById('auth-section').style.display = 'block';
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('register-form').style.display = 'none';
};

document.getElementById('register-link').onclick = () => {
    document.getElementById('auth-section').style.display = 'block';
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'block';
};

// Xử lý đăng ký
document.getElementById('register').onsubmit = async (e) => {
    e.preventDefault();
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        if (response.ok) {
            alert('Đăng ký thành công! Vui lòng đăng nhập.');
            document.getElementById('login-form').style.display = 'block';
            document.getElementById('register-form').style.display = 'none';
        } else {
            alert(data.message || 'Đăng ký thất bại!');
        }
    } catch (error) {
        console.error('Lỗi khi đăng ký:', error);
        alert('Lỗi khi đăng ký. Vui lòng kiểm tra kết nối.');
    }
};

// Xử lý đăng nhập
document.getElementById('login').onsubmit = async (e) => {
    e.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        if (response.ok) {
            token = data.token;
            localStorage.setItem('token', token);
            const userRole = data.role || 'user';
            localStorage.setItem('role', userRole);
            role = userRole;
            alert('Đăng nhập thành công!');
            location.reload();
        } else {
            alert(data.message || 'Đăng nhập thất bại!');
        }
    } catch (error) {
        console.error('Lỗi khi đăng nhập:', error);
        alert('Lỗi khi đăng nhập. Vui lòng kiểm tra kết nối.');
    }
};

// Tải danh sách sản phẩm
async function loadProducts() {
    try {
        const response = await fetch(`${API_URL}/products`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const productList = document.getElementById('product-list');
        if (!productList) {
            console.error('Phần tử product-list không tồn tại trong HTML');
            return;
        }

        if (!response.ok) {
            if (response.status === 401) {
                productList.innerHTML = '<p>Vui lòng đăng nhập để xem sản phẩm.</p>';
            } else {
                productList.innerHTML = '<p>Lỗi khi tải sản phẩm. Vui lòng thử lại sau.</p>';
            }
            return;
        }
        const products = await response.json();
        productList.innerHTML = '';
        if (products.length === 0) {
            productList.innerHTML = '<p>Chưa có sản phẩm nào.</p>';
            return;
        }
        products.forEach(product => {
            const div = document.createElement('div');
            div.className = 'product-card';
            div.innerHTML = `
                <img src="${API_URL}${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>${product.price.toLocaleString()} VNĐ</p>
                <button onclick="addToCart('${product._id}', '${product.name}', ${product.price}, '${API_URL}${product.image}')">Thêm vào giỏ</button>
                ${role === 'admin' ? `
                    <button onclick="editProduct('${product._id}', '${product.name}', ${product.price}, '${product.categoryId || ''}')">Sửa</button>
                    <button class="delete-btn" onclick="deleteProduct('${product._id}')">Xóa</button>
                ` : ''}
            `;
            productList.appendChild(div);
        });
    } catch (error) {
        console.error('Lỗi khi tải sản phẩm:', error);
        const productList = document.getElementById('product-list');
        if (productList) {
            productList.innerHTML = '<p>Lỗi khi tải sản phẩm. Vui lòng kiểm tra kết nối.</p>'; // Dòng 238
        } else {
            console.error('Phần tử product-list không tồn tại trong HTML');
        }
    }
}

// Sửa sản phẩm
function editProduct(id, name, price, categoryId) {
    document.getElementById('product-id').value = id;
    document.getElementById('product-name').value = name;
    document.getElementById('product-price').value = price;
    document.getElementById('product-category').value = categoryId;
    document.getElementById('product-form').querySelector('button').textContent = 'Cập nhật sản phẩm';
}

// Xóa sản phẩm
async function deleteProduct(id) {
    if (!confirm('Bạn có chắc muốn xóa sản phẩm này?')) return;

    try {
        const response = await fetch(`${API_URL}/products/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            alert('Xóa sản phẩm thành công!');
            loadProducts();
        } else {
            alert('Xóa sản phẩm thất bại!');
        }
    } catch (error) {
        console.error('Lỗi khi xóa sản phẩm:', error);
        alert('Lỗi khi xóa sản phẩm. Vui lòng kiểm tra kết nối.');
    }
}

// Thêm/sửa sản phẩm
document.getElementById('product-form').onsubmit = async (e) => {
    e.preventDefault();
    const id = document.getElementById('product-id').value;
    const name = document.getElementById('product-name').value;
    const price = parseFloat(document.getElementById('product-price').value);
    const categoryId = document.getElementById('product-category').value;
    const image = document.getElementById('product-image').files[0];

    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    if (categoryId) formData.append('categoryId', categoryId);
    if (image) formData.append('image', image);

    try {
        const url = id ? `${API_URL}/products/${id}` : `${API_URL}/products`;
        const method = id ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        });

        if (response.ok) {
            alert(id ? 'Cập nhật sản phẩm thành công!' : 'Thêm sản phẩm thành công!');
            document.getElementById('product-form').reset();
            document.getElementById('product-id').value = '';
            document.getElementById('product-form').querySelector('button').textContent = 'Thêm/Sửa sản phẩm';
            loadProducts();
        } else {
            alert(id ? 'Cập nhật sản phẩm thất bại!' : 'Thêm sản phẩm thất bại!');
        }
    } catch (error) {
        console.error('Lỗi khi thêm/sửa sản phẩm:', error);
        alert('Lỗi khi thêm/sửa sản phẩm. Vui lòng kiểm tra kết nối.');
    }
};

// Thêm sản phẩm vào giỏ hàng
function addToCart(id, name, price, image) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        // Đảm bảo image bao gồm domain
        const fullImageUrl = image.startsWith('http') ? image : `${API_URL}${image}`;
        cart.push({ id, name, price, image: fullImageUrl, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
}

// Tải giỏ hàng
function loadCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartList = document.getElementById('cart-list');
    if (!cartList) {
        console.error('Phần tử cart-list không tồn tại trong HTML');
        return;
    }

    cartList.innerHTML = '';
    if (cart.length === 0) {
        cartList.innerHTML = '<p>Giỏ hàng trống.</p>';
        return;
    }
    cart.forEach(item => {
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <img src="${item.image}" alt="${item.name}" style="width: 50px; height: auto;">
            <span>${item.name} - ${item.price.toLocaleString()} VNĐ x ${item.quantity}</span>
        `;
        cartList.appendChild(div);
    });
    document.getElementById('checkout-btn').style.display = cart.length > 0 ? 'block' : 'none';
}

// Xóa sản phẩm khỏi giỏ hàng
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
}

// Xử lý thanh toán
document.getElementById('checkout-btn').onclick = async () => {
    if (!token) {
        alert('Vui lòng đăng nhập để thanh toán!');
        return;
    }

    try {
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const products = cart.map(item => ({ productId: item.id, quantity: item.quantity }));

        const response = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ products, total, status: 'pending' })
        });

        if (response.ok) {
            alert('Đặt hàng thành công!');
            cart = [];
            localStorage.setItem('cart', JSON.stringify(cart));
            loadCart();
        } else {
            alert('Đặt hàng thất bại!');
        }
    } catch (error) {
        console.error('Lỗi khi thanh toán:', error);
        alert('Lỗi khi thanh toán. Vui lòng kiểm tra kết nối.');
    }
};

// Tải dữ liệu khi trang được tải
if (token) {
    loadProducts();
    loadCategories(); // Gọi hàm loadCategories() để tải danh mục
    loadCart();
} else {
    document.getElementById('product-list').innerHTML = '<p>Vui lòng đăng nhập để xem sản phẩm.</p>';
    document.getElementById('cart-list').innerHTML = '<p>Giỏ hàng trống.</p>';
}