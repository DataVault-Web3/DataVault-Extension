// Content script to detect Amazon India visits and show consent dialog
console.log('Amazon Order History Extension loaded');

// Global state
let currentFilter = '3months';
let allOrders = [];
let selectedOrderIds = new Set(); // Track selected orders across filter changes

// Utility functions for cookie management
function setCookie(name, value, minutes) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (minutes * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// Date filtering functions
function getDateMonthsAgo(months) {
    const date = new Date();
    date.setMonth(date.getMonth() - months);
    return date;
}

function filterOrdersByDate(orders, filter) {
    const now = new Date();
    
    switch(filter) {
        case '3months':
            const threeMonthsAgo = getDateMonthsAgo(3);
            return orders.filter(order => new Date(order.dateOrdered) >= threeMonthsAgo);
        case '6months':
            const sixMonthsAgo = getDateMonthsAgo(6);
            return orders.filter(order => new Date(order.dateOrdered) >= sixMonthsAgo);
        case 'all':
        default:
            return orders;
    }
}

// Check if user is logged in to Amazon
function isUserLoggedIn() {
    // Check for login indicators on Amazon.in
    const loginIndicators = [
        '#nav-link-accountList',
        '[data-nav-role="signin"]',
        '[data-nav-ref="nav_ya_signin"]',
        '#nav-signin-tooltip'
    ];
    
    for (let selector of loginIndicators) {
        const element = document.querySelector(selector);
        if (element) {
            const text = element.textContent.toLowerCase();
            // If it contains "hello" or user name (not "sign in"), user is logged in
            if (text.includes('hello') || (text.length > 0 && !text.includes('sign in') && !text.includes('signin'))) {
                return true;
            }
        }
    }
    
    // Additional check for account dropdown or user name
    const accountElements = document.querySelectorAll('[data-nav-role="signin"], #nav-link-accountList, .nav-signin-text');
    for (let element of accountElements) {
        if (element && element.textContent) {
            const text = element.textContent.toLowerCase().trim();
            if (text.startsWith('hello') || (text.length > 0 && !text.includes('sign in'))) {
                return true;
            }
        }
    }
    
    return false;
}

// Check if we're on Amazon India and if consent dialog should be shown
if (window.location.hostname.includes('amazon.in')) {
    
    // Only proceed if user is logged in
    if (!isUserLoggedIn()) {
        console.log('User not logged in, skipping popup');
    } else {
        console.log('User is logged in');
        
        // Check if user has already made a choice (cookie exists)
        const userChoice = getCookie('amazon_order_consent');
        if (!userChoice) {
            console.log('No existing consent found, showing dialog');
            setTimeout(() => {
                createConsentDialog();
            }, 2000); // Delay to ensure page is fully loaded
        } else {
            console.log('User choice already recorded:', userChoice);
            if (userChoice === 'accepted') {
                console.log('User previously accepted consent');
            }
        }
    }
}

function createConsentDialog() {
    // Check if dialog already exists
    if (document.getElementById('amazon-consent-dialog')) {
        return;
    }

    const dialog = document.createElement('div');
    dialog.id = 'amazon-consent-dialog';
    dialog.innerHTML = `
        <div class="wallet-popup">
            <div class="popup-header">
                <div class="header-content">
                    <img src="https://e7.pngegg.com/pngimages/547/523/png-clipart-simple-earth-logo-design-white-simple-thumbnail.png" alt="Logo" class="popup-logo">
                    <div class="header-text">
                        <h3>Order History Sharing</h3>
                        <p class="subtitle">Data Access Request</p>
                    </div>
                    <button class="close-btn" id="close-popup">×</button>
                </div>
            </div>
            
            <div class="popup-body">
                <div id="consent-screen" class="consent-screen">
                    <div class="consent-content">
                        <div class="security-badge">
                            <span class="shield-icon">🔒</span>
                            <span>Secure & Private</span>
                        </div>
                        <p class="consent-text">
                            Allow access to your Amazon order history for personalized insights and rewards estimation.
                        </p>
                        <div class="privacy-points">
                            <div class="point">
                                <span class="check-icon">✓</span>
                                <span>Data stays in your browser</span>
                            </div>
                            <div class="point">
                                <span class="check-icon">✓</span>
                                <span>No external servers</span>
                            </div>
                            <div class="point">
                                <span class="check-icon">✓</span>
                                <span>You control what's shared</span>
                            </div>
                        </div>
                    </div>
                    <div class="consent-actions">
                        <button id="consent-decline" class="btn-secondary">Decline</button>
                        <button id="consent-accept" class="btn-primary">Continue</button>
                    </div>
                </div>

                <div id="order-selection" class="order-selection" style="display: none;">
                    <div class="filter-tabs">
                        <button class="tab-btn active" data-filter="3months">Last 3 Months</button>
                        <button class="tab-btn" data-filter="6months">Last 6 Months</button>
                        <button class="tab-btn" data-filter="all">All Orders</button>
                    </div>
                    
                    <div class="orders-container">
                        <div class="orders-header">
                            <span class="orders-count">Select orders to share</span>
                            <button class="select-all-btn" id="select-all">Select All</button>
                        </div>
                        <div id="order-list" class="order-list"></div>
                    </div>
                    
                    <div class="payout-section">
                        <div class="payout-info">
                            <span class="payout-label">Estimated Payout:</span>
                            <span id="estimated-payout" class="payout-amount">$0.00</span>
                        </div>
                        <div class="payout-note">Based on <span id="selected-count">0</span> selected orders</div>
                    </div>
                    
                    <div class="action-buttons">
                        <button id="cancel-selection" class="btn-secondary">Cancel</button>
                        <button id="share-selected" class="btn-primary">Share Selected</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Inject CSS
    const style = document.createElement('style');
    style.textContent = `
        .wallet-popup {
            position: fixed;
            top: 20px;
            right: 20px;
            width: 380px;
            max-height: 600px;
            background: #1a1b23;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
            border: 1px solid #2a2b33;
            z-index: 10001;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
            color: #ffffff;
            overflow: hidden;
        }

        .popup-header {
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
            padding: 16px 20px;
        }

        .header-content {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .popup-logo {
            width: 32px;
            height: 32px;
            border-radius: 8px;
        }

        .header-text h3 {
            margin: 0;
            font-size: 16px;
            font-weight: 600;
            color: #ffffff;
        }

        .subtitle {
            margin: 2px 0 0 0;
            font-size: 12px;
            color: rgba(255, 255, 255, 0.8);
        }

        .close-btn {
            margin-left: auto;
            background: none;
            border: none;
            color: #ffffff;
            font-size: 20px;
            cursor: pointer;
            padding: 4px;
            border-radius: 4px;
        }

        .close-btn:hover {
            background: rgba(255, 255, 255, 0.1);
        }

        .popup-body {
            padding: 0;
        }

        .consent-screen {
            padding: 24px 20px;
        }

        .security-badge {
            display: flex;
            align-items: center;
            gap: 8px;
            background: rgba(34, 197, 94, 0.1);
            color: #22c55e;
            padding: 8px 12px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            margin-bottom: 16px;
        }

        .consent-text {
            font-size: 14px;
            line-height: 1.5;
            color: #d1d5db;
            margin-bottom: 20px;
        }

        .privacy-points {
            margin-bottom: 24px;
        }

        .point {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 13px;
            color: #9ca3af;
            margin-bottom: 8px;
        }

        .check-icon {
            color: #22c55e;
            font-weight: bold;
        }

        .consent-actions {
            display: flex;
            gap: 12px;
        }

        .btn-primary {
            flex: 1;
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
            color: #ffffff;
            border: none;
            padding: 12px 16px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .btn-primary:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
        }

        .btn-secondary {
            flex: 1;
            background: #374151;
            color: #d1d5db;
            border: 1px solid #4b5563;
            padding: 12px 16px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .btn-secondary:hover {
            background: #4b5563;
            transform: translateY(-1px);
        }

        .order-selection {
            padding: 0;
        }

        .filter-tabs {
            display: flex;
            background: #111827;
            border-bottom: 1px solid #374151;
        }

        .tab-btn {
            flex: 1;
            background: none;
            border: none;
            color: #9ca3af;
            padding: 12px 8px;
            font-size: 12px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            border-bottom: 2px solid transparent;
        }

        .tab-btn:hover {
            color: #d1d5db;
            background: rgba(255, 255, 255, 0.05);
        }

        .tab-btn.active {
            color: #6366f1;
            border-bottom-color: #6366f1;
            background: rgba(99, 102, 241, 0.1);
        }

        .orders-container {
            padding: 16px 20px;
        }

        .orders-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
        }

        .orders-count {
            font-size: 13px;
            color: #9ca3af;
        }

        .select-all-btn {
            background: none;
            border: none;
            color: #6366f1;
            font-size: 12px;
            cursor: pointer;
            padding: 4px 8px;
            border-radius: 4px;
        }

        .select-all-btn:hover {
            background: rgba(99, 102, 241, 0.1);
        }

        .order-list {
            max-height: 200px;
            overflow-y: auto;
        }

        .order-item {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 12px;
            background: #374151;
            border-radius: 8px;
            margin-bottom: 8px;
            transition: background 0.2s ease;
        }

        .order-item:hover {
            background: #4b5563;
        }

        .order-item input[type="checkbox"] {
            width: 16px;
            height: 16px;
            accent-color: #6366f1;
            cursor: pointer;
        }

        .order-details {
            flex: 1;
            min-width: 0;
        }

        .order-name {
            font-size: 13px;
            font-weight: 500;
            color: #ffffff;
            margin-bottom: 4px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .order-meta {
            font-size: 11px;
            color: #9ca3af;
            display: flex;
            justify-content: space-between;
        }

        .payout-section {
            padding: 16px 20px;
            background: rgba(99, 102, 241, 0.05);
            border-top: 1px solid #374151;
        }

        .payout-info {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 4px;
        }

        .payout-label {
            font-size: 14px;
            color: #d1d5db;
            font-weight: 500;
        }

        .payout-amount {
            font-size: 16px;
            font-weight: 600;
            color: #22c55e;
        }

        .payout-note {
            font-size: 11px;
            color: #9ca3af;
        }

        .action-buttons {
            display: flex;
            gap: 12px;
            padding: 16px 20px;
            border-top: 1px solid #374151;
        }

        /* Scrollbar styling */
        .order-list::-webkit-scrollbar {
            width: 6px;
        }

        .order-list::-webkit-scrollbar-track {
            background: #1f2937;
            border-radius: 3px;
        }

        .order-list::-webkit-scrollbar-thumb {
            background: #4b5563;
            border-radius: 3px;
        }

        .order-list::-webkit-scrollbar-thumb:hover {
            background: #6b7280;
        }
    `;

    document.head.appendChild(style);
    document.body.appendChild(dialog);

    // Add event listeners
    document.getElementById('consent-accept').addEventListener('click', handleAccept);
    document.getElementById('consent-decline').addEventListener('click', handleDecline);
    document.getElementById('close-popup').addEventListener('click', closePopup);
}

function closePopup() {
    const dialog = document.getElementById('amazon-consent-dialog');
    if (dialog) {
        dialog.remove();
    }
}

function handleAccept() {
    console.log('User accepted consent');
    
    // Set cookie to remember user's choice for 10 minutes
    // setCookie('amazon_order_consent', 'accepted', 10);
    
    // Show order selection interface
    showOrderSelection();
}

function handleDecline() {
    console.log('User declined consent');
    
    // Set cookie to remember user's choice for 10 minutes
    setCookie('amazon_order_consent', 'declined', 10);
    
    // Immediately close the popup
    closePopup();
}

function showOrderSelection() {
    // Hide consent screen and show order selection
    const consentScreen = document.getElementById('consent-screen');
    const orderSelection = document.getElementById('order-selection');
    
    if (consentScreen) consentScreen.style.display = 'none';
    if (orderSelection) orderSelection.style.display = 'block';
    
    // Initialize order data
    allOrders = extractRecentOrders();
    
    // Setup event listeners for the new interface
    setupOrderSelectionEventListeners();
    
    // Load initial orders (3 months filter by default)
    switchFilter('3months');
}

function setupOrderSelectionEventListeners() {
    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const filter = e.target.getAttribute('data-filter');
            switchFilter(filter);
        });
    });
    
    // Select all toggle
    document.getElementById('select-all').addEventListener('click', toggleSelectAll);
    
    // Final action buttons
    document.getElementById('share-selected').addEventListener('click', handleShareSelected);
    document.getElementById('cancel-selection').addEventListener('click', closePopup);
}

function switchFilter(filter) {
    currentFilter = filter;
    
    // Update active tab
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-filter') === filter) {
            btn.classList.add('active');
        }
    });
    
    // Filter and display orders
    const filteredOrders = filterOrdersByDate(allOrders, filter);
    displayFilteredOrders(filteredOrders);
    
    // Update orders count
    updateOrdersCount(filteredOrders.length);
}

function displayFilteredOrders(orders) {
    const orderList = document.getElementById('order-list');
    orderList.innerHTML = '';
    
    if (orders.length === 0) {
        orderList.innerHTML = '<div style="text-align: center; color: #9ca3af; padding: 20px; font-size: 13px;">No orders found for this period</div>';
        updateEstimatedPayout();
        return;
    }
    
    orders.forEach((order, index) => {
        // Create unique ID for each order for tracking selection
        const orderId = createOrderId(order);
        const isSelected = selectedOrderIds.has(orderId);
        
        const orderItem = document.createElement('div');
        orderItem.className = 'order-item';
        orderItem.innerHTML = `
            <input type="checkbox" id="order-${index}" ${isSelected ? 'checked' : ''} data-order-index="${index}" data-order-id="${orderId}">
            <div class="order-details">
                <div class="order-name">${order.itemName}</div>
                <div class="order-meta">
                    <span>${order.dateOrdered}</span>
                </div>
            </div>
        `;
        
        // Add checkbox change listener
        const checkbox = orderItem.querySelector('input[type="checkbox"]');
        checkbox.addEventListener('change', handleOrderSelection);
        
        orderList.appendChild(orderItem);
    });
    
    // Update estimated payout based on globally selected orders
    updateEstimatedPayout();
}

function createOrderId(order) {
    // Create a unique ID for each order based on its properties
    return `${order.itemName}`.replace(/[^a-zA-Z0-9]/g, '_');
}

function handleOrderSelection(event) {
    const checkbox = event.target;
    const orderId = checkbox.getAttribute('data-order-id');
    const orderIndex = parseInt(checkbox.getAttribute('data-order-index'));
    
    if (checkbox.checked) {
        selectedOrderIds.add(orderId);
    } else {
        selectedOrderIds.delete(orderId);
    }
    
    // Update estimated payout
    updateEstimatedPayout();
}

function updateOrdersCount(count) {
    const ordersCount = document.querySelector('.orders-count');
    if (ordersCount) {
        ordersCount.textContent = `${count} orders available`;
    }
}

function toggleSelectAll() {
    const checkboxes = document.querySelectorAll('#order-list input[type="checkbox"]');
    const selectAllBtn = document.getElementById('select-all');
    const allChecked = Array.from(checkboxes).every(cb => cb.checked);
    
    checkboxes.forEach(cb => {
        const orderId = cb.getAttribute('data-order-id');
        if (allChecked) {
            // Deselect all visible orders
            cb.checked = false;
            selectedOrderIds.delete(orderId);
        } else {
            // Select all visible orders
            cb.checked = true;
            selectedOrderIds.add(orderId);
        }
    });
    
    selectAllBtn.textContent = allChecked ? 'Select All' : 'Deselect All';
    updateEstimatedPayout();
}

function updateEstimatedPayout() {
    // Calculate based on globally selected orders, not just visible ones
    const selectedCount = selectedOrderIds.size;
    
    // Calculate estimated payout ($0.50 per order)
    const baseRate = 0.50;
    const estimatedPayout = selectedCount * baseRate;
    
    // Update display
    const payoutElement = document.getElementById('estimated-payout');
    const countElement = document.getElementById('selected-count');
    
    if (payoutElement) payoutElement.textContent = `$${estimatedPayout.toFixed(2)}`;
    if (countElement) countElement.textContent = selectedCount;
    
    // Update select all button text based on visible orders
    const totalVisibleCheckboxes = document.querySelectorAll('#order-list input[type="checkbox"]').length;
    const visibleCheckedCheckboxes = document.querySelectorAll('#order-list input[type="checkbox"]:checked').length;
    const selectAllBtn = document.getElementById('select-all');
    
    if (selectAllBtn && totalVisibleCheckboxes > 0) {
        selectAllBtn.textContent = visibleCheckedCheckboxes === totalVisibleCheckboxes ? 'Deselect All' : 'Select All';
    }
}

function extractRecentOrders() {
    console.log('=== Starting Order Extraction Process ===');
    
    const orders = [];
    
    // Try different methods to extract order data
    console.log('Step 1: Trying order history extraction...');
    const orderHistoryOrders = tryExtractFromOrderHistory();
    
    console.log('Step 2: Trying current page extraction...');
    const currentPageOrders = tryExtractFromCurrentPage();
    
    console.log('Step 3: Trying account page extraction...');
    const accountPageOrders = tryExtractFromYourAccount();
    
    // Combine all extracted orders
    const extractedOrders = [
        ...orderHistoryOrders,
        ...currentPageOrders,
        ...accountPageOrders
    ];
    
    console.log(`Raw extracted orders: ${extractedOrders.length}`);
    
    // Log sample of extracted data for debugging
    if (extractedOrders.length > 0) {
        console.log('Sample extracted order:', extractedOrders[0]);
    }
    
    // Remove duplicates and format orders
    const uniqueOrders = removeDuplicateOrders(extractedOrders);
    
    console.log(`Unique orders after deduplication: ${uniqueOrders.length}`);
    
    if (uniqueOrders.length === 0) {
        console.log('❌ No orders found on current page');
        
        // Check if we're already on the order history page
        if (window.location.href.includes('your-orders') || window.location.href.includes('order-history')) {
            console.log('Already on order history page but no orders found.');
            return tryAggressiveFallbackExtraction();
        } else {
            console.log('Not on order history page, will try to navigate there');
            tryNavigateToOrderHistory();
            
            // Show a message to user
            setTimeout(() => {
                if (document.getElementById('amazon-consent-dialog')) {
                    const orderList = document.getElementById('order-list');
                    if (orderList) {
                        orderList.innerHTML = `
                            <div style="text-align: center; color: #9ca3af; padding: 20px; font-size: 13px;">
                                <p>📋 No orders found on this page</p>
                                <p>Please navigate to your <a href="https://www.amazon.in/your-orders/orders" target="_blank" style="color: #6366f1;">Order History</a> page and try again</p>
                            </div>
                        `;
                    }
                }
            }, 1000);
            
            return [];
        }
    }
    
    console.log(`✅ Successfully extracted ${uniqueOrders.length} orders`);
    // uniqueOrders.forEach((order, index) => {
    //     console.log(`Order ${index + 1}:`, {
    //         name: order.itemName.substring(0, 50) + '...',
    //         price: order.price,
    //         date: order.dateOrdered,
    //         hasLink: !!order.amazonLink
    //     });
    // });
    
    return uniqueOrders;
}

function tryAggressiveFallbackExtraction() {
    console.log('🔍 Attempting aggressive fallback extraction...');
    const orders = [];
    
    // Try to find any links that look like product links
    const allLinks = document.querySelectorAll('a[href]');
    console.log(`Found ${allLinks.length} total links on page`);
    
    let productLinks = 0;
    allLinks.forEach((link, index) => {
        if (index > 200) return; // Don't process too many links
        
        const href = link.href;
        const text = link.textContent.trim();
        
        // Look for Amazon product links
        if (href && (href.includes('/dp/') || href.includes('/gp/product/')) && 
            text.length > 10 && !text.toLowerCase().includes('sponsored')) {
            
            productLinks++;
            
            // Try to find associated price and date
            let price = '₹0.00';
            let date = new Date().toISOString().split('T')[0];
            
            // Look for price in nearby elements
            const parent = link.closest('.a-box-group, .order-card, .a-row, div');
            if (parent) {
                const priceElements = parent.querySelectorAll('*');
                for (let elem of priceElements) {
                    const elemText = elem.textContent.trim();
                    if (elemText.includes('₹') && elemText.match(/₹[\d,]+\.?\d*/)) {
                        price = elemText.match(/₹[\d,]+\.?\d*/)[0];
                        break;
                    }
                }
                
                // Look for date in nearby elements
                const dateMatch = parent.textContent.match(/(\d{1,2}\s+\w+\s+\d{4})/);
                if (dateMatch) {
                    date = parseAmazonDateToISO(dateMatch[1]) || date;
                }
            }
            
            const order = {
                itemName: text,
                amazonLink: href,
                dateOrdered: date,
                returnStatus: 'Not returned'
            };
            
            orders.push(order);
        }
    });
    
    console.log(`Found ${productLinks} potential product links`);
    console.log(`Created ${orders.length} fallback orders`);
    
    return removeDuplicateOrders(orders);
}

function tryExtractFromOrderHistory() {
    console.log('Trying to extract from order history page...');
    const orders = [];
    
    // Target the actual Amazon order history structure
    const orderSelectors = [
        '.order-card',
        '.a-box-group',
        '[data-order-id]',
        '.order'
    ];
    
    for (let selector of orderSelectors) {
        const orderElements = document.querySelectorAll(selector);
        console.log(`Found ${orderElements.length} order cards with selector: ${selector}`);
        
        orderElements.forEach((orderCard, index) => {
            if (index >= 20) return; // Limit to 20 orders
            
            // Extract all items from this order card
            const orderData = extractOrderDataFromCard(orderCard);
            if (orderData.length > 0) {
                orders.push(...orderData);
            }
        });
        
        if (orders.length > 0) break; // Use the first working selector
    }
    
    console.log(`Extracted ${orders.length} total orders from order history`);
    return orders;
}

function extractOrderDataFromCard(orderCard) {
    const orders = [];
    
    if (!orderCard) return orders;
    
    // Extract order-level information from the header
    const orderHeader = orderCard.querySelector('.a-box-group-header, .order-info');
    let orderDate = '';
    let orderTotal = '';
    
    if (orderHeader) {
        // Extract order date - look for "ORDER PLACED" section
        const orderPlacedElements = orderHeader.querySelectorAll('.order-info div, span, .a-text-bold');
        for (let elem of orderPlacedElements) {
            if (elem.textContent.includes('ORDER PLACED')) {
                const nextSibling = elem.nextElementSibling || elem.parentElement?.nextElementSibling;
                if (nextSibling) {
                    orderDate = nextSibling.textContent.trim();
                    break;
                }
            }
        }
        
        // Alternative method - look for date patterns in header
        if (!orderDate) {
            const headerText = orderHeader.textContent;
            const dateMatch = headerText.match(/(\d{1,2}\s+\w+\s+\d{4})/);
            if (dateMatch) {
                orderDate = dateMatch[1];
            }
        }
        
        // Extract order total - look for price with ₹ symbol
        const totalElements = orderHeader.querySelectorAll('span, div');
        for (let elem of totalElements) {
            const text = elem.textContent.trim();
            if (text.includes('₹') && text.match(/₹[\d,]+\.?\d*/)) {
                orderTotal = text;
                break;
            }
        }
    }
    
    // Extract individual items from the order body
    const orderBody = orderCard.querySelector('.a-box-group-body, .order-info');
    if (orderBody) {
        // Look for product links and titles
        const productLinks = orderBody.querySelectorAll('a.a-link-normal, a[href*="/dp/"], a[href*="/gp/product/"]');
        
        productLinks.forEach(link => {
            const href = link.getAttribute('href');
            const productTitle = link.textContent.trim();
            
            // Skip if it's not a product link or has no meaningful title
            if (!href || !productTitle || productTitle.length < 10 || 
                href.includes('invoice') || href.includes('receipt') ||
                productTitle.toLowerCase().includes('view') ||
                productTitle.toLowerCase().includes('return')) {
                return;
            }
            
            // Create order object
            const order = {
                itemName: productTitle,
                amazonLink: href.startsWith('http') ? href : 'https://amazon.in' + href,
                price: orderTotal,
                dateOrdered: orderDate ? parseAmazonDateToISO(orderDate) : getDefaultDate(),
                returnStatus: 'Not returned'
            };
            
            // Check for return status
            const itemContainer = link.closest('.a-row, .order-item, .shipment-item');
            if (itemContainer) {
                const containerText = itemContainer.textContent.toLowerCase();
                if (containerText.includes('return') || containerText.includes('refund')) {
                    order.returnStatus = 'Returned';
                }
            }
            
            orders.push(order);
        });
    }
    
    // Fallback: If no items found, try a more aggressive approach
    if (orders.length === 0) {
        const allLinks = orderCard.querySelectorAll('a');
        allLinks.forEach(link => {
            const href = link.getAttribute('href');
            const text = link.textContent.trim();
            
            if (href && (href.includes('/dp/') || href.includes('/gp/product/')) && 
                text.length > 15 && !text.toLowerCase().includes('buy it again')) {
                
                const order = {
                    itemName: text,
                    amazonLink: href.startsWith('http') ? href : 'https://amazon.in' + href,
                    price: orderTotal,
                    dateOrdered: orderDate ? parseAmazonDateToISO(orderDate) : getDefaultDate(),
                    returnStatus: 'Not returned'
                };
                
                orders.push(order);
            }
        });
    }
    
    return orders;
}

function parseAmazonDateToISO(dateStr) {
    if (!dateStr) return getDefaultDate();
    
    const monthNames = {
        'january': '01', 'jan': '01',
        'february': '02', 'feb': '02',
        'march': '03', 'mar': '03',
        'april': '04', 'apr': '04',
        'may': '05',
        'june': '06', 'jun': '06',
        'july': '07', 'jul': '07',
        'august': '08', 'aug': '08',
        'september': '09', 'sep': '09',
        'october': '10', 'oct': '10',
        'november': '11', 'nov': '11',
        'december': '12', 'dec': '12'
    };
    
    // Parse "20 August 2025" format
    const match = dateStr.toLowerCase().match(/(\d{1,2})\s+(\w+)\s+(\d{4})/);
    if (match) {
        const day = match[1].padStart(2, '0');
        const month = monthNames[match[2].toLowerCase()];
        const year = match[3];
        
        if (month) {
            return `${year}-${month}-${day}`;
        }
    }
    
    return getDefaultDate();
}

function getDefaultDate() {
    const now = new Date();
    now.setDate(now.getDate() - Math.floor(Math.random() * 90));
    return now.toISOString().split('T')[0];
}

function tryExtractFromCurrentPage() {
    console.log('Trying to extract from current page...');
    console.log('Current URL:', window.location.href);
    const orders = [];
    
    // Check if we're on the order history page first
    if (window.location.href.includes('your-orders') || window.location.href.includes('order-history')) {
        console.log('Detected order history page, using specialized extraction');
        return tryExtractFromOrderHistory();
    }
    
    // For other pages, try to find any order-related content
    const itemSelectors = [
        // Order history elements that might appear on other pages
        '.order-card',
        '.a-box-group',
        '[data-order-id]',
        // Search results and product listings
        '[data-component-type="s-search-result"]',
        '.s-result-item',
        '.sg-col-inner'
    ];
    
    for (let selector of itemSelectors) {
        const items = document.querySelectorAll(selector);
        console.log(`Found ${items.length} potential items with selector: ${selector}`);
        
        if (selector.includes('order') || selector.includes('box-group')) {
            // These might be order cards on other pages
            items.forEach((item, index) => {
                if (index >= 10) return;
                const orderData = extractOrderDataFromCard(item);
                if (orderData.length > 0) {
                    orders.push(...orderData);
                }
            });
        } else {
            // These are search results or product listings
            items.forEach((item, index) => {
                if (index >= 5) return; // Limit to 5 for non-order pages
                
                const order = extractOrderFromSearchResult(item);
                if (order && order.itemName) {
                    orders.push(order);
                }
            });
        }
        
        if (orders.length > 0) break;
    }
    
    console.log(`Extracted ${orders.length} orders from current page`);
    return orders;
}

function tryExtractFromYourAccount() {
    console.log('Trying to extract from Your Account page...');
    const orders = [];
    
    // Look for recent orders or order widgets on account pages
    const recentOrderSelectors = [
        '.recent-orders',
        '.your-orders-content',
        '.order-summary',
        '.order-item',
        '.order-card',
        '.a-box-group'
    ];
    
    for (let selector of recentOrderSelectors) {
        const elements = document.querySelectorAll(selector);
        console.log(`Found ${elements.length} elements with selector: ${selector} on account page`);
        
        elements.forEach((element, index) => {
            if (index >= 15) return;
            
            // Try to extract as order card first, then fallback to generic extraction
            let extractedOrders = extractOrderDataFromCard(element);
            if (extractedOrders.length === 0) {
                const order = extractOrderFromElement(element);
                if (order && order.itemName) {
                    extractedOrders = [order];
                }
            }
            
            orders.push(...extractedOrders);
        });
        
        if (orders.length > 0) break;
    }
    
    console.log(`Extracted ${orders.length} orders from account page`);
    return orders;
}

function extractOrderFromElement(element) {
    if (!element) return null;
    
    const order = {
        itemName: '',
        amazonLink: '',
        price: '',
        dateOrdered: '',
        returnStatus: 'Not returned'
    };
    
    // Extract item name
    const nameSelectors = [
        '.a-link-normal',
        '.s-link-style',
        'h3 a',
        '.product-title',
        '.item-title',
        'a[href*="/dp/"]',
        '.order-info h4',
        '.shipment-item-header h4'
    ];
    
    for (let selector of nameSelectors) {
        const nameElement = element.querySelector(selector);
        if (nameElement && nameElement.textContent.trim()) {
            order.itemName = nameElement.textContent.trim();
            if (nameElement.href && nameElement.href.includes('amazon.in')) {
                order.amazonLink = nameElement.href;
            }
            break;
        }
    }
    
    // Extract price
    const priceSelectors = [
        '.a-price-whole',
        '.a-offscreen',
        '.a-price',
        '.price',
        '.order-price',
        '.item-price',
        'a-size-base a-color-secondary aok-break-word'
    ];
    
    for (let selector of priceSelectors) {
        const priceElement = element.querySelector(selector);
        if (priceElement && priceElement.textContent.trim()) {
            let priceText = priceElement.textContent.trim();
            if (priceText.includes('₹') || priceText.match(/\d+/)) {
                order.price = priceText.includes('₹') ? priceText : '₹' + priceText;
                break;
            }
        }
    }
    
    // Extract date
// Reads: <div class="a-row a-size-mini">[Order placed]</div>
//        <div class="a-row"><span class="a-size-base a-color-secondary aok-break-word">21 July 2025</span></div>
const dateSpan =
  element.querySelector(':scope .a-row.a-size-mini + .a-row > span.a-size-base.a-color-secondary.aok-break-word')
  || element.querySelector(':scope .a-row.a-size-mini + .a-row > span'); // fallback

if (dateSpan) {
  const dateText = dateSpan.textContent.trim();      // "21 July 2025"
  const parsed = typeof parseAmazonDate === 'function' ? parseAmazonDate(dateText) : null;
  order.dateOrdered = parsed || dateText;            // store parsed date, else raw string
}
    
    // Set default date if none found
    if (!order.dateOrdered) {
        const now = new Date();
        now.setDate(now.getDate() - Math.floor(Math.random() * 180)); // Random date in last 90 days
        order.dateOrdered = now.toISOString().split('T')[0];
    }
    
    // Extract Amazon link if not already found
    if (!order.amazonLink) {
        const linkElement = element.querySelector('a[href*="/dp/"], a[href*="/gp/product/"]');
        if (linkElement && linkElement.href) {
            order.amazonLink = linkElement.href;
        }
    }
    
    // Generate a basic Amazon link if none found
    if (!order.amazonLink && order.itemName) {
        const searchQuery = order.itemName.split(' ').slice(0, 3).join('+');
        order.amazonLink = `https://amazon.in/s?k=${encodeURIComponent(searchQuery)}`;
    }
    
    return order.itemName ? order : null;
}

function extractOrderFromSearchResult(element) {
    if (!element) return null;
    
    // This is for extracting from search results or product listings
    const order = {
        itemName: '',
        amazonLink: '',
        price: '',
        dateOrdered: '',
        returnStatus: 'Not returned'
    };
    
    // Get product title
    const titleElement = element.querySelector('h3 a, .a-link-normal, [data-cy="title-recipe-title"]');
    if (titleElement) {
        order.itemName = titleElement.textContent.trim();
        if (titleElement.href) {
            order.amazonLink = titleElement.href;
        }
    }
    
    // Get price
    const priceElement = element.querySelector('.a-price-whole, .a-offscreen, .a-price, .a-size-base, .a-color-secondary, .aok-break-word');
    if (priceElement) {
        order.price = priceElement.textContent.trim();
        if (!order.price.includes('₹')) {
            order.price = '₹' + order.price;
        }
    }
    
    // Assign a recent random date
    // const now = new Date();
    // now.setDate(now.getDate() - Math.floor(Math.random() * 180));
    // order.dateOrdered = now.toISOString().split('T')[0];
    
    return order.itemName ? order : null;
}

function parseAmazonDate(dateText) {
    if (!dateText) return null;
    
    // Try to parse various date formats used by Amazon India
    const dateFormats = [
        /(\d{1,2})\s+(\w+)\s+(\d{4})/,  // "15 August 2024"
        /(\d{1,2})\/(\d{1,2})\/(\d{4})/,  // "15/08/2024"
        /(\d{1,2})-(\d{1,2})-(\d{4})/,   // "15-08-2024"
    ];
    
    const monthNames = {
        'january': '01', 'jan': '01',
        'february': '02', 'feb': '02',
        'march': '03', 'mar': '03',
        'april': '04', 'apr': '04',
        'may': '05', 'may': '05',
        'june': '06', 'jun': '06',
        'july': '07', 'jul': '07',
        'august': '08', 'aug': '08',
        'september': '09', 'sep': '09',
        'october': '10', 'oct': '10',
        'november': '11', 'nov': '11',
        'december': '12', 'dec': '12'
    };
    
    for (let format of dateFormats) {
        const match = dateText.toLowerCase().match(format);
        if (match) {
            let day, month, year;
            
            if (format === dateFormats[0]) { // "15 August 2024"
                day = match[1].padStart(2, '0');
                month = monthNames[match[2].toLowerCase()];
                year = match[3];
            } else { // numeric formats
                day = match[1].padStart(2, '0');
                month = match[2].padStart(2, '0');
                year = match[3];
            }
            
            if (day && month && year) {
                return `${year}-${month}-${day}`;
            }
        }
    }
    
    return null;
}

function removeDuplicateOrders(orders) {
    const seen = new Set();
    return orders.filter(order => {
        const key = `${order.itemName}`;
        if (seen.has(key)) {
            return false;
        }
        seen.add(key);
        return true;
    });
}

function tryNavigateToOrderHistory() {
    
    // Try to find and click order history link
    const orderHistoryLinks = [
        'a[href*="order-history"]',
        'a[href*="/your-orders"]',
        'a[href*="/gp/your-account/order-history"]',
        'a:contains("Your Orders")',
        'a:contains("Order History")'
    ];
    
    for (let selector of orderHistoryLinks) {
        const link = document.querySelector(selector);
        if (link) {
            window.open(link.href, '_blank');
            return true;
        }
    }
    
    // If no direct link found, try to construct the URL
    const orderHistoryUrl = 'https://www.amazon.in/your-orders/orders';
    window.open(orderHistoryUrl, '_blank');
    
    return false;
}

function handleShareSelected() {
    
    if (selectedOrderIds.size === 0) {
        alert('Please select at least one order to share.');
        return;
    }
    
    // Get selected orders from all orders based on selected IDs
    const selectedOrders = allOrders.filter(order => {
        const orderId = createOrderId(order);
        return selectedOrderIds.has(orderId);
    });
    
    console.log(`Sharing ${selectedOrders.length} selected orders`);
    
    // Prepare orders for dashboard storage with unique IDs
    const ordersForDashboard = selectedOrders.map(order => ({
        ...order,
        id: createOrderId(order), // Ensure each order has a unique ID
        extractedAt: new Date().toISOString(),
        shared: true
    }));
    
    // Save to Chrome storage for dashboard persistence
    saveToDashboard(ordersForDashboard);
    
    // Log the selected orders
    logOrderHistory(selectedOrders);
    
    // Close the popup with a slight delay to ensure logging completes
    setTimeout(() => {
        console.log('Closing popup...');
        closePopup();
    }, 100);
}

// Save orders to Chrome storage for dashboard access
function saveToDashboard(orders) {
    console.log('Saving orders to dashboard storage...');
    
    // Get existing orders from storage
    chrome.storage.local.get(['amazonOrders'], function(result) {
        const existingOrders = result.amazonOrders || [];
        const existingIds = new Set(existingOrders.map(order => order.id));
        
        // Filter out duplicate orders
        const newOrders = orders.filter(order => !existingIds.has(order.id));
        
        if (newOrders.length > 0) {
            const updatedOrders = [...existingOrders, ...newOrders];
            
            // Save updated orders to storage
            chrome.storage.local.set({ amazonOrders: updatedOrders }, function() {
                console.log(`Saved ${newOrders.length} new orders to dashboard`);
                
                // Notify popup about new orders
                chrome.runtime.sendMessage({
                    type: 'ordersExtracted',
                    orders: newOrders,
                    total: updatedOrders.length
                });
            });
        } else {
            console.log('No new orders to save (all already exist in dashboard)');
        }
    });
}

function logOrderHistory(orders) {
    console.log('=== AMAZON INDIA ORDER HISTORY ===');
    
    // Log each order with only the required fields
    orders.forEach((order, index) => {
        console.log(`--- Order ${index + 1} ---`);
        console.log('Item Name:', order.itemName);
        console.log('Amazon Link:', order.amazonLink);
        console.log('Date Ordered:', order.dateOrdered);
        console.log('Return Status:', order.returnStatus);
        console.log(''); // Empty line for separation
    });
    
    // Store in extension storage for potential future use
    chrome.storage.local.set({
        orderHistory: orders,
        timestamp: Date.now(),
        totalOrders: orders.length,
        filterApplied: currentFilter,
        estimatedPayout: (orders.length * 0.50).toFixed(2),
        extractedFromDomain: window.location.hostname
    });
    
    console.log('Order history extraction completed successfully!');
}