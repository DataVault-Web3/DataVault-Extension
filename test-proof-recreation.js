// Test script to verify SemaphoreProof recreation from proofData
// This can be run with: node test-proof-recreation.js

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
    }
];

// Generate object hash (same as in content.js)
function generateObjectHash(obj) {
    const canonical = stringify(obj, { space: 0 });
    return ethers.keccak256(ethers.toUtf8Bytes(canonical));
}

// Pack proof for Solidity (same as in content.js)
function packProofForSolidity(proof) {
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

// Recreate SemaphoreProof from proofData (same as backend-types.ts)
function recreateSemaphoreProof(proofData) {
    // Convert solidityProof back to PackedGroth16Proof format
    const points = {
        pi_a: [proofData.solidityProof[0], proofData.solidityProof[1]],
        pi_b: [
            [proofData.solidityProof[3], proofData.solidityProof[2]], // Note: order is swapped
            [proofData.solidityProof[5], proofData.solidityProof[4]]  // Note: order is swapped
        ],
        pi_c: [proofData.solidityProof[6], proofData.solidityProof[7]]
    };

    // Recreate the SemaphoreProof object
    const semaphoreProof = {
        merkleTreeDepth: parseInt(proofData.groupDepth),
        merkleTreeRoot: proofData.merkleRoot,
        message: proofData.objectHash, // The message is the object hash
        nullifier: proofData.nullifierHash,
        scope: proofData.objectHash, // The scope is also the object hash (same as message)
        points: points
    };

    return semaphoreProof;
}

// Verify the recreated proof matches the original
function verifyRecreatedProof(originalProofData, recreatedProof) {
    try {
        // Check all components match
        const depthMatch = recreatedProof.merkleTreeDepth === parseInt(originalProofData.groupDepth);
        const rootMatch = recreatedProof.merkleTreeRoot === originalProofData.merkleRoot;
        const messageMatch = recreatedProof.message === originalProofData.objectHash;
        const nullifierMatch = recreatedProof.nullifier === originalProofData.nullifierHash;
        const scopeMatch = recreatedProof.scope === originalProofData.objectHash;
        
        // Check points structure
        const pointsMatch = 
            recreatedProof.points.pi_a[0] === originalProofData.solidityProof[0] &&
            recreatedProof.points.pi_a[1] === originalProofData.solidityProof[1] &&
            recreatedProof.points.pi_b[0][0] === originalProofData.solidityProof[2] &&
            recreatedProof.points.pi_b[0][1] === originalProofData.solidityProof[3] &&
            recreatedProof.points.pi_b[1][0] === originalProofData.solidityProof[4] &&
            recreatedProof.points.pi_b[1][1] === originalProofData.solidityProof[5] &&
            recreatedProof.points.pi_c[0] === originalProofData.solidityProof[6] &&
            recreatedProof.points.pi_c[1] === originalProofData.solidityProof[7];

        return depthMatch && rootMatch && messageMatch && nullifierMatch && scopeMatch && pointsMatch;
    } catch (error) {
        console.error('Error verifying recreated proof:', error);
        return false;
    }
}

async function testProofRecreation() {
    try {
        console.log('=== Testing SemaphoreProof Recreation ===');
        
        // Create test identity
        const testSeed = 'test-user-seed-12345';
        const identity = new Identity(testSeed);
        const commitment = identity.commitment;
        
        console.log('✅ Identity created');
        console.log('Commitment:', commitment.toString());
        
        // Build local group
        const group = new Group();
        group.addMembers([commitment]);
        console.log('✅ Local group created');
        console.log('Group size:', group.size);
        console.log('Group root:', group.root.toString());
        
        // Generate object hash
        const objectHash = generateObjectHash(testOrders);
        const objectHashField = BigInt(objectHash);
        
        console.log('✅ Object hash generated');
        console.log('Object hash:', objectHash);
        
        // Set up proof parameters
        const externalNullifier = objectHashField;
        const signal = objectHashField;
        
        // Generate original proof
        console.log('Generating original Semaphore proof...');
        const originalProof = await generateProof(identity, group, externalNullifier, signal);
        
        console.log('✅ Original proof generated');
        console.log('Merkle root:', originalProof.merkleTreeRoot.toString());
        console.log('Nullifier:', originalProof.nullifier.toString());
        console.log('Message:', originalProof.message);
        console.log('Scope:', originalProof.scope);
        console.log('Depth:', originalProof.merkleTreeDepth);
        
        // Pack proof for Solidity (simulate what extension does)
        const solidityProof = packProofForSolidity(originalProof.points);
        console.log('✅ Proof packed for Solidity');
        console.log('Solidity proof:', solidityProof.map(p => p.toString()));
        
        // Create proofData (simulate what extension sends to backend)
        const proofData = {
            solidityProof: solidityProof.map(p => p.toString()),
            nullifierHash: originalProof.nullifier.toString(),
            merkleRoot: originalProof.merkleTreeRoot.toString(),
            groupId: TEST_CONFIG.GROUP_ID.toString(),
            groupSize: group.size.toString(),
            groupDepth: group.depth.toString(),
            objectHash: objectHash,
            orders: testOrders,
            commitment: commitment.toString(),
            userIdSeed: testSeed,
            timestamp: new Date().toISOString(),
            proofGeneratedAt: new Date().toISOString()
        };
        
        console.log('\n📦 Proof data (what extension sends to backend):');
        console.log(JSON.stringify(proofData, null, 2));
        
        // Recreate SemaphoreProof from proofData (simulate what backend does)
        console.log('\n🔄 Recreating SemaphoreProof from proofData...');
        const recreatedProof = recreateSemaphoreProof(proofData);
        
        console.log('✅ SemaphoreProof recreated');
        console.log('Recreated proof:', JSON.stringify(recreatedProof, null, 2));
        
        // Verify the recreated proof matches the original
        console.log('\n🔍 Verifying recreated proof matches original...');
        const isCorrect = verifyRecreatedProof(proofData, recreatedProof);
        
        if (isCorrect) {
            console.log('✅ SUCCESS: Recreated proof matches original perfectly!');
            console.log('🎉 You can now use the recreated SemaphoreProof object in your backend!');
        } else {
            console.log('❌ FAILED: Recreated proof does not match original');
        }
        
        // Show comparison
        console.log('\n📊 Comparison:');
        console.log('Original merkleTreeDepth:', originalProof.merkleTreeDepth);
        console.log('Recreated merkleTreeDepth:', recreatedProof.merkleTreeDepth);
        console.log('Match:', originalProof.merkleTreeDepth === recreatedProof.merkleTreeDepth);
        
        console.log('Original merkleTreeRoot:', originalProof.merkleTreeRoot);
        console.log('Recreated merkleTreeRoot:', recreatedProof.merkleTreeRoot);
        console.log('Match:', originalProof.merkleTreeRoot === recreatedProof.merkleTreeRoot);
        
        console.log('Original message:', originalProof.message);
        console.log('Recreated message:', recreatedProof.message);
        console.log('Match:', originalProof.message === recreatedProof.message);
        
        console.log('Original nullifier:', originalProof.nullifier);
        console.log('Recreated nullifier:', recreatedProof.nullifier);
        console.log('Match:', originalProof.nullifier === recreatedProof.nullifier);
        
    } catch (error) {
        console.error('❌ Proof recreation test failed:', error);
        console.error('Error details:', error.message);
    }
}

// Run the test
testProofRecreation();
