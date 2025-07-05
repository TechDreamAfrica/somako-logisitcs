// Soma Ko Trade JavaScript Functionality

// Sample product data
const products = [
    {
        id: 1,
        name: "iPhone 14 Pro Max",
        seller: "TechStore Ghana",
        price: 8500,
        originalPrice: 9000,
        category: "electronics",
        rating: 4.8,
        reviews: 124,
        image: "📱",
        badge: "sale",
        description: "Latest iPhone with advanced camera system and A16 Bionic chip."
    },
    {
        id: 2,
        name: "Nike Air Force 1",
        seller: "SneakerHub",
        price: 450,
        category: "fashion",
        rating: 4.6,
        reviews: 89,
        image: "👟",
        badge: "trending",
        description: "Classic white sneakers for everyday wear."
    },
    {
        id: 3,
        name: "MacBook Pro 16\"",
        seller: "Apple Store Ghana",
        price: 12000,
        category: "electronics",
        rating: 4.9,
        reviews: 67,
        image: "💻",
        badge: "new",
        description: "Powerful laptop for professionals and creators."
    },
    {
        id: 4,
        name: "Samsung 4K Smart TV",
        seller: "ElectroMart",
        price: 3200,
        originalPrice: 3800,
        category: "electronics",
        rating: 4.7,
        reviews: 156,
        image: "📺",
        badge: "sale",
        description: "55-inch 4K Smart TV with HDR support."
    },
    {
        id: 5,
        name: "Adidas Tracksuit",
        seller: "SportWear Plus",
        price: 280,
        category: "fashion",
        rating: 4.4,
        reviews: 43,
        image: "👔",
        badge: null,
        description: "Comfortable tracksuit for sports and casual wear."
    },
    {
        id: 6,
        name: "Sony Headphones",
        seller: "AudioWorld",
        price: 850,
        category: "electronics",
        rating: 4.8,
        reviews: 201,
        image: "🎧",
        badge: "trending",
        description: "Wireless noise-canceling headphones with premium sound."
    },
    {
        id: 7,
        name: "Office Chair",
        seller: "FurnitureHub",
        price: 650,
        category: "home",
        rating: 4.5,
        reviews: 78,
        image: "🪑",
        badge: null,
        description: "Ergonomic office chair with lumbar support."
    },
    {
        id: 8,
        name: "Skincare Set",
        seller: "Beauty Paradise",
        price: 120,
        category: "beauty",
        rating: 4.6,
        reviews: 92,
        image: "🧴",
        badge: "new",
        description: "Complete skincare routine for glowing skin."
    }
];

// Cart functionality
let cart = JSON.parse(localStorage.getItem('somaKoTradeCart')) || [];

// DOM elements
const productsGrid = document.getElementById('productsGrid');
const cartCount = document.querySelector('.cart-count');
const cartIcon = document.querySelector('.cart-icon');
const cartSidebar = document.getElementById('cartSidebar');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartClose = document.querySelector('.cart-close');
const filterBtns = document.querySelectorAll('.filter-btn');
const categoryCards = document.querySelectorAll('.category-card');
const searchInput = document.getElementById('searchInput');
const loadMoreBtn = document.getElementById('loadMoreBtn');

// Modal elements
const preOrderModal = document.getElementById('preOrderModal');
const productModal = document.getElementById('productModal');
const preOrderBtn = document.getElementById('preOrderBtn');
const becomeSellerBtn = document.getElementById('becomeSellerBtn');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    renderProducts();
    updateCartUI();
    initEventListeners();
    initHamburgerMenu();
});

