// Popup script for Order History Extension
document.addEventListener('DOMContentLoaded', function() {
    const statusElement = document.getElementById('status');
    
    // Check if current tab is Amazon
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        const currentTab = tabs[0];
        
        if (currentTab.url.includes('amazon.com')) {
            statusElement.textContent = 'Active on Amazon - Consent dialog should appear';
            statusElement.style.background = 'rgba(34, 197, 94, 0.1)';
            statusElement.style.borderColor = 'rgba(34, 197, 94, 0.3)';
            statusElement.style.color = '#22c55e';
        } else {
            statusElement.textContent = 'Visit Amazon.com to use this extension';
            statusElement.style.background = 'rgba(239, 68, 68, 0.1)';
            statusElement.style.borderColor = 'rgba(239, 68, 68, 0.3)';
            statusElement.style.color = '#ef4444';
        }
    });
    
    // Listen for extension messages
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.type === 'statusUpdate') {
            statusElement.textContent = message.status;
        }
    });
});