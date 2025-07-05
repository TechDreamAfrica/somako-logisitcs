// Product Detail Page JavaScript

let currentProduct = null;
let currentImageIndex = 0;
let productImages = [];

// Initialize product detail page
document.addEventListener('DOMContentLoaded', function() {
    loadProductDetail();
});

function loadProductDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    
    if (!productId || isNaN(productId)) {
        showProductNotFound();
        return;
    }
    
    // Find product from the main products array
    if (typeof products !== 'undefined') {
        currentProduct = products.find(p => p.id === productId);
    }
    
    if (!currentProduct) {
        showProductNotFound();
        return;
    }
    
    // Hide loading state
    document.getElementById('productLoading').style.display = 'none';
    
    // Render product details
    renderProductDetail();
    
    // Load related products
    loadRelatedProducts();
    
    // Update page title and breadcrumb
    document.title = `${currentProduct.name} - Soma Ko Trade`;
    document.getElementById('productBreadcrumb').textContent = currentProduct.name;
}

function showProductNotFound() {
    document.getElementById('productLoading').style.display = 'none';
    document.getElementById('productNotFound').style.display = 'block';
}

function renderProductDetail() {
    const container = document.getElementById('productDetailContent');
    
    // Setup product images (using emoji as placeholder, but structure for real images)
    productImages = [currentProduct.image]; // In real app, this would be an array of image URLs
    
    const originalPriceHTML = currentProduct.originalPrice ? 
        `<span class="original-price">GH₵ ${currentProduct.originalPrice.toLocaleString()}</span>` : '';
    
    const discountHTML = currentProduct.originalPrice ? 
        `<div class="discount-banner">
            <span class="discount-percentage">${Math.round(((currentProduct.originalPrice - currentProduct.price) / currentProduct.originalPrice) * 100)}% OFF</span>
            <span class="savings">Save GH₵ ${(currentProduct.originalPrice - currentProduct.price).toLocaleString()}</span>
        </div>` : '';
    
    const badgeHTML = currentProduct.badge ? 
        `<span class="product-badge ${currentProduct.badge}">${currentProduct.badge}</span>` : '';
    
    container.innerHTML = `
        <div class="product-detail-grid">
            <!-- Product Images -->
            <div class="product-images">
                <div class="main-image-container">
                    <div class="main-image" onclick="openImageModal(0)">
                        <span class="product-emoji-large">${currentProduct.image}</span>
                        ${badgeHTML}
                    </div>
                    ${discountHTML}
                </div>
                
                <div class="image-thumbnails">
                    <div class="thumbnail active" onclick="changeMainImage(0)">
                        <span class="product-emoji-small">${currentProduct.image}</span>
                    </div>
                    <!-- Additional thumbnails would go here in a real app -->
                </div>
            </div>
            
            <!-- Product Information -->
            <div class="product-info">
                <div class="product-header">
                    <h1 class="product-title">${currentProduct.name}</h1>
                    <div class="product-meta">
                        <span class="seller-info">
                            <i class="fas fa-store"></i>
                            Sold by <strong>${currentProduct.seller}</strong>
                        </span>
                        <div class="product-rating">
                            <div class="stars">${generateStars(currentProduct.rating)}</div>
                            <span class="rating-text">${currentProduct.rating} (${currentProduct.reviews} reviews)</span>
                        </div>
                    </div>
                </div>
                
                <div class="pricing-section">
                    <div class="price-container">
                        <span class="current-price">GH₵ ${currentProduct.price.toLocaleString()}</span>
                        ${originalPriceHTML}
                    </div>
                    <div class="availability">
                        <i class="fas fa-check-circle"></i>
                        <span>In Stock</span>
                    </div>
                </div>
                
                <div class="product-description">
                    <h3>Description</h3>
                    <p>${currentProduct.description}</p>
                    
                    <div class="product-features">
                        <h4>Key Features:</h4>
                        <ul>
                            <li>High-quality materials and construction</li>
                            <li>Excellent customer reviews and ratings</li>
                            <li>Fast delivery available</li>
                            <li>Secure payment options</li>
                        </ul>
                    </div>
                </div>
                
                <div class="quantity-selector">
                    <label for="quantity">Quantity:</label>
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="changeQuantity(-1)">-</button>
                        <input type="number" id="quantity" value="1" min="1" max="10">
                        <button class="quantity-btn" onclick="changeQuantity(1)">+</button>
                    </div>
                </div>
                
                <div class="action-buttons">
                    <button class="btn btn-primary add-to-cart-btn" onclick="addToCartWithQuantity()">
                        <i class="fas fa-shopping-cart"></i>
                        Add to Cart
                    </button>
                    <button class="btn btn-outline wishlist-btn" onclick="toggleWishlist(${currentProduct.id})">
                        <i class="far fa-heart"></i>
                        Add to Wishlist
                    </button>
                    <button class="btn btn-secondary buy-now-btn" onclick="buyNow()">
                        <i class="fas fa-bolt"></i>
                        Buy Now
                    </button>
                </div>
                
                <div class="delivery-info">
                    <div class="delivery-option">
                        <i class="fas fa-truck"></i>
                        <div>
                            <strong>Fast Delivery</strong>
                            <p>Get it delivered within 2-3 business days</p>
                        </div>
                    </div>
                    <div class="delivery-option">
                        <i class="fas fa-shield-alt"></i>
                        <div>
                            <strong>Secure Payment</strong>
                            <p>Pay safely with Soma Ko Pay or cash on delivery</p>
                        </div>
                    </div>
                    <div class="delivery-option">
                        <i class="fas fa-undo"></i>
                        <div>
                            <strong>Easy Returns</strong>
                            <p>7-day return policy for your peace of mind</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Product Tabs -->
        <div class="product-tabs">
            <div class="tab-headers">
                <button class="tab-header active" onclick="showTab('specifications')">Specifications</button>
                <button class="tab-header" onclick="showTab('reviews')">Reviews (${currentProduct.reviews})</button>
                <button class="tab-header" onclick="showTab('seller')">Seller Info</button>
                <button class="tab-header" onclick="showTab('shipping')">Shipping & Returns</button>
            </div>
            
            <div class="tab-content">
                <div id="specifications" class="tab-panel active">
                    <h3>Product Specifications</h3>
                    <table class="specs-table">
                        <tr>
                            <td>Brand</td>
                            <td>${currentProduct.seller}</td>
                        </tr>
                        <tr>
                            <td>Category</td>
                            <td>${currentProduct.category.charAt(0).toUpperCase() + currentProduct.category.slice(1)}</td>
                        </tr>
                        <tr>
                            <td>Rating</td>
                            <td>${currentProduct.rating}/5.0</td>
                        </tr>
                        <tr>
                            <td>Availability</td>
                            <td>In Stock</td>
                        </tr>
                    </table>
                </div>
                
                <div id="reviews" class="tab-panel">
                    <h3>Customer Reviews</h3>
                    <div class="reviews-summary">
                        <div class="overall-rating">
                            <span class="rating-number">${currentProduct.rating}</span>
                            <div class="stars">${generateStars(currentProduct.rating)}</div>
                            <span class="review-count">Based on ${currentProduct.reviews} reviews</span>
                        </div>
                    </div>
                    
                    <div class="reviews-list">
                        <div class="review-item">
                            <div class="review-header">
                                <div class="reviewer-info">
                                    <strong>John D.</strong>
                                    <div class="stars">${generateStars(5)}</div>
                                </div>
                                <span class="review-date">2 weeks ago</span>
                            </div>
                            <p class="review-text">Great product! Exactly as described and delivered quickly. Highly recommended.</p>
                        </div>
                        
                        <div class="review-item">
                            <div class="review-header">
                                <div class="reviewer-info">
                                    <strong>Sarah M.</strong>
                                    <div class="stars">${generateStars(4)}</div>
                                </div>
                                <span class="review-date">1 month ago</span>
                            </div>
                            <p class="review-text">Good quality product. The seller was very responsive to my questions.</p>
                        </div>
                    </div>
                </div>
                
                <div id="seller" class="tab-panel">
                    <h3>About the Seller</h3>
                    <div class="seller-info-detailed">
                        <div class="seller-stats">
                            <div class="stat">
                                <span class="stat-value">4.8</span>
                                <span class="stat-label">Seller Rating</span>
                            </div>
                            <div class="stat">
                                <span class="stat-value">95%</span>
                                <span class="stat-label">Positive Feedback</span>
                            </div>
                            <div class="stat">
                                <span class="stat-value">2-3 days</span>
                                <span class="stat-label">Ships Within</span>
                            </div>
                        </div>
                        <p>Trusted seller with over 1000 successful transactions. Known for quality products and excellent customer service.</p>
                    </div>
                </div>
                
                <div id="shipping" class="tab-panel">
                    <h3>Shipping & Returns</h3>
                    <div class="shipping-info-detailed">
                        <h4>Shipping Options</h4>
                        <ul>
                            <li><strong>Standard Delivery:</strong> 3-5 business days - GH₵ 15</li>
                            <li><strong>Express Delivery:</strong> 1-2 business days - GH₵ 25</li>
                            <li><strong>Same Day Delivery:</strong> Available in Accra - GH₵ 35</li>
                        </ul>
                        
                        <h4>Return Policy</h4>
                        <ul>
                            <li>7-day return window</li>
                            <li>Items must be in original condition</li>
                            <li>Free returns for defective items</li>
                            <li>Customer pays return shipping for change of mind</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - Math.ceil(rating);
    
    let starsHTML = '';
    
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        starsHTML += '<i class="fas fa-star-half-alt"></i>';
    }
    
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="far fa-star"></i>';
    }
    
    return starsHTML;
}

function changeQuantity(delta) {
    const quantityInput = document.getElementById('quantity');
    const currentValue = parseInt(quantityInput.value);
    const newValue = Math.max(1, Math.min(10, currentValue + delta));
    quantityInput.value = newValue;
}

function addToCartWithQuantity() {
    const quantity = parseInt(document.getElementById('quantity').value);
    
    // Add multiple items to cart
    for (let i = 0; i < quantity; i++) {
        addToCart(currentProduct.id);
    }
    
    showNotification(`Added ${quantity} item(s) to cart!`, 'success');
}

function buyNow() {
    addToCartWithQuantity();
    setTimeout(() => {
        proceedToCheckout();
    }, 500);
}

function showTab(tabName) {
    // Hide all tab panels
    document.querySelectorAll('.tab-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    
    // Remove active class from all headers
    document.querySelectorAll('.tab-header').forEach(header => {
        header.classList.remove('active');
    });
    
    // Show selected tab panel
    document.getElementById(tabName).classList.add('active');
    
    // Add active class to clicked header
    event.target.classList.add('active');
}

function changeMainImage(index) {
    // Remove active class from all thumbnails
    document.querySelectorAll('.thumbnail').forEach(thumb => {
        thumb.classList.remove('active');
    });
    
    // Add active class to clicked thumbnail
    event.target.closest('.thumbnail').classList.add('active');
    
    currentImageIndex = index;
    // In a real app, this would change the main image source
}

function openImageModal(index) {
    currentImageIndex = index;
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    
    // In a real app, this would show the actual image
    // For now, we'll just show the modal with the emoji
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeImageModal() {
    const modal = document.getElementById('imageModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function previousImage() {
    if (currentImageIndex > 0) {
        currentImageIndex--;
        // Update modal image
    }
}

function nextImage() {
    if (currentImageIndex < productImages.length - 1) {
        currentImageIndex++;
        // Update modal image
    }
}

function loadRelatedProducts() {
    if (typeof products === 'undefined') return;
    
    // Get products from the same category
    const relatedProducts = products
        .filter(p => p.id !== currentProduct.id && p.category === currentProduct.category)
        .slice(0, 4);
    
    const container = document.getElementById('relatedProductsGrid');
    
    if (relatedProducts.length === 0) {
        container.parentElement.style.display = 'none';
        return;
    }
    
    container.innerHTML = '';
    
    relatedProducts.forEach(product => {
        const productCard = createSimpleProductCard(product);
        container.appendChild(productCard);
    });
}

function createSimpleProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    const originalPriceHTML = product.originalPrice ? 
        `<span class="original-price">GH₵ ${product.originalPrice.toLocaleString()}</span>` : '';
    
    card.innerHTML = `
        <div class="product-image" onclick="window.location.href='product-detail.html?id=${product.id}'">
            <span class="product-emoji">${product.image}</span>
            ${product.badge ? `<span class="product-badge ${product.badge}">${product.badge}</span>` : ''}
        </div>
        
        <div class="product-info">
            <div class="product-rating">
                <div class="stars">${generateStars(product.rating)}</div>
                <span class="rating-text">${product.rating}</span>
            </div>
            
            <h3 class="product-name" onclick="window.location.href='product-detail.html?id=${product.id}'">${product.name}</h3>
            
            <div class="product-pricing">
                <span class="current-price">GH₵ ${product.price.toLocaleString()}</span>
                ${originalPriceHTML}
            </div>
            
            <button class="btn btn-primary add-to-cart-btn" onclick="addToCart(${product.id})">
                Add to Cart
            </button>
        </div>
    `;
    
    return card;
}

function toggleWishlist(productId) {
    const wishlistBtn = document.querySelector('.wishlist-btn');
    const icon = wishlistBtn.querySelector('i');
    
    if (icon.classList.contains('far')) {
        icon.classList.remove('far');
        icon.classList.add('fas');
        wishlistBtn.classList.add('active');
        showNotification('Added to wishlist!', 'success');
    } else {
        icon.classList.remove('fas');
        icon.classList.add('far');
        wishlistBtn.classList.remove('active');
        showNotification('Removed from wishlist!', 'info');
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function searchProducts() {
    const searchTerm = document.getElementById('searchInput').value.trim();
    if (searchTerm) {
        window.location.href = `products.html?search=${encodeURIComponent(searchTerm)}`;
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const imageModal = document.getElementById('imageModal');
    if (event.target === imageModal) {
        closeImageModal();
    }
}