// Render products
function renderProducts(filter = 'all', searchTerm = '', limit = 8) {
    let filteredProducts = products;

    // Apply search filter
    if (searchTerm) {
        filteredProducts = filteredProducts.filter(product => 
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.seller.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    // Apply category filter
    if (filter !== 'all') {
        if (filter === 'trending') {
            filteredProducts = filteredProducts.filter(product => product.badge === 'trending');
        } else if (filter === 'new') {
            filteredProducts = filteredProducts.filter(product => product.badge === 'new');
        } else if (filter === 'sale') {
            filteredProducts = filteredProducts.filter(product => product.badge === 'sale');
        } else {
            filteredProducts = filteredProducts.filter(product => product.category === filter);
        }
    }

    // Limit products shown
    const productsToShow = filteredProducts.slice(0, limit);

    if (productsGrid) {
        productsGrid.innerHTML = productsToShow.map(product => `
            <div class="product-card" data-product-id="${product.id}">
                <div class="product-image">
                    <span style="font-size: 4rem;">${product.image}</span>
                    ${product.badge ? `<div class="product-badge ${product.badge}">${product.badge.toUpperCase()}</div>` : ''}
                </div>
                <div class="product-info">
                    <div class="product-title">${product.name}</div>
                    <div class="product-seller">by ${product.seller}</div>
                    <div class="product-rating">
                        <div class="stars">★★★★★</div>
                        <span>(${product.reviews})</span>
                    </div>
                    <div class="product-price">
                        <div>
                            <span class="current-price">GHS ${product.price.toLocaleString()}</span>
                            ${product.originalPrice ? `<span class="original-price">GHS ${product.originalPrice.toLocaleString()}</span>` : ''}
                        </div>
                    </div>
                    <div class="product-actions">
                        <button class="btn-add-cart" onclick="addToCart(${product.id})">
                            <i class="fas fa-shopping-cart"></i> Add to Cart
                        </button>
                        <button class="btn-wishlist" onclick="addToWishlist(${product.id})">
                            <i class="fas fa-heart"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        // Add click event to product cards for modal
        document.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', function(e) {
                // Don't open modal if clicking buttons
                if (e.target.closest('.product-actions')) return;
                
                const productId = parseInt(this.dataset.productId);
                showProductModal(productId);
            });
        });
    }

    // Show/hide load more button
    if (loadMoreBtn) {
        loadMoreBtn.style.display = filteredProducts.length > limit ? 'block' : 'none';
    }
}

// Show product detail modal
function showProductModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const modalBody = document.getElementById('productModalBody');
    modalBody.innerHTML = `
        <div class="product-detail">
            <div class="product-detail-image">
                <span style="font-size: 8rem;">${product.image}</span>
                ${product.badge ? `<div class="product-badge ${product.badge}">${product.badge.toUpperCase()}</div>` : ''}
            </div>
            <div class="product-detail-info">
                <h2>${product.name}</h2>
                <p class="seller">Sold by: <strong>${product.seller}</strong></p>
                <div class="rating">
                    <div class="stars">★★★★★</div>
                    <span>${product.rating} (${product.reviews} reviews)</span>
                </div>
                <div class="price">
                    <span class="current-price">GHS ${product.price.toLocaleString()}</span>
                    ${product.originalPrice ? `<span class="original-price">GHS ${product.originalPrice.toLocaleString()}</span>` : ''}
                </div>
                <p class="description">${product.description}</p>
                <div class="product-actions" style="margin-top: 2rem;">
                    <button class="btn btn-primary" onclick="addToCart(${product.id}); closeModal()">
                        <i class="fas fa-shopping-cart"></i> Add to Cart
                    </button>
                    <button class="btn btn-secondary" onclick="addToWishlist(${product.id})">
                        <i class="fas fa-heart"></i> Add to Wishlist
                    </button>
                </div>
            </div>
        </div>
    `;

    productModal.style.display = 'block';
}

// Add to cart functionality
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    localStorage.setItem('somaKoTradeCart', JSON.stringify(cart));
    updateCartUI();
    
    // Show success message
    showNotification('Product added to cart!', 'success');
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('somaKoTradeCart', JSON.stringify(cart));
    updateCartUI();
}

// Update cart quantity
function updateCartQuantity(productId, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
    }

    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        localStorage.setItem('somaKoTradeCart', JSON.stringify(cart));
        updateCartUI();
    }
}

// Update cart UI
function updateCartUI() {
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) {
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }

    // Update cart total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (cartTotal) {
        cartTotal.textContent = total.toLocaleString() + '.00';
    }

    // Render cart items
    if (cartItems) {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-image">
                    <span>${item.image}</span>
                </div>
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">GHS ${item.price.toLocaleString()}</div>
                    <div class="cart-item-controls">
                        <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, ${item.quantity - 1})">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, ${item.quantity + 1})">+</button>
                        <button class="quantity-btn" onclick="removeFromCart(${item.id})" style="margin-left: auto; background: #ff4757; color: white;">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

// Add to wishlist
function addToWishlist(productId) {
    showNotification('Added to wishlist!', 'success');
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#2ed573' : '#74b9ff'};
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

// Initialize event listeners
function initEventListeners() {
    // Filter buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.dataset.filter;
            renderProducts(filter);
        });
    });

    // Category cards
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.dataset.category;
            
            // Update filter buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            const categoryBtn = document.querySelector(`[data-filter="${category}"]`);
            if (categoryBtn) {
                categoryBtn.classList.add('active');
            }
            
            renderProducts(category);
            
            // Scroll to products section
            document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Search functionality
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                const searchTerm = this.value.trim();
                renderProducts('all', searchTerm);
            }, 300);
        });

        // Search button
        const searchBtn = document.querySelector('.search-btn');
        if (searchBtn) {
            searchBtn.addEventListener('click', function() {
                const searchTerm = searchInput.value.trim();
                renderProducts('all', searchTerm);
            });
        }
    }

    // Cart icon
    if (cartIcon) {
        cartIcon.addEventListener('click', function(e) {
            e.preventDefault();
            cartSidebar.classList.add('open');
        });
    }

    // Cart close
    if (cartClose) {
        cartClose.addEventListener('click', function() {
            cartSidebar.classList.remove('open');
        });
    }

    // Load more button
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            // This would normally load more products from API
            showNotification('Loading more products...', 'info');
        });
    }

    // Pre-order button
    if (preOrderBtn) {
        preOrderBtn.addEventListener('click', function() {
            preOrderModal.style.display = 'block';
        });
    }

    // Become seller button
    if (becomeSellerBtn) {
        becomeSellerBtn.addEventListener('click', function() {
            window.location.href = 'seller-dashboard.html';
        });
    }

    // Checkout button
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (cart.length === 0) {
                showNotification('Your cart is empty!', 'info');
                return;
            }
            
            // Redirect to Soma Ko Pay for payment
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const orderData = {
                items: cart,
                total: total,
                timestamp: new Date().toISOString()
            };
            
            localStorage.setItem('pendingOrder', JSON.stringify(orderData));
            window.location.href = '../soma-ko-pay/index.html?source=trade&amount=' + total;
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
        
        // Close cart when clicking outside
        if (!cartSidebar.contains(e.target) && !cartIcon.contains(e.target)) {
            cartSidebar.classList.remove('open');
        }
    });

    // Pre-order form submission
    const preOrderForm = document.getElementById('preOrderForm');
    if (preOrderForm) {
        preOrderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const preOrderData = {
                productName: formData.get('productName'),
                category: formData.get('category'),
                description: formData.get('description'),
                targetPrice: formData.get('targetPrice'),
                quantity: formData.get('quantity'),
                timestamp: new Date().toISOString(),
                status: 'pending'
            };

            // Save pre-order (in real app, this would go to a server)
            let preOrders = JSON.parse(localStorage.getItem('preOrders')) || [];
            preOrders.push(preOrderData);
            localStorage.setItem('preOrders', JSON.stringify(preOrders));

            showNotification('Pre-order request submitted successfully!', 'success');
            closeModal();
            this.reset();
        });
    }
}

// Proceed to checkout function
function proceedToCheckout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'info');
        return;
    }
    
    // Close cart sidebar
    if (cartSidebar) {
        cartSidebar.classList.remove('open');
    }
    
    // Redirect to checkout page
    window.location.href = 'checkout.html';
}

// Toggle cart function
function toggleCart() {
    if (cartSidebar) {
        cartSidebar.classList.toggle('open');
    }
    
    // Toggle overlay
    const cartOverlay = document.getElementById('cartOverlay');
    if (cartOverlay) {
        cartOverlay.classList.toggle('active');
    }
}

// Mobile menu toggle function
function toggleMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    }
}

// Close modal
function closeModal() {
    if (preOrderModal) preOrderModal.style.display = 'none';
    if (productModal) productModal.style.display = 'none';
}

// Hamburger menu functionality
function initHamburgerMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking on links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

// CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    .product-detail {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
        align-items: start;
    }
    
    .product-detail-image {
        text-align: center;
        position: relative;
        background: var(--light-gray);
        padding: 2rem;
        border-radius: 15px;
    }
    
    .product-detail-info h2 {
        margin-bottom: 0.5rem;
        color: var(--text-dark);
    }
    
    .product-detail-info .seller {
        color: #666;
        margin-bottom: 1rem;
    }
    
    .product-detail-info .rating {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 1rem;
    }
    
    .product-detail-info .stars {
        color: #ffd700;
    }
    
    .product-detail-info .price {
        margin-bottom: 1rem;
    }
    
    .product-detail-info .current-price {
        font-size: 1.5rem;
        font-weight: bold;
        color: var(--primary-green);
        margin-right: 1rem;
    }
    
    .product-detail-info .original-price {
        text-decoration: line-through;
        color: #999;
    }
    
    .product-detail-info .description {
        color: #666;
        line-height: 1.6;
        margin-bottom: 1.5rem;
    }
    
    @media (max-width: 768px) {
        .product-detail {
            grid-template-columns: 1fr;
            gap: 1rem;
        }
    }
`;
document.head.appendChild(style);
