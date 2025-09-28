// Import dependencies
import { ethers } from 'ethers';
import stringify from 'json-stable-stringify';
// Note: Semaphore libraries removed for browser compatibility

// Dashboard-enhanced popup script for Order History Extension
let currentOrders = [];
let filteredOrders = [];
let currentView = 'status';
let orderToDelete = null;

document.addEventListener('DOMContentLoaded', function() {
    initializePopup();
    loadStoredOrders();
    setupEventListeners();
    checkAmazonStatus();
});

// Initialize popup interface
function initializePopup() {
    const statusView = document.getElementById('status-view');
    const dashboardView = document.getElementById('dashboard-view');
    
    // Ensure status view is shown by default
    statusView.style.display = 'block';
    dashboardView.style.display = 'none';
    currentView = 'status';
}

// Setup all event listeners
function setupEventListeners() {
    // Navigation buttons
    document.getElementById('dashboard-btn').addEventListener('click', showDashboard);
    document.getElementById('back-btn').addEventListener('click', showStatus);
    
    // Dashboard functionality
    document.getElementById('search-input').addEventListener('input', handleSearch);
    document.getElementById('sort-select').addEventListener('change', handleSort);
    document.getElementById('export-btn').addEventListener('click', exportData);
    document.getElementById('clear-all-btn').addEventListener('click', showClearAllModal);
    
    // Modal handlers
    document.getElementById('cancel-delete').addEventListener('click', hideDeletionModal);
    document.getElementById('confirm-delete').addEventListener('click', confirmDelete);
    document.getElementById('cancel-clear').addEventListener('click', hideClearModal);
    document.getElementById('confirm-clear').addEventListener('click', confirmClearAll);
}

// Enhanced data processing with ethers and json-stable-stringify
function processOrdersWithCrypto(orders) {
    // Use json-stable-stringify for consistent serialization
    const stableStringified = stringify(orders);
    console.log('Stable stringified orders for popup:', stableStringified);
    
    // Example of using ethers for data integrity
    const hash = ethers.keccak256(ethers.toUtf8Bytes(stableStringified));
    console.log('Orders hash:', hash);
    
    return {
        orders: orders,
        hash: hash,
        timestamp: new Date().toISOString()
    };
}

// Generate object hash using the same logic as objectHashBytes32 from claim-and-prove.ts
function generateObjectHash(obj) {
    const canonical = stringify(obj, { space: 0 });
    return ethers.keccak256(ethers.toUtf8Bytes(canonical));
}

// Check Amazon status and update UI
function checkAmazonStatus() {
    const statusElement = document.getElementById('status');
    
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        const currentTab = tabs[0];
        
        if (currentTab.url && currentTab.url.includes('amazon.in')) {
            statusElement.textContent = 'Amazon detected - Extension active';
            statusElement.style.color = '#28a745';
            document.getElementById('dashboard-btn').style.display = 'block';
        } else {
            statusElement.textContent = 'Please visit Amazon.in to use this extension';
            statusElement.style.color = '#dc3545';
            document.getElementById('dashboard-btn').style.display = 'none';
        }
    });
}

// Show dashboard view
function showDashboard() {
    document.getElementById('status-view').style.display = 'none';
    document.getElementById('dashboard-view').style.display = 'block';
    currentView = 'dashboard';
    
    loadStoredOrders();
    renderOrders();
}

// Show status view
function showStatus() {
    document.getElementById('dashboard-view').style.display = 'none';
    document.getElementById('status-view').style.display = 'block';
    currentView = 'status';
    
    checkAmazonStatus();
}

// Load orders from storage
function loadStoredOrders() {
    chrome.storage.local.get(['amazonOrders', 'newOrdersAdded', 'lastOrderUpdate'], function(result) {
        console.log('Loading orders from storage:', result);
        currentOrders = result.amazonOrders || [];
        filteredOrders = [...currentOrders];
        console.log('Loaded orders:', currentOrders.length, 'orders');
        
        // Check if new orders were added since last check
        if (result.newOrdersAdded) {
            console.log('New orders detected, refreshing dashboard');
            chrome.storage.local.set({ newOrdersAdded: false }); // Clear the flag
        }
        
        updateOrderCount();
        updateDashboard();
    });
}

// Update order count display
function updateOrderCount() {
    const countElement = document.getElementById('order-count');
    if (countElement) {
        countElement.textContent = `${filteredOrders.length} orders`;
    }
}

// Render orders in the dashboard
function renderOrders() {
    const ordersContainer = document.getElementById('orders-container');
    if (!ordersContainer) return;
    
    if (filteredOrders.length === 0) {
        ordersContainer.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">No orders found</p>';
        return;
    }
    
    const ordersHTML = filteredOrders.map(order => `
        <div class="order-item" data-order-id="${order.id}">
            <div class="order-header">
                <span class="order-date">${order.dateOrdered}</span>
                <span class="order-total">₹${order.total}</span>
            </div>
            <div class="order-details">
                <div class="order-id">Order #${order.id}</div>
                <div class="order-status">${order.status}</div>
            </div>
            <div class="order-actions">
                <button class="delete-btn" onclick="deleteOrder('${order.id}')">Delete</button>
            </div>
        </div>
    `).join('');
    
    ordersContainer.innerHTML = ordersHTML;
    updateOrderCount();
}

