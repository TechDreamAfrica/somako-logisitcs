// Seller Dashboard JavaScript

// Sample seller products data
const sellerProducts = [
    {
        id: 1,
        name: "iPhone 14 Pro Max",
        category: "electronics",
        price: 8500,
        originalPrice: 9000,
        stock: 15,
        sales: 24,
        status: "active",
        image: "📱",
        sku: "IP14PM-256-BLK"
    },
    {
        id: 2,
        name: "MacBook Pro 16\"",
        category: "electronics", 
        price: 12000,
        stock: 8,
        sales: 12,
        status: "active",
        image: "💻",
        sku: "MBP16-512-SLV"
    },
    {
        id: 3,
        name: "Samsung 4K Smart TV",
        category: "electronics",
        price: 3200,
        originalPrice: 3800,
        stock: 5,
        sales: 18,
        status: "active",
        image: "📺",
        sku: "SAM55-4K-HDR"
    },
    {
        id: 4,
        name: "Sony Headphones",
        category: "electronics",
        price: 850,
        stock: 0,
        sales: 31,
        status: "out_of_stock",
        image: "🎧",
        sku: "SON-WH1000-BLK"
    },
    {
        id: 5,
        name: "Gaming Keyboard",
        category: "electronics",
        price: 320,
        stock: 25,
        sales: 8,
        status: "active",
        image: "⌨️",
        sku: "GAM-KB-RGB"
    }
];

// Sample orders data
const sellerOrders = [
    {
        id: "ORD-2025-001",
        customer: "John Mensah",
        products: "iPhone 14 Pro Max, Headphones",
        total: 9350,
        date: "2025-01-05",
        status: "processing"
    },
    {
        id: "ORD-2025-002", 
        customer: "Mary Asante",
        products: "MacBook Pro 16\"",
        total: 12000,
        date: "2025-01-04",
        status: "shipped"
    },
    {
        id: "ORD-2025-003",
        customer: "Kwame Osei",
        products: "Samsung TV, Gaming Keyboard",
        total: 3520,
        date: "2025-01-04",
        status: "delivered"
    },
    {
        id: "ORD-2025-004",
        customer: "Grace Owusu",
        products: "Sony Headphones",
        total: 850,
        date: "2025-01-03",
        status: "pending"
    }
];

// DOM elements
const productsTableBody = document.getElementById('productsTableBody');
const ordersTableBody = document.getElementById('ordersTableBody');
const addProductBtn = document.getElementById('addProductBtn');
const addProductModal = document.getElementById('addProductModal');
const addProductForm = document.getElementById('addProductForm');
const productSearch = document.getElementById('productSearch');
const categoryFilter = document.getElementById('categoryFilter');
const orderStatusFilter = document.getElementById('orderStatusFilter');

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    renderProducts();
    renderOrders();
    initEventListeners();
    updateDashboardStats();
});

