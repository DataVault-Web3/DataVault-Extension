// Import dependencies
import { ethers } from 'ethers';
import stringify from 'json-stable-stringify';
// Note: Semaphore libraries removed for browser compatibility

// Background service worker for Order History Extension
chrome.runtime.onInstalled.addListener(() => {
    console.log('Order History Extension installed with ethers and json-stable-stringify support');
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

// Enhanced message handling with crypto processing
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'orderDataExtracted') {
        console.log('Order data extracted:', message.data);
        
        // Process data with crypto functions
        const processedData = processOrderDataWithCrypto(message.data);
        console.log('Processed order data:', processedData);
        
        // Store processed data
        chrome.storage.local.set({
            processedOrders: processedData,
            lastProcessed: new Date().toISOString()
        });
        
        sendResponse({success: true, processedData: processedData});
    }
    
    if (message.type === 'consentDeclined') {
        console.log('User declined consent');
        sendResponse({success: true});
    }
    
    if (message.type === 'getProcessedData') {
        chrome.storage.local.get(['processedOrders'], (result) => {
            sendResponse({data: result.processedOrders});
        });
        return true; // Keep message channel open for async response
    }
});

// Generate object hash using the same logic as objectHashBytes32 from claim-and-prove.ts
function generateObjectHash(obj) {
    const canonical = stringify(obj, { space: 0 });
    return ethers.keccak256(ethers.toUtf8Bytes(canonical));
}

// Process order data with cryptographic functions
function processOrderDataWithCrypto(data) {
    try {
        // Use json-stable-stringify for consistent serialization
        const stableStringified = stringify(data);
        
        // Create hash using ethers
        const hash = ethers.keccak256(ethers.toUtf8Bytes(stableStringified));
        
        // Create a simple signature (in production, use proper key management)
        const signature = ethers.keccak256(ethers.toUtf8Bytes(stableStringified + Date.now()));
        
        return {
            originalData: data,
            stableHash: hash,
            signature: signature,
            timestamp: new Date().toISOString(),
            version: '1.0.0'
        };
    } catch (error) {
        console.error('Error processing data with crypto:', error);
        return {
            originalData: data,
            error: error.message,
            timestamp: new Date().toISOString()
        };
    }
}
