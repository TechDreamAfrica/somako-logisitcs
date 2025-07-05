// Shared Authentication System for Soma Ko Logistics
class SomaKoAuth {
    constructor() {
        this.currentUser = JSON.parse(sessionStorage.getItem('somaKoUser')) || null;
        this.isAuthenticated = !!this.currentUser;
        
        // Demo users for testing
        this.demoUsers = {
            'admin@somako.com': {
                email: 'admin@somako.com',
                password: 'admin123',
                role: 'admin',
                name: 'System Administrator',
                permissions: ['dashboard', 'inventory', 'orders', 'riders', 'vendors', 'reports', 'settings']
            },
            'rider@somako.com': {
                email: 'rider@somako.com',
                password: 'rider123',
                role: 'rider',
                name: 'Delivery Rider',
                permissions: ['dashboard', 'orders']
            },
            'vendor@somako.com': {
                email: 'vendor@somako.com',
                password: 'vendor123',
                role: 'vendor',
                name: 'Food Vendor',
                permissions: ['foods', 'orders', 'inventory']
            },
            'pharmacy@somako.com': {
                email: 'pharmacy@somako.com',
                password: 'pharmacy123',
                role: 'pharmacy',
                name: 'Pharmacy Owner',
                permissions: ['pharmacy', 'orders', 'inventory']
            }
        };
    }

    // Login method
    login(email, password, service) {
        const user = this.demoUsers[email];
        
        if (user && user.password === password) {
            const userSession = {
                ...user,
                service: service,
                loginTime: new Date().toISOString()
            };
            
            delete userSession.password; // Don't store password in session
            
            sessionStorage.setItem('somaKoUser', JSON.stringify(userSession));
            this.currentUser = userSession;
            this.isAuthenticated = true;
            
            return { success: true, user: userSession };
        }
        
        return { success: false, message: 'Invalid credentials' };
    }

    // Logout method
    logout() {
        sessionStorage.removeItem('somaKoUser');
        this.currentUser = null;
        this.isAuthenticated = false;
        window.location.href = '../shared/login.html';
    }

    // Check if user has permission
    hasPermission(permission) {
        if (!this.isAuthenticated || !this.currentUser) {
            return false;
        }
        return this.currentUser.permissions.includes(permission);
    }

    // Check if user has role
    hasRole(role) {
        if (!this.isAuthenticated || !this.currentUser) {
            return false;
        }
        return this.currentUser.role === role;
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Require authentication
    requireAuth() {
        if (!this.isAuthenticated) {
            window.location.href = '../shared/login.html';
            return false;
        }
        return true;
    }

    // Require specific permission
    requirePermission(permission) {
        if (!this.requireAuth()) {
            return false;
        }
        
        if (!this.hasPermission(permission)) {
            this.showAccessDenied();
            return false;
        }
        
        return true;
    }

    // Show access denied message
    showAccessDenied() {
        alert('Access denied. You do not have permission to access this resource.');
        window.history.back();
    }

    // Initialize auth on page load
    init() {
        // Check if on login page
        if (window.location.pathname.includes('login.html')) {
            if (this.isAuthenticated) {
                this.redirectToDashboard();
            }
            return;
        }

        // Require authentication for all other pages
        if (!this.requireAuth()) {
            return;
        }

        // Display user info if element exists
        this.displayUserInfo();
    }

    // Redirect to appropriate dashboard
    redirectToDashboard() {
        if (!this.currentUser) return;

        const service = this.currentUser.service;
        const role = this.currentUser.role;

        switch (service) {
            case 'dashboard':
                window.location.href = '../soma-ko-dashboard/index.html';
                break;
            case 'foods':
                window.location.href = '../soma-ko-foods/index.html';
                break;
            case 'express':
                window.location.href = '../soma-ko-express/index.html';
                break;
            case 'pharmacy':
                window.location.href = '../soma-ko-pharmacy/index.html';
                break;
            case 'pay':
                window.location.href = '../soma-ko-pay/index.html';
                break;
            default:
                window.location.href = '../soma-ko-dashboard/index.html';
        }
    }

    // Display user info in UI
    displayUserInfo() {
        const userInfoElement = document.getElementById('user-info');
        const userNameElement = document.getElementById('user-name');
        
        if (userInfoElement && this.currentUser) {
            userInfoElement.textContent = this.currentUser.name;
        }
        
        if (userNameElement && this.currentUser) {
            userNameElement.textContent = this.currentUser.name;
        }
    }
}

// Global auth instance
const somaKoAuth = new SomaKoAuth();

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    somaKoAuth.init();
});