// Render products table
function renderProducts(filter = '', category = '') {
    let filteredProducts = sellerProducts;

    // Apply search filter
    if (filter) {
        filteredProducts = filteredProducts.filter(product =>
            product.name.toLowerCase().includes(filter.toLowerCase()) ||
            product.sku.toLowerCase().includes(filter.toLowerCase())
        );
    }

    // Apply category filter
    if (category) {
        filteredProducts = filteredProducts.filter(product => product.category === category);
    }

    if (productsTableBody) {
        productsTableBody.innerHTML = filteredProducts.map(product => `
            <tr>
                <td>
                    <div class="product-cell">
                        <span class="product-image">${product.image}</span>
                        <div class="product-info">
                            <strong>${product.name}</strong>
                            <small>SKU: ${product.sku}</small>
                        </div>
                    </div>
                </td>
                <td><span class="category-badge">${product.category}</span></td>
                <td>
                    <div class="price-cell">
                        <strong>GHS ${product.price.toLocaleString()}</strong>
                        ${product.originalPrice ? `<small class="original-price">GHS ${product.originalPrice.toLocaleString()}</small>` : ''}
                    </div>
                </td>
                <td>
                    <span class="stock-badge ${product.stock === 0 ? 'out-of-stock' : product.stock < 10 ? 'low-stock' : 'in-stock'}">
                        ${product.stock} units
                    </span>
                </td>
                <td>${product.sales} sold</td>
                <td>
                    <span class="status-badge ${product.status}">
                        ${product.status.replace('_', ' ').toUpperCase()}
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-icon" onclick="editProduct(${product.id})" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon" onclick="viewProduct(${product.id})" title="View">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-icon delete" onclick="deleteProduct(${product.id})" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }
}

// Render orders table
function renderOrders(statusFilter = '') {
    let filteredOrders = sellerOrders;

    // Apply status filter
    if (statusFilter) {
        filteredOrders = filteredOrders.filter(order => order.status === statusFilter);
    }

    if (ordersTableBody) {
        ordersTableBody.innerHTML = filteredOrders.map(order => `
            <tr>
                <td><strong>${order.id}</strong></td>
                <td>${order.customer}</td>
                <td>${order.products}</td>
                <td><strong>GHS ${order.total.toLocaleString()}</strong></td>
                <td>${new Date(order.date).toLocaleDateString()}</td>
                <td>
                    <span class="status-badge ${order.status}">
                        ${order.status.toUpperCase()}
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-icon" onclick="viewOrder('${order.id}')" title="View Details">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-icon" onclick="updateOrderStatus('${order.id}')" title="Update Status">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon" onclick="printOrder('${order.id}')" title="Print">
                            <i class="fas fa-print"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }
}

// Update dashboard statistics
function updateDashboardStats() {
    // Calculate real-time stats from data
    const totalProducts = sellerProducts.length;
    const totalOrders = sellerOrders.length;
    const totalRevenue = sellerOrders.reduce((sum, order) => sum + order.total, 0);
    const averageRating = 4.8; // This would come from customer reviews

    // Update the stats display
    document.querySelector('.stats-grid .stat-card:nth-child(1) h3').textContent = totalProducts;
    document.querySelector('.stats-grid .stat-card:nth-child(2) h3').textContent = totalOrders;
    document.querySelector('.stats-grid .stat-card:nth-child(3) h3').textContent = `GHS ${totalRevenue.toLocaleString()}`;
    document.querySelector('.stats-grid .stat-card:nth-child(4) h3').textContent = averageRating;
}

// Initialize event listeners
function initEventListeners() {
    // Add product button
    if (addProductBtn) {
        addProductBtn.addEventListener('click', function() {
            addProductModal.style.display = 'block';
        });
    }

    // Product search
    if (productSearch) {
        let searchTimeout;
        productSearch.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                const searchTerm = this.value.trim();
                const category = categoryFilter ? categoryFilter.value : '';
                renderProducts(searchTerm, category);
            }, 300);
        });
    }

    // Category filter
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            const searchTerm = productSearch ? productSearch.value.trim() : '';
            renderProducts(searchTerm, this.value);
        });
    }

    // Order status filter
    if (orderStatusFilter) {
        orderStatusFilter.addEventListener('change', function() {
            renderOrders(this.value);
        });
    }

    // Add product form submission
    if (addProductForm) {
        addProductForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const productData = {
                id: Date.now(), // Generate unique ID
                name: formData.get('name'),
                category: formData.get('category'),
                description: formData.get('description'),
                price: parseFloat(formData.get('price')),
                originalPrice: formData.get('originalPrice') ? parseFloat(formData.get('originalPrice')) : null,
                stock: parseInt(formData.get('stock')),
                sku: formData.get('sku') || `SKU-${Date.now()}`,
                sales: 0,
                status: 'active',
                image: getCategoryIcon(formData.get('category'))
            };

            // Add to products array (in real app, this would be saved to server)
            sellerProducts.push(productData);
            
            // Re-render products table
            renderProducts();
            
            // Update stats
            updateDashboardStats();
            
            // Close modal and reset form
            addProductModal.style.display = 'none';
            this.reset();
            
            showNotification('Product added successfully!', 'success');
        });
    }

    // Modal close functionality
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            closeModal();
        });
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeModal();
        }
    });

    // Analytics button
    const viewAnalyticsBtn = document.getElementById('viewAnalyticsBtn');
    if (viewAnalyticsBtn) {
        viewAnalyticsBtn.addEventListener('click', function() {
            showNotification('Analytics feature coming soon!', 'info');
        });
    }
}

