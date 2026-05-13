import { db, seedDatabase } from './core/db.js';

// Global State
const state = {
    currentUser: { name: 'Admin', role: 'admin' },
    activeRoute: 'dashboard',
    settings: {}
};

// Navigation Config
const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'ph-squares-four' },
    { id: 'pos', label: 'POS Terminal', icon: 'ph-shopping-cart' },
    { id: 'inventory', label: 'Inventory', icon: 'ph-package' },
    { id: 'sales', label: 'Sales History', icon: 'ph-receipt' },
    { id: 'customers', label: 'Customers', icon: 'ph-users' },
    { id: 'reports', label: 'Reports', icon: 'ph-chart-line' },
    { id: 'settings', label: 'Settings', icon: 'ph-gear' }
];

// Initialize App
async function init() {
    console.log("🚀 Bloomeor POS Web starting...");
    
    await seedDatabase();
    await loadSettings();
    
    renderSidebar();
    updateUserUI();
    
    // Initial Route
    handleRoute('dashboard');

    // Command Palette Listener
    window.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'k') {
            e.preventDefault();
            console.log("Command Palette Triggered");
        }
    });
}

async function loadSettings() {
    const allSettings = await db.settings.toArray();
    allSettings.forEach(s => state.settings[s.key] = s.value);
}

function updateUserUI() {
    document.getElementById('current-user').textContent = state.currentUser.name;
    document.getElementById('current-role').textContent = state.currentUser.role;
}

function renderSidebar() {
    const nav = document.getElementById('sidebar-nav');
    nav.innerHTML = navItems.map(item => `
        <a class="nav-item ${state.activeRoute === item.id ? 'active' : ''}" data-route="${item.id}">
            <i class="ph ${item.icon}"></i>
            <span>${item.label}</span>
        </a>
    `).join('');

    nav.querySelectorAll('.nav-item').forEach(el => {
        el.addEventListener('click', () => handleRoute(el.dataset.route));
    });
}

function handleRoute(routeId) {
    state.activeRoute = routeId;
    renderSidebar();
    
    const pageTitle = document.getElementById('page-title');
    const item = navItems.find(i => i.id === routeId);
    pageTitle.textContent = item ? item.label : 'Bloomeor';

    loadModule(routeId);
}

async function loadModule(routeId) {
    const content = document.getElementById('content-area');
    content.innerHTML = `<div class="loader">Loading ${routeId}...</div>`;

    // Inject CSS if it exists
    const cssId = `module-css-${routeId}`;
    if (!document.getElementById(cssId)) {
        const link = document.createElement('link');
        link.id = cssId;
        link.rel = 'stylesheet';
        link.href = `./src/features/${routeId}/${routeId}.css`;
        document.head.appendChild(link);
    }

    try {
        const module = await import(`./features/${routeId}/${routeId}.js`);
        module.render(content, state);
    } catch (err) {
        console.error(`Failed to load module ${routeId}:`, err);
        content.innerHTML = `
            <div class="glass-card">
                <h2>Module Under Construction</h2>
                <p>The ${routeId} feature is currently being ported to the web version.</p>
                <button onclick="window.location.reload()" class="btn-primary">Retry</button>
            </div>
        `;
    }
}

// Global Exports
window.state = state;
window.navigate = handleRoute;

init();
