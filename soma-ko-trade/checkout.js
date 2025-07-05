// Checkout Page JavaScript

let orderData = {
    customer: {},
    delivery: {},
    items: [],
    totals: {
        subtotal: 0,
        deliveryFee: 15,
        discount: 0,
        total: 0
    },
    paymentMethod: 'cash',
    deliveryType: 'standard'
};

// Initialize checkout page
document.addEventListener('DOMContentLoaded', function() {
    initCheckoutPage();
});

function initCheckoutPage() {
    // Load cart items
    loadOrderItems();
    
    // Initialize event listeners
    initFormListeners();
    
    // Calculate initial totals
    calculateTotals();
    
    // Check if cart is empty
    if (orderData.items.length === 0) {
        showEmptyCartMessage();
        return;
    }
    
    // Pre-fill form if user is logged in (simulation)
    prefillUserData();
}

function loadOrderItems() {
    const cart = JSON.parse(localStorage.getItem('somaKoTradeCart')) || [];
    const orderItemsContainer = document.getElementById('orderItems');
    
    if (cart.length === 0) {
        orderItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        return;
    }
    
    // Group cart items by product ID and calculate quantities
    const groupedItems = {};
    cart.forEach(item => {
        if (groupedItems[item.id]) {
            groupedItems[item.id].quantity++;
        } else {
            groupedItems[item.id] = { ...item, quantity: 1 };
        }
    });
    
    orderData.items = Object.values(groupedItems);
    
    // Render order items
    orderItemsContainer.innerHTML = '';
    orderData.items.forEach(item => {
        const itemElement = createOrderItemElement(item);
        orderItemsContainer.appendChild(itemElement);
    });
    
    // Calculate subtotal
    orderData.totals.subtotal = orderData.items.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);
}

function createOrderItemElement(item) {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'order-item';
    
    itemDiv.innerHTML = `
        <div class="item-image">
            <span class="item-emoji">${item.image}</span>
        </div>
        <div class="item-details">
            <h4 class="item-name">${item.name}</h4>
            <p class="item-seller">by ${item.seller}</p>
            <div class="item-quantity">Qty: ${item.quantity}</div>
        </div>
        <div class="item-price">
            <span class="unit-price">GH₵ ${item.price.toLocaleString()}</span>
            <span class="total-price">GH₵ ${(item.price * item.quantity).toLocaleString()}</span>
        </div>
    `;
    
    return itemDiv;
}

function initFormListeners() {
    // Delivery type change
    const deliveryOptions = document.querySelectorAll('input[name="deliveryType"]');
    deliveryOptions.forEach(option => {
        option.addEventListener('change', function() {
            orderData.deliveryType = this.value;
            updateDeliveryFee();
            calculateTotals();
        });
    });
    
    // Payment method change
    const paymentOptions = document.querySelectorAll('input[name="paymentMethod"]');
    paymentOptions.forEach(option => {
        option.addEventListener('change', function() {
            orderData.paymentMethod = this.value;
        });
    });
    
    // City change for same-day delivery
    const citySelect = document.getElementById('city');
    citySelect.addEventListener('change', function() {
        const sameDayOption = document.getElementById('sameDayOption');
        if (this.value === 'accra') {
            sameDayOption.style.display = 'block';
        } else {
            sameDayOption.style.display = 'none';
            // Reset to standard if same-day was selected
            if (orderData.deliveryType === 'sameday') {
                document.getElementById('standard').checked = true;
                orderData.deliveryType = 'standard';
                updateDeliveryFee();
                calculateTotals();
            }
        }
    });
    
    // Form validation
    const form = document.getElementById('checkoutForm');
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
}

function updateDeliveryFee() {
    const deliveryFees = {
        standard: 15,
        express: 25,
        sameday: 35
    };
    
    orderData.totals.deliveryFee = deliveryFees[orderData.deliveryType];
    document.getElementById('deliveryFee').textContent = `GH₵ ${orderData.totals.deliveryFee}`;
}

