// Dashboard-enhanced popup script for Order History Extension
let currentOrders = [];
let filteredOrders = [];
let currentView = 'status';
let orderToDelete = null;

document.addEventListener('DOMContentLoaded', function() {
    checkOnboardingStatus();
    setupEventListeners();
});

// Check if user has completed onboarding
function checkOnboardingStatus() {
    chrome.storage.local.get(['userOnboarding'], function(result) {
        if (result.userOnboarding && result.userOnboarding.completed) {
            // User has completed onboarding, show main interface
            initializePopup();
            loadStoredOrders();
            checkAmazonStatus();
        } else {
            // Show onboarding flow
            showOnboarding();
        }
    });
}

// Show onboarding interface
function showOnboarding() {
    document.getElementById('onboarding-view').style.display = 'block';
    document.getElementById('status-view').style.display = 'none';
    document.getElementById('dashboard-view').style.display = 'none';
    currentView = 'onboarding';
}

// Initialize popup interface
function initializePopup() {
    const statusView = document.getElementById('status-view');
    const dashboardView = document.getElementById('dashboard-view');
    const onboardingView = document.getElementById('onboarding-view');
    
    // Ensure status view is shown by default
    statusView.style.display = 'block';
    dashboardView.style.display = 'none';
    onboardingView.style.display = 'none';
    currentView = 'status';
}

// Setup all event listeners
function setupEventListeners() {
    // Onboarding functionality
    const payoutAddressInput = document.getElementById('payout-address');
    const chainSelection = document.getElementById('chain-selection');
    const completeOnboardingBtn = document.getElementById('complete-onboarding');
    
    if (payoutAddressInput && chainSelection && completeOnboardingBtn) {
        payoutAddressInput.addEventListener('input', validateOnboardingForm);
        chainSelection.addEventListener('change', validateOnboardingForm);
        completeOnboardingBtn.addEventListener('click', completeOnboarding);
    }
    
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

// Validate onboarding form
function validateOnboardingForm() {
    const payoutAddress = document.getElementById('payout-address').value.trim();
    const chainSelection = document.getElementById('chain-selection').value;
    const completeBtn = document.getElementById('complete-onboarding');
    
    // Basic validation for Ethereum address format
    const isValidAddress = payoutAddress.length >= 40 && payoutAddress.startsWith('0x');
    const isChainSelected = chainSelection !== '';
    
    if (isValidAddress && isChainSelected) {
        completeBtn.disabled = false;
        completeBtn.textContent = 'Complete Setup';
    } else {
        completeBtn.disabled = true;
        completeBtn.textContent = 'Complete Setup';
    }
}

// Complete onboarding process
function completeOnboarding() {
    const payoutAddress = document.getElementById('payout-address').value.trim();
    const chainSelection = document.getElementById('chain-selection').value;
    
    const onboardingData = {
        completed: true,
        payoutAddress: payoutAddress,
        selectedChain: chainSelection,
        completedAt: new Date().toISOString()
    };
    
    chrome.storage.local.set({ userOnboarding: onboardingData }, function() {
        console.log('Onboarding completed:', onboardingData);
        // Show success message and transition to main interface
        showNotification('Setup completed! Welcome to DataVault.', 'success');
        
        // Initialize main interface
        setTimeout(() => {
            initializePopup();
            loadStoredOrders();
            checkAmazonStatus();
        }, 1000);
    });
}

// Check Amazon status and update UI
function checkAmazonStatus() {
    const statusElement = document.getElementById('status');
    
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        const currentTab = tabs[0];
        
        if (currentTab && currentTab.url && currentTab.url.includes('amazon.in')) {
            statusElement.textContent = 'Active on Amazon.in - Ready to extract orders';
            statusElement.style.background = 'rgba(34, 197, 94, 0.1)';
            statusElement.style.borderColor = 'rgba(34, 197, 94, 0.3)';
            statusElement.style.color = '#22c55e';
        } else {
            statusElement.textContent = 'Visit Amazon.in to extract order history';
            statusElement.style.background = 'rgba(239, 68, 68, 0.1)';
            statusElement.style.borderColor = 'rgba(239, 68, 68, 0.3)';
            statusElement.style.color = '#ef4444';
        }
    });
}

