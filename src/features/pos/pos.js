import { db } from '../../core/db.js';

let cart = [];

export async function render(container, state) {
    const products = await db.products.toArray();
    const categories = ['All', ...new Set(products.map(p => p.category))];

    container.innerHTML = `
        <div class="pos-container">
            <!-- Left: Explorer -->
            <section class="inventory-explorer glass-card">
                <div class="explorer-header">
                    <h2>Inventory Explorer</h2>
                    <div class="sync-status">
                        <i class="ph ph-arrows-clockwise"></i>
                        <span>SYNC REFRESH</span>
                    </div>
                </div>

                <div class="hotkey-hints">
                    <span class="hint">F1 Search</span>
                    <span class="hint">F2 Customer</span>
                    <span class="hint">F5 Pay</span>
                </div>

                <div class="search-bar">
                    <i class="ph ph-magnifying-glass"></i>
                    <input type="text" id="pos-search" placeholder="Search products by name or SKU...">
                </div>

                <div class="category-pills" id="category-pills">
                    ${categories.map(cat => `<button class="pill ${cat === 'All' ? 'active' : ''}">${cat}</button>`).join('')}
                </div>

                <div class="product-grid" id="product-grid">
                    ${renderProducts(products)}
                </div>
            </section>

            <!-- Right: Cart -->
            <section class="active-ticket glass-card">
                <div class="ticket-header">
                    <h2>Active Ticket</h2>
                    <button class="icon-btn" id="clear-cart"><i class="ph ph-trash"></i></button>
                </div>

                <div class="customer-section">
                    <div class="customer-pill">
                        <i class="ph ph-user-plus"></i>
                        <span>Walk-in Customer</span>
                    </div>
                </div>

                <div class="cart-items" id="cart-items">
                    <div class="empty-cart">
                        <i class="ph ph-shopping-cart-simple"></i>
                        <p>Your ticket is empty</p>
                    </div>
                </div>

                <div class="ticket-footer">
                    <div class="totals">
                        <div class="total-row">
                            <span>Subtotal</span>
                            <span id="subtotal">₹0.00</span>
                        </div>
                        <div class="total-row">
                            <span>Tax (GST 18%)</span>
                            <span id="tax">₹0.00</span>
                        </div>
                        <div class="total-row grand-total">
                            <span>Total</span>
                            <span id="grand-total">₹0.00</span>
                        </div>
                    </div>
                    <button class="checkout-btn" id="checkout-btn" disabled>
                        <span>PROCESS CHECKOUT</span>
                        <i class="ph ph-arrow-right"></i>
                    </button>
                </div>
            </section>
        </div>
    `;

    // Event Listeners
    setupListeners(products);
}

function renderProducts(products) {
    return products.map(p => `
        <div class="product-card" data-id="${p.id}">
            <div class="product-info">
                <span class="product-name">${p.name}</span>
                <span class="product-sku">${p.sku}</span>
            </div>
            <div class="product-footer">
                <span class="product-price">₹${p.sellRate}</span>
                <span class="stock-badge ${p.isLowStock ? 'low' : ''}">${p.qty} ${p.unit}</span>
            </div>
        </div>
    `).join('');
}

function setupListeners(allProducts) {
    const grid = document.getElementById('product-grid');
    const search = document.getElementById('pos-search');
    const pills = document.getElementById('category-pills');
    const clearBtn = document.getElementById('clear-cart');
    const checkoutBtn = document.getElementById('checkout-btn');

    grid.addEventListener('click', (e) => {
        const card = e.target.closest('.product-card');
        if (card) {
            const id = parseInt(card.dataset.id);
            const product = allProducts.find(p => p.id === id);
            addToCart(product);
        }
    });

    search.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const filtered = allProducts.filter(p => p.name.toLowerCase().includes(query) || p.sku.toLowerCase().includes(query));
        grid.innerHTML = renderProducts(filtered);
    });

    pills.addEventListener('click', (e) => {
        if (e.target.classList.contains('pill')) {
            pills.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
            e.target.classList.add('active');
            const cat = e.target.textContent;
            const filtered = cat === 'All' ? allProducts : allProducts.filter(p => p.category === cat);
            grid.innerHTML = renderProducts(filtered);
        }
    });

    clearBtn.addEventListener('click', () => {
        cart = [];
        updateCartUI();
    });

    checkoutBtn.addEventListener('click', () => {
        handleCheckout();
    });
}

function addToCart(product) {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
        existing.qty++;
    } else {
        cart.push({ ...product, qty: 1 });
    }
    updateCartUI();
}

function updateCartUI() {
    const itemsContainer = document.getElementById('cart-items');
    const subtotalEl = document.getElementById('subtotal');
    const taxEl = document.getElementById('tax');
    const totalEl = document.getElementById('grand-total');
    const checkoutBtn = document.getElementById('checkout-btn');

    if (cart.length === 0) {
        itemsContainer.innerHTML = `
            <div class="empty-cart">
                <i class="ph ph-shopping-cart-simple"></i>
                <p>Your ticket is empty</p>
            </div>
        `;
        subtotalEl.textContent = '₹0.00';
        taxEl.textContent = '₹0.00';
        totalEl.textContent = '₹0.00';
        checkoutBtn.disabled = true;
        return;
    }

    itemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="item-info">
                <span class="item-name">${item.name}</span>
                <span class="item-meta">₹${item.sellRate} x ${item.qty}</span>
            </div>
            <div class="item-actions">
                <span class="item-total">₹${item.sellRate * item.qty}</span>
            </div>
        </div>
    `).join('');

    const subtotal = cart.reduce((acc, item) => acc + (item.sellRate * item.qty), 0);
    const tax = subtotal * 0.18;
    const total = subtotal + tax;

    subtotalEl.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
    taxEl.textContent = `₹${tax.toLocaleString('en-IN')}`;
    totalEl.textContent = `₹${total.toLocaleString('en-IN')}`;
    checkoutBtn.disabled = false;
}

async function handleCheckout() {
    console.log("Processing checkout...", cart);
    alert("Checkout Successful! (Simulated)");
    cart = [];
    updateCartUI();
}