// Get category icon
function getCategoryIcon(category) {
    const icons = {
        'electronics': '📱',
        'fashion': '👕',
        'home': '🏠',
        'beauty': '💄',
        'sports': '⚽',
        'books': '📚'
    };
    return icons[category] || '📦';
}

// Product management functions
function editProduct(productId) {
    const product = sellerProducts.find(p => p.id === productId);
    if (!product) return;

    // Pre-fill the form with product data
    const form = addProductForm;
    form.name.value = product.name;
    form.category.value = product.category;
    form.description.value = product.description || '';
    form.price.value = product.price;
    form.originalPrice.value = product.originalPrice || '';
    form.stock.value = product.stock;
    form.sku.value = product.sku;

    // Change form submission to update instead of create
    form.dataset.editId = productId;
    document.querySelector('#addProductModal .modal-header h3').textContent = 'Edit Product';
    
    addProductModal.style.display = 'block';
}

function viewProduct(productId) {
    const product = sellerProducts.find(p => p.id === productId);
    if (!product) return;

    showNotification(`Viewing product: ${product.name}`, 'info');
    // In a real app, this would open a detailed product view
}

function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        const index = sellerProducts.findIndex(p => p.id === productId);
        if (index > -1) {
            sellerProducts.splice(index, 1);
            renderProducts();
            updateDashboardStats();
            showNotification('Product deleted successfully!', 'success');
        }
    }
}

// Order management functions
function viewOrder(orderId) {
    const order = sellerOrders.find(o => o.id === orderId);
    if (!order) return;

    showNotification(`Viewing order: ${orderId}`, 'info');
    // In a real app, this would open a detailed order view
}

function updateOrderStatus(orderId) {
    const order = sellerOrders.find(o => o.id === orderId);
    if (!order) return;

    const newStatus = prompt('Enter new status (pending, processing, shipped, delivered):', order.status);
    if (newStatus && ['pending', 'processing', 'shipped', 'delivered'].includes(newStatus)) {
        order.status = newStatus;
        renderOrders();
        showNotification(`Order ${orderId} status updated to ${newStatus}`, 'success');
    }
}

function printOrder(orderId) {
    showNotification(`Printing order ${orderId}...`, 'info');
    // In a real app, this would generate a printable order document
}