// Handle search
function handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase();
    filteredOrders = currentOrders.filter(order => 
        order.id.toLowerCase().includes(searchTerm) ||
        order.status.toLowerCase().includes(searchTerm) ||
        order.items.some(item => item.name.toLowerCase().includes(searchTerm))
    );
    renderOrders();
}

// Handle sorting
function handleSort(event) {
    const sortBy = event.target.value;
    
    switch(sortBy) {
        case 'date-newest':
            filteredOrders.sort((a, b) => new Date(b.dateOrdered) - new Date(a.dateOrdered));
            break;
        case 'date-oldest':
            filteredOrders.sort((a, b) => new Date(a.dateOrdered) - new Date(b.dateOrdered));
            break;
        case 'amount-high':
            filteredOrders.sort((a, b) => parseFloat(b.total) - parseFloat(a.total));
            break;
        case 'amount-low':
            filteredOrders.sort((a, b) => parseFloat(a.total) - parseFloat(b.total));
            break;
    }
    
    renderOrders();
}

// Export data with crypto processing
function exportData() {
    if (filteredOrders.length === 0) {
        alert('No orders to export');
        return;
    }
    
    // Process orders with crypto functions
    const processedData = processOrdersWithCrypto(filteredOrders);
    
    const dataStr = JSON.stringify(processedData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `amazon-orders-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
}

// Delete order
function deleteOrder(orderId) {
    orderToDelete = orderId;
    document.getElementById('deletion-modal').style.display = 'block';
}

// Confirm delete
function confirmDelete() {
    if (orderToDelete) {
        currentOrders = currentOrders.filter(order => order.id !== orderToDelete);
        filteredOrders = filteredOrders.filter(order => order.id !== orderToDelete);
        
        chrome.storage.local.set({extractedOrders: currentOrders});
        renderOrders();
        hideDeletionModal();
    }
}

// Hide deletion modal
function hideDeletionModal() {
    document.getElementById('deletion-modal').style.display = 'none';
    orderToDelete = null;
}

// Show clear all modal
function showClearAllModal() {
    document.getElementById('clear-modal').style.display = 'block';
}

// Confirm clear all
function confirmClearAll() {
    currentOrders = [];
    filteredOrders = [];
    chrome.storage.local.remove(['extractedOrders']);
    renderOrders();
    hideClearModal();
}

// Hide clear modal
function hideClearModal() {
    document.getElementById('clear-modal').style.display = 'none';
}

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Popup received message:', message.type, message);
    
    if (message.type === 'statusUpdate') {
        document.getElementById('status').textContent = message.status;
    }
    
    if (message.type === 'ordersExtracted') {
        console.log('Processing new orders:', message.orders);
        const newOrders = message.orders || [];
        const existingIds = new Set(currentOrders.map(o => o.id));
        
        const uniqueNewOrders = newOrders.filter(order => {
            if (!order.id) {
                const baseString = `${order.itemName}_${order.dateOrdered}_${order.amazonLink || ''}_${order.price || ''}`;
                order.id = btoa(baseString).replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);
            }
            return !existingIds.has(order.id);
        });
        
        if (uniqueNewOrders.length > 0) {
            console.log('Adding new orders to popup:', uniqueNewOrders.length, 'orders');
            currentOrders.push(...uniqueNewOrders);
            filteredOrders = [...currentOrders];
            chrome.storage.local.set({amazonOrders: currentOrders});
            
            if (currentView === 'dashboard') {
                renderOrders();
            }
        }
    }
});

// Test function to add sample orders (for debugging)
window.addTestOrders = function() {
    const testOrders = [
        {
            id: 'test1',
            itemName: 'Test Product 1',
            amazonLink: 'https://amazon.in/test1',
            price: '₹999',
            dateOrdered: '2024-01-15',
            returnStatus: 'Not returned'
        },
        {
            id: 'test2',
            itemName: 'Test Product 2',
            amazonLink: 'https://amazon.in/test2',
            price: '₹1499',
            dateOrdered: '2024-01-20',
            returnStatus: 'Not returned'
        }
    ];
    
    chrome.storage.local.set({ amazonOrders: testOrders }, function() {
        console.log('Test orders added to storage');
        loadStoredOrders();
    });
};

// Test function to clear all orders (for debugging)
window.clearAllOrders = function() {
    chrome.storage.local.set({ amazonOrders: [] }, function() {
        console.log('All orders cleared from storage');
        loadStoredOrders();
    });
};

// Debug function to check storage status
window.debugStorage = function() {
    console.log('=== STORAGE DEBUG ===');
    chrome.storage.local.get(null, function(result) {
        console.log('All storage contents:', result);
        console.log('Amazon orders:', result.amazonOrders);
        console.log('Extracted orders:', result.extractedOrders);
        console.log('Order history:', result.orderHistory);
    });
    
    // Test if we can write to storage
    chrome.storage.local.set({ testKey: 'testValue' }, function() {
        console.log('Test write successful');
        chrome.storage.local.get(['testKey'], function(result) {
            console.log('Test read result:', result);
        });
    });
};
