document.addEventListener('DOMContentLoaded', () => {
    // Shared: Update Cart Count on Load
    updateCartCount();

    // Page Specific Logic
    if (document.querySelector('.products-section')) {
        initProductPage(); // Logic for index.html
    } else if (document.querySelector('.checkout-container')) {
        initCheckoutPage(); // Logic for checkout.html
    }
});

// --- Core Cart Functions ---

function getCart() {
    return JSON.parse(localStorage.getItem('shopzaCart')) || [];
}

function saveCart(cart) {
    localStorage.setItem('shopzaCart', JSON.stringify(cart));
    updateCartCount();
}

function addToCart(product) {
    let cart = getCart();
    cart.push(product);
    saveCart(cart);
}

function updateCartCount() {
    const cart = getCart();
    const countElements = document.querySelectorAll('.cart-count');
    countElements.forEach(el => {
        el.textContent = cart.length;
    });
}

// --- Page Specific Functions ---

function initProductPage() {
    const addToCartButtons = document.querySelectorAll('.btn-add-cart');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const btn = e.target;
            const product = {
                name: btn.dataset.name,
                price: parseInt(btn.dataset.price),
                image: btn.closest('.product-card').querySelector('img').src
            };

            addToCart(product);

            // BUTTON FEEDBACK
            const originalText = btn.textContent;
            btn.textContent = 'Added!';
            btn.style.backgroundColor = '#D4AF37'; // Gold
            btn.style.color = '#000';

            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.backgroundColor = '';
                btn.style.color = '';
            }, 1000);
        });
    });

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

function initCheckoutPage() {
    const cart = getCart();
    const orderItemsContainer = document.getElementById('order-items');
    const subtotalElement = document.getElementById('subtotal-price');
    const totalElement = document.getElementById('total-price');
    const checkoutForm = document.getElementById('checkout-form');

    if (cart.length === 0) {
        orderItemsContainer.innerHTML = '<p style="color: #666; font-style: italic;">Your cart is empty.</p>';
        return;
    }

    // Clear loading/empty text
    orderItemsContainer.innerHTML = '';

    let total = 0;

    cart.forEach(item => {
        total += item.price;
        const itemElement = document.createElement('div');
        itemElement.classList.add('summary-item');
        itemElement.innerHTML = `
            <div class="summary-item-info">
                <img src="${item.image}" alt="${item.name}" class="summary-item-img">
                <div>
                    <h4 style="font-size: 0.9rem; margin-bottom: 2px;">${item.name}</h4>
                    <span style="color: var(--primary-color); font-weight: 600;">₹${item.price.toLocaleString()}</span>
                </div>
            </div>
        `;
        orderItemsContainer.appendChild(itemElement);
    });

    // Update Totals
    subtotalElement.textContent = `₹${total.toLocaleString()}`;
    totalElement.textContent = `₹${total.toLocaleString()}`;

    // Handle Form Submission
    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you for your order! This is a demo checkout.');
        localStorage.removeItem('shopzaCart');
        window.location.href = 'index.html';
    });
}
