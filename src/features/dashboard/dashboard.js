import { db } from '../../core/db.js';

export async function render(container, state) {
    container.innerHTML = `
        <div class="dashboard-grid">
            <!-- KPI Cards -->
            <div class="kpi-card premium glass-card">
                <div class="kpi-header">
                    <span class="kpi-title">TOTAL REVENUE</span>
                    <i class="ph ph-trend-up"></i>
                </div>
                <div class="kpi-value">₹2,45,670</div>
                <div class="kpi-subtext">REAL-TIME DATA</div>
                <canvas id="revenue-sparkline" class="sparkline"></canvas>
            </div>

            <div class="kpi-card glass-card">
                <div class="kpi-header">
                    <span class="kpi-title">NET PROFIT</span>
                    <i class="ph ph-coins" style="color: var(--success)"></i>
                </div>
                <div class="kpi-value" style="color: var(--success)">₹1,12,040</div>
                <div class="kpi-subtext">REVENUE - EXPENSES</div>
                <canvas id="profit-sparkline" class="sparkline"></canvas>
            </div>

            <div class="kpi-card glass-card">
                <div class="kpi-header">
                    <span class="kpi-title">TOTAL EXPENSES</span>
                    <i class="ph ph-receipt" style="color: var(--danger)"></i>
                </div>
                <div class="kpi-value" style="color: var(--danger)">₹84,320</div>
                <div class="kpi-subtext">OPERATIONAL COSTS</div>
                <canvas id="expenses-sparkline" class="sparkline"></canvas>
            </div>

            <div class="kpi-card glass-card">
                <div class="kpi-header">
                    <span class="kpi-title">NEXT DAY FORECAST</span>
                    <i class="ph ph-magic-wand" style="color: var(--secondary)"></i>
                </div>
                <div class="kpi-value">₹42,000</div>
                <div class="kpi-subtext">PROJECTION ENGINE</div>
                <canvas id="forecast-sparkline" class="sparkline"></canvas>
            </div>
        </div>

        <div class="analytics-row">
            <div class="chart-container glass-card main-chart">
                <h3 class="chart-title">REVENUE TRENDS (LAST 7 DAYS)</h3>
                <canvas id="revenue-main-chart"></canvas>
            </div>
            <div class="chart-container glass-card secondary-chart">
                <h3 class="chart-title">INVENTORY MIX</h3>
                <canvas id="inventory-mix-chart"></canvas>
            </div>
        </div>

        <div class="history-row">
            <div class="glass-card transaction-history">
                <div class="history-header">
                    <h3 class="chart-title">REAL-TIME TRANSACTIONS</h3>
                    <button class="text-btn">VIEW ALL</button>
                </div>
                <div class="transaction-list" id="recent-transactions">
                    <div class="loading-placeholder">Loading transactions...</div>
                </div>
            </div>
        </div>
    `;

    initCharts();
    loadRecentTransactions();
}

function initCharts() {
    // Main Revenue Chart
    const ctx = document.getElementById('revenue-main-chart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Revenue',
                data: [12000, 19000, 15000, 25000, 22000, 30000, 45000],
                borderColor: '#C89B3C',
                backgroundColor: 'rgba(200, 155, 60, 0.1)',
                fill: true,
                tension: 0.4,
                borderWidth: 3,
                pointRadius: 4,
                pointBackgroundColor: '#C89B3C'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: { display: false },
                x: {
                    grid: { display: false },
                    ticks: { color: '#94A3B8', font: { family: 'Outfit' } }
                }
            }
        }
    });

    // Inventory Mix Chart
    const mixCtx = document.getElementById('inventory-mix-chart').getContext('2d');
    new Chart(mixCtx, {
        type: 'doughnut',
        data: {
            labels: ['Food', 'Beverages', 'Electronics', 'Apparel'],
            datasets: [{
                data: [45, 25, 20, 10],
                backgroundColor: ['#C89B3C', '#6366F1', '#22C55E', '#EF4444'],
                borderWidth: 0,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: '#94A3B8', font: { family: 'Outfit', size: 10 } }
                }
            }
        }
    });
}

async function loadRecentTransactions() {
    const list = document.getElementById('recent-transactions');
    const transactions = [
        { id: 'TXN-42091', time: '10:45 AM', amount: '₹1,240', status: 'SUCCESS' },
        { id: 'TXN-42090', time: '10:32 AM', amount: '₹850', status: 'SUCCESS' },
        { id: 'TXN-42089', time: '10:15 AM', amount: '₹2,100', status: 'ANOMALY' },
        { id: 'TXN-42088', time: '09:58 AM', amount: '₹450', status: 'SUCCESS' }
    ];

    list.innerHTML = transactions.map(t => `
        <div class="transaction-item">
            <div class="tx-info">
                <span class="tx-id">${t.id}</span>
                <span class="tx-time">${t.time}</span>
            </div>
            ${t.status === 'ANOMALY' ? '<span class="anomaly-badge">ANOMALY</span>' : ''}
            <span class="tx-amount">${t.amount}</span>
        </div>
    `).join('');
}
