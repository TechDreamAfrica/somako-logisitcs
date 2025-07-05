// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.style.background = 'var(--white)';
            navbar.style.backdropFilter = 'none';
        }
        
        lastScrollTop = scrollTop;
    });

    // Animate statistics on scroll
    const animateStats = () => {
        const stats = document.querySelectorAll('.stat-number');
        const statsSection = document.querySelector('.stats');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    stats.forEach(stat => {
                        const finalValue = parseInt(stat.textContent.replace(/[^0-9]/g, ''));
                        let currentValue = 0;
                        const increment = finalValue / 100;
                        const timer = setInterval(() => {
                            currentValue += increment;
                            if (currentValue >= finalValue) {
                                stat.textContent = stat.textContent.replace(/[0-9]+/, finalValue);
                                clearInterval(timer);
                            } else {
                                stat.textContent = stat.textContent.replace(/[0-9]+/, Math.floor(currentValue));
                            }
                        }, 20);
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        if (statsSection) {
            observer.observe(statsSection);
        }
    };

    // Initialize stats animation
    animateStats();

    // Form submission handlers
    const quoteForm = document.querySelector('.quote-form');
    const contactForm = document.querySelector('.contact-form form');

    if (quoteForm) {
        quoteForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmission(this, 'quote');
        });
    }

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmission(this, 'contact');
        });
    }

    function handleFormSubmission(form, type) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        // Show loading state
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';
        
        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            submitBtn.textContent = 'Sent!';
            submitBtn.style.background = 'var(--light-green)';
            
            // Show success message
            showNotification(`${type === 'quote' ? 'Quote request' : 'Message'} sent successfully! We'll get back to you soon.`, 'success');
            
            // Reset form
            form.reset();
            
            // Reset button after 3 seconds
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
                submitBtn.style.background = '';
            }, 3000);
        }, 2000);
    }

    // Notification system
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? 'var(--light-green)' : 'var(--primary-green)'};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 10000;
            min-width: 300px;
            animation: slideIn 0.3s ease;
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            .notification-content {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .notification-close {
                background: none;
                border: none;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
                margin-left: auto;
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(notification);
        
        // Close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.remove();
        });
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Animate elements on scroll
    const animateElements = document.querySelectorAll('.service-card, .contact-item, .about-text, .about-image');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroImage = document.querySelector('.delivery-truck');
        if (heroImage && scrolled < window.innerHeight) {
            heroImage.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
    });

    // Service cards hover effect enhancement
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Typing effect for hero title
    const heroTitle = document.querySelector('.hero-content h1');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        heroTitle.style.borderRight = '2px solid var(--accent-yellow)';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            } else {
                setTimeout(() => {
                    heroTitle.style.borderRight = 'none';
                }, 500);
            }
        };
        
        // Start typing effect after a short delay
        setTimeout(typeWriter, 1000);
    }

    // Form validation
    function validateForm(form) {
        const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                input.style.borderColor = '#e74c3c';
                isValid = false;
            } else {
                input.style.borderColor = '#e1e8ed';
            }
        });
        
        // Email validation
        const emailInputs = form.querySelectorAll('input[type="email"]');
        emailInputs.forEach(input => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (input.value && !emailRegex.test(input.value)) {
                input.style.borderColor = '#e74c3c';
                isValid = false;
            }
        });
        
        return isValid;
    }

    // Add real-time validation to form inputs
    const formInputs = document.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.hasAttribute('required') && !this.value.trim()) {
                this.style.borderColor = '#e74c3c';
            } else {
                this.style.borderColor = 'var(--primary-green)';
            }
        });
        
        input.addEventListener('focus', function() {
            this.style.borderColor = 'var(--primary-green)';
        });
    });

    // Add loading animation to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (this.type === 'submit') {
                const form = this.closest('form');
                if (form && !validateForm(form)) {
                    e.preventDefault();
                    showNotification('Please fill in all required fields correctly.', 'error');
                }
            }
        });
    });

    // Lazy loading for images (if any are added later)
    const lazyImages = document.querySelectorAll('img[data-src]');
    if (lazyImages.length > 0) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }

    // Add smooth transitions to all interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .service-card, .contact-item');
    interactiveElements.forEach(element => {
        element.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    });

    // Hero Dropdown Functionality
    const heroDropdown = document.getElementById('heroDropdown');
    const heroDropdownMenu = document.getElementById('heroDropdownMenu');

    if (heroDropdown && heroDropdownMenu) {
        heroDropdown.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            heroDropdownMenu.classList.toggle('show');
            
            // Rotate the chevron icon
            const chevron = heroDropdown.querySelector('.fa-chevron-down');
            if (chevron) {
                chevron.style.transform = heroDropdownMenu.classList.contains('show') ? 'rotate(180deg)' : 'rotate(0deg)';
            }
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!heroDropdown.contains(e.target)) {
                heroDropdownMenu.classList.remove('show');
                const chevron = heroDropdown.querySelector('.fa-chevron-down');
                if (chevron) {
                    chevron.style.transform = 'rotate(0deg)';
                }
            }
        });

        // Prevent dropdown from closing when clicking inside it
        heroDropdownMenu.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }

    // Navigation Dropdown Enhancement
    const navDropdowns = document.querySelectorAll('.nav-link.dropdown');
    
    navDropdowns.forEach(dropdown => {
        const chevron = dropdown.querySelector('.fa-chevron-down');
        
        dropdown.addEventListener('mouseenter', function() {
            if (chevron) {
                chevron.style.transform = 'rotate(180deg)';
            }
        });
        
        dropdown.addEventListener('mouseleave', function() {
            if (chevron) {
                chevron.style.transform = 'rotate(0deg)';
            }
        });
    });

    console.log('Soma Ko Logistics website loaded successfully! 🚚');
});
