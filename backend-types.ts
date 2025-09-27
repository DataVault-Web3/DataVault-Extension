// TypeScript interfaces for backend proof processing
// Use these types in your backend to match the proof data from the extension

import { SemaphoreProof } from '@semaphore-protocol/proof';
import { PackedGroth16Proof } from '@zk-kit/utils';

export interface OrderData {
    itemName: string;
    amazonLink: string;
    dateOrdered: string;
    returnStatus: string;
    price?: string;
    id?: string;
    extractedAt?: string;
    shared?: boolean;
}

export interface ProofData {
    // Proof components (8 BigInt values for Solidity)
    solidityProof: string[];
    nullifierHash: string;
    merkleRoot: string;
    
    // Group information
    groupId: string;
    groupSize: string;
    groupDepth: string;
    
    // Object data
    objectHash: string;
    orders: OrderData[];
    
    // Identity information
    commitment: string;
    userIdSeed: string;
    
    // Metadata
    timestamp: string;
    proofGeneratedAt: string;
}

export interface BackendResponse {
    success: boolean;
    message?: string;
    proofId?: string;
    verified?: boolean;
    error?: string;
}

// Function to recreate SemaphoreProof from proofData
export function recreateSemaphoreProof(proofData: ProofData): SemaphoreProof {
    // Convert solidityProof back to PackedGroth16Proof format
    const points: PackedGroth16Proof = {
        pi_a: [proofData.solidityProof[0], proofData.solidityProof[1]],
        pi_b: [
            [proofData.solidityProof[3], proofData.solidityProof[2]], // Note: order is swapped
            [proofData.solidityProof[5], proofData.solidityProof[4]]  // Note: order is swapped
        ],
        pi_c: [proofData.solidityProof[6], proofData.solidityProof[7]]
    };

    // Recreate the SemaphoreProof object
    const semaphoreProof: SemaphoreProof = {
        merkleTreeDepth: parseInt(proofData.groupDepth),
        merkleTreeRoot: proofData.merkleRoot,
        message: proofData.objectHash, // The message is the object hash
        nullifier: proofData.nullifierHash,
        scope: proofData.objectHash, // The scope is also the object hash (same as message)
        points: points
    };

    return semaphoreProof;
}

// Function to verify the recreated proof matches the original
export function verifyRecreatedProof(originalProofData: ProofData, recreatedProof: SemaphoreProof): boolean {
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

// Example backend endpoint handler
export class ProofProcessor {
    private semaphoreAddress: string;
    private groupId: bigint;
    
    constructor(semaphoreAddress: string, groupId: bigint) {
        this.semaphoreAddress = semaphoreAddress;
        this.groupId = groupId;
    }
    
    async processProof(proofData: ProofData): Promise<BackendResponse> {
        try {
            console.log('Processing proof data:', proofData);
            
            // Validate proof data
            if (!this.validateProofData(proofData)) {
                return {
                    success: false,
                    error: 'Invalid proof data structure'
                };
            }
            
            // Recreate the SemaphoreProof object from proofData
            const semaphoreProof = recreateSemaphoreProof(proofData);
            console.log('Recreated SemaphoreProof:', semaphoreProof);
            
            // Verify the recreated proof matches the original data
            const isRecreatedCorrectly = verifyRecreatedProof(proofData, semaphoreProof);
            if (!isRecreatedCorrectly) {
                return {
                    success: false,
                    error: 'Failed to recreate proof from data'
                };
            }
            
            // Here you would:
            // 1. Verify the proof using Semaphore verification
            // 2. Check if the commitment is in the group
            // 3. Verify the nullifier hasn't been used before
            // 4. Store the proof and order data in your database
            
            // Example verification logic (implement based on your needs):
            const isValid = await this.verifySemaphoreProof(proofData, semaphoreProof);
            
            if (isValid) {
                // Store in database
                const proofId = await this.storeProof(proofData, semaphoreProof);
                
                return {
                    success: true,
                    message: 'Proof verified and stored successfully',
                    proofId: proofId,
                    verified: true
                };
            } else {
                return {
                    success: false,
                    error: 'Proof verification failed'
                };
            }
            
        } catch (error) {
            console.error('Error processing proof:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }
    
    private validateProofData(proofData: ProofData): boolean {
        return !!(
            proofData.solidityProof &&
            proofData.solidityProof.length === 8 &&
            proofData.nullifierHash &&
            proofData.merkleRoot &&
            proofData.objectHash &&
            proofData.orders &&
            proofData.commitment &&
            proofData.userIdSeed
        );
    }
    
    private async verifySemaphoreProof(proofData: ProofData, semaphoreProof: SemaphoreProof): Promise<boolean> {
        // Implement your Semaphore proof verification logic here
        // This would typically involve:
        // 1. Verifying the proof against the group
        // 2. Checking the nullifier
        // 3. Validating the merkle root
        
        console.log('Verifying Semaphore proof...');
        console.log('Recreated proof:', semaphoreProof);
        console.log('Solidity proof:', proofData.solidityProof);
        console.log('Nullifier hash:', proofData.nullifierHash);
        console.log('Merkle root:', proofData.merkleRoot);
        
        // You can now use the recreated semaphoreProof object for verification
        // Example: await verifyProof(semaphoreProof, group, message, scope)
        
        // Placeholder - implement actual verification
        return true;
    }
    
    private async storeProof(proofData: ProofData, semaphoreProof: SemaphoreProof): Promise<string> {
        // Implement your database storage logic here
        console.log('Storing proof in database...');
        
        // Example database record structure:
        const proofRecord = {
            id: `proof_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            // Original proof data
            solidityProof: proofData.solidityProof,
            nullifierHash: proofData.nullifierHash,
            merkleRoot: proofData.merkleRoot,
            objectHash: proofData.objectHash,
            commitment: proofData.commitment,
            userIdSeed: proofData.userIdSeed,
            orders: proofData.orders,
            groupId: proofData.groupId,
            // Recreated SemaphoreProof object
            semaphoreProof: {
                merkleTreeDepth: semaphoreProof.merkleTreeDepth,
                merkleTreeRoot: semaphoreProof.merkleTreeRoot,
                message: semaphoreProof.message,
                nullifier: semaphoreProof.nullifier,
                scope: semaphoreProof.scope,
                points: semaphoreProof.points
            },
            createdAt: new Date().toISOString(),
            verified: true
        };
        
        console.log('Proof record with recreated SemaphoreProof:', proofRecord);
        
        // Return the proof ID
        return proofRecord.id;
    }
}

// Example Express.js endpoint
export function createProofEndpoint(proofProcessor: ProofProcessor) {
    return async (req: any, res: any) => {
        try {
            const proofData: ProofData = req.body;
            const result = await proofProcessor.processProof(proofData);
            
            res.status(result.success ? 200 : 400).json(result);
        } catch (error) {
            console.error('Endpoint error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    };
}
