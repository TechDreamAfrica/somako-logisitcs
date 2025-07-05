// Products Page JavaScript Functionality

// Current filter state
let currentFilter = 'all';
let currentSort = 'featured';
let currentSearchTerm = '';
let currentPriceMax = 15000;
let currentView = 'grid';
let productsPerPage = 12;
let currentPage = 1;
let allProducts = [];

// Initialize products page
document.addEventListener('DOMContentLoaded', function() {
    initProductsPage();
});

function initProductsPage() {
    // Load products from the main script
    if (typeof products !== 'undefined') {
        allProducts = [...products];
    }
    
    // Check for URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    const searchParam = urlParams.get('search');
    
    // Set initial filters from URL
    if (categoryParam) {
        currentFilter = categoryParam;
        // Update active filter button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.filter === categoryParam) {
                btn.classList.add('active');
            }
        });
    }
    
    if (searchParam) {
        currentSearchTerm = searchParam;
        document.getElementById('searchInput').value = searchParam;
    }
    
    // Initialize event listeners
    initFilterListeners();
    initSortListener();
    initPriceFilter();
    initViewToggle();
    initSearchListener();
    
    // Initial render
    renderFilteredProducts();
    updateProductsCount();
    
    // Hide loading state
    setTimeout(() => {
        document.getElementById('loadingState').style.display = 'none';
    }, 1000);
}

function initFilterListeners() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            currentFilter = this.dataset.filter;
            currentPage = 1;
            renderFilteredProducts();
        });
    });
}

function initSortListener() {
    const sortSelect = document.getElementById('sortSelect');
    sortSelect.addEventListener('change', function() {
        currentSort = this.value;
        renderFilteredProducts();
    });
}

function initPriceFilter() {
    const priceRange = document.getElementById('priceRange');
    const maxPriceDisplay = document.getElementById('maxPrice');
    
    priceRange.addEventListener('input', function() {
        currentPriceMax = parseInt(this.value);
        maxPriceDisplay.textContent = `GH₵ ${currentPriceMax.toLocaleString()}`;
    });
    
    priceRange.addEventListener('change', function() {
        renderFilteredProducts();
    });
}

function initViewToggle() {
    const viewBtns = document.querySelectorAll('.view-btn');
    const productsGrid = document.getElementById('productsGrid');
    
    viewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            viewBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            currentView = this.dataset.view;
            productsGrid.className = currentView === 'grid' ? 'products-grid' : 'products-list';
            renderFilteredProducts();
        });
    });
}

function initSearchListener() {
    const searchInput = document.getElementById('searchInput');
    let searchTimeout;
    
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            currentSearchTerm = this.value.trim();
            currentPage = 1;
            renderFilteredProducts();
        }, 300);
    });
}

function renderFilteredProducts() {
    let filteredProducts = [...allProducts];
    
    // Apply search filter
    if (currentSearchTerm) {
        filteredProducts = filteredProducts.filter(product =>
            product.name.toLowerCase().includes(currentSearchTerm.toLowerCase()) ||
            product.category.toLowerCase().includes(currentSearchTerm.toLowerCase()) ||
            product.seller.toLowerCase().includes(currentSearchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(currentSearchTerm.toLowerCase())
        );
    }
    
    // Apply category filter
    if (currentFilter !== 'all') {
        filteredProducts = filteredProducts.filter(product => {
            if (currentFilter === 'trending') {
                return product.badge === 'trending';
            } else if (currentFilter === 'sale') {
                return product.badge === 'sale' || product.originalPrice;
            } else if (currentFilter === 'new') {
                return product.badge === 'new';
            }
            return product.category === currentFilter;
        });
    }
    
    // Apply price filter
    filteredProducts = filteredProducts.filter(product => product.price <= currentPriceMax);
    
    // Apply sorting
    filteredProducts = sortProducts(filteredProducts, currentSort);
    
    // Check if no results
    if (filteredProducts.length === 0) {
        showNoResults();
        return;
    } else {
        hideNoResults();
    }
    
    // Paginate results
    const startIndex = 0;
    const endIndex = currentPage * productsPerPage;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
    
    renderProducts(paginatedProducts);
    updateLoadMoreButton(filteredProducts.length, endIndex);
    updateProductsCount(filteredProducts.length);
}

function sortProducts(products, sortBy) {
    switch (sortBy) {
        case 'price-low':
            return products.sort((a, b) => a.price - b.price);
        case 'price-high':
            return products.sort((a, b) => b.price - a.price);
        case 'rating':
            return products.sort((a, b) => b.rating - a.rating);
        case 'newest':
            return products.sort((a, b) => (b.badge === 'new' ? 1 : 0) - (a.badge === 'new' ? 1 : 0));
        case 'popular':
            return products.sort((a, b) => b.reviews - a.reviews);
        default:
            return products;
    }
}

function renderProducts(products) {
    const productsGrid = document.getElementById('productsGrid');
    
    if (currentPage === 1) {
        productsGrid.innerHTML = '';
    }
    
    products.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
    
    // Add animation to new products
    const newCards = productsGrid.querySelectorAll('.product-card:not(.animated)');
    newCards.forEach((card, index) => {
        card.classList.add('animated');
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'all 0.3s ease';
    
    const badgeHTML = product.badge ? `<span class="product-badge ${product.badge}">${product.badge}</span>` : '';
    const originalPriceHTML = product.originalPrice ? `<span class="original-price">GH₵ ${product.originalPrice.toLocaleString()}</span>` : '';
    const discountHTML = product.originalPrice ? `<span class="discount">${Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF</span>` : '';
    
    card.innerHTML = `
        <div class="product-image" onclick="openProductDetail(${product.id})">
            <span class="product-emoji">${product.image}</span>
            ${badgeHTML}
            <div class="product-overlay">
                <button class="quick-view-btn" onclick="event.stopPropagation(); openProductModal(${product.id})">
                    <i class="fas fa-eye"></i> Quick View
                </button>
            </div>
        </div>
        
        <div class="product-info">
            <div class="product-rating">
                <div class="stars">
                    ${generateStars(product.rating)}
                </div>
                <span class="rating-text">${product.rating} (${product.reviews})</span>
            </div>
            
            <h3 class="product-name" onclick="openProductDetail(${product.id})">${product.name}</h3>
            <p class="product-seller">by ${product.seller}</p>
            
            <div class="product-pricing">
                <span class="current-price">GH₵ ${product.price.toLocaleString()}</span>
                ${originalPriceHTML}
                ${discountHTML}
            </div>
            
            <div class="product-actions">
                <button class="btn btn-primary add-to-cart-btn" onclick="addToCart(${product.id})">
                    <i class="fas fa-shopping-cart"></i> Add to Cart
                </button>
                <button class="btn btn-outline wishlist-btn" onclick="toggleWishlist(${product.id})">
                    <i class="far fa-heart"></i>
                </button>
            </div>
        </div>
    `;
    
    return card;
}

function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - Math.ceil(rating);
    
    let starsHTML = '';
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star"></i>';
    }
    
    // Half star
    if (hasHalfStar) {
        starsHTML += '<i class="fas fa-star-half-alt"></i>';
    }
    
    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="far fa-star"></i>';
    }
    
    return starsHTML;
}

