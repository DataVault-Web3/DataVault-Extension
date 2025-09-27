// Test script to verify proof generation functionality
// This can be run with: node test-proof-generation.js

const { ethers } = require('ethers');
const { Identity } = require('@semaphore-protocol/identity');
const { Group } = require('@semaphore-protocol/group');
const { generateProof } = require('@semaphore-protocol/proof');
const stringify = require('json-stable-stringify');

// Test configuration
const TEST_CONFIG = {
    SEMAPHORE_ADDRESS: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
    GROUP_ID: BigInt(0),
    RPC_URL: 'http://127.0.0.1:8545',
    PRIVATE_KEY: '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'
};

// Test order data
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

// Generate object hash (same as in content.js)
function generateObjectHash(obj) {
    const canonical = stringify(obj, { space: 0 });
    return ethers.keccak256(ethers.toUtf8Bytes(canonical));
}

// Pack proof for Solidity (same as in content.js)
function packProofForSolidity(proof) {
    console.log("Raw proof structure:", JSON.stringify(proof, null, 2));
    
    if (proof.proof) {
        const { pi_a, pi_b, pi_c } = proof.proof;
        return [
            BigInt(pi_a[0]), BigInt(pi_a[1]),
            BigInt(pi_b[0][1]), BigInt(pi_b[0][0]), BigInt(pi_b[1][1]), BigInt(pi_b[1][0]),
            BigInt(pi_c[0]), BigInt(pi_c[1])
        ];
    } else if (proof.pi_a && proof.pi_b && proof.pi_c) {
        return [
            BigInt(proof.pi_a[0]), BigInt(proof.pi_a[1]),
            BigInt(proof.pi_b[0][1]), BigInt(proof.pi_b[0][0]), BigInt(proof.pi_b[1][1]), BigInt(proof.pi_b[1][0]),
            BigInt(proof.pi_c[0]), BigInt(proof.pi_c[1])
        ];
    } else if (Array.isArray(proof) && proof.length === 8) {
        return proof.map(p => BigInt(p));
    } else {
        throw new Error(`Unsupported proof structure: ${JSON.stringify(proof)}`);
    }
}

async function testProofGeneration() {
    try {
        console.log('=== Testing Full Proof Generation ===');
        console.log('Test orders:', testOrders.length);
        
        // Create test identity
        const testSeed = 'test-user-seed-12345';
        const identity = new Identity(testSeed);
        const commitment = identity.commitment;
        
        console.log('✅ Identity created');
        console.log('Test seed:', testSeed);
        console.log('Commitment:', commitment.toString());
        
        // Create provider and wallet
        const provider = new ethers.JsonRpcProvider(TEST_CONFIG.RPC_URL);
        const wallet = new ethers.Wallet(TEST_CONFIG.PRIVATE_KEY, provider);
        
        console.log('✅ Provider and wallet created');
        console.log('Wallet address:', wallet.address);
        
        // Get Semaphore contract
        const semaphoreABI = [
            "function getMerkleTreeSize(uint256 groupId) external view returns (uint256)",
            "function getMerkleTreeDepth(uint256 groupId) external view returns (uint256)",
            "function getMerkleTreeRoot(uint256 groupId) external view returns (uint256)"
        ];
        
        const semaphore = new ethers.Contract(TEST_CONFIG.SEMAPHORE_ADDRESS, semaphoreABI, wallet);
        
        // Get group state
        const groupSize = await semaphore.getMerkleTreeSize(TEST_CONFIG.GROUP_ID);
        const groupDepth = await semaphore.getMerkleTreeDepth(TEST_CONFIG.GROUP_ID);
        const groupRoot = await semaphore.getMerkleTreeRoot(TEST_CONFIG.GROUP_ID);
        
        console.log('✅ Group state retrieved');
        console.log('Group size:', groupSize.toString());
        console.log('Group depth:', groupDepth.toString());
        console.log('Group root:', groupRoot.toString());
        
        // Build local group
        const group = new Group();
        group.addMembers([commitment]);
        console.log('✅ Local group created');
        console.log('Local group size:', group.size);
        console.log('Local group root:', group.root.toString());
        
        // Generate object hash
        const objectHash = generateObjectHash(testOrders);
        const objectHashField = BigInt(objectHash);
        
        console.log('✅ Object hash generated');
        console.log('Object hash:', objectHash);
        console.log('Object hash field:', objectHashField.toString());
        
        // Set up proof parameters
        const externalNullifier = objectHashField;
        const signal = objectHashField;
        
        console.log('External nullifier:', externalNullifier.toString());
        console.log('Signal:', signal.toString());
        
        // Generate proof
        console.log('Generating Semaphore proof...');
        const fullProof = await generateProof(identity, group, externalNullifier, signal);
        
        console.log('✅ Proof generated successfully!');
        console.log('Merkle root:', fullProof.merkleTreeRoot.toString());
        console.log('Nullifier:', fullProof.nullifier.toString());
        
        // Pack proof for Solidity
        const solidityProof = packProofForSolidity(fullProof.points);
        const nullifierHash = fullProof.nullifier;
        const merkleRoot = fullProof.merkleTreeRoot;
        
        console.log('✅ Proof packed successfully!');
        console.log('Solidity proof:', solidityProof.map(p => p.toString()));
        
        // Prepare proof data (same structure as content.js)
        const proofData = {
            // Proof components
            solidityProof: solidityProof.map(p => p.toString()),
            nullifierHash: nullifierHash.toString(),
            merkleRoot: merkleRoot.toString(),
            
            // Group info
            groupId: TEST_CONFIG.GROUP_ID.toString(),
            groupSize: groupSize.toString(),
            groupDepth: groupDepth.toString(),
            
            // Object data
            objectHash: objectHash,
            orders: testOrders,
            
            // Identity info
            commitment: commitment.toString(),
            userIdSeed: testSeed,
            
            // Metadata
            timestamp: new Date().toISOString(),
            proofGeneratedAt: new Date().toISOString()
        };
        
        console.log('\n✅ Full proof data prepared:');
        console.log(JSON.stringify(proofData, null, 2));
        
        console.log('\n🎉 All proof generation tests passed!');
        console.log('The extension should work with full proof generation.');
        
    } catch (error) {
        console.error('❌ Proof generation test failed:', error);
        console.error('Error details:', error.message);
    }
}

// Run the test
testProofGeneration();
