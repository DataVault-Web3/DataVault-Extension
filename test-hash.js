// Test script to verify generateObjectHash function
// This can be run with: node test-hash.js

const { ethers } = require('ethers');
const stringify = require('json-stable-stringify');

// Generate object hash using the same logic as objectHashBytes32 from claim-and-prove.ts
function generateObjectHash(obj) {
    const canonical = stringify(obj, { space: 0 });
    return ethers.keccak256(ethers.toUtf8Bytes(canonical));
}

// Test with sample order data
const testOrders = [
    {
        itemName: "Test Product 1",
        amazonLink: "https://amazon.in/dp/test1",
        dateOrdered: "2024-01-15",
        returnStatus: "Not returned"
    },
    {
        itemName: "Test Product 2", 
        amazonLink: "https://amazon.in/dp/test2",
        dateOrdered: "2024-01-20",
        returnStatus: "Not returned"
    }
];

console.log('Testing generateObjectHash function...');
console.log('Input orders:', JSON.stringify(testOrders, null, 2));

const hash = generateObjectHash(testOrders);
console.log('Generated hash:', hash);
console.log('Hash length:', hash.length);
console.log('Hash starts with 0x:', hash.startsWith('0x'));

// Test with the same data to ensure consistency
const hash2 = generateObjectHash(testOrders);
console.log('Second hash:', hash2);
console.log('Hashes match:', hash === hash2);

// Test with different order (should produce different hash)
const testOrders2 = [
    {
        itemName: "Test Product 2", 
        amazonLink: "https://amazon.in/dp/test2",
        dateOrdered: "2024-01-20",
        returnStatus: "Not returned"
    },
    {
        itemName: "Test Product 1",
        amazonLink: "https://amazon.in/dp/test1",
        dateOrdered: "2024-01-15",
        returnStatus: "Not returned"
    }
];

const hash3 = generateObjectHash(testOrders2);
console.log('Hash for reordered data:', hash3);
console.log('Different order produces different hash:', hash !== hash3);