function calculateTotals() {
    orderData.totals.total = orderData.totals.subtotal + orderData.totals.deliveryFee - orderData.totals.discount;
    
    // Update UI
    document.getElementById('subtotal').textContent = `GH₵ ${orderData.totals.subtotal.toLocaleString()}`;
    document.getElementById('total').textContent = `GH₵ ${orderData.totals.total.toLocaleString()}`;
    
    if (orderData.totals.discount > 0) {
        document.getElementById('discountRow').style.display = 'flex';
        document.getElementById('discount').textContent = `-GH₵ ${orderData.totals.discount.toLocaleString()}`;
    }
}

function applyPromoCode() {
    const promoCodeInput = document.getElementById('promoCode');
    const promoCode = promoCodeInput.value.trim().toUpperCase();
    
    if (!promoCode) {
        showNotification('Please enter a promo code', 'error');
        return;
    }
    
    // Simulate promo code validation
    const validPromoCodes = {
        'SAVE10': { type: 'percentage', value: 10 },
        'NEWUSER': { type: 'fixed', value: 20 },
        'FREESHIP': { type: 'shipping', value: 0 }
    };
    
    if (validPromoCodes[promoCode]) {
        const promo = validPromoCodes[promoCode];
        
        if (promo.type === 'percentage') {
            orderData.totals.discount = Math.round(orderData.totals.subtotal * (promo.value / 100));
        } else if (promo.type === 'fixed') {
            orderData.totals.discount = promo.value;
        } else if (promo.type === 'shipping') {
            orderData.totals.deliveryFee = 0;
            document.getElementById('deliveryFee').textContent = 'FREE';
        }
        
        calculateTotals();
        showNotification(`Promo code applied! You saved GH₵ ${orderData.totals.discount}`, 'success');
        promoCodeInput.disabled = true;
        promoCodeInput.nextElementSibling.textContent = 'Applied';
        promoCodeInput.nextElementSibling.disabled = true;
    } else {
        showNotification('Invalid promo code', 'error');
        promoCodeInput.focus();
    }
}

function validateField(event) {
    const field = event.target;
    const value = field.value.trim();
    
    // Remove existing error
    clearFieldError(event);
    
    let isValid = true;
    let errorMessage = '';
    
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    } else if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    } else if (field.type === 'tel' && value) {
        const phoneRegex = /^\+233\s?\d{2}\s?\d{3}\s?\d{4}$/;
        if (!phoneRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid Ghana phone number (+233 XX XXX XXXX)';
        }
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

function showFieldError(field, message) {
    field.classList.add('error');
    
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add new error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(event) {
    const field = event.target;
    field.classList.remove('error');
    
    const errorMessage = field.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

function validateForm() {
    const form = document.getElementById('checkoutForm');
    const requiredFields = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        const fieldValid = validateField({ target: field });
        if (!fieldValid) {
            isValid = false;
        }
    });
    
    return isValid;
}

function prefillUserData() {
    // Simulate pre-filling data for logged-in users
    // In a real app, this would come from user authentication
    const userData = {
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
    };
    
    // Only fill if data exists
    Object.keys(userData).forEach(key => {
        if (userData[key]) {
            const field = document.getElementById(key);
            if (field) {
                field.value = userData[key];
            }
        }
    });
}

function collectFormData() {
    const form = document.getElementById('checkoutForm');
    const formData = new FormData(form);
    
    orderData.customer = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone')
    };
    
    orderData.delivery = {
        address: formData.get('address'),
        city: formData.get('city'),
        region: formData.get('region'),
        deliveryType: formData.get('deliveryType'),
        notes: formData.get('notes')
    };
    
    orderData.paymentMethod = formData.get('paymentMethod');
    orderData.deliveryType = formData.get('deliveryType');
}

