// Bloomeor POS - Database Service (IndexedDB)
// Powered by Dexie.js for high-performance offline persistence

const db = new Dexie("BloomeorPOS");

db.version(1).stores({
    products: "++id, name, sku, category, isLowStock, isFastMoving",
    sales: "++id, date, total, status, customerId",
    customers: "++id, name, phone, email, gstin",
    ledger: "++id, date, account, type, amount",
    settings: "key, value",
    staff: "++id, username, role, name"
});

// Seed Initial Data if empty
async function seedDatabase() {
    const productCount = await db.products.count();
    if (productCount === 0) {
        console.log("🌱 Seeding initial data...");
        await db.products.bulkAdd([
            { name: "Enterprise Burger", sku: "EB-001", category: "Food", sellRate: 250, qty: 50, unit: "Unit", isLowStock: false },
            { name: "Cloud Fries", sku: "CF-002", category: "Sides", sellRate: 120, qty: 10, unit: "Pack", isLowStock: true },
            { name: "Sovereign Soda", sku: "SS-003", category: "Beverages", sellRate: 80, qty: 100, unit: "Bottle", isLowStock: false }
        ]);

        await db.staff.bulkAdd([
            { username: "admin", role: "admin", name: "System Administrator" },
            { username: "cashier1", role: "cashier", name: "John Doe" }
        ]);
        
        await db.settings.bulkAdd([
            { key: "business_name", value: "Bloomeor Premium Retail" },
            { key: "currency", value: "₹" },
            { key: "gst_rate", value: 18 }
        ]);
    }
}

export { db, seedDatabase };
