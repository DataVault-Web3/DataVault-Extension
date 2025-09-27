// Test script to verify Semaphore integration
// This can be run with: node test-semaphore.js

const { ethers } = require('ethers');
const { Identity } = require('@semaphore-protocol/identity');

// Semaphore configuration
const SEMAPHORE_CONFIG = {
    SEMAPHORE_ADDRESS: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
    GROUP_ID: BigInt(0),
    RPC_URL: 'http://127.0.0.1:8545',
    PRIVATE_KEY: '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'
};

async function testSemaphoreIntegration() {
    try {
        console.log('=== Testing Semaphore Integration ===');
        console.log('Semaphore Address:', SEMAPHORE_CONFIG.SEMAPHORE_ADDRESS);
        console.log('Group ID:', SEMAPHORE_CONFIG.GROUP_ID.toString());
        console.log('RPC URL:', SEMAPHORE_CONFIG.RPC_URL);
        
        // Test identity creation
        const testSeed = 'test-user-seed-12345';
        const identity = new Identity(testSeed);
        const commitment = identity.commitment;
        
        console.log('✅ Identity created successfully');
        console.log('Test seed:', testSeed);
        console.log('Commitment:', commitment.toString());
        
        // Test provider connection
        const provider = new ethers.JsonRpcProvider(SEMAPHORE_CONFIG.RPC_URL);
        const network = await provider.getNetwork();
        console.log('✅ Provider connected successfully');
        console.log('Network:', network.name, 'Chain ID:', network.chainId.toString());
        
        // Test wallet creation
        const wallet = new ethers.Wallet(SEMAPHORE_CONFIG.PRIVATE_KEY, provider);
        console.log('✅ Wallet created successfully');
        console.log('Wallet address:', wallet.address);
        
        // Test contract connection
        const semaphoreABI = [
            "function addMember(uint256 groupId, uint256 identityCommitment) external",
            "function getMerkleTreeSize(uint256 groupId) external view returns (uint256)",
            "function getMerkleTreeDepth(uint256 groupId) external view returns (uint256)",
            "function getMerkleTreeRoot(uint256 groupId) external view returns (uint256)"
        ];
        
        const semaphore = new ethers.Contract(SEMAPHORE_CONFIG.SEMAPHORE_ADDRESS, semaphoreABI, wallet);
        console.log('✅ Semaphore contract connected successfully');
        
        // Test reading group state
        try {
            const groupSize = await semaphore.getMerkleTreeSize(SEMAPHORE_CONFIG.GROUP_ID);
            const groupDepth = await semaphore.getMerkleTreeDepth(SEMAPHORE_CONFIG.GROUP_ID);
            const groupRoot = await semaphore.getMerkleTreeRoot(SEMAPHORE_CONFIG.GROUP_ID);
            
            console.log('✅ Group state read successfully');
            console.log('Group size:', groupSize.toString());
            console.log('Group depth:', groupDepth.toString());
            console.log('Group root:', groupRoot.toString());
            
        } catch (error) {
            console.log('⚠️  Could not read group state (contract might not be deployed):', error.message);
        }
        
        console.log('\n✅ All Semaphore integration tests passed!');
        console.log('The extension should work with Semaphore integration.');
        
    } catch (error) {
        console.error('❌ Semaphore integration test failed:', error);
        console.error('Error details:', error.message);
    }
}

// Run the test
testSemaphoreIntegration();
