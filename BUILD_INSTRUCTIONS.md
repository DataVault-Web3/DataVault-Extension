# DataVault Extension Build Instructions

This Chrome extension now includes `ethers` and `json-stable-stringify` dependencies.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Build the extension:**
   ```bash
   npm run build
   ```

3. **For development (with watch mode):**
   ```bash
   npm run dev
   ```

## Loading the Extension

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked"
4. Select the `dist` folder (not the root folder)
5. The extension should now be loaded and ready to use

## Development Workflow

- Source files are in the `src/` directory
- Built files go to the `dist/` directory
- Use `npm run dev` for development with auto-rebuild
- Use `npm run build` for production builds
- Use `npm run clean` to clean the dist folder

## Dependencies Available

- **ethers**: For blockchain interactions and cryptographic functions
- **json-stable-stringify**: For consistent JSON serialization

**Note**: Semaphore protocol libraries were removed due to browser compatibility issues. The extension now uses simplified mock implementations for demonstration purposes.

## Usage in Code

```javascript
import { ethers } from 'ethers';
import stringify from 'json-stable-stringify';

// Use ethers for blockchain operations
const provider = new ethers.JsonRpcProvider('https://mainnet.infura.io/v3/YOUR_PROJECT_ID');
const hash = ethers.keccak256(ethers.toUtf8Bytes('some data'));

// Use json-stable-stringify for consistent serialization
const stableString = stringify({a: 1, b: 2});

// Generate object hash (same as objectHashBytes32 from claim-and-prove.ts)
function generateObjectHash(obj) {
    const canonical = stringify(obj, { space: 0 });
    return ethers.keccak256(ethers.toUtf8Bytes(canonical));
}

// Example usage with order data
const orders = [{ itemName: "Product 1", price: "₹100" }];
const objectHash = generateObjectHash(orders);
console.log('Object hash:', objectHash);
```

## Testing

You can test the hash generation function:

```bash
node test-hash.js
```

You can test the Semaphore integration:

```bash
node test-semaphore.js
```

You can test the full proof generation:

```bash
node test-proof-generation.js
```

You can test the proof recreation from backend data:

```bash
node test-proof-recreation.js
```

You can test the simplified proof generation:

```bash
node test-simplified-proof.js
```

## Simplified Semaphore Integration

The extension now includes simplified Semaphore-like functionality:

- **Mock member addition**: When users share their order data, they are added to a mock Semaphore group
- **Simplified identity management**: Each user gets a simplified identity based on their user seed
- **Mock blockchain integration**: Uses simplified implementations instead of actual blockchain calls
- **Demonstration purposes**: This is a mock implementation for browser compatibility

**Note**: This is a demonstration implementation. For production use, you would need to integrate with actual Semaphore protocol libraries or use a different zero-knowledge proof system.

### Configuration

The Semaphore configuration is set in the content script:

```javascript
const SEMAPHORE_CONFIG = {
    SEMAPHORE_ADDRESS: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
    GROUP_ID: BigInt(0),
    RPC_URL: 'http://127.0.0.1:8545',
    PRIVATE_KEY: '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'
};
```

### How it Works

1. User selects orders to share
2. Extension generates a unique user ID seed
3. Creates a Semaphore identity from the seed
4. Adds the user to the Semaphore group via blockchain transaction
5. Generates a full Semaphore zero-knowledge proof
6. Sends the proof data to your backend via HTTP request
7. Stores the commitment and proof details in Chrome storage

## Full Proof Generation

The extension now generates complete Semaphore zero-knowledge proofs:

- **Proof Components**: 8 BigInt values for Solidity verification
- **Nullifier Hash**: Prevents double-spending of proofs
- **Merkle Root**: Links to the Semaphore group
- **Object Hash**: Cryptographic hash of the order data
- **Backend Integration**: Sends proof data via HTTP POST to your backend

### Backend Integration

The extension sends proof data to your backend at `http://localhost:3000/api/proof` (configurable):

```javascript
// Proof data structure sent to backend
{
  solidityProof: ["123", "456", ...], // 8 BigInt values
  nullifierHash: "789",
  merkleRoot: "101112",
  objectHash: "0x...",
  orders: [...], // Order data
  commitment: "131415",
  userIdSeed: "user-seed",
  groupId: "0",
  timestamp: "2024-01-01T00:00:00.000Z"
}
```

Use the provided `backend-types.ts` file to match the data structure in your TypeScript backend.

## Proof Recreation

Yes! You can recreate the full `SemaphoreProof` object from the `proofData` sent by the extension:

```typescript
import { recreateSemaphoreProof, verifyRecreatedProof } from './backend-types';

// In your backend endpoint
const semaphoreProof = recreateSemaphoreProof(proofData);

// Verify the recreation is correct
const isCorrect = verifyRecreatedProof(proofData, semaphoreProof);

// Now you can use the recreated SemaphoreProof object for verification
// Example: await verifyProof(semaphoreProof, group, message, scope)
```

The `recreateSemaphoreProof()` function:
- Converts the `solidityProof` array back to `PackedGroth16Proof` format
- Reconstructs the `SemaphoreProof` object with all original components
- Maintains the exact same structure as the original proof

This allows you to use standard Semaphore verification libraries in your backend with the recreated proof object.

## Notes

- The extension uses Webpack to bundle all dependencies
- All Node.js polyfills are handled by Webpack
- The manifest.json points to the bundled files in the `dist/` directory