function updateLoadMoreButton(totalResults, currentlyShown) {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const loadMoreContainer = loadMoreBtn.parentElement;
    
    if (currentlyShown >= totalResults) {
        loadMoreContainer.style.display = 'none';
    } else {
        loadMoreContainer.style.display = 'block';
        loadMoreBtn.onclick = loadMoreProducts;
    }
}

function loadMoreProducts() {
    currentPage++;
    renderFilteredProducts();
}

function updateProductsCount(count = null) {
    const totalProductsElement = document.getElementById('totalProducts');
    if (totalProductsElement) {
        const displayCount = count !== null ? count : allProducts.length;
        totalProductsElement.textContent = displayCount.toLocaleString();
    }
}

function showNoResults() {
    document.getElementById('noResults').style.display = 'block';
    document.getElementById('productsGrid').style.display = 'none';
    document.querySelector('.load-more-container').style.display = 'none';
}

function hideNoResults() {
    document.getElementById('noResults').style.display = 'none';
    document.getElementById('productsGrid').style.display = currentView === 'grid' ? 'grid' : 'block';
}

function clearFilters() {
    // Reset all filters
    currentFilter = 'all';
    currentSort = 'featured';
    currentSearchTerm = '';
    currentPriceMax = 15000;
    currentPage = 1;
    
    // Reset UI elements
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.filter === 'all') {
            btn.classList.add('active');
        }
    });
    
    document.getElementById('sortSelect').value = 'featured';
    document.getElementById('searchInput').value = '';
    document.getElementById('priceRange').value = 15000;
    document.getElementById('maxPrice').textContent = 'GH₵ 15,000';
    
    // Re-render products
    renderFilteredProducts();
}

function searchProducts() {
    const searchInput = document.getElementById('searchInput');
    currentSearchTerm = searchInput.value.trim();
    currentPage = 1;
    renderFilteredProducts();
}

function filterProducts(category) {
    currentFilter = category;
    currentPage = 1;
    
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.filter === category) {
            btn.classList.add('active');
        }
    });
    
    renderFilteredProducts();
}

function openProductDetail(productId) {
    // Redirect to product detail page
    window.location.href = `product-detail.html?id=${productId}`;
}

function openProductModal(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;
    
    const modal = document.getElementById('productModal');
    const modalContent = document.getElementById('productModalContent');
    
    const originalPriceHTML = product.originalPrice ? 
        `<span class="modal-original-price">GH₵ ${product.originalPrice.toLocaleString()}</span>` : '';
    
    modalContent.innerHTML = `
        <div class="modal-product-content">
            <div class="modal-product-image">
                <span class="modal-product-emoji">${product.image}</span>
                ${product.badge ? `<span class="product-badge ${product.badge}">${product.badge}</span>` : ''}
            </div>
            
            <div class="modal-product-details">
                <h2>${product.name}</h2>
                <p class="modal-seller">by ${product.seller}</p>
                
                <div class="modal-rating">
                    <div class="stars">${generateStars(product.rating)}</div>
                    <span>${product.rating} (${product.reviews} reviews)</span>
                </div>
                
                <div class="modal-pricing">
                    <span class="modal-current-price">GH₵ ${product.price.toLocaleString()}</span>
                    ${originalPriceHTML}
                </div>
                
                <p class="modal-description">${product.description}</p>
                
                <div class="modal-actions">
                    <button class="btn btn-primary" onclick="addToCart(${product.id}); closeProductModal();">
                        <i class="fas fa-shopping-cart"></i> Add to Cart
                    </button>
                    <button class="btn btn-outline" onclick="openProductDetail(${product.id})">
                        View Details
                    </button>
                </div>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeProductModal() {
    const modal = document.getElementById('productModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function toggleWishlist(productId) {
    const wishlistBtn = event.target.closest('.wishlist-btn');
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
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Hide and remove notification
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('productModal');
    if (event.target === modal) {
        closeProductModal();
    }
}
