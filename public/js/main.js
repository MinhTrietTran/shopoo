// Main JavaScript for Shopoo
document.addEventListener('DOMContentLoaded', function () {

    // Initialize tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Auto hide alerts after 5 seconds
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(function (alert) {
        setTimeout(function () {
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        }, 5000);
    });

    // Search form enhancement
    const searchForm = document.querySelector('form[action="/products/search"]');
    if (searchForm) {
        searchForm.addEventListener('submit', function (e) {
            const searchInput = this.querySelector('input[name="q"]');
            if (!searchInput.value.trim()) {
                e.preventDefault();
                searchInput.focus();
                return false;
            }
        });
    }

    // Loading state for buttons
    document.addEventListener('click', function (e) {
        if (e.target.matches('.btn[type="submit"]') || e.target.matches('.btn-loading')) {
            showButtonLoading(e.target);
        }
    });

    // Cart functionality
    window.Cart = {
        add: function (productId, quantity = 1) {
            return fetch('/api/cart/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ productId, quantity })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        this.updateCartCounter();
                        showNotification('Đã thêm vào giỏ hàng', 'success');
                    } else {
                        showNotification(data.message || 'Có lỗi xảy ra', 'error');
                    }
                    return data;
                })
                .catch(error => {
                    console.error('Error:', error);
                    showNotification('Có lỗi xảy ra', 'error');
                });
        },

        remove: function (productId) {
            return fetch(`/api/cart/remove/${productId}`, {
                method: 'DELETE',
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        this.updateCartCounter();
                        showNotification('Đã xóa khỏi giỏ hàng', 'success');
                    } else {
                        showNotification(data.message || 'Có lỗi xảy ra', 'error');
                    }
                    return data;
                });
        },

        update: function (productId, quantity) {
            return fetch('/api/cart/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ productId, quantity })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        this.updateCartCounter();
                    } else {
                        showNotification(data.message || 'Có lỗi xảy ra', 'error');
                    }
                    return data;
                });
        },

        updateCartCounter: function () {
            fetch('/api/cart')
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        const counter = document.querySelector('.navbar .badge');
                        if (counter) {
                            counter.textContent = data.data.totalItems || 0;
                        }
                    }
                });
        }
    };

    // Initialize cart counter
    Cart.updateCartCounter();
});

// Utility functions
function showButtonLoading(button) {
    const originalText = button.innerHTML;
    button.innerHTML = '<span class="spinner"></span> Đang xử lý...';
    button.disabled = true;

    // Reset after 5 seconds max
    setTimeout(function () {
        button.innerHTML = originalText;
        button.disabled = false;
    }, 5000);
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';

    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(function () {
        if (notification.parentNode) {
            const bsAlert = new bootstrap.Alert(notification);
            bsAlert.close();
        }
    }, 5000);
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
}

function formatNumber(number) {
    return new Intl.NumberFormat('vi-VN').format(number);
}

// Image lazy loading
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for older browsers
        images.forEach(img => {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
        });
    }
}

// Initialize lazy loading when DOM is ready
document.addEventListener('DOMContentLoaded', initLazyLoading);

// Export functions for global use
window.showNotification = showNotification;
window.formatCurrency = formatCurrency;
window.formatNumber = formatNumber;