// Load stored orders from Chrome storage
function loadStoredOrders() {
    chrome.storage.local.get(['amazonOrders'], function(result) {
        console.log('Loading orders from storage:', result);
        currentOrders = result.amazonOrders || [];
        filteredOrders = [...currentOrders];
        console.log('Loaded orders:', currentOrders.length, 'orders');
        updateStatistics();
        updateDashboard();
    });
}

// Save orders to Chrome storage
function saveOrders() {
    chrome.storage.local.set({ amazonOrders: currentOrders }, function() {
        console.log('Orders saved to storage');
        updateStatistics();
        updateDashboard();
    });
}

// Update statistics in both views
function updateStatistics() {
    const totalOrders = currentOrders.length;
    const totalValue = calculateTotalPayout(currentOrders);
    
    // Update status view stats
    document.getElementById('total-orders').textContent = totalOrders;
    document.getElementById('total-earnings').textContent = `$${totalValue.toFixed(2)}`;
    
    // Update dashboard stats
    document.getElementById('dashboard-total').textContent = 
        `${filteredOrders.length} orders • $${calculateTotalPayout(filteredOrders).toFixed(2)} value`;
}

// Calculate total payout for orders
function calculateTotalPayout(orders) {
    const baseRate = 0.50; // $0.50 per order
    return orders.length * baseRate;
}

// Show dashboard view
function showDashboard() {
    console.log('Showing dashboard, current orders:', currentOrders.length);
    document.getElementById('status-view').style.display = 'none';
    document.getElementById('dashboard-view').style.display = 'block';
    currentView = 'dashboard';
    updateDashboard();
}

// Show status view
function showStatus() {
    document.getElementById('dashboard-view').style.display = 'none';
    document.getElementById('status-view').style.display = 'block';
    currentView = 'status';
}

// Update dashboard with current orders
function updateDashboard() {
    const ordersList = document.getElementById('orders-list');
    console.log('Updating dashboard with', filteredOrders.length, 'filtered orders out of', currentOrders.length, 'total orders');
    
    if (filteredOrders.length === 0) {
        ordersList.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📦</div>
                <p>No orders found</p>
                <p class="empty-hint">${currentOrders.length === 0 ? 'Visit Amazon.in to extract your order history' : 'Try adjusting your search or sort criteria'}</p>
            </div>
        `;
        return;
    }
    
    const ordersHTML = filteredOrders.map(order => {
        console.log('Rendering order:', order);
        return `
        <div class="order-item" data-order-id="${order.id}">
            <div class="order-header">
                <div class="order-name truncated" title="${escapeHtml(order.itemName)}">
                    ${escapeHtml(order.itemName)}
                </div>
                <button class="delete-btn" onclick="showDeletionModal('${order.id}')">Delete</button>
            </div>
            <div class="order-details">
                <span class="order-date">${formatDate(order.dateOrdered)}</span>
                ${order.amazonLink ? `<a href="${order.amazonLink}" class="order-link" target="_blank">View</a>` : ''}
            </div>
        </div>
    `;
    }).join('');
    
    console.log('Generated orders HTML:', ordersHTML);
    ordersList.innerHTML = ordersHTML;
    
    updateStatistics();
}

// Handle search functionality
function handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase();
    filteredOrders = currentOrders.filter(order => 
        order.itemName.toLowerCase().includes(searchTerm) ||
        order.price.toLowerCase().includes(searchTerm) ||
        formatDate(order.dateOrdered).toLowerCase().includes(searchTerm)
    );
    applySorting();
    updateDashboard();
}

// Handle sort functionality
function handleSort() {
    applySorting();
    updateDashboard();
}

// Apply current sorting to filtered orders
function applySorting() {
    const sortValue = document.getElementById('sort-select').value;
    
    filteredOrders.sort((a, b) => {
        switch (sortValue) {
            case 'date-desc':
                return new Date(b.dateOrdered) - new Date(a.dateOrdered);
            case 'date-asc':
                return new Date(a.dateOrdered) - new Date(b.dateOrdered);
            default:
                return 0;
        }
    });
}

// Parse price string to number for sorting
function parsePrice(priceStr) {
    const match = priceStr.match(/[\d,]+\.?\d*/);
    return match ? parseFloat(match[0].replace(/,/g, '')) : 0;
}

// Show deletion confirmation modal
function showDeletionModal(orderId) {
    const order = currentOrders.find(o => o.id === orderId);
    if (!order) return;
    
    orderToDelete = orderId;
    document.getElementById('delete-message').textContent = 
        `Delete "${order.itemName.substring(0, 50)}${order.itemName.length > 50 ? '...' : ''}"?`;
    document.getElementById('impact-amount').textContent = '-$0.50';
    document.getElementById('delete-modal').style.display = 'flex';
}

// Hide deletion modal
function hideDeletionModal() {
    document.getElementById('delete-modal').style.display = 'none';
    orderToDelete = null;
}

// Confirm order deletion
function confirmDelete() {
    if (!orderToDelete) return;
    
    currentOrders = currentOrders.filter(order => order.id !== orderToDelete);
    filteredOrders = filteredOrders.filter(order => order.id !== orderToDelete);
    
    saveOrders();
    hideDeletionModal();
    updateDashboard();
    
    // Show success feedback
    showNotification('Order deleted successfully', 'success');
}

// Show clear all modal
function showClearAllModal() {
    const totalLoss = calculateTotalPayout(currentOrders);
    document.getElementById('clear-impact-amount').textContent = `-$${totalLoss.toFixed(2)}`;
    document.getElementById('clear-modal').style.display = 'flex';
}

// Hide clear all modal
function hideClearModal() {
    document.getElementById('clear-modal').style.display = 'none';
}

// Confirm clear all orders
function confirmClearAll() {
    currentOrders = [];
    filteredOrders = [];
    saveOrders();
    hideClearModal();
    updateDashboard();
    
    // Show success feedback
    showNotification('All orders cleared successfully', 'success');
}

// Export data functionality
function exportData() {
    if (currentOrders.length === 0) {
        showNotification('No data to export', 'error');
        return;
    }
    
    const dataToExport = {
        exportDate: new Date().toISOString(),
        totalOrders: currentOrders.length,
        estimatedValue: calculateTotalPayout(currentOrders),
        orders: currentOrders.map(order => ({
            name: order.itemName,
            date: order.dateOrdered,
            link: order.amazonLink,
            returnStatus: order.returnStatus
        }))
    };
    
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `amazon-orders-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    showNotification('Data exported successfully', 'success');
}

// Utility function to format date
function formatDate(dateString) {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    } catch (e) {
        return dateString;
    }
}

