// Background service worker for Order History Extension
chrome.runtime.onInstalled.addListener(() => {
    console.log('Order History Extension installed');
});

// Listen for tab updates to detect Amazon visits
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url && tab.url.includes('amazon.com')) {
        console.log('Amazon page loaded:', tab.url);
        
        // Send message to popup if it's open
        chrome.runtime.sendMessage({
            type: 'statusUpdate',
            status: 'Amazon detected - Extension active'
        }).catch(() => {
            // Popup might not be open, ignore error
        });
    }
});

// Handle messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'orderDataExtracted') {
        console.log('Order data extracted:', message.data);
        
        // Could store data or send to analytics here
        sendResponse({success: true});
    }
    
    if (message.type === 'consentDeclined') {
        console.log('User declined consent');
        sendResponse({success: true});
    }
});