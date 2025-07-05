// Order Success Page JavaScript

let currentOrder = null;

// Initialize order success page
document.addEventListener('DOMContentLoaded', function() {
    loadOrderDetails();
});

function loadOrderDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('orderId');
    
    if (!orderId) {
        showOrderNotFound();
        return;
    }
    
    // Load order from localStorage
    const orders = JSON.parse(localStorage.getItem('somaKoTradeOrders')) || [];
    currentOrder = orders.find(order => order.orderId === orderId);
    
    if (!currentOrder) {
        showOrderNotFound();
        return;
    }
    
    // Hide loading state
    setTimeout(() => {
        document.getElementById('loadingState').style.display = 'none';
        document.getElementById('successContent').style.display = 'block';
        
        // Render order details
        renderOrderDetails();
        
        // Send confirmation email (simulation)
        sendOrderConfirmationEmail();
    }, 1500);
}

function showOrderNotFound() {
    document.getElementById('loadingState').style.display = 'none';
    document.getElementById('orderNotFound').style.display = 'block';
}

function renderOrderDetails() {
    // Render basic order info
    document.getElementById('orderIdDisplay').textContent = currentOrder.orderId;
    document.getElementById('orderDateDisplay').textContent = formatDate(currentOrder.orderDate);
    document.getElementById('paymentMethodDisplay').textContent = formatPaymentMethod(currentOrder.paymentMethod);
    document.getElementById('deliveryTypeDisplay').textContent = formatDeliveryType(currentOrder.deliveryType);
    document.getElementById('statusDisplay').textContent = 'Confirmed';
    
    // Show payment step for cash on delivery
    if (currentOrder.paymentMethod === 'cash') {
        document.getElementById('paymentStep').style.display = 'flex';
    }
    
    // Render estimated delivery date
    renderEstimatedDelivery();
    
    // Render order items
    renderOrderItems();
    
    // Render order totals
    renderOrderTotals();
    
    // Render customer info
    renderCustomerInfo();
    
    // Render delivery address
    renderDeliveryAddress();
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatPaymentMethod(method) {
    return method === 'cash' ? 'Payment on Delivery' : 'Online Payment (Soma Ko Pay)';
}

function formatDeliveryType(type) {
    const types = {
        standard: 'Standard Delivery (3-5 days)',
        express: 'Express Delivery (1-2 days)',
        sameday: 'Same Day Delivery'
    };
    return types[type] || 'Standard Delivery';
}

function renderEstimatedDelivery() {
    const orderDate = new Date(currentOrder.orderDate);
    let deliveryDays = 3; // Default for standard
    
    switch (currentOrder.deliveryType) {
        case 'express':
            deliveryDays = 1;
            break;
        case 'sameday':
            deliveryDays = 0;
            break;
        default:
            deliveryDays = 3;
    }
    
    const estimatedDate = new Date(orderDate);
    estimatedDate.setDate(orderDate.getDate() + deliveryDays);
    
    const estimatedDateElement = document.getElementById('estimatedDate');
    if (deliveryDays === 0) {
        estimatedDateElement.textContent = 'Today';
    } else {
        estimatedDateElement.textContent = estimatedDate.toLocaleDateString('en-GB', {
            weekday: 'long',
            month: 'long',
            day: 'numeric'
        });
    }
}

function renderOrderItems() {
    const container = document.getElementById('orderItemsList');
    container.innerHTML = '';
    
    currentOrder.items.forEach(item => {
        const itemElement = createOrderItemElement(item);
        container.appendChild(itemElement);
    });
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
            <div class="item-quantity">Quantity: ${item.quantity}</div>
        </div>
        <div class="item-price">
            <span class="unit-price">GH₵ ${item.price.toLocaleString()} each</span>
            <span class="total-price">GH₵ ${(item.price * item.quantity).toLocaleString()}</span>
        </div>
    `;
    
    return itemDiv;
}

function renderOrderTotals() {
    document.getElementById('summarySubtotal').textContent = `GH₵ ${currentOrder.totals.subtotal.toLocaleString()}`;
    document.getElementById('summaryDelivery').textContent = `GH₵ ${currentOrder.totals.deliveryFee.toLocaleString()}`;
    document.getElementById('summaryTotal').textContent = `GH₵ ${currentOrder.totals.total.toLocaleString()}`;
    
    if (currentOrder.totals.discount > 0) {
        document.getElementById('summaryDiscountRow').style.display = 'flex';
        document.getElementById('summaryDiscount').textContent = `-GH₵ ${currentOrder.totals.discount.toLocaleString()}`;
    }
}

function renderCustomerInfo() {
    const customer = currentOrder.customer;
    document.getElementById('customerName').textContent = `${customer.firstName} ${customer.lastName}`;
    document.getElementById('customerEmail').textContent = customer.email;
    document.getElementById('customerPhone').textContent = customer.phone;
}

function renderDeliveryAddress() {
    const delivery = currentOrder.delivery;
    const addressContainer = document.getElementById('deliveryAddress');
    
    addressContainer.innerHTML = `
        <div class="address-lines">
            <div class="address-line">${delivery.address}</div>
            <div class="address-line">${delivery.city}, ${delivery.region}</div>
        </div>
        ${delivery.notes ? `<div class="delivery-notes"><strong>Notes:</strong> ${delivery.notes}</div>` : ''}
    `;
}

function trackOrder() {
    // Simulate order tracking
    showNotification('Order tracking is coming soon! We\'ll notify you when tracking is available.', 'info');
}

function downloadInvoice() {
    // Simulate invoice download
    generateInvoiceContent();
    showNotification('Invoice download feature is coming soon!', 'info');
}

function generateInvoiceContent() {
    // Generate invoice data structure
    const invoice = {
        invoiceNumber: `INV-${currentOrder.orderId}`,
        invoiceDate: new Date().toISOString(),
        order: currentOrder,
        company: {
            name: 'Soma Ko Trade',
            address: 'Digital Ghana, Accra',
            phone: '+233 123 456 789',
            email: 'orders@somako.com'
        }
    };
    
    // Store invoice for future use
    const invoices = JSON.parse(localStorage.getItem('somaKoInvoices')) || [];
    invoices.push(invoice);
    localStorage.setItem('somaKoInvoices', JSON.stringify(invoices));
    
    console.log('Invoice generated:', invoice);
}

function sendOrderConfirmationEmail() {
    // Simulate sending confirmation email
    const emailData = {
        to: currentOrder.customer.email,
        cc: 'orders@somako.com', // Admin notification
        subject: `Order Confirmation - ${currentOrder.orderId}`,
        orderDetails: currentOrder,
        timestamp: new Date().toISOString(),
        type: 'order_confirmation'
    };
    
    // Store email log
    const emailLogs = JSON.parse(localStorage.getItem('somaKoEmailLogs')) || [];
    emailLogs.push(emailData);
    localStorage.setItem('somaKoEmailLogs', JSON.stringify(emailLogs));
    
    // Simulate admin notification email
    const adminEmailData = {
        to: 'admin@somako.com',
        subject: `New Order Received - ${currentOrder.orderId}`,
        orderDetails: currentOrder,
        timestamp: new Date().toISOString(),
        type: 'admin_notification'
    };
    
    emailLogs.push(adminEmailData);
    localStorage.setItem('somaKoEmailLogs', JSON.stringify(emailLogs));
    
    console.log('Order confirmation emails sent:', {
        customer: emailData,
        admin: adminEmailData
    });
    
    // Show confirmation to user
    setTimeout(() => {
        showNotification('Confirmation email sent successfully!', 'success');
    }, 2000);
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
    }, 4000);
}

// Analytics tracking (simulation)
function trackOrderConfirmation() {
    const analyticsData = {
        event: 'order_confirmed',
        orderId: currentOrder.orderId,
        orderValue: currentOrder.totals.total,
        paymentMethod: currentOrder.paymentMethod,
        deliveryType: currentOrder.deliveryType,
        itemCount: currentOrder.items.length,
        timestamp: new Date().toISOString()
    };
    
    // Store analytics data
    const analytics = JSON.parse(localStorage.getItem('somaKoAnalytics')) || [];
    analytics.push(analyticsData);
    localStorage.setItem('somaKoAnalytics', JSON.stringify(analytics));
    
    console.log('Order confirmation tracked:', analyticsData);
}

// Track order confirmation when page loads
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        if (currentOrder) {
            trackOrderConfirmation();
        }
    }, 3000);
});
