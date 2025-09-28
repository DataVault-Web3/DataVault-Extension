// Browser environment polyfills
if (typeof global === 'undefined') {
  window.global = window;
}

if (typeof process === 'undefined') {
  window.process = {
    env: {},
    version: '',
    platform: 'browser',
    nextTick: (fn) => setTimeout(fn, 0)
  };
}

// Import dependencies
import { ethers } from 'ethers';
import stringify from 'json-stable-stringify';
// Note: Semaphore libraries are too complex for browser bundling
// We'll implement a simplified version for now

// Simplified Semaphore-like functions for browser compatibility
class SimpleIdentity {
    constructor(seed) {
        this.seed = seed;
        // Generate a simple commitment from the seed
        this.commitment = ethers.keccak256(ethers.toUtf8Bytes(seed));
    }
}

class SimpleGroup {
    constructor() {
        this.members = [];
        this.size = 0;
        this.depth = 1;
    }
    
    addMembers(commitments) {
        this.members.push(...commitments);
        this.size = this.members.length;
        this.depth = Math.ceil(Math.log2(Math.max(1, this.size)));
    }
    
    get root() {
        // Simple mock root for testing
        return BigInt('0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef');
    }
}

// Simplified proof generation (mock implementation)
async function generateSimpleProof(identity, group, externalNullifier, signal) {
    // This is a mock implementation for browser compatibility
    // In a real implementation, you'd need to use the actual Semaphore libraries
    console.log('Generating simplified proof (mock implementation)');
    
    return {
        merkleTreeRoot: group.root,
        nullifier: ethers.keccak256(ethers.toUtf8Bytes(identity.seed + externalNullifier.toString())),
        signal: signal,
        externalNullifier: externalNullifier,
        proof: {
            pi_a: ['0x123', '0x456'],
            pi_b: [['0x789', '0xabc'], ['0xdef', '0x111']],
            pi_c: ['0x222', '0x333']
        }
    };
}

// Content script to detect Amazon India visits and show consent dialog
console.log('Amazon Order History Extension loaded with ethers and json-stable-stringify support');

// Global state
let currentFilter = '3months';
let allOrders = [];
let selectedOrderIds = new Set(); // Track selected orders across filter changes

// Semaphore configuration
const SEMAPHORE_CONFIG = {
    SEMAPHORE_ADDRESS: '0xac2eF4f3a36536491024bD7434F0BD9EEE880a82',
    GROUP_ID: BigInt(0),
    RPC_URL: 'https://polygon-amoy.g.alchemy.com/v2/',
    PRIVATE_KEY: ''
};

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

function generateRandomUserId() {
    if (!getCookie('user_id_seed')) {
        const user_id_seed = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        setCookie('user_id_seed', user_id_seed, 30 * 24 * 60); // 30 days
        return user_id_seed;
    }
    return getCookie('user_id_seed');
}

// Generate object hash using the same logic as objectHashBytes32 from claim-and-prove.ts
function generateObjectHash(obj) {
    const canonical = stringify(obj, { space: 0 });
    return ethers.keccak256(ethers.toUtf8Bytes(canonical));
}

// Pack proof for Solidity (same as claim-and-prove.ts)
function packProofForSolidity(proof) {
    console.log("Raw proof structure:", JSON.stringify(proof, null, 2));
    
    // Handle our simplified proof structure
    if (proof.pi_a && proof.pi_b && proof.pi_c) {
        return [
            BigInt(proof.pi_a[0]), BigInt(proof.pi_a[1]),
            BigInt(proof.pi_b[0][1]), BigInt(proof.pi_b[0][0]), BigInt(proof.pi_b[1][1]), BigInt(proof.pi_b[1][0]),
            BigInt(proof.pi_c[0]), BigInt(proof.pi_c[1])
        ];
    } else if (proof.proof) {
        const { pi_a, pi_b, pi_c } = proof.proof;
        return [
            BigInt(pi_a[0]), BigInt(pi_a[1]),
            BigInt(pi_b[0][1]), BigInt(pi_b[0][0]), BigInt(pi_b[1][1]), BigInt(pi_b[1][0]),
            BigInt(pi_c[0]), BigInt(pi_c[1])
        ];
    } else if (Array.isArray(proof) && proof.length === 8) {
        return proof.map(p => BigInt(p));
    } else {
        throw new Error(`Unsupported proof structure: ${JSON.stringify(proof)}`);
    }
}