// Utility function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Show notification (simple implementation)
function showNotification(message, type) {
    // Simple notification - could be enhanced with a proper toast system
    const statusElement = document.getElementById('status');
    const originalText = statusElement.textContent;
    const originalStyle = statusElement.style.cssText;
    
    statusElement.textContent = message;
    if (type === 'success') {
        statusElement.style.background = 'rgba(34, 197, 94, 0.1)';
        statusElement.style.borderColor = 'rgba(34, 197, 94, 0.3)';
        statusElement.style.color = '#22c55e';
    } else {
        statusElement.style.background = 'rgba(239, 68, 68, 0.1)';
        statusElement.style.borderColor = 'rgba(239, 68, 68, 0.3)';
        statusElement.style.color = '#ef4444';
    }
    
    setTimeout(() => {
        statusElement.textContent = originalText;
        statusElement.style.cssText = originalStyle;
    }, 2000);
}

// Listen for messages from content script when new orders are extracted
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Popup received message:', message.type, message);
    if (message.type === 'ordersExtracted') {
        // Merge new orders with existing ones, avoiding duplicates
        const newOrders = message.orders || [];
        const existingIds = new Set(currentOrders.map(o => o.id));
        
        const uniqueNewOrders = newOrders.filter(order => {
            // Create a simple ID if none exists (matching content script logic)
            if (!order.id) {
                const baseString = `${order.itemName}_${order.dateOrdered}_${order.amazonLink || ''}_${order.price || ''}`;
                order.id = btoa(baseString).replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);
            }
            return !existingIds.has(order.id);
        });
        
        if (uniqueNewOrders.length > 0) {
            console.log('Adding new orders to popup:', uniqueNewOrders.length, 'orders');
            console.log('Sample new order:', uniqueNewOrders[0]);
            currentOrders.push(...uniqueNewOrders);
            filteredOrders = [...currentOrders];
            saveOrders();
            showNotification(`${uniqueNewOrders.length} new orders added!`, 'success');
        }
    } else if (message.type === 'statusUpdate') {
        document.getElementById('status').textContent = message.status;
    }
});

// Make functions available globally for onclick handlers
window.showDeletionModal = showDeletionModal;

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