function placeOrder() {
    // Validate form
    if (!validateForm()) {
        showNotification('Please fill in all required fields correctly', 'error');
        return;
    }
    
    // Collect form data
    collectFormData();
    
    // Show loading modal
    showLoadingModal();
    
    // Simulate order processing
    setTimeout(() => {
        processOrder();
    }, 2000);
}

function showLoadingModal() {
    const modal = document.getElementById('loadingModal');
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function hideLoadingModal() {
    const modal = document.getElementById('loadingModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function processOrder() {
    hideLoadingModal();
    
    // Generate order ID
    const orderId = 'SKT' + Date.now().toString().slice(-8);
    orderData.orderId = orderId;
    orderData.orderDate = new Date().toISOString();
    orderData.status = 'pending';
    
    // Store order data
    const orders = JSON.parse(localStorage.getItem('somaKoTradeOrders')) || [];
    orders.push(orderData);
    localStorage.setItem('somaKoTradeOrders', JSON.stringify(orders));
    
    if (orderData.paymentMethod === 'online') {
        // Redirect to Soma Ko Pay for online payment
        redirectToSomaKoPay();
    } else {
        // Redirect to success page for cash on delivery
        redirectToSuccessPage();
    }
}

function redirectToSomaKoPay() {
    // Prepare payment data for Soma Ko Pay
    const paymentData = {
        orderId: orderData.orderId,
        amount: orderData.totals.total,
        currency: 'GHS',
        customer: orderData.customer,
        items: orderData.items,
        returnUrl: `${window.location.origin}/soma-ko-trade/order-success.html?orderId=${orderData.orderId}`,
        cancelUrl: `${window.location.origin}/soma-ko-trade/checkout.html`
    };
    
    // Store payment data for Soma Ko Pay
    localStorage.setItem('somaKoPaymentData', JSON.stringify(paymentData));
    
    // Clear cart
    localStorage.removeItem('somaKoTradeCart');
    
    // Redirect to Soma Ko Pay
    window.location.href = `../soma-ko-pay/payment.html?orderId=${orderData.orderId}&amount=${orderData.totals.total}`;
}

function redirectToSuccessPage() {
    // Clear cart
    localStorage.removeItem('somaKoTradeCart');
    
    // Redirect to success page
    window.location.href = `order-success.html?orderId=${orderData.orderId}`;
}

function showEmptyCartMessage() {
    const checkoutSection = document.querySelector('.checkout-section');
    checkoutSection.innerHTML = `
        <div class="container">
            <div class="empty-cart-message">
                <i class="fas fa-shopping-cart"></i>
                <h2>Your cart is empty</h2>
                <p>Add some products to your cart before proceeding to checkout.</p>
                <a href="products.html" class="btn btn-primary">Browse Products</a>
            </div>
        </div>
    `;
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
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

// Email notification simulation
function sendOrderConfirmationEmail() {
    // In a real application, this would trigger an actual email
    console.log('Order confirmation email sent to:', orderData.customer.email);
    console.log('Admin notification email sent for order:', orderData.orderId);
    
    // Simulate email data
    const emailData = {
        to: orderData.customer.email,
        subject: `Order Confirmation - ${orderData.orderId}`,
        orderDetails: orderData,
        timestamp: new Date().toISOString()
    };
    
    // Store email log for demonstration
    const emailLogs = JSON.parse(localStorage.getItem('somaKoEmailLogs')) || [];
    emailLogs.push(emailData);
    localStorage.setItem('somaKoEmailLogs', JSON.stringify(emailLogs));
}

// Initialize phone number formatting
document.getElementById('phone').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.startsWith('233')) {
        value = value.substring(3);
    } else if (value.startsWith('0')) {
        value = value.substring(1);
    }
    
    if (value.length > 0) {
        let formatted = '+233';
        if (value.length > 0) formatted += ' ' + value.substring(0, 2);
        if (value.length > 2) formatted += ' ' + value.substring(2, 5);
        if (value.length > 5) formatted += ' ' + value.substring(5, 9);
        
        e.target.value = formatted;
    }
});