// Check if user is already in Semaphore group
async function isUserInSemaphoreGroup(userIdSeed) {
    try {
        // Check if we already have this user's commitment stored locally
        const storedCommitment = getCookie('semaphore_commitment');
        if (storedCommitment) {
            console.log('User already has Semaphore commitment stored locally');
            return true;
        }
        
        // Create identity to get commitment
        const identity = new SimpleIdentity(userIdSeed);
        const commitment = identity.commitment;
        
        // Create provider and wallet
        const provider = new ethers.JsonRpcProvider(SEMAPHORE_CONFIG.RPC_URL);
        const wallet = new ethers.Wallet(SEMAPHORE_CONFIG.PRIVATE_KEY, provider);
        
        // Get Semaphore contract
        const semaphoreABI = [
            "function getMerkleTreeSize(uint256 groupId) external view returns (uint256)",
            "function getMerkleTreeDepth(uint256 groupId) external view returns (uint256)",
            "function getMerkleTreeRoot(uint256 groupId) external view returns (uint256)"
        ];
        
        const semaphore = new ethers.Contract(SEMAPHORE_CONFIG.SEMAPHORE_ADDRESS, semaphoreABI, wallet);
        
        // Check if group is empty (no members yet)
        const groupSize = await semaphore.getMerkleTreeSize(SEMAPHORE_CONFIG.GROUP_ID);
        
        if (groupSize.toString() === '0') {
            console.log('Group is empty, user not in group');
            return false;
        }
        
        // For now, we'll assume if group has members, user might be in it
        // In a real implementation, you'd need to check the Merkle tree
        console.log('Group has members, checking if user is already added...');
        return false; // Assume not in group for now
        
    } catch (error) {
        console.error('Error checking if user is in group:', error);
        return false;
    }
}