// Utility functions
function closeModal() {
    if (addProductModal) {
        addProductModal.style.display = 'none';
        
        // Reset form and edit mode
        if (addProductForm) {
            addProductForm.reset();
            delete addProductForm.dataset.editId;
            document.querySelector('#addProductModal .modal-header h3').textContent = 'Add New Product';
        }
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#2ed573' : type === 'error' ? '#ff4757' : '#74b9ff'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        z-index: 10001;
        animation: slideInRight 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Add CSS for dashboard-specific styles
const dashboardStyles = document.createElement('style');
dashboardStyles.textContent = `
    .dashboard-header {
        background: linear-gradient(135deg, var(--primary-green), var(--light-green));
        color: var(--white);
        padding: 2rem 0;
        margin-top: 80px;
    }

    .header-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 2rem;
    }

    .seller-info {
        display: flex;
        align-items: center;
        gap: 1.5rem;
    }

    .seller-avatar {
        width: 80px;
        height: 80px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2rem;
    }

    .quick-actions {
        display: flex;
        gap: 1rem;
    }

    .dashboard-stats {
        padding: 3rem 0;
        background: var(--light-gray);
    }

    .stat-card {
        background: var(--white);
        padding: 2rem;
        border-radius: 15px;
        box-shadow: 0 10px 30px var(--shadow);
        display: flex;
        align-items: center;
        gap: 1.5rem;
        transition: transform 0.3s ease;
    }

    .stat-card:hover {
        transform: translateY(-5px);
    }

    .stat-icon {
        width: 60px;
        height: 60px;
        background: linear-gradient(135deg, var(--primary-green), var(--light-green));
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--white);
        font-size: 1.5rem;
    }

    .stat-info h3 {
        font-size: 2rem;
        margin-bottom: 0.5rem;
        color: var(--text-dark);
    }

    .stat-info p {
        color: #666;
        margin-bottom: 0.25rem;
    }

    .stat-change {
        font-size: 0.9rem;
        font-weight: 600;
    }

    .stat-change.positive {
        color: #2ed573;
    }

    .stat-change.negative {
        color: #ff4757;
    }

    .products-management,
    .orders-management {
        padding: 3rem 0;
    }

    .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
        flex-wrap: wrap;
        gap: 1rem;
    }

    .section-actions {
        display: flex;
        gap: 1rem;
        align-items: center;
    }

    .section-actions input,
    .section-actions select {
        padding: 0.75rem;
        border: 2px solid var(--light-gray);
        border-radius: 8px;
        font-family: inherit;
    }

    .products-table,
    .orders-table {
        background: var(--white);
        border-radius: 15px;
        overflow: hidden;
        box-shadow: 0 10px 30px var(--shadow);
    }

    table {
        width: 100%;
        border-collapse: collapse;
    }

    th, td {
        padding: 1rem;
        text-align: left;
        border-bottom: 1px solid var(--light-gray);
    }

    th {
        background: var(--primary-green);
        color: var(--white);
        font-weight: 600;
    }

    .product-cell {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .product-image {
        font-size: 2rem;
    }

    .product-info strong {
        display: block;
        margin-bottom: 0.25rem;
    }

    .product-info small {
        color: #666;
    }

    .category-badge {
        background: var(--accent-yellow);
        color: var(--primary-green);
        padding: 0.25rem 0.75rem;
        border-radius: 15px;
        font-size: 0.8rem;
        font-weight: 600;
        text-transform: uppercase;
    }

    .price-cell strong {
        display: block;
    }

    .original-price {
        color: #999;
        text-decoration: line-through;
        font-size: 0.9rem;
    }

    .stock-badge {
        padding: 0.25rem 0.75rem;
        border-radius: 15px;
        font-size: 0.8rem;
        font-weight: 600;
    }

    .stock-badge.in-stock {
        background: #d4edda;
        color: #155724;
    }

    .stock-badge.low-stock {
        background: #fff3cd;
        color: #856404;
    }

    .stock-badge.out-of-stock {
        background: #f8d7da;
        color: #721c24;
    }

    .status-badge {
        padding: 0.25rem 0.75rem;
        border-radius: 15px;
        font-size: 0.8rem;
        font-weight: 600;
        text-transform: uppercase;
    }

    .status-badge.active {
        background: #d4edda;
        color: #155724;
    }

    .status-badge.out_of_stock {
        background: #f8d7da;
        color: #721c24;
    }

    .status-badge.pending {
        background: #fff3cd;
        color: #856404;
    }

    .status-badge.processing {
        background: #cce7ff;
        color: #004085;
    }

    .status-badge.shipped {
        background: #e7ccff;
        color: #6f42c1;
    }

    .status-badge.delivered {
        background: #d4edda;
        color: #155724;
    }

    .action-buttons {
        display: flex;
        gap: 0.5rem;
    }

    .btn-icon {
        background: transparent;
        border: 1px solid var(--light-gray);
        padding: 0.5rem;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
        color: var(--text-dark);
    }

    .btn-icon:hover {
        background: var(--primary-green);
        color: var(--white);
        border-color: var(--primary-green);
    }

    .btn-icon.delete:hover {
        background: #ff4757;
        border-color: #ff4757;
    }

    .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
    }

    @media (max-width: 768px) {
        .header-content {
            flex-direction: column;
            text-align: center;
        }

        .stats-grid {
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        }

        .section-header {
            flex-direction: column;
            align-items: stretch;
        }

        .section-actions {
            flex-direction: column;
        }

        .products-table,
        .orders-table {
            overflow-x: auto;
        }

        table {
            min-width: 800px;
        }

        .form-row {
            grid-template-columns: 1fr;
        }
    }
`;
document.head.appendChild(dashboardStyles);