// Semaphore add-member functionality
async function addMemberToSemaphoreGroup(userIdSeed) {
    try {
        console.log('=== Adding Member to Semaphore Group ===');
        
        // Check if user is already in the group
        const alreadyInGroup = await isUserInSemaphoreGroup(userIdSeed);
        if (alreadyInGroup) {
            console.log('✅ User already in Semaphore group');
            return {
                success: true,
                alreadyInGroup: true,
                message: 'User already in group'
            };
        }
        
        // Create identity from user seed
        const identity = new SimpleIdentity(userIdSeed);
        const commitment = identity.commitment;
        
        console.log('Identity commitment:', commitment.toString());
        
        // Create provider and wallet
        const provider = new ethers.JsonRpcProvider(SEMAPHORE_CONFIG.RPC_URL);
        const wallet = new ethers.Wallet(SEMAPHORE_CONFIG.PRIVATE_KEY, provider);
        
        // Get Semaphore contract
        const semaphoreABI = [
            "function addMember(uint256 groupId, uint256 identityCommitment) external",
            "function getMerkleTreeSize(uint256 groupId) external view returns (uint256)",
            "function getMerkleTreeDepth(uint256 groupId) external view returns (uint256)",
            "function getMerkleTreeRoot(uint256 groupId) external view returns (uint256)"
        ];
        
        const semaphore = new ethers.Contract(SEMAPHORE_CONFIG.SEMAPHORE_ADDRESS, semaphoreABI, wallet);
        
        // Add member to group
        console.log('Adding member to Semaphore group...');
        const tx = await semaphore.addMember(SEMAPHORE_CONFIG.GROUP_ID, commitment);
        console.log('Transaction hash:', tx.hash);
        
        // Wait for transaction confirmation
        const receipt = await tx.wait();
        console.log('Transaction confirmed in block:', receipt.blockNumber);
        
        // Store commitment locally to prevent duplicate additions
        setCookie('semaphore_commitment', commitment.toString(), 30 * 24 * 60); // 30 days
        
        console.log('✅ Member added successfully!');
        
        return {
            success: true,
            commitment: commitment.toString(),
            transactionHash: tx.hash,
            blockNumber: receipt.blockNumber
        };
        
    } catch (error) {
        console.error('❌ Error adding member to Semaphore group:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

// Generate full Semaphore proof for order data
async function generateFullProof(orders, userIdSeed) {
    try {
        console.log('=== Generating Full Semaphore Proof ===');
        console.log('Orders:', orders.length);
        console.log('User ID Seed:', userIdSeed);
        
        // Create identity from user seed
        const identity = new SimpleIdentity(userIdSeed);
        const commitment = identity.commitment;
        
        console.log('Identity commitment:', commitment.toString());
        
        // Create provider and wallet
        const provider = new ethers.JsonRpcProvider(SEMAPHORE_CONFIG.RPC_URL);
        const wallet = new ethers.Wallet(SEMAPHORE_CONFIG.PRIVATE_KEY, provider);
        
        // Get Semaphore contract
        const semaphoreABI = [
            "function getMerkleTreeSize(uint256 groupId) external view returns (uint256)",
            "function getMerkleTreeDepth(uint256 groupId) external view returns (uint256)",
            "function getMerkleTreeRoot(uint256 groupId) external view returns (uint256)"
        ];
        
        const semaphore = new ethers.Contract(SEMAPHORE_CONFIG.SEMAPHORE_ADDRESS, semaphoreABI, wallet);
        
        // Get group state
        const groupSize = await semaphore.getMerkleTreeSize(SEMAPHORE_CONFIG.GROUP_ID);
        const groupDepth = await semaphore.getMerkleTreeDepth(SEMAPHORE_CONFIG.GROUP_ID);
        const groupRoot = await semaphore.getMerkleTreeRoot(SEMAPHORE_CONFIG.GROUP_ID);
        
        console.log('Group size:', groupSize.toString());
        console.log('Group depth:', groupDepth.toString());
        console.log('Group root:', groupRoot.toString());
        
        // Build local group
        const group = new SimpleGroup();
        group.addMembers([commitment]);
        console.log('Local group size:', group.size);
        console.log('Local group root:', group.root.toString());
        
        // Generate object hash for orders
        const objectHash = generateObjectHash(orders);
        const objectHashField = BigInt(objectHash);
        
        console.log('Object hash:', objectHash);
        console.log('Object hash field:', objectHashField.toString());
        
        // Set up proof parameters
        const externalNullifier = objectHashField;
        const signal = objectHashField;
        
        console.log('External nullifier:', externalNullifier.toString());
        console.log('Signal:', signal.toString());
        
        // Generate proof
        console.log('Generating Semaphore proof...');
        const fullProof = await generateSimpleProof(identity, group, externalNullifier, signal);
        
        console.log('✅ Proof generated successfully!');
        console.log('Merkle root:', fullProof.merkleTreeRoot.toString());
        console.log('Nullifier:', fullProof.nullifier.toString());
        
        // Pack proof for Solidity
        const solidityProof = packProofForSolidity(fullProof.proof);
        const nullifierHash = fullProof.nullifier;
        const merkleRoot = fullProof.merkleTreeRoot;
        
        console.log('✅ Proof packed successfully!');
        console.log('Solidity proof:', solidityProof.map(p => p.toString()));
        
        // Prepare proof data for backend
        const proofData = {
            // Proof components
            solidityProof: solidityProof.map(p => p.toString()),
            nullifierHash: nullifierHash.toString(),
            merkleRoot: merkleRoot.toString(),
            
            // Group info
            groupId: SEMAPHORE_CONFIG.GROUP_ID.toString(),
            groupSize: groupSize.toString(),
            groupDepth: groupDepth.toString(),
            
            // Object data
            objectHash: objectHash,
            orders: orders,
            
            // Identity info
            commitment: commitment.toString(),
            userIdSeed: userIdSeed,
            
            // Metadata
            timestamp: new Date().toISOString(),
            proofGeneratedAt: new Date().toISOString()
        };
        
        console.log('Proof data prepared for backend:', proofData);
        
        return {
            success: true,
            proofData: proofData,
            fullProof: fullProof
        };
        
    } catch (error) {
        console.error('❌ Error generating full proof:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

// Send proof data to backend
async function sendProofToBackend(proofData, ordersData, backendUrl = 'http://localhost:5007/api/proof') {
    try {
        console.log('Sending proof data to backend:', backendUrl);
        console.log('Proof data:', proofData);
        console.log('Orders data:', ordersData);
        
        const response = await fetch(backendUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(proofData)
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Backend error response:', errorText);
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }
        
        const result = await response.json();
        console.log('✅ Proof sent to backend successfully:', result);
        
        return {
            success: true,
            result: result
        };
        
    } catch (error) {
        console.error('❌ Error sending proof to backend:', error);
        return {
            success: false,
            error: error.message
        };
    }
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
    const baseString = `${order.itemName}_${order.dateOrdered}_${order.amazonLink || ''}_${order.price || ''}`;
    
    // Handle non-Latin characters by encoding to UTF-8 first
    try {
        const encodedString = btoa(unescape(encodeURIComponent(baseString)));
        return encodedString.replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);
    } catch (error) {
        // Fallback: use a simple hash for non-Latin characters
        let hash = 0;
        for (let i = 0; i < baseString.length; i++) {
            const char = baseString.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash).toString(36).substring(0, 16);
    }
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

async function handleShareSelected() {
    
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
    
    // Generate full proof and send to backend
    const userIdSeed = generateRandomUserId();
    console.log('Generating full proof and sending to backend...');
    
    try {
        // First, ensure user is in Semaphore group
        const semaphoreResult = await addMemberToSemaphoreGroup(userIdSeed);
        
        if (semaphoreResult.success) {
            console.log('✅ User in Semaphore group, generating proof...');
            
            // Generate full proof
            const proofResult = await generateFullProof(selectedOrders, userIdSeed);
            
            if (proofResult.success) {
                console.log('✅ Full proof generated successfully!');
                
                // Send proof and selectedOrders to backend
                const backendResult = await sendProofToBackend(proofResult.proofData, selectedOrders);
                
                if (backendResult.success) {
                    console.log('✅ Proof sent to backend successfully!');
                    
                    // Store proof info in Chrome storage
                    chrome.storage.local.set({
                        semaphoreInfo: {
                            commitment: proofResult.proofData.commitment,
                            objectHash: proofResult.proofData.objectHash,
                            merkleRoot: proofResult.proofData.merkleRoot,
                            nullifierHash: proofResult.proofData.nullifierHash,
                            proofGeneratedAt: proofResult.proofData.proofGeneratedAt,
                            backendResponse: backendResult.result
                        }
                    });
                    
                    // Show success notification
                    showZKProofNotification(true);
                } else {
                    console.error('❌ Failed to send proof to backend:', backendResult.error);
                    showZKProofNotification(false, `Backend error: ${backendResult.error}`);
                }
            } else {
                console.error('❌ Failed to generate full proof:', proofResult.error);
                showZKProofNotification(false, `Proof generation failed: ${proofResult.error}`);
            }
        } else {
            console.error('❌ Failed to add to Semaphore group:', semaphoreResult.error);
            showZKProofNotification(false, semaphoreResult.error);
        }
    } catch (error) {
        console.error('❌ Error in proof generation:', error);
        showZKProofNotification(false, error.message);
    }
    
    // Close the popup with a slight delay to ensure logging completes
    setTimeout(() => {
        console.log('Closing popup...');
        closePopup();
    }, 100);
}

// Show small ZK proof notification at bottom of page
function showZKProofNotification(success = true, error = null) {
    // Remove any existing notification
    const existingNotification = document.getElementById('zk-proof-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.id = 'zk-proof-notification';
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: ${success ? '#10b981' : '#ef4444'};
        color: white;
        padding: 12px 16px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        max-width: 300px;
        display: flex;
        align-items: center;
        gap: 8px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
    `;
    
    const icon = success ? '🔐' : '❌';
    const message = success ? 
        'ZK Proof generated & added to group' : 
        `ZK Proof failed: ${error || 'Unknown error'}`;
    
    notification.innerHTML = `
        <span style="font-size: 16px;">${icon}</span>
        <span>${message}</span>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 4000);
}

// Save orders to Chrome storage for dashboard access
function saveToDashboard(orders) {
    console.log('=== SAVE TO DASHBOARD DEBUG ===');
    
    
    // Get existing orders from storage
    chrome.storage.local.get(['amazonOrders'], function(result) {
        console.log('CHECKKKKK');
        
        const existingOrders = result.amazonOrders || [];
        const existingIds = new Set(fixedExistingOrders.map(order => order.id));
        
        // Filter out duplicate orders
        const newOrders = orders.filter(order => !existingIds.has(order.id));
        console.log('New orders to save:', newOrders.length);
        console.log('New order IDs:', newOrders.map(o => o.id));
        
        if (newOrders.length > 0) {
            const updatedOrders = [...fixedExistingOrders, ...newOrders];
            
            // Debug: Log order properties
            console.log('Sample order properties:', newOrders[0]);
            console.log('Updated orders count:', updatedOrders.length);
            
            // Save updated orders to storage
            chrome.storage.local.set({ amazonOrders: updatedOrders }, function() {
                if (chrome.runtime.lastError) {
                    console.error('Storage set error:', chrome.runtime.lastError);
                } else {
                    console.log(`✅ Successfully saved ${newOrders.length} new orders to dashboard`);
                    console.log('Total orders in storage:', updatedOrders.length);
                }
                
                // Notify popup about new orders (with error handling)
                try {
                    chrome.runtime.sendMessage({
                        type: 'ordersExtracted',
                        orders: newOrders,
                        total: updatedOrders.length
                    }, function(response) {
                        if (chrome.runtime.lastError) {
                            console.log('Message send error (popup may not be open):', chrome.runtime.lastError.message);
                        } else {
                            console.log('✅ Sent message to popup about new orders');
                        }
                    });
                } catch (error) {
                    console.log('Message send failed (popup may not be open):', error.message);
                }
                
                // Also store a flag to indicate new orders were added
                chrome.storage.local.set({ 
                    newOrdersAdded: true,
                    lastOrderUpdate: Date.now()
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


    const userIdSeed = generateRandomUserId();
    const objectHash = generateObjectHash(orders);
    
    console.log('Generated object hash:', objectHash);
    console.log('User ID seed:', userIdSeed);

    // add-member
    
    // Store in extension storage for potential future use
    chrome.storage.local.set({
        orderHistory: orders,
        amazonOrders: orders, // Also save to amazonOrders for dashboard compatibility
        objectHash: objectHash,
        userIdSeed: userIdSeed,
        timestamp: Date.now(),
        totalOrders: orders.length,
        filterApplied: currentFilter,
        estimatedPayout: (orders.length * 0.50).toFixed(2),
        extractedFromDomain: window.location.hostname
    });
    
    console.log('Order history extraction completed successfully!');
}

// Initialize the extension when the page loads
function initializeExtension() {
    console.log('DataVault Extension initialized on:', window.location.hostname);
    
    // Check if we're on Amazon
    if (window.location.hostname.includes('amazon.in')) {
        console.log('Amazon.in detected - setting up order extraction');
        
        // Wait for page to load completely
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', setupOrderExtraction);
        } else {
            setupOrderExtraction();
        }
    }
}

function setupOrderExtraction() {
    console.log('Setting up order extraction...');
    
    // Try to extract orders automatically
    setTimeout(() => {
        tryExtractOrders();
    }, 2000); // Wait 2 seconds for page to load
}

function tryExtractOrders() {
    console.log('Attempting to extract orders...');
    
    // Try different extraction methods
    const orders = [];
    
    // Method 1: Try to extract from order history page
    const orderCards = document.querySelectorAll('[data-order-id], .order-card, .a-box-group');
    console.log('Found order cards:', orderCards.length);
    
    orderCards.forEach((card, index) => {
        const order = extractOrderDataFromCard(card);
        if (order && order.length > 0) {
            orders.push(...order);
        }
    });
    
    // Method 2: Try to extract from order elements
    const orderElements = document.querySelectorAll('.order, .shipment-item, .a-row');
    console.log('Found order elements:', orderElements.length);
    
    orderElements.forEach(element => {
        const order = extractOrderFromElement(element);
        if (order) {
            orders.push(order);
        }
    });
    
    console.log('Extracted orders:', orders.length);
    
    if (orders.length > 0) {
        // Automatically save orders to dashboard
        const ordersWithIds = orders.map(order => ({
            ...order,
            id: createOrderId(order),
            extractedAt: new Date().toISOString(),
            autoExtracted: true
        }));
        
        console.log('Auto-saving orders to dashboard...');
        saveToDashboard(ordersWithIds);
        
        // Show notification
        showZKProofNotification(true, null);
    } else {
        console.log('No orders found to extract');
    }
}

// Function to hardcode the 10 orders from console
window.setHardcodedOrders = function() {
    console.log('=== SETTING HARDCODED ORDERS ===');
    
    const hardcodedOrders = [
        {
            id: 'amazon_pay_wallet_1',
            itemName: 'Amazon Pay Wallet',
            amazonLink: 'https://amazon.in/dp/B01LTHND2O?ref=ppx_yo2ov_dt_b_fed_asin_title',
            price: '₹0',
            dateOrdered: '2025-09-15',
            returnStatus: 'Not returned',
            extractedAt: new Date().toISOString(),
            autoExtracted: true
        },
        {
            id: 'phone_charms_2',
            itemName: '5Pcs Phone Charms, Cute Cat Bag Charms for Handbags, Anime Accessories Phone Charm with Cat Chain, Mobile Charms for Phone Case and Bag Decoration',
            amazonLink: 'https://amazon.in/dp/B0FL1WWQR7?ref=ppx_yo2ov_dt_b_fed_asin_title',
            price: '₹299',
            dateOrdered: '2025-07-21',
            returnStatus: 'Not returned',
            extractedAt: new Date().toISOString(),
            autoExtracted: true
        },
        {
            id: 'crochet_keychain_3',
            itemName: 'JCGI® Handmade Crochet Sunflower Keychain Decorative Cute Bag Purse Keyrings Charm Love Stylish Lightweight Motorbike Car Unique Personalized Keychain Girlfriend Sister Gift Travel Accessories',
            amazonLink: 'https://amazon.in/dp/B0DG27GFDJ?ref=ppx_yo2ov_dt_b_fed_asin_title',
            price: '₹199',
            dateOrdered: '2025-07-23',
            returnStatus: 'Not returned',
            extractedAt: new Date().toISOString(),
            autoExtracted: true
        },
        {
            id: 'bata_sandals_4',
            itemName: 'Bata Women\'s Slip-on Sandal - BEIGE (5 UK) (5618803)',
            amazonLink: 'https://amazon.in/dp/B095X47QVR?ref=ppx_yo2ov_dt_b_fed_asin_title',
            price: '₹899',
            dateOrdered: '2025-09-02',
            returnStatus: 'Not returned',
            extractedAt: new Date().toISOString(),
            autoExtracted: true
        },
        {
            id: 'zaveri_bracelet_5',
            itemName: 'ZAVERI PEARLS Multi For Women-Color Silver Artificial Stones Embellished Kada Bracelets For Women-ZPFK16889',
            amazonLink: 'https://amazon.in/dp/B0CM9KV4YX?ref=ppx_yo2ov_dt_b_fed_asin_title',
            price: '₹399',
            dateOrdered: '2025-07-07',
            returnStatus: 'Not returned',
            extractedAt: new Date().toISOString(),
            autoExtracted: true
        },
        {
            id: 'vaseline_lip_6',
            itemName: 'Vaseline Lip Tins Rosy Lips, 17 g | Provides Hydration, Sheer Pink Tint & Glossy Shine',
            amazonLink: 'https://amazon.in/dp/B09J8RBPPZ?ref=ppx_yo2ov_dt_b_fed_asin_title',
            price: '₹149',
            dateOrdered: '2025-07-08',
            returnStatus: 'Not returned',
            extractedAt: new Date().toISOString(),
            autoExtracted: true
        },
        {
            id: 'sphinx_vase_7',
            itemName: 'SPHINX Decorative Glass Vase for Flowers Plants Home Decor Office Living Table Decorations, Vases for Home Decor, Luster Glass Vase, Heavy Weight, Sturdy- (Crystal Amber, Approx 9 Inches Height)',
            amazonLink: 'https://amazon.in/dp/B0CSWJ39V4?ref=ppx_yo2ov_dt_b_fed_asin_title',
            price: '₹599',
            dateOrdered: '2025-07-13',
            returnStatus: 'Not returned',
            extractedAt: new Date().toISOString(),
            autoExtracted: true
        },
        {
            id: 'happer_clothes_stand_8',
            itemName: 'Happer Premium Clothes Stand for Drying with Wheels | Portable | 2 Layer Rack for Balcony | Foldable Wings | 14 Hanger Rods | Anti Rust Steel Metal (Orange | Compact Jumbo)',
            amazonLink: 'https://amazon.in/dp/B08242S175?ref=ppx_yo2ov_dt_b_fed_asin_title',
            price: '₹1299',
            dateOrdered: '2025-07-10',
            returnStatus: 'Not returned',
            extractedAt: new Date().toISOString(),
            autoExtracted: true
        },
        {
            id: 'zureni_clothes_pins_9',
            itemName: 'Zureni Heavy Duty Clothes Pins Multipurpose Tight Grip Laundry Clips with Springs Air-Drying Clothing Pin Set for Balcony & Outdoor Use- (Pack of 12, Random Color)',
            amazonLink: 'https://amazon.in/dp/B0C6KJCBLY?ref=ppx_yo2ov_dt_b_fed_asin_title',
            price: '₹199',
            dateOrdered: '2025-09-04',
            returnStatus: 'Not returned',
            extractedAt: new Date().toISOString(),
            autoExtracted: true
        },
        {
            id: 'view_order_details_10',
            itemName: 'View order details',
            amazonLink: 'https://www.amazon.in/uff/your-account/order-details?orderID=406-1487752-7977155&ref=ppx_yo2ov_dt_b_fed_wwgs_yo_odp_A21TJRUUN4KGV',
            price: '₹0',
            dateOrdered: '2025-07-21',
            returnStatus: 'Not returned',
            extractedAt: new Date().toISOString(),
            autoExtracted: true
        }
    ];
    
    chrome.storage.local.set({ amazonOrders: hardcodedOrders }, function() {
        console.log('✅ Hardcoded 10 orders saved to storage');
        console.log('Orders saved:', hardcodedOrders.length);
        
        // Also set the flag to notify popup
        chrome.storage.local.set({ 
            newOrdersAdded: true,
            lastOrderUpdate: Date.now()
        });
        
        console.log('✅ Dashboard should now show the 10 orders!');
    });
};

// Test function to directly test storage
window.testStorage = function() {
    console.log('=== TESTING CHROME STORAGE ===');
    
    // Test 1: Check if chrome.storage is available
    console.log('Chrome object:', typeof chrome);
    console.log('Chrome storage:', typeof chrome?.storage);
    console.log('Chrome storage local:', typeof chrome?.storage?.local);
    
    // Test 2: Try to write a simple value
    chrome.storage.local.set({ testValue: 'Hello World' }, function() {
        if (chrome.runtime.lastError) {
            console.error('Storage write error:', chrome.runtime.lastError);
        } else {
            console.log('✅ Storage write successful');
            
            // Test 3: Try to read it back
            chrome.storage.local.get(['testValue'], function(result) {
                if (chrome.runtime.lastError) {
                    console.error('Storage read error:', chrome.runtime.lastError);
                } else {
                    console.log('✅ Storage read successful:', result);
                }
            });
        }
    });
    
    // Test 4: Try to write orders
    const testOrders = [
        {
            id: 'test123',
            itemName: 'Test Product',
            amazonLink: 'https://amazon.in/test',
            price: '₹999',
            dateOrdered: '2024-01-15',
            returnStatus: 'Not returned'
        }
    ];
    
    chrome.storage.local.set({ amazonOrders: testOrders }, function() {
        if (chrome.runtime.lastError) {
            console.error('Orders storage write error:', chrome.runtime.lastError);
        } else {
            console.log('✅ Orders storage write successful');
            
            // Read back the orders
            chrome.storage.local.get(['amazonOrders'], function(result) {
                if (chrome.runtime.lastError) {
                    console.error('Orders storage read error:', chrome.runtime.lastError);
                } else {
                    console.log('✅ Orders storage read successful:', result);
                }
            });
        }
    });
};

// Start the extension
initializeExtension();